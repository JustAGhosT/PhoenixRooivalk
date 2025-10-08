import React, { useState } from "react";
import styles from "./LegalBadge.module.css";

interface LegalBadgeProps {
  legalFlags: string[];
  onAcknowledge?: () => void;
  className?: string;
}

export const LegalBadge: React.FC<LegalBadgeProps> = ({
  legalFlags,
  onAcknowledge,
  className = "",
}) => {
  const [acknowledged, setAcknowledged] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  if (legalFlags.length === 0) {
    return null;
  }

  const handleAcknowledge = () => {
    setAcknowledged(true);
    onAcknowledge?.();
  };

  const getRiskLevel = (flags: string[]): "low" | "medium" | "high" => {
    if (
      flags.some(
        (flag) => flag.includes("ITAR") || flag.includes("Export-controlled"),
      )
    ) {
      return "high";
    }
    if (
      flags.some(
        (flag) => flag.includes("Spectrum") || flag.includes("Eye-safety"),
      )
    ) {
      return "medium";
    }
    return "low";
  };

  const riskLevel = getRiskLevel(legalFlags);

  return (
    <div className={`${styles.badge} ${className}`}>
      <button
        type="button"
        className={`${styles.indicator} ${styles[`indicator${riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)}`]} ${acknowledged ? styles.indicatorAcknowledged : ""}`}
        onClick={() => setShowDetails(!showDetails)}
        aria-expanded={showDetails}
        aria-label={`Legal compliance requirements (${riskLevel} risk)`}
      >
        <span className={styles.icon}>⚠️</span>
        <span className={styles.text}>
          {riskLevel === "high"
            ? "ITAR/Export"
            : riskLevel === "medium"
              ? "Compliance"
              : "Restrictions"}
        </span>
        {!acknowledged && <span className={styles.dot}>●</span>}
      </button>

      {showDetails && (
        <div className={styles.details}>
          <div className={styles.detailsHeader}>
            <h4>Legal Compliance Requirements</h4>
            <button
              className={styles.closeButton}
              onClick={() => setShowDetails(false)}
              aria-label="Close details"
            >
              ×
            </button>
          </div>

          <div className={styles.detailsContent}>
            <div className={styles.riskLevel}>
              <span className={`${styles.riskLevelBadge} ${styles[`riskLevel${riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)}`]}`}>
                {riskLevel.toUpperCase()} RISK
              </span>
            </div>

            <div className={styles.requirements}>
              <h5>Requirements:</h5>
              <ul className={styles.list}>
                {legalFlags.map((flag, index) => (
                  <li key={index} className={styles.item}>
                    {flag}
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.note}>
              <p>
                This is a concept demonstration system. In actual deployment,
                all legal requirements must be properly addressed and
                authorized.
              </p>
            </div>
          </div>

          {!acknowledged && (
            <div className={styles.actions}>
              <button
                className={styles.acknowledgeButton}
                onClick={handleAcknowledge}
              >
                Acknowledge Requirements
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LegalBadge;
