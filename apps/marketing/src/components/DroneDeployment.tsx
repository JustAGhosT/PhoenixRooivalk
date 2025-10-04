import * as React from "react";
import effectorDatabase from "../data/effectorDatabase.json";
import type { Drone, GameState } from "../types/game";
import { EnergyBudget } from "./EnergyBudget";
import { InfoPopover } from "./InfoPopover";

interface DroneDeploymentProps {
  drones: GameState["drones"];
  deploymentBays: GameState["deploymentBays"];
  selectedDroneType: GameState["selectedDroneType"];
  onSelectDroneType: (droneType: Drone["type"] | null) => void;
  energy: number;
}

const DRONE_DATA = {
  effector: { name: "Effector", icon: "🚁" },
  jammer: { name: "Jammer", icon: "📡" },
  surveillance: { name: "Surveillance", icon: "👁️" },
  shield: { name: "Shield", icon: "🛡️" },
  "swarm-coordinator": { name: "Coordinator", icon: "🐝" },
  decoy_uav: { name: "Decoy UAV", icon: "🎭" },
  net_uav: { name: "Net-Capture UAV", icon: "🕸️" },
  relay_uav: { name: "EW Relay UAV", icon: "📶" },
  overwatch_tether: { name: "Tethered Overwatch", icon: "🗼" },
  recovery_uav: { name: "Recovery Drone", icon: "🪝" },
  lure_swarm: { name: "Micro-Decoy Swarm", icon: "🐝" },
  perimeter_sentry: { name: "Perimeter Sentry", icon: "🔍" },
  spotter: { name: "Spotter UAV", icon: "🎯" },
  hpm_uav: { name: "HPM Pod UAV", icon: "📡" },
  shield_wall: { name: "Shield Wall", icon: "🛡️" },
  mapper_lidar: { name: "LiDAR Mapper", icon: "📐" },
  relay_optical: { name: "Optical Mesh Drone", icon: "💡" },
};

const DEPLOYMENT_COST = 25; // Example energy cost

export const DroneDeployment: React.FC<DroneDeploymentProps> = ({
  deploymentBays,
  selectedDroneType,
  onSelectDroneType,
  energy,
}) => {
  return (
    <div className="drone-deployment-panel">
      <h3 className="drone-deployment-title">DRONE DEPLOYMENT</h3>
      <nav
        aria-label="Drone Deployment"
        role="checkboxgroup"
        className="drone-list"
      >
        {deploymentBays.map((bay) => {
          const data = DRONE_DATA[bay.droneType as keyof typeof DRONE_DATA];

          // Defensive check for missing drone data
          if (!data) {
            console.warn(
              `Drone data not found for drone type: ${bay.droneType}`,
            );
            return (
              <div
                key={bay.id}
                className="drone-item disabled"
                title="Unknown drone type"
              >
                <div className="drone-icon">❓</div>
                <div className="drone-details">
                  <div className="drone-name">Unknown Drone</div>
                  <div className="drone-count">
                    {bay.currentDrones} / {bay.capacity}
                  </div>
                </div>
              </div>
            );
          }

          const isSelected = selectedDroneType === bay.droneType;

          // Get drone data from database for enhanced info
          const droneData = effectorDatabase.deployments.find(
            (d) => d.id === bay.droneType.toUpperCase(),
          );
          const energyCost = droneData?.energy || DEPLOYMENT_COST;

          const isDisabled = bay.currentDrones === 0 || energy < energyCost;

          return (
            <div
              key={bay.id}
              className={`drone-item-container ${isSelected ? "selected" : ""}`}
            >
              <button
                role="checkbox"
                aria-checked={isSelected}
                disabled={isDisabled}
                className={`drone-item ${isSelected ? "selected" : ""} ${isDisabled ? "disabled" : ""}`}
                onClick={() => !isDisabled && onSelectDroneType(bay.droneType)}
                title={
                  isDisabled
                    ? `Not enough resources or drones`
                    : `Select ${data.name}`
                }
              >
                <div className="drone-header">
                  <div className="drone-icon">{data.icon}</div>
                  {droneData && (
                    <div className="drone-info-button">
                      <InfoPopover
                        title={droneData.name}
                        brands={droneData.brands}
                        sources={droneData.sources}
                      >
                        <span
                          className="info-button"
                          role="button"
                          tabIndex={0}
                          aria-label="View drone details"
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              e.stopPropagation();
                              // Trigger the popover - InfoPopover should handle this
                            }
                          }}
                        >
                          ℹ️
                        </span>
                      </InfoPopover>
                    </div>
                  )}
                </div>

                <div className="drone-details">
                  <div className="drone-name">{data.name}</div>
                  <div className="drone-specs">
                    <div className="drone-count">
                      {bay.currentDrones} / {bay.capacity}
                    </div>
                    {droneData && (
                      <>
                        <div className="drone-energy">⚡ {energyCost}</div>
                        <div className="drone-speed">🏃 {droneData.speed}</div>
                        <div className="drone-endurance">
                          ⏱️ {droneData.endurance}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {droneData && (
                  <div className="drone-role">
                    <span className="role-badge">{droneData.role}</span>
                  </div>
                )}

                {!bay.isReady && (
                  <div className="drone-cooldown">RECHARGING</div>
                )}
              </button>
            </div>
          );
        })}
      </nav>
      <div className="drone-deployment-info">
        <EnergyBudget used={energy} max={100} showDetails={false} />

        {selectedDroneType && (
          <div className="deployment-selection">
            <p>
              Selected:{" "}
              {(() => {
                const data =
                  DRONE_DATA[selectedDroneType as keyof typeof DRONE_DATA];
                return data ? data.name : "Unknown drone";
              })()}
            </p>
            <p className="deployment-instruction">Click on map to deploy.</p>
          </div>
        )}
      </div>
    </div>
  );
};
