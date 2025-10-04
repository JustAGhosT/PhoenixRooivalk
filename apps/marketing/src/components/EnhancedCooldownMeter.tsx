import React, { useEffect, useState } from "react";

export interface EnhancedCooldownMeterProps {
  cooldownTime: number; // in seconds
  isActive: boolean;
  onCooldownComplete?: () => void;
  size?: number;
  showText?: boolean;
  label?: string;
  className?: string;
}

export const DemoCooldownMeter: React.FC<EnhancedCooldownMeterProps> = ({
  cooldownTime,
  isActive,
  onCooldownComplete,
  size = 40,
  showText = true,
  label = "",
  className = "",
}) => {
  const [remainingTime, setRemainingTime] = useState(cooldownTime);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && remainingTime > 0) {
      setIsAnimating(true);
      interval = setInterval(() => {
        setRemainingTime((prev) => {
          const newTime = prev - 0.1;
          if (newTime <= 0) {
            setIsAnimating(false);
            onCooldownComplete?.();
            return 0;
          }
          return newTime;
        });
      }, 100);
    } else if (!isActive) {
      setRemainingTime(cooldownTime);
      setIsAnimating(false);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, cooldownTime, onCooldownComplete, remainingTime]);

  const progress =
    cooldownTime > 0 ? (cooldownTime - remainingTime) / cooldownTime : 1;
  const circumference = 2 * Math.PI * (size / 2 - 2);
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference * (1 - progress);

  const isReady = !isActive && remainingTime === cooldownTime;
  const isCooldown = isActive && remainingTime > 0;

  return (
    <div className={`enhanced-cooldown-meter ${className}`}>
      <div className="cooldown-container" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="cooldown-svg"
          style={{ transform: "rotate(-90deg)" }}
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - 2}
            fill="none"
            stroke="var(--sim-border)"
            strokeWidth="2"
            className="cooldown-bg"
          />

          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - 2}
            fill="none"
            stroke={isReady ? "var(--sim-success)" : "var(--sim-accent)"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className={`cooldown-progress ${isAnimating ? "cooldown-animating" : ""}`}
            style={{
              transition: isAnimating ? "none" : "stroke-dashoffset 0.3s ease",
              filter: isReady
                ? "drop-shadow(0 0 4px var(--sim-success))"
                : "none",
            }}
          />
        </svg>

        {/* Center content */}
        <div className="cooldown-center">
          {showText && (
            <div className="cooldown-text">
              {isReady ? (
                <span className="cooldown-ready">✓</span>
              ) : isCooldown ? (
                <span className="cooldown-countdown">
                  {Math.ceil(remainingTime)}
                </span>
              ) : (
                <span className="cooldown-idle">○</span>
              )}
            </div>
          )}
        </div>

        {/* Pulse effect for ready state */}
        {isReady && <div className="cooldown-pulse" />}
      </div>

      {/* Label */}
      {label && <div className="cooldown-label">{label}</div>}

      {/* Tooltip */}
      <div className="cooldown-tooltip">
        {isReady
          ? "Ready to fire"
          : isCooldown
            ? `Ready in ${Math.ceil(remainingTime)}s`
            : `${cooldownTime}s cooldown`}
      </div>
    </div>
  );
};

// Specialized cooldown meter for weapon systems
export interface WeaponCooldownMeterProps {
  weaponId: string;
  cooldownTime: number;
  isActive: boolean;
  isReady: boolean;
  energyCost: number;
  currentEnergy: number;
  onCooldownComplete?: () => void;
}

export const WeaponCooldownMeter: React.FC<WeaponCooldownMeterProps> = ({
  weaponId: _weaponId,
  cooldownTime,
  isActive,
  isReady,
  energyCost,
  currentEnergy,
  onCooldownComplete,
}) => {
  const hasEnergy = currentEnergy >= energyCost;
  const canFire = isReady && hasEnergy;

  return (
    <div className="weapon-cooldown-meter">
      <DemoCooldownMeter
        cooldownTime={cooldownTime}
        isActive={isActive}
        onCooldownComplete={onCooldownComplete}
        size={32}
        showText={true}
        className={`weapon-cooldown ${!hasEnergy ? "insufficient-energy" : ""}`}
      />

      {/* Energy indicator */}
      <div
        className={`energy-indicator ${hasEnergy ? "sufficient" : "insufficient"}`}
      >
        <div className="energy-icon">⚡</div>
        <div className="energy-cost">{energyCost}</div>
      </div>

      {/* Status overlay */}
      {!hasEnergy && (
        <div className="status-overlay insufficient-energy-overlay">
          <span className="status-text">Low Energy</span>
        </div>
      )}

      {canFire && (
        <div className="status-overlay ready-overlay">
          <span className="status-text">Ready</span>
        </div>
      )}
    </div>
  );
};
