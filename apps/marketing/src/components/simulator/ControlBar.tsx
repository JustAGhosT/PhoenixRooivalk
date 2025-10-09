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
      <button
        className={`${styles.btn} ${styles.btnSecondary}`}
        id="btn-pause"
        aria-pressed={isPaused}
        title="Space"
        onClick={onPause}
      >
        {isPaused ? "Resume" : "Pause"}
      </button>
      <button className={styles.btn} id="btn-swarm" title="S" onClick={onSwarm}>
        Spawn Swarm
      </button>
      <button
        className={`${styles.btn} ${styles.btnSecondary}`}
        id="btn-plus5"
        title="+"
        onClick={onPlus5}
      >
        +5 Drones
      </button>

      <div className={styles.level}>
        <span className={styles.levelLabel}>Level</span>
        <div
          className={styles.levelButtons}
          role="group"
          aria-label="Select level"
        >
          {levels.map((level) => (
            <button
              key={level}
              className={`${styles.chip} ${currentLevel === level ? styles.chipOn : ""}`}
              data-level={level}
              onClick={() => onLevelChange(level)}
              aria-pressed={currentLevel === level}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.environmentGroup}>
        <label className={styles.environmentLabel}>Weather:</label>
        <select
          className={styles.chip}
          value={weatherMode}
          onChange={(e) => setWeatherMode(e.target.value as WeatherMode)}
        >
          <option value="none">☀️ Clear</option>
          <option value="rain">🌧️ Rain</option>
          <option value="fog">🌫️ Fog</option>
          <option value="night">🌙 Night</option>
        </select>
      </div>

      <div className={styles.environmentGroup}>
        <label className={styles.environmentLabel}>Terrain:</label>
        <select
          className={styles.chip}
          value={missionType}
          onChange={(e) => setMissionType(e.target.value as MissionType)}
        >
          <option value="airport">✈️ Airport</option>
          <option value="military-base">🏭 Military Base</option>
          <option value="vip-protection">👤 VIP Protection</option>
          <option value="border-patrol">🛡️ Border Patrol</option>
        </select>
      </div>

      <div className={styles.environmentGroup}>
        <label className={styles.environmentLabel}>Rules:</label>
        <select
          className={styles.chip}
          value={automationMode}
          onChange={(e) => setAutomationMode(e.target.value as AutomationMode)}
        >
          <option value="manual">Conservative</option>
          <option value="automated">Aggressive</option>
          <option value="hybrid">Hybrid</option>
        </select>
      </div>

      <button
        className={`${styles.btn} ${styles.btnGhost}`}
        id="btn-reset"
        title="R"
        onClick={onReset}
      >
        Reset
      </button>

      <button
        role="switch"
        aria-checked={showDeploymentZones}
        className={`${styles.switch} ${showDeploymentZones ? styles.switchOn : ""}`}
        onClick={() => setShowDeploymentZones(!showDeploymentZones)}
      >
        Show Zones
      </button>

      <button
        role="switch"
        aria-checked={showStats}
        className={`${styles.switch} ${showStats ? styles.switchOn : ""}`}
        onClick={onShowStats}
      >
        Show Stats
      </button>

      <button
        className={`${styles.btn} ${styles.btnGhost}`}
        onClick={onShowResearch}
        title="Research"
      >
        🔬
      </button>
      <button
        className={`${styles.btn} ${styles.btnGhost}`}
        onClick={onShowTokenStore}
        title="Token Store"
      >
        🪙
      </button>
      <button
        className={`${styles.btn} ${styles.btnGhost}`}
        onClick={onShowHelp}
        title="?"
      >
        ?
      </button>
    </footer>
  );
};

export default ControlBar;
