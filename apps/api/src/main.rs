use axum::{
  extract::{Path, State},
  http::StatusCode,
  routing::{get, post},
  Json, Router,
};
use serde::{Deserialize, Serialize};
use sqlx::sqlite::SqlitePoolOptions;
use sqlx::{Pool, Row, Sqlite};
use std::net::SocketAddr;
use tokio::net::TcpListener;
use tokio::signal;
use tracing_subscriber::prelude::*;

use phoenix_api::handlers::{
    health, post_evidence, get_evidence, post_countermeasure, get_countermeasure, list_countermeasures,
    post_signal_disruption, get_signal_disruption, list_signal_disruptions,
    post_jamming_operation, get_jamming_operation, list_jamming_operations,
};
use phoenix_api::migrations::MigrationManager;
use phoenix_api::models::EvidenceIn;

#[derive(Clone)]
struct AppState {
  pool: Pool<Sqlite>,
}

pub async fn build_app() -> (Router, Pool<Sqlite>) {
  // DB pool (use API_DB_URL, fallback to KEEPER_DB_URL, then sqlite file)
  let db_url = std::env::var("API_DB_URL")
      .ok()
      .or_else(|| std::env::var("KEEPER_DB_URL").ok())
  let pool = SqlitePoolOptions::new()
      .max_connections(5)
      .connect(&db_url)
      .await
      .expect("failed to connect db");

  // Run migrations instead of manual schema initialization
  let migration_manager = MigrationManager::new(pool.clone());
  migration_manager.migrate().await.expect("migration failed");

  let state = AppState { pool: pool.clone() };
  let app = Router::new()
      .route("/health", get(health))  // Using the imported health handler
      .route("/evidence", post(post_evidence))
      .route("/evidence/{id}", get(get_evidence))
      .route("/countermeasures", post(post_countermeasure).get(list_countermeasures))
      .route("/countermeasures/{id}", get(get_countermeasure))
      .route("/signal-disruptions", post(post_signal_disruption).get(list_signal_disruptions))
      .route("/signal-disruptions/{id}", get(get_signal_disruption))
      .route("/jamming-operations", post(post_jamming_operation).get(list_jamming_operations))
      .route("/jamming-operations/{id}", get(get_jamming_operation))
      .with_state(state);
  (app, pool)

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
) -> Result<Json<serde_json::Value>, (StatusCode, Json<serde_json::Value>)> {
    let row = match sqlx::query(
        "SELECT id, status, attempts, last_error, created_ms, updated_ms FROM outbox_jobs WHERE id=?1"
    )
    .bind(&id)
    .fetch_optional(&state.pool)
    .await
    {
        Ok(row) => row,
        Err(e) => {
            tracing::error!("Database error in get_evidence: {}", e);
            return Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(serde_json::json!({ "error": "Database error" }))
            ));
        }
    };

    if let Some(row) = row {
        Ok(Json(serde_json::json!({
            "id": row.get::<String, _>("id"),
            "status": row.get::<String, _>("status"),
            "attempts": row.get::<i64, _>("attempts"),
            "last_error": row.get::<Option<String>, _>("last_error"),
            "created_ms": row.get::<i64, _>("created_ms"),
            "updated_ms": row.get::<i64, _>("updated_ms")
        })))
    } else {
        Err((
            StatusCode::NOT_FOUND,
            Json(serde_json::json!({ "error": "Job not found" })),
        ))
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
