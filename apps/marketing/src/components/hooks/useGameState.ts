// Custom hook to manage the game state for the ThreatSimulator component

import { useCallback, useState } from "react";
import { Threat } from "../utils/threatTypes";

interface GameState {
  score: number;
  threats: Threat[];
  neutralized: number;
  level: number;
  isRunning: boolean;
  selectedWeapon: "kinetic" | "electronic" | "laser";
}

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    threats: [],
    neutralized: 0,
    level: 1,
    isRunning: true,
    selectedWeapon: "kinetic",
  });

  const updateScore = useCallback((amount: number) => {
    setGameState((prev) => ({ ...prev, score: prev.score + amount }));
  }, []);

  const addThreat = useCallback((newThreat: Threat) => {
    setGameState((prev) => ({
      ...prev,
      threats: [...prev.threats, newThreat],
    }));
  }, []);

  const removeThreat = useCallback((threatId: string) => {
    setGameState((prev) => ({
      ...prev,
      threats: prev.threats.filter((t) => t.id !== threatId),
      neutralized: prev.neutralized + 1,
    }));
  }, []);

  const toggleRunningState = useCallback(() => {
    setGameState((prev) => ({ ...prev, isRunning: !prev.isRunning }));
  }, []);

  const resetGameState = useCallback(() => {
    setGameState({
      score: 0,
      threats: [],
      neutralized: 0,
      level: 1,
      isRunning: true,
      selectedWeapon: "kinetic",
    });
  }, []);

  return {
    gameState,
    updateScore,
    addThreat,
    removeThreat,
    toggleRunningState,
    resetGameState,
  };
};
