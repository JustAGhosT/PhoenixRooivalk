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
          const isSelected = selectedWeapon === id;
          const cooldownPercentage =
            weaponState.cooldown > 0
              ? (weaponState.cooldown / weaponState.maxCooldown) * 100
              : 0;

          return (
            <div
              key={id}
              className={`weapon-item ${isSelected ? "selected" : ""}`}
              onClick={() => onSwitchWeapon(id)}
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
            </div>
          );
        })}
      </div>
    </div>
  );
};
