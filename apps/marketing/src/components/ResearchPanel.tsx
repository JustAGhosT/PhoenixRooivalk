import React, { useState } from "react";
import effectorDatabase from "../data/effectorDatabase.json";
import { FilterChip, FilterChips } from "./FilterChips";
import { InfoPopover } from "./InfoPopover";
import { LegalBadge } from "./LegalBadge";
import { ROERiskIndicator } from "./ROERiskIndicator";
import { RESEARCH_CATEGORIES, ResourceManager } from "./utils/resourceManager";
import styles from "./ResearchPanel.module.css";

interface ResearchPanelProps {
  resourceManager: ResourceManager;
  onClose: () => void;
}

export const ResearchPanel: React.FC<ResearchPanelProps> = ({
  resourceManager,
  onClose,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<
    "effector" | "drone"
  >("effector");
  const [_selectedResearch, setSelectedResearch] = useState<string | null>(
    null,
  );
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [acknowledgedLegal, setAcknowledgedLegal] = useState<Set<string>>(
    new Set(),
  );

  const state = resourceManager.getState();
  const availableResearch = resourceManager.getAvailableResearch();
  const currentResearch = resourceManager.getResearchProgress();

  const handleStartResearch = (type: string) => {
    if (resourceManager.startResearch(type, selectedCategory)) {
      setSelectedResearch(type);
    }
  };

  const handleUnlockDirect = (type: string) => {
    if (selectedCategory === "effector") {
      resourceManager.unlockEffector(type);
    } else {
      resourceManager.unlockDrone(type);
    }
  };

  // Create filter chips for effector classes
  const effectorFilters: FilterChip[] = [
    { id: "hard_kill", label: "Hard Kill", color: "#2ED573" },
    { id: "soft_kill", label: "Soft Kill", color: "#FFA502" },
    { id: "deception", label: "Deception", color: "#70A1FF" },
    { id: "denial", label: "Denial", color: "#ECCC68" },
    { id: "capture", label: "Capture", color: "#10b981" },
    { id: "directed", label: "Directed", color: "#f97316" },
    { id: "ecm", label: "ECM", color: "#8b5cf6" },
    { id: "nonkinetic", label: "Non-Kinetic", color: "#84cc16" },
    { id: "countermeasure", label: "Countermeasure", color: "#6b7280" },
    { id: "kinetic", label: "Kinetic", color: "#dc2626" },
  ];

  const filteredResearch = availableResearch.filter((item) => {
    if (item.category !== selectedCategory) return false;

    if (selectedCategory === "effector" && selectedFilters.length > 0) {
      // Find the effector data to check its class
      const effectorData = effectorDatabase.effectors.find(
        (e) => e.id === item.type,
      );
      if (effectorData) {
        return selectedFilters.includes(effectorData.class);
      }
    }

    return true;
  });

  return (
    <div className={styles.overlay}>
      <div className={styles.panel}>
        <div className={styles.header}>
          <h3>Research & Development</h3>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.resources}>
          <div className={styles.resourceDisplay}>
            <span className={styles.resourceLabel}>Tokens:</span>
            <span className={styles.resourceValue}>{state.tokens}</span>
          </div>
          <div className={styles.resourceDisplay}>
            <span className={styles.resourceLabel}>Research Points:</span>
            <span className={styles.resourceValue}>{state.researchPoints}</span>
          </div>
        </div>

        {currentResearch && (
          <div className={styles.currentResearch}>
            <h4>Active Research</h4>
            <div className={styles.item}>
              <div className={styles.info}>
                <span className={styles.name}>{currentResearch.name}</span>
                <span className={styles.description}>
                  {currentResearch.description}
                </span>
              </div>
              <div className={styles.progress}>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{
                      width: `${(currentResearch.progress / currentResearch.target) * 100}%`,
                    }}
                  />
                </div>
                <span className={styles.progressText}>
                  {currentResearch.progress}/{currentResearch.target}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className={styles.categories}>
          <button
            className={`${styles.categoryButton} ${selectedCategory === "effector" ? styles.active : ""}`}
            onClick={() => setSelectedCategory("effector")}
          >
            {RESEARCH_CATEGORIES.effector.icon}{" "}
            {RESEARCH_CATEGORIES.effector.name}
          </button>
          <button
            className={`${styles.categoryButton} ${selectedCategory === "drone" ? styles.active : ""}`}
            onClick={() => setSelectedCategory("drone")}
          >
            {RESEARCH_CATEGORIES.drone.icon} {RESEARCH_CATEGORIES.drone.name}
          </button>
        </div>

        {selectedCategory === "effector" && (
          <FilterChips
            chips={effectorFilters}
            selectedFilters={selectedFilters}
            onFilterChange={setSelectedFilters}
          />
        )}

        <div className={styles.options}>
          <h4>
            {selectedCategory === "effector" ? "Weapon Systems" : "Drone Types"}
          </h4>
          <div className={styles.list}>
            {filteredResearch.map((item) => {
              const effectorData = effectorDatabase.effectors.find(
                (e) => e.id === item.type,
              );
              const isLegalAcknowledged = acknowledgedLegal.has(item.type);

              return (
                <div key={item.type} className={styles.option}>
                  <div className={styles.optionHeader}>
                    <div className={styles.optionTitle}>
                      <h5>{item.name}</h5>
                      <div className={styles.optionBadges}>
                        {effectorData && (
                          <>
                            <ROERiskIndicator
                              riskLevel={
                                effectorData.roe as "low" | "med" | "high"
                              }
                            />
                            {effectorData.legal_flags &&
                              effectorData.legal_flags.length > 0 && (
                                <LegalBadge
                                  legalFlags={effectorData.legal_flags}
                                  onAcknowledge={() => {
                                    setAcknowledgedLegal(
                                      (prev) => new Set([...prev, item.type]),
                                    );
                                  }}
                                />
                              )}
                          </>
                        )}
                      </div>
                    </div>
                    <div className={styles.costs}>
                      <span className={styles.costItem}>
                        🔬 {item.researchCost} RP
                      </span>
                      <span className={styles.costItem}>
                        🪙 {item.unlockCost} Tokens
                      </span>
                      {effectorData && (
                        <>
                          <span className={styles.costItem}>
                            ⚡ {effectorData.energy} Energy
                          </span>
                          <span className={styles.costItem}>
                            ⏱️ {(effectorData.cooldown || 0) / 1000}s Cooldown
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className={styles.optionContent}>
                    <p className={styles.optionDescription}>
                      {item.description}
                    </p>

                    {effectorData && (
                      <div className={styles.optionDetails}>
                        <InfoPopover
                          title={effectorData.name}
                          brands={effectorData.brands}
                          sources={effectorData.sources}
                        >
                          <button
                            className={styles.infoButton}
                            aria-label="View real-world analogues"
                          >
                            ℹ️ Real-World Info
                          </button>
                        </InfoPopover>

                        <div className={styles.optionSpecs}>
                          <span>Range: {effectorData.range}</span>
                          <span>Class: {effectorData.class}</span>
                          {effectorData.collateral_risk && (
                            <span>Risk: {effectorData.collateral_risk}</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className={styles.optionActions}>
                    <button
                      className={`${styles.actionButton} ${styles.researchButton}`}
                      onClick={() => handleStartResearch(item.type)}
                      disabled={
                        state.activeResearch !== null ||
                        state.researchPoints < item.researchCost ||
                        (effectorData?.legal_flags &&
                          effectorData.legal_flags.length > 0 &&
                          !isLegalAcknowledged)
                      }
                    >
                      Start Research
                    </button>
                    <button
                      className={`${styles.actionButton} ${styles.unlockButton}`}
                      onClick={() => handleUnlockDirect(item.type)}
                      disabled={
                        state.tokens < item.unlockCost ||
                        (effectorData?.legal_flags &&
                          effectorData.legal_flags.length > 0 &&
                          !isLegalAcknowledged)
                      }
                    >
                      Unlock Now
                    </button>
                  </div>

                  {effectorData?.legal_flags &&
                    effectorData.legal_flags.length > 0 &&
                    !isLegalAcknowledged && (
                      <div className={styles.optionWarning}>
                        ⚠️ Legal compliance requirements must be acknowledged
                        before use
                      </div>
                    )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="research-help">
          <h4>How Research Works</h4>
          <ul>
            <li>
              Research Points (RP) are earned through gameplay performance
            </li>
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
