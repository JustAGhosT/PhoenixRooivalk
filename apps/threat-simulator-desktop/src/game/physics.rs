// Physics and collision detection system

use super::types::{Threat, Drone, Vector2};

pub fn check_collision(pos1: &Vector2, radius1: f32, pos2: &Vector2, radius2: f32) -> bool {
    let distance = pos1.distance(pos2);
    distance < (radius1 + radius2)
}

pub fn apply_physics(threats: &mut Vec<Threat>, drones: &mut Vec<Drone>, delta_time: f32) {
    // Update threat positions
    for threat in threats.iter_mut() {
        threat.position.x += threat.velocity.x * delta_time;
        threat.position.y += threat.velocity.y * delta_time;
    }
    
    // Update drone positions
    for drone in drones.iter_mut() {
        drone.position.x += drone.velocity.x * delta_time;
        drone.position.y += drone.velocity.y * delta_time;
    }
}

