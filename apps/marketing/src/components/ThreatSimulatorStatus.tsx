import * as React from "react";
import type { GameState } from "../types/game";

interface ThreatSimulatorStatusProps {
  gameState: GameState;
  isFullscreen: boolean;
  showFullscreenPrompt: boolean;
  onEnterFullscreen: () => void;
  onExitFullscreen: () => void;
}

export const ThreatSimulatorStatus: React.FC<ThreatSimulatorStatusProps> = ({
  gameState,
  isFullscreen,
  showFullscreenPrompt,
  onEnterFullscreen,
  onExitFullscreen,
}) => {
  const [showDetailedStats, setShowDetailedStats] = React.useState(false);

  // Calculate performance metrics
  const performanceMetrics = {
    fps: gameState.frameRate,
    threatsPerSecond: gameState.threats.length / (gameState.gameTime / 1000),
    neutralizationRate: gameState.neutralized / (gameState.gameTime / 1000),
    efficiency:
      gameState.neutralized /
      Math.max(gameState.threats.length + gameState.neutralized, 1),
  };

  // Calculate resource efficiency
  const resourceEfficiency = {
    energy: (gameState.energy / gameState.maxEnergy) * 100,
    cooling: (gameState.cooling / gameState.maxCooling) * 100,
    droneUtilization: (gameState.drones.length / 12) * 100,
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Fullscreen Prompt */}
      {showFullscreenPrompt && !isFullscreen && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center pointer-events-auto">
          <div className="bg-gray-900 border border-gray-600 rounded-lg p-6 max-w-md text-center">
            <div className="text-2xl mb-4">🎮</div>
            <h3 className="text-xl font-bold text-white mb-2">
              Enter Fullscreen for Optimal Experience
            </h3>
            <p className="text-gray-300 mb-4">
              The threat simulation requires fullscreen mode for the best
              tactical experience.
            </p>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all"
              onClick={onEnterFullscreen}
            >
              Enter Fullscreen
            </button>
          </div>
        </div>
      )}

      {/* Top Status Bar */}
      <div className="absolute top-0 left-0 right-0 bg-black/60 backdrop-blur-sm border-b border-gray-600 pointer-events-auto">
        <div className="flex items-center justify-between px-4 py-2">
          {/* Left: Game Status */}
          <div className="flex items-center space-x-4">
            <div
              className={`px-3 py-1 rounded-full text-xs font-mono ${
                gameState.isRunning
                  ? "bg-green-600 text-white"
                  : "bg-red-600 text-white"
              }`}
            >
              {gameState.isRunning ? "ACTIVE" : "PAUSED"}
            </div>

            <div className="text-sm text-gray-300">
              Level {gameState.level} | Score:{" "}
              {gameState.score.toLocaleString()}
            </div>
          </div>

          {/* Center: Mission Info */}
          <div className="text-center">
            <div className="text-sm font-mono text-white">
              {gameState.missionType.replace("-", " ").toUpperCase()}
            </div>
            <div className="text-xs text-gray-400">
              {gameState.automationMode.toUpperCase()} MODE
            </div>
          </div>

          {/* Right: Controls */}
          <div className="flex items-center space-x-2">
            <button
              className="text-xs text-gray-400 hover:text-white transition-colors"
              onClick={() => setShowDetailedStats(!showDetailedStats)}
            >
              {showDetailedStats ? "HIDE STATS" : "SHOW STATS"}
            </button>

            {isFullscreen ? (
              <button
                className="text-xs text-gray-400 hover:text-white transition-colors"
                onClick={onExitFullscreen}
              >
                EXIT FULLSCREEN
              </button>
            ) : (
              <button
                className="text-xs text-gray-400 hover:text-white transition-colors"
                onClick={onEnterFullscreen}
              >
                ENTER FULLSCREEN
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Detailed Statistics Panel */}
      {showDetailedStats && (
        <div className="absolute top-12 right-4 bg-black/90 backdrop-blur-sm border border-gray-600 rounded-lg p-4 min-w-[300px] pointer-events-auto">
          <div className="text-sm font-mono text-white mb-3">
            PERFORMANCE METRICS
          </div>

          <div className="space-y-3">
            {/* Performance Stats */}
            <div>
              <div className="text-xs text-gray-400 mb-1">Performance</div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">FPS:</span>
                  <span
                    className={`${
                      performanceMetrics.fps >= 60
                        ? "text-green-400"
                        : performanceMetrics.fps >= 30
                          ? "text-yellow-400"
                          : "text-red-400"
                    }`}
                  >
                    {performanceMetrics.fps}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Threats/sec:</span>
                  <span className="text-blue-400">
                    {performanceMetrics.threatsPerSecond.toFixed(1)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Neutralization Rate:</span>
                  <span className="text-green-400">
                    {performanceMetrics.neutralizationRate.toFixed(1)}/sec
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Efficiency:</span>
                  <span className="text-purple-400">
                    {(performanceMetrics.efficiency * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Resource Efficiency */}
            <div>
              <div className="text-xs text-gray-400 mb-1">
                Resource Efficiency
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Energy:</span>
                  <span
                    className={`${
                      resourceEfficiency.energy > 80
                        ? "text-green-400"
                        : resourceEfficiency.energy > 50
                          ? "text-yellow-400"
                          : "text-red-400"
                    }`}
                  >
                    {resourceEfficiency.energy.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Cooling:</span>
                  <span
                    className={`${
                      resourceEfficiency.cooling > 80
                        ? "text-green-400"
                        : resourceEfficiency.cooling > 50
                          ? "text-yellow-400"
                          : "text-red-400"
                    }`}
                  >
                    {resourceEfficiency.cooling.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Drone Utilization:</span>
                  <span
                    className={`${
                      resourceEfficiency.droneUtilization > 80
                        ? "text-green-400"
                        : resourceEfficiency.droneUtilization > 50
                          ? "text-yellow-400"
                          : "text-red-400"
                    }`}
                  >
                    {resourceEfficiency.droneUtilization.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Threat Analysis */}
            <div>
              <div className="text-xs text-gray-400 mb-1">Threat Analysis</div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Active Threats:</span>
                  <span className="text-red-400">
                    {gameState.threats.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Neutralized:</span>
                  <span className="text-green-400">
                    {gameState.neutralized}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Priority Threats:</span>
                  <span className="text-yellow-400">
                    {Object.keys(gameState.priorityThreats || {}).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Selected:</span>
                  <span className="text-blue-400">
                    {gameState.selectedThreats.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Weather & Environment */}
            <div>
              <div className="text-xs text-gray-400 mb-1">Environment</div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Weather:</span>
                  <span className="text-cyan-400 capitalize">
                    {gameState.weatherMode}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Mission:</span>
                  <span className="text-orange-400 capitalize">
                    {gameState.missionType.replace("-", " ")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Automation:</span>
                  <span className="text-purple-400 capitalize">
                    {gameState.automationMode}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <button
            className="mt-3 w-full bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded text-xs transition-all"
            onClick={() => setShowDetailedStats(false)}
          >
            CLOSE
          </button>
        </div>
      )}

      {/* Bottom Status Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm border-t border-gray-600 pointer-events-auto">
        <div className="flex items-center justify-between px-4 py-2">
          {/* Left: Resource Bars */}
          <div className="flex items-center space-x-4">
            {/* Energy Bar */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-400">Energy:</span>
              <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    gameState.energy > gameState.maxEnergy * 0.5
                      ? "bg-green-500"
                      : gameState.energy > gameState.maxEnergy * 0.2
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}
                  style={{
                    width: `${(gameState.energy / gameState.maxEnergy) * 100}%`,
                  }}
                />
              </div>
              <span className="text-xs text-white">
                {Math.round(gameState.energy)}/{gameState.maxEnergy}
              </span>
            </div>

            {/* Cooling Bar */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-400">Cooling:</span>
              <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    gameState.cooling > gameState.maxCooling * 0.5
                      ? "bg-blue-500"
                      : gameState.cooling > gameState.maxCooling * 0.2
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}
                  style={{
                    width: `${(gameState.cooling / gameState.maxCooling) * 100}%`,
                  }}
                />
              </div>
              <span className="text-xs text-white">
                {Math.round(gameState.cooling)}/{gameState.maxCooling}
              </span>
            </div>
          </div>

          {/* Center: Game Time */}
          <div className="text-center">
            <div className="text-sm font-mono text-white">
              {Math.floor(gameState.gameTime / 1000)}s
            </div>
            <div className="text-xs text-gray-400">Game Time</div>
          </div>

          {/* Right: Quick Stats */}
          <div className="flex items-center space-x-4 text-xs">
            <div className="text-gray-300">
              Threats:{" "}
              <span className="text-red-400">{gameState.threats.length}</span>
            </div>
            <div className="text-gray-300">
              Drones:{" "}
              <span className="text-blue-400">
                {gameState.drones.length}/12
              </span>
            </div>
            <div className="text-gray-300">
              Neutralized:{" "}
              <span className="text-green-400">{gameState.neutralized}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
