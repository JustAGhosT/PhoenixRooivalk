import React from "react";
import { ResourceManager } from "../utils/resourceManager";
import styles from "./TokenStore.module.css";

interface TokenStoreProps {
  resourceManager: ResourceManager;
  onClose: () => void;
  onPurchaseDrone: (type: string) => void;
}

export const TokenStore: React.FC<TokenStoreProps> = ({
  resourceManager,
  onClose,
  onPurchaseDrone,
}) => {
  const state = resourceManager.getState();
  const unlockedDrones = state.unlockedDrones;

  const handlePurchaseDrone = (type: string) => {
    if (resourceManager.purchaseDrone(type)) {
      onPurchaseDrone(type);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.store}>
        <div className={styles.header}>
          <h3>Token Store</h3>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.balance}>
          <span className={styles.balanceLabel}>Available Tokens:</span>
          <span className={styles.balanceValue}>🪙 {state.tokens}</span>
        </div>

        <div className={styles.section}>
          <h4>Deploy Drones</h4>
          <p className={styles.description}>
            Purchase additional drones for deployment. You can only deploy
            drones you have researched.
          </p>

          <div className={styles.purchaseList}>
            {unlockedDrones.map((type) => {
              const droneData = resourceManager.getDroneData(type);
              if (!droneData) return null;

              return (
                <div key={type} className={styles.purchaseItem}>
                  <div className={styles.droneInfo}>
                    <h5>{droneData.name}</h5>
                    <p className={styles.droneRole}>{droneData.role}</p>
                    <p className={styles.droneDescription}>{droneData.notes}</p>
                  </div>
                  <div className={styles.purchaseActions}>
                    <div className={styles.droneCost}>
                      🪙 {droneData.tokenCost} Tokens
                    </div>
                    <button
                      className={styles.purchaseButton}
                      onClick={() => handlePurchaseDrone(type)}
                      disabled={state.tokens < droneData.tokenCost}
                    >
                      Purchase
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.section}>
          <h4>Earn Tokens</h4>
          <div className={styles.earningMethods}>
            <div className={styles.earningMethod}>
              <span className={styles.earningIcon}>🎯</span>
              <div className={styles.earningInfo}>
                <span className={styles.earningTitle}>Neutralize Threats</span>
                <span className={styles.earningAmount}>
                  +5 tokens per threat
                </span>
              </div>
            </div>
            <div className={styles.earningMethod}>
              <span className={styles.earningIcon}>🏆</span>
              <div className={styles.earningInfo}>
                <span className={styles.earningTitle}>Complete Waves</span>
                <span className={styles.earningAmount}>
                  +25 tokens per wave
                </span>
              </div>
            </div>
            <div className={styles.earningMethod}>
              <span className={styles.earningIcon}>⭐</span>
              <div className={styles.earningInfo}>
                <span className={styles.earningTitle}>High Scores</span>
                <span className={styles.earningAmount}>
                  +1 token per 100 points
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.help}>
          <h4>Tips</h4>
          <ul>
            <li>
              Focus on neutralizing threats efficiently to earn more tokens
            </li>
            <li>Complete waves for bonus token rewards</li>
            <li>Research new drone types to unlock more purchase options</li>
            <li>Balance your drone purchases with your tactical needs</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
