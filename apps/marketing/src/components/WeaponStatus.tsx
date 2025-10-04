import * as React from "react";
import effectorDatabase from "../data/effectorDatabase.json";
import type { GameState } from "../types/game";
import { CooldownMeter } from "./CooldownMeter";
import { InfoPopover } from "./InfoPopover";
import { ROERiskIndicator } from "./ROERiskIndicator";

interface WeaponStatusProps {
  weapons: GameState["weapons"];
  selectedWeapon: GameState["selectedWeapon"];
  onSwitchWeapon: (weaponId: string) => void;
}

const weaponData = {
  kinetic: { name: "Kinetic", icon: "⚡" },
  electronic: { name: "EMP", icon: "🌀" },
  laser: { name: "Laser", icon: "🔴" },
  net: { name: "Net", icon: "🕸️" },
  hpm: { name: "HPM", icon: "📡" },
  rf_take: { name: "RF Takeover", icon: "📶" },
  gnss_deny: { name: "GNSS Denial", icon: "🛰️" },
  optic_dazzle: { name: "Optical Dazzler", icon: "☀️" },
  acoustic: { name: "Acoustic", icon: "🔊" },
  decoy_beacon: { name: "Decoy Beacon", icon: "🏮" },
  chaff: { name: "Chaff", icon: "☁️" },
  smart_slug: { name: "Smart Slug", icon: "🎯" },
  ai_deception: { name: "AI Deception", icon: "🧠" },
};

export const WeaponStatus: React.FC<WeaponStatusProps> = ({
  weapons,
  selectedWeapon,
  onSwitchWeapon,
}) => {
  return (
    <div className="weapon-status-panel">
      <h3 className="weapon-status-title">WEAPON SYSTEMS</h3>
      <nav
        aria-label="Weapon Systems"
        role="radiogroup"
        className="weapon-list"
      >
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

          const handleWeaponClick = () => {
            onSwitchWeapon(id);
          };

          const handleKeyDown = (event: React.KeyboardEvent) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onSwitchWeapon(id);
            }
          };

          // Get effector data from database for enhanced info
          const effectorData = effectorDatabase.effectors.find(
            (e) => e.id === id,
          );

          return (
            <div
              key={id}
              className={`weapon-item-container ${isSelected ? "selected" : ""}`}
            >
              <button
                role="radio"
                aria-checked={isSelected}
                className={`weapon-item ${isSelected ? "selected" : ""}`}
                onClick={handleWeaponClick}
                onKeyDown={handleKeyDown}
                type="button"
                aria-label={`Switch to ${wData.name} weapon`}
              >
                <div className="weapon-header">
                  <div className="weapon-icon">{wData.icon}</div>
                  <div className="weapon-cooldown-meter">
                    <CooldownMeter
                      cooldown={weaponState.cooldown}
                      lastFired={weaponState.lastFired || 0}
                      size="small"
                    />
                  </div>
                </div>

                <div className="weapon-details">
                  <div className="weapon-name">{wData.name}</div>
                  <div className="weapon-specs">
                    <div className="weapon-ammo">
                      {weaponState.ammo} / {weaponState.maxAmmo}
                    </div>
                    {effectorData && (
                      <>
                        <div className="weapon-energy">
                          ⚡ {effectorData.energy}
                        </div>
                        <div className="weapon-range">
                          📏 {effectorData.range}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {effectorData && (
                  <div className="weapon-badges">
                    <ROERiskIndicator
                      riskLevel={effectorData.roe as "low" | "med" | "high"}
                    />
                  </div>
                )}
              </button>

              {effectorData && (
                <div className="weapon-info">
                  <InfoPopover
                    title={effectorData.name}
                    brands={effectorData.brands}
                    sources={effectorData.sources}
                  >
                    <button
                      className="weapon-info-button"
                      aria-label="View weapon details"
                    >
                      ℹ️
                    </button>
                  </InfoPopover>
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
};
