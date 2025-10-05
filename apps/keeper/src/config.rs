use std::time::Duration;

#[derive(Debug, Clone)]
pub struct KeeperConfig {
    pub database_url: String,
    pub job_poll_interval: Duration,
    pub confirmation_poll_interval: Duration,
    pub http_port: u16,
    pub provider_config: ProviderConfig,
}

#[derive(Debug, Clone)]
pub enum ProviderConfig {
    Stub,
    Etherlink {
        endpoint: String,
        network: String,
        private_key: Option<String>,
    },
    Solana {
        endpoint: String,
        network: String,
    },
    Multi {
        etherlink: Option<EtherlinkConfig>,
        solana: Option<SolanaConfig>,
    },
}

#[derive(Debug, Clone)]
pub struct EtherlinkConfig {
    pub endpoint: String,
    pub network: String,
    pub private_key: Option<String>,
}

#[derive(Debug, Clone)]
pub struct SolanaConfig {
    pub endpoint: String,
    pub network: String,
}

impl Default for KeeperConfig {
    fn default() -> Self {
        Self {
            database_url: "sqlite://blockchain_outbox.sqlite3".to_string(),
            job_poll_interval: Duration::from_secs(5),
            confirmation_poll_interval: Duration::from_secs(30),
            http_port: 8081,
            provider_config: ProviderConfig::Stub,
        }
    }
}

impl KeeperConfig {
    pub fn from_env() -> Self {
        let mut config = Self::default();

        // Database
        if let Ok(db_url) = std::env::var("KEEPER_DB_URL") {
            config.database_url = db_url;
        }

        // Polling intervals
        if let Ok(poll_ms) = std::env::var("KEEPER_POLL_MS") {
            if let Ok(ms) = poll_ms.parse::<u64>() {
                config.job_poll_interval = Duration::from_millis(ms);
            }
        }

        if let Ok(confirm_ms) = std::env::var("KEEPER_CONFIRM_POLL_MS") {
            if let Ok(ms) = confirm_ms.parse::<u64>() {
                config.confirmation_poll_interval = Duration::from_millis(ms);
            }
        }

        // HTTP port
        if let Ok(port) = std::env::var("KEEPER_HTTP_PORT") {
            if let Ok(p) = port.parse::<u16>() {
                config.http_port = p;
            }
        }

        // Provider configuration
        config.provider_config = match std::env::var("KEEPER_PROVIDER").as_deref() {
            Ok("etherlink") => {
                let endpoint = std::env::var("ETHERLINK_ENDPOINT")
                    .unwrap_or_else(|_| "https://node.ghostnet.etherlink.com".to_string());
                let network =
                    std::env::var("ETHERLINK_NETWORK").unwrap_or_else(|_| "ghostnet".to_string());
                let private_key = std::env::var("ETHERLINK_PRIVATE_KEY").ok();

                ProviderConfig::Etherlink {
                    endpoint,
                    network,
                    private_key,
                }
            }
            Ok("solana") => {
                let endpoint = std::env::var("SOLANA_ENDPOINT")
                    .unwrap_or_else(|_| "https://api.devnet.solana.com".to_string());
                let network =
                    std::env::var("SOLANA_NETWORK").unwrap_or_else(|_| "devnet".to_string());

                ProviderConfig::Solana { endpoint, network }
            }
            Ok("multi") => {
                let etherlink = if std::env::var("ETHERLINK_ENDPOINT").is_ok() {
                    Some(EtherlinkConfig {
                        endpoint: std::env::var("ETHERLINK_ENDPOINT").unwrap(),
                        network: std::env::var("ETHERLINK_NETWORK")
                            .unwrap_or_else(|_| "ghostnet".to_string()),
                        private_key: std::env::var("ETHERLINK_PRIVATE_KEY").ok(),
                    })
                } else {
                    None
                };

                let solana = if std::env::var("SOLANA_ENDPOINT").is_ok() {
                    Some(SolanaConfig {
                        endpoint: std::env::var("SOLANA_ENDPOINT").unwrap(),
                        network: std::env::var("SOLANA_NETWORK")
                            .unwrap_or_else(|_| "devnet".to_string()),
                    })
                } else {
                    None
                };

                ProviderConfig::Multi { etherlink, solana }
            }
            _ => ProviderConfig::Stub,
        };

        config
    }

    pub fn is_postgres(&self) -> bool {
        self.database_url.starts_with("postgres://")
            || self.database_url.starts_with("postgresql://")
    }
}
