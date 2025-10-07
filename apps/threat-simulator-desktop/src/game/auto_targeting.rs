// Automatic threat targeting and prioritization system

use super::types::{Threat, ThreatType, Vector2, Weapon};
use std::collections::HashMap;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ThreatPriority {
    High,
    Medium,
    Low,
}

impl ThreatPriority {
    fn to_score(self) -> u32 {
        match self {
            ThreatPriority::High => 3,
            ThreatPriority::Medium => 2,
            ThreatPriority::Low => 1,
        }
    }
}

#[derive(Debug, Clone)]
pub struct TargetInfo {
    pub threat_id: String,
    pub priority: ThreatPriority,
    pub distance: f32,
    pub score: f32,
}

pub struct AutoTargetingSystem {
    last_engagement_time: HashMap<String, f64>,
    engagement_cooldown: f32,
}

impl AutoTargetingSystem {
    pub fn new() -> Self {
        Self {
            last_engagement_time: HashMap::new(),
            engagement_cooldown: 0.5, // 500ms between shots at same target
        }
    }

    /// Calculate threat priority based on type and status
    pub fn calculate_threat_priority(threat: &Threat, _mothership_pos: Vector2) -> ThreatPriority {
        // High priority: Close + high damage types
        if threat.distance_to_base < 200.0
            || matches!(
                threat.threat_type,
                ThreatType::Kamikaze | ThreatType::Military
            )
        {
            return ThreatPriority::High;
        }

        // Medium priority: Moderate distance or special types
        if threat.distance_to_base < 400.0
            || matches!(
                threat.threat_type,
                ThreatType::ElectronicWarfare | ThreatType::Swarm
            )
        {
            return ThreatPriority::Medium;
        }

        // Low priority: Far away or low threat
        ThreatPriority::Low
    }

    /// Find the best target based on priority and distance
    pub fn find_best_target(
        &self,
        threats: &[Threat],
        mothership_pos: Vector2,
        weapon_range: f32,
    ) -> Option<TargetInfo> {
        // Filter active threats within range
        let mut targets_in_range: Vec<TargetInfo> = threats
            .iter()
            .filter(|threat| {
                threat.health > 0.0 && threat.position.distance(&mothership_pos) <= weapon_range
            })
            .map(|threat| {
                let distance = threat.position.distance(&mothership_pos);
                let priority = Self::calculate_threat_priority(threat, mothership_pos);

                // Calculate combined score (higher is better)
                let priority_score = priority.to_score() as f32 * 1000.0;
                let distance_score = weapon_range - distance; // Closer = higher score

                TargetInfo {
                    threat_id: threat.id.clone(),
                    priority,
                    distance,
                    score: priority_score + distance_score,
                }
            })
            .collect();

        if targets_in_range.is_empty() {
            return None;
        }

        // Sort by score (descending)
        targets_in_range.sort_by(|a, b| b.score.partial_cmp(&a.score).unwrap());

        Some(targets_in_range[0].clone())
    }

    /// Check if we can engage a target (cooldown check)
    pub fn can_engage_target(&self, threat_id: &str, current_time: f64) -> bool {
        let last_engagement = self
            .last_engagement_time
            .get(threat_id)
            .copied()
            .unwrap_or(0.0);
        current_time - last_engagement >= self.engagement_cooldown as f64
    }

    /// Record engagement time
    pub fn record_engagement(&mut self, threat_id: String, current_time: f64) {
        self.last_engagement_time.insert(threat_id, current_time);
    }

    /// Process auto-targeting and return target position if found
    pub fn process_auto_targeting(
        &mut self,
        threats: &[Threat],
        mothership_pos: Vector2,
        weapon: &Weapon,
        current_time: f64,
        energy: f32,
    ) -> Option<Vector2> {
        // Check if we have energy and weapon is ready
        if weapon.cooldown > 0.0 || energy < weapon.energy_cost {
            return None;
        }

        // Find best target
        let target_info = self.find_best_target(threats, mothership_pos, weapon.range)?;

        // Check cooldown
        if !self.can_engage_target(&target_info.threat_id, current_time) {
            return None;
        }

        // Find threat position
        let threat = threats.iter().find(|t| t.id == target_info.threat_id)?;

        // Record engagement
        self.record_engagement(target_info.threat_id.clone(), current_time);

        Some(threat.position)
    }

    /// Process area-of-effect engagement (for HPM, area weapons)
    pub fn process_area_engagement(
        threats: &[Threat],
        center_point: Vector2,
        radius: f32,
    ) -> Vec<String> {
        threats
            .iter()
            .filter(|threat| {
                threat.health > 0.0 && threat.position.distance(&center_point) <= radius
            })
            .map(|threat| threat.id.clone())
            .collect()
    }

    /// Get all threats sorted by priority
    pub fn get_prioritized_threats(threats: &[Threat], mothership_pos: Vector2) -> Vec<TargetInfo> {
        let mut prioritized: Vec<TargetInfo> = threats
            .iter()
            .filter(|threat| threat.health > 0.0)
            .map(|threat| {
                let distance = threat.position.distance(&mothership_pos);
                let priority = Self::calculate_threat_priority(threat, mothership_pos);
                let score = priority.to_score() as f32 * 1000.0 + (1000.0 - distance);

                TargetInfo {
                    threat_id: threat.id.clone(),
                    priority,
                    distance,
                    score,
                }
            })
            .collect();

        prioritized.sort_by(|a, b| b.score.partial_cmp(&a.score).unwrap());
        prioritized
    }

    /// Clean up old engagement records
    pub fn cleanup(&mut self, current_time: f64) {
        let old_threshold = current_time - 10.0; // Clean entries older than 10 seconds

        self.last_engagement_time
            .retain(|_, time| *time >= old_threshold);
    }
}

impl Default for AutoTargetingSystem {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn create_test_threat(id: &str, x: f32, y: f32, threat_type: ThreatType) -> Threat {
        Threat {
            id: id.to_string(),
            threat_type,
            position: Vector2::new(x, y),
            velocity: Vector2::zero(),
            health: 100.0,
            max_health: 100.0,
            speed: 50.0,
            size: 20.0,
            is_targeted: false,
            distance_to_base: Vector2::new(x, y).distance(&Vector2::new(960.0, 540.0)),
        }
    }

    #[test]
    fn test_priority_calculation() {
        let mothership = Vector2::new(960.0, 540.0);

        // Close kamikaze should be high priority
        let kamikaze = create_test_threat("k1", 970.0, 550.0, ThreatType::Kamikaze);
        assert_eq!(
            AutoTargetingSystem::calculate_threat_priority(&kamikaze, mothership),
            ThreatPriority::High
        );

        // Far commercial should be low priority
        let commercial = create_test_threat("c1", 100.0, 100.0, ThreatType::Commercial);
        assert_eq!(
            AutoTargetingSystem::calculate_threat_priority(&commercial, mothership),
            ThreatPriority::Low
        );
    }

    #[test]
    fn test_find_best_target() {
        let system = AutoTargetingSystem::new();
        let mothership = Vector2::new(960.0, 540.0);

        let threats = vec![
            create_test_threat("far", 100.0, 100.0, ThreatType::Commercial),
            create_test_threat("close", 980.0, 550.0, ThreatType::Kamikaze),
            create_test_threat("medium", 800.0, 540.0, ThreatType::Military),
        ];

        let target = system.find_best_target(&threats, mothership, 500.0);

        assert!(target.is_some());
        // Should target the close kamikaze (highest priority + closest)
        assert_eq!(target.unwrap().threat_id, "close");
    }

    #[test]
    fn test_no_targets_out_of_range() {
        let system = AutoTargetingSystem::new();
        let mothership = Vector2::new(960.0, 540.0);

        let threats = vec![
            create_test_threat("far1", 100.0, 100.0, ThreatType::Commercial),
            create_test_threat("far2", 50.0, 50.0, ThreatType::Military),
        ];

        let target = system.find_best_target(&threats, mothership, 200.0);

        assert!(target.is_none()); // All threats are out of range
    }

    #[test]
    fn test_engagement_cooldown() {
        let mut system = AutoTargetingSystem::new();

        // First engagement should be allowed
        assert!(system.can_engage_target("threat1", 1.0));

        // Record engagement
        system.record_engagement("threat1".to_string(), 1.0);

        // Immediate re-engagement should be blocked
        assert!(!system.can_engage_target("threat1", 1.2));

        // After cooldown, should be allowed
        assert!(system.can_engage_target("threat1", 2.0));
    }

    #[test]
    fn test_area_engagement() {
        let center = Vector2::new(500.0, 500.0);
        let radius = 100.0;

        let threats = vec![
            create_test_threat("inside1", 480.0, 500.0, ThreatType::Commercial),
            create_test_threat("inside2", 520.0, 500.0, ThreatType::Military),
            create_test_threat("outside", 700.0, 500.0, ThreatType::Swarm),
        ];

        let hit_ids = AutoTargetingSystem::process_area_engagement(&threats, center, radius);

        assert_eq!(hit_ids.len(), 2);
        assert!(hit_ids.contains(&"inside1".to_string()));
        assert!(hit_ids.contains(&"inside2".to_string()));
        assert!(!hit_ids.contains(&"outside".to_string()));
    }

    #[test]
    fn test_prioritized_sorting() {
        let mothership = Vector2::new(960.0, 540.0);

        let threats = vec![
            create_test_threat("low_far", 100.0, 100.0, ThreatType::Commercial),
            create_test_threat("high_close", 980.0, 550.0, ThreatType::Kamikaze),
            create_test_threat("med_medium", 800.0, 540.0, ThreatType::Swarm),
        ];

        let prioritized = AutoTargetingSystem::get_prioritized_threats(&threats, mothership);

        // Should be sorted: high_close, med_medium, low_far
        assert_eq!(prioritized[0].threat_id, "high_close");
        assert_eq!(prioritized[0].priority, ThreatPriority::High);
    }

    #[test]
    fn test_cleanup() {
        let mut system = AutoTargetingSystem::new();

        // Record some engagements
        system.record_engagement("old1".to_string(), 1.0);
        system.record_engagement("old2".to_string(), 2.0);
        system.record_engagement("recent".to_string(), 15.0);

        assert_eq!(system.last_engagement_time.len(), 3);

        // Cleanup old records (before time 10.0)
        system.cleanup(20.0);

        // Should only have recent record
        assert_eq!(system.last_engagement_time.len(), 1);
        assert!(system.last_engagement_time.contains_key("recent"));
    }
}
