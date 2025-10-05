#!/bin/bash

# Fix Rust formatting issues manually

# apps/api/src/main.rs
sed -i 's/async fn health() -> &'\''static str { "OK" }/async fn health() -> \&'\''static str {\n    "OK"\n}/' apps/api/src/main.rs

# apps/api/tests/http_evidence.rs - fix spacing
sed -i 's/    let db_url = format!("sqlite:\/\/{}", db_path);$/    let db_url = format!("sqlite:\/\/{}", db_path);\n/' apps/api/tests/http_evidence.rs

# apps/evidence-cli/src/main.rs
sed -i 's/serde_json::from_str(payload_arg)/serde_json::from_str(payload_arg)/' apps/evidence-cli/src/main.rs

# apps/keeper/src/config.rs
sed -i 's/let network = std::env::var("ETHERLINK_NETWORK")/let network =\n                    std::env::var("ETHERLINK_NETWORK")/' apps/keeper/src/config.rs

# apps/keeper/src/lib.rs
sed -i 's/use phoenix_evidence::model::{ChainTxRef, EvidenceDigest, EvidenceRecord, DigestAlgo};/use phoenix_evidence::model::{ChainTxRef, DigestAlgo, EvidenceDigest, EvidenceRecord};/' apps/keeper/src/lib.rs

# Continue with other files...
echo "Rust formatting fixes applied"
