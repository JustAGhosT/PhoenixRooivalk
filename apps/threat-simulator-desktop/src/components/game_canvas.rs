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
        web_sys::console::log_1(&format!("is_running signal changed to: {}", running).into());
    });

    // Set up canvas immediately when component mounts (during loading)
    create_effect(move |_| {
        web_sys::console::log_1(&"GameCanvas create_effect triggered - setting up canvas".into());

        let Some(canvas_elem) = canvas_ref.get() else {
            web_sys::console::log_1(&"Canvas not ready yet".into());
            return;
        };

        let canvas = canvas_elem.unchecked_ref::<HtmlCanvasElement>();
        web_sys::console::log_1(&"Canvas element found!".into());
        
        // Check canvas visibility
        if let Some(win) = web_sys::window() {
            if let Ok(Some(style)) = win.get_computed_style(&canvas_elem) {
                let display = style.get_property_value("display").unwrap_or_else(|_| "unknown".to_string());
                let visibility = style.get_property_value("visibility").unwrap_or_else(|_| "unknown".to_string());
                let opacity = style.get_property_value("opacity").unwrap_or_else(|_| "unknown".to_string());
                web_sys::console::log_3(&"Canvas CSS display:".into(), &display.into(), &visibility.into());
                web_sys::console::log_1(&format!("Canvas CSS opacity: {}", opacity).into());
            }
        }

        // Get 2D context with proper error handling
        let context = match canvas.get_context("2d") {
            Ok(Some(ctx)) => match ctx.dyn_into::<CanvasRenderingContext2d>() {
                Ok(ctx_2d) => ctx_2d,
                Err(_) => {
                    web_sys::console::error_1(&"Failed to cast canvas context to 2D".into());
                    return;
                }
            },
            Ok(None) => {
                web_sys::console::error_1(&"Canvas 2D context is None".into());
                return;
            }
            Err(e) => {
                web_sys::console::error_2(&"Failed to get canvas context:".into(), &e);
                return;
            }
        };
        web_sys::console::log_1(&"Canvas context created!".into());

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
        web_sys::console::log_3(&"Canvas size:".into(), &width.into(), &height.into());
        web_sys::console::log_3(&"Canvas bounding rect:".into(), &rect.width().into(), &rect.height().into());
        web_sys::console::log_3(&"Canvas position:".into(), &rect.left().into(), &rect.top().into());
        canvas.set_width(width as u32);
        canvas.set_height(height as u32);
        web_sys::console::log_3(&"Canvas dimensions set to:".into(), &(canvas.width() as f64).into(), &(canvas.height() as f64).into());

        // Clone for the game loop
        let engine_loop = engine.clone();
        let game_state_loop = game_state.clone();
        let is_running_loop = is_running_shared.clone();

        // Use requestAnimationFrame for smoother animation
        let Some(window) = web_sys::window() else {
            web_sys::console::error_1(
                &"Window not available: must run in browser environment".into(),
            );
            return;
        };
        let Some(performance) = window.performance() else {
            web_sys::console::error_1(&"Performance API not available in this browser".into());
            return;
        };
        let last_time = Rc::new(RefCell::new(performance.now()));
        let last_time_clone = last_time.clone();

        // Create the animation frame callback
        let animation_closure = Rc::new(RefCell::new(None::<Closure<dyn FnMut(f64)>>));
        let animation_closure_clone = animation_closure.clone();

        let callback = Closure::wrap(Box::new(move |current_time: f64| {
            web_sys::console::log_1(&"Animation loop callback called".into());
            let is_game_running = *is_running_loop.borrow();
            web_sys::console::log_1(&format!("is_running value: {}", is_game_running).into());
            if !is_game_running {
                web_sys::console::log_1(&"Game not running in animation loop".into());
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
            web_sys::console::log_1(&"Animation loop executing - game is running!".into());

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
            web_sys::console::log_1(&"About to call render_frame".into());
            // Check if context is still valid
            if let Some(canvas) = context.canvas() {
                web_sys::console::log_1(&"Canvas context is valid".into());
                web_sys::console::log_2(&"Canvas element dimensions:".into(), &format!("{}x{}", canvas.width(), canvas.height()).into());
            } else {
                web_sys::console::error_1(&"Canvas context has no canvas element".into());
            }
            match std::panic::catch_unwind(|| {
            render_frame(&context, &game_state_loop, width, height);
            }) {
                Ok(_) => web_sys::console::log_1(&"render_frame call completed".into()),
                Err(e) => web_sys::console::error_1(&format!("render_frame panic: {:?}", e).into()),
            }

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
                    web_sys::console::error_2(&"Failed to request animation frame:".into(), &e);
                }
            } else {
                web_sys::console::error_1(&"Window unavailable for animation frame".into());
            }
        }) as Box<dyn FnMut(f64)>);
        
        *animation_closure.borrow_mut() = Some(callback);

        // Start the animation loop
        web_sys::console::log_1(&"Starting animation loop".into());
        
        // Test that the closure is properly created
        if animation_closure.borrow().is_none() {
            web_sys::console::error_1(&"Closure is None!".into());
            return;
        }
        web_sys::console::log_1(&"Closure created successfully".into());
        
        match window.request_animation_frame(
            animation_closure.borrow().as_ref().unwrap().as_ref().unchecked_ref()
        ) {
            Ok(handle) => {
                web_sys::console::log_2(&"Animation loop started with handle:".into(), &handle.into());
            }
            Err(e) => {
                web_sys::console::error_2(&"Failed to start animation loop:".into(), &e);
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
            style="border: 2px solid #00ffff; background: #0a0e1a;"
        />
    }
}

fn render_frame(
    ctx: &CanvasRenderingContext2d,
    _game_state: &GameStateManager,
    width: f64,
    height: f64,
) {
    web_sys::console::log_3(&"render_frame: Starting render with dimensions:".into(), &width.into(), &height.into());
    
    // Clear canvas with dark background
    ctx.set_fill_style_str("#0a0e1a");
    ctx.fill_rect(0.0, 0.0, width, height);
    web_sys::console::log_1(&"render_frame: Canvas cleared with background".into());
    
    // Draw simple radar display
    let center_x = width / 2.0;
    let center_y = height / 2.0;

    // Radar background circle
    ctx.set_fill_style_str("rgba(0, 50, 0, 0.3)");
    ctx.begin_path();
    ctx.arc(center_x, center_y, 200.0, 0.0, 2.0 * std::f64::consts::PI).unwrap();
    ctx.fill();

    // Radar grid lines
    ctx.set_stroke_style_str("rgba(0, 255, 0, 0.5)");
    ctx.set_line_width(1.0);
    
    // Horizontal line
    ctx.begin_path();
    ctx.move_to(center_x - 200.0, center_y);
    ctx.line_to(center_x + 200.0, center_y);
    ctx.stroke();
    
    // Vertical line
    ctx.begin_path();
    ctx.move_to(center_x, center_y - 200.0);
    ctx.line_to(center_x, center_y + 200.0);
    ctx.stroke();
    
    // Radar sweep line (rotating)
    let now = web_sys::js_sys::Date::new_0();
    let angle = (now.get_seconds() as f64 + now.get_milliseconds() as f64 / 1000.0) * 6.0; // 6 degrees per second
    let radians = angle * std::f64::consts::PI / 180.0;
    
        ctx.begin_path();
    ctx.move_to(center_x, center_y);
    ctx.line_to(
        center_x + 200.0 * radians.cos(),
        center_y + 200.0 * radians.sin(),
    );
    ctx.stroke();
    
    // Center dot
    ctx.set_fill_style_str("#00ff00");
        ctx.begin_path();
    ctx.arc(center_x, center_y, 3.0, 0.0, 2.0 * std::f64::consts::PI).unwrap();
        ctx.fill();
    
    web_sys::console::log_1(&"render_frame: Radar display drawn".into());
    
    web_sys::console::log_1(&"render_frame: Render completed successfully".into());
}