// apps/marketing/src/components/hooks/useGameState.ts
// COMPLETE FIXED VERSION - Replace your entire file with this

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
    spawnRate: 2000,
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
    energy: 100,
    maxEnergy: 100,
    energyRegenRate: 2,
    cooling: 100,
    maxCooling: 100,
    coolingRate: 5,
    selectedThreats: [],
    selectionBox: null,
    priorityThreats: {},
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

  // FIXED removeThreat function
  const removeThreat = useCallback((threatId: string) => {
    const currentTime = Date.now();
    setGameState((prev) => {
      const threat = prev.threats.find(t => t.id === threatId);
      if (!threat || threat.status === "neutralized" || threat.status === "crater") {
        return prev;
      }
      
      const timeSinceLastNeutralization = currentTime - prev.lastNeutralizationTime;
      const comboMultiplier = timeSinceLastNeutralization < 2000
        ? Math.min(prev.comboMultiplier + 0.1, 3)
        : 1;
      
      const newLevel = Math.floor((prev.neutralized + 1) / 10) + 1;
      const newSpawnRate = Math.max(500, 2000 - (newLevel - 1) * 150);
      
      return {
        ...prev,
        threats: prev.threats.map((t) =>
          t.id === threatId
            ? {
                ...t,
                status: "neutralized" as const,
                isMoving: false,
                health: 0,
                neutralizedAt: currentTime,
                fadeStartTime: currentTime + 1000,
              }
            : t,
        ),
        neutralized: prev.neutralized + 1,
        score: prev.score + Math.floor(100 * comboMultiplier),
        level: newLevel,
        spawnRate: newSpawnRate,
        comboMultiplier,
        lastNeutralizationTime: currentTime,
      };
    });
  }, []);

  const updateThreats = useCallback((updatedThreats: Threat[]) => {
    setGameState((prev) => ({
      ...prev,
      threats: updatedThreats,
    }));
  }, []);

  // Enhanced fade-out and cleanup
  const processFadeOut = useCallback(() => {
    const currentTime = Date.now();
    setGameState((prev) => {
      const updatedThreats = prev.threats.map((threat) => {
        if (threat.status === "neutralized" && threat.fadeStartTime && currentTime >= threat.fadeStartTime) {
          const fadeDuration = 3000;
          const fadeProgress = Math.min((currentTime - threat.fadeStartTime) / fadeDuration, 1);
          
          if (fadeProgress >= 1) {
            return { ...threat, status: "crater" as const };
          }
        }
        return threat;
      }).filter((threat) => {
        // Remove old craters
        if (threat.status === "crater" && threat.neutralizedAt) {
          return currentTime - threat.neutralizedAt < 10000;
        }
        return true;
      });

      if (updatedThreats.length !== prev.threats.length) {
        return { ...prev, threats: updatedThreats };
      }
      return prev;
    });
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
      frameRate: fps,
    }));
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

      if (!weapon || !weapon.isReady || weapon.ammo <= 0 || prev.energy < 10) {
        return prev;
      }

      let effectiveCooldown = weapon.cooldown;
      
      prev.activePowerUps.forEach((powerUp) => {
        if (powerUp.isActive && currentTime - powerUp.startTime < powerUp.duration) {
          if (powerUp.effect.cooldownReduction) {
            effectiveCooldown *= powerUp.effect.cooldownReduction;
          }
        }
      });

      const newWeapon = {
        ...weapon,
        lastFired: currentTime,
        isReady: false,
        ammo: weapon.ammo - 1,
        cooldown: effectiveCooldown,
      };

      return {
        ...prev,
        weapons: {
          ...prev.weapons,
          [prev.selectedWeapon]: newWeapon,
        },
        energy: Math.max(0, prev.energy - 10),
      };
    });
  }, []);

  const updateWeaponCooldowns = useCallback(() => {
    setGameState((prev) => {
      const currentTime = Date.now();
      const updatedWeapons = { ...prev.weapons };
      let hasChanges = false;

      Object.keys(updatedWeapons).forEach((weaponId) => {
        const weapon = updatedWeapons[weaponId];
        if (!weapon.isReady && currentTime - weapon.lastFired >= weapon.cooldown) {
          updatedWeapons[weaponId] = {
            ...weapon,
            isReady: true,
          };
          hasChanges = true;
        }
      });

      return hasChanges ? { ...prev, weapons: updatedWeapons } : prev;
    });
  }, []);

  const activatePowerUp = useCallback((powerUpType: string) => {
    setGameState((prev) => {
      const currentTime = Date.now();
      const newPowerUp: PowerUp = {
        id: `${powerUpType}-${currentTime}`,
        name: powerUpType,
        type: powerUpType as any,
        duration: 10000,
        startTime: currentTime,
        isActive: true,
        effect: {
          cooldownReduction: powerUpType === "rapid-fire" ? 0.5 : undefined,
          damageMultiplier: powerUpType === "damage-boost" ? 2 : undefined,
          rangeMultiplier: powerUpType === "range-boost" ? 1.5 : undefined,
        },
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

      return activePowerUps.length !== prev.activePowerUps.length
        ? { ...prev, activePowerUps }
        : prev;
    });
  }, []);

  const checkAchievements = useCallback(() => {
    setGameState((prev) => {
      const newAchievements = [...prev.achievements];
      
      if (prev.neutralized >= 10 && !newAchievements.includes("perfect-defense")) {
        newAchievements.push("perfect-defense");
      }

      const recentNeutralizedThreats = prev.threats.filter(t => t.status === "neutralized").slice(-5);
      if (recentNeutralizedThreats.length === 5 && 
          recentNeutralizedThreats.every((t) => t.type === "swarm") &&
          !newAchievements.includes("swarm-master")) {
        newAchievements.push("swarm-master");
      }

      if (newAchievements.length !== prev.achievements.length) {
        return { ...prev, achievements: newAchievements };
      }
      return prev;
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
        .slice(0, 10);

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("threatSimulatorLeaderboard", JSON.stringify(updatedLeaderboard));
        } catch {}
      }

      return { ...prev, leaderboard: updatedLeaderboard };
    });
  }, []);

  const updateResources = useCallback((deltaTime: number) => {
    setGameState((prev) => ({
      ...prev,
      energy: Math.min(prev.maxEnergy, prev.energy + prev.energyRegenRate * deltaTime),
      cooling: Math.min(prev.maxCooling, prev.cooling + prev.coolingRate * deltaTime),
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

  const setThreatPriority = useCallback((threatId: string, priority: "high" | "medium" | "low") => {
    setGameState((prev) => ({
      ...prev,
      priorityThreats: {
        ...prev.priorityThreats,
        [threatId]: priority,
      },
    }));
  }, []);

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

  const deployDrone = useCallback((droneType: Drone["type"], targetX: number, targetY: number) => {
    setGameState((prev) => {
      const bay = prev.deploymentBays.find((b) => b.droneType === droneType);
      if (!bay || !bay.isReady || bay.currentDrones <= 0 || prev.mothership.energy < MOTHERSHIP_CONFIG.deploymentCost) {
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
            : b
        ),
      };
    });
  }, []);

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
          prev.mothership.energy + prev.mothership.energyRegenRate * deltaTime
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
            : d
        ),
      };
    });
  }, []);

  const updateDronePositions = useCallback((deltaTime: number) => {
    setGameState((prev) => {
      const updatedDrones = prev.drones
        .map((drone) => {
          const dx = drone.targetX - drone.x;
          const dy = drone.targetY - drone.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 10) {
            if (drone.isReturning) {
              return { ...drone, shouldRemove: true };
            }
            return drone;
          }

          const moveDistance = drone.speed * deltaTime * 60;
          const moveX = (dx / distance) * moveDistance;
          const moveY = (dy / distance) * moveDistance;

          return {
            ...drone,
            x: drone.x + moveX,
            y: drone.y + moveY,
          };
        })
        .filter((drone): drone is Drone => !drone.shouldRemove);

      const updatedBays = prev.deploymentBays.map((bay) => {
        const returnedDrones = prev.drones.filter(
          (d) =>
            d.type === bay.droneType &&
            d.isReturning &&
            Math.sqrt((d.x - prev.mothership.x) ** 2 + (d.y - prev.mothership.y) ** 2) < 10
        );

        return {
          ...bay,
          currentDrones: Math.min(bay.capacity, bay.currentDrones + returnedDrones.length),
        };
      });

      const updatedDeployedDrones = prev.mothership.deployedDrones.filter((droneId) =>
        updatedDrones.some((d) => d.id === droneId)
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
        ])
      ),
      activePowerUps: [],
      gameTime: 0,
      spawnRate: 2000,
      lastSpawnTime: 0,
      comboMultiplier: 1,
      lastNeutralizationTime: 0,
      achievements: [],
      energy: 100,
      cooling: 100,
      selectedThreats: [],
      selectionBox: null,
      priorityThreats: {},
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
  };
};