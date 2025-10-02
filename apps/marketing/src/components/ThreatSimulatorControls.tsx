import * as React from "react";
import styles from "./ThreatSimulator.module.css";

interface ThreatSimulatorControlsProps {
  gameState: any;
  switchWeapon: (weaponId: string) => void;
  selectDroneType: (
    droneType:
      | "interceptor"
      | "jammer"
      | "surveillance"
      | "shield"
      | "swarm-coordinator"
      | null,
  ) => void;
  toggleRunningState: () => void;
  generateSwarm: () => void;
  spawnMultipleDrones: (count: number) => void;
  activatePowerUp: (powerUpId: string) => void;
  clearSelection: () => void;
  resetGameState: () => void;
  setFrameRate: (rate: number) => void;
  weatherMode: "none" | "rain" | "fog" | "night";
  setWeatherMode: (mode: "none" | "rain" | "fog" | "night") => void;
  missionType: "airport" | "military-base" | "vip-protection" | "border-patrol";
  setMissionType: (
    mission: "airport" | "military-base" | "vip-protection" | "border-patrol",
  ) => void;
  automationMode: "manual" | "automated" | "hybrid";
  setAutomationMode: (mode: "manual" | "automated" | "hybrid") => void;
  showDeploymentZones: boolean;
  setShowDeploymentZones: (show: boolean) => void;
}

export const ThreatSimulatorControls: React.FC<
  ThreatSimulatorControlsProps
> = ({
  gameState,
  switchWeapon,
  selectDroneType,
  toggleRunningState,
  generateSwarm,
  spawnMultipleDrones,
  activatePowerUp,
  clearSelection,
  resetGameState,
  setFrameRate,
  weatherMode,
  setWeatherMode,
  missionType,
  setMissionType,
  automationMode,
  setAutomationMode,
  showDeploymentZones,
  setShowDeploymentZones,
}) => {
  return (
    <>
      {/* Control Instructions */}
      <div className="absolute top-16 left-2 z-40 bg-black/80 backdrop-blur-sm border border-orange-500/30 rounded-lg p-2">
        <div className="text-xs text-orange-400 font-semibold mb-1">
          CONTROLS:
        </div>
        <div className="text-xs text-gray-300 space-y-1">
          <div>
            • <span className="text-orange-400">Left Click:</span> Deploy
            selected drone
          </div>
          <div>
            • <span className="text-orange-400">Middle Click:</span> Deploy
            jammer drone
          </div>
          <div>
            • <span className="text-orange-400">Right Click:</span> Deploy
            surveillance drone
          </div>
          <div>
            • <span className="text-orange-400">Scroll Wheel:</span> Cycle
            weapons
          </div>
          <div>
            • <span className="text-orange-400">Drag:</span> Multi-select
            threats
          </div>
          <div>
            • <span className="text-orange-400">Shift+Drag:</span> Area effect
            weapon
          </div>
          <div>
            • <span className="text-orange-400">Click Drone:</span> Return to
            base
          </div>
          <div>
            • <span className="text-orange-400">Click Bay:</span> Select drone
            type
          </div>
          <div className="mt-2 pt-1 border-t border-gray-600">
            <div className="text-orange-400 font-semibold mb-1">KEYBOARD:</div>
            <div>
              • <span className="text-orange-400">1-3:</span> Select weapons
            </div>
            <div>
              • <span className="text-orange-400">WASD:</span> Deploy drones
            </div>
            <div>
              • <span className="text-orange-400">ESC:</span> Clear selection
            </div>
            <div>
              • <span className="text-orange-400">SPACE:</span> Pause/Resume
            </div>
          </div>
        </div>
      </div>

      {/* Weapon Selection */}
      <div className={styles.weaponSelection}>
        <div className="text-xs text-gray-300 mb-2">WEAPONS</div>
        {Object.entries(gameState.weapons).map(
          ([weaponId, weapon]: [string, any]) => (
            <button
              key={weaponId}
              className={`${styles.weaponButton} ${
                gameState.selectedWeapon === weaponId
                  ? styles.weaponButtonActive
                  : styles.weaponButtonInactive
              } ${!weapon.isReady || weapon.ammo <= 0 ? styles.weaponButtonDisabled : ""}`}
              onClick={() => switchWeapon(weaponId)}
              disabled={!weapon.isReady || weapon.ammo <= 0}
            >
              <div className="font-bold">{weapon.name.split(" ")[0]}</div>
              <div className="text-xs">
                {weapon.ammo}/{weapon.maxAmmo}
              </div>
            </button>
          ),
        )}
      </div>

      {/* Ammo Display */}
      <div className={styles.ammoDisplay}>
        <div className="text-xs text-gray-300 mb-1">AMMO</div>
        <div className={styles.ammoBar}>
          <div
            className={styles.ammoFill}
            style={{
              width: `${
                (gameState.weapons[gameState.selectedWeapon].ammo /
                  gameState.weapons[gameState.selectedWeapon].maxAmmo) *
                100
              }%`,
            }}
          />
        </div>
        <div className="text-xs text-gray-400 mt-1">
          {gameState.weapons[gameState.selectedWeapon].ammo}/
          {gameState.weapons[gameState.selectedWeapon].maxAmmo}
        </div>
      </div>

      {/* Resource Management Display */}
      <div className={styles.resourceDisplay}>
        <div className="text-xs text-gray-300 mb-2">RESOURCES</div>
        <div className="mb-2">
          <div className={styles.resourceLabel}>ENERGY</div>
          <div className={styles.resourceBar}>
            <div
              className={styles.resourceBarEnergy}
              style={{
                width: `${(gameState.energy / gameState.maxEnergy) * 100}%`,
              }}
            />
          </div>
          <div className="text-xs text-gray-400">
            {Math.round(gameState.energy)}/{gameState.maxEnergy}
          </div>
        </div>
        <div>
          <div className={styles.resourceLabel}>COOLING</div>
          <div className={styles.resourceBar}>
            <div
              className={styles.resourceBarCooling}
              style={{
                width: `${(gameState.cooling / gameState.maxCooling) * 100}%`,
              }}
            />
          </div>
          <div className="text-xs text-gray-400">
            {Math.round(gameState.cooling)}/{gameState.maxCooling}
          </div>
        </div>
      </div>

      {/* Mothership Resource Display */}
      <div className={styles.mothershipResources}>
        <div className="text-xs text-gray-300 mb-2">MOTHERSHIP</div>
        <div className="mb-2">
          <div className={styles.resourceLabel}>ENERGY</div>
          <div className={styles.mothershipResourceBar}>
            <div
              className={styles.mothershipResourceFill}
              style={{
                width: `${(gameState.mothership.energy / gameState.mothership.maxEnergy) * 100}%`,
              }}
            />
          </div>
          <div className="text-xs text-gray-400">
            {Math.round(gameState.mothership.energy)}/
            {gameState.mothership.maxEnergy}
          </div>
        </div>
        <div className="mb-2">
          <div className={styles.resourceLabel}>FUEL</div>
          <div className={styles.mothershipResourceBar}>
            <div
              className={styles.mothershipResourceFill}
              style={{
                width: `${(gameState.mothership.fuel / gameState.mothership.maxFuel) * 100}%`,
              }}
            />
          </div>
          <div className="text-xs text-gray-400">
            {Math.round(gameState.mothership.fuel)}/
            {gameState.mothership.maxFuel}
          </div>
        </div>
        <div className="text-xs text-gray-400">
          Drones: {gameState.drones.length}/{gameState.mothership.droneCapacity}
        </div>
      </div>

      {/* Mini-map */}
      <div className={styles.miniMap}>
        <div className="text-xs text-gray-300 mb-1 text-center">RADAR</div>
        <div className={styles.miniMapCenter}></div>
        {gameState.threats.map((threat: any) => {
          const scale = 120; // Mini-map scale factor
          const centerX = 60; // Mini-map center X
          const centerY = 60; // Mini-map center Y
          const mapX = centerX + (threat.x - 400) / scale; // Assuming 800px width
          const mapY = centerY + (threat.y - 300) / scale; // Assuming 600px height

          if (mapX >= 0 && mapX <= 120 && mapY >= 0 && mapY <= 120) {
            return (
              <div
                key={threat.id}
                className={styles.miniMapThreat}
                style={{
                  left: `${mapX}px`,
                  top: `${mapY}px`,
                  backgroundColor:
                    threat.specialProperties?.targetPriority === "high"
                      ? "#ef4444"
                      : "#f97316",
                }}
              />
            );
          }
          return null;
        })}
      </div>

      {/* Drone Selection Controls */}
      <div className="absolute bottom-4 left-4 backdrop-blur-sm border rounded-md shadow-lg bg-black/80 border-orange-500/30 p-2">
        <div className="text-xs text-gray-300 mb-2">DRONE DEPLOYMENT</div>
        <div className="flex gap-1 flex-wrap">
          {(
            [
              "interceptor",
              "jammer",
              "surveillance",
              "shield",
              "swarm-coordinator",
            ] as const
          ).map((droneType) => {
            const bay = gameState.deploymentBays.find(
              (b: any) => b.droneType === droneType,
            );
            const isSelected = gameState.selectedDroneType === droneType;
            const isAvailable = bay && bay.currentDrones > 0;

            return (
              <button
                key={droneType}
                onClick={() => selectDroneType(isAvailable ? droneType : null)}
                className={`px-2 py-1 text-xs rounded ${
                  isSelected
                    ? "bg-orange-500 text-white"
                    : isAvailable
                      ? "bg-tactical-gray text-gray-300 hover:bg-gray-500"
                      : "bg-gray-800 text-gray-500 cursor-not-allowed"
                }`}
                disabled={!isAvailable}
                title={`${droneType}: ${bay?.currentDrones || 0}/${bay?.capacity || 0} available`}
              >
                {droneType.toUpperCase().split("-")[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Weather Controls */}
      <div className="absolute bottom-4 left-48 backdrop-blur-sm border rounded-md shadow-lg bg-black/80 border-orange-500/30 p-2">
        <div className="text-xs text-gray-300 mb-2">WEATHER</div>
        <div className="flex gap-1">
          {(["none", "rain", "fog", "night"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setWeatherMode(mode)}
              className={`px-2 py-1 text-xs rounded ${
                weatherMode === mode
                  ? "bg-orange-500 text-white"
                  : "bg-tactical-gray text-gray-300 hover:bg-gray-500"
              }`}
            >
              {mode.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Mission Controls */}
      <div className="absolute bottom-4 left-80 backdrop-blur-sm border rounded-md shadow-lg bg-black/80 border-orange-500/30 p-2">
        <div className="text-xs text-gray-300 mb-2">MISSION</div>
        <div className="flex gap-1 flex-wrap">
          {(
            [
              "military-base",
              "airport",
              "vip-protection",
              "border-patrol",
            ] as const
          ).map((mission) => (
            <button
              key={mission}
              onClick={() => setMissionType(mission)}
              className={`px-2 py-1 text-xs rounded ${
                missionType === mission
                  ? "bg-orange-500 text-white"
                  : "bg-tactical-gray text-gray-300 hover:bg-gray-500"
              }`}
            >
              {mission.replace("-", " ").toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Automation Controls */}
      <div className="absolute bottom-4 left-[28rem] backdrop-blur-sm border rounded-md shadow-lg bg-black/80 border-orange-500/30 p-2">
        <div className="text-xs text-gray-300 mb-2">AUTOMATION</div>
        <div className="flex gap-1">
          {(["manual", "automated", "hybrid"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setAutomationMode(mode)}
              className={`px-2 py-1 text-xs rounded ${
                automationMode === mode
                  ? "bg-orange-500 text-white"
                  : "bg-tactical-gray text-gray-300 hover:bg-gray-500"
              }`}
            >
              {mode.toUpperCase()}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowDeploymentZones(!showDeploymentZones)}
          className={`mt-1 px-2 py-1 text-xs rounded w-full ${
            showDeploymentZones
              ? "bg-green-500 text-white"
              : "bg-tactical-gray text-gray-300 hover:bg-gray-500"
          }`}
        >
          {showDeploymentZones ? "HIDE ZONES" : "SHOW ZONES"}
        </button>
      </div>

      {/* Interactive Controls */}
      <div className={styles.controlsOverlay}>
        <div className={styles.controlsContent}>
          <button
            onClick={toggleRunningState}
            className={`${styles.controlButton} ${
              gameState.isRunning
                ? styles.controlButtonOrange
                : styles.controlButtonGray
            }`}
          >
            {gameState.isRunning ? "PAUSE" : "RESUME"}
          </button>
          <button
            onClick={generateSwarm}
            className={`${styles.controlButton} ${styles.controlButtonOrange}`}
          >
            SWARM
          </button>
          <button
            onClick={() => spawnMultipleDrones(5)}
            className={`${styles.controlButton} ${styles.controlButtonOrange}`}
          >
            +5 DRONES
          </button>
          <button
            onClick={() => activatePowerUp("multi-shot")}
            className={`${styles.controlButton} ${styles.controlButtonOrange}`}
          >
            POWER-UP
          </button>
          <button
            onClick={clearSelection}
            className={`${styles.controlButton} ${styles.controlButtonGray}`}
          >
            CLEAR SEL
          </button>
          <button
            onClick={resetGameState}
            className={`${styles.controlButton} ${styles.controlButtonGray}`}
          >
            RESET
          </button>
        </div>
      </div>

      {/* Frame Rate Control */}
      <div className={styles.frameRateControl}>
        <div className="text-xs text-gray-300 mb-1">FPS</div>
        <input
          type="range"
          min="30"
          max="120"
          step="10"
          value={gameState.targetFrameRate}
          onChange={(e) => setFrameRate(parseInt(e.target.value))}
          className={styles.frameRateSlider}
        />
        <div className="text-xs text-gray-400 mt-1">
          {gameState.targetFrameRate}
        </div>
      </div>
    </>
  );
};
