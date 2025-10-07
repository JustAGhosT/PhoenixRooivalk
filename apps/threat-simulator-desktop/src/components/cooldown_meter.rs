use leptos::*;

#[component]
pub fn CooldownMeter(
    current: ReadSignal<f32>,
    max: ReadSignal<f32>,
    label: &'static str,
) -> impl IntoView {
    let percentage = move || {
        let curr = current.get();
        let mx = max.get();
        if mx > 0.0 {
            ((curr / mx) * 100.0).min(100.0)
        } else {
            0.0
        }
    };

    let is_ready = move || current.get() == 0.0;

    view! {
        <div class="cooldown-meter">
            <div class="cooldown-header">
                <span class="cooldown-label">{label}</span>
                <span class="cooldown-value">
                    {move || if is_ready() { "READY" } else { format!("{:.1}s", current.get()) }}
                </span>
            </div>
            <div class="cooldown-bar-container">
                <div
                    class=move || {
                        if is_ready() { "cooldown-bar ready" } else { "cooldown-bar charging" }
                    }

                    style:width=move || format!("{}%", 100.0 - percentage())
                ></div>
            </div>
        </div>
    }
}

#[component]
pub fn WeaponCooldownGrid(weapons: ReadSignal<Vec<crate::game::Weapon>>) -> impl IntoView {
    view! {
        <div class="weapon-cooldown-grid">
            <For
                each=move || weapons.get().into_iter().enumerate().collect::<Vec<_>>()
                key=|(i, _)| *i
                children=move |(_, weapon): (usize, crate::game::Weapon)| {
                    let cooldown_signal = create_rw_signal(weapon.cooldown);
                    let max_signal = create_rw_signal(weapon.max_cooldown);
                    let label = format!("{:?}", weapon.weapon_type);
                    view! {
                        <div class="weapon-cooldown-item">
                            <div class="weapon-name-small">{label}</div>
                            <div class="cooldown-progress">
                                <div
                                    class="cooldown-fill"
                                    style:width=move || {
                                        let pct = if weapon.max_cooldown > 0.0 {
                                            ((weapon.cooldown / weapon.max_cooldown) * 100.0).min(100.0)
                                        } else {
                                            0.0
                                        };
                                        format!("{}%", pct)
                                    }

                                    style:background-color=move || {
                                        if weapon.cooldown == 0.0 { "#00ff00" } else { "#ff6600" }
                                    }
                                ></div>
                            </div>
                        </div>
                    }
                }
            />

        </div>
    }
}
