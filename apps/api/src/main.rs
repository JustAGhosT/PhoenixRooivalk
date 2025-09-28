use axum::{
    routing::{get, post},
    Router,
    extract::{Path, State},
    Json,
    serve::Serve,
    serve,
};
use tokio::net::TcpListener;

async fn health() -> &'static str { "OK" }

#[derive(Clone)]
struct AppState {
    pool: Pool<Sqlite>,
}

#[derive(Debug, Deserialize)]
struct EvidenceIn {
    id: Option<String>,
    digest_hex: String,
    payload_mime: Option<String>,
    metadata: Option<serde_json::Value>,
}

#[derive(Debug, Serialize)]
struct EvidenceOut {
    id: String,
    status: String,
    attempts: i64,
    last_error: Option<String>,
    created_ms: i64,
    updated_ms: i64,
}

pub async fn build_app() -> (Router, Pool<Sqlite>) {
    // DB pool (use API_DB_URL, fallback to KEEPER_DB_URL, then sqlite file)
    let db_url = std::env::var("API_DB_URL")
        .ok()
        .or_else(|| std::env::var("KEEPER_DB_URL").ok())
        .unwrap_or_else(|| "sqlite://blockchain_outbox.sqlite3".to_string());
    let pool = SqlitePoolOptions::new()
        .max_connections(5)
        .connect(&db_url)
        .await
        .expect("failed to connect db");
    ensure_schema(&pool).await.expect("schema init failed");

    let state = AppState { pool: pool.clone() };
    let app = Router::new()
        .route("/health", get(health))
        .route("/evidence", post(post_evidence))
        .route("/evidence/:id", get(get_evidence))
        .with_state(state);
    (app, pool)
}

#[tokio::main]
async fn main() {
    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::new(
            std::env::var("RUST_LOG").unwrap_or_else(|_| "info".into()),
        ))
        .with(tracing_subscriber::fmt::layer())
        .init();

    let (app, _pool) = build_app().await;

    let port: u16 = std::env::var("PORT").ok().and_then(|s| s.parse().ok()).unwrap_or(8080);
    let listener = TcpListener::bind(&addr).await.unwrap();
    tracing::info!(%addr, "starting phoenix-api");

    serve(listener, app.into_make_service())
        .await
        .unwrap();
}

async fn ensure_schema(pool: &Pool<Sqlite>) -> Result<(), sqlx::Error> {
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

async fn post_evidence(State(state): State<AppState>, Json(body): Json<EvidenceIn>) -> Json<serde_json::Value> {
    let id = body.id.unwrap_or_else(|| uuid::Uuid::new_v4().to_string());
    let now = chrono::Utc::now().timestamp_millis();
    // Insert into outbox
    let _ = sqlx::query(
        "INSERT OR REPLACE INTO outbox_jobs (id, payload_sha256, status, attempts, created_ms, updated_ms) VALUES (?1, ?2, 'queued', COALESCE((SELECT attempts FROM outbox_jobs WHERE id=?1), 0), ?3, ?3)"
    )
    .bind(&id)
    .bind(&body.digest_hex)
    .bind(now)
    .execute(&state.pool)
    .await;

    Json(serde_json::json!({ "id": id, "status": "queued" }))
}

async fn get_evidence(State(state): State<AppState>, Path(id): Path<String>) -> Json<serde_json::Value> {
    let row = sqlx::query(
        "SELECT id, status, attempts, last_error, created_ms, updated_ms FROM outbox_jobs WHERE id=?1"
    )
    .bind(&id)
    .fetch_optional(&state.pool)
    .await
    .ok()
    .flatten();

    if let Some(row) = row {
        let out = EvidenceOut {
            id: row.get::<String, _>(0),
            status: row.get::<String, _>(1),
            attempts: row.get::<i64, _>(2),
            last_error: row.get::<Option<String>, _>(3),
            created_ms: row.get::<i64, _>(4),
            updated_ms: row.get::<i64, _>(5),
        };
        return Json(serde_json::to_value(out).unwrap());
    }

    Json(serde_json::json!({ "id": id, "status": "not_found" }))
}
