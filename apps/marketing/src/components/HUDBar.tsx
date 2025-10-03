import React from 'react';

interface HUDBarProps {
  score: number;
  threats: number;
  neutralized: number;
  level: number;
}

const HUDBar: React.FC<HUDBarProps> = ({ score, threats, neutralized, level }) => {
  return (
    <header className="threatsim__hud" role="group" aria-label="Simulator status">
      <h3 id="sim-title" className="sr-only">Edge Autonomy Demo (Concept)</h3>
      <div className="hud-stat">
        <span className="hud-label">Score</span>
        <span className="hud-value" id="sim-score">{score}</span>
      </div>
      <div className="hud-stat">
        <span className="hud-label">Threats</span>
        <span className="hud-value" id="sim-threats">{threats}</span>
      </div>
      <div className="hud-stat">
        <span className="hud-label">Neutralized</span>
        <span className="hud-value" id="sim-neutralized">{neutralized}</span>
      </div>
      <div className="hud-stat">
        <span className="hud-label">Level</span>
        <span className="hud-value" id="sim-level">{level}</span>
      </div>
    </header>
  );
};

export default HUDBar;