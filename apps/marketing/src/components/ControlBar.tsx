import React from 'react';

interface ControlBarProps {
  onPause: () => void;
  onSwarm: () => void;
  onPlus5: () => void;
  onReset: () => void;
  onLevelChange: (level: number) => void;
  isPaused: boolean;
  currentLevel: number;
}

const ControlBar: React.FC<ControlBarProps> = ({
  onPause,
  onSwarm,
  onPlus5,
  onReset,
  onLevelChange,
  isPaused,
  currentLevel
}) => {
  const levels = [1, 2, 3];

  return (
    <footer className="threatsim__controls" role="toolbar" aria-label="Simulator controls">
      <button className="btn btn--secondary" id="btn-pause" aria-pressed={isPaused} title="Space" onClick={onPause}>
        {isPaused ? 'Resume' : 'Pause'}
      </button>
      <button className="btn" id="btn-swarm" title="S" onClick={onSwarm}>Spawn Swarm</button>
      <button className="btn btn--secondary" id="btn-plus5" title="+" onClick={onPlus5}>+5 Drones</button>
      <div className="level">
        <span className="level__label">Level</span>
        <div className="level__buttons" role="group" aria-label="Select level">
          {levels.map(level => (
            <button
              key={level}
              className={`chip ${currentLevel === level ? 'chip--on' : ''}`}
              data-level={level}
              onClick={() => onLevelChange(level)}
              aria-pressed={currentLevel === level}
            >
              {level}
            </button>
          ))}
        </div>
      </div>
      <button className="btn btn--ghost" id="btn-reset" title="R" onClick={onReset}>Reset</button>
    </footer>
  );
};

export default ControlBar;