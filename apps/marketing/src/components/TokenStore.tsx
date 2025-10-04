import React from 'react';
import { ResourceManager } from './utils/resourceManager';

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
    <div className="token-store-overlay">
      <div className="token-store">
        <div className="token-store-header">
          <h3>Token Store</h3>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="token-balance">
          <span className="balance-label">Available Tokens:</span>
          <span className="balance-value">🪙 {state.tokens}</span>
        </div>

        <div className="store-section">
          <h4>Deploy Drones</h4>
          <p className="store-description">
            Purchase additional drones for deployment. You can only deploy drones you have researched.
          </p>
          
          <div className="drone-purchase-list">
            {unlockedDrones.map((type) => {
              const droneData = resourceManager.getDroneData(type);
              if (!droneData) return null;

              return (
                <div key={type} className="drone-purchase-item">
                  <div className="drone-info">
                    <h5>{droneData.name}</h5>
                    <p className="drone-role">{droneData.role}</p>
                    <p className="drone-description">{droneData.notes}</p>
                  </div>
                  <div className="drone-purchase-actions">
                    <div className="drone-cost">
                      🪙 {droneData.tokenCost} Tokens
                    </div>
                    <button
                      className="purchase-button"
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

        <div className="store-section">
          <h4>Earn Tokens</h4>
          <div className="token-earning-methods">
            <div className="earning-method">
              <span className="earning-icon">🎯</span>
              <div className="earning-info">
                <span className="earning-title">Neutralize Threats</span>
                <span className="earning-amount">+5 tokens per threat</span>
              </div>
            </div>
            <div className="earning-method">
              <span className="earning-icon">🏆</span>
              <div className="earning-info">
                <span className="earning-title">Complete Waves</span>
                <span className="earning-amount">+25 tokens per wave</span>
              </div>
            </div>
            <div className="earning-method">
              <span className="earning-icon">⭐</span>
              <div className="earning-info">
                <span className="earning-title">High Scores</span>
                <span className="earning-amount">+1 token per 100 points</span>
              </div>
            </div>
          </div>
        </div>

        <div className="store-help">
          <h4>Tips</h4>
          <ul>
            <li>Focus on neutralizing threats efficiently to earn more tokens</li>
            <li>Complete waves for bonus token rewards</li>
            <li>Research new drone types to unlock more purchase options</li>
            <li>Balance your drone purchases with your tactical needs</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
