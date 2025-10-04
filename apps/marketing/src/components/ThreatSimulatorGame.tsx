import React from "react";
import HUDBar from "./HUDBar";
import "./ThreatSimulator.css";
import { useGameState } from "./hooks/useGameState";

interface ThreatSimulatorGameProps {
  className?: string;
}

const ThreatSimulatorGame: React.FC<ThreatSimulatorGameProps> = ({
  className = "",
}) => {
  const { gameState } = useGameState();

  return (
    <div className={`threat-simulator ${className}`}>
      <HUDBar
        score={gameState.score}
        threats={gameState.threats.length}
        neutralized={gameState.neutralized}
        level={gameState.level}
      />

      <div className="simulator-content">
        <div className="game-area">
          <h2>Threat Simulator Game</h2>
          <p>Score: {gameState.score}</p>
          <p>Threats: {gameState.threats.length}</p>
          <p>Neutralized: {gameState.neutralized}</p>
          <p>Level: {gameState.level}</p>
          <p>Energy: {gameState.energy}</p>
        </div>
      </div>
    </div>
  );
};

export default ThreatSimulatorGame;
