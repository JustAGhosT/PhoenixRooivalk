use leptos::*;

mod cooldown_meter;
mod drone_deployment;
mod energy_management;
mod event_feed;
mod game_canvas;
mod hud;
mod loading;
mod overlays;
mod research_panel;
mod stats_panel;
mod synergy_system;
mod token_store;
mod weapon_panel;

pub use drone_deployment::DroneDeploymentPanel;
pub use energy_management::EnergyManagement;
pub use event_feed::{create_feed_item, EventFeed, FeedItem, FeedSeverity};
pub use game_canvas::GameCanvas;
pub use hud::Hud;
pub use overlays::{AchievementNotification, SimulationWarning};
pub use research_panel::ResearchPanel;
pub use stats_panel::StatsPanel;
pub use synergy_system::SynergySystem;
pub use token_store::TokenStore;
pub use weapon_panel::WeaponPanel;

use crate::game::{GameStateManager, WeaponType};
use wasm_bindgen::{closure::Closure, JsCast};
use web_sys::KeyboardEvent;

#[component]
pub fn App() -> impl IntoView {
    // Initialize game state manager
    let game_state = GameStateManager::new();

    // Reactive signals for UI state
    let (show_help, set_show_help) = create_signal(false);
    let (show_stats, set_show_stats) = create_signal(false);
    let (show_energy, set_show_energy) = create_signal(false);
    let (show_drones, set_show_drones) = create_signal(false);
    let (show_warning, set_show_warning) = create_signal(true);
    let (show_events, set_show_events) = create_signal(false);
    let (show_research, set_show_research) = create_signal(false);
    let (show_token_store, set_show_token_store) = create_signal(false);
    let (show_synergies, set_show_synergies) = create_signal(false); // Hide by default
    let (is_running, set_is_running) = create_signal(true); // Start running
    let (achievement_message, set_achievement_message) = create_signal(None::<String>);
    let (event_feed, set_event_feed) = create_signal(Vec::<FeedItem>::new());

    // Loading state
    let (is_loading, set_is_loading) = create_signal(true);
    let (loading_progress, set_loading_progress) = create_signal(0u8);

    // Wrap game state in Rc to allow multiple references
    let game_state_rc = std::rc::Rc::new(game_state.clone());

    // Keyboard event handler
    let game_state_kb = game_state_rc.clone();
    {
        let window = web_sys::window().unwrap();
        let game_state_inner = game_state_kb.clone();
        let closure = Closure::wrap(Box::new(move |event: KeyboardEvent| {
            let key = event.key();

            match key.as_str() {
                " " => {
                    // Space - toggle pause
                    set_is_running.update(|r| *r = !*r);
                    event.prevent_default();
                }
                "h" | "H" | "?" => set_show_help.update(|h| *h = !*h),
                "s" | "S" => set_show_stats.update(|s| *s = !*s),
                "e" | "E" => set_show_energy.update(|e| *e = !*e),
                "d" | "D" => set_show_drones.update(|d| *d = !*d),
                "l" | "L" => set_show_events.update(|e| *e = !*e),
                "t" | "T" => set_show_token_store.update(|t| *t = !*t),
                "f" | "F" => set_show_research.update(|r| *r = !*r),
                "g" | "G" => set_show_synergies.update(|s| *s = !*s),
                "x" | "X" => game_state_inner.auto_targeting_enabled.update(|a| *a = !*a),
                "r" | "R" => {
                    game_state_inner.reset();
                    set_is_running.set(false);
                    set_event_feed.set(vec![create_feed_item(
                        "Game reset".to_string(),
                        FeedSeverity::Info,
                    )]);
                }
                // Weapon selection (1-9, 0, C, S, A)
                "1" => game_state_inner.selected_weapon.set(WeaponType::Kinetic),
                "2" => game_state_inner.selected_weapon.set(WeaponType::Electronic),
                "3" => game_state_inner.selected_weapon.set(WeaponType::Laser),
                "4" => game_state_inner.selected_weapon.set(WeaponType::Net),
                "5" => game_state_inner.selected_weapon.set(WeaponType::Hpm),
                "6" => game_state_inner.selected_weapon.set(WeaponType::RfTakeover),
                "7" => game_state_inner.selected_weapon.set(WeaponType::GnssDeny),
                "8" => game_state_inner
                    .selected_weapon
                    .set(WeaponType::OpticalDazzle),
                "9" => game_state_inner.selected_weapon.set(WeaponType::Acoustic),
                "0" => game_state_inner
                    .selected_weapon
                    .set(WeaponType::DecoyBeacon),
                "c" | "C" => game_state_inner.selected_weapon.set(WeaponType::Chaff),
                "a" | "A" => game_state_inner
                    .selected_weapon
                    .set(WeaponType::AiDeception),
                _ => {}
            }
        }) as Box<dyn FnMut(_)>);

        window
            .add_event_listener_with_callback("keydown", closure.as_ref().unchecked_ref())
            .unwrap();

        // Clean up on component unmount
        on_cleanup({
            let window = window.clone();
            let closure_ref = closure.as_ref().unchecked_ref::<js_sys::Function>().clone();
            move || {
                let _ = window.remove_event_listener_with_callback("keydown", &closure_ref);
            }
        });
        // Keep closure alive until cleanup
        std::mem::forget(closure);
    }

    // Clone game state for components
    let game_state_hud = game_state_rc.clone();
    let game_state_canvas = game_state_rc.clone();
    let game_state_energy = game_state_rc.clone();
    let game_state_drones = game_state_rc.clone();
    let game_state_tokens = game_state_rc.clone();
    let game_state_weapons = game_state_rc.clone();

    // Simulate loading progress
    create_effect(move |_| {
        if is_loading.get() {
            let progress = loading_progress.get();
            if progress < 100 {
                set_loading_progress.set(progress + 10);
                // Use request_animation_frame for smooth progress
                let window = web_sys::window().unwrap();
                let closure = Closure::wrap(Box::new(move || {
                    if progress < 90 {
                        set_loading_progress.update(|p| *p += 1);
                    } else if progress >= 90 {
                        set_loading_progress.set(100);
                        // Complete loading after a short delay
                        let window = web_sys::window().unwrap();
                        let closure = Closure::wrap(Box::new(move || {
                            set_is_loading.set(false);
                        }) as Box<dyn FnMut()>);
                        window
                            .set_timeout_with_callback_and_timeout_and_arguments_0(
                                closure.as_ref().unchecked_ref(),
                                500,
                            )
                            .unwrap();
                        std::mem::forget(closure);
                    }
                }) as Box<dyn FnMut()>);
                window
                    .request_animation_frame(closure.as_ref().unchecked_ref())
                    .unwrap();
                std::mem::forget(closure);
            }
        }
    });

    view! {
        <div class="app-container">
            // Simulation warning overlay
            <SimulationWarning show=show_warning on_close=move || set_show_warning.set(false)/>

            // Achievement notifications
            <AchievementNotification
                message=achievement_message
                on_dismiss=move || set_achievement_message.set(None)
            />

            <Hud game_state=(*game_state_hud).clone() is_running=is_running/>

            <GameCanvas game_state=(*game_state_canvas).clone() is_running=is_running/>

            // Side panels
            <Show when=move || show_events.get() fallback=|| view! { <div></div> }>
                <div class="side-panel left">
                    <EventFeed feed_items=event_feed/>
                </div>
            </Show>

            <Show when=move || show_energy.get() fallback=|| view! { <div></div> }>
                <div class="side-panel right">
                    <EnergyManagement game_state=(*game_state_energy).clone()/>
                </div>
            </Show>

            <Show when=move || show_drones.get() fallback=|| view! { <div></div> }>
                <div class="side-panel right-lower">
                    <DroneDeploymentPanel game_state=(*game_state_drones).clone()/>
                </div>
            </Show>

            // Research Panel (full modal)
            <ResearchPanel show=show_research on_close=move || set_show_research.set(false)/>

            // Token Store (full modal)
            <TokenStore
                game_state=(*game_state_tokens).clone()
                show=show_token_store
                on_close=move || set_show_token_store.set(false)
            />

            // Synergy System (floating indicator)
            <SynergySystem
                active_weapons={
                    let game_state_synergy = game_state_rc.clone();
                    create_memo(move |_| {
                        // Get all equipped weapons for multi-weapon synergy detection
                        game_state_synergy.weapons.get()
                            .into_iter()
                            .map(|w| w.weapon_type)
                            .collect::<Vec<_>>()
                    })
                }
                show=show_synergies
            />

            <div class="controls-footer">
                <div class="control-section">
                    <button
                        class="control-button primary"
                        on:click=move |_| {
                            set_is_running.update(|r| *r = !*r);
                            if is_running.get() {
                                set_event_feed
                                    .update(|feed| {
                                        feed.push(
                                            create_feed_item("Mission started".to_string(), FeedSeverity::Info),
                                        );
                                    });
                            }
                        }
                    >

                        {move || if is_running.get() { "⏸ PAUSE" } else { "▶ START" }}
                    </button>

                    <button
                        class="control-button"
                        on:click={
                            let game_state_reset = game_state.clone();
                            move |_| {
                                game_state_reset.reset();
                                set_is_running.set(false);
                                set_event_feed
                                    .set(vec![
                                        create_feed_item("Game reset".to_string(), FeedSeverity::Info),
                                    ]);
                            }
                        }
                    >

                        "↺ RESET"
                    </button>
                </div>

                <WeaponPanel game_state=(*game_state_weapons).clone()/>

                <div class="control-section">
                    <button
                        class="control-button"
                        on:click=move |_| {
                            set_show_events.update(|e| *e = !*e);
                        }
                    >

                        "📜 LOG"
                    </button>

                    <button
                        class="control-button"
                        on:click=move |_| {
                            set_show_energy.update(|e| *e = !*e);
                        }
                    >

                        "⚡ ENERGY"
                    </button>

                    <button
                        class="control-button"
                        on:click=move |_| {
                            set_show_drones.update(|d| *d = !*d);
                        }
                    >

                        "🚁 DRONES"
                    </button>

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
                            set_show_research.update(|r| *r = !*r);
                        }
                    >

                        "🔬 RESEARCH"
                    </button>

                    <button
                        class="control-button"
                        on:click=move |_| {
                            set_show_token_store.update(|t| *t = !*t);
                        }
                    >

                        "🪙 STORE"
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
                                    <kbd>"E"</kbd>
                                    " - Toggle energy management"
                                </li>
                                <li>
                                    <kbd>"D"</kbd>
                                    " - Toggle drone deployment"
                                </li>
                                <li>
                                    <kbd>"L"</kbd>
                                    " - Toggle event log"
                                </li>
                                <li>
                                    <kbd>"T"</kbd>
                                    " - Toggle token store"
                                </li>
                                <li>
                                    <kbd>"F"</kbd>
                                    " - Toggle research panel"
                                </li>
                                <li>
                                    <kbd>"G"</kbd>
                                    " - Toggle synergy indicator"
                                </li>
                                <li>
                                    <kbd>"X"</kbd>
                                    " - Toggle auto-targeting"
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
