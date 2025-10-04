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
    pub fn from_map_to_evidence(
        mut m: serde_json::Map<String, serde_json::Value>,
    ) -> EvidenceRecord {
        let id = m
            .remove("id")
            .and_then(|v| v.as_str().map(|s| s.to_string()))
            .unwrap_or_default();
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
    use super::model::*;
    use async_trait::async_trait;

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

#[cfg(test)]
mod tests {
    use super::*;
    use chrono::Utc;
    use serde_json::json;

    #[test]
    fn test_sha256_hex() {
        // Test with empty input
        assert_eq!(hash::sha256_hex(b""), "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
        
        // Test with simple string
        assert_eq!(hash::sha256_hex(b"hello"), "2cf24dba4f6972e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3");
        
        // Test with binary data
        let binary_data = vec![0x00, 0x01, 0x02, 0x03, 0xff];
        let result = hash::sha256_hex(&binary_data);
        assert_eq!(result.len(), 64); // SHA256 produces 64 hex characters
        assert!(result.chars().all(|c| c.is_ascii_hexdigit()));
    }

    #[test]
    fn test_evidence_digest() {
        let digest = model::EvidenceDigest {
            algo: model::DigestAlgo::Sha256,
            hex: "abcd1234".to_string(),
        };
        
        assert_eq!(digest.algo, model::DigestAlgo::Sha256);
        assert_eq!(digest.hex, "abcd1234");
    }

    #[test]
    fn test_evidence_record() {
        let now = Utc::now();
        let digest = model::EvidenceDigest {
            algo: model::DigestAlgo::Sha256,
            hex: "abcd1234".to_string(),
        };
        
        let record = model::EvidenceRecord {
            id: "test-id".to_string(),
            created_at: now,
            digest: digest.clone(),
            payload_mime: Some("application/json".to_string()),
            metadata: json!({"key": "value"}),
        };
        
        assert_eq!(record.id, "test-id");
        assert_eq!(record.digest, digest);
        assert_eq!(record.payload_mime, Some("application/json".to_string()));
    }

    #[test]
    fn test_chain_tx_ref() {
        let now = Utc::now();
        let tx_ref = model::ChainTxRef {
            network: "ethereum".to_string(),
            chain: "mainnet".to_string(),
            tx_id: "0x1234567890abcdef".to_string(),
            confirmed: false,
            timestamp: Some(now),
        };
        
        assert_eq!(tx_ref.network, "ethereum");
        assert_eq!(tx_ref.chain, "mainnet");
        assert_eq!(tx_ref.tx_id, "0x1234567890abcdef");
        assert!(!tx_ref.confirmed);
        assert_eq!(tx_ref.timestamp, Some(now));
    }

    #[test]
    fn test_from_map_to_evidence() {
        let mut map = serde_json::Map::new();
        map.insert("id".to_string(), json!("test-evidence-123"));
        map.insert("digest_hex".to_string(), json!("abcd1234efgh5678"));
        map.insert("payload_mime".to_string(), json!("application/json"));
        map.insert("custom_field".to_string(), json!("custom_value"));
        
        let evidence = convert::from_map_to_evidence(map);
        
        assert_eq!(evidence.id, "test-evidence-123");
        assert_eq!(evidence.digest.hex, "abcd1234efgh5678");
        assert_eq!(evidence.digest.algo, model::DigestAlgo::Sha256);
        assert_eq!(evidence.payload_mime, Some("application/json".to_string()));
        assert_eq!(evidence.metadata["custom_field"], json!("custom_value"));
    }

    #[test]
    fn test_from_map_to_evidence_minimal() {
        let map = serde_json::Map::new();
        let evidence = convert::from_map_to_evidence(map);
        
        assert_eq!(evidence.id, "");
        assert_eq!(evidence.digest.hex, "");
        assert_eq!(evidence.digest.algo, model::DigestAlgo::Sha256);
        assert_eq!(evidence.payload_mime, None);
        assert!(evidence.metadata.as_object().unwrap().is_empty());
    }

    #[test]
    fn test_anchor_error() {
        let network_err = anchor::AnchorError::Network("connection failed".to_string());
        assert!(matches!(network_err, anchor::AnchorError::Network(_)));
        
        let invalid_err = anchor::AnchorError::Invalid("bad state".to_string());
        assert!(matches!(invalid_err, anchor::AnchorError::Invalid(_)));
        
        let provider_err = anchor::AnchorError::Provider("service down".to_string());
        assert!(matches!(provider_err, anchor::AnchorError::Provider(_)));
    }

    #[test]
    fn test_evidence_record_serialization() {
        let now = Utc::now();
        let digest = model::EvidenceDigest {
            algo: model::DigestAlgo::Sha256,
            hex: "abcd1234".to_string(),
        };
        
        let record = model::EvidenceRecord {
            id: "test-id".to_string(),
            created_at: now,
            digest,
            payload_mime: Some("application/json".to_string()),
            metadata: json!({"key": "value"}),
        };
        
        // Test JSON serialization
        let json_str = serde_json::to_string(&record).unwrap();
        assert!(json_str.contains("test-id"));
        assert!(json_str.contains("abcd1234"));
        assert!(json_str.contains("application/json"));
        
        // Test JSON deserialization
        let deserialized: model::EvidenceRecord = serde_json::from_str(&json_str).unwrap();
        assert_eq!(deserialized.id, record.id);
        assert_eq!(deserialized.digest.hex, record.digest.hex);
        assert_eq!(deserialized.payload_mime, record.payload_mime);
    }

    #[test]
    fn test_chain_tx_ref_serialization() {
        let now = Utc::now();
        let tx_ref = model::ChainTxRef {
            network: "ethereum".to_string(),
            chain: "mainnet".to_string(),
            tx_id: "0x1234567890abcdef".to_string(),
            confirmed: true,
            timestamp: Some(now),
        };
        
        // Test JSON serialization
        let json_str = serde_json::to_string(&tx_ref).unwrap();
        assert!(json_str.contains("ethereum"));
        assert!(json_str.contains("mainnet"));
        assert!(json_str.contains("0x1234567890abcdef"));
        assert!(json_str.contains("true"));
        
        // Test JSON deserialization
        let deserialized: model::ChainTxRef = serde_json::from_str(&json_str).unwrap();
        assert_eq!(deserialized.network, tx_ref.network);
        assert_eq!(deserialized.chain, tx_ref.chain);
        assert_eq!(deserialized.tx_id, tx_ref.tx_id);
        assert_eq!(deserialized.confirmed, tx_ref.confirmed);
        assert_eq!(deserialized.timestamp, tx_ref.timestamp);
    }
}
