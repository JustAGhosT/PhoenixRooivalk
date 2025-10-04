use axum::{
    extract::{Path, State},
    routing::{get, post},
    Json, Router,
};
use serde::{Deserialize, Serialize};
use sqlx::sqlite::SqlitePoolOptions;
use sqlx::{Pool, Sqlite, Row};
use std::net::SocketAddr;
use tokio::net::TcpListener;
use tokio::signal;
use tracing_subscriber::prelude::*;

async fn health() -> &'static str {
    "OK"
}

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

    let port: u16 = std::env::var("PORT")
        .ok()
        .and_then(|s| s.parse().ok())
        .unwrap_or(8080);
    let addr: SocketAddr = ([0, 0, 0, 0], port).into();
    let listener = match TcpListener::bind(addr).await {
        Ok(l) => l,
        Err(e) => {
            tracing::error!(%addr, error=%e, "failed to bind TCP listener");
            std::process::exit(1);
        }
    };
    let bound = listener.local_addr().unwrap_or(addr);
    tracing::info!(%bound, "starting phoenix-api");
    if let Err(err) = axum::serve(listener, app.into_make_service())
        .with_graceful_shutdown(shutdown_signal())
        .await
    {
        tracing::error!(%err, "server error");
    }
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
    let _ = sqlx::query(
        "ALTER TABLE outbox_jobs ADD COLUMN next_attempt_ms INTEGER NOT NULL DEFAULT 0",
    )
    .execute(pool)
    .await;
    Ok(())
}

async fn post_evidence(
    State(state): State<AppState>,
    Json(body): Json<EvidenceIn>,
) -> Json<serde_json::Value> {
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

async fn get_evidence(
    State(state): State<AppState>,
    Path(id): Path<String>,
) -> Json<serde_json::Value> {
    let row = sqlx::query(
        "SELECT id, status, attempts, last_error, created_ms, updated_ms FROM outbox_jobs WHERE id=?1"
    )
    .bind(&id)
    .fetch_optional(&state.pool)
    .await
    .unwrap();

    if let Some(row) = row {
        Json(serde_json::json!({
            "id": row.get::<String, _>("id"),
            "status": row.get::<String, _>("status"),
            "attempts": row.get::<i64, _>("attempts"),
            "last_error": row.get::<Option<String>, _>("last_error"),
            "created_ms": row.get::<i64, _>("created_ms"),
            "updated_ms": row.get::<i64, _>("updated_ms")
        }))
    } else {
        Json(serde_json::json!({ "error": "Job not found" }))
    }
}

async fn shutdown_signal() {
    let ctrl_c = async {
        signal::ctrl_c()
            .await
            .expect("failed to install Ctrl+C handler");
    };

    #[cfg(unix)]
    let terminate = async {
        signal::unix::signal(signal::unix::SignalKind::terminate())
            .expect("failed to install signal handler")
            .recv()
            .await;
    };

    #[cfg(unix)]
    tokio::select! {
        _ = ctrl_c => {},
        _ = terminate => {},
    }

    #[cfg(not(unix))]
    ctrl_c.await;

    tracing::info!("signal received, starting graceful shutdown");
}