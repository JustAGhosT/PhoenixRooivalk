import React from "react";
import { countermeasures, GameState } from "./types";

interface CountermeasureSelectorProps {
  selectedCountermeasure: string;
  onCountermeasureChange: (countermeasure: string) => void;
  gameState: GameState;
  canUseCountermeasure: (countermeasure: string) => boolean;
}

export const CountermeasureSelector: React.FC<CountermeasureSelectorProps> = ({
  selectedCountermeasure,
  onCountermeasureChange,
  gameState,
  canUseCountermeasure,
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
    <div className="absolute top-4 left-4 bg-[rgba(0,0,0,0.8)] rounded-lg p-3 border border-[rgba(0,255,136,0.3)]">
      <div className="text-xs text-[var(--primary)] font-bold mb-2">
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
                        className={hasAmmo ? "text-green-400" : "text-red-400"}
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
  );
};
