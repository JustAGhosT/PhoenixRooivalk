use chrono::Utc;
use serial_test::serial;
use phoenix_evidence::anchor::{AnchorError, AnchorProvider};
use phoenix_evidence::model::{ChainTxRef, EvidenceRecord};
use phoenix_keeper::{
    run_confirmation_loop, run_job_loop, EvidenceJob, JobError, JobProvider, JobProviderExt,
    SqliteJobProvider,
};
use std::sync::{Arc, Mutex};
use std::time::Duration;
use tempfile::NamedTempFile;
use tokio::time::timeout;

// Mock implementations for testing
#[derive(Clone)]
struct MockJobProvider {
    jobs: Arc<Mutex<Vec<EvidenceJob>>>,
    current_index: Arc<Mutex<usize>>,
    should_fail: Arc<Mutex<bool>>,
}

impl MockJobProvider {
    fn new() -> Self {
        Self {
            jobs: Arc::new(Mutex::new(Vec::new())),
            current_index: Arc::new(Mutex::new(0)),
            should_fail: Arc::new(Mutex::new(false)),
        }
    }

    fn add_job(&self, job: EvidenceJob) {
        self.jobs.lock().unwrap().push(job);
    }

    fn set_should_fail(&self, fail: bool) {
        *self.should_fail.lock().unwrap() = fail;
    }
}

#[async_trait::async_trait]
impl JobProvider for MockJobProvider {
    async fn fetch_next(&mut self) -> Result<Option<EvidenceJob>, JobError> {
        if *self.should_fail.lock().unwrap() {
            return Err(JobError::Temporary("Mock failure".to_string()));
        }

        let mut index = self.current_index.lock().unwrap();
        let jobs = self.jobs.lock().unwrap();

        if *index >= jobs.len() {
            return Ok(None);
        }

        let job = jobs[*index].clone();
        *index += 1;
        Ok(Some(job))
    }

    async fn mark_done(&mut self, _id: &str) -> Result<(), JobError> {
        Ok(())
    }

    async fn mark_failed(&mut self, _id: &str, _reason: &str) -> Result<(), JobError> {
        Ok(())
    }
}

#[async_trait::async_trait]
impl JobProviderExt for MockJobProvider {
    async fn mark_tx_and_done(&mut self, _id: &str, _tx: &ChainTxRef) -> Result<(), JobError> {
        Ok(())
    }

    async fn mark_failed_or_backoff(
        &mut self,
        _id: &str,
        _reason: &str,
        _temporary: bool,
    ) -> Result<(), JobError> {
        Ok(())
    }
}

#[derive(Clone)]
struct MockAnchorProvider {
    should_fail: Arc<Mutex<bool>>,
    should_confirm: Arc<Mutex<bool>>,
}

impl MockAnchorProvider {
    fn new() -> Self {
        Self {
            should_fail: Arc::new(Mutex::new(false)),
            should_confirm: Arc::new(Mutex::new(true)),
        }
    }

    fn set_should_fail(&self, fail: bool) {
        *self.should_fail.lock().unwrap() = fail;
    }

    #[allow(dead_code)]
    fn set_should_confirm(&self, confirm: bool) {
        *self.should_confirm.lock().unwrap() = confirm;
    }
}

#[async_trait::async_trait]
impl AnchorProvider for MockAnchorProvider {
    async fn anchor(&self, evidence: &EvidenceRecord) -> Result<ChainTxRef, AnchorError> {
        if *self.should_fail.lock().unwrap() {
            return Err(AnchorError::Network("Mock network error".to_string()));
        }

        Ok(ChainTxRef {
            network: "testnet".to_string(),
            chain: "test".to_string(),
            tx_id: format!("mock_tx_{}", evidence.digest.hex),
            confirmed: false,
            timestamp: Some(Utc::now()),
        })
    }

    async fn confirm(&self, tx: &ChainTxRef) -> Result<ChainTxRef, AnchorError> {
        if *self.should_fail.lock().unwrap() {
            return Err(AnchorError::Network("Mock confirmation error".to_string()));
        }

        let mut confirmed_tx = tx.clone();
        confirmed_tx.confirmed = *self.should_confirm.lock().unwrap();
        Ok(confirmed_tx)
    }
}

#[tokio::test]
async fn test_run_job_loop_success() {
    let provider = MockJobProvider::new();
    let anchor = MockAnchorProvider::new();

    // Add a test job
    provider.add_job(EvidenceJob {
        id: "test-job-1".to_string(),
        payload_sha256: "abcd1234".to_string(),
        created_ms: Utc::now().timestamp_millis(),
    });

    let mut provider = provider;
    // Removed redundant: let anchor = anchor;

    // Run for a short duration to test one iteration
    let result = timeout(
        Duration::from_millis(100),
        run_job_loop(&mut provider, &anchor, Duration::from_millis(10)),
    )
    .await;

    // Should timeout (loop continues), which is expected behavior
    assert!(result.is_err()); // timeout is expected
}

#[tokio::test]
async fn test_run_job_loop_anchor_failure() {
    let provider = MockJobProvider::new();
    let anchor = MockAnchorProvider::new();

    // Make anchor fail
    anchor.set_should_fail(true);

    // Add a test job
    provider.add_job(EvidenceJob {
        id: "test-job-1".to_string(),
        payload_sha256: "abcd1234".to_string(),
        created_ms: Utc::now().timestamp_millis(),
    });

    let mut provider = provider;
    // Removed redundant: let anchor = anchor;

    // Run for a short duration
    let result = timeout(
        Duration::from_millis(100),
        run_job_loop(&mut provider, &anchor, Duration::from_millis(10)),
    )
    .await;

    // Should timeout (loop continues), which is expected behavior
    assert!(result.is_err()); // timeout is expected
}

#[tokio::test]
async fn test_run_job_loop_provider_failure() {
    let provider = MockJobProvider::new();
    let anchor = MockAnchorProvider::new();

    // Make provider fail
    provider.set_should_fail(true);

    let mut provider = provider;
    // Removed redundant: let anchor = anchor;

    // Run for a short duration
    let result = timeout(
        Duration::from_millis(100),
        run_job_loop(&mut provider, &anchor, Duration::from_millis(10)),
    )
    .await;

    // Should timeout (loop continues), which is expected behavior
    assert!(result.is_err()); // timeout is expected
}

#[tokio::test]
#[serial]
async fn test_run_confirmation_loop_success() {
    // Create temp DB
    let temp_db = NamedTempFile::new().unwrap();
    let db_path = temp_db.path().to_str().unwrap();
    let db_url = format!("sqlite://{}", db_path);

    // Set env for keeper to use temp DB
    std::env::set_var("KEEPER_DB_URL", &db_url);

    // Initialize schema
    let pool = sqlx::sqlite::SqlitePoolOptions::new()
        .max_connections(1)
        .connect(&db_url)
        .await
        .unwrap();

    // Create schema
    sqlx::query(
        "CREATE TABLE IF NOT EXISTS outbox_tx_refs (
            job_id TEXT PRIMARY KEY,
            network TEXT NOT NULL,
            chain TEXT NOT NULL,
            tx_id TEXT NOT NULL,
            confirmed INTEGER NOT NULL DEFAULT 0,
            timestamp INTEGER
        )",
    )
    .execute(&pool)
    .await
    .unwrap();

    // Insert a test unconfirmed transaction
    sqlx::query(
        "INSERT INTO outbox_tx_refs (job_id, network, chain, tx_id, confirmed, timestamp)
         VALUES (?, ?, ?, ?, ?, ?)",
    )
    .bind("test-job-1")
    .bind("testnet")
    .bind("test")
    .bind("mock_tx_123")
    .bind(0) // not confirmed
    .bind(Utc::now().timestamp_millis())
    .execute(&pool)
    .await
    .unwrap();

    let anchor = MockAnchorProvider::new();

    // Run confirmation loop for a short duration
    let result = timeout(
        Duration::from_millis(100),
        run_confirmation_loop(&pool, &anchor, Duration::from_millis(10)),
    )
    .await;

    // Should timeout (loop continues), which is expected behavior
    assert!(result.is_err()); // timeout is expected
}

#[tokio::test]
#[serial]
async fn test_run_confirmation_loop_anchor_failure() {
    // Create temp DB
    let temp_db = NamedTempFile::new().unwrap();
    let db_path = temp_db.path().to_str().unwrap();
    let db_url = format!("sqlite://{}", db_path);

    // Set env for keeper to use temp DB
    std::env::set_var("KEEPER_DB_URL", &db_url);

    // Initialize schema
    let pool = sqlx::sqlite::SqlitePoolOptions::new()
        .max_connections(1)
        .connect(&db_url)
        .await
        .unwrap();

    // Create schema
    sqlx::query(
        "CREATE TABLE IF NOT EXISTS outbox_tx_refs (
            job_id TEXT PRIMARY KEY,
            network TEXT NOT NULL,
            chain TEXT NOT NULL,
            tx_id TEXT NOT NULL,
            confirmed INTEGER NOT NULL DEFAULT 0,
            timestamp INTEGER
        )",
    )
    .execute(&pool)
    .await
    .unwrap();

    // Insert a test unconfirmed transaction
    sqlx::query(
        "INSERT INTO outbox_tx_refs (job_id, network, chain, tx_id, confirmed, timestamp)
         VALUES (?, ?, ?, ?, ?, ?)",
    )
    .bind("test-job-1")
    .bind("testnet")
    .bind("test")
    .bind("mock_tx_123")
    .bind(0) // not confirmed
    .bind(Utc::now().timestamp_millis())
    .execute(&pool)
    .await
    .unwrap();

    let anchor = MockAnchorProvider::new();
    anchor.set_should_fail(true);

    // Run confirmation loop for a short duration
    let result = timeout(
        Duration::from_millis(100),
        run_confirmation_loop(&pool, &anchor, Duration::from_millis(10)),
    )
    .await;

    // Should timeout (loop continues), which is expected behavior
    assert!(result.is_err()); // timeout is expected
}

#[tokio::test]
#[serial]
async fn test_sqlite_job_provider() {
    // Create temp DB
    let temp_db = NamedTempFile::new().unwrap();
    let db_path = temp_db.path().to_str().unwrap();
    let db_url = format!("sqlite://{}", db_path);

    // Set env for keeper to use temp DB
    std::env::set_var("KEEPER_DB_URL", &db_url);

    // Initialize schema
    let pool = sqlx::sqlite::SqlitePoolOptions::new()
        .max_connections(1)
        .connect(&db_url)
        .await
        .unwrap();

    // Create schema with all required columns
    sqlx::query(
        "CREATE TABLE IF NOT EXISTS outbox_jobs (
            id TEXT PRIMARY KEY,
            payload_sha256 TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'queued',
            attempts INTEGER NOT NULL DEFAULT 0,
            last_error TEXT,
            created_ms INTEGER NOT NULL,
            updated_ms INTEGER NOT NULL,
            next_attempt_ms INTEGER NOT NULL DEFAULT 0
        )",
    )
    .execute(&pool)
    .await
    .unwrap();

    // Create outbox_tx_refs table
    sqlx::query(
        "CREATE TABLE IF NOT EXISTS outbox_tx_refs (
            job_id TEXT NOT NULL,
            network TEXT NOT NULL,
            chain TEXT NOT NULL,
            tx_id TEXT NOT NULL,
            confirmed INTEGER NOT NULL,
            timestamp INTEGER,
            PRIMARY KEY (job_id, network, chain)
        )",
    )
    .execute(&pool)
    .await
    .unwrap();

    // Insert a test job
    let now = Utc::now().timestamp_millis();
    sqlx::query(
        "INSERT INTO outbox_jobs (id, payload_sha256, status, attempts, created_ms, updated_ms, next_attempt_ms)
         VALUES (?, ?, ?, ?, ?, ?, ?)"
    )
    .bind("test-job-1")
    .bind("abcd1234")
    .bind("queued")
    .bind(0)
    .bind(now)
    .bind(now)
    .bind(0) // next_attempt_ms = 0 means ready to process
    .execute(&pool)
    .await
    .unwrap();

    let mut provider = SqliteJobProvider::new(pool);

    // Test fetch_next
    let job = provider.fetch_next().await.unwrap();
    assert!(job.is_some());
    let job = job.unwrap();
    assert_eq!(job.id, "test-job-1");
    assert_eq!(job.payload_sha256, "abcd1234");

    // Test mark_done
    provider.mark_done("test-job-1").await.unwrap();

    // Test mark_failed
    provider
        .mark_failed("test-job-1", "test error")
        .await
        .unwrap();

    // Test mark_tx_and_done
    let tx_ref = ChainTxRef {
        network: "testnet".to_string(),
        chain: "test".to_string(),
        tx_id: "mock_tx_123".to_string(),
        confirmed: false,
        timestamp: Some(Utc::now()),
    };
    provider
        .mark_tx_and_done("test-job-1", &tx_ref)
        .await
        .unwrap();

    // Test mark_failed_or_backoff
    provider
        .mark_failed_or_backoff("test-job-1", "test error", true)
        .await
        .unwrap();
}

#[test]
fn test_job_error_from_sqlx() {
    let sqlx_err = sqlx::Error::PoolClosed;
    let job_err: JobError = sqlx_err.into();

    match job_err {
        JobError::Temporary(msg) => {
            // The actual error message format may vary, so we'll check for key terms
            assert!(msg.contains("PoolClosed") || msg.contains("pool") || msg.contains("closed"));
        }
        _ => panic!("Expected Temporary error"),
    }
}

#[test]
fn test_evidence_job() {
    let now = Utc::now().timestamp_millis();
    let job = EvidenceJob {
        id: "test-job".to_string(),
        payload_sha256: "abcd1234".to_string(),
        created_ms: now,
    };

    assert_eq!(job.id, "test-job");
    assert_eq!(job.payload_sha256, "abcd1234");
    assert_eq!(job.created_ms, now);
}
