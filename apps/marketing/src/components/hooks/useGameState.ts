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
  gameTime: number;
  spawnRate: number;
  lastSpawnTime: number;
  comboMultiplier: number;
  lastNeutralizationTime: number;
  frameRate: number;
  targetFrameRate: number;
}

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    threats: [],
    neutralized: 0,
    level: 1,
    isRunning: true,
    selectedWeapon: "kinetic",
    gameTime: 0,
    spawnRate: 2000, // milliseconds between spawns
    lastSpawnTime: 0,
    comboMultiplier: 1,
    lastNeutralizationTime: 0,
    frameRate: 60,
    targetFrameRate: 60,
  });

  const updateScore = useCallback((amount: number) => {
    setGameState((prev) => ({ 
      ...prev, 
      score: prev.score + Math.floor(amount * prev.comboMultiplier),
      lastNeutralizationTime: Date.now(),
    }));
  }, []);

  const addThreat = useCallback((newThreat: Threat) => {
    setGameState((prev) => ({
      ...prev,
      threats: [...prev.threats, newThreat],
      lastSpawnTime: Date.now(),
    }));
  }, []);

  const removeThreat = useCallback((threatId: string) => {
    const currentTime = Date.now();
    setGameState((prev) => {
      const timeSinceLastNeutralization = currentTime - prev.lastNeutralizationTime;
      const comboMultiplier = timeSinceLastNeutralization < 2000 ? 
        Math.min(prev.comboMultiplier + 0.1, 3) : 1; // 2 second combo window
      
      const newLevel = Math.floor(prev.neutralized / 10) + 1;
      const newSpawnRate = Math.max(500, 2000 - (newLevel - 1) * 150); // Faster spawning with level
      
      return {
        ...prev,
        threats: prev.threats.filter((t) => t.id !== threatId),
        neutralized: prev.neutralized + 1,
        level: newLevel,
        spawnRate: newSpawnRate,
        comboMultiplier,
      };
    });
  }, []);

  const updateThreats = useCallback((updatedThreats: Threat[]) => {
    setGameState((prev) => ({
      ...prev,
      threats: updatedThreats,
    }));
  }, []);

  const toggleRunningState = useCallback(() => {
    setGameState((prev) => ({ ...prev, isRunning: !prev.isRunning }));
  }, []);

  const updateGameTime = useCallback((deltaTime: number) => {
    setGameState((prev) => ({
      ...prev,
      gameTime: prev.gameTime + deltaTime,
    }));
  }, []);

  const setFrameRate = useCallback((fps: number) => {
    setGameState((prev) => ({
      ...prev,
      targetFrameRate: fps,
    }));
  }, []);

  const resetGameState = useCallback(() => {
    setGameState({
      score: 0,
      threats: [],
      neutralized: 0,
      level: 1,
      isRunning: true,
      selectedWeapon: "kinetic",
      gameTime: 0,
      spawnRate: 2000,
      lastSpawnTime: 0,
      comboMultiplier: 1,
      lastNeutralizationTime: 0,
      frameRate: 60,
      targetFrameRate: 60,
    });
  }, []);

  return {
    gameState,
    updateScore,
    addThreat,
    removeThreat,
    updateThreats,
    toggleRunningState,
    updateGameTime,
    setFrameRate,
    resetGameState,
  };
};
