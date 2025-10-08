use crate::game::{engine::GameEngine, GameStateManager};
use leptos::*;
use std::cell::RefCell;
use std::rc::Rc;
use wasm_bindgen::{closure::Closure, JsCast};
use web_sys::{CanvasRenderingContext2d, HtmlCanvasElement};

#[component]
pub fn GameCanvas(game_state: GameStateManager, is_running: ReadSignal<bool>) -> impl IntoView {
    let canvas_ref = create_node_ref::<html::Canvas>();

    // Game engine - shared between animation loop and event handlers
    let engine = Rc::new(RefCell::new(GameEngine::new(1)));

    // Create a shared running state for the animation loop
    let is_running_shared = Rc::new(RefCell::new(false));
    let is_running_shared_effect = is_running_shared.clone();

    // Keep the shared state in sync with the Leptos signal
    create_effect(move |_| {
        let running = is_running.get();
        *is_running_shared_effect.borrow_mut() = running;
    });

    // Set up canvas immediately when component mounts (during loading)
    create_effect(move |_| {
        let Some(canvas_elem) = canvas_ref.get() else {
            return;
        };

        let canvas = canvas_elem.unchecked_ref::<HtmlCanvasElement>();

        // Get 2D context with proper error handling
        let context = match canvas.get_context("2d") {
            Ok(Some(ctx)) => match ctx.dyn_into::<CanvasRenderingContext2d>() {
                Ok(ctx_2d) => ctx_2d,
                Err(_) => {
                    if cfg!(debug_assertions) {
                        web_sys::console::error_1(&"Failed to cast canvas context to 2D".into());
                    }
                    return;
                }
            },
            Ok(None) => {
                if cfg!(debug_assertions) {
                    web_sys::console::error_1(&"Canvas 2D context is None".into());
                }
                return;
            }
            Err(e) => {
                if cfg!(debug_assertions) {
                    web_sys::console::error_2(&"Failed to get canvas context:".into(), &e);
                }
                return;
            }
        };
        if cfg!(debug_assertions) {
            web_sys::console::log_1(&"Canvas context created!".into());
        }

        // Set canvas size to fill container
        let rect = canvas.get_bounding_client_rect();
        let width = if rect.width() > 0.0 {
            rect.width()
        } else {
            1920.0
        };
        let height = if rect.height() > 0.0 {
            rect.height()
        } else {
            1080.0
        };
        canvas.set_width(width as u32);
        canvas.set_height(height as u32);

        // Clear canvas with dark background (no test pattern)
        context.set_fill_style_str("#0a0e1a");
        context.fill_rect(0.0, 0.0, width, height);

        // Clone for the game loop
        let engine_loop = engine.clone();
        let game_state_loop = game_state.clone();
        let is_running_loop = is_running_shared.clone();

        // Use requestAnimationFrame for smoother animation
        let Some(window) = web_sys::window() else {
            if cfg!(debug_assertions) {
                web_sys::console::error_1(
                    &"Window not available: must run in browser environment".into(),
                );
            }
            return;
        };
        let Some(performance) = window.performance() else {
            if cfg!(debug_assertions) {
                web_sys::console::error_1(&"Performance API not available in this browser".into());
            }
            return;
        };
        let last_time = Rc::new(RefCell::new(performance.now()));
        let last_time_clone = last_time.clone();

        // Create the animation frame callback
        let animation_closure = Rc::new(RefCell::new(None::<Closure<dyn FnMut(f64)>>));
        let animation_closure_clone = animation_closure.clone();

        let callback = Closure::wrap(Box::new(move |current_time: f64| {
            let is_game_running = *is_running_loop.borrow();
            if !is_game_running {
                // Still request next frame even when not running, so we can check again
                if let Some(win) = web_sys::window() {
                    let _ = win.request_animation_frame(
                        animation_closure_clone
                            .borrow()
                            .as_ref()
                            .unwrap()
                            .as_ref()
                            .unchecked_ref(),
                    );
                }
                return;
            }

            let prev_time = *last_time_clone.borrow();
            let delta_time = ((current_time - prev_time) / 1000.0) as f32;
            *last_time_clone.borrow_mut() = current_time;

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
                // Clamp wave number to u8 range to prevent wraparound past 255
                game_state_loop
                    .level
                    .set(engine_ref.current_wave().min(255) as u8);
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

            // Calculate FPS (cast to f32 for frame_rate signal)
            let fps = 1.0f32 / (delta_time as f32).max(0.001);
            game_state_loop.frame_rate.set(fps);

            // Request next frame
            if let Some(win) = web_sys::window() {
                if let Err(e) = win.request_animation_frame(
                    animation_closure_clone
                        .borrow()
                        .as_ref()
                        .unwrap()
                        .as_ref()
                        .unchecked_ref(),
                ) {
                    if cfg!(debug_assertions) {
                        web_sys::console::error_2(&"Failed to request animation frame:".into(), &e);
                    }
                }
            } else {
                if cfg!(debug_assertions) {
                    web_sys::console::error_1(&"Window unavailable for animation frame".into());
                }
            }
        }) as Box<dyn FnMut(f64)>);

        *animation_closure.borrow_mut() = Some(callback);

        // Start the animation loop
        if cfg!(debug_assertions) {
            web_sys::console::log_1(&"Starting animation loop".into());
        }

        // Test that the closure is properly created
        if animation_closure.borrow().is_none() {
            if cfg!(debug_assertions) {
                web_sys::console::error_1(&"Closure is None!".into());
            }
            return;
        }
        if cfg!(debug_assertions) {
            web_sys::console::log_1(&"Closure created successfully".into());
        }

        match window.request_animation_frame(
            animation_closure
                .borrow()
                .as_ref()
                .unwrap()
                .as_ref()
                .unchecked_ref(),
        ) {
            Ok(handle) => {
                if cfg!(debug_assertions) {
                    web_sys::console::log_2(
                        &"Animation loop started with handle:".into(),
                        &handle.into(),
                    );
                }
            }
            Err(e) => {
                if cfg!(debug_assertions) {
                    web_sys::console::error_2(&"Failed to start animation loop:".into(), &e);
                }
                return;
            }
        }

        // Clean up: break the Rc cycle so the closure can be dropped
        on_cleanup({
            let animation_closure = animation_closure.clone();
            move || {
                // Dropping the Closure removes the JS callback reference
                let _ = animation_closure.borrow_mut().take();
            }
        });
    });

    view! {
        <canvas
            node_ref=canvas_ref
            class="game-canvas"
            width="1920"
            height="1080"
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
    ctx.set_fill_style_str("#0a0e1a");
    ctx.fill_rect(0.0, 0.0, width, height);

    // Draw tactical grid
    ctx.set_stroke_style_str("rgba(0, 255, 255, 0.08)");
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

    ctx.set_stroke_style_str("rgba(0, 255, 255, 0.15)");
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
    ctx.set_fill_style_str("#00ffff");
    ctx.begin_path();
    ctx.arc(center_x, center_y, 30.0, 0.0, 2.0 * std::f64::consts::PI)
        .unwrap();
    ctx.fill();

    // Inner core
    ctx.set_fill_style_str("#ffffff");
    ctx.begin_path();
    ctx.arc(center_x, center_y, 15.0, 0.0, 2.0 * std::f64::consts::PI)
        .unwrap();
    ctx.fill();
    ctx.set_shadow_blur(0.0);

    // Draw threats with type-specific colors
    let threats = game_state.threats.get_untracked();

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
        ctx.set_fill_style_str(color);
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
            ctx.set_fill_style_str("#ffff00");
            ctx.set_font("10px monospace");
            // Safely take last 8 chars (Unicode scalar values) to avoid UTF-8 boundary panics
            let label: String = threat
                .id
                .chars()
                .rev()
                .take(8)
                .collect::<Vec<_>>()
                .into_iter()
                .rev()
                .collect();
            ctx.fill_text(
                &label,
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
            ctx.set_fill_style_str("rgba(0, 0, 0, 0.7)");
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
            ctx.set_fill_style_str(health_color);
            ctx.fill_rect(
                threat.position.x as f64 - bar_width / 2.0,
                threat.position.y as f64 - threat.size as f64 - 12.0,
                bar_width * health_pct as f64,
                bar_height,
            );
        }
    }

    // Draw drones with battery indicators
    let drones = game_state.drones.get_untracked();

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
        ctx.set_fill_style_str(drone_color);
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

        ctx.set_fill_style_str("rgba(0, 0, 0, 0.7)");
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
        ctx.set_fill_style_str(battery_color);
        ctx.fill_rect(
            drone.position.x as f64 - bar_width / 2.0,
            drone.position.y as f64 + 15.0,
            bar_width * battery_pct as f64,
            bar_height,
        );
    }

    // Version indicator in bottom right corner
    ctx.set_font("12px 'Courier New', monospace");
    ctx.set_fill_style_str("rgba(0, 255, 255, 0.4)");
    ctx.fill_text("v0.1.0-alpha", width - 80.0, height - 10.0)
        .unwrap();
}
