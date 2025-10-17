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
async fn test_get_evidence_endpoint() {
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

        // Insert a test job directly into the database
        let job_id = "test-job-123";
        let now = chrono::Utc::now().timestamp_millis();
        
        sqlx::query(
            "INSERT INTO outbox_jobs (id, payload_sha256, status, attempts, last_error, created_ms, updated_ms)
            VALUES (?, ?, ?, ?, ?, ?, ?)",
        )
        .bind(job_id)
        .bind("abcd1234")
        .bind("done")
        .bind(1i64)
        .bind(Some("test error"))
        .bind(now)
        .bind(now)
        .execute(&pool)
        .await
        .unwrap();

        let client = Client::new();

        // Test getting evidence status
        let response = client
            .get(format!("http://127.0.0.1:{}/evidence/{}", port, job_id))
            .send()
            .await
            .unwrap();

        assert_eq!(response.status(), 200);
        let result: serde_json::Value = response.json().await.unwrap();
        assert_eq!(result["id"], job_id);
        assert_eq!(result["status"], "done");
        assert_eq!(result["attempts"], 1);
        assert_eq!(result["last_error"], "test error");

        server.abort();
    })
    .await;
}

#[tokio::test]
async fn test_get_evidence_not_found() {
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

        // Test getting non-existent evidence
        let response = client
            .get(format!("http://127.0.0.1:{}/evidence/non-existent", port))
            .send()
            .await
            .unwrap();

        // Get the response status 
        let status = response.status();
        
        // Read response body fully before aborting server to avoid race condition
        let response_text = response.text().await.unwrap();
        
        // Clean up server after response is fully read
        server.abort();
        
        // Check the response based on status code
        if status == 200 {
            // For 200 OK, parse the JSON and verify the error message
            let result: serde_json::Value = serde_json::from_str(&response_text)
                .unwrap_or_else(|_| panic!("Failed to parse response: {}", response_text));
                
            assert!(
                result["error"].is_string(),
                "Expected error field in response: {}",
                response_text
            );
            assert_eq!(
                result["error"].as_str().unwrap_or_default(),
                "Job not found",
                "Unexpected error message in response: {}",
                response_text
            );
        } else {
            // For 404 Not Found, verify the status code
            assert_eq!(
                status, 404,
                "Expected status 404 Not Found, got {}: {}",
                status, response_text
            );
        }
    })
    .await;
}