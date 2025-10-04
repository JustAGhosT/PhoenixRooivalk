import React from "react";

interface ROERiskIndicatorProps {
  riskLevel: "low" | "med" | "high";
  className?: string;
}

export const ROERiskIndicator: React.FC<ROERiskIndicatorProps> = ({
  riskLevel,
  className = "",
}) => {
  const getRiskConfig = (level: string) => {
    switch (level) {
      case "low":
        return {
          color: "var(--sim-success)",
          label: "Low",
          icon: "✓",
          description: "Minimal collateral risk",
        };
      case "med":
        return {
          color: "var(--sim-warning)",
          label: "Med",
          icon: "⚠",
          description: "Moderate collateral risk",
        };
      case "high":
        return {
          color: "var(--sim-danger)",
          label: "High",
          icon: "⚠",
          description: "High collateral risk",
        };
      default:
        return {
          color: "var(--sim-text-muted)",
          label: "Unknown",
          icon: "?",
          description: "Risk level unknown",
        };
    }
  };

  const config = getRiskConfig(riskLevel);

  return (
    <div
      className={`roe-risk-indicator roe-risk-indicator--${riskLevel} ${className}`}
      style={{ "--risk-color": config.color } as React.CSSProperties}
      role="img"
      aria-label={`ROE Risk: ${config.label} - ${config.description}`}
      title={config.description}
    >
      <span className="roe-risk-icon">{config.icon}</span>
      <span className="roe-risk-label">{config.label}</span>
    </div>
  );
};

export default ROERiskIndicator;
