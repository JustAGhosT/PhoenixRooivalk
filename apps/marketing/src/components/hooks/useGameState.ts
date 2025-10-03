// Custom hook to manage the game state for the ThreatSimulator component

import { useCallback, useState } from "react";
import {
  DRONE_CONFIGS,
  DeploymentBay,
  Drone,
  Formation,
  MOTHERSHIP_CONFIG,
  Mothership,
} from "../utils/mothershipTypes";
import { Threat } from "../utils/threatTypes";
import { PowerUp, WEAPON_CONFIGS, Weapon } from "../utils/weaponTypes";

export interface GameState {
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
  // Resource Management
  energy: number;
  maxEnergy: number;
  energyRegenRate: number;
  cooling: number;
  maxCooling: number;
  coolingRate: number;
  // Multi-target selection
  selectedThreats: string[];
  selectionBox: {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    isActive: boolean;
  } | null;
  // Priority targeting
  priorityThreats: Record<string, "high" | "medium" | "low">;
  // Phoenix Rooivalk Mothership System
  mothership: Mothership;
  drones: Drone[];
  deploymentBays: DeploymentBay[];
  formations: Formation[];
  selectedDroneType: Drone["type"] | null;
  // Environmental and Mission State
  weatherMode: "none" | "rain" | "fog" | "night";
  missionType: "airport" | "military-base" | "vip-protection" | "border-patrol";
  automationMode: "manual" | "automated" | "hybrid";
  showDeploymentZones: boolean;
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
    leaderboard: (() => {
      if (typeof window !== "undefined") {
        try {
          return JSON.parse(
            localStorage.getItem("threatSimulatorLeaderboard") || "[]",
          );
        } catch {
          return [];
        }
      }
      return [];
    })(),
    // Resource Management
    energy: 100,
    maxEnergy: 100,
    energyRegenRate: 2, // per second
    cooling: 100,
    maxCooling: 100,
    coolingRate: 5, // per second
    // Multi-target selection
    selectedThreats: [],
    selectionBox: null,
    // Priority targeting
    priorityThreats: {},
    // Phoenix Rooivalk Mothership System
    mothership: {
      id: "mothership-1",
      x: 400, // Center of game area
      y: 300,
      energy: MOTHERSHIP_CONFIG.initialEnergy,
      maxEnergy: MOTHERSHIP_CONFIG.maxEnergy,
      energyRegenRate: MOTHERSHIP_CONFIG.energyRegenRate,
      fuel: MOTHERSHIP_CONFIG.initialFuel,
      maxFuel: MOTHERSHIP_CONFIG.maxFuel,
      fuelConsumptionRate: MOTHERSHIP_CONFIG.fuelConsumptionRate,
      isDeploying: false,
      deploymentCooldown: MOTHERSHIP_CONFIG.deploymentCooldown,
      lastDeployment: 0,
      droneCapacity: MOTHERSHIP_CONFIG.droneCapacity,
      deployedDrones: [],
    },
    drones: [],
    deploymentBays: [
      {
        id: "bay-interceptor",
        droneType: "interceptor",
        x: 350,
        y: 280,
        isReady: true,
        cooldown: 5000,
        lastDeployment: 0,
        capacity: 4,
        currentDrones: 4,
      },
      {
        id: "bay-jammer",
        droneType: "jammer",
        x: 380,
        y: 280,
        isReady: true,
        cooldown: 8000,
        lastDeployment: 0,
        capacity: 3,
        currentDrones: 3,
      },
      {
        id: "bay-surveillance",
        droneType: "surveillance",
        x: 410,
        y: 280,
        isReady: true,
        cooldown: 6000,
        lastDeployment: 0,
        capacity: 2,
        currentDrones: 2,
      },
      {
        id: "bay-shield",
        droneType: "shield",
        x: 440,
        y: 280,
        isReady: true,
        cooldown: 10000,
        lastDeployment: 0,
        capacity: 2,
        currentDrones: 2,
      },
      {
        id: "bay-swarm-coordinator",
        droneType: "swarm-coordinator",
        x: 470,
        y: 280,
        isReady: true,
        cooldown: 12000,
        lastDeployment: 0,
        capacity: 1,
        currentDrones: 1,
      },
    ],
    formations: [],
    selectedDroneType: null,
    // Environmental and Mission State
    weatherMode: "none",
    missionType: "military-base",
    automationMode: "hybrid",
    showDeploymentZones: false,
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

      // Mark the threat as neutralized but keep it visible at crash location
      return {
        ...prev,
        threats: prev.threats.map((t) =>
          t.id === threatId
            ? {
                ...t,
                status: "neutralized",
                isMoving: false,
                neutralizedAt: currentTime,
                fadeStartTime: currentTime + 2000, // Start fade after 2 seconds
              }
            : t,
        ),
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

  // Function to handle fade-out process for neutralized threats
  const processFadeOut = useCallback(() => {
    const currentTime = Date.now();
    setGameState((prev) => ({
      ...prev,
      threats: prev.threats.map((threat) => {
        if (
          threat.status === "neutralized" &&
          threat.fadeStartTime &&
          currentTime >= threat.fadeStartTime
        ) {
          const fadeDuration = 3000; // 3 seconds to fade out
          const fadeProgress = Math.min(
            (currentTime - threat.fadeStartTime) / fadeDuration,
            1,
          );

          if (fadeProgress >= 1) {
            // Transition to crater state
            return { ...threat, status: "crater" };
          }
        }
        return threat;
      }),
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

  const setLevel = useCallback((level: number) => {
    setGameState(prev => ({ ...prev, level }));
  }, []);

  const switchWeapon = useCallback((weaponId: string) => {
    setGameState((prev) => ({
      ...prev,
      selectedWeapon: weaponId as "kinetic" | "electronic" | "laser",
    }));
  }, []);

  const fireWeapon = useCallback((_targetX: number, _targetY: number) => {
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

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(
            "threatSimulatorLeaderboard",
            JSON.stringify(updatedLeaderboard),
          );
        } catch {
          // Silently fail if localStorage is not available
        }
      }

      return {
        ...prev,
        leaderboard: updatedLeaderboard,
      };
    });
  }, []);

  const updateResources = useCallback((deltaTime: number) => {
    setGameState((prev) => ({
      ...prev,
      energy: Math.min(
        prev.maxEnergy,
        prev.energy + prev.energyRegenRate * deltaTime,
      ),
      cooling: Math.min(
        prev.maxCooling,
        prev.cooling + prev.coolingRate * deltaTime,
      ),
    }));
  }, []);

  const consumeEnergy = useCallback((amount: number) => {
    setGameState((prev) => ({
      ...prev,
      energy: Math.max(0, prev.energy - amount),
    }));
  }, []);

  const consumeCooling = useCallback((amount: number) => {
    setGameState((prev) => ({
      ...prev,
      cooling: Math.max(0, prev.cooling - amount),
    }));
  }, []);

  const selectThreat = useCallback((threatId: string) => {
    setGameState((prev) => ({
      ...prev,
      selectedThreats: prev.selectedThreats.includes(threatId)
        ? prev.selectedThreats.filter((id) => id !== threatId)
        : [...prev.selectedThreats, threatId],
    }));
  }, []);

  const clearSelection = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      selectedThreats: [],
      selectionBox: null,
    }));
  }, []);

  const setSelectionBox = useCallback((box: GameState["selectionBox"]) => {
    setGameState((prev) => ({
      ...prev,
      selectionBox: box,
    }));
  }, []);

  const setThreatPriority = useCallback(
    (threatId: string, priority: "high" | "medium" | "low") => {
      setGameState((prev) => ({
        ...prev,
        priorityThreats: {
          ...prev.priorityThreats,
          [threatId]: priority,
        },
      }));
    },
    [],
  );

  const removeThreatPriority = useCallback((threatId: string) => {
    setGameState((prev) => {
      const newPriorities = { ...prev.priorityThreats };
      delete newPriorities[threatId];
      return {
        ...prev,
        priorityThreats: newPriorities,
      };
    });
  }, []);

  // Mothership and Drone Management
  const deployDrone = useCallback(
    (droneType: Drone["type"], targetX: number, targetY: number) => {
      setGameState((prev) => {
        const bay = prev.deploymentBays.find((b) => b.droneType === droneType);
        if (
          !bay ||
          !bay.isReady ||
          bay.currentDrones <= 0 ||
          prev.mothership.energy < MOTHERSHIP_CONFIG.deploymentCost
        ) {
          return prev;
        }

        const currentTime = Date.now();
        const droneConfig = DRONE_CONFIGS[droneType];
        const newDrone: Drone = {
          id: `drone-${currentTime}-${Math.random()}`,
          x: prev.mothership.x,
          y: prev.mothership.y,
          targetX,
          targetY,
          lastAction: currentTime,
          mothershipId: prev.mothership.id,
          deploymentTime: currentTime,
          ...droneConfig,
          type: droneType,
        };

        return {
          ...prev,
          drones: [...prev.drones, newDrone],
          mothership: {
            ...prev.mothership,
            energy: prev.mothership.energy - MOTHERSHIP_CONFIG.deploymentCost,
            deployedDrones: [...prev.mothership.deployedDrones, newDrone.id],
            lastDeployment: currentTime,
          },
          deploymentBays: prev.deploymentBays.map((b) =>
            b.id === bay.id
              ? {
                  ...b,
                  currentDrones: b.currentDrones - 1,
                  lastDeployment: currentTime,
                }
              : b,
          ),
        };
      });
    },
    [],
  );

  const updateDrones = useCallback((updatedDrones: Drone[]) => {
    setGameState((prev) => ({
      ...prev,
      drones: updatedDrones,
    }));
  }, []);

  const selectDroneType = useCallback((droneType: Drone["type"] | null) => {
    setGameState((prev) => ({
      ...prev,
      selectedDroneType: droneType,
    }));
  }, []);

  const updateMothershipResources = useCallback((deltaTime: number) => {
    setGameState((prev) => ({
      ...prev,
      mothership: {
        ...prev.mothership,
        energy: Math.min(
          prev.mothership.maxEnergy,
          prev.mothership.energy + prev.mothership.energyRegenRate * deltaTime,
        ),
      },
    }));
  }, []);

  const returnDroneToBase = useCallback((droneId: string) => {
    setGameState((prev) => {
      const drone = prev.drones.find((d) => d.id === droneId);
      if (!drone) return prev;

      return {
        ...prev,
        drones: prev.drones.map((d) =>
          d.id === droneId
            ? {
                ...d,
                isReturning: true,
                targetX: prev.mothership.x,
                targetY: prev.mothership.y,
              }
            : d,
        ),
      };
    });
  }, []);

  // Update drone positions and handle return-to-base logic
  const updateDronePositions = useCallback((deltaTime: number) => {
    setGameState((prev) => {
      const updatedDrones = prev.drones
        .map((drone) => {
          // Calculate distance to target
          const dx = drone.targetX - drone.x;
          const dy = drone.targetY - drone.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // If drone is close to target, handle arrival
          if (distance < 10) {
            if (drone.isReturning) {
              // Drone has returned to base - mark for removal
              return { ...drone, shouldRemove: true };
            }
            return drone; // Stay in position
          }

          // Move drone towards target
          const moveDistance = drone.speed * deltaTime * 60; // Convert to pixels per second
          const moveX = (dx / distance) * moveDistance;
          const moveY = (dy / distance) * moveDistance;

          return {
            ...drone,
            x: drone.x + moveX,
            y: drone.y + moveY,
          };
        })
        .filter((drone): drone is Drone => !drone.shouldRemove); // Remove drones marked for removal

      // Update deployment bays with returned drones
      const updatedBays = prev.deploymentBays.map((bay) => {
        const returnedDrones = prev.drones.filter(
          (d) =>
            d.type === bay.droneType &&
            d.isReturning &&
            Math.sqrt(
              (d.x - prev.mothership.x) ** 2 + (d.y - prev.mothership.y) ** 2,
            ) < 10,
        );

        return {
          ...bay,
          currentDrones: Math.min(
            bay.capacity,
            bay.currentDrones + returnedDrones.length,
          ),
        };
      });

      // Update mothership deployed drones list
      const updatedDeployedDrones = prev.mothership.deployedDrones.filter(
        (droneId) => updatedDrones.some((d) => d.id === droneId),
      );

      return {
        ...prev,
        drones: updatedDrones,
        deploymentBays: updatedBays,
        mothership: {
          ...prev.mothership,
          deployedDrones: updatedDeployedDrones,
        },
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
      // Reset resources
      energy: 100,
      cooling: 100,
      // Reset selection
      selectedThreats: [],
      selectionBox: null,
      priorityThreats: {},
      // Reset mothership and drones
      mothership: {
        id: "mothership-1",
        x: 400,
        y: 300,
        energy: MOTHERSHIP_CONFIG.initialEnergy,
        maxEnergy: MOTHERSHIP_CONFIG.maxEnergy,
        energyRegenRate: MOTHERSHIP_CONFIG.energyRegenRate,
        fuel: MOTHERSHIP_CONFIG.initialFuel,
        maxFuel: MOTHERSHIP_CONFIG.maxFuel,
        fuelConsumptionRate: MOTHERSHIP_CONFIG.fuelConsumptionRate,
        isDeploying: false,
        deploymentCooldown: MOTHERSHIP_CONFIG.deploymentCooldown,
        lastDeployment: 0,
        droneCapacity: MOTHERSHIP_CONFIG.droneCapacity,
        deployedDrones: [],
      },
      drones: [],
      deploymentBays: prev.deploymentBays.map((bay) => ({
        ...bay,
        currentDrones: bay.capacity,
        isReady: true,
        lastDeployment: 0,
      })),
      formations: [],
      selectedDroneType: null,
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
    updateResources,
    consumeEnergy,
    consumeCooling,
    selectThreat,
    clearSelection,
    setSelectionBox,
    setThreatPriority,
    removeThreatPriority,
    deployDrone,
    updateDrones,
    selectDroneType,
    updateMothershipResources,
    returnDroneToBase,
    updateDronePositions,
    resetGameState,
    processFadeOut,
    setLevel,
  };
};
