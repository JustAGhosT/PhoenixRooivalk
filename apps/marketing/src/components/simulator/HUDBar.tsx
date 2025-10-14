import React from "react";
import { Button } from "../ui/button";
import styles from "./HUDBar.module.css";

interface HUDBarProps {
  score: number;
  threats: number;
  neutralized: number;
  level: number;
  onToggleResearch: () => void;
}

const HUDBar: React.FC<HUDBarProps> = ({
  score,
  threats,
  neutralized,
  level,
  onToggleResearch,
}) => {
  return (
    <header className={styles.hud} role="group" aria-label="Simulator status">
      <h3 id="sim-title" className={styles.srOnly}>
        Phoenix Rooivalk Defense Simulator
      </h3>
      <div className={styles.stat} role="status" aria-label="Current score">
        <span className={styles.label}>Score</span>
        <span className={styles.value} id="sim-score" aria-live="polite">
          {score.toLocaleString()}
        </span>
      </div>
      <div className={styles.stat} role="status" aria-label="Active threats">
        <span className={styles.label}>Active</span>
        <span
          className={styles.value}
          id="sim-threats"
          aria-live="polite"
          aria-atomic="true"
        >
          {threats}
        </span>
      </div>
      <div
        className={styles.stat}
        role="status"
        aria-label="Threats neutralized"
      >
        <span className={styles.label}>Neutralized</span>
        <span className={styles.value} id="sim-neutralized" aria-live="polite">
          {neutralized}
        </span>
      </div>
      <div className={styles.stat} role="status" aria-label="Current wave">
        <span className={styles.label}>Wave</span>
        <span className={styles.value} id="sim-level" aria-live="polite">
          {level}
        </span>
      </div>
      <div className={styles.stat}>
        <Button
          onClick={onToggleResearch}
          variant="ghost"
          size="sm"
          aria-label="Open research panel"
        >
          🔬 Research
        </Button>
      </div>
    </header>
  );
};

export default HUDBar;
