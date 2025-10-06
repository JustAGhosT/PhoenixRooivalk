use crate::models::{EvidenceIn, EvidenceOut};

pub async fn create_evidence_job(
    pool: &Pool<Sqlite>,
    body: &EvidenceIn,
) -> Result<(String, u64), sqlx::Error> {
    let id = body
        .id
        .clone()
        .unwrap_or_else(|| uuid::Uuid::new_v4().to_string());
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

pub async fn get_evidence_by_id(
    pool: &Pool<Sqlite>,
    id: &str,
) -> Result<Option<EvidenceOut>, sqlx::Error> {
    let row = sqlx::query(
        "SELECT id, status, attempts, last_error, created_ms, updated_ms FROM outbox_jobs WHERE id=?1"
    )
    .bind(id)
    .fetch_optional(pool)
    .await?;

    Ok(row.map(|row| EvidenceOut {
        id: row.get::<String, _>(0),
        status: row.get::<String, _>(1),
        attempts: row.get::<i64, _>(2),
        last_error: row.get::<Option<String>, _>(3),
        created_ms: row.get::<i64, _>(4),
        updated_ms: row.get::<i64, _>(5),
    }))
}

pub async fn list_evidence_jobs(
    pool: &Pool<Sqlite>,
    limit: i64,
    offset: i64,
) -> Result<(Vec<EvidenceOut>, i64), sqlx::Error> {
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

    let jobs = rows
        .into_iter()
        .map(|row| EvidenceOut {
            id: row.get::<String, _>(0),
            status: row.get::<String, _>(1),
            attempts: row.get::<i64, _>(2),
            last_error: row.get::<Option<String>, _>(3),
            created_ms: row.get::<i64, _>(4),
            updated_ms: row.get::<i64, _>(5),
        })
        .collect();

    Ok((jobs, total_count))
}

// Countermeasure Deployment functions
pub async fn create_countermeasure_deployment(
    pool: &Pool<Sqlite>,
    deployment: &crate::models::CountermeasureDeploymentIn,
) -> Result<String, sqlx::Error> {
    let id = uuid::Uuid::new_v4().to_string();
    let now = chrono::Utc::now().timestamp_millis();

    sqlx::query(
        "INSERT INTO countermeasure_deployments (id, job_id, deployed_at, deployed_by, countermeasure_type, effectiveness_score, notes, created_ms, updated_ms) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)"
    )
    .bind(&id)
    .bind(&deployment.job_id)
    .bind(now)
    .bind(&deployment.deployed_by)
    .bind(&deployment.countermeasure_type)
    .bind(&deployment.effectiveness_score)
    .bind(&deployment.notes)
    .bind(now)
    .bind(now)
    .execute(pool)
    .await?;

    Ok(id)
}

pub async fn get_countermeasure_deployment_by_id(
    pool: &Pool<Sqlite>,
    id: &str,
) -> Result<Option<crate::models::CountermeasureDeploymentOut>, sqlx::Error> {
    let row = sqlx::query(
        "SELECT id, job_id, deployed_at, deployed_by, countermeasure_type, effectiveness_score, notes, created_ms, updated_ms FROM countermeasure_deployments WHERE id=?1"
    )
    .bind(id)
    .fetch_optional(pool)
    .await?;

    Ok(row.map(|row| crate::models::CountermeasureDeploymentOut {
        id: row.get::<String, _>(0),
        job_id: row.get::<String, _>(1),
        deployed_at: row.get::<i64, _>(2),
        deployed_by: row.get::<String, _>(3),
        countermeasure_type: row.get::<String, _>(4),
        effectiveness_score: row.get::<Option<f64>, _>(5),
        notes: row.get::<Option<String>, _>(6),
        created_ms: row.get::<i64, _>(7),
        updated_ms: row.get::<i64, _>(8),
    }))
}

pub async fn list_countermeasure_deployments(
    pool: &Pool<Sqlite>,
    limit: i64,
    offset: i64,
) -> Result<(Vec<crate::models::CountermeasureDeploymentOut>, i64), sqlx::Error> {
    let count_row = sqlx::query("SELECT COUNT(*) FROM countermeasure_deployments")
        .fetch_one(pool)
        .await?;
    let total_count: i64 = count_row.get(0);

    let rows = sqlx::query(
        "SELECT id, job_id, deployed_at, deployed_by, countermeasure_type, effectiveness_score, notes, created_ms, updated_ms FROM countermeasure_deployments ORDER BY deployed_at DESC LIMIT ?1 OFFSET ?2"
    )
    .bind(limit)
    .bind(offset)
    .fetch_all(pool)
    .await?;

    let deployments = rows
        .into_iter()
        .map(|row| crate::models::CountermeasureDeploymentOut {
            id: row.get::<String, _>(0),
            job_id: row.get::<String, _>(1),
            deployed_at: row.get::<i64, _>(2),
            deployed_by: row.get::<String, _>(3),
            countermeasure_type: row.get::<String, _>(4),
            effectiveness_score: row.get::<Option<f64>, _>(5),
            notes: row.get::<Option<String>, _>(6),
            created_ms: row.get::<i64, _>(7),
            updated_ms: row.get::<i64, _>(8),
        })
        .collect();

    Ok((deployments, total_count))
}

// Signal Disruption Audit functions
pub async fn create_signal_disruption_audit(
    pool: &Pool<Sqlite>,
    audit: &crate::models::SignalDisruptionAuditIn,
) -> Result<String, sqlx::Error> {
    let id = uuid::Uuid::new_v4().to_string();
    let now = chrono::Utc::now().timestamp_millis();

    sqlx::query(
        "INSERT INTO signal_disruption_audit (id, target_id, event_type, event_timestamp, detected_by, severity, outcome, evidence_blob, created_ms, updated_ms) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)"
    )
    .bind(&id)
    .bind(&audit.target_id)
    .bind(&audit.event_type)
    .bind(now)
    .bind(&audit.detected_by)
    .bind(&audit.severity)
    .bind(&audit.outcome)
    .bind(&audit.evidence_blob)
    .bind(now)
    .bind(now)
    .execute(pool)
    .await?;

    Ok(id)
}

pub async fn get_signal_disruption_audit_by_id(
    pool: &Pool<Sqlite>,
    id: &str,
) -> Result<Option<crate::models::SignalDisruptionAuditOut>, sqlx::Error> {
    let row = sqlx::query(
        "SELECT id, target_id, event_type, event_timestamp, detected_by, severity, outcome, evidence_blob, created_ms, updated_ms FROM signal_disruption_audit WHERE id=?1"
    )
    .bind(id)
    .fetch_optional(pool)
    .await?;

    Ok(row.map(|row| crate::models::SignalDisruptionAuditOut {
        id: row.get::<String, _>(0),
        target_id: row.get::<String, _>(1),
        event_type: row.get::<String, _>(2),
        event_timestamp: row.get::<i64, _>(3),
        detected_by: row.get::<String, _>(4),
        severity: row.get::<String, _>(5),
        outcome: row.get::<String, _>(6),
        evidence_blob: row.get::<Option<String>, _>(7),
        created_ms: row.get::<i64, _>(8),
        updated_ms: row.get::<i64, _>(9),
    }))
}

pub async fn list_signal_disruption_audits(
    pool: &Pool<Sqlite>,
    limit: i64,
    offset: i64,
) -> Result<(Vec<crate::models::SignalDisruptionAuditOut>, i64), sqlx::Error> {
    let count_row = sqlx::query("SELECT COUNT(*) FROM signal_disruption_audit")
        .fetch_one(pool)
        .await?;
    let total_count: i64 = count_row.get(0);

    let rows = sqlx::query(
        "SELECT id, target_id, event_type, event_timestamp, detected_by, severity, outcome, evidence_blob, created_ms, updated_ms FROM signal_disruption_audit ORDER BY event_timestamp DESC LIMIT ?1 OFFSET ?2"
    )
    .bind(limit)
    .bind(offset)
    .fetch_all(pool)
    .await?;

    let audits = rows
        .into_iter()
        .map(|row| crate::models::SignalDisruptionAuditOut {
            id: row.get::<String, _>(0),
            target_id: row.get::<String, _>(1),
            event_type: row.get::<String, _>(2),
            event_timestamp: row.get::<i64, _>(3),
            detected_by: row.get::<String, _>(4),
            severity: row.get::<String, _>(5),
            outcome: row.get::<String, _>(6),
            evidence_blob: row.get::<Option<String>, _>(7),
            created_ms: row.get::<i64, _>(8),
            updated_ms: row.get::<i64, _>(9),
        })
        .collect();

    Ok((audits, total_count))
}

// Jamming Operation functions
pub async fn create_jamming_operation(
    pool: &Pool<Sqlite>,
    operation: &crate::models::JammingOperationIn,
) -> Result<String, sqlx::Error> {
    let id = uuid::Uuid::new_v4().to_string();
    let now = chrono::Utc::now().timestamp_millis();

    sqlx::query(
        "INSERT INTO jamming_operations (id, operation_id, job_id, started_ms, target_frequency_range, power_level, success_metric, attempts, created_ms, updated_ms) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)"
    )
    .bind(&id)
    .bind(&operation.operation_id)
    .bind(&operation.job_id)
    .bind(now)
    .bind(&operation.target_frequency_range)
    .bind(&operation.power_level)
    .bind(&operation.success_metric)
    .bind(0) // attempts
    .bind(now)
    .bind(now)
    .execute(pool)
    .await?;

    Ok(id)
}

pub async fn get_jamming_operation_by_id(
    pool: &Pool<Sqlite>,
    id: &str,
) -> Result<Option<crate::models::JammingOperationOut>, sqlx::Error> {
    let row = sqlx::query(
        "SELECT id, operation_id, job_id, started_ms, ended_ms, target_frequency_range, power_level, success_metric, attempts, last_error, created_ms, updated_ms FROM jamming_operations WHERE id=?1"
    )
    .bind(id)
    .fetch_optional(pool)
    .await?;

    Ok(row.map(|row| crate::models::JammingOperationOut {
        id: row.get::<String, _>(0),
        operation_id: row.get::<String, _>(1),
        job_id: row.get::<String, _>(2),
        started_ms: row.get::<i64, _>(3),
        ended_ms: row.get::<Option<i64>, _>(4),
        target_frequency_range: row.get::<String, _>(5),
        power_level: row.get::<f64, _>(6),
        success_metric: row.get::<Option<f64>, _>(7),
        attempts: row.get::<i32, _>(8),
        last_error: row.get::<Option<String>, _>(9),
        created_ms: row.get::<i64, _>(10),
        updated_ms: row.get::<i64, _>(11),
    }))
}

pub async fn list_jamming_operations(
    pool: &Pool<Sqlite>,
    limit: i64,
    offset: i64,
) -> Result<(Vec<crate::models::JammingOperationOut>, i64), sqlx::Error> {
    let count_row = sqlx::query("SELECT COUNT(*) FROM jamming_operations")
        .fetch_one(pool)
        .await?;
    let total_count: i64 = count_row.get(0);

    let rows = sqlx::query(
        "SELECT id, operation_id, job_id, started_ms, ended_ms, target_frequency_range, power_level, success_metric, attempts, last_error, created_ms, updated_ms FROM jamming_operations ORDER BY started_ms DESC LIMIT ?1 OFFSET ?2"
    )
    .bind(limit)
    .bind(offset)
    .fetch_all(pool)
    .await?;

    let operations = rows
        .into_iter()
        .map(|row| crate::models::JammingOperationOut {
            id: row.get::<String, _>(0),
            operation_id: row.get::<String, _>(1),
            job_id: row.get::<String, _>(2),
            started_ms: row.get::<i64, _>(3),
            ended_ms: row.get::<Option<i64>, _>(4),
            target_frequency_range: row.get::<String, _>(5),
            power_level: row.get::<f64, _>(6),
            success_metric: row.get::<Option<f64>, _>(7),
            attempts: row.get::<i32, _>(8),
            last_error: row.get::<Option<String>, _>(9),
            created_ms: row.get::<i64, _>(10),
            updated_ms: row.get::<i64, _>(11),
        })
        .collect();

    Ok((operations, total_count))
}
