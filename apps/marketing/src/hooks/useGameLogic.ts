import { useState, useCallback } from "react";

export interface ThreatType {
  emoji: string;
  speed: number;
  health: number;
  points: number;
  weakness: string;
  color: string;
}

export interface CountermeasureType {
  name: string;
  color: string;
  effectiveness: Record<string, number>;
}

export const threatTypes: Record<string, ThreatType> = {
  drone: {
    emoji: "🚁",
    speed: 0.3,
    health: 1,
    points: 100,
    weakness: "kinetic",
    color: "#ef4444",
  },
  radar: {
    emoji: "📡",
    speed: 0.2,
    health: 2,
    points: 150,
    weakness: "electronic",
    color: "#f97316",
  },
  stealth: {
    emoji: "🛸",
    speed: 0.4,
    health: 1,
    points: 200,
    weakness: "laser",
    color: "#eab308",
  },
  swarm: {
    emoji: "🐝",
    speed: 0.5,
    health: 1,
    points: 75,
    weakness: "kinetic",
    color: "#8b5cf6",
  },
  heavy: {
    emoji: "🚀",
    speed: 0.15,
    health: 3,
    points: 300,
    weakness: "laser",
    color: "#dc2626",
  },
};

export const countermeasures: Record<string, CountermeasureType> = {
  kinetic: {
    name: "Kinetic Interceptor",
    color: "#00ff88",
    effectiveness: {
      drone: 1.0,
      swarm: 1.0,
      radar: 0.5,
      stealth: 0.7,
      heavy: 0.3,
    },
  },
  electronic: {
    name: "EW Jammer",
    color: "#0088ff",
    effectiveness: {
      drone: 0.7,
      swarm: 0.8,
      radar: 1.0,
      stealth: 0.5,
      heavy: 0.6,
    },
  },
  laser: {
    name: "Directed Energy",
    color: "#ff0088",
    effectiveness: {
      drone: 0.8,
      swarm: 0.6,
      radar: 0.7,
      stealth: 1.0,
      heavy: 1.0,
    },
  },
};

export interface GameState {
  score: number;
  gameLevel: number;
  activeThreats: number;
  maxThreats: number;
  threatSpawnRate: number;
  gameRunning: boolean;
  neutralizedCount: number;
  selectedCountermeasure: string;
}

export const useGameLogic = () => {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    gameLevel: 1,
    activeThreats: 0,
    maxThreats: 3,
    threatSpawnRate: 3000,
    gameRunning: true,
    neutralizedCount: 0,
    selectedCountermeasure: "kinetic",
  });

  const updateScore = useCallback((points: number) => {
    setGameState((prev) => ({ ...prev, score: prev.score + points }));
  }, []);

  const incrementNeutralized = useCallback(() => {
    setGameState((prev) => {
      const newNeutralized = prev.neutralizedCount + 1;
      const newLevel = Math.floor(newNeutralized / 10) + 1;
      const newMaxThreats = Math.min(8, 3 + Math.floor(newLevel / 2));
      const newSpawnRate = Math.max(1000, 3000 - newLevel * 200);

      return {
        ...prev,
        neutralizedCount: newNeutralized,
        gameLevel: newLevel,
        maxThreats: newMaxThreats,
        threatSpawnRate: newSpawnRate,
      };
    });
  }, []);

  const updateActiveThreats = useCallback((delta: number) => {
    setGameState((prev) => ({
      ...prev,
      activeThreats: Math.max(0, prev.activeThreats + delta),
    }));
  }, []);

  const setCountermeasure = useCallback((countermeasure: string) => {
    setGameState((prev) => ({
      ...prev,
      selectedCountermeasure: countermeasure,
    }));
  }, []);

  const gameOver = useCallback(() => {
    setGameState((prev) => ({ ...prev, gameRunning: false }));
  }, []);

  const resetGame = useCallback(() => {
    setGameState({
      score: 0,
      gameLevel: 1,
      activeThreats: 0,
      maxThreats: 3,
      threatSpawnRate: 3000,
      gameRunning: true,
      neutralizedCount: 0,
      selectedCountermeasure: "kinetic",
    });
  }, []);

  return {
    gameState,
    updateScore,
    incrementNeutralized,
    updateActiveThreats,
    setCountermeasure,
    gameOver,
    resetGame,
  };
};
