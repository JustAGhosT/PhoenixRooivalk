use leptos::*;

mod hud;
mod game_canvas;
mod weapon_panel;
mod stats_panel;

pub use hud::Hud;
pub use game_canvas::GameCanvas;
pub use weapon_panel::WeaponPanel;
pub use stats_panel::StatsPanel;

use crate::game::GameStateManager;

#[component]
pub fn App() -> impl IntoView {
    // Initialize game state manager
    let game_state = GameStateManager::new();
    
    // Reactive signals for UI state
    let (show_help, set_show_help) = create_signal(false);
    let (is_running, set_is_running) = create_signal(false);
    
    view! {
        <div class="app-container">
            <Hud 
                game_state=game_state.clone()
                is_running=is_running
            />
            
            <GameCanvas 
                game_state=game_state.clone()
                is_running=is_running
            />
            
            <div class="controls-footer">
                <button 
                    class="control-button"
                    on:click=move |_| {
                        let new_state = !is_running.get();
                        set_is_running.set(new_state);
                    }
                >
                    {move || if is_running.get() { "PAUSE" } else { "START" }}
                </button>
                
                <button 
                    class="control-button"
                    on:click=move |_| {
                        set_show_help.set(!show_help.get());
                    }
                >
                    "HELP"
                </button>
            </div>
            
            {move || show_help.get().then(|| view! {
                <div class="help-overlay">
                    <h2>"Phoenix Rooivalk Threat Simulator"</h2>
                    <p>"Controls:"</p>
                    <ul>
                        <li>"Click to target threats"</li>
                        <li>"1-9 to switch weapons"</li>
                        <li>"Space to pause/resume"</li>
                    </ul>
                    <button 
                        class="control-button"
                        on:click=move |_| set_show_help.set(false)
                    >
                        "CLOSE"
                    </button>
                </div>
            })}
        </div>
    }
}

