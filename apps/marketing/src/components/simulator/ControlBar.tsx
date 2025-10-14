import React from "react";
import styles from "./ControlBar.module.css";

// Type definitions for game modes
type WeatherMode = "none" | "rain" | "fog" | "night";
type MissionType =
  | "airport"
  | "military-base"
  | "vip-protection"
  | "border-patrol";
type AutomationMode = "manual" | "automated" | "hybrid";

interface ControlBarProps {
  onPause: () => void;
  onSwarm: () => void;
  onPlus5: () => void;
  onReset: () => void;
  onLevelChange: (level: number) => void;
  isPaused: boolean;
  currentLevel: number;
  weatherMode: WeatherMode;
  setWeatherMode: (mode: WeatherMode) => void;
  missionType: MissionType;
  setMissionType: (type: MissionType) => void;
  automationMode: AutomationMode;
  setAutomationMode: (mode: AutomationMode) => void;
  showDeploymentZones: boolean;
  setShowDeploymentZones: (show: boolean) => void;
  showStats: boolean;
  onShowStats: () => void;
  onShowHelp: () => void;
  onShowResearch: () => void;
  onShowTokenStore: () => void;
}

const ControlBar: React.FC<ControlBarProps> = ({
  onPause,
  onSwarm,
  onPlus5,
  onReset,
  onLevelChange,
  isPaused,
  currentLevel,
  weatherMode,
  setWeatherMode,
  missionType,
  setMissionType,
  automationMode,
  setAutomationMode,
  showDeploymentZones,
  setShowDeploymentZones,
  showStats,
  onShowStats,
  onShowHelp,
  onShowResearch,
  onShowTokenStore,
}) => {
  const levels = [1, 2, 3];

  return (
    <footer
      className={styles.controls}
      role="toolbar"
      aria-label="Simulator controls"
    >
      <div className={styles.primaryActions}>
        <button
          className={`${styles.btn} ${styles.btnSecondary}`}
          id="btn-pause"
          aria-pressed={isPaused}
          title="Space"
          onClick={onPause}
          aria-label={isPaused ? "Resume simulation" : "Pause simulation"}
        >
          {isPaused ? "▶️ Resume" : "⏸️ Pause"}
        </button>
        <button
          className={`${styles.btn} ${styles.btnPrimary}`}
          id="btn-swarm"
          title="S"
          onClick={onSwarm}
          aria-label="Spawn threat swarm"
        >
          🌊 Spawn Swarm
        </button>
        <button
          className={`${styles.btn} ${styles.btnSecondary}`}
          id="btn-plus5"
          title="+"
          onClick={onPlus5}
          aria-label="Add 5 threat drones"
        >
          +5 Threats
        </button>
      </div>

      <div className={styles.environmentControls}>
        <div className={styles.level}>
          <span className={styles.levelLabel}>Wave</span>
          <div
            className={styles.levelButtons}
            role="radiogroup"
            aria-label="Select wave level"
          >
            {levels.map((level) => (
              <button
                key={level}
                className={`${styles.chip} ${currentLevel === level ? styles.chipOn : ""}`}
                data-level={level}
                onClick={() => onLevelChange(level)}
                role="radio"
                aria-checked={currentLevel === level}
                aria-label={`Wave ${level}`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.environmentGroup}>
          <label htmlFor="weather-select" className={styles.environmentLabel}>
            Weather:
          </label>
          <select
            id="weather-select"
            className={styles.environmentSelect}
            value={weatherMode}
            onChange={(e) => setWeatherMode(e.target.value as WeatherMode)}
            aria-label="Select weather condition"
          >
            <option value="none">☀️ Clear</option>
            <option value="rain">🌧️ Rain</option>
            <option value="fog">🌫️ Fog</option>
            <option value="night">🌙 Night</option>
          </select>
        </div>

        <div className={styles.environmentGroup}>
          <label htmlFor="terrain-select" className={styles.environmentLabel}>
            Terrain:
          </label>
          <select
            id="terrain-select"
            className={styles.environmentSelect}
            value={missionType}
            onChange={(e) => setMissionType(e.target.value as MissionType)}
            aria-label="Select mission terrain"
          >
            <option value="airport">✈️ Airport</option>
            <option value="military-base">🏭 Military Base</option>
            <option value="vip-protection">👤 VIP Protection</option>
            <option value="border-patrol">🛡️ Border Patrol</option>
          </select>
        </div>

        <div className={styles.environmentGroup}>
          <label htmlFor="rules-select" className={styles.environmentLabel}>
            Rules:
          </label>
          <select
            id="rules-select"
            className={styles.environmentSelect}
            value={automationMode}
            onChange={(e) =>
              setAutomationMode(e.target.value as AutomationMode)
            }
            aria-label="Select engagement rules"
          >
            <option value="manual">Conservative</option>
            <option value="automated">Aggressive</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>
      </div>

      <div className={styles.viewControls}>
        <button
          role="switch"
          aria-checked={showDeploymentZones}
          className={`${styles.switch} ${showDeploymentZones ? styles.switchOn : ""}`}
          onClick={() => setShowDeploymentZones(!showDeploymentZones)}
          aria-label="Toggle deployment zones visibility"
        >
          <span className={styles.switchLabel}>Zones</span>
          <span className={styles.switchIndicator} aria-hidden="true" />
        </button>

        <button
          role="switch"
          aria-checked={showStats}
          className={`${styles.switch} ${showStats ? styles.switchOn : ""}`}
          onClick={onShowStats}
          aria-label="Toggle detailed statistics"
        >
          <span className={styles.switchLabel}>Stats</span>
          <span className={styles.switchIndicator} aria-hidden="true" />
        </button>
      </div>

      <div className={styles.utilityActions}>
        <button
          className={`${styles.btn} ${styles.btnGhost}`}
          onClick={onShowResearch}
          title="Research"
          aria-label="Open research panel"
        >
          🔬
        </button>
        <button
          className={`${styles.btn} ${styles.btnGhost}`}
          onClick={onShowTokenStore}
          title="Token Store"
          aria-label="Open token store"
        >
          🪙
        </button>
        <button
          className={`${styles.btn} ${styles.btnGhost}`}
          onClick={onShowHelp}
          title="?"
          aria-label="Show help"
        >
          ❓
        </button>
      </div>

      <div className={styles.dangerActions}>
        <button
          className={`${styles.btn} ${styles.btnDanger}`}
          id="btn-reset"
          title="R"
          onClick={onReset}
          aria-label="Reset simulation (requires confirmation)"
        >
          🔄 Reset
        </button>
      </div>
    </footer>
  );
};

export default ControlBar;
