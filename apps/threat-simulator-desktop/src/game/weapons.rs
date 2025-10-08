// Weapon system logic

use super::types::{Threat, Vector2, Weapon, WeaponType};

pub fn fire_weapon(
    weapon: &mut Weapon,
    target_pos: Vector2,
    shooter_pos: Vector2,
    threats: &mut [Threat],
) -> bool {
    // Check if weapon is ready
    if weapon.cooldown > 0.0 {
        return false;
    }

    // Check range
    let distance = shooter_pos.distance(&target_pos);
    if distance > weapon.range {
        return false;
    }

    // Find threats near target
    let mut hit = false;
    for threat in threats.iter_mut() {
        let threat_distance = threat.position.distance(&target_pos);
        if threat_distance < 50.0 {
            threat.health = (threat.health - weapon.damage).max(0.0);
            hit = true;
        }
    }

    // Set cooldown
    if hit {
        weapon.cooldown = weapon.max_cooldown;
    }

    hit
}

pub fn get_weapon_info(weapon_type: WeaponType) -> &'static str {
    match weapon_type {
        WeaponType::Kinetic => "Kinetic Interceptor - High rate of fire, physical projectiles",
        WeaponType::Electronic => "Electronic Warfare - Disrupts drone communication",
        WeaponType::Laser => "Directed Energy - Instant hit, high precision",
        WeaponType::Net => "Net Capture - Non-lethal capture system",
        WeaponType::Hpm => "High Power Microwave - Area effect electronic disruption",
        WeaponType::RfTakeover => "RF Takeover - Hijack drone control",
        WeaponType::GnssDeny => "GNSS Denial - Jam GPS signals",
        WeaponType::OpticalDazzle => "Optical Dazzler - Blind drone sensors",
        WeaponType::Acoustic => "Acoustic Weapon - Sonic disruption",
        WeaponType::DecoyBeacon => "Decoy Beacon - Lure threats away",
        WeaponType::Chaff => "Chaff - Create radar interference",
        WeaponType::SmartSlug => "Smart Slug - AI-guided projectile",
        WeaponType::AiDeception => "AI Deception - Spoof drone AI",
    }
}
