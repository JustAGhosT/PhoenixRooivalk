use sqlx::{sqlite::SqlitePoolOptions, Pool, Row, Sqlite};
use std::time::Duration;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum ConnectionError {
    #[error("Database connection error: {0}")]
    Database(#[from] sqlx::Error),
    #[error("Configuration error: {0}")]
    Configuration(String),
}

pub type Result<T> = std::result::Result<T, ConnectionError>;

/// Database connection pool configuration
#[derive(Debug, Clone)]
pub struct ConnectionConfig {
    pub max_connections: u32,
    pub min_connections: u32,
    pub acquire_timeout: Duration,
    pub idle_timeout: Duration,
    pub max_lifetime: Duration,
    pub test_before_acquire: bool,
}

impl Default for ConnectionConfig {
    fn default() -> Self {
        Self {
            max_connections: 10,
            min_connections: 1,
            acquire_timeout: Duration::from_secs(30),
            idle_timeout: Duration::from_secs(600),
            max_lifetime: Duration::from_secs(1800),
            test_before_acquire: true,
        }
    }
}

/// Database connection manager
pub struct ConnectionManager {
    pool: Pool<Sqlite>,
    config: ConnectionConfig,
}

impl ConnectionManager {
    /// Create a new connection manager with default configuration
    pub async fn new(database_url: &str) -> Result<Self> {
        Self::with_config(database_url, ConnectionConfig::default()).await
    }

    /// Create a new connection manager with custom configuration
    pub async fn with_config(database_url: &str, config: ConnectionConfig) -> Result<Self> {
        let pool = SqlitePoolOptions::new()
            .max_connections(config.max_connections)
            .min_connections(config.min_connections)
            .acquire_timeout(config.acquire_timeout)
            .idle_timeout(config.idle_timeout)
            .max_lifetime(config.max_lifetime)
            .test_before_acquire(config.test_before_acquire)
            .connect(database_url)
            .await?;

        Ok(Self { pool, config })
    }

    /// Get the connection pool
    pub fn pool(&self) -> &Pool<Sqlite> {
        &self.pool
    }

    /// Get connection pool statistics
    pub async fn get_stats(&self) -> Result<PoolStats> {
        let size = self.pool.size();
        let idle = self.pool.num_idle();
        let active = size - idle as u32;

        Ok(PoolStats {
            size,
            idle: idle as u32,
            active,
            max_connections: self.config.max_connections,
        })
    }

    /// Test the database connection
    pub async fn test_connection(&self) -> Result<()> {
        sqlx::query("SELECT 1").fetch_one(&self.pool).await?;
        Ok(())
    }

    /// Close all connections
    pub async fn close(&self) {
        self.pool.close().await;
    }
}

/// Connection pool statistics
#[derive(Debug, Clone)]
pub struct PoolStats {
    pub size: u32,
    pub idle: u32,
    pub active: u32,
    pub max_connections: u32,
}

/// Database URL builder for different environments
pub struct DatabaseUrlBuilder;

impl DatabaseUrlBuilder {
    /// Build database URL from environment variables
    pub fn from_env() -> Result<String> {
        let db_url = std::env::var("API_DB_URL")
            .or_else(|_| std::env::var("DATABASE_URL"))
            .map_err(|_| {
                ConnectionError::Configuration(
                    "Neither API_DB_URL nor DATABASE_URL environment variable is set".to_string(),
                )
            })?;

        Ok(db_url)
    }

    /// Build SQLite database URL
    pub fn sqlite(path: &str) -> String {
        format!("sqlite://{}", path)
    }

    /// Build in-memory SQLite database URL
    pub fn sqlite_memory() -> String {
        "sqlite://:memory:".to_string()
    }

    /// Build temporary SQLite database URL
    pub fn sqlite_temp() -> Result<String> {
        let temp_dir = std::env::temp_dir();
        let temp_file = temp_dir.join("phoenix_evidence.db");
        Ok(Self::sqlite(temp_file.to_str().unwrap()))
    }
}

/// Health check for database connections
pub struct HealthChecker;

impl HealthChecker {
    /// Perform a comprehensive health check
    pub async fn check_health(pool: &Pool<Sqlite>) -> Result<HealthStatus> {
        let start = std::time::Instant::now();

        // Test basic connectivity
        sqlx::query("SELECT 1").fetch_one(pool).await?;

        let response_time = start.elapsed();

        // Check if we can perform a simple query
        let result = sqlx::query("SELECT COUNT(*) FROM sqlite_master WHERE type='table'")
            .fetch_one(pool)
            .await?;
        let table_count: i64 = result.get(0);

        Ok(HealthStatus {
            is_healthy: true,
            response_time,
            table_count,
            timestamp: chrono::Utc::now(),
        })
    }
}

/// Health status information
#[derive(Debug, Clone)]
pub struct HealthStatus {
    pub is_healthy: bool,
    pub response_time: Duration,
    pub table_count: i64,
    pub timestamp: chrono::DateTime<chrono::Utc>,
}

#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::NamedTempFile;

    #[tokio::test]
    async fn test_connection_manager() {
        let temp_db = NamedTempFile::new().unwrap();
        let db_path = temp_db.path().to_str().unwrap();
        let db_url = DatabaseUrlBuilder::sqlite(db_path);

        let manager = ConnectionManager::new(&db_url).await.unwrap();

        // Test connection
        manager.test_connection().await.unwrap();

        // Get stats
        let stats = manager.get_stats().await.unwrap();
        assert!(stats.size >= 1);
        // Verify stats are valid (idle is always >= 0 for u32)
        assert!(stats.idle <= stats.size);
    }

    #[tokio::test]
    async fn test_connection_config() {
        let temp_db = NamedTempFile::new().unwrap();
        let db_path = temp_db.path().to_str().unwrap();
        let db_url = DatabaseUrlBuilder::sqlite(db_path);

        let config = ConnectionConfig {
            max_connections: 5,
            min_connections: 1,
            acquire_timeout: Duration::from_secs(10),
            idle_timeout: Duration::from_secs(300),
            max_lifetime: Duration::from_secs(900),
            test_before_acquire: true,
        };

        let manager = ConnectionManager::with_config(&db_url, config)
            .await
            .unwrap();
        let stats = manager.get_stats().await.unwrap();
        assert_eq!(stats.max_connections, 5);
    }

    #[tokio::test]
    async fn test_health_check() {
        let temp_db = NamedTempFile::new().unwrap();
        let db_path = temp_db.path().to_str().unwrap();
        let db_url = DatabaseUrlBuilder::sqlite(db_path);

        let manager = ConnectionManager::new(&db_url).await.unwrap();
        let health = HealthChecker::check_health(manager.pool()).await.unwrap();

        assert!(health.is_healthy);
        assert!(health.response_time < Duration::from_secs(1));
    }

    #[test]
    fn test_database_url_builder() {
        assert_eq!(DatabaseUrlBuilder::sqlite("test.db"), "sqlite://test.db");
        assert_eq!(DatabaseUrlBuilder::sqlite_memory(), "sqlite://:memory:");

        let temp_url = DatabaseUrlBuilder::sqlite_temp().unwrap();
        assert!(temp_url.starts_with("sqlite://"));
        assert!(temp_url.contains("phoenix_evidence.db"));
    }
}
