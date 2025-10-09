import * as React from "react";
import type { GameState } from "../../types/game";
import styles from "./DetailedStats.module.css";

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
    <div className={styles.overlay}>
      <div className={styles.panel}>
        <h3 className={styles.title}>Performance Metrics</h3>
        <button onClick={onClose} className={styles.closeButton}>
          ✕
        </button>

        <div className={styles.section}>
          <h4>Performance</h4>
          <div className={styles.statItem}>
            <span>FPS:</span> <span>{performanceMetrics.fps}</span>
          </div>
          <div className={styles.statItem}>
            <span>Threats/sec:</span>{" "}
            <span>{performanceMetrics.threatsPerSecond.toFixed(1)}</span>
          </div>
          <div className={styles.statItem}>
            <span>Neutralized/sec:</span>{" "}
            <span>{performanceMetrics.neutralizationRate.toFixed(1)}</span>
          </div>
          <div className={styles.statItem}>
            <span>Efficiency:</span>{" "}
            <span>{(performanceMetrics.efficiency * 100).toFixed(1)}%</span>
          </div>
        </div>

        <div className={styles.section}>
          <h4>Resource Efficiency</h4>
          <div className={styles.statItem}>
            <span>Energy:</span>{" "}
            <span>{resourceEfficiency.energy.toFixed(1)}%</span>
          </div>
          <div className={styles.statItem}>
            <span>Cooling:</span>{" "}
            <span>{resourceEfficiency.cooling.toFixed(1)}%</span>
          </div>
          <div className={styles.statItem}>
            <span>Drone Usage:</span>{" "}
            <span>{resourceEfficiency.droneUtilization.toFixed(1)}%</span>
          </div>
        </div>

        <div className={styles.section}>
          <h4>Threat Analysis</h4>
          <div className={styles.statItem}>
            <span>Active Threats:</span> <span>{gameState.threats.length}</span>
          </div>
          <div className={styles.statItem}>
            <span>Neutralized:</span> <span>{gameState.neutralized}</span>
          </div>
          <div className={styles.statItem}>
            <span>Priority Threats:</span>{" "}
            <span>{Object.keys(gameState.priorityThreats || {}).length}</span>
          </div>
        </div>

        <div className={styles.section}>
          <h4>Environment</h4>
          <div className={styles.statItem}>
            <span>Weather:</span>{" "}
            <span className={styles.capitalize}>{gameState.weatherMode}</span>
          </div>
          <div className={styles.statItem}>
            <span>Mission:</span>{" "}
            <span className={styles.capitalize}>
              {gameState.missionType.replace("-", " ")}
            </span>
          </div>
          <div className={styles.statItem}>
            <span>Mode:</span>{" "}
            <span className={styles.capitalize}>
              {gameState.automationMode}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
