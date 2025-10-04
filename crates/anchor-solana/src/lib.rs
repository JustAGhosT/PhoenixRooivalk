use async_trait::async_trait;
use chrono::Utc;
use phoenix_evidence::anchor::{AnchorError, AnchorProvider};
use phoenix_evidence::model::{ChainTxRef, EvidenceRecord};
use reqwest::Client;
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use std::time::Duration;

#[derive(Clone)]
pub struct SolanaProviderStub;

#[async_trait]
impl AnchorProvider for SolanaProviderStub {
    async fn anchor(&self, evidence: &EvidenceRecord) -> Result<ChainTxRef, AnchorError> {
        Ok(ChainTxRef {
            network: "solana".to_string(),
            chain: "devnet".to_string(),
            tx_id: format!("fake:{}", &evidence.digest.hex),
            confirmed: false,
            timestamp: Some(Utc::now()),
        })
    }

    async fn confirm(&self, tx: &ChainTxRef) -> Result<ChainTxRef, AnchorError> {
        let mut t = tx.clone();
        t.confirmed = true;
        Ok(t)
    }
}

#[derive(Debug, Clone)]
pub struct SolanaProvider {
    pub client: Client,
    pub endpoint: String,
    pub network: String,
}

#[derive(Debug, Serialize)]
pub struct SolanaRpcRequest {
    pub jsonrpc: String,
    pub id: u64,
    pub method: String,
    pub params: Value,
}

#[derive(Debug, Deserialize)]
pub struct SolanaRpcResponse {
    #[allow(dead_code)]
    pub jsonrpc: String,
    #[allow(dead_code)]
    pub id: u64,
    pub result: Option<Value>,
    pub error: Option<SolanaRpcError>,
}

#[derive(Debug, Deserialize)]
pub struct SolanaRpcError {
    pub code: i32,
    pub message: String,
    #[allow(dead_code)]
    pub data: Option<Value>,
}

#[derive(Debug, Deserialize)]
struct TransactionStatus {
    slot: u64,
    #[allow(dead_code)]
    confirmations: Option<u64>,
    err: Option<Value>,
    confirmation_status: Option<String>,
}

impl SolanaProvider {
    pub fn new(endpoint: String, network: String) -> Self {
        let client = Client::builder()
            .timeout(Duration::from_secs(30))
            .build()
            .expect("Failed to create HTTP client");

        Self {
            client,
            endpoint,
            network,
        }
    }

    async fn rpc_call(&self, method: &str, params: Value) -> Result<Value, AnchorError> {
        let request = SolanaRpcRequest {
            jsonrpc: "2.0".to_string(),
            id: 1,
            method: method.to_string(),
            params,
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

        let rpc_response: SolanaRpcResponse = response
            .json()
            .await
            .map_err(|e| AnchorError::Network(format!("Failed to parse JSON: {}", e)))?;

        if let Some(error) = rpc_response.error {
            return Err(AnchorError::Provider(format!(
                "RPC error {}: {}",
                error.code, error.message
            )));
        }

        rpc_response
            .result
            .ok_or_else(|| AnchorError::Provider("RPC response missing result field".to_string()))
    }

    async fn send_memo_transaction(&self, memo_data: &str) -> Result<String, AnchorError> {
        // Create a memo transaction
        // In a real implementation, you'd create and sign a proper Solana transaction
        // For now, return a deterministic fake signature
        // sha256_hex already returns a hex string, so we use it directly as the signature
        let signature = phoenix_evidence::hash::sha256_hex(memo_data.as_bytes());

        tracing::info!(
            signature = %signature,
            memo_data = %memo_data,
            "Anchored evidence to Solana (simulated)"
        );

        Ok(signature)
    }

    async fn get_signature_status(
        &self,
        signature: &str,
    ) -> Result<Option<TransactionStatus>, AnchorError> {
        let result = self
            .rpc_call(
                "getSignatureStatuses",
                json!([[signature], {"searchTransactionHistory": true}]),
            )
            .await?;

        let statuses = result
            .get("value")
            .and_then(|v| v.as_array())
            .ok_or_else(|| AnchorError::Provider("Invalid response format".to_string()))?;

        if statuses.is_empty() {
            return Ok(None);
        }

        let status_value = &statuses[0];
        if status_value.is_null() {
            return Ok(None);
        }

        let status: TransactionStatus = serde_json::from_value(status_value.clone())
            .map_err(|e| AnchorError::Provider(format!("Failed to parse status: {}", e)))?;

        Ok(Some(status))
    }
}

#[async_trait]
impl AnchorProvider for SolanaProvider {
    async fn anchor(&self, evidence: &EvidenceRecord) -> Result<ChainTxRef, AnchorError> {
        // Create memo with evidence digest
        let memo = format!("evidence:{}", evidence.digest.hex);

        let signature = self.send_memo_transaction(&memo).await?;

        Ok(ChainTxRef {
            network: "solana".to_string(),
            chain: self.network.clone(),
            tx_id: signature,
            confirmed: false,
            timestamp: Some(Utc::now()),
        })
    }

    async fn confirm(&self, tx: &ChainTxRef) -> Result<ChainTxRef, AnchorError> {
        let status = self.get_signature_status(&tx.tx_id).await?;

        let mut confirmed_tx = tx.clone();

        if let Some(status) = status {
            // Transaction is confirmed if it has no error and is finalized
            let is_confirmed =
                status.err.is_none() && status.confirmation_status.as_deref() == Some("finalized");

            confirmed_tx.confirmed = is_confirmed;
            if is_confirmed {
                tracing::info!(
                    signature = %tx.tx_id,
                    slot = %status.slot,
                    "Transaction confirmed on Solana"
                );
            }
        }

        Ok(confirmed_tx)
    }
}
