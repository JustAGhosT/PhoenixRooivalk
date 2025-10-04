import * as React from "react";
import type { Drone, GameState } from "../types/game";

interface DroneDeploymentProps {
  drones: GameState["drones"];
  deploymentBays: GameState["deploymentBays"];
  selectedDroneType: GameState["selectedDroneType"];
  onSelectDroneType: (droneType: Drone["type"] | null) => void;
  energy: number;
}

const DRONE_DATA = {
  interceptor: { name: "Interceptor", icon: "🚁" },
  jammer: { name: "Jammer", icon: "📡" },
  surveillance: { name: "Surveillance", icon: "👁️" },
  shield: { name: "Shield", icon: "🛡️" },
  "swarm-coordinator": { name: "Coordinator", icon: "🐝" },
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
      <div className="drone-list">
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
          const isDisabled =
            bay.currentDrones === 0 || energy < DEPLOYMENT_COST;

          return (
            <div
              key={bay.id}
              className={`drone-item ${isSelected ? "selected" : ""} ${isDisabled ? "disabled" : ""}`}
              onClick={() => !isDisabled && onSelectDroneType(bay.droneType)}
              title={
                isDisabled
                  ? `Not enough resources or drones`
                  : `Select ${data.name}`
              }
            >
              <div className="drone-icon">{data.icon}</div>
              <div className="drone-details">
                <div className="drone-name">{data.name}</div>
                <div className="drone-count">
                  {bay.currentDrones} / {bay.capacity}
                </div>
              </div>
              {!bay.isReady && <div className="drone-cooldown">RECHARGING</div>}
            </div>
          );
        })}
      </div>
      <div className="drone-deployment-info">
        <p>Energy Cost: {DEPLOYMENT_COST}</p>
        {selectedDroneType && (
          <p>
            Selected:{" "}
            {(() => {
              const data =
                DRONE_DATA[selectedDroneType as keyof typeof DRONE_DATA];
              return data ? data.name : "Unknown drone";
            })()}
            . Click on map to deploy.
          </p>
        )}
      </div>
    </div>
  );
};
