use phoenix_keeper::{ensure_schema, run_job_loop, SqliteJobProvider, JobProvider, JobProviderExt};
use phoenix_evidence::anchor::{AnchorProvider, AnchorError};
use phoenix_evidence::model::{ChainTxRef, EvidenceRecord};
use anchor_etherlink::EtherlinkProviderStub;
use async_trait::async_trait;
use sqlx::{sqlite::SqlitePoolOptions, Pool, Sqlite};
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Arc;
use std::time::Duration;
use tempfile::NamedTempFile;
use tokio::time::timeout;

#[tokio::test]
async fn test_db_evidence_success_flow() {
    let temp_db = NamedTempFile::new().unwrap();
    let db_path = temp_db.path().to_str().unwrap();
    let db_url = format!("sqlite://{}", db_path);
    
    let pool = SqlitePoolOptions::new()
        .max_connections(5)
        .connect(&db_url)
        .await
        .unwrap();
    
    ensure_schema(&pool).await.unwrap();
    
    // Insert a test job
    let job_id = "test-job-123";
    let digest_hex = "deadbeefcafebabe1234567890abcdef1234567890abcdef1234567890abcdef";
    let now_ms = chrono::Utc::now().timestamp_millis();
    
    sqlx::query(
        "INSERT INTO outbox_jobs (id, payload_sha256, status, attempts, created_ms, updated_ms, next_attempt_ms) VALUES (?1, ?2, 'queued', 0, ?3, ?3, 0)"
    )
    .bind(job_id)
    .bind(digest_hex)
    .bind(now_ms)
    .execute(&pool)
    .await
    .unwrap();
    
    // Start keeper for a short time
    let keeper_pool = pool.clone();
    let keeper_handle = tokio::spawn(async move {
        let mut jp = SqliteJobProvider::new(keeper_pool);
        let anchor = EtherlinkProviderStub;
        
        // Run for a few iterations
        for _ in 0..10 {
            match jp.fetch_next().await {
                Ok(Some(job)) => {
                    let ev = phoenix_evidence::model::EvidenceRecord {
                        id: job.id.clone(),
                        created_at: chrono::Utc::now(),
                        digest: phoenix_evidence::model::EvidenceDigest {
                            algo: phoenix_evidence::model::DigestAlgo::Sha256,
                            hex: job.payload_sha256.clone(),
                        },
                        payload_mime: None,
                        metadata: serde_json::json!({}),
                    };
                    
                    match anchor.anchor(&ev).await {
                        Ok(tx_ref) => {
                            let _ = jp.mark_tx_and_done(&job.id, &tx_ref).await;
                            break; // Job done, exit loop
                        }
                        Err(e) => {
                            let temporary = matches!(e, AnchorError::Network(_) | AnchorError::Provider(_));
                            let _ = jp.mark_failed_or_backoff(&job.id, &e.to_string(), temporary).await;
                        }
                    }
                }
                Ok(None) => {
                    tokio::time::sleep(Duration::from_millis(50)).await;
                }
                Err(_) => {
                    tokio::time::sleep(Duration::from_millis(50)).await;
                }
            }
        }
    });
    
    // Wait for keeper to process
    let _ = timeout(Duration::from_secs(5), keeper_handle).await;
    
    // Verify job status
    let job_status = sqlx::query("SELECT status FROM outbox_jobs WHERE id = ?1")
        .bind(job_id)
        .fetch_one(&pool)
        .await
        .unwrap();
    
    let status: String = job_status.get("status");
    assert_eq!(status, "done");
    
    // Verify tx ref exists
    let tx_ref_count = sqlx::query("SELECT COUNT(*) as count FROM outbox_tx_refs WHERE job_id = ?1")
        .bind(job_id)
        .fetch_one(&pool)
        .await
        .unwrap();
    
    let count: i64 = tx_ref_count.get("count");
    assert_eq!(count, 1);
}

// Test provider that fails once then succeeds
struct FailOnceProvider {
    has_failed: Arc<AtomicBool>,
}

impl FailOnceProvider {
    fn new() -> Self {
        Self {
            has_failed: Arc::new(AtomicBool::new(false)),
        }
    }
}

#[async_trait]
impl AnchorProvider for FailOnceProvider {
    async fn anchor(&self, evidence: &EvidenceRecord) -> Result<ChainTxRef, AnchorError> {
        if !self.has_failed.load(Ordering::SeqCst) {
            self.has_failed.store(true, Ordering::SeqCst);
            return Err(AnchorError::Network("Simulated network failure".to_string()));
        }
        
        // Success on second attempt
        Ok(ChainTxRef {
            network: "test".to_string(),
            chain: "testnet".to_string(),
            tx_id: format!("retry-success:{}", &evidence.digest.hex),
            confirmed: false,
            timestamp: Some(chrono::Utc::now()),
        })
    }
    
    async fn confirm(&self, tx: &ChainTxRef) -> Result<ChainTxRef, AnchorError> {
        let mut confirmed_tx = tx.clone();
        confirmed_tx.confirmed = true;
        Ok(confirmed_tx)
    }
}

#[tokio::test]
async fn test_db_evidence_retry_flow() {
    let temp_db = NamedTempFile::new().unwrap();
    let db_path = temp_db.path().to_str().unwrap();
    let db_url = format!("sqlite://{}", db_path);
    
    let pool = SqlitePoolOptions::new()
        .max_connections(5)
        .connect(&db_url)
        .await
        .unwrap();
    
    ensure_schema(&pool).await.unwrap();
    
    // Insert a test job
    let job_id = "test-retry-job-456";
    let digest_hex = "cafebabe1234567890abcdef1234567890abcdef1234567890abcdefdeadbeef";
    let now_ms = chrono::Utc::now().timestamp_millis();
    
    sqlx::query(
        "INSERT INTO outbox_jobs (id, payload_sha256, status, attempts, created_ms, updated_ms, next_attempt_ms) VALUES (?1, ?2, 'queued', 0, ?3, ?3, 0)"
    )
    .bind(job_id)
    .bind(digest_hex)
    .bind(now_ms)
    .execute(&pool)
    .await
    .unwrap();
    
    // Start keeper with failing provider
    let keeper_pool = pool.clone();
    let keeper_handle = tokio::spawn(async move {
        let mut jp = SqliteJobProvider::new(keeper_pool);
        let anchor = FailOnceProvider::new();
        
        // Run for multiple iterations to handle retry
        for _ in 0..20 {
            match jp.fetch_next().await {
                Ok(Some(job)) => {
                    let ev = phoenix_evidence::model::EvidenceRecord {
                        id: job.id.clone(),
                        created_at: chrono::Utc::now(),
                        digest: phoenix_evidence::model::EvidenceDigest {
                            algo: phoenix_evidence::model::DigestAlgo::Sha256,
                            hex: job.payload_sha256.clone(),
                        },
                        payload_mime: None,
                        metadata: serde_json::json!({}),
                    };
                    
                    match anchor.anchor(&ev).await {
                        Ok(tx_ref) => {
                            let _ = jp.mark_tx_and_done(&job.id, &tx_ref).await;
                            break; // Job done, exit loop
                        }
                        Err(e) => {
                            let temporary = matches!(e, AnchorError::Network(_) | AnchorError::Provider(_));
                            let _ = jp.mark_failed_or_backoff(&job.id, &e.to_string(), temporary).await;
                        }
                    }
                }
                Ok(None) => {
                    tokio::time::sleep(Duration::from_millis(50)).await;
                }
                Err(_) => {
                    tokio::time::sleep(Duration::from_millis(50)).await;
                }
            }
        }
    });
    
    // Wait for keeper to process (longer timeout for retry)
    let _ = timeout(Duration::from_secs(10), keeper_handle).await;
    
    // Verify job eventually succeeded
    let job_status = sqlx::query("SELECT status, attempts FROM outbox_jobs WHERE id = ?1")
        .bind(job_id)
        .fetch_one(&pool)
        .await
        .unwrap();
    
    let status: String = job_status.get("status");
    let attempts: i64 = job_status.get("attempts");
    
    assert_eq!(status, "done");
    assert!(attempts >= 2, "Should have at least 2 attempts (fail then succeed)");
    
    // Verify tx ref exists
    let tx_ref_count = sqlx::query("SELECT COUNT(*) as count FROM outbox_tx_refs WHERE job_id = ?1")
        .bind(job_id)
        .fetch_one(&pool)
        .await
        .unwrap();
    
    let count: i64 = tx_ref_count.get("count");
    assert_eq!(count, 1);
}
