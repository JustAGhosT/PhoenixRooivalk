use anchor_etherlink::{EtherlinkProvider, EtherlinkProviderStub};
use phoenix_evidence::model::{ChainTxRef, DigestAlgo, EvidenceDigest, EvidenceRecord};
use phoenix_evidence::anchor::{AnchorError, AnchorProvider};
use chrono::Utc;
use serde_json::json;

#[tokio::test]
async fn test_etherlink_provider_stub_anchor() {
    let provider = EtherlinkProviderStub;
    
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
    assert_eq!(tx_ref.network, "etherlink");
    assert_eq!(tx_ref.chain, "testnet");
    assert_eq!(tx_ref.tx_id, format!("fake:{}", evidence.digest.hex));
    assert!(!tx_ref.confirmed);
    assert!(tx_ref.timestamp.is_some());
}

#[tokio::test]
async fn test_etherlink_provider_stub_confirm() {
    let provider = EtherlinkProviderStub;
    
    let tx_ref = ChainTxRef {
        network: "etherlink".to_string(),
        chain: "testnet".to_string(),
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
async fn test_etherlink_provider_new() {
    let provider = EtherlinkProvider::new(
        "https://testnet.etherlink.com".to_string(),
        "testnet".to_string(),
        Some("test-private-key".to_string()),
    );
    
    // Provider should be created successfully
    assert_eq!(provider.endpoint, "https://testnet.etherlink.com");
    assert_eq!(provider.network, "testnet");
    assert_eq!(provider.private_key, Some("test-private-key".to_string()));
}

#[tokio::test]
async fn test_etherlink_provider_new_without_private_key() {
    let provider = EtherlinkProvider::new(
        "https://testnet.etherlink.com".to_string(),
        "testnet".to_string(),
        None,
    );
    
    // Provider should be created successfully without private key
    assert_eq!(provider.endpoint, "https://testnet.etherlink.com");
    assert_eq!(provider.network, "testnet");
    assert_eq!(provider.private_key, None);
}

#[tokio::test]
async fn test_etherlink_provider_anchor_real() {
    // This test would require a real Etherlink endpoint
    // For now, we'll test the stub implementation
    let provider = EtherlinkProviderStub;
    
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
async fn test_etherlink_provider_confirm_real() {
    // This test would require a real Etherlink endpoint
    // For now, we'll test the stub implementation
    let provider = EtherlinkProviderStub;
    
    let tx_ref = ChainTxRef {
        network: "etherlink".to_string(),
        chain: "testnet".to_string(),
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
fn test_etherlink_provider_clone() {
    let provider = EtherlinkProvider::new(
        "https://testnet.etherlink.com".to_string(),
        "testnet".to_string(),
        Some("test-private-key".to_string()),
    );
    
    let cloned_provider = provider.clone();
    assert_eq!(cloned_provider.endpoint, provider.endpoint);
    assert_eq!(cloned_provider.network, provider.network);
    assert_eq!(cloned_provider.private_key, provider.private_key);
}

#[test]
fn test_etherlink_provider_stub_clone() {
    let provider = EtherlinkProviderStub;
    let _cloned_provider = provider.clone();
    // Should compile and not panic
}

#[test]
fn test_json_rpc_request_serialization() {
    use anchor_etherlink::JsonRpcRequest;
    use serde_json::json;
    
    let request = JsonRpcRequest {
        jsonrpc: "2.0".to_string(),
        method: "eth_sendRawTransaction".to_string(),
        params: json!(["0x1234567890abcdef"]),
        id: 1,
    };
    
    let json_str = serde_json::to_string(&request).unwrap();
    assert!(json_str.contains("2.0"));
    assert!(json_str.contains("eth_sendRawTransaction"));
    assert!(json_str.contains("0x1234567890abcdef"));
    assert!(json_str.contains("\"id\":1"));
}

#[test]
fn test_json_rpc_response_deserialization() {
    use anchor_etherlink::JsonRpcResponse;
    
    let json_str = r#"{
        "jsonrpc": "2.0",
        "id": 1,
        "result": "0x1234567890abcdef"
    }"#;
    
    let response: JsonRpcResponse = serde_json::from_str(json_str).unwrap();
    assert_eq!(response.jsonrpc, "2.0");
    assert_eq!(response.id, 1);
    assert!(response.result.is_some());
    assert!(response.error.is_none());
}

#[test]
fn test_json_rpc_error_response() {
    use anchor_etherlink::JsonRpcResponse;
    
    let json_str = r#"{
        "jsonrpc": "2.0",
        "id": 1,
        "error": {
            "code": -32601,
            "message": "Method not found"
        }
    }"#;
    
    let response: JsonRpcResponse = serde_json::from_str(json_str).unwrap();
    assert_eq!(response.jsonrpc, "2.0");
    assert_eq!(response.id, 1);
    assert!(response.result.is_none());
    assert!(response.error.is_some());
    
    let error = response.error.unwrap();
    assert_eq!(error.code, -32601);
    assert_eq!(error.message, "Method not found");
}
