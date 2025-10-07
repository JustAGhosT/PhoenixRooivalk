// Physics and collision detection system

use super::types::{Drone, Threat, Vector2};

#[derive(Debug, Clone)]
pub struct CollisionResult {
    pub has_collision: bool,
    pub collision_point: Option<Vector2>,
    pub impact_force: f32,
    pub penetration_depth: f32,
    pub collision_normal: Option<Vector2>,
}

impl CollisionResult {
    pub fn no_collision() -> Self {
        Self {
            has_collision: false,
            collision_point: None,
            impact_force: 0.0,
            penetration_depth: 0.0,
            collision_normal: None,
        }
    }
}

/// Check collision between two circles with detailed impact information
pub fn circle_circle_collision(
    pos1: &Vector2,
    radius1: f32,
    pos2: &Vector2,
    radius2: f32,
) -> CollisionResult {
    let dist = pos1.distance(pos2);
    let combined_radius = radius1 + radius2;

    if dist < combined_radius {
        let penetration_depth = combined_radius - dist;

        // Handle zero distance case to prevent NaN
        let (collision_normal, collision_point) = if dist == 0.0 {
            // Safe default when objects are exactly on top of each other
            (
                Vector2::new(1.0, 0.0),
                Vector2::new(pos1.x + radius1, pos1.y),
            )
        } else {
            // Normalize by distance
            let normal = Vector2::new((pos2.x - pos1.x) / dist, (pos2.y - pos1.y) / dist);
            let point = Vector2::new(
                pos1.x + (pos2.x - pos1.x) * (radius1 / combined_radius),
                pos1.y + (pos2.y - pos1.y) * (radius1 / combined_radius),
            );
            (normal, point)
        };

        let impact_force = penetration_depth * 10.0; // Scale factor for visual impact

        CollisionResult {
            has_collision: true,
            collision_point: Some(collision_point),
            impact_force,
            penetration_depth,
            collision_normal: Some(collision_normal),
        }
    } else {
        CollisionResult::no_collision()
    }
}

/// Simple collision check without detailed information
pub fn check_collision(pos1: &Vector2, radius1: f32, pos2: &Vector2, radius2: f32) -> bool {
    let distance = pos1.distance(pos2);
    distance < (radius1 + radius2)
}

/// Resolve collision between two objects with mass
pub fn resolve_collision(
    pos1: &mut Vector2,
    vel1: &mut Vector2,
    mass1: f32,
    pos2: &mut Vector2,
    vel2: &mut Vector2,
    mass2: f32,
    restitution: f32, // Bounciness 0-1
) {
    let collision = circle_circle_collision(pos1, 10.0, pos2, 10.0);

    if !collision.has_collision {
        return;
    }

    if let Some(normal) = collision.collision_normal {
        // Separate objects
        let separation = collision.penetration_depth / 2.0;
        pos1.x -= normal.x * separation;
        pos1.y -= normal.y * separation;
        pos2.x += normal.x * separation;
        pos2.y += normal.y * separation;

        // Calculate relative velocity
        let rel_vel = Vector2::new(vel2.x - vel1.x, vel2.y - vel1.y);

        // Calculate relative velocity in terms of normal direction
        let vel_along_normal = rel_vel.x * normal.x + rel_vel.y * normal.y;

        // Do not resolve if velocities are separating
        if vel_along_normal > 0.0 {
            return;
        }

        // Calculate impulse scalar
        let impulse_scalar = -(1.0 + restitution) * vel_along_normal / (1.0 / mass1 + 1.0 / mass2);

        // Apply impulse
        let impulse = normal.scale(impulse_scalar);
        vel1.x -= impulse.x / mass1;
        vel1.y -= impulse.y / mass1;
        vel2.x += impulse.x / mass2;
        vel2.y += impulse.y / mass2;
    }
}

/// Apply physics update to all game objects
pub fn apply_physics(threats: &mut [Threat], drones: &mut [Drone], delta_time: f32) {
    // Update threat positions
    for threat in threats.iter_mut() {
        threat.position.x += threat.velocity.x * delta_time;
        threat.position.y += threat.velocity.y * delta_time;
    }

    // Update drone positions
    for drone in drones.iter_mut() {
        drone.position.x += drone.velocity.x * delta_time;
        drone.position.y += drone.velocity.y * delta_time;

        // Drain battery
        if drone.battery > 0.0 {
            drone.battery = (drone.battery - 1.0 * delta_time).max(0.0);
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_no_collision() {
        let pos1 = Vector2::new(0.0, 0.0);
        let pos2 = Vector2::new(100.0, 0.0);

        assert!(!check_collision(&pos1, 10.0, &pos2, 10.0));
    }

    #[test]
    fn test_collision_detected() {
        let pos1 = Vector2::new(0.0, 0.0);
        let pos2 = Vector2::new(15.0, 0.0);

        assert!(check_collision(&pos1, 10.0, &pos2, 10.0));
    }

    #[test]
    fn test_collision_result_with_details() {
        let pos1 = Vector2::new(0.0, 0.0);
        let pos2 = Vector2::new(15.0, 0.0);

        let result = circle_circle_collision(&pos1, 10.0, &pos2, 10.0);

        assert!(result.has_collision);
        assert_eq!(result.penetration_depth, 5.0); // 20 - 15
        assert!(result.impact_force > 0.0);
        assert!(result.collision_point.is_some());
        assert!(result.collision_normal.is_some());
    }

    #[test]
    fn test_collision_at_zero_distance() {
        let pos1 = Vector2::new(0.0, 0.0);
        let pos2 = Vector2::new(0.0, 0.0);

        let result = circle_circle_collision(&pos1, 10.0, &pos2, 10.0);

        assert!(result.has_collision);
        assert!(result.collision_normal.is_some());
        // Should not panic with NaN
        let normal = result.collision_normal.unwrap();
        assert!(normal.x.is_finite());
        assert!(normal.y.is_finite());
    }

    #[test]
    fn test_resolve_collision_separates_objects() {
        let mut pos1 = Vector2::new(0.0, 0.0);
        let mut vel1 = Vector2::new(10.0, 0.0);
        let mut pos2 = Vector2::new(5.0, 0.0);
        let mut vel2 = Vector2::new(-10.0, 0.0);

        resolve_collision(&mut pos1, &mut vel1, 1.0, &mut pos2, &mut vel2, 1.0, 0.8);

        // Objects should be separated
        let final_dist = pos1.distance(&pos2);
        assert!(final_dist >= 20.0 - 0.01); // Account for floating point
    }
}
