use axum::{
    routing::{get, post},
    Router,
};
use sqlx::{sqlite::SqlitePoolOptions, Pool, Sqlite};

pub mod connection;
pub mod db;
pub mod handlers;
pub mod migrations;
pub mod models;
pub mod repository;

#[derive(Clone)]
pub struct AppState {
    pub pool: Pool<Sqlite>,
}

pub async fn build_app() -> anyhow::Result<(Router, Pool<Sqlite>)> {
    // DB pool (use API_DB_URL, fallback to KEEPER_DB_URL, then sqlite file)
    let db_url = std::env::var("API_DB_URL")
        .ok()
        .or_else(|| std::env::var("KEEPER_DB_URL").ok())
        .unwrap_or_else(|| "sqlite://blockchain_outbox.sqlite3".to_string());
    let pool = SqlitePoolOptions::new()
        .max_connections(5)
        .connect(&db_url)
        .await?;
    db::ensure_schema(&pool).await?;

    let state = AppState { pool: pool.clone() };
    let app = Router::new()
        .route("/health", get(handlers::health))
        .route(
            "/evidence",
            post(handlers::post_evidence).get(handlers::list_evidence),
        )
        .route("/evidence/{id}", get(handlers::get_evidence))
        .with_state(state);
    Ok((app, pool))
}
