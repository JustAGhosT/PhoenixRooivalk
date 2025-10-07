// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use std::sync::Mutex;
use tauri::State;

// Game state that will be managed by Tauri backend
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

// Tauri commands that can be called from the frontend

#[tauri::command]
async fn start_game_session(state: State<'_, AppState>) -> Result<GameSession, String> {
    let session = GameSession {
        session_id: uuid::Uuid::new_v4().to_string(),
        start_time: chrono::Utc::now().timestamp(),
        score: 0,
        threats_neutralized: 0,
        level: 1,
    };

    let mut current = state.current_session.lock().unwrap();
    *current = Some(session.clone());

    Ok(session)
}

#[tauri::command]
async fn end_game_session(
    state: State<'_, AppState>,
    final_score: u32,
    threats_neutralized: u32,
) -> Result<(), String> {
    let mut current = state.current_session.lock().unwrap();
    if let Some(session) = current.as_mut() {
        session.score = final_score;
        session.threats_neutralized = threats_neutralized;

        // TODO: Save session to database/evidence chain
        println!("Game session ended: {:?}", session);
    }

    *current = None;
    Ok(())
}

#[tauri::command]
async fn save_evidence(
    session_id: String,
    event_type: String,
    event_data: serde_json::Value,
) -> Result<String, String> {
    // TODO: Integrate with phoenix-evidence crate
    println!(
        "Saving evidence: session={}, type={}, data={:?}",
        session_id, event_type, event_data
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
