import React from "react";
import { GameState, countermeasures } from "./types";

interface ExternalControlsProps {
  gameState: GameState;
  selectedCountermeasure: string;
  onCountermeasureChange: (countermeasure: string) => void;
  canUseCountermeasure: (countermeasure: string) => boolean;
  onGenerateSwarm: () => void;
  canGenerateSwarm: boolean;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const ExternalControls: React.FC<ExternalControlsProps> = ({
  gameState,
  selectedCountermeasure,
  onCountermeasureChange,
  canUseCountermeasure,
  onGenerateSwarm,
  canGenerateSwarm,
  isFullscreen,
  onToggleFullscreen,
}) => {
  const getCooldownPercent = (countermeasureType: string) => {
    const now = Date.now();
    const cooldownEnd = gameState.countermeasureCooldowns[countermeasureType];
    const countermeasure = countermeasures[countermeasureType];

    if (cooldownEnd <= now) return 0;

    const remaining = cooldownEnd - now;
    const total = countermeasure.cooldown;
    return Math.min(100, (remaining / total) * 100);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
      {/* Countermeasures */}
      <div className="bg-[rgba(0,0,0,0.8)] rounded-lg p-4 border border-[rgba(0,255,136,0.3)]">
        <div className="text-sm text-[var(--primary)] font-bold mb-3">
          Countermeasures:
        </div>
        <div className="space-y-2">
          {Object.entries(countermeasures).map(([key, countermeasure]) => {
            const isSelected = selectedCountermeasure === key;
            const canUse = canUseCountermeasure(key);
            const cooldownPercent = getCooldownPercent(key);
            const ammo = gameState.countermeasureAmmo[key];
            const hasAmmo = countermeasure.ammo === undefined || ammo > 0;

            return (
              <div key={key} className="relative">
                <button
                  onClick={() => onCountermeasureChange(key)}
                  disabled={!canUse}
                  className={`relative w-full px-3 py-2 text-xs rounded font-bold transition-all ${
                    isSelected
                      ? `text-black`
                      : `text-[${countermeasure.color}] border border-[${countermeasure.color}] bg-[rgba(0,0,0,0.3)]`
                  } ${!canUse ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}`}
                  style={{
                    backgroundColor: isSelected
                      ? countermeasure.color
                      : undefined,
                  }}
                >
                  <div className="flex justify-between items-center">
                    <span>
                      {key === "kinetic"
                        ? "Kinetic"
                        : key === "electronic"
                          ? "EW"
                          : "Laser"}
                    </span>
                    <div className="flex items-center gap-1 text-xs">
                      <span>R:{countermeasure.range}</span>
                      {countermeasure.ammo !== undefined && (
                        <span
                          className={
                            hasAmmo ? "text-green-400" : "text-red-400"
                          }
                        >
                          {ammo}/{countermeasure.ammo}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Cooldown overlay */}
                  {cooldownPercent > 0 && (
                    <div
                      className="absolute inset-0 bg-red-500 opacity-30 rounded transition-all"
                      style={{ width: `${cooldownPercent}%` }}
                    />
                  )}
                </button>

                {/* Auto-trigger indicator */}
                {countermeasure.autoTrigger && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full text-xs flex items-center justify-center">
                    A
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {/* Game Controls */}
      <div className="bg-[rgba(0,0,0,0.8)] rounded-lg p-4 border border-[rgba(0,255,136,0.3)]">
        <div className="text-sm text-[var(--primary)] font-bold mb-3">
          Game Controls:
        </div>
        <div className="space-y-3">
          <button
            onClick={() => {
              console.log("Swarm button clicked!", { canGenerateSwarm });
              onGenerateSwarm();
            }}
            disabled={!canGenerateSwarm}
            className={`w-full px-4 py-2 rounded font-bold text-sm transition-all ${
              canGenerateSwarm
                ? "bg-gradient-to-r from-red-500 to-orange-500 text-white hover:scale-105 hover:shadow-lg"
                : "bg-gray-600 text-gray-400 cursor-not-allowed opacity-50"
            }`}
            title="Generate a coordinated swarm attack"
          >
            <div className="flex items-center justify-center gap-2">
              <span className="text-lg">🐝</span>
              <span>Generate Swarm</span>
            </div>
          </button>
          <button
            onClick={() => {
              console.log("Fullscreen button clicked!", { isFullscreen });
              onToggleFullscreen();
            }}
            className="w-full px-4 py-2 rounded font-bold text-sm bg-[var(--primary)] text-[var(--dark)] hover:scale-105 transition-all"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            <div className="flex items-center justify-center gap-2">
              {isFullscreen ? "📤" : "📱"}
              <span>
                {isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              </span>
            </div>
          </button>
        </div>
        <div className="text-xs text-orange-400 mt-2 text-center">
          Swarm spawns 3-5 coordinated attackers
        </div>
        <div className="mt-2 text-xs text-gray-400">
          Debug: Active: {gameState.activeThreats} / Max: {gameState.maxThreats}{" "}
          | Can Generate: {canGenerateSwarm ? "Yes" : "No"}
        </div>
      </div>

      {/* Game Stats */}
      <div className="bg-[rgba(0,0,0,0.8)] rounded-lg p-4 border border-[rgba(0,255,136,0.3)]">
        <div className="text-sm text-[var(--primary)] font-bold mb-3 flex items-center">
          <span className="text-lg mr-2">🎯</span>
          Defense System
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-white">Threats Active:</span>
            <span className="text-red-400 font-bold">
              {gameState.activeThreats}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-green-400">Neutralized:</span>
            <span className="text-green-400 font-bold">
              {gameState.neutralizedCount}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-yellow-400">Score:</span>
            <span className="text-yellow-400 font-bold">{gameState.score}</span>
          </div>
          <div className="flex justify-between border-t border-[rgba(0,255,136,0.2)] pt-2">
            <span className="text-blue-400">Level:</span>
            <span className="text-blue-400 font-bold">
              {gameState.gameLevel}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
