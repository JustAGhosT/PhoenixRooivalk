// Custom hook to manage the game state for the ThreatSimulator component

import { useCallback, useState } from "react";
import { Threat } from "../utils/threatTypes";
import { Weapon, PowerUp, WEAPON_CONFIGS } from "../utils/weaponTypes";

interface GameState {
  score: number;
  threats: Threat[];
  neutralized: number;
  level: number;
  isRunning: boolean;
  selectedWeapon: "kinetic" | "electronic" | "laser";
  weapons: Record<string, Weapon>;
  activePowerUps: PowerUp[];
  gameTime: number;
  spawnRate: number;
  lastSpawnTime: number;
  comboMultiplier: number;
  lastNeutralizationTime: number;
  frameRate: number;
  targetFrameRate: number;
  achievements: string[];
  leaderboard: Array<{
    score: number;
    level: number;
    date: string;
    threatsNeutralized: number;
  }>;
}

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    threats: [],
    neutralized: 0,
    level: 1,
    isRunning: true,
    selectedWeapon: "kinetic",
    weapons: Object.fromEntries(
      Object.entries(WEAPON_CONFIGS).map(([key, config]) => [
        key,
        {
          ...config,
          lastFired: 0,
          isReady: true,
          ammo: config.maxAmmo,
        },
      ]),
    ),
    activePowerUps: [],
    gameTime: 0,
    spawnRate: 2000, // milliseconds between spawns
    lastSpawnTime: 0,
    comboMultiplier: 1,
    lastNeutralizationTime: 0,
    frameRate: 60,
    targetFrameRate: 60,
    achievements: [],
    leaderboard: JSON.parse(
      localStorage.getItem("threatSimulatorLeaderboard") || "[]",
    ),
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
      const timeSinceLastNeutralization =
        currentTime - prev.lastNeutralizationTime;
      const comboMultiplier =
        timeSinceLastNeutralization < 2000
          ? Math.min(prev.comboMultiplier + 0.1, 3)
          : 1; // 2 second combo window

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

  const switchWeapon = useCallback((weaponId: string) => {
    setGameState((prev) => ({
      ...prev,
      selectedWeapon: weaponId as "kinetic" | "electronic" | "laser",
    }));
  }, []);

  const fireWeapon = useCallback((targetX: number, targetY: number) => {
    setGameState((prev) => {
      const weapon = prev.weapons[prev.selectedWeapon];
      const currentTime = Date.now();

      if (!weapon.isReady || weapon.ammo <= 0) {
        return prev;
      }

      // Apply power-up effects
      let effectiveCooldown = weapon.cooldown;
      let effectiveDamage = weapon.damage;
      let effectiveRange = weapon.range;

      prev.activePowerUps.forEach((powerUp) => {
        if (
          powerUp.isActive &&
          currentTime - powerUp.startTime < powerUp.duration
        ) {
          if (powerUp.effect.cooldownReduction) {
            effectiveCooldown *= powerUp.effect.cooldownReduction;
          }
          if (powerUp.effect.damageMultiplier) {
            effectiveDamage *= powerUp.effect.damageMultiplier;
          }
          if (powerUp.effect.rangeMultiplier) {
            effectiveRange *= powerUp.effect.rangeMultiplier;
          }
        }
      });

      const newWeapon = {
        ...weapon,
        lastFired: currentTime,
        isReady: false,
        ammo: weapon.ammo - 1,
      };

      return {
        ...prev,
        weapons: {
          ...prev.weapons,
          [prev.selectedWeapon]: newWeapon,
        },
      };
    });
  }, []);

  const updateWeaponCooldowns = useCallback(() => {
    setGameState((prev) => {
      const currentTime = Date.now();
      const updatedWeapons = { ...prev.weapons };

      Object.keys(updatedWeapons).forEach((weaponId) => {
        const weapon = updatedWeapons[weaponId];
        if (
          !weapon.isReady &&
          currentTime - weapon.lastFired >= weapon.cooldown
        ) {
          updatedWeapons[weaponId] = {
            ...weapon,
            isReady: true,
          };
        }
      });

      return {
        ...prev,
        weapons: updatedWeapons,
      };
    });
  }, []);

  const activatePowerUp = useCallback((powerUpType: string) => {
    setGameState((prev) => {
      const currentTime = Date.now();
      const newPowerUp: PowerUp = {
        id: `${powerUpType}-${currentTime}`,
        name: powerUpType,
        type: powerUpType as any,
        duration: 10000, // 10 seconds default
        startTime: currentTime,
        isActive: true,
        effect: {},
      };

      return {
        ...prev,
        activePowerUps: [...prev.activePowerUps, newPowerUp],
      };
    });
  }, []);

  const updatePowerUps = useCallback(() => {
    setGameState((prev) => {
      const currentTime = Date.now();
      const activePowerUps = prev.activePowerUps.filter(
        (powerUp) => currentTime - powerUp.startTime < powerUp.duration,
      );

      return {
        ...prev,
        activePowerUps,
      };
    });
  }, []);

  const checkAchievements = useCallback(() => {
    setGameState((prev) => {
      const newAchievements = [...prev.achievements];
      const currentTime = Date.now();

      // Perfect Defense - neutralize 10 threats without missing
      if (
        prev.neutralized >= 10 &&
        !newAchievements.includes("perfect-defense")
      ) {
        newAchievements.push("perfect-defense");
      }

      // Swarm Master - neutralize 5 swarm threats in a row
      const recentThreats = prev.threats.slice(-5);
      if (
        recentThreats.length === 5 &&
        recentThreats.every((t) => t.type === "swarm") &&
        !newAchievements.includes("swarm-master")
      ) {
        newAchievements.push("swarm-master");
      }

      // Stealth Hunter - neutralize 3 stealth threats in a row
      if (
        recentThreats.length >= 3 &&
        recentThreats.slice(-3).every((t) => t.type === "stealth") &&
        !newAchievements.includes("stealth-hunter")
      ) {
        newAchievements.push("stealth-hunter");
      }

      return {
        ...prev,
        achievements: newAchievements,
      };
    });
  }, []);

  const addToLeaderboard = useCallback(() => {
    setGameState((prev) => {
      const newEntry = {
        score: prev.score,
        level: prev.level,
        date: new Date().toISOString(),
        threatsNeutralized: prev.neutralized,
      };

      const updatedLeaderboard = [...prev.leaderboard, newEntry]
        .sort((a, b) => b.score - a.score)
        .slice(0, 10); // Keep top 10

      localStorage.setItem(
        "threatSimulatorLeaderboard",
        JSON.stringify(updatedLeaderboard),
      );

      return {
        ...prev,
        leaderboard: updatedLeaderboard,
      };
    });
  }, []);

  const resetGameState = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      score: 0,
      threats: [],
      neutralized: 0,
      level: 1,
      isRunning: true,
      selectedWeapon: "kinetic",
      weapons: Object.fromEntries(
        Object.entries(WEAPON_CONFIGS).map(([key, config]) => [
          key,
          {
            ...config,
            lastFired: 0,
            isReady: true,
            ammo: config.maxAmmo,
          },
        ]),
      ),
      activePowerUps: [],
      gameTime: 0,
      spawnRate: 2000,
      lastSpawnTime: 0,
      comboMultiplier: 1,
      lastNeutralizationTime: 0,
      achievements: [],
    }));
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
    switchWeapon,
    fireWeapon,
    updateWeaponCooldowns,
    activatePowerUp,
    updatePowerUps,
    checkAchievements,
    addToLeaderboard,
    resetGameState,
  };
};
