use async_trait::async_trait;
use chrono::Utc;
use phoenix_evidence::anchor::{AnchorError, AnchorProvider};
use phoenix_evidence::model::{ChainTxRef, EvidenceRecord};

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
