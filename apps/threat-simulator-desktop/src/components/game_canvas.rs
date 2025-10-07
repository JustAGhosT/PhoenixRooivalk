use crate::game::{engine::GameEngine, GameStateManager, Vector2};
use leptos::*;
use std::cell::RefCell;
use std::rc::Rc;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;
use web_sys::{window, CanvasRenderingContext2d, HtmlCanvasElement, MouseEvent};

#[component]
pub fn GameCanvas(game_state: GameStateManager, is_running: ReadSignal<bool>) -> impl IntoView {
    let canvas_ref = create_node_ref::<html::Canvas>();

    // Game engine - shared between animation loop and event handlers
    let engine = Rc::new(RefCell::new(GameEngine::new(1)));
    let engine_clone = engine.clone();

    // Mouse click handler for weapon firing
    let on_canvas_click = move |event: MouseEvent| {
        let canvas = canvas_ref.get().unwrap();
        let canvas: HtmlCanvasElement = canvas.unchecked_into();
        let rect = canvas.get_bounding_client_rect();

        let x = (event.client_x() as f64 - rect.left()) * (1920.0 / rect.width());
        let y = (event.client_y() as f64 - rect.top()) * (1080.0 / rect.height());

        let click_pos = Vector2::new(x as f32, y as f32);

        // Find and target nearest threat
        let mut engine_ref = engine_clone.borrow_mut();
        let threats = engine_ref.get_threats();

        if let Some((threat_id, _)) = threats
            .iter()
            .map(|t| (t.id.clone(), t.position.distance(&click_pos)))
            .min_by(|a, b| a.1.partial_cmp(&b.1).unwrap())
        {
            // Damage the clicked threat
            engine_ref.damage_threat(&threat_id, 50.0);
            game_state.update_score(10);
            game_state.neutralized.update(|n| *n += 1);
        }
    };

    // Animation loop with game engine
    create_effect(move |_| {
        if !is_running.get() {
            return;
        }

        let Some(canvas) = canvas_ref.get() else {
            return;
        };

        let canvas: HtmlCanvasElement = canvas.unchecked_into();
        let context = canvas
            .get_context("2d")
            .unwrap()
            .unwrap()
            .dyn_into::<CanvasRenderingContext2d>()
            .unwrap();

        // Set canvas size
        let width = 1920.0;
        let height = 1080.0;
        canvas.set_width(width as u32);
        canvas.set_height(height as u32);

        // Clone for the game loop
        let engine_loop = engine.clone();
        let game_state_loop = game_state.clone();

        // Use requestAnimationFrame for smoother animation
        let window = window().unwrap();
        let performance = window.performance().unwrap();
        let mut last_time = performance.now();

        let closure = Rc::new(RefCell::new(None::<Closure<dyn FnMut(f64)>>));
        let closure_clone = closure.clone();

        *closure.borrow_mut() = Some(Closure::new(move |current_time: f64| {
            if !is_running.get() {
                return;
            }

            let delta_time = ((current_time - last_time) / 1000.0) as f32;
            last_time = current_time;

            // Clamp delta time to prevent huge jumps
            let delta_time = delta_time.min(0.1).max(0.001);

            // Update game engine
            {
                let mut engine_ref = engine_loop.borrow_mut();
                engine_ref.update(delta_time);

                // Sync engine state to Leptos signals
                let threats = engine_ref.get_threats().to_vec();
                let drones = engine_ref.get_drones().to_vec();

                game_state_loop.threats.set(threats);
                game_state_loop.drones.set(drones);
                game_state_loop.level.set(engine_ref.current_wave() as u8);
            }

            // Render
            render_frame(&context, &game_state_loop, width, height);

            // Update reactive state
            game_state_loop.regenerate_energy(delta_time);
            game_state_loop.regenerate_cooling(delta_time);
            game_state_loop.update_weapon_cooldowns(delta_time);
            game_state_loop
                .game_time
                .update(|t| *t += delta_time as f64);

            // Calculate FPS
            let fps = 1.0 / delta_time.max(0.001);
            game_state_loop.frame_rate.set(fps);

            // Request next frame
            let window = window().unwrap();
            window
                .request_animation_frame(
                    closure_clone
                        .borrow()
                        .as_ref()
                        .unwrap()
                        .as_ref()
                        .unchecked_ref(),
                )
                .unwrap();
        }));

        // Start the animation loop
        window
            .request_animation_frame(closure.borrow().as_ref().unwrap().as_ref().unchecked_ref())
            .unwrap();

        // Keep closure alive
        std::mem::forget(closure);
    });

    view! {
        <canvas
            node_ref=canvas_ref
            class="game-canvas"
            width="1920"
            height="1080"
            on:click=on_canvas_click
        />
    }
}

fn render_frame(
    ctx: &CanvasRenderingContext2d,
    game_state: &GameStateManager,
    width: f64,
    height: f64,
) {
    // Clear canvas with dark background
    ctx.set_fill_style(&"#0a0e1a".into());
    ctx.fill_rect(0.0, 0.0, width, height);

    // Draw tactical grid
    ctx.set_stroke_style(&"rgba(0, 255, 255, 0.08)".into());
    ctx.set_line_width(1.0);

    // Vertical lines
    for i in 0..20 {
        let x = (i as f64) * (width / 20.0);
        ctx.begin_path();
        ctx.move_to(x, 0.0);
        ctx.line_to(x, height);
        ctx.stroke();
    }

    // Horizontal lines
    for i in 0..12 {
        let y = (i as f64) * (height / 12.0);
        ctx.begin_path();
        ctx.move_to(0.0, y);
        ctx.line_to(width, y);
        ctx.stroke();
    }

    // Draw range circles (defensive perimeter)
    let center_x = width / 2.0;
    let center_y = height / 2.0;

    ctx.set_stroke_style(&"rgba(0, 255, 255, 0.15)".into());
    ctx.set_line_width(2.0);
    for radius in [200.0, 400.0, 600.0] {
        ctx.begin_path();
        ctx.arc(center_x, center_y, radius, 0.0, 2.0 * std::f64::consts::PI)
            .unwrap();
        ctx.stroke();
    }

    // Draw mothership (center) with glow effect
    ctx.set_shadow_blur(20.0);
    ctx.set_shadow_color("rgba(0, 255, 255, 0.8)");
    ctx.set_fill_style(&"#00ffff".into());
    ctx.begin_path();
    ctx.arc(center_x, center_y, 30.0, 0.0, 2.0 * std::f64::consts::PI)
        .unwrap();
    ctx.fill();

    // Inner core
    ctx.set_fill_style(&"#ffffff".into());
    ctx.begin_path();
    ctx.arc(center_x, center_y, 15.0, 0.0, 2.0 * std::f64::consts::PI)
        .unwrap();
    ctx.fill();
    ctx.set_shadow_blur(0.0);

    // Draw threats with type-specific colors
    let threats = game_state.threats.get();

    for threat in threats.iter() {
        // Color based on threat type
        let color = match threat.threat_type {
            crate::game::ThreatType::Commercial => "#ff6666",
            crate::game::ThreatType::Military => "#ff3333",
            crate::game::ThreatType::Swarm => "#ffaa33",
            crate::game::ThreatType::Stealth => "#9933ff",
            crate::game::ThreatType::Kamikaze => "#ff0000",
            crate::game::ThreatType::Recon => "#33ff99",
            crate::game::ThreatType::ElectronicWarfare => "#ff33ff",
        };

        // Draw threat with glow
        ctx.set_shadow_blur(10.0);
        ctx.set_shadow_color(color);
        ctx.set_fill_style(&color.into());
        ctx.begin_path();
        ctx.arc(
            threat.position.x as f64,
            threat.position.y as f64,
            threat.size as f64 * 0.5,
            0.0,
            2.0 * std::f64::consts::PI,
        )
        .unwrap();
        ctx.fill();
        ctx.set_shadow_blur(0.0);

        // Threat ID label for targeted threats
        if threat.is_targeted {
            ctx.set_fill_style(&"#ffff00".into());
            ctx.set_font("10px monospace");
            let label = &threat.id[threat.id.len().saturating_sub(8)..];
            ctx.fill_text(
                label,
                threat.position.x as f64 - 15.0,
                threat.position.y as f64 - threat.size as f64 - 15.0,
            )
            .unwrap();
        }

        // Health bar
        if threat.health < threat.max_health {
            let bar_width = threat.size as f64;
            let bar_height = 4.0;
            let health_pct = threat.health / threat.max_health;

            // Background
            ctx.set_fill_style(&"rgba(0, 0, 0, 0.7)".into());
            ctx.fill_rect(
                threat.position.x as f64 - bar_width / 2.0,
                threat.position.y as f64 - threat.size as f64 - 12.0,
                bar_width,
                bar_height,
            );

            // Health
            let health_color = if health_pct > 0.6 {
                "#00ff00"
            } else if health_pct > 0.3 {
                "#ffaa00"
            } else {
                "#ff3333"
            };
            ctx.set_fill_style(&health_color.into());
            ctx.fill_rect(
                threat.position.x as f64 - bar_width / 2.0,
                threat.position.y as f64 - threat.size as f64 - 12.0,
                bar_width * health_pct as f64,
                bar_height,
            );
        }
    }

    // Draw drones with battery indicators
    let drones = game_state.drones.get();

    for drone in drones.iter() {
        let drone_color = match drone.drone_type {
            crate::game::DroneType::Interceptor => "#00ff00",
            crate::game::DroneType::Jammer => "#ffaa00",
            crate::game::DroneType::Surveillance => "#33aaff",
            crate::game::DroneType::Effector => "#ff6600",
            crate::game::DroneType::Shield => "#3366ff",
            _ => "#00ffaa",
        };

        ctx.set_shadow_blur(8.0);
        ctx.set_shadow_color(drone_color);
        ctx.set_fill_style(&drone_color.into());
        ctx.begin_path();
        ctx.arc(
            drone.position.x as f64,
            drone.position.y as f64,
            10.0,
            0.0,
            2.0 * std::f64::consts::PI,
        )
        .unwrap();
        ctx.fill();
        ctx.set_shadow_blur(0.0);

        // Battery indicator
        let battery_pct = drone.battery / drone.max_battery;
        let bar_width = 20.0;
        let bar_height = 3.0;

        ctx.set_fill_style(&"rgba(0, 0, 0, 0.7)".into());
        ctx.fill_rect(
            drone.position.x as f64 - bar_width / 2.0,
            drone.position.y as f64 + 15.0,
            bar_width,
            bar_height,
        );

        let battery_color = if battery_pct > 0.5 {
            "#00ff00"
        } else if battery_pct > 0.2 {
            "#ffaa00"
        } else {
            "#ff3333"
        };
        ctx.set_fill_style(&battery_color.into());
        ctx.fill_rect(
            drone.position.x as f64 - bar_width / 2.0,
            drone.position.y as f64 + 15.0,
            bar_width * battery_pct as f64,
            bar_height,
        );
    }
}
