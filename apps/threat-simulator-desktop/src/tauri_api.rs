use serde::{Deserialize, Serialize};
use serde_json::Value;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = ["window", "__TAURI__", "core"])]
    async fn invoke(cmd: &str, args: JsValue) -> JsValue;
}

#[derive(Serialize, Deserialize)]
pub struct GameSession {
    pub session_id: String,
    pub start_time: i64,
    pub score: u32,
    pub threats_neutralized: u32,
    pub level: u8,
}

pub async fn start_game_session() -> Result<GameSession, String> {
    let result = invoke("start_game_session", JsValue::NULL).await;
    serde_wasm_bindgen::from_value(result).map_err(|e| e.to_string())
}

pub async fn end_game_session(final_score: u32, threats_neutralized: u32) -> Result<(), String> {
    let args = serde_wasm_bindgen::to_value(&serde_json::json!({
        "finalScore": final_score,
        "threatsNeutralized": threats_neutralized,
    }))
    .map_err(|e| e.to_string())?;

    let result = invoke("end_game_session", args).await;
    serde_wasm_bindgen::from_value(result).map_err(|e| e.to_string())
}

pub async fn save_evidence(
    session_id: String,
    event_type: String,
    event_data: Value,
) -> Result<String, String> {
    let args = serde_wasm_bindgen::to_value(&serde_json::json!({
        "sessionId": session_id,
        "eventType": event_type,
        "eventData": event_data,
    }))
    .map_err(|e| e.to_string())?;

    let result = invoke("save_evidence", args).await;
    serde_wasm_bindgen::from_value(result).map_err(|e| e.to_string())
}

pub async fn get_system_info() -> Result<Value, String> {
    let result = invoke("get_system_info", JsValue::NULL).await;
    serde_wasm_bindgen::from_value(result).map_err(|e| e.to_string())
}
