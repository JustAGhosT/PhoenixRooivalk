pub mod model {
    use chrono::{DateTime, Utc};
    use serde::{Deserialize, Serialize};

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
    pub struct EvidenceDigest {
        pub algo: DigestAlgo,
        pub hex: String,
    }

    #[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq)]
    #[serde(rename_all = "lowercase")]
    pub enum DigestAlgo {
        Sha256,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
    pub struct EvidenceRecord {
        pub id: String,
        pub created_at: DateTime<Utc>,
        pub digest: EvidenceDigest,
        pub payload_mime: Option<String>,
        pub metadata: serde_json::Value,
    }

    #[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
    pub struct ChainTxRef {
        pub network: String,
        pub chain: String,
        pub tx_id: String,
        pub confirmed: bool,
        pub timestamp: Option<DateTime<Utc>>,
    }
}

pub mod hash {
    use hex::ToHex;
    use sha2::{Digest, Sha256};

    pub fn sha256_hex(data: &[u8]) -> String {
        let mut hasher = Sha256::new();
        hasher.update(data);
        let out = hasher.finalize();
        out.encode_hex::<String>()
    }
}

pub mod convert {
    use super::model::*;

    /// Example converter from (python-like) dicts to strongly-typed records.
    pub fn from_map_to_evidence(mut m: serde_json::Map<String, serde_json::Value>) -> EvidenceRecord {
        let id = m.remove("id").and_then(|v| v.as_str().map(|s| s.to_string())).unwrap_or_default();
        let created_at = m
            .remove("created_at")
            .and_then(|v| v.as_str().and_then(|s| s.parse().ok()))
            .unwrap_or_else(chrono::Utc::now);
        let digest_hex = m
            .remove("digest_hex")
            .and_then(|v| v.as_str().map(|s| s.to_string()))
            .unwrap_or_default();
        let payload_mime = m
            .get("payload_mime")
            .and_then(|v| v.as_str().map(|s| s.to_string()));

        let digest = EvidenceDigest {
            algo: DigestAlgo::Sha256,
            hex: digest_hex,
        };

        EvidenceRecord {
            id,
            created_at,
            digest,
            payload_mime,
            metadata: serde_json::Value::Object(m),
        }
    }
}

pub mod anchor {
    use async_trait::async_trait;
    use super::model::*;

    #[derive(Debug, thiserror::Error)]
    pub enum AnchorError {
        #[error("network error: {0}")]
        Network(String),
        #[error("invalid state: {0}")]
        Invalid(String),
        #[error("provider: {0}")]
        Provider(String),
    }

    #[async_trait]
    pub trait AnchorProvider: Send + Sync {
        async fn anchor(&self, evidence: &EvidenceRecord) -> Result<ChainTxRef, AnchorError>;
        async fn confirm(&self, tx: &ChainTxRef) -> Result<ChainTxRef, AnchorError>;
    }
}
