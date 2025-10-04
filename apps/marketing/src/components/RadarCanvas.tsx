import React from "react";
import type { Threat } from "../types/game";

interface RadarCanvasProps {
  threats: Threat[];
  isResetting?: boolean;
  onThreatClick?: (
    e: React.MouseEvent | React.KeyboardEvent,
    threatId: string,
  ) => void;
}

const RadarCanvas: React.FC<RadarCanvasProps> = ({
  threats,
  isResetting = false,
  onThreatClick,
}) => {
  // Game area dimensions are assumed to be 800x600 for mapping purposes
  const gameCenterX = 400;
  const gameCenterY = 300;

  // Radar dimensions from SVG viewBox and rings
  const radarCenterX = 300;
  const radarCenterY = 300;
  const radarMaxRadius = 220; // Outermost ring radius

  // This is a magic number derived from the game's threat spawning logic.
  // It represents a reasonable maximum distance a threat can be from the center.
  const maxGameDistance = 450;

  return (
    <div
      className="threatsim__canvas"
      role="img"
      aria-label="Concept radar view showing threats within range"
      aria-busy={isResetting}
    >
      <svg viewBox="0 0 600 600" className="radar" aria-hidden="true">
        <defs>
          <radialGradient id="radar-bg" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#0e1217" />
            <stop offset="100%" stopColor="#0a0d11" />
          </radialGradient>
        </defs>
        <rect width="600" height="600" fill="url(#radar-bg)" />
        <g className="radar__rings">
          <circle cx="300" cy="300" r="220" className="ring ring--soft" />
          <circle cx="300" cy="300" r="160" className="ring" />
          <circle cx="300" cy="300" r="100" className="ring" />
          <circle cx="300" cy="300" r="40" className="ring" />
        </g>
        <g id="ego">
          <circle cx="300" cy="300" r="6" className="ego" />
        </g>
        <g id="blips">
          {threats.map((threat) => {
            if (threat.status === "neutralized" || threat.status === "crater") {
              return null;
            }

            const dx = threat.x - gameCenterX;
            const dy = threat.y - gameCenterY;

            const angle = Math.atan2(dy, dx);
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Normalize distance and cap it to 1
            const normalizedDistance = Math.min(distance / maxGameDistance, 1);

            const radarX =
              radarCenterX +
              Math.cos(angle) * normalizedDistance * radarMaxRadius;
            const radarY =
              radarCenterY +
              Math.sin(angle) * normalizedDistance * radarMaxRadius;

            // For now, all threats are considered hostile. This can be expanded later.
            const blipClass = `blip blip--hostile`;

            const handleThreatClick = (event: React.MouseEvent) => {
              onThreatClick?.(event, threat.id);
            };

            const handleKeyDown = (event: React.KeyboardEvent) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onThreatClick?.(event, threat.id);
              }
            };

            return (
              <circle
                key={threat.id}
                cx={radarX}
                cy={radarY}
                r="4"
                className={`${blipClass} cursor-pointer`}
                role="button"
                tabIndex={0}
                onClick={handleThreatClick}
                onKeyDown={handleKeyDown}
                aria-label={`Threat ${threat.id}`}
                style={{ cursor: "pointer" }}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
};

export default RadarCanvas;
