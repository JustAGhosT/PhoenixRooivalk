use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize)]
pub struct Pagination {
    pub page: Option<i64>,
    pub per_page: Option<i64>,
}

#[derive(Debug, Deserialize)]
pub struct EvidenceIn {
    pub id: Option<String>,
    pub digest_hex: String,
    pub payload_mime: Option<String>,
    pub metadata: Option<serde_json::Value>,
}

#[derive(Debug, Serialize)]
pub struct EvidenceOut {
    pub id: String,
    pub status: String,
    pub attempts: i64,
    pub last_error: Option<String>,
    pub created_ms: i64,
    pub updated_ms: i64,
}
