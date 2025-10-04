import React, { useState } from "react";

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
    <div className={`legal-badge ${className}`}>
      <button
        type="button"
        className={`legal-badge-indicator legal-badge-indicator--${riskLevel} ${acknowledged ? "legal-badge-indicator--acknowledged" : ""}`}
        onClick={() => setShowDetails(!showDetails)}
        aria-expanded={showDetails}
        aria-label={`Legal compliance requirements (${riskLevel} risk)`}
      >
        <span className="legal-badge-icon">⚠️</span>
        <span className="legal-badge-text">
          {riskLevel === "high"
            ? "ITAR/Export"
            : riskLevel === "medium"
              ? "Compliance"
              : "Restrictions"}
        </span>
        {!acknowledged && <span className="legal-badge-dot">●</span>}
      </button>

      {showDetails && (
        <div className="legal-badge-details">
          <div className="legal-badge-details-header">
            <h4>Legal Compliance Requirements</h4>
            <button
              className="legal-badge-close"
              onClick={() => setShowDetails(false)}
              aria-label="Close details"
            >
              ×
            </button>
          </div>

          <div className="legal-badge-details-content">
            <div className="legal-badge-risk-level">
              <span className={`risk-level risk-level--${riskLevel}`}>
                {riskLevel.toUpperCase()} RISK
              </span>
            </div>

            <div className="legal-badge-requirements">
              <h5>Requirements:</h5>
              <ul className="legal-badge-list">
                {legalFlags.map((flag, index) => (
                  <li key={index} className="legal-badge-item">
                    {flag}
                  </li>
                ))}
              </ul>
            </div>

            <div className="legal-badge-note">
              <p>
                This is a concept demonstration system. In actual deployment,
                all legal requirements must be properly addressed and
                authorized.
              </p>
            </div>
          </div>

          {!acknowledged && (
            <div className="legal-badge-actions">
              <button
                className="legal-badge-acknowledge"
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
