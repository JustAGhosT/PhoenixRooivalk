//! Integration tests for the Phoenix Evidence crate
//! 
//! This module contains comprehensive integration tests that verify
//! the evidence processing, hashing, conversion, and anchoring functionality.

use phoenix_evidence::{
    model::{EvidenceRecord, EvidenceDigest, DigestAlgo, ChainTxRef},
    hash, convert, anchor::AnchorError,
};
use chrono::Utc;
use serde_json::json;

/// Test complete evidence processing workflow
#[test]
fn test_complete_evidence_processing_workflow() {
    // Test hash generation
    let test_data = b"test evidence data";
    let hash_result = hash::sha256_hex(test_data);
    assert_eq!(hash_result.len(), 64);
    assert!(hash_result.chars().all(|c| c.is_ascii_hexdigit()));
    
    // Test evidence record creation
    let evidence = EvidenceRecord {
        id: "workflow-test-123".to_string(),
        created_at: Utc::now(),
        digest: EvidenceDigest {
            algo: DigestAlgo::Sha256,
            hex: hash_result.clone(),
        },
        payload_mime: Some("application/json".to_string()),
        metadata: json!({
            "source": "integration_test",
            "priority": "high",
            "tags": ["test", "evidence", "workflow"]
        }),
    };
    
    // Test serialization
    let json_str = serde_json::to_string(&evidence).unwrap();
    assert!(json_str.contains("workflow-test-123"));
    assert!(json_str.contains(&hash_result));
    assert!(json_str.contains("application/json"));
    
    // Test deserialization
    let deserialized: EvidenceRecord = serde_json::from_str(&json_str).unwrap();
    assert_eq!(deserialized.id, evidence.id);
    assert_eq!(deserialized.digest.hex, evidence.digest.hex);
    assert_eq!(deserialized.payload_mime, evidence.payload_mime);
}

/// Test hash function with various inputs
#[test]
fn test_hash_function_various_inputs() {
    // Test empty input
    let empty_hash = hash::sha256_hex(b"");
    assert_eq!(empty_hash, "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
    
    // Test simple string
    let simple_hash = hash::sha256_hex(b"hello");
    assert_eq!(simple_hash, "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824");
    
    // Test binary data
    let binary_data = vec![0x00, 0x01, 0x02, 0x03, 0xff, 0xfe, 0xfd, 0xfc];
    let binary_hash = hash::sha256_hex(&binary_data);
    assert_eq!(binary_hash.len(), 64);
    assert!(binary_hash.chars().all(|c| c.is_ascii_hexdigit()));
    
    // Test large data
    let large_data = vec![0x42; 10000];
    let large_hash = hash::sha256_hex(&large_data);
    assert_eq!(large_hash.len(), 64);
    assert!(large_hash.chars().all(|c| c.is_ascii_hexdigit()));
    
    // Test unicode data
    let unicode_data = "Hello, 世界! 🌍".as_bytes();
    let unicode_hash = hash::sha256_hex(unicode_data);
    assert_eq!(unicode_hash.len(), 64);
    assert!(unicode_hash.chars().all(|c| c.is_ascii_hexdigit()));
}

/// Test evidence conversion from various input formats
#[test]
fn test_evidence_conversion_various_formats() {
    // Test full conversion
    let mut full_map = serde_json::Map::new();
    full_map.insert("id".to_string(), json!("conversion-test-123"));
    full_map.insert("digest_hex".to_string(), json!("abcd1234efgh5678"));
    full_map.insert("payload_mime".to_string(), json!("application/json"));
    full_map.insert("metadata".to_string(), json!({"key": "value"}));
    full_map.insert("custom_field".to_string(), json!("custom_value"));
    
    let full_evidence = convert::from_map_to_evidence(full_map);
    assert_eq!(full_evidence.id, "conversion-test-123");
    assert_eq!(full_evidence.digest.hex, "abcd1234efgh5678");
    assert_eq!(full_evidence.digest.algo, DigestAlgo::Sha256);
    assert_eq!(full_evidence.payload_mime, Some("application/json".to_string()));
    
    // Test minimal conversion
    let minimal_map = serde_json::Map::new();
    let minimal_evidence = convert::from_map_to_evidence(minimal_map);
    assert_eq!(minimal_evidence.id, "");
    assert_eq!(minimal_evidence.digest.hex, "");
    assert_eq!(minimal_evidence.digest.algo, DigestAlgo::Sha256);
    assert_eq!(minimal_evidence.payload_mime, None);
    
    // Test partial conversion
    let mut partial_map = serde_json::Map::new();
    partial_map.insert("id".to_string(), json!("partial-test"));
    partial_map.insert("digest_hex".to_string(), json!("partial-hash"));
    
    let partial_evidence = convert::from_map_to_evidence(partial_map);
    assert_eq!(partial_evidence.id, "partial-test");
    assert_eq!(partial_evidence.digest.hex, "partial-hash");
    assert_eq!(partial_evidence.digest.algo, DigestAlgo::Sha256);
    assert_eq!(partial_evidence.payload_mime, None);
}

/// Test chain transaction reference handling
#[test]
fn test_chain_transaction_reference_handling() {
    let now = Utc::now();
    
    // Test transaction reference creation
    let tx_ref = ChainTxRef {
        network: "ethereum".to_string(),
        chain: "mainnet".to_string(),
        tx_id: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef".to_string(),
        confirmed: false,
        timestamp: Some(now),
    };
    
    // Test serialization
    let json_str = serde_json::to_string(&tx_ref).unwrap();
    assert!(json_str.contains("ethereum"));
    assert!(json_str.contains("mainnet"));
    assert!(json_str.contains("0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"));
    assert!(json_str.contains("false"));
    
    // Test deserialization
    let deserialized: ChainTxRef = serde_json::from_str(&json_str).unwrap();
    assert_eq!(deserialized.network, tx_ref.network);
    assert_eq!(deserialized.chain, tx_ref.chain);
    assert_eq!(deserialized.tx_id, tx_ref.tx_id);
    assert_eq!(deserialized.confirmed, tx_ref.confirmed);
    assert_eq!(deserialized.timestamp, tx_ref.timestamp);
    
    // Test confirmed transaction
    let confirmed_tx = ChainTxRef {
        network: "solana".to_string(),
        chain: "devnet".to_string(),
        tx_id: "confirmed-tx-id".to_string(),
        confirmed: true,
        timestamp: Some(now),
    };
    
    let confirmed_json = serde_json::to_string(&confirmed_tx).unwrap();
    assert!(confirmed_json.contains("true"));
    
    let deserialized_confirmed: ChainTxRef = serde_json::from_str(&confirmed_json).unwrap();
    assert!(deserialized_confirmed.confirmed);
}

/// Test anchor error handling
#[test]
fn test_anchor_error_handling() {
    // Test network error
    let network_error = AnchorError::Network("connection failed".to_string());
    assert!(matches!(network_error, AnchorError::Network(_)));
    
    // Test invalid error
    let invalid_error = AnchorError::Invalid("bad state".to_string());
    assert!(matches!(invalid_error, AnchorError::Invalid(_)));
    
    // Test provider error
    let provider_error = AnchorError::Provider("service down".to_string());
    assert!(matches!(provider_error, AnchorError::Provider(_)));
    
    // Test error conversion
    let network_error = AnchorError::Network("test error".to_string());
    let error_string = format!("{}", network_error);
    assert!(error_string.contains("test error"));
}

/// Test evidence digest validation
#[test]
fn test_evidence_digest_validation() {
    // Test valid SHA256 digest
    let valid_digest = EvidenceDigest {
        algo: DigestAlgo::Sha256,
        hex: "abcd1234efgh5678ijkl9012mnop3456qrst7890uvwx1234yzab5678cdef1234".to_string(),
    };
    assert_eq!(valid_digest.algo, DigestAlgo::Sha256);
    assert_eq!(valid_digest.hex.len(), 64);
    
    // Test digest serialization
    let json_str = serde_json::to_string(&valid_digest).unwrap();
    assert!(json_str.contains("sha256") || json_str.contains("Sha256"));
    assert!(json_str.contains("abcd1234efgh5678ijkl9012mnop3456qrst7890uvwx1234yzab5678cdef1234"));
    
    // Test digest deserialization
    let deserialized: EvidenceDigest = serde_json::from_str(&json_str).unwrap();
    assert_eq!(deserialized.algo, valid_digest.algo);
    assert_eq!(deserialized.hex, valid_digest.hex);
}

/// Test evidence record with various metadata types
#[test]
fn test_evidence_record_various_metadata() {
    let now = Utc::now();
    
    // Test with simple metadata
    let simple_metadata = json!({
        "key": "value",
        "number": 42,
        "boolean": true
    });
    
    let simple_evidence = EvidenceRecord {
        id: "simple-test".to_string(),
        created_at: now,
        digest: EvidenceDigest {
            algo: DigestAlgo::Sha256,
            hex: "simple-hash".to_string(),
        },
        payload_mime: Some("text/plain".to_string()),
        metadata: simple_metadata,
    };
    
    let simple_json = serde_json::to_string(&simple_evidence).unwrap();
    assert!(simple_json.contains("simple-test"));
    assert!(simple_json.contains("simple-hash"));
    assert!(simple_json.contains("text/plain"));
    
    // Test with complex metadata
    let complex_metadata = json!({
        "nested": {
            "object": {
                "with": "values"
            }
        },
        "array": [1, 2, 3, "four"],
        "null_value": null
    });
    
    let complex_evidence = EvidenceRecord {
        id: "complex-test".to_string(),
        created_at: now,
        digest: EvidenceDigest {
            algo: DigestAlgo::Sha256,
            hex: "complex-hash".to_string(),
        },
        payload_mime: Some("application/json".to_string()),
        metadata: complex_metadata,
    };
    
    let complex_json = serde_json::to_string(&complex_evidence).unwrap();
    assert!(complex_json.contains("complex-test"));
    assert!(complex_json.contains("complex-hash"));
    assert!(complex_json.contains("application/json"));
    
    // Test with no metadata
    let no_metadata_evidence = EvidenceRecord {
        id: "no-metadata-test".to_string(),
        created_at: now,
        digest: EvidenceDigest {
            algo: DigestAlgo::Sha256,
            hex: "no-metadata-hash".to_string(),
        },
        payload_mime: None,
        metadata: json!(null),
    };
    
    let no_metadata_json = serde_json::to_string(&no_metadata_evidence).unwrap();
    assert!(no_metadata_json.contains("no-metadata-test"));
    assert!(no_metadata_json.contains("no-metadata-hash"));
}

/// Test hash consistency across different data types
#[test]
fn test_hash_consistency_across_data_types() {
    // Test that same data produces same hash
    let data1 = b"consistent test data";
    let data2 = b"consistent test data";
    let hash1 = hash::sha256_hex(data1);
    let hash2 = hash::sha256_hex(data2);
    assert_eq!(hash1, hash2);
    
    // Test that different data produces different hashes
    let data3 = b"different test data";
    let hash3 = hash::sha256_hex(data3);
    assert_ne!(hash1, hash3);
    
    // Test that order matters
    let data4 = b"data1data2";
    let data5 = b"data2data1";
    let hash4 = hash::sha256_hex(data4);
    let hash5 = hash::sha256_hex(data5);
    assert_ne!(hash4, hash5);
    
    // Test that case matters
    let data6 = b"Case Sensitive";
    let data7 = b"case sensitive";
    let hash6 = hash::sha256_hex(data6);
    let hash7 = hash::sha256_hex(data7);
    assert_ne!(hash6, hash7);
}

/// Test evidence record timestamp handling
#[test]
fn test_evidence_record_timestamp_handling() {
    let now = Utc::now();
    
    // Test with current timestamp
    let evidence = EvidenceRecord {
        id: "timestamp-test".to_string(),
        created_at: now,
        digest: EvidenceDigest {
            algo: DigestAlgo::Sha256,
            hex: "timestamp-hash".to_string(),
        },
        payload_mime: None,
        metadata: json!(null),
    };
    
    // Test serialization preserves timestamp
    let json_str = serde_json::to_string(&evidence).unwrap();
    let deserialized: EvidenceRecord = serde_json::from_str(&json_str).unwrap();
    
    // Timestamps should be very close (within 1 second)
    let time_diff = (deserialized.created_at - evidence.created_at).num_seconds();
    assert!(time_diff.abs() <= 1);
}

/// Test edge cases in hash function
#[test]
fn test_hash_function_edge_cases() {
    // Test with null bytes
    let null_data = vec![0x00, 0x00, 0x00, 0x00];
    let null_hash = hash::sha256_hex(&null_data);
    assert_eq!(null_hash.len(), 64);
    assert!(null_hash.chars().all(|c| c.is_ascii_hexdigit()));
    
    // Test with all possible byte values
    let all_bytes: Vec<u8> = (0..=255).collect();
    let all_bytes_hash = hash::sha256_hex(&all_bytes);
    assert_eq!(all_bytes_hash.len(), 64);
    assert!(all_bytes_hash.chars().all(|c| c.is_ascii_hexdigit()));
    
    // Test with very long data
    let long_data = vec![0x42; 1000000]; // 1MB of data
    let long_hash = hash::sha256_hex(&long_data);
    assert_eq!(long_hash.len(), 64);
    assert!(long_hash.chars().all(|c| c.is_ascii_hexdigit()));
}

/// Test conversion with malformed input
#[test]
fn test_conversion_with_malformed_input() {
    // Test with invalid JSON values
    let mut malformed_map = serde_json::Map::new();
    malformed_map.insert("id".to_string(), json!(123)); // Should be string
    malformed_map.insert("digest_hex".to_string(), json!(true)); // Should be string
    
    let evidence = convert::from_map_to_evidence(malformed_map);
    // Should handle gracefully and use defaults
    assert_eq!(evidence.id, "");
    assert_eq!(evidence.digest.hex, "");
    assert_eq!(evidence.digest.algo, DigestAlgo::Sha256);
}

/// Test anchor error serialization
#[test]
fn test_anchor_error_serialization() {
    let network_error = AnchorError::Network("test network error".to_string());
    let error_string = format!("{}", network_error);
    assert!(error_string.contains("test network error"));
    
    let invalid_error = AnchorError::Invalid("test invalid error".to_string());
    let error_string = format!("{}", invalid_error);
    assert!(error_string.contains("test invalid error"));
    
    let provider_error = AnchorError::Provider("test provider error".to_string());
    let error_string = format!("{}", provider_error);
    assert!(error_string.contains("test provider error"));
}
