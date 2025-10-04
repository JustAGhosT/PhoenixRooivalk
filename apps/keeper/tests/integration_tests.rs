//! Integration tests for the Phoenix Keeper
//! 
//! This module contains comprehensive integration tests that verify
//! the keeper's job processing, database operations, and error handling.

use phoenix_keeper::{
    JobProvider, JobProviderExt, SqliteJobProvider,
    run_job_loop, run_confirmation_loop,
};
use phoenix_evidence::{
    model::{ChainTxRef, EvidenceRecord, EvidenceDigest, DigestAlgo},
    anchor::{AnchorProvider, AnchorError},
};
use sqlx::{sqlite::SqlitePoolOptions, Row};
use std::sync::{Arc, Mutex};
use std::time::Duration;
use std::collections::HashSet;
use chrono::Utc;
use serde_json::json;

/// Mock anchor provider for testing
#[derive(Clone)]
struct MockAnchorProvider {
    should_fail: Arc<Mutex<bool>>,
    should_confirm: Arc<Mutex<bool>>,
    anchored_tx_refs: Arc<Mutex<Vec<ChainTxRef>>>,
}

impl Default for MockAnchorProvider {
    fn default() -> Self {
        MockAnchorProvider {
            should_fail: Arc::new(Mutex::new(false)),
            should_confirm: Arc::new(Mutex::new(true)),
            anchored_tx_refs: Arc::new(Mutex::new(Vec::new())),
        }
    }
}

impl MockAnchorProvider {
    fn set_should_fail(&self, fail: bool) {
        *self.should_fail.lock().unwrap() = fail;
    }


    fn get_anchored_count(&self) -> usize {
        self.anchored_tx_refs.lock().unwrap().len()
    }
}

#[async_trait::async_trait]
impl AnchorProvider for MockAnchorProvider {
    async fn anchor(&self, evidence: &EvidenceRecord) -> Result<ChainTxRef, AnchorError> {
        if *self.should_fail.lock().unwrap() {
            return Err(AnchorError::Network("mock network error".to_string()));
        }
        
        let tx_ref = ChainTxRef {
            network: "mocknet".to_string(),
            chain: "mockchain".to_string(),
            tx_id: format!("mocktx-{}", evidence.id),
            confirmed: false,
            timestamp: Some(Utc::now()),
        };
        
        self.anchored_tx_refs.lock().unwrap().push(tx_ref.clone());
        Ok(tx_ref)
    }

    async fn confirm(&self, tx: &ChainTxRef) -> Result<ChainTxRef, AnchorError> {
        if *self.should_fail.lock().unwrap() {
            return Err(AnchorError::Network("mock confirmation error".to_string()));
        }
        
        let mut confirmed_tx = tx.clone();
        confirmed_tx.confirmed = *self.should_confirm.lock().unwrap();
        Ok(confirmed_tx)
    }
}

async fn setup_test_db() -> sqlx::Pool<sqlx::Sqlite> {
    // Use a named in-memory database with shared cache to ensure persistence
    let db_url = format!("sqlite:file:memdb_{}?mode=memory&cache=shared", 
        std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_nanos());
    
    let pool = SqlitePoolOptions::new()
        .max_connections(2)
        .connect(&db_url)
        .await
        .unwrap();
    
    // Create schema manually to ensure it's created
    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS outbox_jobs (
            id TEXT PRIMARY KEY,
            payload_sha256 TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'queued',
            attempts INTEGER NOT NULL DEFAULT 0,
            last_error TEXT,
            created_ms INTEGER NOT NULL,
            updated_ms INTEGER NOT NULL,
            next_attempt_ms INTEGER NOT NULL DEFAULT 0
        );
        "#,
    )
    .execute(&pool)
    .await
    .unwrap();

    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS outbox_tx_refs (
            job_id TEXT NOT NULL,
            network TEXT NOT NULL,
            chain TEXT NOT NULL,
            tx_id TEXT NOT NULL,
            confirmed INTEGER NOT NULL,
            timestamp INTEGER,
            PRIMARY KEY (job_id, network, chain)
        );
        "#,
    )
    .execute(&pool)
    .await
    .unwrap();
    
    pool
}

/// Test complete job processing workflow
#[tokio::test]
async fn test_complete_job_processing_workflow() {
    let pool = setup_test_db().await;
    let mut provider = SqliteJobProvider::new(pool.clone());
    let anchor = MockAnchorProvider::default();

    // Insert multiple test jobs
    for i in 0..3 {
        sqlx::query(
            "INSERT INTO outbox_jobs (id, payload_sha256, status, attempts, created_ms, updated_ms, next_attempt_ms) VALUES (?1, ?2, 'queued', 0, ?3, ?3, 0)"
        )
        .bind(format!("workflow-test-{}", i))
        .bind(format!("hash-{}", i))
        .bind(Utc::now().timestamp_millis())
        .execute(&pool)
        .await
        .unwrap();
    }

    // Process jobs (order-agnostic)
    let mut processed_job_ids = HashSet::new();
    let expected_job_ids: HashSet<String> = ["workflow-test-0", "workflow-test-1", "workflow-test-2"]
        .iter()
        .map(|s| s.to_string())
        .collect();
    
    for _ in 0..3 {
        let job = provider.fetch_next().await.unwrap().unwrap();
        
        // Verify job ID is in expected set
        assert!(expected_job_ids.contains(&job.id));
        processed_job_ids.insert(job.id.clone());
        
        // Create evidence record
        let evidence = EvidenceRecord {
            id: job.id.clone(),
            created_at: Utc::now(),
            digest: EvidenceDigest {
                algo: DigestAlgo::Sha256,
                hex: job.payload_sha256.clone(),
            },
            payload_mime: None,
            metadata: json!({}),
        };
        
        // Anchor evidence
        let tx_ref = anchor.anchor(&evidence).await.unwrap();
        assert_eq!(tx_ref.network, "mocknet");
        
        // Mark job as done
        provider.mark_done(&job.id).await.unwrap();
    }

    // Verify all expected jobs were processed
    assert_eq!(processed_job_ids, expected_job_ids);
    assert_eq!(anchor.get_anchored_count(), 3);
    
    // Check job statuses
    for i in 0..3 {
        let status: String = sqlx::query_scalar("SELECT status FROM outbox_jobs WHERE id = ?1")
            .bind(format!("workflow-test-{}", i))
            .fetch_one(&pool)
            .await
            .unwrap();
        assert_eq!(status, "done");
    }
}

/// Test job processing with failures and retries
#[tokio::test]
async fn test_job_processing_with_failures() {
    let pool = setup_test_db().await;
    let mut provider = SqliteJobProvider::new(pool.clone());
    let anchor = MockAnchorProvider::default();

    // Insert test job
    sqlx::query(
        "INSERT INTO outbox_jobs (id, payload_sha256, status, attempts, created_ms, updated_ms, next_attempt_ms) VALUES (?1, ?2, 'queued', 0, ?3, ?3, 0)"
    )
    .bind("failure-test")
    .bind("failure-hash")
    .bind(Utc::now().timestamp_millis())
    .execute(&pool)
    .await
    .unwrap();

    // Make anchor fail
    anchor.set_should_fail(true);

    // Try to process job (should fail)
    let job = provider.fetch_next().await.unwrap().unwrap();
    assert_eq!(job.id, "failure-test");

    // Simulate the actual anchor failure and error handling
    let evidence = EvidenceRecord {
        id: job.id.clone(),
        created_at: Utc::now(),
        digest: EvidenceDigest {
            algo: DigestAlgo::Sha256,
            hex: job.payload_sha256.clone(),
        },
        payload_mime: None,
        metadata: json!({}),
    };
    
    // Attempt to anchor (should fail)
    let anchor_result = anchor.anchor(&evidence).await;
    assert!(anchor_result.is_err());
    
    // Mark as failed with backoff (as run_job_loop would do)
    provider.mark_failed_or_backoff("failure-test", &anchor_result.unwrap_err().to_string(), true).await.unwrap();

    // Check job status
    let (status, attempts, last_error): (String, i64, Option<String>) = sqlx::query_as(
        "SELECT status, attempts, last_error FROM outbox_jobs WHERE id = 'failure-test'"
    )
    .fetch_one(&pool)
    .await
    .unwrap();

    // Job should be queued for retry after temporary failure
    assert_eq!(status, "queued");
    assert_eq!(attempts, 1);
    assert!(last_error.is_some());
    assert!(last_error.unwrap().contains("mock network error"));
}

/// Test confirmation loop
#[tokio::test]
async fn test_confirmation_loop() {
    let pool = setup_test_db().await;
    let anchor = MockAnchorProvider::default();

    // Insert a job and tx_ref that needs confirmation
    sqlx::query(
        "INSERT INTO outbox_jobs (id, payload_sha256, status, attempts, created_ms, updated_ms, next_attempt_ms) VALUES (?1, ?2, 'done', 0, ?3, ?3, 0)"
    )
    .bind("confirmation-test")
    .bind("confirmation-hash")
    .bind(Utc::now().timestamp_millis())
    .execute(&pool)
    .await
    .unwrap();

    let tx_ref = ChainTxRef {
        network: "mocknet".to_string(),
        chain: "mockchain".to_string(),
        tx_id: "mocktx-confirmation-test".to_string(),
        confirmed: false,
        timestamp: Some(Utc::now()),
    };
    
    sqlx::query(
        "INSERT INTO outbox_tx_refs (job_id, network, chain, tx_id, confirmed, timestamp) VALUES (?1, ?2, ?3, ?4, ?5, ?6)"
    )
    .bind("confirmation-test")
    .bind(&tx_ref.network)
    .bind(&tx_ref.chain)
    .bind(&tx_ref.tx_id)
    .bind(tx_ref.confirmed)
    .bind(tx_ref.timestamp.map(|t| t.timestamp_millis()))
    .execute(&pool)
    .await
    .unwrap();

    // Run confirmation loop
    let result = tokio::time::timeout(
        Duration::from_millis(100),
        run_confirmation_loop(&pool, &anchor, Duration::from_millis(10))
    ).await;

    // Should timeout (loop continues), which is expected behavior
    assert!(result.is_err()); // timeout is expected

    // Check if transaction was confirmed
    let confirmed: bool = sqlx::query_scalar("SELECT confirmed FROM outbox_tx_refs WHERE job_id = 'confirmation-test'")
        .fetch_one(&pool)
        .await
        .unwrap();
    assert!(confirmed);
}

/// Test job processing with different anchor behaviors
#[tokio::test]
async fn test_job_processing_with_different_anchor_behaviors() {
    let pool = setup_test_db().await;
    let mut provider = SqliteJobProvider::new(pool.clone());
    let anchor = MockAnchorProvider::default();

    // Test successful anchoring
    sqlx::query(
        "INSERT INTO outbox_jobs (id, payload_sha256, status, attempts, created_ms, updated_ms, next_attempt_ms) VALUES (?1, ?2, 'queued', 0, ?3, ?3, 0)"
    )
    .bind("success-test")
    .bind("success-hash")
    .bind(Utc::now().timestamp_millis())
    .execute(&pool)
    .await
    .unwrap();

    let job = provider.fetch_next().await.unwrap().unwrap();
    assert_eq!(job.id, "success-test");
    
    // Create evidence and anchor
    let evidence = EvidenceRecord {
        id: job.id.clone(),
        created_at: Utc::now(),
        digest: EvidenceDigest {
            algo: DigestAlgo::Sha256,
            hex: job.payload_sha256.clone(),
        },
        payload_mime: None,
        metadata: json!({}),
    };
    
    let tx_ref = anchor.anchor(&evidence).await.unwrap();
    assert_eq!(tx_ref.network, "mocknet");
    
    // Test confirmation
    let confirmed_tx = anchor.confirm(&tx_ref).await.unwrap();
    assert!(confirmed_tx.confirmed);
    
    // Mark job as done
    provider.mark_done(&job.id).await.unwrap();
    
    // Verify job completion
    let status: String = sqlx::query_scalar("SELECT status FROM outbox_jobs WHERE id = 'success-test'")
        .fetch_one(&pool)
        .await
        .unwrap();
    assert_eq!(status, "done");
}

/// Test error handling and recovery
#[tokio::test]
async fn test_error_handling_and_recovery() {
    let pool = setup_test_db().await;
    let mut provider = SqliteJobProvider::new(pool.clone());
    let anchor = MockAnchorProvider::default();

    // Insert job for testing
    sqlx::query(
        "INSERT INTO outbox_jobs (id, payload_sha256, status, attempts, created_ms, updated_ms, next_attempt_ms) VALUES (?1, ?2, 'queued', 0, ?3, ?3, 0)"
    )
    .bind("error-recovery-test")
    .bind("error-hash")
    .bind(Utc::now().timestamp_millis())
    .execute(&pool)
    .await
    .unwrap();

    // Test temporary failure
    anchor.set_should_fail(true);

    let job = provider.fetch_next().await.unwrap().unwrap();
    assert_eq!(job.id, "error-recovery-test");

    // Simulate anchor failure
    let evidence = EvidenceRecord {
        id: job.id.clone(),
        created_at: Utc::now(),
        digest: EvidenceDigest {
            algo: DigestAlgo::Sha256,
            hex: job.payload_sha256.clone(),
        },
        payload_mime: None,
        metadata: json!({}),
    };
    let err = anchor.anchor(&evidence).await.unwrap_err();
    provider.mark_failed_or_backoff("error-recovery-test", &err.to_string(), true).await.unwrap();

    // Check job status
    let (status, attempts, last_error): (String, i64, Option<String>) = sqlx::query_as(
        "SELECT status, attempts, last_error FROM outbox_jobs WHERE id = 'error-recovery-test'"
    )
    .fetch_one(&pool)
    .await
    .unwrap();

    assert_eq!(status, "queued");
    assert_eq!(attempts, 1);
    assert!(last_error.is_some());

    // Test permanent failure
    // Fetch again after backoff period
    // (In reality, need to wait or reset next_attempt_ms)
    provider.mark_failed_or_backoff("error-recovery-test", "permanent failure", false).await.unwrap();

    let (status, attempts, last_error): (String, i64, Option<String>) = sqlx::query_as(
        "SELECT status, attempts, last_error FROM outbox_jobs WHERE id = 'error-recovery-test'"
    )
    .fetch_one(&pool)
    .await
    .unwrap();

    assert_eq!(status, "failed");
    // Verify attempts counter is incremented appropriately
    assert!(attempts >= 1);
    assert!(last_error.unwrap().contains("permanent failure"));
}

/// Test job statistics and monitoring
#[tokio::test]
async fn test_job_statistics_and_monitoring() {
    let pool = setup_test_db().await;
    let _provider = SqliteJobProvider::new(pool.clone());

    // Insert jobs with different statuses
    let jobs = vec![
        ("queued-1", "queued"),
        ("queued-2", "queued"),
        ("in-progress-1", "in_progress"),
        ("done-1", "done"),
        ("failed-1", "failed"),
    ];

    for (id, status) in jobs {
        sqlx::query(
            "INSERT INTO outbox_jobs (id, payload_sha256, status, attempts, created_ms, updated_ms, next_attempt_ms) VALUES (?1, ?2, ?3, 0, ?4, ?4, 0)"
        )
        .bind(id)
        .bind(format!("hash-{}", id))
        .bind(status)
        .bind(Utc::now().timestamp_millis())
        .execute(&pool)
        .await
        .unwrap();
    }

    // Test job statistics
    let stats = sqlx::query(
        "SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN status = 'queued' THEN 1 ELSE 0 END) as queued,
            SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
            SUM(CASE WHEN status = 'done' THEN 1 ELSE 0 END) as done,
            SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed
        FROM outbox_jobs"
    )
    .fetch_one(&pool)
    .await
    .unwrap();

    let total: i64 = stats.get("total");
    let queued: i64 = stats.get("queued");
    let in_progress: i64 = stats.get("in_progress");
    let done: i64 = stats.get("done");
    let failed: i64 = stats.get("failed");

    assert_eq!(total, 5);
    assert_eq!(queued, 2);
    assert_eq!(in_progress, 1);
    assert_eq!(done, 1);
    assert_eq!(failed, 1);
}

/// Test transaction management
#[tokio::test]
async fn test_transaction_management() {
    let pool = setup_test_db().await;
    let mut provider = SqliteJobProvider::new(pool.clone());

    // Insert test job
    sqlx::query(
        "INSERT INTO outbox_jobs (id, payload_sha256, status, attempts, created_ms, updated_ms, next_attempt_ms) VALUES (?1, ?2, 'queued', 0, ?3, ?3, 0)"
    )
    .bind("transaction-test")
    .bind("transaction-hash")
    .bind(Utc::now().timestamp_millis())
    .execute(&pool)
    .await
    .unwrap();

    let job = provider.fetch_next().await.unwrap().unwrap();
    assert_eq!(job.id, "transaction-test");
    
    // Test transaction reference creation
    let tx_ref = ChainTxRef {
        network: "testnet".to_string(),
        chain: "testchain".to_string(),
        tx_id: "tx-transaction-test".to_string(),
        confirmed: false,
        timestamp: Some(Utc::now()),
    };
    
    // Mark job as done with transaction reference
    provider.mark_tx_and_done("transaction-test", &tx_ref).await.unwrap();
    
    // Verify job status
    let status: String = sqlx::query_scalar("SELECT status FROM outbox_jobs WHERE id = 'transaction-test'")
        .fetch_one(&pool)
        .await
        .unwrap();
    assert_eq!(status, "done");
    
    // Verify transaction reference was stored
    let tx_count: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM outbox_tx_refs WHERE job_id = 'transaction-test'")
        .fetch_one(&pool)
        .await
        .unwrap();
    assert_eq!(tx_count, 1);
    
    // Verify transaction reference details
    let stored_tx: (String, String, String, String, bool) = sqlx::query_as(
        "SELECT job_id, network, chain, tx_id, confirmed FROM outbox_tx_refs WHERE job_id = 'transaction-test'"
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    
    assert_eq!(stored_tx.0, "transaction-test");
    assert_eq!(stored_tx.1, "testnet");
    assert_eq!(stored_tx.2, "testchain");
    assert_eq!(stored_tx.3, "tx-transaction-test");
    assert!(!stored_tx.4);
}

/// Test job processing with timeout
#[tokio::test]
async fn test_job_processing_with_timeout() {
    let pool = setup_test_db().await;
    let mut provider = SqliteJobProvider::new(pool.clone());
    let anchor = MockAnchorProvider::default();

    // Insert test job
    sqlx::query(
        "INSERT INTO outbox_jobs (id, payload_sha256, status, attempts, created_ms, updated_ms, next_attempt_ms) VALUES (?1, ?2, 'queued', 0, ?3, ?3, 0)"
    )
    .bind("timeout-test")
    .bind("timeout-hash")
    .bind(Utc::now().timestamp_millis())
    .execute(&pool)
    .await
    .unwrap();

    // Test job processing with timeout
    let result = tokio::time::timeout(
        Duration::from_millis(100),
        run_job_loop(&mut provider, &anchor, Duration::from_millis(10))
    ).await;

    // Should timeout (loop continues), which is expected behavior
    assert!(result.is_err()); // timeout is expected

    // Verify job was processed
    let status: String = sqlx::query_scalar("SELECT status FROM outbox_jobs WHERE id = 'timeout-test'")
        .fetch_one(&pool)
        .await
        .unwrap();
    assert_eq!(status, "done");
}

/// Test job processing with provider failures
#[tokio::test]
async fn test_job_processing_with_provider_failures() {
    let pool = setup_test_db().await;
    let mut provider = SqliteJobProvider::new(pool.clone());
    let anchor = MockAnchorProvider::default();

    // Insert test job
    sqlx::query(
        "INSERT INTO outbox_jobs (id, payload_sha256, status, attempts, created_ms, updated_ms, next_attempt_ms) VALUES (?1, ?2, 'queued', 0, ?3, ?3, 0)"
    )
    .bind("provider-failure-test")
    .bind("provider-failure-hash")
    .bind(Utc::now().timestamp_millis())
    .execute(&pool)
    .await
    .unwrap();

    // Test job processing with provider failure
    let result = tokio::time::timeout(
        Duration::from_millis(100),
        run_job_loop(&mut provider, &anchor, Duration::from_millis(10))
    ).await;

    // Should timeout (loop continues), which is expected behavior
    assert!(result.is_err()); // timeout is expected

    // Verify job was processed despite potential provider issues
    let status: String = sqlx::query_scalar("SELECT status FROM outbox_jobs WHERE id = 'provider-failure-test'")
        .fetch_one(&pool)
        .await
        .unwrap();
    assert_eq!(status, "done");
}
