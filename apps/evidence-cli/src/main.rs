use anyhow::{Context, Result};
use chrono::Utc;
use clap::{Arg, Command};
use phoenix_evidence::hash::sha256_hex;
use reqwest::Client;
use serde_json::{json, Value};
use std::fs;

#[tokio::main]
async fn main() -> Result<()> {
    let matches = Command::new("record-evidence")
        .about("Record evidence and optionally submit to Phoenix API for anchoring")
        .version("0.1.0")
        .arg(
            Arg::new("event_type")
                .help("Short type label, e.g., engagement_summary")
                .required(true)
                .index(1),
        )
        .arg(
            Arg::new("payload")
                .help("Inline JSON (e.g., '{\"a\":1}') or @path/to/file.json to load from file")
                .required(true)
                .index(2),
        )
        .arg(
            Arg::new("api-url")
                .long("api-url")
                .help("Phoenix API URL for evidence submission")
                .default_value("http://localhost:8080"),
        )
        .arg(
            Arg::new("submit")
                .long("submit")
                .help("Submit evidence to API for anchoring")
                .action(clap::ArgAction::SetTrue),
        )
        .arg(
            Arg::new("output-format")
                .long("output-format")
                .help("Output format: json, digest-only")
                .default_value("json"),
        )
        .get_matches();

    let event_type = matches.get_one::<String>("event_type").unwrap();
    let payload_arg = matches.get_one::<String>("payload").unwrap();
    let api_url = matches.get_one::<String>("api-url").unwrap();
    let submit = matches.get_flag("submit");
    let output_format = matches.get_one::<String>("output-format").unwrap();

    // Load payload
    let payload: Value = if let Some(path) = payload_arg.strip_prefix('@') {
        let content = fs::read_to_string(path)
            .with_context(|| format!("Failed to read payload file: {}", path))?;
        serde_json::from_str(&content)
            .with_context(|| format!("Failed to parse JSON from file: {}", path))?
    } else {
        serde_json::from_str(payload_arg)
            .with_context(|| "Failed to parse inline JSON payload")?
    };

    // Compute digest
    let canonical_json = serde_json::to_string(&payload)?;
    let digest = sha256_hex(canonical_json.as_bytes());

    // Create evidence record
    let evidence_record = json!({
        "event_type": event_type,
        "digest": digest,
        "payload": payload,
        "timestamp": chrono::Utc::now().to_rfc3339()
    });

    if submit {
        // Submit to API
        let client = Client::new();
        let submit_payload = json!({
            "digest_hex": digest,
            "payload_mime": "application/json",
            "metadata": {
                "event_type": event_type,
                "timestamp": chrono::Utc::now().to_rfc3339()
            }
        });

        let response = client
            .post(format!("{}/evidence", api_url))
            .json(&submit_payload)
            .send()
            .await
            .context("Failed to submit evidence to API")?;

        if !response.status().is_success() {
            let status = response.status();
            let error_text = response.text().await.unwrap_or_default();
            anyhow::bail!("API request failed with status {}: {}", status, error_text);
        }

        let api_response: Value = response.json().await.context("Failed to parse API response")?;
        
        match output_format.as_str() {
            "digest-only" => println!("{}", digest),
            "json" => {
                let output = json!({
                    "digest": digest,
                    "event_type": event_type,
                    "api_response": api_response,
                    "submitted": true
                });
                println!("{}", serde_json::to_string_pretty(&output)?);
            }
            _ => anyhow::bail!("Invalid output format: {}", output_format),
        }
    } else {
        // Local processing only
        match output_format.as_str() {
            "digest-only" => println!("{}", digest),
            "json" => {
                let output = json!({
                    "digest": digest,
                    "event_type": event_type,
                    "evidence_record": evidence_record,
                    "submitted": false
                });
                println!("{}", serde_json::to_string_pretty(&output)?);
            }
            _ => anyhow::bail!("Invalid output format: {}", output_format),
        }
    }

    Ok(())
}
