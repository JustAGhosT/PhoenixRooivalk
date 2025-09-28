use async_trait::async_trait;
use chrono::Utc;
use phoenix_evidence::anchor::{AnchorError, AnchorProvider};
use phoenix_evidence::model::{ChainTxRef, EvidenceRecord};
use reqwest::Client;
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use std::time::Duration;

#[derive(Clone)]
pub struct EtherlinkProviderStub;

#[async_trait]
impl AnchorProvider for EtherlinkProviderStub {
    async fn anchor(&self, evidence: &EvidenceRecord) -> Result<ChainTxRef, AnchorError> {
        // Return a fake transaction reference deterministically based on digest
        Ok(ChainTxRef {
            network: "etherlink".to_string(),
            chain: "testnet".to_string(),
            tx_id: format!("fake:{}", &evidence.digest.hex),
            confirmed: false,
            timestamp: Some(Utc::now()),
        })
    }

    async fn confirm(&self, tx: &ChainTxRef) -> Result<ChainTxRef, AnchorError> {
pub struct EtherlinkProvider {
    client: Client,
    endpoint: String,
    network: String,
    #[allow(dead_code)]
    private_key: Option<String>,
}

#[derive(Debug, Serialize)]
struct JsonRpcRequest {
    method: String,
    params: Value,
    id: u64,
}

#[derive(Debug, Deserialize)]
struct JsonRpcResponse {
    #[allow(dead_code)]
    jsonrpc: String,
    #[allow(dead_code)]
    id: u64,
    result: Option<Value>,
    error: Option<JsonRpcError>,
}

#[derive(Debug, Deserialize)]
struct JsonRpcError {
    code: i32,
    message: String,
    #[allow(dead_code)]
    data: Option<Value>,
}

#[derive(Debug, Deserialize)]
struct TransactionReceipt {
    #[serde(rename = "transactionHash")]
    #[allow(dead_code)]
    transaction_hash: String,
    #[serde(rename = "blockNumber")]
    block_number: Option<String>,
    status: Option<String>,
}

impl EtherlinkProvider {
    pub fn new(endpoint: String, network: String, private_key: Option<String>) -> Self {
        let client = Client::builder()
            .timeout(Duration::from_secs(30))
            .build()
            .expect("Failed to create HTTP client");
        
        Self {
            client,
            endpoint,
            network,
            private_key,
        }
    }

    async fn rpc_call(&self, method: &str, params: Value) -> Result<Value, AnchorError> {
        let request = JsonRpcRequest {
            jsonrpc: "2.0".to_string(),
            method: method.to_string(),
            params,
            id: 1,
        };

        let response = self
            .client
            .post(&self.endpoint)
            .json(&request)
            .send()
            .await
            .map_err(|e| AnchorError::Network(format!("HTTP request failed: {}", e)))?;

        if !response.status().is_success() {
            return Err(AnchorError::Network(format!(
                "HTTP error: {}",
                response.status()
            )));
        }

        let rpc_response: JsonRpcResponse = response
            .json()
            .await
            .map_err(|e| AnchorError::Network(format!("Failed to parse JSON: {}", e)))?;

        if let Some(error) = rpc_response.error {
            return Err(AnchorError::Provider(format!(
                "RPC error {}: {}",
                error.code, error.message
            )));
        }

        rpc_response.result.ok_or_else(|| {
            AnchorError::Provider("RPC response missing result field".to_string())
        })
    }

    async fn send_memo_transaction(&self, memo_data: &str) -> Result<String, AnchorError> {
        // Create a simple transaction with memo data
        // In a real implementation, you'd sign this with the private key
        let _tx_data = json!({
            "to": "0x0000000000000000000000000000000000000000", // null address for memo
            "data": format!("0x{}", hex::encode(memo_data.as_bytes())),
            "gas": "0x5208", // 21000 gas
            "gasPrice": "0x3b9aca00" // 1 gwei
        });

        // Create a memo transaction with the provided data
        // In production, you'd call eth_sendTransaction or eth_sendRawTransaction
        let tx_hash = format!("0x{}", phoenix_evidence::hash::sha256_hex(memo_data.as_bytes()));

        tracing::info!(
            tx_hash = %tx_hash,
            memo_data = %memo_data,
            "Anchored evidence to Etherlink (simulated)"
        );

        Ok(tx_hash)
    }

    async fn get_transaction_receipt(&self, tx_hash: &str) -> Result<Option<TransactionReceipt>, AnchorError> {
        let result = self
            .rpc_call("eth_getTransactionReceipt", json!([tx_hash]))
            .await?;

        if result.is_null() {
            return Ok(None);
        }

        let receipt: TransactionReceipt = serde_json::from_value(result)
            .map_err(|e| AnchorError::Provider(format!("Failed to parse receipt: {}", e)))?;

        Ok(Some(receipt))
    }
}

#[async_trait]
impl AnchorProvider for EtherlinkProvider {
    async fn anchor(&self, evidence: &EvidenceRecord) -> Result<ChainTxRef, AnchorError> {
        // Create memo with evidence digest
        let memo = format!("evidence:{}", evidence.digest.hex);
        
        let tx_hash = self.send_memo_transaction(&memo).await?;

        Ok(ChainTxRef {
            network: "etherlink".to_string(),
            chain: self.network.clone(),
            tx_id: tx_hash,
            confirmed: false,
            timestamp: Some(Utc::now()),
        })
    }

    async fn confirm(&self, tx: &ChainTxRef) -> Result<ChainTxRef, AnchorError> {
        let receipt = self.get_transaction_receipt(&tx.tx_id).await?;

        let mut confirmed_tx = tx.clone();
        
        if let Some(receipt) = receipt {
            // Check if transaction is confirmed (has block number and successful status)
            let is_confirmed = receipt.block_number.is_some() 
                && receipt.status.as_deref() == Some("0x1");
            
            confirmed_tx.confirmed = is_confirmed;
            if is_confirmed {
                tracing::info!(
                    tx_id = %tx.tx_id,
                    block_number = ?receipt.block_number,
                    "Transaction confirmed on Etherlink"
                );
            }
        }

        Ok(confirmed_tx)
    }
}
}
