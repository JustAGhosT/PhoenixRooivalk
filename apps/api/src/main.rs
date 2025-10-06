use axum::{
    routing::{get, post},
    Router,
};
use sqlx::sqlite::SqlitePoolOptions;
use sqlx::{Pool, Sqlite};
use std::net::SocketAddr;
use tokio::net::TcpListener;
use tokio::signal::ctrl_c;
use tracing_subscriber::prelude::*;

use phoenix_api::handlers::{
    get_countermeasure, get_jamming_operation, get_signal_disruption, health, list_countermeasures,
    list_jamming_operations, list_signal_disruptions, post_countermeasure, post_jamming_operation,
    post_signal_disruption,
};
use phoenix_api::migrations::MigrationManager;
use phoenix_api::AppState;

pub async fn build_app() -> (Router, Pool<Sqlite>) {
    // DB pool (use API_DB_URL, fallback to KEEPER_DB_URL, then sqlite file)
    let db_url = std::env::var("API_DB_URL")
        .ok()
        .or_else(|| std::env::var("KEEPER_DB_URL").ok())
        .unwrap_or_else(|| {
            eprintln!("API_DB_URL or KEEPER_DB_URL must be set");
            std::process::exit(1)
        });
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
        .route("/health", get(health)) // Using the imported health handler
        .route(
            "/countermeasures",
            post(post_countermeasure).get(list_countermeasures),
        )
        .route("/countermeasures/{id}", get(get_countermeasure))
        .route(
            "/signal-disruptions",
            post(post_signal_disruption).get(list_signal_disruptions),
        )
        .route("/signal-disruptions/{id}", get(get_signal_disruption))
        .route(
            "/jamming-operations",
            post(post_jamming_operation).get(list_jamming_operations),
        )
        .route("/jamming-operations/{id}", get(get_jamming_operation))
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

async fn shutdown_signal() {
    let ctrl_c = async {
        ctrl_c().await.expect("failed to install Ctrl+C handler");
    };

    #[cfg(unix)]
    let terminate = async {
        tokio::signal::unix::signal(tokio::signal::unix::SignalKind::terminate())
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
