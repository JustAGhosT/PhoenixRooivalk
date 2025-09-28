import { useState, useCallback, useRef } from "react";
import { GameState, GameSettings, threatTypes, countermeasures } from "../types";

const DEFAULT_SETTINGS: GameSettings = {
  fps: 60,
  loopType: 'infinite',
  loopCount: 100,
  loopStart: 0,
  loopEnd: 1000,
};

export const useThreatGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    gameLevel: 1,
    activeThreats: 0,
    maxThreats: 8, // Increased to allow more swarm spawning
    threatSpawnRate: 3000,
    gameRunning: true,
    neutralizedCount: 0,
    selectedCountermeasure: "kinetic",
    isFullscreen: false,
    countermeasureAmmo: {
      kinetic: countermeasures.kinetic.ammo || 0,
      electronic: countermeasures.electronic.ammo || 0,
      laser: countermeasures.laser.ammo || 0,
    },
    countermeasureCooldowns: {
      kinetic: 0,
      electronic: 0,
      laser: 0,
    },
    settings: DEFAULT_SETTINGS,
    currentFrame: 0,
  });

  const animationFrameRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  const updateSettings = useCallback((newSettings: Partial<GameSettings>) => {
    setGameState((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings },
    }));
  }, []);

  const updateScore = useCallback((points: number) => {
    setGameState((prev) => ({ ...prev, score: prev.score + points }));
  }, []);

  const incrementNeutralized = useCallback(() => {
    setGameState((prev) => {
      const newNeutralized = prev.neutralizedCount + 1;
      const newLevel = Math.floor(newNeutralized / 8) + 1; // Level up every 8 kills
      const newMaxThreats = Math.min(10, 3 + Math.floor(newLevel / 2));
      const newSpawnRate = Math.max(800, 2500 - newLevel * 150); // Faster spawn rate

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

  const toggleFullscreen = useCallback(() => {
    console.log("toggleFullscreen hook called");
    setGameState((prev) => {
      console.log(
        "Toggling fullscreen from",
        prev.isFullscreen,
        "to",
        !prev.isFullscreen,
      );
      return { ...prev, isFullscreen: !prev.isFullscreen };
    });
  }, []);

  const setFullscreenState = useCallback((isFullscreen: boolean) => {
    setGameState((prev) => ({ ...prev, isFullscreen: isFullscreen }));
  }, []);

  const useCountermeasure = useCallback((countermeasureType: string) => {
    const now = Date.now();
    setGameState((prev) => {
      const countermeasure = countermeasures[countermeasureType];
      if (!countermeasure) return prev;

      // Check cooldown
      if (prev.countermeasureCooldowns[countermeasureType] > now) {
        return prev; // Still on cooldown
      }

      // Check ammo
      if (
        countermeasure.ammo !== undefined &&
        prev.countermeasureAmmo[countermeasureType] <= 0
      ) {
        return prev; // Out of ammo
      }

      // Use countermeasure
      const newAmmo = { ...prev.countermeasureAmmo };
      if (countermeasure.ammo !== undefined) {
        newAmmo[countermeasureType] = Math.max(
          0,
          newAmmo[countermeasureType] - 1,
        );
      }

      const newCooldowns = { ...prev.countermeasureCooldowns };
      newCooldowns[countermeasureType] = now + countermeasure.cooldown;

      return {
        ...prev,
        countermeasureAmmo: newAmmo,
        countermeasureCooldowns: newCooldowns,
      };
    });
  }, []);

  const canUseCountermeasure = useCallback(
    (countermeasureType: string) => {
      const now = Date.now();
      const countermeasure = countermeasures[countermeasureType];
      if (!countermeasure) return false;

      // Check cooldown
      if (gameState.countermeasureCooldowns[countermeasureType] > now) {
        return false;
      }

      // Check ammo
      if (
        countermeasure.ammo !== undefined &&
        gameState.countermeasureAmmo[countermeasureType] <= 0
      ) {
        return false;
      }

      return true;
    },
    [gameState.countermeasureCooldowns, gameState.countermeasureAmmo],
  );

  const canGenerateSwarm = useCallback(() => {
    // Can generate swarm if we have room for at least 1 more threat
    return (
      gameState.gameRunning && gameState.activeThreats < gameState.maxThreats
    );
  }, [gameState.gameRunning, gameState.activeThreats, gameState.maxThreats]);

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
      isFullscreen: false,
      countermeasureAmmo: {
        kinetic: countermeasures.kinetic.ammo || 0,
        electronic: countermeasures.electronic.ammo || 0,
        laser: countermeasures.laser.ammo || 0,
      },
      countermeasureCooldowns: {
        kinetic: 0,
        electronic: 0,
        laser: 0,
      },
      settings: DEFAULT_SETTINGS,
      currentFrame: 0,
    });
  }, []);

  // Game loop with framerate control
  const startGameLoop = useCallback(() => {
    if (!gameState.gameRunning) return;

    const gameLoop = (currentTime: number) => {
      const deltaTime = currentTime - lastTimeRef.current;
      const frameInterval = 1000 / gameState.settings.fps;

      if (deltaTime >= frameInterval) {
        lastTimeRef.current = currentTime - (deltaTime % frameInterval);

        setGameState(prev => {
          const newFrame = prev.currentFrame + 1;

          // Check loop conditions
          let shouldContinue = true;
          if (prev.settings.loopType === 'count' && newFrame >= prev.settings.loopCount) {
            shouldContinue = false;
          } else if (prev.settings.loopType === 'range') {
            if (newFrame < prev.settings.loopStart || newFrame > prev.settings.loopEnd) {
              shouldContinue = false;
            }
          }

          if (!shouldContinue) {
            return { ...prev, gameRunning: false, currentFrame: 0 };
          }

          return {
            ...prev,
            currentFrame: newFrame,
          };
        });
      }

      if (gameState.gameRunning) {
        animationFrameRef.current = requestAnimationFrame(gameLoop);
      }
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [gameState.gameRunning, gameState.settings.fps, gameState.settings.loopType, gameState.settings.loopCount, gameState.settings.loopStart, gameState.settings.loopEnd]);

  const toggleGameRunning = useCallback(() => {
    setGameState((prev) => ({ ...prev, gameRunning: !prev.gameRunning }));
  }, []);

  const setGameRunning = useCallback((running: boolean) => {
    setGameState((prev) => ({ ...prev, gameRunning: running }));
  }, []);

  const stopGameLoop = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = undefined;
    }
  }, []);

  return {
    gameState,
    updateScore,
    incrementNeutralized,
    updateActiveThreats,
    setCountermeasure,
    gameOver,
    toggleFullscreen,
    setFullscreenState,
    useCountermeasure,
    canUseCountermeasure,
    canGenerateSwarm,
    resetGame,
    updateSettings,
    startGameLoop,
    stopGameLoop,
    toggleGameRunning,
    setGameRunning,
  };
};
