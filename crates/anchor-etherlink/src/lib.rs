use async_trait::async_trait;
use chrono::Utc;
use phoenix_evidence::anchor::{AnchorError, AnchorProvider};
use phoenix_evidence::model::{ChainTxRef, EvidenceRecord};

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
        let mut t = tx.clone();
        t.confirmed = true;
        Ok(t)
    }
}
