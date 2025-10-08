import * as React from "react";
import effectorDatabase from "../../data/effectorDatabase.json";
import type { Drone, GameState } from "../../types/game";
import { InfoPopover } from "../InfoPopover";
import styles from "./DroneDeployment.module.css";
import { EnergyBudget } from "./EnergyBudget";

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
    <div className={styles.droneDeploymentPanel}>
      <h3 className={styles.droneDeploymentTitle}>DRONE DEPLOYMENT</h3>
      <nav aria-label="Drone Deployment" role="group" className={styles.droneList}>
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
                className={`${styles.droneItem} ${styles.disabled}`}
                title="Unknown drone type"
              >
                <div className={styles.droneIcon}>❓</div>
                <div className={styles.droneDetails}>
                  <div className={styles.droneName}>Unknown Drone</div>
                  <div className={styles.droneCount}>
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
              className={`${styles.droneItemContainer} ${isSelected ? styles.selected : ""}`}
            >
              <button
                role="checkbox"
                aria-checked={isSelected}
                disabled={isDisabled}
                className={`${styles.droneItem} ${isSelected ? styles.selected : ""} ${isDisabled ? styles.disabled : ""}`}
                onClick={() => !isDisabled && onSelectDroneType(bay.droneType)}
                title={
                  isDisabled
                    ? `Not enough resources or drones`
                    : `Select ${data.name}`
                }
              >
                <div className={styles.droneHeader}>
                  <div className={styles.droneIcon}>{data.icon}</div>
                  {droneData && (
                    <div className={styles.droneInfoButton}>
                      <InfoPopover
                        title={droneData.name}
                        brands={droneData.brands}
                        sources={droneData.sources}
                      >
                        <span
                          className={styles.infoButton}
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

                <div className={styles.droneDetails}>
                  <div className={styles.droneName}>{data.name}</div>
                  <div className={styles.droneSpecs}>
                    <div className={styles.droneCount}>
                      {bay.currentDrones} / {bay.capacity}
                    </div>
                    {droneData && (
                      <>
                        <div className={styles.droneEnergy}>⚡ {energyCost}</div>
                        <div className={styles.droneSpeed}>🏃 {droneData.speed}</div>
                        <div className={styles.droneEndurance}>
                          ⏱️ {droneData.endurance}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {droneData && (
                  <div className={styles.droneRole}>
                    <span className={styles.roleBadge}>{droneData.role}</span>
                  </div>
                )}

                {!bay.isReady && (
                  <div className={styles.droneCooldown}>RECHARGING</div>
                )}
              </button>
            </div>
          );
        })}
      </nav>
      <div className={styles.droneDeploymentInfo}>
        <EnergyBudget used={energy} max={100} showDetails={false} />

        {selectedDroneType && (
          <div className={styles.deploymentSelection}>
            <p>
              Selected:{" "}
              {(() => {
                const data =
                  DRONE_DATA[selectedDroneType as keyof typeof DRONE_DATA];
                return data ? data.name : "Unknown drone";
              })()}
            </p>
            <p className={styles.deploymentInstruction}>Click on map to deploy.</p>
          </div>
        )}
      </div>
    </div>
  );
};
