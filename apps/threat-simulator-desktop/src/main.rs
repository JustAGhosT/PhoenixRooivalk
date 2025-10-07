use leptos::*;
use wasm_bindgen::prelude::*;

mod components;
mod game;
mod tauri_api;

use components::App;

#[wasm_bindgen(start)]
pub fn main() {
    console_error_panic_hook::set_once();
    
    mount_to_body(|| view! { <App /> });
}

