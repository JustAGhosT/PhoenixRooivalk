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
        Edge Autonomy Demo (Concept)
      </h3>
      <div className={styles.stat}>
        <span className={styles.label}>Score</span>
        <span className={styles.value} id="sim-score">
          {score}
        </span>
      </div>
      <div className={styles.stat}>
        <span className={styles.label}>Threats</span>
        <span className={styles.value} id="sim-threats">
          {threats}
        </span>
      </div>
      <div className={styles.stat}>
        <span className={styles.label}>Neutralized</span>
        <span className={styles.value} id="sim-neutralized">
          {neutralized}
        </span>
      </div>
      <div className={styles.stat}>
        <span className={styles.label}>Level</span>
        <span className={styles.value} id="sim-level">
          {level}
        </span>
      </div>
      <div className={styles.stat}>
        <Button onClick={onToggleResearch} variant="ghost" size="sm">
          Research
        </Button>
      </div>
    </header>
  );
};

export default HUDBar;
