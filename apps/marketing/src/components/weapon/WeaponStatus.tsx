import * as React from "react";
import effectorDatabase from "../../data/effectorDatabase.json";
import type { GameState } from "../../types/game";
import { InfoPopover } from "../InfoPopover";
import { ROERiskIndicator } from "../ROERiskIndicator";
import { CooldownMeter } from "../stats/CooldownMeter";
import styles from "./WeaponStatus.module.css";

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
    <div className={styles.panel}>
      <h3 className={styles.title}>WEAPON SYSTEMS</h3>
      <nav
        aria-label="Weapon Systems"
        role="radiogroup"
        className={styles.list}
      >
        {Object.entries(weapons).map(([id, weaponState]) => {
          const wData = weaponData[id as keyof typeof weaponData];

          // Defensive check for missing weapon data
          if (!wData) {
            console.warn(`Weapon data not found for weapon ID: ${id}`);
            return (
              <div
                key={id}
                className={`${styles.item} ${styles.disabled}`}
                title="Unknown weapon type"
              >
                <div className={styles.icon}>❓</div>
                <div className={styles.details}>
                  <div className={styles.name}>Unknown Weapon</div>
                  <div className={styles.ammo}>
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
              className={`${styles.itemContainer} ${isSelected ? styles.selected : ""}`}
            >
              <button
                role="radio"
                aria-checked={isSelected}
                className={`${styles.item} ${isSelected ? styles.selected : ""}`}
                onClick={handleWeaponClick}
                onKeyDown={handleKeyDown}
                type="button"
                aria-label={`Switch to ${wData.name} weapon`}
              >
                <div className={styles.header}>
                  <div className={styles.icon}>{wData.icon}</div>
                  <div className={styles.cooldownMeter}>
                    <CooldownMeter
                      cooldown={weaponState.cooldown}
                      lastFired={weaponState.lastFired || 0}
                      size="small"
                    />
                  </div>
                </div>

                <div className={styles.details}>
                  <div className={styles.name}>{wData.name}</div>
                  <div className={styles.specs}>
                    <div className={styles.ammo}>
                      {weaponState.ammo} / {weaponState.maxAmmo}
                    </div>
                    {effectorData && (
                      <>
                        <div className={styles.energy}>
                          ⚡ {effectorData.energy}
                        </div>
                        <div className={styles.range}>
                          📏 {effectorData.range}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {effectorData && (
                  <div className={styles.badges}>
                    <ROERiskIndicator
                      riskLevel={effectorData.roe as "low" | "med" | "high"}
                    />
                  </div>
                )}
              </button>

              {effectorData && (
                <div className={styles.info}>
                  <InfoPopover
                    title={effectorData.name}
                    brands={effectorData.brands}
                    sources={effectorData.sources}
                  >
                    <button
                      className={styles.infoButton}
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
