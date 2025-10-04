use anchor_solana::{SolanaProvider, SolanaProviderStub};
use phoenix_evidence::model::{ChainTxRef, DigestAlgo, EvidenceDigest, EvidenceRecord};
use phoenix_evidence::anchor::AnchorProvider;
use chrono::Utc;
use serde_json::json;

#[tokio::test]
async fn test_solana_provider_stub_anchor() {
    let provider = SolanaProviderStub;
    
    let evidence = EvidenceRecord {
        id: "test-evidence-123".to_string(),
        created_at: Utc::now(),
        digest: EvidenceDigest {
            algo: DigestAlgo::Sha256,
            hex: "abcd1234efgh5678".to_string(),
        },
        payload_mime: Some("application/json".to_string()),
        metadata: json!({"test": "data"}),
    };

    let result = provider.anchor(&evidence).await;
    assert!(result.is_ok());
    
    let tx_ref = result.unwrap();
    assert_eq!(tx_ref.network, "solana");
    assert_eq!(tx_ref.chain, "devnet");
    assert_eq!(tx_ref.tx_id, format!("fake:{}", evidence.digest.hex));
    assert!(!tx_ref.confirmed);
    assert!(tx_ref.timestamp.is_some());
}

#[tokio::test]
async fn test_solana_provider_stub_confirm() {
    let provider = SolanaProviderStub;
    
    let tx_ref = ChainTxRef {
        network: "solana".to_string(),
        chain: "devnet".to_string(),
        tx_id: "fake:abcd1234".to_string(),
        confirmed: false,
        timestamp: Some(Utc::now()),
    };

    let result = provider.confirm(&tx_ref).await;
    assert!(result.is_ok());
    
    let confirmed_tx = result.unwrap();
    assert_eq!(confirmed_tx.network, tx_ref.network);
    assert_eq!(confirmed_tx.chain, tx_ref.chain);
    assert_eq!(confirmed_tx.tx_id, tx_ref.tx_id);
    assert!(confirmed_tx.confirmed); // Should be confirmed
    assert_eq!(confirmed_tx.timestamp, tx_ref.timestamp);
}

#[tokio::test]
async fn test_solana_provider_new() {
    let provider = SolanaProvider::new(
        "https://api.devnet.solana.com".to_string(),
        "devnet".to_string(),
    );
    
    // Provider should be created successfully
    assert_eq!(provider.endpoint, "https://api.devnet.solana.com");
    assert_eq!(provider.network, "devnet");
}

#[tokio::test]
async fn test_solana_provider_anchor_real() {
    // This test would require a real Solana endpoint
    // For now, we'll test the stub implementation
    let provider = SolanaProviderStub;
    
    let evidence = EvidenceRecord {
        id: "test-evidence-456".to_string(),
        created_at: Utc::now(),
        digest: EvidenceDigest {
            algo: DigestAlgo::Sha256,
            hex: "deadbeefcafebabe".to_string(),
        },
        payload_mime: None,
        metadata: json!({}),
    };

    let result = provider.anchor(&evidence).await;
    assert!(result.is_ok());
    
    let tx_ref = result.unwrap();
    assert_eq!(tx_ref.tx_id, "fake:deadbeefcafebabe");
}

#[tokio::test]
async fn test_solana_provider_confirm_real() {
    // This test would require a real Solana endpoint
    // For now, we'll test the stub implementation
    let provider = SolanaProviderStub;
    
    let tx_ref = ChainTxRef {
        network: "solana".to_string(),
        chain: "devnet".to_string(),
        tx_id: "fake:deadbeefcafebabe".to_string(),
        confirmed: false,
        timestamp: Some(Utc::now()),
    };

    let result = provider.confirm(&tx_ref).await;
    assert!(result.is_ok());
    
    let confirmed_tx = result.unwrap();
    assert!(confirmed_tx.confirmed);
}

#[test]
fn test_solana_provider_clone() {
    let provider = SolanaProvider::new(
        "https://api.devnet.solana.com".to_string(),
        "devnet".to_string(),
    );
    
    let cloned_provider = provider.clone();
    assert_eq!(cloned_provider.endpoint, provider.endpoint);
    assert_eq!(cloned_provider.network, provider.network);
}

#[test]
fn test_solana_provider_stub_clone() {
    let provider = SolanaProviderStub;
    let _cloned_provider = provider.clone();
    // Should compile and not panic
}

#[test]
fn test_solana_rpc_request_serialization() {
    use anchor_solana::SolanaRpcRequest;
    use serde_json::json;
    
    let request = SolanaRpcRequest {
        jsonrpc: "2.0".to_string(),
        id: 1,
        method: "sendTransaction".to_string(),
        params: json!(["0x1234567890abcdef"]),
    };
    
    let json_str = serde_json::to_string(&request).unwrap();
    assert!(json_str.contains("2.0"));
    assert!(json_str.contains("sendTransaction"));
    assert!(json_str.contains("0x1234567890abcdef"));
    assert!(json_str.contains("\"id\":1"));
}

#[test]
fn test_solana_rpc_response_deserialization() {
    use anchor_solana::SolanaRpcResponse;
    
    let json_str = r#"{
        "jsonrpc": "2.0",
        "id": 1,
        "result": "0x1234567890abcdef"
    }"#;
    
    let response: SolanaRpcResponse = serde_json::from_str(json_str).unwrap();
    assert_eq!(response.jsonrpc, "2.0");
    assert_eq!(response.id, 1);
    assert!(response.result.is_some());
    assert!(response.error.is_none());
}

#[test]
fn test_solana_rpc_error_response() {
    use anchor_solana::SolanaRpcResponse;
    
    let json_str = r#"{
        "jsonrpc": "2.0",
        "id": 1,
        "error": {
            "code": -32601,
            "message": "Method not found"
        }
    }"#;
    
    let response: SolanaRpcResponse = serde_json::from_str(json_str).unwrap();
    assert_eq!(response.jsonrpc, "2.0");
    assert_eq!(response.id, 1);
    assert!(response.result.is_none());
    assert!(response.error.is_some());
    
    let error = response.error.unwrap();
    assert_eq!(error.code, -32601);
    assert_eq!(error.message, "Method not found");
}

#[test]
fn test_solana_provider_debug() {
    let provider = SolanaProvider::new(
        "https://api.devnet.solana.com".to_string(),
        "devnet".to_string(),
    );
    
    let debug_str = format!("{:?}", provider);
    assert!(debug_str.contains("SolanaProvider"));
    assert!(debug_str.contains("https://api.devnet.solana.com"));
    assert!(debug_str.contains("devnet"));
}
