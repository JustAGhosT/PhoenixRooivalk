import React from "react";

interface CooldownMeterProps {
  cooldown: number; // milliseconds
  lastFired: number; // timestamp
  size?: "small" | "medium" | "large";
  className?: string;
}

export const CooldownMeter: React.FC<CooldownMeterProps> = ({
  cooldown,
  lastFired,
  size = "medium",
  className = "",
}) => {
  const now = Date.now();
  const elapsed = lastFired ? now - lastFired : Infinity;
  const remaining = Math.max(0, cooldown - elapsed);
  const progress =
    cooldown > 0
      ? Math.max(0, Math.min(1, (cooldown - remaining) / cooldown))
      : 1;

  const isReady = remaining <= 0;
  const remainingSeconds = Math.ceil(remaining / 1000);

  const sizeClasses = {
    small: "cooldown-meter--small",
    medium: "cooldown-meter--medium",
    large: "cooldown-meter--large",
  };

  return (
    <div className={`cooldown-meter ${sizeClasses[size]} ${className}`}>
      <div className="cooldown-meter-container">
        <svg
          className="cooldown-meter-svg"
          viewBox="0 0 36 36"
          role="progressbar"
          aria-valuenow={Math.round(progress * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Cooldown ${isReady ? "ready" : `${remainingSeconds}s remaining`}`}
        >
          <path
            className="cooldown-meter-bg"
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="var(--sim-border)"
            strokeWidth="2"
          />
          <path
            className={`cooldown-meter-progress ${isReady ? "cooldown-meter-progress--ready" : ""}`}
            strokeDasharray={`${progress * 100}, 100`}
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke={isReady ? "var(--sim-success)" : "var(--sim-warning)"}
            strokeWidth="2"
            strokeLinecap="round"
            style={{
              transition: "stroke-dasharray 0.3s ease-in-out",
            }}
          />
        </svg>

        <div className="cooldown-meter-content">
          {isReady ? (
            <span className="cooldown-meter-ready" aria-label="Ready to fire">
              ✓
            </span>
          ) : (
            <span
              className="cooldown-meter-time"
              aria-label={`${remainingSeconds} seconds remaining`}
            >
              {remainingSeconds}
            </span>
          )}
        </div>
      </div>

      {!isReady && (
        <div className="cooldown-meter-tooltip">
          Ready in {remainingSeconds}s
        </div>
      )}
    </div>
  );
};

export default CooldownMeter;
