use leptos::*;
use web_sys::{CanvasRenderingContext2d, HtmlCanvasElement};
use wasm_bindgen::JsCast;
use gloo_timers::callback::Interval;
use crate::game::{GameStateManager, Vector2};

#[component]
pub fn GameCanvas(
    game_state: GameStateManager,
    is_running: ReadSignal<bool>,
) -> impl IntoView {
    let canvas_ref = create_node_ref::<html::Canvas>();
    
    // Animation loop
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
        
        // Start game loop
        let game_state_clone = game_state.clone();
        let _interval = Interval::new(16, move || {
            if !is_running.get() {
                return;
            }
            
            render_frame(&context, &game_state_clone, width, height);
            update_game_logic(&game_state_clone, 0.016);
        });
        
        // Keep interval alive
        std::mem::forget(_interval);
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
    // Clear canvas
    ctx.set_fill_style(&"#0a0e1a".into());
    ctx.fill_rect(0.0, 0.0, width, height);
    
    // Draw grid
    ctx.set_stroke_style(&"rgba(0, 255, 255, 0.1)".into());
    ctx.set_line_width(1.0);
    
    for i in 0..20 {
        let x = (i as f64) * (width / 20.0);
        ctx.begin_path();
        ctx.move_to(x, 0.0);
        ctx.line_to(x, height);
        ctx.stroke();
    }
    
    for i in 0..11 {
        let y = (i as f64) * (height / 11.0);
        ctx.begin_path();
        ctx.move_to(0.0, y);
        ctx.line_to(width, y);
        ctx.stroke();
    }
    
    // Draw mothership (center)
    let center_x = width / 2.0;
    let center_y = height / 2.0;
    
    ctx.set_fill_style(&"#00ffff".into());
    ctx.begin_path();
    ctx.arc(center_x, center_y, 30.0, 0.0, 2.0 * std::f64::consts::PI).unwrap();
    ctx.fill();
    
    // Draw threats
    let threats = game_state.threats.get();
    ctx.set_fill_style(&"#ff3333".into());
    
    for threat in threats.iter() {
        ctx.begin_path();
        ctx.arc(
            threat.position.x as f64,
            threat.position.y as f64,
            threat.size as f64 * 0.5,
            0.0,
            2.0 * std::f64::consts::PI
        ).unwrap();
        ctx.fill();
        
        // Health bar
        if threat.health < threat.max_health {
            let bar_width = threat.size as f64;
            let bar_height = 5.0;
            let health_pct = threat.health / threat.max_health;
            
            ctx.set_fill_style(&"#333".into());
            ctx.fill_rect(
                threat.position.x as f64 - bar_width / 2.0,
                threat.position.y as f64 - threat.size as f64 - 10.0,
                bar_width,
                bar_height
            );
            
            ctx.set_fill_style(&"#00ff00".into());
            ctx.fill_rect(
                threat.position.x as f64 - bar_width / 2.0,
                threat.position.y as f64 - threat.size as f64 - 10.0,
                bar_width * health_pct as f64,
                bar_height
            );
        }
    }
    
    // Draw drones
    let drones = game_state.drones.get();
    ctx.set_fill_style(&"#00ff00".into());
    
    for drone in drones.iter() {
        ctx.begin_path();
        ctx.arc(
            drone.position.x as f64,
            drone.position.y as f64,
            8.0,
            0.0,
            2.0 * std::f64::consts::PI
        ).unwrap();
        ctx.fill();
    }
}

fn update_game_logic(game_state: &GameStateManager, delta_time: f32) {
    // Update game time
    game_state.game_time.update(|t| *t += delta_time as f64);
    
    // Regenerate resources
    game_state.regenerate_energy(delta_time);
    game_state.regenerate_cooling(delta_time);
    
    // Update weapon cooldowns
    game_state.update_weapon_cooldowns(delta_time);
    
    // Update threats
    let center = Vector2::new(960.0, 540.0);
    game_state.threats.update(|threats| {
        for threat in threats.iter_mut() {
            // Move towards center
            let direction = Vector2::new(
                center.x - threat.position.x,
                center.y - threat.position.y,
            ).normalize();
            
            threat.velocity = direction.scale(threat.speed);
            threat.position.x += threat.velocity.x * delta_time;
            threat.position.y += threat.velocity.y * delta_time;
            
            threat.distance_to_base = threat.position.distance(&center);
        }
    });
    
    // Calculate FPS
    let fps = 1.0 / delta_time;
    game_state.frame_rate.set(fps);
}

