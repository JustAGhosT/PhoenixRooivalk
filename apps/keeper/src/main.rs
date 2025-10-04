use anchor_etherlink::EtherlinkProviderStub;
use axum::{routing::get, Router};
use phoenix_keeper::{ensure_schema, run_confirmation_loop, run_job_loop, SqliteJobProvider};
use sqlx::sqlite::SqlitePoolOptions;
use std::time::Duration;
use tokio::signal;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

#[tokio::main]
async fn main() {
    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::new(
            std::env::var("RUST_LOG").unwrap_or_else(|_| "info".into()),
        ))
        .with(tracing_subscriber::fmt::layer())
        .init();

    // HTTP health endpoint
    let app = Router::new().route("/health", get(|| async { "OK" }));
    let http = tokio::spawn(async move {
        let addr = "0.0.0.0:8081";
        tracing::info!(%addr, "keeper http starting");
        axum::Server::bind(&addr.parse().unwrap())
            .serve(app.into_make_service())
            .await
            .unwrap();
    });

    // Job runner
    let runner = tokio::spawn(async move {
        let poll_interval = std::env::var("KEEPER_POLL_MS")
            .ok()
            .and_then(|v| v.parse::<u64>().ok())
            .map(Duration::from_millis)
            .unwrap_or_else(|| Duration::from_secs(5));

        let db_url = std::env::var("KEEPER_DB_URL")
            .unwrap_or_else(|_| "sqlite://blockchain_outbox.sqlite3".to_string());
        match SqlitePoolOptions::new()
            .max_connections(5)
            .connect(&db_url)
            .await
        {
            Ok(pool) => {
                if let Err(e) = ensure_schema(&pool).await {
                    tracing::error!(error=%e, "schema init failed");
                }

                let mut jp = SqliteJobProvider::new(pool.clone());
                let anchor = EtherlinkProviderStub;

                // Start job processing loop
                let job_pool = pool.clone();
                let job_anchor = anchor.clone();
                let job_handle = tokio::spawn(async move {
                    run_job_loop(&mut jp, &job_anchor, poll_interval).await;
                });

                // Start confirmation polling loop
                let confirm_interval = Duration::from_secs(30); // Check confirmations every 30s
                let confirm_handle = tokio::spawn(async move {
                    run_confirmation_loop(&pool, &anchor, confirm_interval).await;
                });

                // Wait for either loop to complete (they shouldn't)
                tokio::select! {
                    _ = job_handle => {
                        tracing::warn!("Job loop exited unexpectedly");
                    }
                    _ = confirm_handle => {
                        tracing::warn!("Confirmation loop exited unexpectedly");
                    }
                }
            }
            Err(e) => {
                tracing::error!(error=%e, "db connect failed; keeper idle");
                tokio::time::sleep(Duration::from_secs(10)).await;
            }
        }
    });

    // Wait for Ctrl+C
    tokio::select! {
        _ = signal::ctrl_c() => {
            tracing::info!("shutdown signal received");
        }
        _ = http => {}
        _ = runner => {}
    }
}
