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

