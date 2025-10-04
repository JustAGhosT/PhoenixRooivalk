import React from "react";

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
  onShowStats,
  onShowHelp,
  onShowResearch,
  onShowTokenStore,
}) => {
  const levels = [1, 2, 3];

  return (
    <footer
      className="threatsim__controls"
      role="toolbar"
      aria-label="Simulator controls"
    >
      <button
        className="btn btn--secondary"
        id="btn-pause"
        aria-pressed={isPaused}
        title="Space"
        onClick={onPause}
      >
        {isPaused ? "Resume" : "Pause"}
      </button>
      <button className="btn" id="btn-swarm" title="S" onClick={onSwarm}>
        Spawn Swarm
      </button>
      <button
        className="btn btn--secondary"
        id="btn-plus5"
        title="+"
        onClick={onPlus5}
      >
        +5 Drones
      </button>

      <div className="level">
        <span className="level__label">Level</span>
        <div className="level__buttons" role="group" aria-label="Select level">
          {levels.map((level) => (
            <button
              key={level}
              className={`chip ${currentLevel === level ? "chip--on" : ""}`}
              data-level={level}
              onClick={() => onLevelChange(level)}
              aria-pressed={currentLevel === level}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <div className="environment-group">
        <label className="environment-label">Weather:</label>
        <select
          className="chip"
          value={weatherMode}
          onChange={(e) => setWeatherMode(e.target.value as WeatherMode)}
        >
          <option value="none">☀️ Clear</option>
          <option value="rain">🌧️ Rain</option>
          <option value="fog">🌫️ Fog</option>
          <option value="night">🌙 Night</option>
        </select>
      </div>

      <div className="environment-group">
        <label className="environment-label">Terrain:</label>
        <select
          className="chip"
          value={missionType}
          onChange={(e) => setMissionType(e.target.value as MissionType)}
        >
          <option value="airport">✈️ Airport</option>
          <option value="military-base">🏭 Military Base</option>
          <option value="vip-protection">👤 VIP Protection</option>
          <option value="border-patrol">🛡️ Border Patrol</option>
        </select>
      </div>

      <div className="environment-group">
        <label className="environment-label">Rules:</label>
        <select
          className="chip"
          value={automationMode}
          onChange={(e) => setAutomationMode(e.target.value as AutomationMode)}
        >
          <option value="manual">Conservative</option>
          <option value="automated">Aggressive</option>
          <option value="hybrid">Hybrid</option>
        </select>
      </div>

      <button
        className="btn btn--ghost"
        id="btn-reset"
        title="R"
        onClick={onReset}
      >
        Reset
      </button>

      <button
        role="switch"
        aria-checked={showDeploymentZones}
        className={`switch ${showDeploymentZones ? "switch--on" : ""}`}
        onClick={() => setShowDeploymentZones(!showDeploymentZones)}
      >
        Show Zones
      </button>

      <button
        role="switch"
        aria-checked={false}
        className="switch"
        onClick={onShowStats}
      >
        Show Stats
      </button>

      <button
        className="btn btn--ghost"
        onClick={onShowResearch}
        title="Research"
      >
        🔬
      </button>
      <button
        className="btn btn--ghost"
        onClick={onShowTokenStore}
        title="Token Store"
      >
        🪙
      </button>
      <button className="btn btn--ghost" onClick={onShowHelp} title="?">
        ?
      </button>
    </footer>
  );
};

export default ControlBar;
