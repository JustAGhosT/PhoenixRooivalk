//! Documentation tests for the Phoenix API
//!
//! This module contains comprehensive documentation tests that demonstrate
//! the usage of the API components and serve as examples for developers.

use phoenix_api::{
    connection::{ConnectionConfig, ConnectionManager, DatabaseUrlBuilder, HealthChecker},
    migrations::MigrationManager,
    models::EvidenceIn,
    repository::{EvidenceRepository, RepositoryError},
};
use sqlx::sqlite::SqlitePoolOptions;
use std::time::Duration;
use tempfile::NamedTempFile;

/// Example: Basic connection management
///
/// This example shows how to create and configure a database connection
/// with proper error handling and health checking.
#[tokio::test]
async fn example_connection_management() {
    // Create a temporary database
    let temp_db = NamedTempFile::new().unwrap();
    let db_path = temp_db.path().to_str().unwrap();
    let db_url = DatabaseUrlBuilder::sqlite(db_path);

    // Create connection manager with default configuration
    let manager = ConnectionManager::new(&db_url).await.unwrap();

    // Test the connection
    manager.test_connection().await.unwrap();

    // Get connection statistics
    let stats = manager.get_stats().await.unwrap();
    assert!(stats.size >= 1);
    // Verify stats are valid (active is always >= 0 for u32)
    assert!(stats.active <= stats.size);

    // Perform health check
    let health = HealthChecker::check_health(manager.pool()).await.unwrap();
    assert!(health.is_healthy);
    assert!(health.response_time < Duration::from_secs(1));
}

/// Example: Custom connection configuration
///
/// This example demonstrates how to configure connection pools
/// for different environments (development, staging, production).
#[tokio::test]
async fn example_custom_connection_config() {
    let temp_db = NamedTempFile::new().unwrap();
    let db_path = temp_db.path().to_str().unwrap();
    let db_url = DatabaseUrlBuilder::sqlite(db_path);

    // Production-like configuration
    let config = ConnectionConfig {
        max_connections: 20,
        min_connections: 2,
        acquire_timeout: Duration::from_secs(30),
        idle_timeout: Duration::from_secs(600),
        max_lifetime: Duration::from_secs(1800),
        test_before_acquire: true,
    };

    let manager = ConnectionManager::with_config(&db_url, config)
        .await
        .unwrap();
    let stats = manager.get_stats().await.unwrap();
    assert_eq!(stats.max_connections, 20);
}

/// Example: Database migrations
///
/// This example shows how to run database migrations
/// and check migration status.
#[tokio::test]
async fn example_database_migrations() {
    let temp_db = NamedTempFile::new().unwrap();
    let db_path = temp_db.path().to_str().unwrap();
    let db_url = DatabaseUrlBuilder::sqlite(db_path);

    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect(&db_url)
        .await
        .unwrap();

    let migration_manager = MigrationManager::new(pool);

    // Run migrations
    migration_manager.migrate().await.unwrap();

    // Check if migrations are up to date
    assert!(migration_manager.is_up_to_date().await.unwrap());

    // Get migration status
    let status = migration_manager.get_status().await.unwrap();
    assert!(status.is_up_to_date);
    assert_eq!(status.current_version, status.latest_version);
    assert_eq!(status.applied_migrations.len(), status.latest_version as usize);
}

/// Example: Evidence repository operations
///
/// This example demonstrates the complete lifecycle of evidence
/// management using the repository pattern.
#[tokio::test]
async fn example_evidence_repository_operations() {
    let temp_db = NamedTempFile::new().unwrap();
    let db_path = temp_db.path().to_str().unwrap();
    let db_url = DatabaseUrlBuilder::sqlite(db_path);

    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect(&db_url)
        .await
        .unwrap();

    let repo = EvidenceRepository::new(pool);
    repo.ensure_schema().await.unwrap();

    // Create evidence job
    let evidence = EvidenceIn {
        id: Some("doc-test-123".to_string()),
        digest_hex: "abcd1234efgh5678".to_string(),
        payload_mime: Some("application/json".to_string()),
        metadata: Some(serde_json::json!({
            "source": "documentation_test",
            "priority": "high"
        })),
    };

    let job_id = repo.create_evidence_job(&evidence).await.unwrap();
    assert_eq!(job_id, "doc-test-123");

    // Retrieve evidence job
    let job = repo.get_evidence_by_id(&job_id).await.unwrap().unwrap();
    assert_eq!(job.id, "doc-test-123");
    assert_eq!(job.status, "queued");
    assert_eq!(job.attempts, 0);

    // Update job status
    repo.mark_in_progress(&job_id).await.unwrap();
    let job = repo.get_evidence_by_id(&job_id).await.unwrap().unwrap();
    assert_eq!(job.status, "in_progress");

    // Complete the job
    repo.mark_completed(&job_id).await.unwrap();
    let job = repo.get_evidence_by_id(&job_id).await.unwrap().unwrap();
    assert_eq!(job.status, "done");
}

/// Example: Error handling patterns
///
/// This example demonstrates proper error handling when working
/// with the repository and connection management.
#[tokio::test]
async fn example_error_handling() {
    let temp_db = NamedTempFile::new().unwrap();
    let db_path = temp_db.path().to_str().unwrap();
    let db_url = DatabaseUrlBuilder::sqlite(db_path);

    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect(&db_url)
        .await
        .unwrap();

    let repo = EvidenceRepository::new(pool);
    repo.ensure_schema().await.unwrap();

    // Test duplicate job creation
    let evidence = EvidenceIn {
        id: Some("duplicate-test".to_string()),
        digest_hex: "abcd1234".to_string(),
        payload_mime: None,
        metadata: None,
    };

    // First creation should succeed
    let job_id = repo.create_evidence_job(&evidence).await.unwrap();
    assert_eq!(job_id, "duplicate-test");

    // Second creation should fail with conflict
    let result = repo.create_evidence_job(&evidence).await;
    assert!(matches!(result, Err(RepositoryError::Conflict(_))));

    // Test not found error
    let result = repo.get_evidence_by_id("non-existent").await.unwrap();
    assert!(result.is_none());

    // Test updating non-existent job
    let result = repo.mark_completed("non-existent").await;
    assert!(matches!(result, Err(RepositoryError::NotFound(_))));
}

/// Example: Pagination and listing
///
/// This example shows how to implement pagination for evidence jobs
/// and retrieve job statistics.
#[tokio::test]
async fn example_pagination_and_statistics() {
    let temp_db = NamedTempFile::new().unwrap();
    let db_path = temp_db.path().to_str().unwrap();
    let db_url = DatabaseUrlBuilder::sqlite(db_path);

    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect(&db_url)
        .await
        .unwrap();

    let repo = EvidenceRepository::new(pool);
    repo.ensure_schema().await.unwrap();

    // Create multiple evidence jobs
    for i in 0..5 {
        let evidence = EvidenceIn {
            id: Some(format!("pagination-test-{}", i)),
            digest_hex: format!("hash{}", i),
            payload_mime: None,
            metadata: None,
        };
        repo.create_evidence_job(&evidence).await.unwrap();
    }

    // Test pagination
    let (jobs, total) = repo.list_evidence_jobs(2, 0).await.unwrap();
    assert_eq!(jobs.len(), 2);
    assert_eq!(total, 5);

    // Test second page
    let (jobs, total) = repo.list_evidence_jobs(2, 2).await.unwrap();
    assert_eq!(jobs.len(), 2);
    assert_eq!(total, 5);

    // Test job statistics
    let stats = repo.get_job_stats().await.unwrap();
    assert_eq!(stats.total, 5);
    assert_eq!(stats.queued, 5);
    assert_eq!(stats.done, 0);
}

/// Example: Job processing workflow
///
/// This example demonstrates a complete job processing workflow
/// including fetching ready jobs and updating their status.
#[tokio::test]
async fn example_job_processing_workflow() {
    let temp_db = NamedTempFile::new().unwrap();
    let db_path = temp_db.path().to_str().unwrap();
    let db_url = DatabaseUrlBuilder::sqlite(db_path);

    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect(&db_url)
        .await
        .unwrap();

    let repo = EvidenceRepository::new(pool);
    repo.ensure_schema().await.unwrap();

    // Create some evidence jobs
    for i in 0..3 {
        let evidence = EvidenceIn {
            id: Some(format!("workflow-test-{}", i)),
            digest_hex: format!("workflow-hash{}", i),
            payload_mime: None,
            metadata: None,
        };
        repo.create_evidence_job(&evidence).await.unwrap();
    }

    // Get ready jobs for processing
    let ready_jobs = repo.get_ready_jobs(10).await.unwrap();
    assert_eq!(ready_jobs.len(), 3);

    // Process each job
    for job in ready_jobs {
        // Mark as in progress
        repo.mark_in_progress(&job.id).await.unwrap();

        // Simulate processing (in real scenario, this would be actual work)
        tokio::time::sleep(Duration::from_millis(10)).await;

        // Mark as completed
        repo.mark_completed(&job.id).await.unwrap();
    }

    // Verify all jobs are completed
    let stats = repo.get_job_stats().await.unwrap();
    assert_eq!(stats.total, 3);
    assert_eq!(stats.done, 3);
    assert_eq!(stats.queued, 0);
}

/// Example: Database URL building
///
/// This example shows different ways to build database URLs
/// for various environments and use cases.
#[test]
fn example_database_url_building() {
    // SQLite file database
    let file_url = DatabaseUrlBuilder::sqlite("data/evidence.db");
    assert_eq!(file_url, "sqlite://data/evidence.db");

    // In-memory database
    let memory_url = DatabaseUrlBuilder::sqlite_memory();
    assert_eq!(memory_url, "sqlite://:memory:");

    // Temporary database
    let temp_url = DatabaseUrlBuilder::sqlite_temp().unwrap();
    assert!(temp_url.starts_with("sqlite://"));
    assert!(temp_url.contains("phoenix_evidence.db"));
}

/// Example: Connection health monitoring
///
/// This example demonstrates how to monitor database connection health
/// and implement proper monitoring for production systems.
#[tokio::test]
async fn example_connection_health_monitoring() {
    let temp_db = NamedTempFile::new().unwrap();
    let db_path = temp_db.path().to_str().unwrap();
    let db_url = DatabaseUrlBuilder::sqlite(db_path);

    let manager = ConnectionManager::new(&db_url).await.unwrap();

    // Perform health check
    let health = HealthChecker::check_health(manager.pool()).await.unwrap();

    // Verify health status
    assert!(health.is_healthy);
    assert!(health.response_time < Duration::from_secs(1));
    assert!(health.table_count >= 0);

    // Check that timestamp is recent
    let now = chrono::Utc::now();
    let time_diff = now.signed_duration_since(health.timestamp);
    assert!(time_diff.num_seconds() < 5);
}

/// Example: Migration status checking
///
/// This example shows how to check migration status and handle
/// migration-related operations in production environments.
#[tokio::test]
async fn example_migration_status_checking() {
    let temp_db = NamedTempFile::new().unwrap();
    let db_path = temp_db.path().to_str().unwrap();
    let db_url = DatabaseUrlBuilder::sqlite(db_path);

    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect(&db_url)
        .await
        .unwrap();

    let migration_manager = MigrationManager::new(pool);

    // Check initial status (should be up to date after migrations)
    migration_manager.migrate().await.unwrap();
    assert!(migration_manager.is_up_to_date().await.unwrap());

    // Get detailed migration status
    let status = migration_manager.get_status().await.unwrap();
    assert!(status.is_up_to_date);
    assert_eq!(status.current_version, status.latest_version);
    assert_eq!(status.applied_migrations.len(), status.latest_version as usize);
    // Verify base migrations are recorded
    assert!(status
        .applied_migrations
        .iter()
        .any(|m| m.name == "initial_schema"));
    assert!(status
        .applied_migrations
        .iter()
        .any(|m| m.name == "add_tx_refs_table"));
    assert!(status
        .applied_migrations
        .iter()
        .any(|m| m.name == "add_job_indexes"));
    assert!(status
        .applied_migrations
        .iter()
        .any(|m| m.name == "add_tx_refs_indexes"));
        
    // Verify new migrations are present
    assert!(status
        .applied_migrations
        .iter()
        .any(|m| m.name == "add_countermeasure_deployments_table"));
    assert!(status
        .applied_migrations
        .iter()
        .any(|m| m.name == "add_signal_disruption_audit_table"));
    assert!(status
        .applied_migrations
        .iter()
        .any(|m| m.name == "add_jamming_operations_table"));
}
