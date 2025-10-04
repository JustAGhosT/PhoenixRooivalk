# Database Access Patterns in Rust

This document outlines the common database access patterns and best practices used in the Phoenix Evidence API.

## Architecture Overview

The database layer follows a layered architecture:

```
┌─────────────────────────────────────┐
│           HTTP Handlers              │
├─────────────────────────────────────┤
│           Repository Layer           │
├─────────────────────────────────────┤
│         Connection Manager          │
├─────────────────────────────────────┤
│         Migration System            │
├─────────────────────────────────────┤
│           SQLx Pool                 │
└─────────────────────────────────────┘
```

## Core Components

### 1. Connection Manager (`connection.rs`)

**Purpose**: Manages database connection pools with proper configuration.

**Key Features**:
- Connection pool configuration
- Health checking
- Statistics monitoring
- Environment-based URL building

**Usage**:
```rust
use phoenix_api::connection::{ConnectionManager, ConnectionConfig};

// Default configuration
let manager = ConnectionManager::new(&database_url).await?;

// Custom configuration
let config = ConnectionConfig {
    max_connections: 20,
    min_connections: 2,
    acquire_timeout: Duration::from_secs(30),
    idle_timeout: Duration::from_secs(600),
    max_lifetime: Duration::from_secs(1800),
    test_before_acquire: true,
};
let manager = ConnectionManager::with_config(&database_url, config).await?;
```

### 2. Migration System (`migrations.rs`)

**Purpose**: Handles database schema versioning and migrations.

**Key Features**:
- Versioned migrations
- Idempotent operations
- Migration status tracking
- Rollback support (planned)

**Usage**:
```rust
use phoenix_api::migrations::MigrationManager;

let migration_manager = MigrationManager::new(pool);
migration_manager.migrate().await?;

// Check status
let status = migration_manager.get_status().await?;
println!("Current version: {}", status.current_version);
```

### 3. Repository Pattern (`repository.rs`)

**Purpose**: Provides a clean abstraction over database operations.

**Key Features**:
- Type-safe database operations
- Proper error handling
- Transaction support
- Business logic encapsulation

**Usage**:
```rust
use phoenix_api::repository::{EvidenceRepository, RepositoryError};

let repo = EvidenceRepository::new(pool);

// Create evidence job
let evidence = EvidenceIn {
    id: Some("test-123".to_string()),
    digest_hex: "abcd1234".to_string(),
    payload_mime: Some("application/json".to_string()),
    metadata: Some(serde_json::json!({"key": "value"})),
};

let job_id = repo.create_evidence_job(&evidence).await?;

// Get job status
let job = repo.get_evidence_by_id(&job_id).await?;
```

## Common Database Patterns

### 1. Connection Pool Management

**Pattern**: Use connection pools for efficient database access.

```rust
// Good: Use connection pools
let pool = SqlitePoolOptions::new()
    .max_connections(10)
    .min_connections(1)
    .acquire_timeout(Duration::from_secs(30))
    .connect(&database_url)
    .await?;

// Bad: Create new connections for each request
let conn = SqliteConnectOptions::new()
    .create_if_missing(true)
    .connect(&database_url)
    .await?;
```

### 2. Error Handling

**Pattern**: Use custom error types for better error handling.

```rust
#[derive(Error, Debug)]
pub enum RepositoryError {
    #[error("Database error: {0}")]
    Database(#[from] sqlx::Error),
    #[error("Validation error: {0}")]
    Validation(String),
    #[error("Not found: {0}")]
    NotFound(String),
    #[error("Conflict: {0}")]
    Conflict(String),
}

// Usage
match repo.create_evidence_job(&evidence).await {
    Ok(job_id) => Ok(job_id),
    Err(RepositoryError::Conflict(msg)) => {
        // Handle conflict specifically
        Err(Status::CONFLICT)
    }
    Err(e) => {
        // Handle other errors
        Err(Status::INTERNAL_SERVER_ERROR)
    }
}
```

### 3. Transaction Management

**Pattern**: Use transactions for complex operations.

```rust
// Good: Use transactions for multi-step operations
pub async fn create_evidence_with_metadata(
    &self,
    evidence: &EvidenceIn,
    metadata: &serde_json::Value,
) -> Result<String> {
    let mut tx = self.pool.begin().await?;
    
    // Create evidence job
    let (mut tx, job_id) = self.create_evidence_job_tx(evidence).await?;
    
    // Store metadata
    self.store_metadata_tx(&mut tx, &job_id, metadata).await?;
    
    tx.commit().await?;
    Ok(job_id)
}
```

### 4. Query Optimization

**Pattern**: Use proper indexing and query optimization.

```sql
-- Good: Use indexes for common queries
CREATE INDEX IF NOT EXISTS idx_outbox_jobs_status ON outbox_jobs(status);
CREATE INDEX IF NOT EXISTS idx_outbox_jobs_created_ms ON outbox_jobs(created_ms);
CREATE INDEX IF NOT EXISTS idx_outbox_jobs_next_attempt ON outbox_jobs(next_attempt_ms);

-- Good: Use parameterized queries
SELECT * FROM outbox_jobs WHERE status = ?1 AND next_attempt_ms <= ?2;

-- Bad: String concatenation (SQL injection risk)
let query = format!("SELECT * FROM outbox_jobs WHERE status = '{}'", status);
```

### 5. Pagination

**Pattern**: Implement efficient pagination.

```rust
pub async fn list_evidence_jobs(
    &self,
    limit: i64,
    offset: i64,
) -> Result<(Vec<EvidenceOut>, i64)> {
    // Get total count
    let count_row = sqlx::query("SELECT COUNT(*) FROM outbox_jobs")
        .fetch_one(&self.pool)
        .await?;
    let total_count: i64 = count_row.get(0);

    // Get paginated results
    let rows = sqlx::query(
        "SELECT id, status, attempts, last_error, created_ms, updated_ms 
         FROM outbox_jobs 
         ORDER BY created_ms DESC 
         LIMIT ?1 OFFSET ?2"
    )
    .bind(limit)
    .bind(offset)
    .fetch_all(&self.pool)
    .await?;

    // Process results...
}
```

## Best Practices

### 1. Connection Pool Configuration

```rust
// Production settings
let config = ConnectionConfig {
    max_connections: 20,        // Adjust based on load
    min_connections: 2,        // Keep some connections warm
    acquire_timeout: Duration::from_secs(30),
    idle_timeout: Duration::from_secs(600),
    max_lifetime: Duration::from_secs(1800),
    test_before_acquire: true, // Ensure connections are healthy
};
```

### 2. Error Handling

```rust
// Good: Specific error handling
match repo.get_evidence_by_id(&id).await {
    Ok(Some(evidence)) => Ok(evidence),
    Ok(None) => Err(RepositoryError::NotFound(format!("Job {} not found", id))),
    Err(e) => Err(RepositoryError::Database(e)),
}

// Bad: Generic error handling
match repo.get_evidence_by_id(&id).await {
    Ok(evidence) => Ok(evidence),
    Err(e) => Err(e), // Loses context
}
```

### 3. Testing

```rust
#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::NamedTempFile;

    async fn create_test_repo() -> EvidenceRepository {
        let temp_db = NamedTempFile::new().unwrap();
        let db_path = temp_db.path().to_str().unwrap();
        let db_url = format!("sqlite://{}", db_path);
        
        let pool = SqlitePoolOptions::new()
            .max_connections(1)
            .connect(&db_url)
            .await
            .unwrap();
        
        let repo = EvidenceRepository::new(pool);
        repo.ensure_schema().await.unwrap();
        repo
    }

    #[tokio::test]
    async fn test_create_evidence_job() {
        let repo = create_test_repo().await;
        // Test implementation...
    }
}
```

### 4. Monitoring and Health Checks

```rust
// Health check endpoint
pub async fn health_check(pool: &Pool<Sqlite>) -> Result<HealthStatus> {
    let start = std::time::Instant::now();
    
    // Test basic connectivity
    sqlx::query("SELECT 1")
        .fetch_one(pool)
        .await?;

    let response_time = start.elapsed();
    
    Ok(HealthStatus {
        is_healthy: true,
        response_time,
        timestamp: chrono::Utc::now(),
    })
}
```

## Common Anti-Patterns to Avoid

### 1. Don't Create Connections Per Request

```rust
// Bad: New connection for each request
pub async fn get_evidence(id: &str) -> Result<EvidenceOut> {
    let conn = SqliteConnectOptions::new()
        .create_if_missing(true)
        .connect(&database_url)
        .await?;
    
    // Use connection...
}

// Good: Use connection pool
pub async fn get_evidence(pool: &Pool<Sqlite>, id: &str) -> Result<EvidenceOut> {
    // Use pool...
}
```

### 2. Don't Ignore Errors

```rust
// Bad: Ignoring errors
let _ = sqlx::query("INSERT INTO table VALUES (?)")
    .bind(value)
    .execute(pool)
    .await;

// Good: Handle errors properly
match sqlx::query("INSERT INTO table VALUES (?)")
    .bind(value)
    .execute(pool)
    .await
{
    Ok(result) => Ok(result.rows_affected()),
    Err(e) => Err(RepositoryError::Database(e)),
}
```

### 3. Don't Use String Concatenation for Queries

```rust
// Bad: SQL injection risk
let query = format!("SELECT * FROM table WHERE id = '{}'", id);

// Good: Use parameterized queries
let query = "SELECT * FROM table WHERE id = ?1";
```

## Performance Considerations

### 1. Connection Pool Sizing

- **Max Connections**: Set based on expected concurrent load
- **Min Connections**: Keep some connections warm for faster response
- **Acquire Timeout**: Set appropriate timeout for connection acquisition

### 2. Query Optimization

- Use indexes for frequently queried columns
- Use `LIMIT` and `OFFSET` for pagination
- Avoid `SELECT *` when possible
- Use prepared statements for repeated queries

### 3. Transaction Management

- Keep transactions short
- Use appropriate isolation levels
- Handle deadlocks gracefully
- Use connection pooling to avoid connection exhaustion

## Security Considerations

### 1. SQL Injection Prevention

- Always use parameterized queries
- Validate input data
- Use proper escaping for dynamic queries

### 2. Connection Security

- Use encrypted connections when possible
- Implement proper authentication
- Monitor connection usage

### 3. Data Protection

- Use proper access controls
- Implement audit logging
- Encrypt sensitive data at rest

This architecture provides a robust, scalable, and maintainable database access layer for the Phoenix Evidence API.
