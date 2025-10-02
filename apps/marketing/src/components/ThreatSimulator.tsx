"use client";
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */
import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ParticleRenderer } from "./ParticleRenderer";
import styles from "./ThreatSimulator.module.css";
import { useGameState } from "./hooks/useGameState";
import { useTimeoutManager } from "./hooks/useTimeoutManager";
import { useThreatSimulatorGame } from "./hooks/useThreatSimulatorGame";
import { useThreatSimulatorEvents } from "./hooks/useThreatSimulatorEvents";
import { useFullscreen } from "./hooks/useFullscreen";
import { ThreatSimulatorOverlays } from "./ThreatSimulatorOverlays";
import { ThreatSimulatorControls } from "./ThreatSimulatorControls";

interface ThreatSimulatorProps {
  isTeaser?: boolean;
  autoFullscreen?: boolean;
}

export const ThreatSimulator: React.FC<ThreatSimulatorProps> = ({
  isTeaser = false,
  autoFullscreen: _autoFullscreen = false,
}): JSX.Element => {
  const gameRef = useRef<HTMLDivElement>(null);
  const lastFrameTime = useRef<number>(0);
  const animationFrameRef = useRef<number | undefined>(undefined);

  // Custom hooks for state and timeouts
  const {
    gameState,
    updateScore,
    addThreat,
    removeThreat,
    updateThreats,
    toggleRunningState,
    updateGameTime,
    setFrameRate,
    switchWeapon,
    fireWeapon,
    updateWeaponCooldowns,
    activatePowerUp,
    updatePowerUps,
    checkAchievements,
    // addToLeaderboard, // TODO: Implement leaderboard UI
    updateResources,
    consumeEnergy,
    consumeCooling,
    selectThreat,
    clearSelection,
    setSelectionBox,
    setThreatPriority,
    // removeThreatPriority, // TODO: Implement priority removal UI
    deployDrone,
    // updateDrones, // TODO: Implement drone update UI
    selectDroneType,
    updateMothershipResources,
    returnDroneToBase,
    updateDronePositions,
    resetGameState,
  } = useGameState();

  const { addTimeout, clearTimeouts } = useTimeoutManager();

  // Use the game hook for all game logic
  const {
    particleSystem,
    gameDimensions,
    weatherMode,
    setWeatherMode,
    missionType,
    setMissionType,
    automationMode,
    setAutomationMode,
    showDeploymentZones,
    setShowDeploymentZones,
    strategicEngine,
    responseEngine,
    formationManager,
    spawnNewThreat,
    moveAllThreats,
    neutralizeThreatWithEffects,
    generateSwarm,
    spawnMultipleDrones,
  } = useThreatSimulatorGame({
    gameRef,
    gameState,
    updateThreats,
    addThreat,
    removeThreat,
    updateScore,
    neutralizeThreat: removeThreat, // Use removeThreat as neutralize
    fireWeapon,
    consumeEnergy,
    consumeCooling,
    checkAchievements,
    updateGameTime,
    updateWeaponCooldowns,
    updatePowerUps,
    updateResources,
    updateMothershipResources,
    updateDronePositions,
    setFrameRate,
    addTimeout,
    clearTimeouts,
  });

  // Use the events hook for all event handling
  const {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleThreatClick,
    handleGameAreaClick,
    handleGameAreaActivate,
    handleWheel,
    handleKeyDown,
    handleContextMenu,
  } = useThreatSimulatorEvents({
    gameRef,
    gameState,
    updateThreats,
    addThreat,
    removeThreat,
    updateScore,
    selectThreat,
    setThreatPriority,
    neutralizeThreat: removeThreat,
    switchWeapon,
    deployDrone,
    selectDroneType,
    returnDroneToBase,
    clearSelection,
    spawnNewThreat,
    moveAllThreats,
    generateSwarm,
    spawnMultipleDrones,
    activatePowerUp,
    clearTimeouts,
    resetGameState,
    toggleRunningState,
    setFrameRate,
    consumeEnergy,
    consumeCooling,
    setSelectionBox,
    particleSystem,
  });

  // Use the fullscreen hook
  const {
    isFullscreen,
    enterFullscreen,
    exitFullscreen,
    showFullscreenPrompt,
  } = useFullscreen({
    gameRef,
    autoFullscreen: _autoFullscreen,
    isTeaser,
  });

  // UI state
  const [showSimulationWarning, setShowSimulationWarning] = useState(true);

  // Missing functions that are used in JSX
  const handleGameAreaKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    handleKeyDown(e as any);
  };
  const neutralizeThreat = removeThreat;
  const resetGame = resetGameState;

  const getThreatAppearance = (type: string) => {
    switch (type) {
      case "drone":
        return {
          emoji: "🚁",
          color: "bg-red-600 shadow-lg shadow-red-600/50",
          cssClass: "",
        };
      case "swarm":
        return {
          emoji: "🐝",
          color: "bg-orange-500 shadow-lg shadow-orange-500/50",
          cssClass: "",
        };
      case "stealth":
        return {
          emoji: "👻",
          color: "bg-tactical-gray shadow-lg shadow-gray-600/50",
          cssClass: "",
        };
      case "kamikaze":
        return {
          emoji: "💥",
          color: "bg-red-800 shadow-lg shadow-red-800/60",
          cssClass: styles.threatKamikaze,
        };
      case "decoy":
        return {
          emoji: "🎭",
          color: "bg-gray-500 shadow-lg shadow-gray-500/40",
          cssClass: styles.threatDecoy,
        };
      case "shielded":
        return {
          emoji: "🛡️",
          color: "bg-blue-700 shadow-lg shadow-blue-700/60",
          cssClass: styles.threatShielded,
        };
      default:
        return {
          emoji: "🚁",
          color: "bg-red-600 shadow-lg shadow-red-600/50",
          cssClass: "",
        };
    }
  };

  useEffect(() => {
    return () => clearTimeouts();
  }, [clearTimeouts]);

  return (
    <div className="relative w-full h-[600px] bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 rounded-xl border border-red-500/20 overflow-hidden shadow-2xl">
      {/* Critical Simulation Disclaimer */}
      {showSimulationWarning && (
        <div className="absolute top-2 left-2 right-2 z-50 bg-black/80 backdrop-blur-sm border border-red-500/30 rounded-lg p-2">
          <div className="flex items-center justify-between">
            <p className="text-xs text-red-400 font-semibold flex-1">
              ⚠️ SIMULATION: This interactive module is designed to visualize
              concepts. It does not represent real-world sensor performance,
              detection ranges, or decision latency.
            </p>
            <button
              onClick={() => setShowSimulationWarning(false)}
              className="ml-3 text-red-400 hover:text-red-300 transition-colors"
              title="Close warning"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

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

      {/* Technical grid background */}
      <div className={styles.technicalGrid}></div>

      {/* Weather Effects */}
      {weatherMode === "rain" && <div className={styles.weatherRain}></div>}
      {weatherMode === "fog" && <div className={styles.weatherFog}></div>}

      {/* Selection Box */}
      {gameState.selectionBox && (
        <div
          className={styles.selectionBox}
          style={{
            left: Math.min(
              gameState.selectionBox.startX,
              gameState.selectionBox.endX,
            ),
            top: Math.min(
              gameState.selectionBox.startY,
              gameState.selectionBox.endY,
            ),
            width: Math.abs(
              gameState.selectionBox.endX - gameState.selectionBox.startX,
            ),
            height: Math.abs(
              gameState.selectionBox.endY - gameState.selectionBox.startY,
            ),
          }}
        />
      )}

      {/* Particle Renderer */}
      <ParticleRenderer
        particleSystem={particleSystem}
        width={gameDimensions.width}
        height={gameDimensions.height}
      />

      <div
        ref={gameRef}
        className={`${styles.gameArea} ${weatherMode === "night" ? styles.nightVision : ""}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        onContextMenu={(e) => e.preventDefault()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleRunningState();
          }
        }}
        role="application"
        aria-label="Threat Simulator Game Area"
        tabIndex={0}
      >
        {/* Phoenix Rooivalk Mothership - Central Command */}
        <div
          className={`${styles.mothership}`}
          style={{
            left: `${gameState.mothership.x - 48}px`,
            top: `${gameState.mothership.y - 48}px`,
          }}
          onClick={handleGameAreaClick}
          onKeyDown={handleGameAreaKeyDown}
          role="button"
          aria-label="Mothership command center"
          tabIndex={0}
        >
          {/* Mothership Core */}
          <div className={styles.mothershipCore}></div>

          {/* Deployment Bays */}
          {gameState.deploymentBays.map((bay) => (
            <div
              key={bay.id}
              className={`${styles.deploymentBay} ${
                bay.currentDrones > 0
                  ? styles.deploymentBayReady
                  : styles.deploymentBayEmpty
              }`}
              style={{
                left: `${bay.x - 12}px`,
                top: `${bay.y - 12}px`,
              }}
              onClick={(e) => {
                e.stopPropagation();
                selectDroneType(bay.currentDrones > 0 ? bay.droneType : null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  e.stopPropagation();
                  selectDroneType(bay.currentDrones > 0 ? bay.droneType : null);
                }
              }}
              role="button"
              aria-label={`Deployment bay for ${bay.droneType} drones`}
              tabIndex={0}
              title={`${bay.droneType} Bay: ${bay.currentDrones}/${bay.capacity} drones`}
            >
              <div className={styles.deploymentBayIndicator}></div>
            </div>
          ))}
        </div>

        {/* Detection Coverage Visualization */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80">
          {/* Outer detection ring */}
          <div className="absolute inset-0 border-2 border-[var(--primary)]/20 rounded-full opacity-30 animate-pulse"></div>

          {/* Radar sweep line */}
          <div className="absolute top-1/2 left-1/2 w-full h-0.5 bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent animate-spin origin-left opacity-60"></div>

          {/* Coverage zones */}
          <div className="absolute inset-4 border border-[var(--accent)]/15 rounded-full opacity-25"></div>
          <div className="absolute inset-8 border border-[var(--primary)]/10 rounded-full opacity-20"></div>

          {/* Detection pings */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-2 h-2 bg-[var(--accent)] rounded-full animate-ping opacity-75"></div>
          </div>
        </div>

        {/* Strategic Deployment Zones */}
        {showDeploymentZones &&
          strategicEngine.getDeploymentZones().map((zone) => (
            <div
              key={zone.id}
              className="absolute border-2 border-dashed rounded-full pointer-events-none"
              style={{
                left: `${zone.centerX - zone.radius}px`,
                top: `${zone.centerY - zone.radius}px`,
                width: `${zone.radius * 2}px`,
                height: `${zone.radius * 2}px`,
                borderColor:
                  zone.priority === "critical"
                    ? "#ef4444"
                    : zone.priority === "high"
                      ? "#f97316"
                      : zone.priority === "medium"
                        ? "#eab308"
                        : "#84cc16",
                opacity: 0.6,
              }}
            >
              {/* Zone label */}
              <div
                className="absolute text-xs font-mono text-white bg-black/50 px-1 rounded"
                style={{
                  left: "50%",
                  top: "-20px",
                  transform: "translateX(-50%)",
                }}
              >
                {zone.name}
              </div>

              {/* Coverage indicator */}
              <div
                className="absolute text-xs font-mono text-white bg-black/50 px-1 rounded"
                style={{
                  left: "50%",
                  bottom: "-20px",
                  transform: "translateX(-50%)",
                }}
              >
                {Math.round(zone.coverage * 100)}%
              </div>

              {/* Threat level indicator */}
              <div
                className="absolute w-2 h-2 rounded-full"
                style={{
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  backgroundColor:
                    zone.threatLevel > 0.7
                      ? "#ef4444"
                      : zone.threatLevel > 0.4
                        ? "#f97316"
                        : "#84cc16",
                }}
              ></div>
            </div>
          ))}

        {/* Inner defense ring */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-[var(--primary)]/15 rounded-full opacity-30">
          <div className="absolute inset-2 border border-[var(--accent)]/10 rounded-full opacity-20"></div>
        </div>

        {/* Detection range indicators */}
        <div className="absolute top-4 left-4 text-xs text-[var(--accent)] font-mono opacity-70">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-[var(--primary)] rounded-full animate-pulse"></div>
            <span>5km Detection</span>
          </div>
        </div>

        <div className="absolute top-4 right-4 text-xs text-[var(--accent)] font-mono opacity-70">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-[var(--accent)] rounded-full animate-pulse"></div>
            <span>2km Engage</span>
          </div>
        </div>

        {gameState.threats.map((threat) => {
          const appearance = getThreatAppearance(threat.type);
          const weapon = gameState.weapons[gameState.selectedWeapon];
          const effectiveness = weapon?.effectiveness?.[threat.type] ?? 0;
          const isEffective =
            effectiveness >= 0.5 ||
            gameState.activePowerUps.some((p) => p.effect.penetration);
          const isSelected = gameState.selectedThreats.includes(threat.id);
          const priority =
            gameState.priorityThreats[threat.id] ||
            threat.specialProperties?.targetPriority ||
            "medium";

          return (
            <button
              key={threat.id}
              className={`${styles.threat} ${styles.threatPosition} ${appearance.cssClass} ${
                !isEffective ? "opacity-50" : ""
              } ${isSelected ? styles.threatSelected : ""}`}
              /* eslint-disable react/forbid-dom-props */
              style={
                {
                  "--threat-x": `${threat.x}px`,
                  "--threat-y": `${threat.y}px`,
                } as React.CSSProperties
              }
              data-threat-id={threat.id}
              onMouseDown={(e) => handleThreatClick(e, threat.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  e.stopPropagation();
                  neutralizeThreat(threat.id);
                }
              }}
              aria-label={`${threat.type} threat with ${threat.health} health. Weapon effectiveness: ${Math.round(effectiveness * 100)}%. Priority: ${priority}`}
              title={`${threat.type} - ${Math.round(effectiveness * 100)}% effective. Priority: ${priority}`}
            >
              <div>{appearance.emoji}</div>
              <div className={styles.threatHealthBar}>
                <div
                  className={`${styles.threatHealthFill} ${styles.healthBarWidth}`}
                  /* eslint-disable react/forbid-dom-props */
                  style={
                    {
                      "--health-width": `${
                        (threat.health /
                          (threat.type === "stealth"
                            ? 3
                            : threat.type === "swarm"
                              ? 2
                              : threat.type === "shielded"
                                ? 4
                                : threat.type === "kamikaze"
                                  ? 1
                                  : threat.type === "decoy"
                                    ? 0.5
                                    : 1)) *
                        100
                      }%`,
                    } as React.CSSProperties
                  }
                />
              </div>

              {/* Priority indicator */}
              <div
                className={`${styles.priorityIndicator} ${styles[`priority${priority.charAt(0).toUpperCase() + priority.slice(1)}`]}`}
              ></div>

              {/* Trajectory prediction */}
              {priority === "high" && (
                <div
                  className={styles.trajectoryPrediction}
                  style={{
                    left: threat.x,
                    top: threat.y,
                    width: "100px",
                    height: "2px",
                    transform: `rotate(${(Math.atan2(300 - threat.y, 400 - threat.x) * 180) / Math.PI}deg)`,
                  }}
                />
              )}
            </button>
          );
        })}

        {/* Deployed Drones */}
        {gameState.drones.map((drone) => (
          <button
            key={drone.id}
            className={`${styles.deployedDrone} ${styles[`drone${drone.type.charAt(0).toUpperCase() + drone.type.slice(1)}`]} ${
              drone.isReturning ? styles.droneReturning : ""
            }`}
            style={{
              left: `${drone.x - 8}px`,
              top: `${drone.y - 8}px`,
            }}
            onClick={(e) => {
              e.stopPropagation();
              returnDroneToBase(drone.id);
            }}
            title={`${drone.type} Drone - Mission: ${drone.mission} - Energy: ${Math.round(drone.energy)}/${drone.maxEnergy}`}
          >
            {/* Mission Indicator */}
            <div
              className={`${styles.droneMissionIndicator} ${styles[`mission${drone.mission.charAt(0).toUpperCase() + drone.mission.slice(1)}`]}`}
            ></div>
          </button>
        ))}

        {/* Enhanced Stats Overlay */}
        <div className={styles.statsOverlay}>
          <div className={styles.statsContent}>
            <div className={styles.statItem}>
              <div className={styles.statValue}>
                {gameState.score.toLocaleString()}
              </div>
              <div className={styles.statLabel}>SCORE</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>{gameState.threats.length}</div>
              <div className={styles.statLabel}>THREATS</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>{gameState.neutralized}</div>
              <div className={styles.statLabel}>NEUTRALIZED</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>{gameState.level}</div>
              <div className={styles.statLabel}>LEVEL</div>
            </div>
          </div>
        </div>

        {/* Combo Indicator */}
        {gameState.comboMultiplier > 1 && (
          <div className={styles.comboIndicator}>
            COMBO x{gameState.comboMultiplier.toFixed(1)}
          </div>
        )}

        {/* Weapon Selection */}
        <div className={styles.weaponSelection}>
          <div className="text-xs text-gray-300 mb-2">WEAPONS</div>
          {Object.entries(gameState.weapons).map(([weaponId, weapon]) => (
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
          ))}
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

        {/* Active Power-ups */}
        {gameState.activePowerUps.map((powerUp) => (
          <div key={powerUp.id} className={styles.powerUpIndicator}>
            {powerUp.name.toUpperCase()}
          </div>
        ))}

        {/* Achievement Notifications */}
        {gameState.achievements.length > 0 && (
          <div className={styles.achievementNotification}>
            🏆 ACHIEVEMENT UNLOCKED! 🏆
            <br />
            {gameState.achievements[gameState.achievements.length - 1]
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
          </div>
        )}

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
            Drones: {gameState.drones.length}/
            {gameState.mothership.droneCapacity}
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

        {/* Mini-map */}
        <div className={styles.miniMap}>
          <div className="text-xs text-gray-300 mb-1 text-center">RADAR</div>
          <div className={styles.miniMapCenter}></div>
          {gameState.threats.map((threat) => {
            const scale = 120; // Mini-map scale factor
            const centerX = 60; // Mini-map center X
            const centerY = 60; // Mini-map center Y
            const mapX =
              centerX + (threat.x - gameDimensions.width / 2) / scale;
            const mapY =
              centerY + (threat.y - gameDimensions.height / 2) / scale;

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
                (b) => b.droneType === droneType,
              );
              const isSelected = gameState.selectedDroneType === droneType;
              const isAvailable = bay && bay.currentDrones > 0;

              return (
                <button
                  key={droneType}
                  onClick={() =>
                    selectDroneType(isAvailable ? droneType : null)
                  }
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
              onClick={resetGame}
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
      </div>

      {/* Teaser Overlay */}
      {isTeaser && !isFullscreen && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center p-8 max-w-md">
            <div className="mb-6">
              <div className="text-6xl mb-4">🎮</div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Experience Full Defense
              </h3>
              <p className="text-gray-300 text-sm mb-6">
                This is a preview of the Phoenix Rooivalk defense system
                simulator. Enter full-screen mode to access all features and
                controls.
              </p>
            </div>

            <button
              onClick={enterFullscreen}
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              🚀 Enter Full-Screen Mode
            </button>

            <p className="text-xs text-gray-400 mt-4">
              Press ESC to exit full-screen at any time
            </p>
          </div>
        </div>
      )}

      {/* Fullscreen Exit Button */}
      {isFullscreen && (
        <button
          onClick={exitFullscreen}
          className="absolute top-4 right-4 z-50 bg-black/80 text-white p-2 rounded-lg hover:bg-black/90 transition-colors"
          title="Exit Fullscreen (ESC)"
        >
          ✕
        </button>
      )}
    </div>
  );
};
