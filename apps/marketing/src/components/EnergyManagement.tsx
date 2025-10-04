import React, { useEffect, useState } from "react";
import { EnergyBudget } from "./EnergyBudget";

export interface EnergyCost {
  effector: number;
  drone: number;
  powerUp: number;
}

export interface EnergyManagementProps {
  maxEnergy: number;
  selectedEffectors: string[];
  selectedDrones: string[];
  activePowerUps: string[];
  onEnergyUpdate: (used: number, remaining: number) => void;
}

// Energy costs for different systems
const ENERGY_COSTS = {
  // Effector energy costs
  effectors: {
    kinetic: 10,
    electronic: 18,
    laser: 12,
    net: 10,
    hpm: 25,
    rf_take: 20,
    gnss_deny: 12,
    optic_dazzle: 8,
    acoustic: 6,
    decoy_beacon: 5,
    chaff: 7,
    smart_slug: 15,
    ai_deception: 18,
  },

  // Drone energy costs
  drones: {
    effector: 12,
    jammer: 10,
    surveillance: 8,
    shield: 16,
    "swarm-coordinator": 10,
    decoy_uav: 10,
    net_uav: 14,
    relay_uav: 8,
    overwatch_tether: 12,
    recovery_uav: 6,
    lure_swarm: 15,
    perimeter_sentry: 12,
    spotter: 9,
    hpm_uav: 20,
    shield_wall: 16,
    mapper_lidar: 10,
    relay_optical: 8,
  },

  // Power-up energy costs
  powerUps: {
    "damage-boost": 5,
    "rapid-fire": 8,
    "area-effect": 12,
    "range-boost": 10,
  },
};

export const EnergyManagement: React.FC<EnergyManagementProps> = ({
  maxEnergy,
  selectedEffectors,
  selectedDrones,
  activePowerUps,
  onEnergyUpdate,
}) => {
  const [usedEnergy, setUsedEnergy] = useState(0);
  const [energyBreakdown, setEnergyBreakdown] = useState<EnergyCost>({
    effector: 0,
    drone: 0,
    powerUp: 0,
  });

  useEffect(() => {
    // Calculate energy usage
    const effectorEnergy = selectedEffectors.reduce((total, effector) => {
      return (
        total +
        (ENERGY_COSTS.effectors[
          effector as keyof typeof ENERGY_COSTS.effectors
        ] || 0)
      );
    }, 0);

    const droneEnergy = selectedDrones.reduce((total, drone) => {
      return (
        total +
        (ENERGY_COSTS.drones[drone as keyof typeof ENERGY_COSTS.drones] || 0)
      );
    }, 0);

    const powerUpEnergy = activePowerUps.reduce((total, powerUp) => {
      return (
        total +
        (ENERGY_COSTS.powerUps[powerUp as keyof typeof ENERGY_COSTS.powerUps] ||
          0)
      );
    }, 0);

    const totalUsed = effectorEnergy + droneEnergy + powerUpEnergy;

    setUsedEnergy(totalUsed);
    setEnergyBreakdown({
      effector: effectorEnergy,
      drone: droneEnergy,
      powerUp: powerUpEnergy,
    });

    onEnergyUpdate(totalUsed, maxEnergy - totalUsed);
  }, [
    selectedEffectors,
    selectedDrones,
    activePowerUps,
    maxEnergy,
    onEnergyUpdate,
  ]);

  const remainingEnergy = maxEnergy - usedEnergy;
  const isOverloaded = usedEnergy > maxEnergy;

  return (
    <div className="energy-management">
      <div className="energy-management-header">
        <h4 className="energy-management-title">ENERGY MANAGEMENT</h4>
        <div
          className={`energy-status ${isOverloaded ? "energy-overloaded" : ""}`}
        >
          {isOverloaded ? "OVERLOADED" : "NOMINAL"}
        </div>
      </div>

      <EnergyBudget used={usedEnergy} max={maxEnergy} showDetails={true} />

      {usedEnergy > 0 && (
        <div className="energy-breakdown">
          <div className="energy-breakdown-title">Energy Breakdown:</div>
          <div className="energy-breakdown-list">
            {energyBreakdown.effector > 0 && (
              <div className="energy-breakdown-item">
                <span className="breakdown-label">Effectors:</span>
                <span className="breakdown-value">
                  {energyBreakdown.effector}
                </span>
              </div>
            )}
            {energyBreakdown.drone > 0 && (
              <div className="energy-breakdown-item">
                <span className="breakdown-label">Drones:</span>
                <span className="breakdown-value">{energyBreakdown.drone}</span>
              </div>
            )}
            {energyBreakdown.powerUp > 0 && (
              <div className="energy-breakdown-item">
                <span className="breakdown-label">Power-ups:</span>
                <span className="breakdown-value">
                  {energyBreakdown.powerUp}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {isOverloaded && (
        <div className="energy-warning">
          <div className="energy-warning-icon">⚠️</div>
          <div className="energy-warning-text">
            Energy consumption exceeds available capacity. Remove systems or
            upgrade power generation.
          </div>
        </div>
      )}

      {remainingEnergy > 0 && remainingEnergy < maxEnergy * 0.2 && (
        <div className="energy-low-warning">
          <div className="energy-low-icon">🔋</div>
          <div className="energy-low-text">
            Low energy reserves. Consider power management.
          </div>
        </div>
      )}
    </div>
  );
};
