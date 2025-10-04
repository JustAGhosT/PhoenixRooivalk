use sqlx::{Pool, Sqlite, Row};
use crate::models::{EvidenceIn, EvidenceOut};

pub async fn ensure_schema(pool: &Pool<Sqlite>) -> Result<(), sqlx::Error> {
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
    .execute(pool)
    .await?;
    // Create tx refs table (if not exists)
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
    .execute(pool)
    .await?;
    // Try to add next_attempt_ms if missing (best-effort)
    let _ = sqlx::query("ALTER TABLE outbox_jobs ADD COLUMN next_attempt_ms INTEGER NOT NULL DEFAULT 0")
        .execute(pool)
        .await;
    Ok(())
}

pub async fn create_evidence_job(pool: &Pool<Sqlite>, body: &EvidenceIn) -> Result<(String, u64), sqlx::Error> {
    let id = body.id.clone().unwrap_or_else(|| uuid::Uuid::new_v4().to_string());
    let now = chrono::Utc::now().timestamp_millis();
    let result = sqlx::query(
        "INSERT OR IGNORE INTO outbox_jobs (id, payload_sha256, status, attempts, created_ms, updated_ms) VALUES (?1, ?2, 'queued', 0, ?3, ?3)"
    )
    .bind(&id)
    .bind(&body.digest_hex)
    .bind(now)
    .execute(pool)
    .await?;
    Ok((id, result.rows_affected()))
}

pub async fn get_evidence_by_id(pool: &Pool<Sqlite>, id: &str) -> Result<Option<EvidenceOut>, sqlx::Error> {
    let row = sqlx::query(
        "SELECT id, status, attempts, last_error, created_ms, updated_ms FROM outbox_jobs WHERE id=?1"
    )
    .bind(id)
    .fetch_optional(pool)
    .await?;

    Ok(row.map(|row| {
        EvidenceOut {
            id: row.get::<String, _>(0),
            status: row.get::<String, _>(1),
            attempts: row.get::<i64, _>(2),
            last_error: row.get::<Option<String>, _>(3),
            created_ms: row.get::<i64, _>(4),
            updated_ms: row.get::<i64, _>(5),
        }
    }))
}

pub async fn list_evidence_jobs(pool: &Pool<Sqlite>, limit: i64, offset: i64) -> Result<(Vec<EvidenceOut>, i64), sqlx::Error> {
    // First, get the total count of jobs
    let count_row = sqlx::query("SELECT COUNT(*) FROM outbox_jobs")
        .fetch_one(pool)
        .await?;
    let total_count: i64 = count_row.get(0);

    // Then, get the paginated list of jobs
    let rows = sqlx::query(
        "SELECT id, status, attempts, last_error, created_ms, updated_ms FROM outbox_jobs ORDER BY created_ms DESC LIMIT ?1 OFFSET ?2"
    )
    .bind(limit)
    .bind(offset)
    .fetch_all(pool)
    .await?;

    let jobs = rows.into_iter().map(|row| {
        EvidenceOut {
            id: row.get::<String, _>(0),
            status: row.get::<String, _>(1),
            attempts: row.get::<i64, _>(2),
            last_error: row.get::<Option<String>, _>(3),
            created_ms: row.get::<i64, _>(4),
            updated_ms: row.get::<i64, _>(5),
        }
    }).collect();

    Ok((jobs, total_count))
}