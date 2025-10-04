import * as React from "react";
import type { GameState } from "../types/game";

interface WeaponStatusProps {
  weapons: GameState["weapons"];
  selectedWeapon: GameState["selectedWeapon"];
  onSwitchWeapon: (weaponId: string) => void;
}

const weaponData = {
  kinetic: { name: "Kinetic", icon: "⚡" },
  electronic: { name: "EMP", icon: "🌀" },
  laser: { name: "Laser", icon: "🔴" },
};

export const WeaponStatus: React.FC<WeaponStatusProps> = ({
  weapons,
  selectedWeapon,
  onSwitchWeapon,
}) => {
  return (
    <div className="weapon-status-panel">
      <h3 className="weapon-status-title">WEAPON SYSTEMS</h3>
      <div className="weapon-list">
        {Object.entries(weapons).map(([id, weaponState]) => {
          const wData = weaponData[id as keyof typeof weaponData];

          // Defensive check for missing weapon data
          if (!wData) {
            console.warn(`Weapon data not found for weapon ID: ${id}`);
            return (
              <div
                key={id}
                className="weapon-item disabled"
                title="Unknown weapon type"
              >
                <div className="weapon-icon">❓</div>
                <div className="weapon-details">
                  <div className="weapon-name">Unknown Weapon</div>
                  <div className="weapon-ammo">
                    {weaponState.ammo} / {weaponState.maxAmmo}
                  </div>
                </div>
              </div>
            );
          }

          const isSelected = selectedWeapon === id;
          // Calculate cooldown percentage based on weapon data
          const cooldownPercentage = weaponState.cooldown > 0 ? 100 : 0;

          const handleWeaponClick = () => {
            onSwitchWeapon(id);
          };

          const handleKeyDown = (event: React.KeyboardEvent) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onSwitchWeapon(id);
            }
          };

          return (
            <button
              key={id}
              className={`weapon-item ${isSelected ? "selected" : ""}`}
              onClick={handleWeaponClick}
              onKeyDown={handleKeyDown}
              type="button"
              aria-label={`Switch to ${wData.name} weapon`}
            >
              <div className="weapon-icon">{wData.icon}</div>
              <div className="weapon-details">
                <div className="weapon-name">{wData.name}</div>
                <div className="weapon-ammo">
                  {weaponState.ammo} / {weaponState.maxAmmo}
                </div>
              </div>
              {cooldownPercentage > 0 && (
                <div className="weapon-cooldown-bar">
                  <div
                    className="cooldown-progress"
                    style={{ width: `${cooldownPercentage}%` }}
                  />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
