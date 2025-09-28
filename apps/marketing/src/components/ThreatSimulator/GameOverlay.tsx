import React from "react";
import { GameState } from "./types";

interface GameOverlayProps {
  gameState: GameState;
  onRestart: () => void;
}

export const GameOverlay: React.FC<GameOverlayProps> = ({
  gameState,
  onRestart,
}) => {
  if (gameState.gameRunning) return null;

  return (
    <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="text-4xl mb-4">💥 SYSTEM BREACHED 💥</div>
        <div className="text-2xl text-red-400 mb-2">Defense Overwhelmed</div>
        <div className="text-lg text-white mb-4">
          Final Score: {gameState.score}
        </div>
        <div className="text-lg text-white mb-6">
          Level Reached: {gameState.gameLevel}
        </div>
        <button
          className="bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] text-[var(--dark)] px-6 py-3 rounded font-bold hover:-translate-y-0.5 transition"
          onClick={onRestart}
        >
          Restart Defense System
        </button>
      </div>
    </div>
  );
};
