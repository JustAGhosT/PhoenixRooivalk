import React from 'react';

interface RadarCanvasProps {
  isResetting?: boolean;
  onThreatClick?: (e: React.MouseEvent, threatId: string) => void;
}

const RadarCanvas: React.FC<RadarCanvasProps> = ({ isResetting = false }) => {
  return (
    <div className="threatsim__canvas" role="img" aria-label="Concept radar view showing threats within range" aria-busy={isResetting}>
      <svg viewBox="0 0 600 600" className="radar" aria-hidden="true">
        <defs>
          <radialGradient id="radar-bg" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#0e1217"/>
            <stop offset="100%" stopColor="#0a0d11"/>
          </radialGradient>
        </defs>
        <rect width="600" height="600" fill="url(#radar-bg)"/>
        <g className="radar__rings">
          <circle cx="300" cy="300" r="220" className="ring ring--soft"/>
          <circle cx="300" cy="300" r="160" className="ring"/>
          <circle cx="300" cy="300" r="100" className="ring"/>
          <circle cx="300" cy="300" r="40"  className="ring"/>
        </g>
        <g id="ego"><circle cx="300" cy="300" r="6" className="ego"/></g>
        <g id="blips"></g>
      </svg>
    </div>
  );
};

export default RadarCanvas;