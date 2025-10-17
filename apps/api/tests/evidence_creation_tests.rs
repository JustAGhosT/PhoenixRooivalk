use axum::serve;
use phoenix_api::build_app;
use reqwest::Client;
use serde_json::json;
use sqlx::Row;
use std::time::Duration;
use tokio::net::TcpListener;

/// Helper function to set environment variable with automatic restoration
async fn with_env_var<F, Fut>(key: &str, value: &str, f: F)
where
    F: FnOnce() -> Fut,
    Fut: std::future::Future<Output = ()>,
{
    let original_value = std::env::var(key).ok();
    std::env::set_var(key, value);

    f().await;

    // Restore original value
    match original_value {
        Some(val) => std::env::set_var(key, val),
        None => std::env::remove_var(key),
    }
}

#[tokio::test]
async fn test_health_endpoint() {
    // Create temp DB - using in-memory database for reliability in tests
    let db_url = "sqlite::memory:";

    with_env_var("API_DB_URL", db_url, || async {
        // Build app
        let (app, _pool) = build_app().await.unwrap();

        // Find available port
        let listener = TcpListener::bind("127.0.0.1:0").await.unwrap();
        let addr = listener.local_addr().unwrap();
        let port = addr.port();
        drop(listener);

        // Start server
        let server = tokio::spawn(async move {
            let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
            serve(listener, app.into_make_service()).await.unwrap();
        });

        // Wait for server to start
        tokio::time::sleep(Duration::from_millis(100)).await;

        let client = Client::new();
        let response = client
            .get(format!("http://127.0.0.1:{}/health", port))
            .send()
            .await
            .unwrap();

        assert_eq!(response.status(), 200);
        let body = response.text().await.unwrap();
        assert_eq!(body, "OK");

        server.abort();
    })
    .await;
}

#[tokio::test]
async fn test_post_evidence_endpoint() {
    // Create temp DB - using in-memory database for reliability in tests
    let db_url = "sqlite::memory:";

    with_env_var("API_DB_URL", db_url, || async {
        // Build app
        let (app, pool) = build_app().await.unwrap();

        // Find available port
        let listener = TcpListener::bind("127.0.0.1:0").await.unwrap();
        let addr = listener.local_addr().unwrap();
        let port = addr.port();
        drop(listener);

        // Start server
        let server = tokio::spawn(async move {
            let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
            serve(listener, app.into_make_service()).await.unwrap();
        });

        // Wait for server to start
        tokio::time::sleep(Duration::from_millis(100)).await;

        let client = Client::new();

        // Test evidence submission
        let evidence_payload = json!({
            "digest_hex": "deadbeefcafebabe1234567890abcdef1234567890abcdef1234567890abcdef"
        });
        let response = client
            .post(format!("http://127.0.0.1:{}/evidence", port))
            .json(&evidence_payload)
            .send()
            .await
            .unwrap();

        assert_eq!(response.status(), 200);
        let result: serde_json::Value = response.json().await.unwrap();
        assert!(result["id"].is_string());

        // Verify job was created in database
        let job_id = result["id"].as_str().unwrap();
        let row = sqlx::query(
            "SELECT id, status, attempts, created_ms, updated_ms FROM outbox_jobs WHERE id = ?",
        )
        .bind(job_id)
        .fetch_optional(&pool)
        .await
        .unwrap();

        assert!(row.is_some());
        let row = row.unwrap();
        assert_eq!(row.get::<String, _>("id"), job_id);
        assert_eq!(row.get::<String, _>("status"), "queued");
        assert_eq!(row.get::<i64, _>("attempts"), 0);
        
        server.abort();
    })
    .await;
}

#[tokio::test]
async fn test_post_evidence_with_custom_id() {
    // Create temp DB - using in-memory database for reliability in tests
    let db_url = "sqlite::memory:";

    with_env_var("API_DB_URL", db_url, || async {
        // Build app
        let (app, _pool) = build_app().await.unwrap();

        // Find available port
        let listener = TcpListener::bind("127.0.0.1:0").await.unwrap();
        let addr = listener.local_addr().unwrap();
        let port = addr.port();
        drop(listener);

        // Start server
        let server = tokio::spawn(async move {
            let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
            serve(listener, app.into_make_service()).await.unwrap();
        });

        // Wait for server to start
        tokio::time::sleep(Duration::from_millis(100)).await;

        let client = Client::new();

        // Test evidence submission with custom ID
        let evidence_payload = json!({
            "id": "custom-evidence-123",
            "digest_hex": "deadbeefcafebabe1234567890abcdef1234567890abcdef1234567890abcdef"
        });
        let response = client
            .post(format!("http://127.0.0.1:{}/evidence", port))
            .json(&evidence_payload)
            .send()
            .await
            .unwrap();

        assert_eq!(response.status(), 200);
        let result: serde_json::Value = response.json().await.unwrap();
        assert_eq!(result["id"], "custom-evidence-123");
        assert_eq!(result["status"], "queued");
        
        server.abort();
    })
    .await;
}

#[tokio::test]
async fn test_post_evidence_with_metadata() {
    // Create temp DB - using in-memory database for reliability in tests
    let db_url = "sqlite::memory:";

    with_env_var("API_DB_URL", db_url, || async {
        // Build app
        let (app, _pool) = build_app().await.unwrap();

        // Find available port
        let listener = TcpListener::bind("127.0.0.1:0").await.unwrap();
        let addr = listener.local_addr().unwrap();
        let port = addr.port();
        drop(listener);

        // Start server
        let server = tokio::spawn(async move {
            let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
            serve(listener, app.into_make_service()).await.unwrap();
        });

        // Wait for server to start
        tokio::time::sleep(Duration::from_millis(100)).await;

        let client = Client::new();

        // Test evidence submission with metadata
        let evidence_payload = json!({
            "digest_hex": "deadbeefcafebabe1234567890abcdef1234567890abcdef1234567890abcdef",
            "payload_mime": "application/json",
            "metadata": {
                "source": "test",
                "priority": "high"
            }
        });

        let response = client
            .post(format!("http://127.0.0.1:{}/evidence", port))
            .json(&evidence_payload)
            .send()
            .await
            .unwrap();

        assert_eq!(response.status(), 200);
        let result: serde_json::Value = response.json().await.unwrap();
        assert!(result["id"].is_string());
        assert_eq!(result["status"], "queued");

        server.abort();
    })
    .await;
}