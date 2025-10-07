use leptos::*;

mod game_canvas;
mod hud;
mod stats_panel;
mod weapon_panel;

pub use game_canvas::GameCanvas;
pub use hud::Hud;
pub use stats_panel::StatsPanel;
pub use weapon_panel::WeaponPanel;

use crate::game::{GameStateManager, WeaponType};
use wasm_bindgen::JsCast;
use web_sys::{window, KeyboardEvent};

#[component]
pub fn App() -> impl IntoView {
    // Initialize game state manager
    let game_state = GameStateManager::new();

    // Reactive signals for UI state
    let (show_help, set_show_help) = create_signal(false);
    let (show_stats, set_show_stats) = create_signal(false);
    let (is_running, set_is_running) = create_signal(false);

    // Keyboard event handler
    let game_state_kb = game_state.clone();
    create_effect(move |_| {
        let window = window().unwrap();
        let closure = Closure::wrap(Box::new(move |event: KeyboardEvent| {
            let key = event.key();

            match key.as_str() {
                " " => {
                    // Space - toggle pause
                    set_is_running.update(|r| *r = !*r);
                    event.prevent_default();
                }
                "h" | "H" | "?" => {
                    // Help toggle
                    set_show_help.update(|h| *h = !*h);
                }
                "s" | "S" => {
                    // Stats toggle
                    set_show_stats.update(|s| *s = !*s);
                }
                "r" | "R" => {
                    // Reset game
                    game_state_kb.reset();
                    set_is_running.set(false);
                }
                // Weapon selection (1-9, 0, C, S, A)
                "1" => game_state_kb.selected_weapon.set(WeaponType::Kinetic),
                "2" => game_state_kb.selected_weapon.set(WeaponType::Electronic),
                "3" => game_state_kb.selected_weapon.set(WeaponType::Laser),
                "4" => game_state_kb.selected_weapon.set(WeaponType::Net),
                "5" => game_state_kb.selected_weapon.set(WeaponType::Hpm),
                "6" => game_state_kb.selected_weapon.set(WeaponType::RfTakeover),
                "7" => game_state_kb.selected_weapon.set(WeaponType::GnssDeny),
                "8" => game_state_kb.selected_weapon.set(WeaponType::OpticalDazzle),
                "9" => game_state_kb.selected_weapon.set(WeaponType::Acoustic),
                "0" => game_state_kb.selected_weapon.set(WeaponType::DecoyBeacon),
                "c" | "C" => game_state_kb.selected_weapon.set(WeaponType::Chaff),
                "a" | "A" => game_state_kb.selected_weapon.set(WeaponType::SmartSlug),
                "d" | "D" => game_state_kb.selected_weapon.set(WeaponType::AiDeception),
                _ => {}
            }
        }) as Box<dyn FnMut(_)>);

        window
            .add_event_listener_with_callback("keydown", closure.as_ref().unchecked_ref())
            .unwrap();

        // Keep closure alive
        std::mem::forget(closure);
    });

    view! {
        <div class="app-container">
            <Hud game_state=game_state.clone() is_running=is_running/>

            <GameCanvas game_state=game_state.clone() is_running=is_running/>

            <div class="controls-footer">
                <div class="control-section">
                    <button
                        class="control-button primary"
                        on:click=move |_| {
                            set_is_running.update(|r| *r = !*r);
                        }
                    >

                        {move || if is_running.get() { "⏸ PAUSE" } else { "▶ START" }}
                    </button>

                    <button
                        class="control-button"
                        on:click=move |_| {
                            game_state.reset();
                            set_is_running.set(false);
                        }
                    >

                        "↺ RESET"
                    </button>
                </div>

                <WeaponPanel game_state=game_state.clone()/>

                <div class="control-section">
                    <button
                        class="control-button"
                        on:click=move |_| {
                            set_show_stats.update(|s| *s = !*s);
                        }
                    >

                        "📊 STATS"
                    </button>

                    <button
                        class="control-button"
                        on:click=move |_| {
                            set_show_help.update(|h| *h = !*h);
                        }
                    >

                        "❓ HELP"
                    </button>
                </div>
            </div>

            <StatsPanel game_state=game_state.clone() show=show_stats/>

            // Help overlay
            <Show when=move || show_help.get() fallback=|| view! { <div></div> }>
                <div class="modal-overlay" on:click=move |_| set_show_help.set(false)>
                    <div class="help-modal" on:click=|e| e.stop_propagation()>
                        <h2>"Phoenix Rooivalk Threat Simulator"</h2>

                        <div class="help-section">
                            <h3>"Controls"</h3>
                            <ul>
                                <li>
                                    <kbd>"Space"</kbd>
                                    " - Pause/Resume"
                                </li>
                                <li>
                                    <kbd>"Click"</kbd>
                                    " - Target and fire at threats"
                                </li>
                                <li>
                                    <kbd>"1-9, 0"</kbd>
                                    " - Select weapons"
                                </li>
                                <li>
                                    <kbd>"R"</kbd>
                                    " - Reset game"
                                </li>
                                <li>
                                    <kbd>"S"</kbd>
                                    " - Toggle detailed stats"
                                </li>
                                <li>
                                    <kbd>"H"</kbd>
                                    " - Toggle this help"
                                </li>
                            </ul>
                        </div>

                        <div class="help-section">
                            <h3>"Objectives"</h3>
                            <p>"Defend the mothership (center) from incoming drone threats"</p>
                            <p>"Manage energy and cooling resources"</p>
                            <p>"Survive progressive waves with increasing difficulty"</p>
                        </div>

                        <div class="help-section">
                            <h3>"Threat Types"</h3>
                            <ul>
                                <li>
                                    <span style="color: #ff6666">"●"</span>
                                    " Commercial - Basic threat"
                                </li>
                                <li>
                                    <span style="color: #ff3333">"●"</span>
                                    " Military - Armored, high health"
                                </li>
                                <li>
                                    <span style="color: #ffaa33">"●"</span>
                                    " Swarm - Fast, coordinated"
                                </li>
                                <li>
                                    <span style="color: #9933ff">"●"</span>
                                    " Stealth - Hard to detect"
                                </li>
                                <li>
                                    <span style="color: #ff0000">"●"</span>
                                    " Kamikaze - Fast, high damage"
                                </li>
                            </ul>
                        </div>

                        <button class="control-button" on:click=move |_| set_show_help.set(false)>
                            "CLOSE"
                        </button>
                    </div>
                </div>
            </Show>
        </div>
    }
}
