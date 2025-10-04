import * as React from "react";
import type { GameState } from "../types/game";

interface DetailedStatsProps {
  gameState: GameState;
  onClose: () => void;
}

export const DetailedStats: React.FC<DetailedStatsProps> = ({
  gameState,
  onClose,
}) => {
  const performanceMetrics = {
    fps: gameState.frameRate,
    threatsPerSecond:
      gameState.threats.length / (gameState.gameTime / 1000 || 1),
    neutralizationRate:
      gameState.neutralized / (gameState.gameTime / 1000 || 1),
    efficiency:
      gameState.neutralized /
      Math.max(gameState.threats.length + gameState.neutralized, 1),
  };

  const resourceEfficiency = {
    energy: (gameState.energy / gameState.maxEnergy) * 100,
    cooling: (gameState.cooling / gameState.maxCooling) * 100,
    droneUtilization: (gameState.drones.length / 12) * 100,
  };

  return (
    <div className="stats-panel-overlay">
      <div className="stats-panel">
        <h3 className="stats-panel-title">Performance Metrics</h3>
        <button onClick={onClose} className="stats-panel-close">
          ✕
        </button>

        <div className="stats-section">
          <h4>Performance</h4>
          <div className="stat-item">
            <span>FPS:</span> <span>{performanceMetrics.fps}</span>
          </div>
          <div className="stat-item">
            <span>Threats/sec:</span>{" "}
            <span>{performanceMetrics.threatsPerSecond.toFixed(1)}</span>
          </div>
          <div className="stat-item">
            <span>Neutralized/sec:</span>{" "}
            <span>{performanceMetrics.neutralizationRate.toFixed(1)}</span>
          </div>
          <div className="stat-item">
            <span>Efficiency:</span>{" "}
            <span>{(performanceMetrics.efficiency * 100).toFixed(1)}%</span>
          </div>
        </div>

        <div className="stats-section">
          <h4>Resource Efficiency</h4>
          <div className="stat-item">
            <span>Energy:</span>{" "}
            <span>{resourceEfficiency.energy.toFixed(1)}%</span>
          </div>
          <div className="stat-item">
            <span>Cooling:</span>{" "}
            <span>{resourceEfficiency.cooling.toFixed(1)}%</span>
          </div>
          <div className="stat-item">
            <span>Drone Usage:</span>{" "}
            <span>{resourceEfficiency.droneUtilization.toFixed(1)}%</span>
          </div>
        </div>

        <div className="stats-section">
          <h4>Threat Analysis</h4>
          <div className="stat-item">
            <span>Active Threats:</span> <span>{gameState.threats.length}</span>
          </div>
          <div className="stat-item">
            <span>Neutralized:</span> <span>{gameState.neutralized}</span>
          </div>
          <div className="stat-item">
            <span>Priority Threats:</span>{" "}
            <span>{Object.keys(gameState.priorityThreats || {}).length}</span>
          </div>
        </div>

        <div className="stats-section">
          <h4>Environment</h4>
          <div className="stat-item">
            <span>Weather:</span>{" "}
            <span className="capitalize">{gameState.weatherMode}</span>
          </div>
          <div className="stat-item">
            <span>Mission:</span>{" "}
            <span className="capitalize">
              {gameState.missionType.replace("-", " ")}
            </span>
          </div>
          <div className="stat-item">
            <span>Mode:</span>{" "}
            <span className="capitalize">{gameState.automationMode}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
