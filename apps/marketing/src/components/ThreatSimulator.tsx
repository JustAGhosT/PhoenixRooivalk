"use client";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { useFullscreen } from "./hooks/useFullscreen";
import { useGameState } from "./hooks/useGameState";
import { useThreatSimulatorEvents } from "./hooks/useThreatSimulatorEvents";
import { useThreatSimulatorGame } from "./hooks/useThreatSimulatorGame";
import { useTimeoutManager } from "./hooks/useTimeoutManager";

interface ThreatSimulatorProps {
  isTeaser?: boolean;
  autoFullscreen?: boolean;
}

export const ThreatSimulator: React.FC<ThreatSimulatorProps> = ({
  isTeaser = false,
  autoFullscreen = false,
}): JSX.Element => {
  const gameRef = useRef<HTMLButtonElement>(null);
  const [showSimulationWarning, setShowSimulationWarning] = useState(true);

  // Core game state
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
    updateResources,
    consumeEnergy,
    consumeCooling,
    selectThreat,
    clearSelection,
    setSelectionBox,
    setThreatPriority,
    deployDrone,
    selectDroneType,
    updateMothershipResources,
    returnDroneToBase,
    updateDronePositions,
    resetGameState,
    processFadeOut,
  } = useGameState();

  const { addTimeout, clearTimeouts } = useTimeoutManager();

  // Game logic hook
  const {
    particleSystem,
    setWeatherMode,
    setMissionType,
    setAutomationMode,
    showDeploymentZones,
    setShowDeploymentZones,
    spawnNewThreat,
    moveAllThreats,
    generateSwarm,
    spawnMultipleDrones,
  } = useThreatSimulatorGame({
    gameRef,
    gameState,
    updateThreats,
    addThreat,
    removeThreat,
    updateScore,
    neutralizeThreat: removeThreat,
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
    processFadeOut,
  });

  // Events hook
  const {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleThreatClick,
    handleGameAreaClick,
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

  // Fullscreen hook
  const {
    isFullscreen,
    enterFullscreen,
    exitFullscreen,
    showFullscreenPrompt,
  } = useFullscreen({
    gameRef,
    autoFullscreen,
    isTeaser,
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => clearTimeouts();
  }, [clearTimeouts]);

  // Threat appearance helper
  const getThreatAppearance = (type: string) => {
    const appearances = {
      drone: { emoji: "🚁", color: "bg-red-600", cssClass: "" },
      swarm: { emoji: "🐝", color: "bg-orange-500", cssClass: "" },
      stealth: { emoji: "👻", color: "bg-gray-600", cssClass: "" },
      kamikaze: { emoji: "💥", color: "bg-red-800", cssClass: "" },
      decoy: { emoji: "🎭", color: "bg-gray-500", cssClass: "" },
      shielded: { emoji: "🛡️", color: "bg-blue-700", cssClass: "" },
    };
    return appearances[type as keyof typeof appearances] || appearances.drone;
  };

  return (
    <div className="relative w-full h-[600px] bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 rounded-xl border border-red-500/20 overflow-hidden shadow-2xl">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
            backgroundSize: "20px 20px",
          }}
        />
      </div>

      {/* Simulation Warning */}
      {showSimulationWarning && (
        <div className="absolute top-4 left-4 right-4 z-50 bg-red-900/95 backdrop-blur-md border border-red-500/60 rounded-lg p-4 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                <span className="text-red-400 text-lg">⚠️</span>
              </div>
              <div>
                <div className="text-sm text-white font-semibold mb-1">
                  SIMULATION MODULE
                </div>
                <div className="text-xs text-red-200">
                  This interactive module is designed to visualize concepts. It
                  does not represent real-world sensor performance, detection
                  ranges, or decision latency.
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowSimulationWarning(false)}
              className="text-red-400 hover:text-red-300 transition-colors p-2 hover:bg-red-500/20 rounded"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Game Area */}
      <button
        ref={gameRef}
        className="absolute inset-0 cursor-crosshair w-full h-full bg-transparent border-none p-0"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={handleGameAreaClick}
        onWheel={handleWheel}
        onKeyDown={handleKeyDown}
        onContextMenu={handleContextMenu}
        aria-label="Threat simulation game area"
        type="button"
      >
        {/* Enhanced Central Radar */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80">
          {/* Outer detection ring */}
          <div className="absolute inset-0 border-2 border-blue-400/15 rounded-full animate-pulse" />
          {/* Middle detection ring */}
          <div className="absolute inset-8 border border-blue-300/25 rounded-full" />
          {/* Inner detection ring */}
          <div className="absolute inset-16 border border-blue-400/35 rounded-full" />
          {/* Range markers */}
          <div className="absolute inset-0">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <div
                key={angle}
                className="absolute top-1/2 left-1/2 w-0.5 h-8 bg-blue-400/20 transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-40px)`,
                }}
              />
            ))}
          </div>
          {/* Sweep line */}
          <div className="absolute top-1/2 left-1/2 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-spin origin-left opacity-70" />
          {/* Center dot */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-blue-400 rounded-full animate-ping shadow-lg" />
          {/* Range labels */}
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-xs text-blue-400 font-mono">
            RANGE
          </div>
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-blue-400 font-mono">
            {Math.round(gameState.mothership.x)}m
          </div>
        </div>

        {/* Enhanced Mothership */}
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
          style={{
            left: `${gameState.mothership.x}px`,
            top: `${gameState.mothership.y}px`,
          }}
        >
          {/* Mothership body */}
          <div className="w-16 h-16 bg-gradient-to-br from-slate-600 to-slate-800 rounded-lg flex items-center justify-center text-2xl shadow-2xl border-2 border-slate-400 relative">
            🚁
            {/* Energy shield indicator */}
            {gameState.energy > gameState.maxEnergy * 0.7 && (
              <div className="absolute inset-0 rounded-lg border-2 border-blue-400/50 animate-pulse" />
            )}
            {/* Low energy warning */}
            {gameState.energy < gameState.maxEnergy * 0.2 && (
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-red-400 text-xs animate-bounce font-mono">
                LOW ENERGY
              </div>
            )}
          </div>
          {/* Mothership label */}
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-white bg-black/50 px-2 py-1 rounded font-mono">
            MOTHERSHIP
          </div>
        </div>

        {/* Enhanced Threats */}
        {gameState.threats.map((threat) => {
          const appearance = getThreatAppearance(threat.type);
          const isSelected = gameState.selectedThreats.includes(threat.id);
          const priority = gameState.priorityThreats?.[threat.id] || "low";
          const isNeutralized =
            threat.status === "neutralized" || threat.isMoving === false;
          const isCrater = threat.status === "crater";

          // Calculate fade opacity for neutralized threats
          let fadeOpacity = 1;
          if (threat.status === "neutralized" && threat.fadeStartTime) {
            const currentTime = Date.now();
            if (currentTime >= threat.fadeStartTime) {
              const fadeDuration = 3000; // 3 seconds to fade out
              const fadeProgress = Math.min(
                (currentTime - threat.fadeStartTime) / fadeDuration,
                1,
              );
              fadeOpacity = 1 - fadeProgress;
            }
          }

          return (
            <div
              key={threat.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                isSelected ? "scale-125 z-30" : "z-20"
              } ${isNeutralized ? "opacity-50" : ""}`}
              style={{
                left: `${threat.x}px`,
                top: `${threat.y}px`,
                opacity: isNeutralized ? fadeOpacity : 1,
              }}
              onClick={(e) =>
                !isNeutralized && !isCrater && handleThreatClick(e, threat.id)
              }
              onKeyDown={(e) => {
                if (
                  !isNeutralized &&
                  !isCrater &&
                  (e.key === "Enter" || e.key === " ")
                ) {
                  e.preventDefault();
                  handleThreatClick(e, threat.id);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`Threat ${threat.type} at position ${Math.round(threat.x)}, ${Math.round(threat.y)}${isNeutralized ? " (neutralized)" : isCrater ? " (crater)" : ""}`}
            >
              {/* Threat icon with enhanced styling */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-2xl border-2 ${
                  isCrater
                    ? "bg-gray-600/30 border-gray-500/50"
                    : isNeutralized
                      ? "bg-red-500/20 border-red-500/50"
                      : appearance.color
                } ${
                  isSelected
                    ? "ring-4 ring-blue-400 ring-opacity-75 border-blue-300"
                    : isCrater
                      ? "border-gray-500/50"
                      : isNeutralized
                        ? "border-red-500/50"
                        : "border-white/20"
                } relative`}
              >
                {isCrater ? "🕳️" : isNeutralized ? "💥" : appearance.emoji}

                {/* Threat trail - only show for active threats */}
                {!isNeutralized &&
                  !isCrater &&
                  threat.trail &&
                  threat.trail.length > 1 && (
                    <div className="absolute inset-0 rounded-full border border-white/30 animate-pulse" />
                  )}
              </div>

              {/* Priority indicator */}
              {priority !== "low" && (
                <div
                  className={`absolute -top-2 -right-2 w-4 h-4 rounded-full border-2 border-white ${
                    priority === "high"
                      ? "bg-red-500"
                      : priority === "medium"
                        ? "bg-yellow-500"
                        : "bg-green-500"
                  }`}
                />
              )}

              {/* Threat label */}
              {(isSelected || priority !== "low") && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded font-mono whitespace-nowrap">
                  {threat.type.toUpperCase()}
                  {priority !== "low" && (
                    <span className="ml-1 text-xs">
                      {priority === "high"
                        ? "🔴"
                        : priority === "medium"
                          ? "🟡"
                          : "🟢"}
                    </span>
                  )}
                </div>
              )}

              {/* Health bar */}
              {threat.health && (
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gray-600 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500 transition-all duration-300"
                    style={{
                      width: `${Math.min((threat.health / 100) * 100, 100)}%`,
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}

        {/* Enhanced Drones */}
        {gameState.drones.map((drone) => (
          <div
            key={drone.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
            style={{
              left: `${drone.x}px`,
              top: `${drone.y}px`,
            }}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-sm shadow-xl border-2 border-blue-300 relative">
              🚁
              {/* Drone status indicator */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white animate-pulse" />
            </div>
            {/* Drone trail */}
            <div className="absolute inset-0 rounded-full border border-blue-400/30 animate-ping" />
          </div>
        ))}

        {/* Selection Box */}
        {gameState.selectionBox && gameState.selectionBox.isActive && (
          <div
            className="absolute border-2 border-blue-400 bg-blue-400/10 pointer-events-none"
            style={{
              left: `${Math.min(gameState.selectionBox.startX, gameState.selectionBox.endX)}px`,
              top: `${Math.min(gameState.selectionBox.startY, gameState.selectionBox.endY)}px`,
              width: `${Math.abs(gameState.selectionBox.endX - gameState.selectionBox.startX)}px`,
              height: `${Math.abs(gameState.selectionBox.endY - gameState.selectionBox.startY)}px`,
            }}
          />
        )}
      </button>

      {/* Enhanced Top Status Bar */}
      <div className="absolute top-4 left-4 right-4 bg-black/60 backdrop-blur-md border border-gray-600/50 rounded-lg p-3">
        <div className="flex justify-between items-center">
          {/* Left: Game Status */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  gameState.isRunning
                    ? "bg-green-500 animate-pulse"
                    : "bg-red-500"
                }`}
              />
              <span className="text-sm font-mono text-white">
                {gameState.isRunning ? "SYSTEM ACTIVE" : "SYSTEM PAUSED"}
              </span>
            </div>
            <div className="text-sm text-gray-300">
              Level {gameState.level} | Score:{" "}
              {gameState.score.toLocaleString()}
            </div>
            <div className="text-xs text-gray-400">
              Threats: {gameState.threats.length} | Neutralized:{" "}
              {gameState.neutralized}
            </div>
          </div>

          {/* Center: Mission Info */}
          <div className="text-center">
            <div className="text-sm font-mono text-white mb-1">
              {gameState.missionType.replace("-", " ").toUpperCase()}
            </div>
            <div className="text-xs text-gray-400">
              {gameState.automationMode.toUpperCase()} MODE •{" "}
              {gameState.weatherMode.toUpperCase()}
            </div>
          </div>

          {/* Right: Controls */}
          <div className="flex items-center space-x-3">
            <div className="text-xs text-gray-400">
              FPS: {gameState.frameRate}
            </div>
            <button
              className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
              onClick={isFullscreen ? exitFullscreen : enterFullscreen}
            >
              {isFullscreen ? "EXIT FULLSCREEN" : "ENTER FULLSCREEN"}
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Bottom Control Panel */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-black/90 backdrop-blur-md border border-gray-600/50 rounded-lg p-4 shadow-2xl">
          <div className="grid grid-cols-5 gap-6">
            {/* Weapons */}
            <div>
              <div className="text-xs font-mono text-gray-300 mb-3 flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                WEAPONS
              </div>
              <div className="space-y-2">
                {[
                  {
                    id: "kinetic",
                    name: "Kinetic",
                    icon: "⚡",
                    color: "bg-blue-600",
                  },
                  {
                    id: "electronic",
                    name: "EMP",
                    icon: "🌀",
                    color: "bg-purple-600",
                  },
                  {
                    id: "laser",
                    name: "Laser",
                    icon: "🔴",
                    color: "bg-red-600",
                  },
                ].map((weapon) => (
                  <button
                    key={weapon.id}
                    className={`w-full px-3 py-2 text-xs rounded-lg transition-all flex items-center space-x-2 ${
                      gameState.selectedWeapon === weapon.id
                        ? `${weapon.color} text-white shadow-lg`
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                    onClick={() => switchWeapon(weapon.id)}
                  >
                    <span>{weapon.icon}</span>
                    <span>{weapon.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Resources */}
            <div>
              <div className="text-xs font-mono text-gray-300 mb-3 flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                RESOURCES
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Energy</span>
                    <span className="text-green-400">
                      {Math.round(gameState.energy)}/{gameState.maxEnergy}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 transition-all duration-300"
                      style={{
                        width: `${(gameState.energy / gameState.maxEnergy) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Cooling</span>
                    <span className="text-blue-400">
                      {Math.round(gameState.cooling)}/{gameState.maxCooling}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all duration-300"
                      style={{
                        width: `${(gameState.cooling / gameState.maxCooling) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Drones</span>
                  <span className="text-yellow-400">
                    {gameState.drones.length}/12
                  </span>
                </div>
              </div>
            </div>

            {/* Environment */}
            <div>
              <div className="text-xs font-mono text-gray-300 mb-3 flex items-center">
                <span className="w-2 h-2 bg-cyan-400 rounded-full mr-2"></span>
                ENVIRONMENT
              </div>
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-gray-400 mb-2">Weather</div>
                  <select
                    className="w-full px-3 py-2 text-xs bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                    value={gameState.weatherMode}
                    onChange={(e) => setWeatherMode(e.target.value as typeof gameState.weatherMode)}
                  >
                    <option value="none">☀️ Clear</option>
                    <option value="rain">🌧️ Rain</option>
                    <option value="fog">🌫️ Fog</option>
                    <option value="night">🌙 Night</option>
                  </select>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-2">Mission</div>
                  <select
                    className="w-full px-3 py-2 text-xs bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                    value={gameState.missionType}
                    onChange={(e) => setMissionType(e.target.value as typeof gameState.missionType)}
                  >
                    <option value="airport">✈️ Airport</option>
                    <option value="military-base">🏭 Military Base</option>
                    <option value="vip-protection">👤 VIP Protection</option>
                    <option value="border-patrol">🛡️ Border Patrol</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Automation */}
            <div>
              <div className="text-xs font-mono text-gray-300 mb-3 flex items-center">
                <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                AUTOMATION
              </div>
              <div className="space-y-2">
                {["manual", "automated", "hybrid"].map((mode) => (
                  <button
                    key={mode}
                    className={`w-full px-3 py-2 text-xs rounded-lg transition-all ${
                      gameState.automationMode === mode
                        ? "bg-purple-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                    onClick={() => setAutomationMode(mode as typeof gameState.automationMode)}
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
                <button
                  className={`w-full px-3 py-2 text-xs rounded-lg transition-all ${
                    showDeploymentZones
                      ? "bg-yellow-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                  onClick={() => setShowDeploymentZones(!showDeploymentZones)}
                >
                  {showDeploymentZones ? "HIDE ZONES" : "SHOW ZONES"}
                </button>
              </div>
            </div>

            {/* Controls */}
            <div>
              <div className="text-xs font-mono text-gray-300 mb-3 flex items-center">
                <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                CONTROLS
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-xs transition-all shadow-lg"
                  onClick={toggleRunningState}
                >
                  {gameState.isRunning ? "⏸️ PAUSE" : "▶️ RESUME"}
                </button>
                <button
                  className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-lg text-xs transition-all shadow-lg"
                  onClick={generateSwarm}
                >
                  🐝 SWARM
                </button>
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-xs transition-all shadow-lg"
                  onClick={() => spawnMultipleDrones(5)}
                >
                  🚁 +5 DRONES
                </button>
                <button
                  className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-xs transition-all shadow-lg"
                  onClick={() => activatePowerUp("energy-boost")}
                >
                  ⚡ POWER-UP
                </button>
                <button
                  className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg text-xs transition-all shadow-lg"
                  onClick={clearSelection}
                >
                  🗑️ CLEAR
                </button>
                <button
                  className="bg-red-800 hover:bg-red-900 text-white px-3 py-2 rounded-lg text-xs transition-all shadow-lg"
                  onClick={resetGameState}
                >
                  🔄 RESET
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Fullscreen Prompt */}
      {showFullscreenPrompt && !isFullscreen && (
        <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-600/50 rounded-xl p-8 max-w-lg text-center shadow-2xl">
            <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🎮</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              Enter Fullscreen Mode
            </h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              The threat simulation requires fullscreen mode for the optimal
              tactical experience. This ensures maximum immersion and precise
              control.
            </p>
            <div className="flex space-x-4">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-all shadow-lg flex-1"
                onClick={enterFullscreen}
              >
                Enter Fullscreen
              </button>
              <button
                className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg transition-all shadow-lg"
                onClick={() => setShowSimulationWarning(false)}
              >
                Continue in Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};