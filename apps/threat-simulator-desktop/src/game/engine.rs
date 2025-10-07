// Game engine core logic - collision detection, spawn management, etc.

use super::types::{Threat, Drone, Vector2};

pub struct GameEngine {
    spawn_timer: f32,
    spawn_interval: f32,
}

impl GameEngine {
    pub fn new() -> Self {
        Self {
            spawn_timer: 0.0,
            spawn_interval: 2.0,
        }
    }
    
    pub fn update(&mut self, delta_time: f32) -> Option<Threat> {
        self.spawn_timer += delta_time;
        
        if self.spawn_timer >= self.spawn_interval {
            self.spawn_timer = 0.0;
            Some(self.spawn_threat())
        } else {
            None
        }
    }
    
    fn spawn_threat(&self) -> Threat {
        use super::types::ThreatType;
        use rand::Rng;
        
        let mut rng = rand::thread_rng();
        let angle = rng.gen_range(0.0..std::f32::consts::PI * 2.0);
        let distance = 800.0;
        
        let x = 960.0 + angle.cos() * distance;
        let y = 540.0 + angle.sin() * distance;
        
        Threat {
            id: format!("threat-{}", rng.gen::<u32>()),
            threat_type: ThreatType::Commercial,
            position: Vector2::new(x, y),
            velocity: Vector2::zero(),
            health: 100.0,
            max_health: 100.0,
            speed: 50.0,
            size: 20.0,
            is_targeted: false,
            distance_to_base: distance,
        }
    }
}

impl Default for GameEngine {
    fn default() -> Self {
        Self::new()
    }
}

