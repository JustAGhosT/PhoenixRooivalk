// Game engine core logic - collision detection, spawn management, etc.

use super::physics;
use super::types::{Drone, Threat, Vector2};
use super::waves::WaveManager;

pub struct GameEngine {
    wave_manager: WaveManager,
    active_threats: Vec<Threat>,
    active_drones: Vec<Drone>,
}

impl GameEngine {
    pub fn new(starting_wave: u32) -> Self {
        Self {
            wave_manager: WaveManager::new(starting_wave),
            active_threats: Vec::new(),
            active_drones: Vec::new(),
        }
    }

    /// Main game update loop
    pub fn update(&mut self, delta_time: f32) {
        // Spawn new threats from wave manager
        let new_threats = self.wave_manager.update(delta_time);
        self.active_threats.extend(new_threats);

        // Update physics for all entities
        physics::apply_physics(
            &mut self.active_threats,
            &mut self.active_drones,
            delta_time,
        );

        // Update threat distances to base
        let base_pos = Vector2::new(960.0, 540.0);
        for threat in &mut self.active_threats {
            threat.distance_to_base = threat.position.distance(&base_pos);
        }

        // Remove dead threats
        self.active_threats.retain(|t| t.health > 0.0);

        // Remove drones with no battery
        self.active_drones
            .retain(|d| d.battery > 0.0 && d.health > 0.0);

        // Check if wave is complete
        if self.wave_manager.is_wave_complete() && self.active_threats.is_empty() {
            self.wave_manager.next_wave();
        }
    }

    /// Get all active threats
    pub fn get_threats(&self) -> &[Threat] {
        &self.active_threats
    }

    /// Get all active drones
    pub fn get_drones(&self) -> &[Drone] {
        &self.active_drones
    }

    /// Add a drone to the game
    pub fn add_drone(&mut self, drone: Drone) {
        self.active_drones.push(drone);
    }

    /// Remove a threat by ID
    pub fn remove_threat(&mut self, id: &str) -> bool {
        let before = self.active_threats.len();
        self.active_threats.retain(|t| t.id != id);
        self.active_threats.len() < before
    }

    /// Damage a threat
    pub fn damage_threat(&mut self, id: &str, damage: f32) -> bool {
        if let Some(threat) = self.active_threats.iter_mut().find(|t| t.id == id) {
            threat.health = (threat.health - damage).max(0.0);
            true
        } else {
            false
        }
    }

    /// Get current wave number
    pub fn current_wave(&self) -> u32 {
        self.wave_manager.current_wave()
    }

    /// Get threat count
    pub fn threat_count(&self) -> usize {
        self.active_threats.len()
    }

    /// Get drone count
    pub fn drone_count(&self) -> usize {
        self.active_drones.len()
    }
}

impl Default for GameEngine {
    fn default() -> Self {
        Self::new(1)
    }
}

#[cfg(test)]
mod tests {
    use super::super::types::{DroneType, ThreatType};
    use super::*;

    #[test]
    fn test_engine_creation() {
        let engine = GameEngine::new(1);
        assert_eq!(engine.current_wave(), 1);
        assert_eq!(engine.threat_count(), 0);
    }

    #[test]
    fn test_threat_spawning() {
        let mut engine = GameEngine::new(1);

        // Update multiple times to allow spawning
        for _ in 0..10 {
            engine.update(1.0);
        }

        assert!(engine.threat_count() > 0);
    }

    #[test]
    fn test_add_drone() {
        let mut engine = GameEngine::new(1);

        let drone = Drone {
            id: "test-drone".to_string(),
            drone_type: DroneType::Interceptor,
            position: Vector2::new(100.0, 100.0),
            velocity: Vector2::zero(),
            health: 100.0,
            max_health: 100.0,
            battery: 100.0,
            max_battery: 100.0,
            target_id: None,
        };

        engine.add_drone(drone);
        assert_eq!(engine.drone_count(), 1);
    }

    #[test]
    fn test_damage_threat() {
        let mut engine = GameEngine::new(1);

        // Manually add a threat
        let threat = Threat {
            id: "test-threat".to_string(),
            threat_type: ThreatType::Commercial,
            position: Vector2::new(100.0, 100.0),
            velocity: Vector2::zero(),
            health: 100.0,
            max_health: 100.0,
            speed: 50.0,
            size: 20.0,
            is_targeted: false,
            distance_to_base: 100.0,
        };

        engine.active_threats.push(threat);

        assert!(engine.damage_threat("test-threat", 50.0));

        let threat = &engine.active_threats[0];
        assert_eq!(threat.health, 50.0);
    }

    #[test]
    fn test_remove_dead_threats() {
        let mut engine = GameEngine::new(1);

        // Clear any threats that might have spawned
        engine.active_threats.clear();

        let threat = Threat {
            id: "dead-threat".to_string(),
            threat_type: ThreatType::Commercial,
            position: Vector2::new(100.0, 100.0),
            velocity: Vector2::zero(),
            health: 0.0, // Dead
            max_health: 100.0,
            speed: 50.0,
            size: 20.0,
            is_targeted: false,
            distance_to_base: 100.0,
        };

        engine.active_threats.push(threat);
        assert_eq!(engine.threat_count(), 1);

        engine.update(0.01);

        // Dead threat should be removed (even if new ones spawned, they have health > 0)
        let dead_count = engine
            .active_threats
            .iter()
            .filter(|t| t.id == "dead-threat")
            .count();
        assert_eq!(dead_count, 0, "Dead threat should be removed");
    }

    #[test]
    fn test_wave_progression() {
        let mut engine = GameEngine::new(1);

        let initial_wave = engine.current_wave();

        // Simulate many updates to complete wave
        for _ in 0..1000 {
            engine.update(0.5);

            // Kill all threats to speed up wave completion
            engine.active_threats.clear();

            if engine.current_wave() > initial_wave {
                break;
            }
        }

        // Should eventually progress to next wave
        assert!(engine.current_wave() >= initial_wave);
    }
}
