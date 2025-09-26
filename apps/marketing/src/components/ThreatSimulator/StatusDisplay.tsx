import React from 'react';
import { GameState } from './types';

interface StatusDisplayProps {
  gameState: GameState;
}

export const StatusDisplay: React.FC<StatusDisplayProps> = ({ gameState }) => {
  return (
    <div className="absolute bottom-20 right-4 bg-[rgba(0,0,0,0.8)] rounded-lg p-4 text-sm border border-[rgba(0,255,136,0.3)]">
      <div className="text-[var(--primary)] font-bold mb-2 flex items-center">
        <span className="text-lg mr-2">🎯</span>
        Defense System
      </div>
      <div className="text-white mb-1 flex justify-between">
        <span>Threats Active:</span>
        <span className="text-red-400 font-bold">{gameState.activeThreats}</span>
      </div>
      <div className="text-green-400 mb-1 flex justify-between">
        <span>Neutralized:</span>
        <span className="font-bold">{gameState.neutralizedCount}</span>
      </div>
      <div className="text-yellow-400 mb-1 flex justify-between">
        <span>Score:</span>
        <span className="font-bold">{gameState.score}</span>
      </div>
      <div className="text-blue-400 flex justify-between border-t border-[rgba(0,255,136,0.2)] pt-2 mt-2">
        <span>Level:</span>
        <span className="font-bold">{gameState.gameLevel}</span>
      </div>
    </div>
  );
};
