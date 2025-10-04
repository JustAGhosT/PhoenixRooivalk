use sqlx::{Pool, Row, Sqlite};
use thiserror::Error;

#[derive(Error, Debug)]
pub enum MigrationError {
    #[error("Database error: {0}")]
    Database(#[from] sqlx::Error),
    #[error("Migration error: {0}")]
    Migration(String),
}

pub type Result<T> = std::result::Result<T, MigrationError>;

/// Database migration system
/// Handles schema versioning and migrations
pub struct MigrationManager {
    pool: Pool<Sqlite>,
}

impl MigrationManager {
    pub fn new(pool: Pool<Sqlite>) -> Self {
        Self { pool }
    }

    /// Initialize migration tracking table
    async fn init_migration_table(&self) -> Result<()> {
        sqlx::query(
            r#"
            CREATE TABLE IF NOT EXISTS schema_migrations (
                version INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                applied_at INTEGER NOT NULL
            );
            "#,
        )
        .execute(&self.pool)
        .await?;

        Ok(())
    }

    /// Get current schema version
    async fn get_current_version(&self) -> Result<i32> {
        let result = sqlx::query_scalar::<_, i32>("SELECT MAX(version) FROM schema_migrations")
            .fetch_optional(&self.pool)
            .await?;

        Ok(result.unwrap_or(0))
    }

    /// Apply a migration
    async fn apply_migration(&self, version: i32, name: &str, sql: &str) -> Result<()> {
        let mut tx = self.pool.begin().await?;

        // Execute the migration SQL
        sqlx::query(sql).execute(&mut *tx).await?;

        // Record the migration
        let now = chrono::Utc::now().timestamp_millis();
        sqlx::query(
            "INSERT OR IGNORE INTO schema_migrations (version, name, applied_at) VALUES (?1, ?2, ?3)"
        )
        .bind(version)
        .bind(name)
        .bind(now)
        .execute(&mut *tx)
        .await?;

        tx.commit().await?;
        Ok(())
    }

    /// Run all pending migrations
    pub async fn migrate(&self) -> Result<()> {
        self.init_migration_table().await?;
        let current_version = self.get_current_version().await?;

        // Define migrations
        let migrations = vec![
            Migration {
                version: 1,
                name: "initial_schema",
                sql: r#"
                CREATE TABLE IF NOT EXISTS outbox_jobs (
                    id TEXT PRIMARY KEY,
                    payload_sha256 TEXT NOT NULL,
                    status TEXT NOT NULL DEFAULT 'queued',
                    attempts INTEGER NOT NULL DEFAULT 0,
                    last_error TEXT,
                    created_ms INTEGER NOT NULL,
                    updated_ms INTEGER NOT NULL,
                    next_attempt_ms INTEGER NOT NULL DEFAULT 0
                );
                "#,
            },
            Migration {
                version: 2,
                name: "add_tx_refs_table",
                sql: r#"
                CREATE TABLE IF NOT EXISTS outbox_tx_refs (
                    job_id TEXT NOT NULL,
                    network TEXT NOT NULL,
                    chain TEXT NOT NULL,
                    tx_id TEXT NOT NULL,
                    confirmed INTEGER NOT NULL,
                    timestamp INTEGER,
                    PRIMARY KEY (job_id, network, chain)
                );
                "#,
            },
            Migration {
                version: 3,
                name: "add_job_indexes",
                sql: r#"
                CREATE INDEX IF NOT EXISTS idx_outbox_jobs_status ON outbox_jobs(status);
                CREATE INDEX IF NOT EXISTS idx_outbox_jobs_created_ms ON outbox_jobs(created_ms);
                CREATE INDEX IF NOT EXISTS idx_outbox_jobs_next_attempt ON outbox_jobs(next_attempt_ms);
                "#,
            },
            Migration {
                version: 4,
                name: "add_tx_refs_indexes",
                sql: r#"
                CREATE INDEX IF NOT EXISTS idx_outbox_tx_refs_job_id ON outbox_tx_refs(job_id);
                CREATE INDEX IF NOT EXISTS idx_outbox_tx_refs_confirmed ON outbox_tx_refs(confirmed);
                "#,
            },
        ];

        // Apply pending migrations
        for migration in migrations {
            if migration.version > current_version {
                tracing::info!("Applying migration {}: {}", migration.version, migration.name);
                self.apply_migration(migration.version, migration.name, migration.sql).await?;
            }
        }

        Ok(())
    }

    /// Check if migrations are up to date
    pub async fn is_up_to_date(&self) -> Result<bool> {
        self.init_migration_table().await?;
        let current_version = self.get_current_version().await?;
        let latest_version = 4; // Update this when adding new migrations
        Ok(current_version >= latest_version)
    }

    /// Get migration status
    pub async fn get_status(&self) -> Result<MigrationStatus> {
        self.init_migration_table().await?;
        let current_version = self.get_current_version().await?;
        let latest_version = 4;

        let migrations = sqlx::query(
            "SELECT version, name, applied_at FROM schema_migrations ORDER BY version"
        )
        .fetch_all(&self.pool)
        .await?;

        let applied_migrations = migrations
            .into_iter()
            .map(|row| AppliedMigration {
                version: row.get::<i32, _>(0),
                name: row.get::<String, _>(1),
                applied_at: row.get::<i64, _>(2),
            })
            .collect();

        Ok(MigrationStatus {
            current_version,
            latest_version,
            is_up_to_date: current_version >= latest_version,
            applied_migrations,
        })
    }
}

struct Migration {
    version: i32,
    name: &'static str,
    sql: &'static str,
}

#[derive(Debug, Clone)]
pub struct AppliedMigration {
    pub version: i32,
    pub name: String,
    pub applied_at: i64,
}

#[derive(Debug, Clone)]
pub struct MigrationStatus {
    pub current_version: i32,
    pub latest_version: i32,
    pub is_up_to_date: bool,
    pub applied_migrations: Vec<AppliedMigration>,
}

#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::NamedTempFile;
    use sqlx::sqlite::SqlitePoolOptions;

    async fn create_test_pool() -> Pool<Sqlite> {
        let temp_db = NamedTempFile::new().unwrap();
        let db_path = temp_db.path().to_str().unwrap();
        let db_url = format!("sqlite://{}", db_path);
        
        SqlitePoolOptions::new()
            .max_connections(1)
            .connect(&db_url)
            .await
            .unwrap()
    }

    #[tokio::test]
    async fn test_migration_system() {
        let pool = create_test_pool().await;
        let migration_manager = MigrationManager::new(pool);

        // Run migrations
        migration_manager.migrate().await.unwrap();

        // Check status
        let status = migration_manager.get_status().await.unwrap();
        assert!(status.is_up_to_date);
        assert_eq!(status.current_version, 4);
        assert_eq!(status.applied_migrations.len(), 4);

        // Verify tables exist
        let tables = sqlx::query("SELECT name FROM sqlite_master WHERE type='table'")
            .fetch_all(&migration_manager.pool)
            .await
            .unwrap();

        let table_names: Vec<String> = tables
            .into_iter()
            .map(|row| row.get::<String, _>(0))
            .collect();

        assert!(table_names.contains(&"outbox_jobs".to_string()));
        assert!(table_names.contains(&"outbox_tx_refs".to_string()));
        assert!(table_names.contains(&"schema_migrations".to_string()));
    }

    #[tokio::test]
    async fn test_migration_idempotency() {
        let pool = create_test_pool().await;
        let migration_manager = MigrationManager::new(pool);

        // Run migrations twice
        migration_manager.migrate().await.unwrap();
        migration_manager.migrate().await.unwrap();

        // Should still be up to date
        assert!(migration_manager.is_up_to_date().await.unwrap());
    }
}
