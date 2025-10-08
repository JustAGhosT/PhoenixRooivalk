use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum WeaponType {
    Kinetic,
    Electronic,
    Laser,
    Net,
    Hpm,
    RfTakeover,
    GnssDeny,
    OpticalDazzle,
    Acoustic,
    DecoyBeacon,
    Chaff,
    SmartSlug,
    AiDeception,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Weapon {
    pub weapon_type: WeaponType,
    pub cooldown: f32,
    pub max_cooldown: f32,
    pub damage: f32,
    pub range: f32,
    pub energy_cost: f32,
    pub available: bool,
}

#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
pub enum ThreatType {
    Commercial,
    Military,
    Swarm,
    Stealth,
    Kamikaze,
    Recon,
    ElectronicWarfare,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Threat {
    pub id: String,
    pub threat_type: ThreatType,
    pub position: Vector2,
    pub velocity: Vector2,
    pub health: f32,
    pub max_health: f32,
    pub speed: f32,
    pub size: f32,
    pub is_targeted: bool,
    pub distance_to_base: f32,
}

#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
pub struct Vector2 {
    pub x: f32,
    pub y: f32,
}

impl Vector2 {
    pub fn new(x: f32, y: f32) -> Self {
        Self { x, y }
    }

    pub fn zero() -> Self {
        Self { x: 0.0, y: 0.0 }
    }

    pub fn distance(&self, other: &Vector2) -> f32 {
        let dx = self.x - other.x;
        let dy = self.y - other.y;
        (dx * dx + dy * dy).sqrt()
    }

    pub fn normalize(&self) -> Self {
        let len = (self.x * self.x + self.y * self.y).sqrt();
        if len > 0.0 {
            Self {
                x: self.x / len,
                y: self.y / len,
            }
        } else {
            *self
        }
    }

    pub fn scale(&self, scalar: f32) -> Self {
        Self {
            x: self.x * scalar,
            y: self.y * scalar,
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum DroneType {
    Interceptor,
    Jammer,
    Surveillance,
    Effector,
    Shield,
    SpotterUav,
    NetCaptureUav,
    PerimeterSentry,
    SwarmCoordinator,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Drone {
    pub id: String,
    pub drone_type: DroneType,
    pub position: Vector2,
    pub velocity: Vector2,
    pub health: f32,
    pub max_health: f32,
    pub battery: f32,
    pub max_battery: f32,
    pub target_id: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PowerUp {
    pub id: String,
    pub power_type: PowerUpType,
    pub duration: f32,
    pub remaining: f32,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum PowerUpType {
    RapidFire,
    DamageBoost,
    AreaEffect,
    RangeBoost,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_vector2_distance() {
        let v1 = Vector2::new(0.0, 0.0);
        let v2 = Vector2::new(3.0, 4.0);

        assert_eq!(v1.distance(&v2), 5.0); // 3-4-5 triangle
    }

    #[test]
    fn test_vector2_normalize() {
        let v = Vector2::new(3.0, 4.0);
        let normalized = v.normalize();

        let length = (normalized.x * normalized.x + normalized.y * normalized.y).sqrt();
        assert!((length - 1.0).abs() < 0.0001); // Should be unit length
    }

    #[test]
    fn test_vector2_normalize_zero() {
        let v = Vector2::zero();
        let normalized = v.normalize();

        // Should return self when normalizing zero vector
        assert_eq!(normalized.x, 0.0);
        assert_eq!(normalized.y, 0.0);
    }

    #[test]
    fn test_vector2_scale() {
        let v = Vector2::new(2.0, 3.0);
        let scaled = v.scale(2.5);

        assert_eq!(scaled.x, 5.0);
        assert_eq!(scaled.y, 7.5);
    }

    #[test]
    fn test_weapon_type_serialization() {
        let weapon_type = WeaponType::Laser;
        let json = serde_json::to_string(&weapon_type).unwrap();
        let deserialized: WeaponType = serde_json::from_str(&json).unwrap();

        assert_eq!(weapon_type, deserialized);
    }

    #[test]
    fn test_threat_creation() {
        let threat = Threat {
            id: "test-1".to_string(),
            threat_type: ThreatType::Military,
            position: Vector2::new(100.0, 200.0),
            velocity: Vector2::new(10.0, 0.0),
            health: 150.0,
            max_health: 150.0,
            speed: 50.0,
            size: 25.0,
            is_targeted: false,
            distance_to_base: 300.0,
        };

        assert_eq!(threat.id, "test-1");
        assert_eq!(threat.threat_type, ThreatType::Military);
        assert_eq!(threat.health, threat.max_health);
    }

    #[test]
    fn test_drone_battery_drains() {
        let mut drone = Drone {
            id: "drone-1".to_string(),
            drone_type: DroneType::Interceptor,
            position: Vector2::new(100.0, 100.0),
            velocity: Vector2::zero(),
            health: 100.0,
            max_health: 100.0,
            battery: 100.0,
            max_battery: 100.0,
            target_id: None,
        };

        assert_eq!(drone.battery, 100.0);

        // Simulate battery drain
        drone.battery -= 10.0;
        assert_eq!(drone.battery, 90.0);
    }
}
