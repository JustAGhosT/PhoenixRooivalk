import * as React from "react";
import type { GameState } from "../types/game";

interface ThreatSimulatorControlsProps {
  gameState: GameState;
  switchWeapon: (weaponId: "kinetic" | "electronic" | "laser") => void;
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
  weatherMode,
  setWeatherMode,
  missionType,
  setMissionType,
  automationMode,
  setAutomationMode,
  showDeploymentZones,
  setShowDeploymentZones,
}) => {
  const [showHelp, setShowHelp] = React.useState(false);

  // Enhanced weapon data with cooldown visualization
  const weaponData = [
    {
      id: "kinetic",
      name: "Kinetic",
      icon: "⚡",
      color: "bg-blue-600",
      cooldown: gameState.weapons.kinetic?.cooldown || 0,
      maxCooldown: 100,
      ammo: gameState.weapons.kinetic?.ammo || 0,
      maxAmmo: gameState.weapons.kinetic?.maxAmmo || 50,
    },
    {
      id: "electronic",
      name: "EMP",
      icon: "🌀",
      color: "bg-purple-600",
      cooldown: gameState.weapons.electronic?.cooldown || 0,
      maxCooldown: 100,
      ammo: gameState.weapons.electronic?.ammo || 0,
      maxAmmo: gameState.weapons.electronic?.maxAmmo || 30,
    },
    {
      id: "laser",
      name: "Directed",
      icon: "🔴",
      color: "bg-red-600",
      cooldown: gameState.weapons.laser?.cooldown || 0,
      maxCooldown: 100,
      ammo: gameState.weapons.laser?.ammo || 0,
      maxAmmo: gameState.weapons.laser?.maxAmmo || 100,
    },
  ];

  // Enhanced drone data with status visualization
  const droneData = [
    {
      id: "interceptor",
      name: "Interceptor",
      icon: "🚁",
      color: "bg-red-500",
      count: gameState.drones.filter((d) => d.type === "interceptor").length,
      maxCount: 5,
      status: "ready",
    },
    {
      id: "jammer",
      name: "Jammer",
      icon: "📡",
      color: "bg-yellow-500",
      count: gameState.drones.filter((d) => d.type === "jammer").length,
      maxCount: 3,
      status: "ready",
    },
    {
      id: "surveillance",
      name: "Surveillance",
      icon: "👁️",
      color: "bg-blue-500",
      count: gameState.drones.filter((d) => d.type === "surveillance").length,
      maxCount: 4,
      status: "ready",
    },
    {
      id: "shield",
      name: "Shield",
      icon: "🛡️",
      color: "bg-green-500",
      count: gameState.drones.filter((d) => d.type === "shield").length,
      maxCount: 2,
      status: "ready",
    },
    {
      id: "swarm-coordinator",
      name: "Swarm Coordinator",
      icon: "🐝",
      color: "bg-orange-500",
      count: gameState.drones.filter((d) => d.type === "swarm-coordinator")
        .length,
      maxCount: 1,
      status: "ready",
    },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top Panel - Consolidated Status */}
      <div className="absolute top-4 left-4 right-4 flex justify-between pointer-events-auto">
        {/* Left: Weapons Panel */}
        <div className="bg-black/80 backdrop-blur-sm border border-gray-600 rounded-lg p-3 min-w-[200px]">
          <div className="text-xs font-mono text-gray-300 mb-2">WEAPONS</div>
          <div className="space-y-2">
            {weaponData.map((weapon) => (
              <div
                key={weapon.id}
                className={`flex items-center justify-between p-2 rounded cursor-pointer transition-all ${
                  gameState.selectedWeapon === weapon.id
                    ? "bg-blue-600/30 border border-blue-400"
                    : "bg-gray-800/50 hover:bg-gray-700/50"
                }`}
                onClick={() =>
                  switchWeapon(weapon.id as "kinetic" | "electronic" | "laser")
                }
                title={`${weapon.name} - ${weapon.ammo}/${weapon.maxAmmo} ammo`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{weapon.icon}</span>
                  <span className="text-sm font-mono text-white">
                    {weapon.name}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-300">
                    {weapon.ammo}/{weapon.maxAmmo}
                  </div>
                  {weapon.cooldown > 0 && (
                    <div className="w-16 h-1 bg-gray-600 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-500 transition-all duration-100"
                        style={{
                          width: `${(weapon.cooldown / weapon.maxCooldown) * 100}%`,
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center: Mothership Status */}
        <div className="bg-black/80 backdrop-blur-sm border border-gray-600 rounded-lg p-3 min-w-[200px]">
          <div className="text-xs font-mono text-gray-300 mb-2">MOTHERSHIP</div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Energy:</span>
              <span className="text-green-400">
                {gameState.energy}/{gameState.maxEnergy}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Cooling:</span>
              <span className="text-blue-400">
                {gameState.cooling}/{gameState.maxCooling}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Drones:</span>
              <span className="text-yellow-400">
                {gameState.drones.length}/12
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Threats:</span>
              <span className="text-red-400">{gameState.threats.length}</span>
            </div>
          </div>
        </div>

        {/* Right: Resources & Score */}
        <div className="bg-black/80 backdrop-blur-sm border border-gray-600 rounded-lg p-3 min-w-[200px]">
          <div className="text-xs font-mono text-gray-300 mb-2">RESOURCES</div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Score:</span>
              <span className="text-white font-mono">{gameState.score}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Level:</span>
              <span className="text-purple-400">{gameState.level}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Neutralized:</span>
              <span className="text-green-400">{gameState.neutralized}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">FPS:</span>
              <span className="text-cyan-400">{gameState.frameRate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Panel - Enhanced Controls */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between pointer-events-auto">
        {/* Left: Drone Deployment */}
        <div className="bg-black/80 backdrop-blur-sm border border-gray-600 rounded-lg p-3 min-w-[300px]">
          <div className="text-xs font-mono text-gray-300 mb-2">
            DRONE DEPLOYMENT
          </div>
          <div className="grid grid-cols-2 gap-2">
            {droneData.map((drone) => (
              <button
                key={drone.id}
                className={`flex items-center justify-between p-2 rounded transition-all ${
                  gameState.selectedDroneType === drone.id
                    ? "bg-blue-600/30 border border-blue-400"
                    : "bg-gray-800/50 hover:bg-gray-700/50"
                }`}
                onClick={() =>
                  selectDroneType(
                    drone.id as
                      | "interceptor"
                      | "jammer"
                      | "surveillance"
                      | "shield"
                      | "swarm-coordinator",
                  )
                }
                disabled={drone.count >= drone.maxCount}
                title={`${drone.name} - ${drone.count}/${drone.maxCount} deployed`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{drone.icon}</span>
                  <span className="text-xs font-mono text-white">
                    {drone.name}
                  </span>
                </div>
                <div className="text-xs text-gray-300">
                  {drone.count}/{drone.maxCount}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Center: Environmental & Mission Controls */}
        <div className="bg-black/80 backdrop-blur-sm border border-gray-600 rounded-lg p-3 min-w-[300px]">
          <div className="text-xs font-mono text-gray-300 mb-2">
            ENVIRONMENT
          </div>
          <div className="space-y-2">
            {/* Weather Controls */}
            <div>
              <div className="text-xs text-gray-400 mb-1">Weather:</div>
              <div className="flex space-x-1">
                {["none", "rain", "fog", "night"].map((mode) => (
                  <button
                    key={mode}
                    className={`px-2 py-1 text-xs rounded transition-all ${
                      weatherMode === mode
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                    onClick={() =>
                      setWeatherMode(mode as "none" | "rain" | "fog" | "night")
                    }
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Mission Controls */}
            <div>
              <div className="text-xs text-gray-400 mb-1">Mission:</div>
              <div className="flex space-x-1">
                {[
                  "airport",
                  "military-base",
                  "vip-protection",
                  "border-patrol",
                ].map((mission) => (
                  <button
                    key={mission}
                    className={`px-2 py-1 text-xs rounded transition-all ${
                      missionType === mission
                        ? "bg-green-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                    onClick={() =>
                      setMissionType(
                        mission as
                          | "airport"
                          | "military-base"
                          | "vip-protection"
                          | "border-patrol",
                      )
                    }
                  >
                    {mission
                      .replace("-", " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </button>
                ))}
              </div>
            </div>

            {/* Automation Controls */}
            <div>
              <div className="text-xs text-gray-400 mb-1">Automation:</div>
              <div className="flex space-x-1">
                {["manual", "automated", "hybrid"].map((mode) => (
                  <button
                    key={mode}
                    className={`px-2 py-1 text-xs rounded transition-all ${
                      automationMode === mode
                        ? "bg-purple-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                    onClick={() =>
                      setAutomationMode(
                        mode as "manual" | "automated" | "hybrid",
                      )
                    }
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Game Controls */}
        <div className="bg-black/80 backdrop-blur-sm border border-gray-600 rounded-lg p-3 min-w-[200px]">
          <div className="text-xs font-mono text-gray-300 mb-2">CONTROLS</div>
          <div className="grid grid-cols-2 gap-2">
            <button
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-xs transition-all"
              onClick={toggleRunningState}
            >
              {gameState.isRunning ? "PAUSE" : "RESUME"}
            </button>
            <button
              className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded text-xs transition-all"
              onClick={generateSwarm}
            >
              SWARM
            </button>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-xs transition-all"
              onClick={() => spawnMultipleDrones(5)}
            >
              +5 DRONES
            </button>
            <button
              className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded text-xs transition-all"
              onClick={() => activatePowerUp("energy-boost")}
            >
              POWER-UP
            </button>
            <button
              className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded text-xs transition-all"
              onClick={clearSelection}
            >
              CLEAR SEL
            </button>
            <button
              className="bg-red-800 hover:bg-red-900 text-white px-3 py-2 rounded text-xs transition-all"
              onClick={resetGameState}
            >
              RESET
            </button>
          </div>

          {/* Additional Controls */}
          <div className="mt-2 space-y-1">
            <button
              className={`w-full px-2 py-1 text-xs rounded transition-all ${
                showDeploymentZones
                  ? "bg-yellow-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
              onClick={() => setShowDeploymentZones(!showDeploymentZones)}
            >
              {showDeploymentZones ? "HIDE ZONES" : "SHOW ZONES"}
            </button>

            <button
              className="w-full px-2 py-1 text-xs rounded bg-gray-700 text-gray-300 hover:bg-gray-600 transition-all"
              onClick={() => setShowHelp(!showHelp)}
            >
              {showHelp ? "HIDE HELP" : "SHOW HELP"}
            </button>
          </div>
        </div>
      </div>

      {/* Help Panel */}
      {showHelp && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/90 backdrop-blur-sm border border-gray-600 rounded-lg p-4 max-w-md pointer-events-auto">
          <div className="text-sm font-mono text-white mb-3">
            KEYBOARD SHORTCUTS
          </div>
          <div className="space-y-2 text-xs text-gray-300">
            <div className="flex justify-between">
              <span>Weapon 1-3:</span>
              <span className="text-blue-400">1, 2, 3</span>
            </div>
            <div className="flex justify-between">
              <span>Deploy Drone:</span>
              <span className="text-blue-400">W, A, S, D</span>
            </div>
            <div className="flex justify-between">
              <span>Pause/Resume:</span>
              <span className="text-blue-400">Space</span>
            </div>
            <div className="flex justify-between">
              <span>Generate Swarm:</span>
              <span className="text-blue-400">G</span>
            </div>
            <div className="flex justify-between">
              <span>Fullscreen:</span>
              <span className="text-blue-400">F</span>
            </div>
            <div className="flex justify-between">
              <span>Reset:</span>
              <span className="text-blue-400">R</span>
            </div>
            <div className="flex justify-between">
              <span>Clear Selection:</span>
              <span className="text-blue-400">Escape</span>
            </div>
          </div>
          <button
            className="mt-3 w-full bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded text-xs transition-all"
            onClick={() => setShowHelp(false)}
          >
            CLOSE
          </button>
        </div>
      )}
    </div>
  );
};
