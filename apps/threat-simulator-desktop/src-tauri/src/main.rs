// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use std::sync::Mutex;
use tauri::State;
use tracing::{debug, error, info};
use tracing_subscriber;

// Game state that will be managed by Tauri backend
#[serde(rename_all = "camelCase")]
#[derive(Debug, Clone, Serialize, Deserialize)]
struct GameSession {
    session_id: String,
    start_time: i64,
    score: u32,
    threats_neutralized: u32,
    level: u8,
}

struct AppState {
    current_session: Mutex<Option<GameSession>>,
}

// Persist session data to database/evidence chain
fn save_session_to_persistence(session: &GameSession) -> Result<String, String> {
    // TODO: Integrate with phoenix-evidence crate and blockchain anchoring
    // For now, we'll serialize to JSON as a placeholder
    let session_json = serde_json::to_string_pretty(session)
        .map_err(|e| format!("Failed to serialize session: {}", e))?;

    debug!("Persisting session data: {}", session_json);

    // Placeholder for actual database/blockchain persistence
    // In production, this would:
    // 1. Save to local SQLite database
    // 2. Queue for blockchain anchoring (Solana/EtherLink)
    // 3. Generate tamper-evident hash

    let evidence_id = format!("evidence-{}", session.session_id);
    info!(
        session_id = %session.session_id,
        score = session.score,
        threats = session.threats_neutralized,
        level = session.level,
        evidence_id = %evidence_id,
        "Session persisted successfully"
    );

    Ok(evidence_id)
}

// Tauri commands that can be called from the frontend

// Input struct for end_game_session to handle camelCase from frontend
#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct EndGameSessionInput {
    final_score: u32,
    threats_neutralized: u32,
}

// Input struct for save_evidence to handle camelCase from frontend
#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct EvidencePayload {
    session_id: String,
    event_type: String,
    event_data: serde_json::Value,
}

#[tauri::command]
fn start_game_session(state: State<'_, AppState>) -> Result<GameSession, String> {
    debug!("Starting new game session");

    let session = GameSession {
        session_id: uuid::Uuid::new_v4().to_string(),
        start_time: chrono::Utc::now().timestamp(),
        score: 0,
        threats_neutralized: 0,
        level: 1,
    };

    let mut current = state.current_session.lock().map_err(|e| {
        error!("Failed to acquire session lock (mutex poisoned): {}", e);
        format!("Failed to acquire session lock (mutex poisoned): {}", e)
    })?;

    info!(
        session_id = %session.session_id,
        start_time = session.start_time,
        "New game session created"
    );

    *current = Some(session.clone());

    Ok(session)
}

#[tauri::command]
fn end_game_session(state: State<'_, AppState>, input: EndGameSessionInput) -> Result<(), String> {
    debug!(
        final_score = input.final_score,
        threats_neutralized = input.threats_neutralized,
        "Ending game session"
    );

    let mut current = match state.current_session.lock() {
        Ok(guard) => guard,
        Err(e) => {
            error!("Failed to acquire session lock (mutex poisoned): {}", e);
            return Err(format!(
                "Failed to acquire session lock (mutex poisoned): {}",
                e
            ));
        }
    };

    if let Some(session) = current.as_mut() {
        // Update session with final stats
        session.score = input.final_score;
        session.threats_neutralized = input.threats_neutralized;

        info!(
            session_id = %session.session_id,
            duration_secs = chrono::Utc::now().timestamp() - session.start_time,
            final_score = input.final_score,
            threats_neutralized = input.threats_neutralized,
            level = session.level,
            "Game session ending, persisting data"
        );

        // Persist session to database/evidence chain
        match save_session_to_persistence(session) {
            Ok(evidence_id) => {
                info!(
                    session_id = %session.session_id,
                    evidence_id = %evidence_id,
                    "Session persisted successfully, clearing current session"
                );
                // Only clear session if persistence succeeded
                *current = None;
                Ok(())
            }
            Err(e) => {
                error!(
                    session_id = %session.session_id,
                    error = %e,
                    "Failed to persist session data"
                );
                Err(format!("Failed to persist session: {}", e))
            }
        }
    } else {
        error!("No active session to end");
        Err("No active session to end".to_string())
    }
}

#[tauri::command]
async fn save_evidence(payload: EvidencePayload) -> Result<String, String> {
    // TODO: Integrate with phoenix-evidence crate
    println!(
        "Saving evidence: session={}, type={}, data={:?}",
        payload.session_id, payload.event_type, payload.event_data
    );
    Ok("evidence-id-placeholder".to_string())
}

#[tauri::command]
fn get_system_info() -> Result<serde_json::Value, String> {
    Ok(serde_json::json!({
        "platform": std::env::consts::OS,
        "arch": std::env::consts::ARCH,
        "version": env!("CARGO_PKG_VERSION"),
    }))
}

fn main() {
    // Initialize structured logging with tracing
    tracing_subscriber::fmt()
        .with_target(true)
        .with_level(true)
        .with_line_number(true)
        .with_thread_ids(true)
        .init();

    info!("Phoenix Rooivalk Threat Simulator starting");

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .manage(AppState {
            current_session: Mutex::new(None),
        })
        .invoke_handler(tauri::generate_handler![
            start_game_session,
            end_game_session,
            save_evidence,
            get_system_info,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
