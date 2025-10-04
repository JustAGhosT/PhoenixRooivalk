import React, { useState } from 'react';
import { RESEARCH_CATEGORIES, ResourceManager } from './utils/resourceManager';

interface ResearchPanelProps {
  resourceManager: ResourceManager;
  onClose: () => void;
}

export const ResearchPanel: React.FC<ResearchPanelProps> = ({
  resourceManager,
  onClose,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'effector' | 'drone'>('effector');
  const [selectedResearch, setSelectedResearch] = useState<string | null>(null);

  const state = resourceManager.getState();
  const availableResearch = resourceManager.getAvailableResearch();
  const currentResearch = resourceManager.getResearchProgress();

  const handleStartResearch = (type: string) => {
    if (resourceManager.startResearch(type, selectedCategory)) {
      setSelectedResearch(type);
    }
  };

  const handleUnlockDirect = (type: string) => {
    if (selectedCategory === 'effector') {
      resourceManager.unlockEffector(type);
    } else {
      resourceManager.unlockDrone(type);
    }
  };

  const filteredResearch = availableResearch.filter(
    item => item.category === selectedCategory
  );

  return (
    <div className="research-panel-overlay">
      <div className="research-panel">
        <div className="research-panel-header">
          <h3>Research & Development</h3>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="research-resources">
          <div className="resource-display">
            <span className="resource-label">Tokens:</span>
            <span className="resource-value">{state.tokens}</span>
          </div>
          <div className="resource-display">
            <span className="resource-label">Research Points:</span>
            <span className="resource-value">{state.researchPoints}</span>
          </div>
        </div>

        {currentResearch && (
          <div className="current-research">
            <h4>Active Research</h4>
            <div className="research-item">
              <div className="research-info">
                <span className="research-name">{currentResearch.name}</span>
                <span className="research-description">{currentResearch.description}</span>
              </div>
              <div className="research-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ 
                      width: `${(currentResearch.progress / currentResearch.target) * 100}%` 
                    }}
                  />
                </div>
                <span className="progress-text">
                  {currentResearch.progress}/{currentResearch.target}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="research-categories">
          <button
            className={`category-button ${selectedCategory === 'effector' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('effector')}
          >
            {RESEARCH_CATEGORIES.effector.icon} {RESEARCH_CATEGORIES.effector.name}
          </button>
          <button
            className={`category-button ${selectedCategory === 'drone' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('drone')}
          >
            {RESEARCH_CATEGORIES.drone.icon} {RESEARCH_CATEGORIES.drone.name}
          </button>
        </div>

        <div className="research-options">
          <h4>
            {selectedCategory === 'effector' ? 'Weapon Systems' : 'Drone Types'}
          </h4>
          <div className="research-list">
            {filteredResearch.map((item) => (
              <div key={item.type} className="research-option">
                <div className="research-option-header">
                  <h5>{item.name}</h5>
                  <div className="research-costs">
                    <span className="cost-item">
                      🔬 {item.researchCost} RP
                    </span>
                    <span className="cost-item">
                      🪙 {item.unlockCost} Tokens
                    </span>
                  </div>
                </div>
                <p className="research-option-description">{item.description}</p>
                <div className="research-option-actions">
                  <button
                    className="action-button research-button"
                    onClick={() => handleStartResearch(item.type)}
                    disabled={state.activeResearch !== null || state.researchPoints < item.researchCost}
                  >
                    Start Research
                  </button>
                  <button
                    className="action-button unlock-button"
                    onClick={() => handleUnlockDirect(item.type)}
                    disabled={state.tokens < item.unlockCost}
                  >
                    Unlock Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="research-help">
          <h4>How Research Works</h4>
          <ul>
            <li>Research Points (RP) are earned through gameplay performance</li>
            <li>Start research to gradually unlock new technologies</li>
            <li>Or spend tokens to unlock immediately</li>
            <li>Only one research project can be active at a time</li>
            <li>Unlocked technologies become available for deployment</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
