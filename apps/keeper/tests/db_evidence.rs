use anchor_etherlink::EtherlinkProviderStub;
use async_trait::async_trait;
use phoenix_evidence::anchor::{AnchorError, AnchorProvider};
use phoenix_evidence::model::{ChainTxRef, EvidenceRecord};
use phoenix_keeper::{
    ensure_schema, EvidenceJob, JobError, JobProvider, JobProviderExt, SqliteJobProvider,
};
use sqlx::{sqlite::SqlitePoolOptions, Row};
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
                            let temporary =
                                matches!(e, AnchorError::Network(_) | AnchorError::Provider(_));
                            let _ = jp
                                .mark_failed_or_backoff(&job.id, &e.to_string(), temporary)
                                .await;
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
    let tx_ref_count =
        sqlx::query("SELECT COUNT(*) as count FROM outbox_tx_refs WHERE job_id = ?1")
            .bind(job_id)
            .fetch_one(&pool)
            .await
            .unwrap();

    let count: i64 = tx_ref_count.get("count");
    assert_eq!(count, 1);
}

// Custom job provider that overrides the backoff calculation for testing
struct TestSqliteJobProvider {
    pool: sqlx::Pool<sqlx::Sqlite>,
}

impl TestSqliteJobProvider {
    fn new(pool: sqlx::Pool<sqlx::Sqlite>) -> Self {
        Self { pool }
    }
}

#[async_trait]
impl JobProvider for TestSqliteJobProvider {
    async fn fetch_next(&mut self) -> Result<Option<EvidenceJob>, JobError> {
        let mut tx = self.pool.begin().await?;
        let now_ms = chrono::Utc::now().timestamp_millis();
        if let Some(row) = sqlx::query(
            "SELECT id, payload_sha256, created_ms FROM outbox_jobs WHERE status='queued' AND next_attempt_ms <= ?1 ORDER BY created_ms ASC LIMIT 1",
        )
        .bind(now_ms)
        .fetch_optional(&mut *tx)
        .await?
        {
            let id: String = row.get(0);
            sqlx::query(
                "UPDATE outbox_jobs SET status='in_progress', updated_ms=?1, attempts=attempts+1 WHERE id=?2",
            )
            .bind(now_ms)
            .bind(&id)
            .execute(&mut *tx)
            .await?;
            tx.commit().await?;
            Ok(Some(EvidenceJob {
                id,
                payload_sha256: row.get(1),
                created_ms: row.get(2),
            }))
        } else {
            Ok(None)
        }
    }

    async fn mark_done(&mut self, id: &str) -> Result<(), JobError> {
        let mut tx = self.pool.begin().await?;
        let now_ms = chrono::Utc::now().timestamp_millis();
        sqlx::query("UPDATE outbox_jobs SET status='done', updated_ms=?1 WHERE id=?2")
            .bind(now_ms)
            .bind(id)
            .execute(&mut *tx)
            .await?;
        tx.commit().await?;
        Ok(())
    }

    async fn mark_failed(&mut self, id: &str, reason: &str) -> Result<(), JobError> {
        let mut tx = self.pool.begin().await?;
        let now_ms = chrono::Utc::now().timestamp_millis();
        sqlx::query(
            "UPDATE outbox_jobs SET status='failed', last_error=?1, updated_ms=?2 WHERE id=?3",
        )
        .bind(reason)
        .bind(now_ms)
        .bind(id)
        .execute(&mut *tx)
        .await?;
        tx.commit().await?;
        Ok(())
    }
}

#[async_trait]
impl JobProviderExt for TestSqliteJobProvider {
    async fn mark_tx_and_done(&mut self, id: &str, tx_ref: &ChainTxRef) -> Result<(), JobError> {
        let mut tx = self.pool.begin().await?;
        let now_ms = chrono::Utc::now().timestamp_millis();
        sqlx::query("UPDATE outbox_jobs SET status='done', updated_ms=?1 WHERE id=?2")
            .bind(now_ms)
            .bind(id)
            .execute(&mut *tx)
            .await?;
        sqlx::query(
            "INSERT INTO outbox_tx_refs (job_id, network, chain, tx_id, confirmed, timestamp) VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
        )
        .bind(id)
        .bind(&tx_ref.network)
        .bind(&tx_ref.chain)
        .bind(&tx_ref.tx_id)
        .bind(tx_ref.confirmed)
        .bind(tx_ref.timestamp.map(|t| t.timestamp_millis()))
        .execute(&mut *tx)
        .await?;
        tx.commit().await?;
        Ok(())
    }

    async fn mark_failed_or_backoff(
        &mut self,
        id: &str,
        reason: &str,
        temporary: bool,
    ) -> Result<(), JobError> {
        let now_ms = chrono::Utc::now().timestamp_millis();
        if temporary {
            // Use a much shorter backoff for testing (100ms instead of 5s)
            let next = now_ms + 100;
            sqlx::query(
                "UPDATE outbox_jobs SET status='queued', last_error=?1, updated_ms=?2, next_attempt_ms=?3 WHERE id=?4",
            )
            .bind(reason)
            .bind(now_ms)
            .bind(next)
            .bind(id)
            .execute(&self.pool)
            .await?;
            return Ok(());
        }
        sqlx::query(
            "UPDATE outbox_jobs SET status='failed', last_error=?1, updated_ms=?2, next_attempt_ms=?2 WHERE id=?3",
        )
        .bind(reason)
        .bind(now_ms)
        .bind(id)
        .execute(&self.pool)
        .await?;
        Ok(())
    }
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
            return Err(AnchorError::Network(
                "Simulated network failure".to_string(),
            ));
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
        let mut jp = TestSqliteJobProvider::new(keeper_pool);
        let anchor = FailOnceProvider::new();

        // Use the actual run_job_loop with a timeout
        let timeout_duration = Duration::from_secs(15);
        let start_time = std::time::Instant::now();

        while start_time.elapsed() < timeout_duration {
            match jp.fetch_next().await {
                Ok(Some(job)) => {
                    println!("Processing job: {}", job.id);
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
                            println!("Job succeeded, marking as done");
                            let _ = jp.mark_tx_and_done(&job.id, &tx_ref).await;
                            return; // Job done, exit
                        }
                        Err(e) => {
                            println!("Job failed: {}, marking for retry", e);
                            let temporary =
                                matches!(e, AnchorError::Network(_) | AnchorError::Provider(_));
                            let _ = jp
                                .mark_failed_or_backoff(&job.id, &e.to_string(), temporary)
                                .await;
                        }
                    }
                }
                Ok(None) => {
                    tokio::time::sleep(Duration::from_millis(200)).await;
                }
                Err(_) => {
                    tokio::time::sleep(Duration::from_millis(200)).await;
                }
            }
        }
    });

    // Wait for keeper to process (longer timeout for retry)
    let _ = timeout(Duration::from_secs(20), keeper_handle).await;

    // Give a moment for database to be updated
    tokio::time::sleep(Duration::from_millis(100)).await;

    // Verify job eventually succeeded
    let job_status = sqlx::query("SELECT status, attempts FROM outbox_jobs WHERE id = ?1")
        .bind(job_id)
        .fetch_one(&pool)
        .await
        .unwrap();

    let status: String = job_status.get("status");
    let attempts: i64 = job_status.get("attempts");

    println!("Job status: {}, attempts: {}", status, attempts);

    // Check if job is still in progress, if so wait a bit more
    if status == "in_progress" {
        println!("Job still in progress, waiting a bit more...");
        tokio::time::sleep(Duration::from_millis(500)).await;

        let job_status = sqlx::query("SELECT status, attempts FROM outbox_jobs WHERE id = ?1")
            .bind(job_id)
            .fetch_one(&pool)
            .await
            .unwrap();

        let status: String = job_status.get("status");
        let attempts: i64 = job_status.get("attempts");
        println!("Job status after wait: {}, attempts: {}", status, attempts);
    }

    assert_eq!(status, "done");
    assert!(
        attempts >= 2,
        "Should have at least 2 attempts (fail then succeed)"
    );

    // Verify tx ref exists
    let tx_ref_count =
        sqlx::query("SELECT COUNT(*) as count FROM outbox_tx_refs WHERE job_id = ?1")
            .bind(job_id)
            .fetch_one(&pool)
            .await
            .unwrap();

    let count: i64 = tx_ref_count.get("count");
    assert_eq!(count, 1);
}
