import * as React from "react";
import type { Drone, GameState, Threat } from "../types/game";

interface ThreatSimulatorComponentsProps {
  gameState: GameState;
  onThreatClick: (e: React.MouseEvent, threatId: string) => void;
  onThreatHover: (threatId: string | null) => void;
  getThreatAppearance: (type: string) => {
    emoji: string;
    color: string;
    cssClass: string;
  };
}

export const ThreatSimulatorComponents: React.FC<
  ThreatSimulatorComponentsProps
> = ({ gameState, onThreatClick, onThreatHover, getThreatAppearance }) => {
  const [hoveredThreat, setHoveredThreat] = React.useState<string | null>(null);

  // Enhanced threat rendering with better visual feedback
  const renderThreat = (threat: Threat) => {
    const appearance = getThreatAppearance(threat.type);
    const isSelected = gameState.selectedThreats.includes(threat.id);
    const isHovered = hoveredThreat === threat.id;
    const priority = gameState.priorityThreats?.[threat.id] || "low";

    return (
      <div
        key={threat.id}
        className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${
          isSelected ? "scale-110 z-20" : isHovered ? "scale-105 z-10" : "z-5"
        }`}
        style={{
          left: `${threat.x}px`,
          top: `${threat.y}px`,
        }}
        onClick={(e) => onThreatClick(e, threat.id)}
        onMouseEnter={() => {
          setHoveredThreat(threat.id);
          onThreatHover(threat.id);
        }}
        onMouseLeave={() => {
          setHoveredThreat(null);
          onThreatHover(null);
        }}
      >
        {/* Threat Icon */}
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-lg shadow-lg transition-all duration-200 ${
            appearance.color
          } ${
            isSelected
              ? "ring-4 ring-blue-400 ring-opacity-75"
              : isHovered
                ? "ring-2 ring-white ring-opacity-50"
                : ""
          }`}
        >
          {appearance.emoji}
        </div>

        {/* Priority Indicator */}
        {priority !== "low" && (
          <div
            className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
              priority === "high"
                ? "bg-red-500"
                : priority === "medium"
                  ? "bg-yellow-500"
                  : "bg-green-500"
            }`}
          />
        )}

        {/* Health Bar */}
        {threat.health && (
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gray-600 rounded-full overflow-hidden">
            <div
              className="h-full bg-red-500 transition-all duration-300"
              style={{
                width: `${Math.min((threat.health / 100) * 100, 100)}%`,
              }}
            />
          </div>
        )}

        {/* Threat Trail */}
        {threat.trail && threat.trail.length > 1 && (
          <svg
            className="absolute inset-0 pointer-events-none"
            style={{ width: "100%", height: "100%" }}
          >
            <path
              d={`M ${threat.trail
                .map((point) => `${point.x - threat.x},${point.y - threat.y}`)
                .join(" L ")}`}
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth="1"
              fill="none"
              strokeDasharray="2,2"
            />
          </svg>
        )}

        {/* Threat Label */}
        {(isSelected || isHovered) && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            {threat.type.toUpperCase()}
            {threat.health && (
              <span className="ml-2 text-gray-300">
                {Math.round(threat.health)}/100
              </span>
            )}
          </div>
        )}
      </div>
    );
  };

  // Enhanced drone rendering
  const renderDrone = (drone: Drone) => {
    const droneIcons = {
      interceptor: "🚁",
      jammer: "📡",
      surveillance: "👁️",
      shield: "🛡️",
      "swarm-coordinator": "🐝",
    };

    return (
      <div
        key={drone.id}
        className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200"
        style={{
          left: `${drone.x}px`,
          top: `${drone.y}px`,
        }}
      >
        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-sm shadow-lg">
          {droneIcons[drone.type as keyof typeof droneIcons] || "🚁"}
        </div>

        {/* Drone Status Indicator */}
        <div
          className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${
            drone.status === "active"
              ? "bg-green-500"
              : drone.status === "returning"
                ? "bg-yellow-500"
                : "bg-red-500"
          }`}
        />
      </div>
    );
  };

  // Enhanced mothership rendering
  const renderMothership = () => {
    return (
      <div
        className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200"
        style={{
          left: `${gameState.mothership.x}px`,
          top: `${gameState.mothership.y}px`,
        }}
      >
        {/* Mothership Body */}
        <div className="w-16 h-16 bg-slate-600 rounded-lg flex items-center justify-center text-2xl shadow-xl border-2 border-slate-400">
          🚁
        </div>

        {/* Energy Shield */}
        {gameState.energy > gameState.maxEnergy * 0.5 && (
          <div className="absolute inset-0 rounded-lg border-2 border-blue-400 opacity-50 animate-pulse" />
        )}

        {/* Low Energy Warning */}
        {gameState.energy < gameState.maxEnergy * 0.2 && (
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-red-500 text-xs animate-bounce">
            ⚠️ LOW ENERGY
          </div>
        )}
      </div>
    );
  };

  // Enhanced selection box
  const renderSelectionBox = () => {
    if (!gameState.selectionBox || !gameState.selectionBox.isActive)
      return null;

    const { startX, startY, endX, endY } = gameState.selectionBox;
    const left = Math.min(startX, endX);
    const top = Math.min(startY, endY);
    const width = Math.abs(endX - startX);
    const height = Math.abs(endY - startY);

    return (
      <div
        className="absolute border-2 border-blue-400 bg-blue-400/10 pointer-events-none"
        style={{
          left: `${left}px`,
          top: `${top}px`,
          width: `${width}px`,
          height: `${height}px`,
        }}
      />
    );
  };

  // Enhanced particle effects
  const renderParticleEffects = () => {
    return (
      <div className="absolute inset-0 pointer-events-none">
        {/* Power-up effects */}
        {gameState.activePowerUps.map((powerUp) => (
          <div
            key={powerUp.id}
            className={`absolute w-3 h-3 rounded-full animate-pulse ${
              powerUp.type === "area-effect"
                ? "bg-orange-500"
                : powerUp.type === "rapid-fire"
                  ? "bg-blue-500"
                  : "bg-purple-500"
            }`}
            style={{
              left: `${Math.random() * 400 + 200}px`,
              top: `${Math.random() * 300 + 150}px`,
            }}
          />
        ))}
      </div>
    );
  };

  // Enhanced radar visualization
  const renderRadar = () => {
    return (
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 pointer-events-none">
        {/* Outer detection ring */}
        <div className="absolute inset-0 border-2 border-blue-400/20 rounded-full opacity-30 animate-pulse" />

        {/* Radar sweep line */}
        <div className="absolute top-1/2 left-1/2 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-spin origin-left opacity-60" />

        {/* Coverage zones */}
        <div className="absolute inset-4 border border-blue-300/15 rounded-full opacity-25" />
        <div className="absolute inset-8 border border-blue-400/10 rounded-full opacity-20" />

        {/* Detection pings */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-75" />
        </div>

        {/* Threat indicators on radar */}
        {gameState.threats.map((threat) => {
          const angle = Math.atan2(threat.y - 300, threat.x - 400);
          const distance = Math.sqrt(
            Math.pow(threat.x - 400, 2) + Math.pow(threat.y - 300, 2),
          );
          const normalizedDistance = Math.min(distance / 200, 1);

          return (
            <div
              key={`radar-${threat.id}`}
              className="absolute w-1 h-1 bg-red-500 rounded-full"
              style={{
                left: `${200 + Math.cos(angle) * normalizedDistance * 150}px`,
                top: `${200 + Math.sin(angle) * normalizedDistance * 150}px`,
              }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Radar */}
      {renderRadar()}

      {/* Mothership */}
      {renderMothership()}

      {/* Threats */}
      {gameState.threats.map(renderThreat)}

      {/* Drones */}
      {gameState.drones.map(renderDrone)}

      {/* Selection Box */}
      {renderSelectionBox()}

      {/* Particle Effects */}
      {renderParticleEffects()}

      {/* Deployment Bays */}
      {gameState.deploymentBays.map((bay) => (
        <div
          key={bay.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${bay.x}px`,
            top: `${bay.y}px`,
          }}
        >
          <div
            className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-lg ${
              bay.currentDrones > 0
                ? "border-green-400 bg-green-400/20"
                : "border-gray-600 bg-gray-600/20"
            }`}
          >
            {bay.currentDrones > 0 ? "🚁" : "⭕"}
          </div>
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-white bg-black/50 px-1 rounded">
            {bay.currentDrones}/{bay.capacity}
          </div>
        </div>
      ))}
    </div>
  );
};
