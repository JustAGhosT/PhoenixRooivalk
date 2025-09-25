use axum::{routing::get, Router};
use sqlx::{sqlite::SqlitePoolOptions, Sqlite, Pool, Row};
use std::time::Duration;
use tokio::signal;
use tokio::time::sleep;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};
use phoenix_evidence::anchor::{AnchorProvider, AnchorError};
use phoenix_evidence::model::{ChainTxRef, EvidenceRecord, EvidenceDigest, DigestAlgo};
use anchor_etherlink::EtherlinkProviderStub;

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

        let db_url = std::env::var("KEEPER_DB_URL").ok();
        if let Some(url) = db_url {
            match SqlitePoolOptions::new().max_connections(5).connect(&url).await {
                Ok(pool) => {
                    if let Err(e) = ensure_schema(&pool).await { tracing::error!(error=%e, "schema init failed"); }
                    let mut jp = SqliteJobProvider { pool };
                    let anchor = EtherlinkProviderStub;
                    run_job_loop(&mut jp, &anchor, poll_interval).await;
                }
                Err(e) => {
                    tracing::error!(error=%e, "db connect failed, falling back to stdout provider");
                    let mut jp = StdoutJobProvider;
                    let anchor = EtherlinkProviderStub;
                    run_job_loop(&mut jp, &anchor, poll_interval).await;
                }
            }
        } else {
            let mut jp = StdoutJobProvider;
            let anchor = EtherlinkProviderStub;
            run_job_loop(&mut jp, &anchor, poll_interval).await;
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

// --- Job model & traits ---
#[derive(Debug, Clone)]
pub struct EvidenceJob {
    pub id: String,
    pub payload_sha256: String,
    pub created_ms: i64,
}

#[derive(Debug, thiserror::Error)]
pub enum JobError {
    #[error("temporary: {0}")]
}

#[async_trait::async_trait]
impl JobProvider for SqliteJobProvider {

#[async_trait::async_trait]
impl JobProvider for StdoutJobProvider {
    async fn fetch_next(&mut self) -> Result<Option<EvidenceJob>, JobError> {
        // In real use, pull from DB/queue. Here we simulate "no job".
        Ok(None)
    }
    async fn mark_done(&mut self, _id: &str) -> Result<(), JobError> { Ok(()) }
    async fn mark_failed(&mut self, _id: &str, _reason: &str) -> Result<(), JobError> { Ok(()) }
}

// removed: LogEvidenceAnchor (we use AnchorProvider impls from provider crates)
