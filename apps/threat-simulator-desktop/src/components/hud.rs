use crate::game::GameStateManager;
use leptos::*;

#[component]
pub fn Hud(game_state: GameStateManager, is_running: ReadSignal<bool>) -> impl IntoView {
    view! {
        <div class="hud-container">
            <div class="stats-panel">
                <div class="stat-item">
                    <span class="stat-label">"Score:"</span>
                    <span class="stat-value">{move || game_state.score.get()}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">"Level:"</span>
                    <span class="stat-value">{move || game_state.level.get()}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">"Neutralized:"</span>
                    <span class="stat-value">{move || game_state.neutralized.get()}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">"Energy:"</span>
                    <span class="stat-value">{move || format!("{:.0}%", game_state.energy.get())}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">"Cooling:"</span>
                    <span class="stat-value">{move || format!("{:.0}%", game_state.cooling.get())}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">"Mothership:"</span>
                    <span class="stat-value">{move || format!("{:.0}%", game_state.mothership_health.get())}</span>
                </div>
            </div>

            <div class="fps-counter">
                {move || format!("FPS: {:.0}", game_state.frame_rate.get())}
            </div>
        </div>
    }
}
