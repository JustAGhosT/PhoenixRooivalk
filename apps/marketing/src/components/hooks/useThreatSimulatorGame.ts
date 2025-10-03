// apps/marketing/src/components/hooks/useThreatSimulatorGame.ts
// COMPLETE FIXED VERSION - Replace your entire file with this

import { useCallback, useEffect, useRef, useState } from "react";
import type { GameState, Threat } from "../../types/game";
import { AutoTargetingSystem } from "../utils/autoTargeting";
import { FormationManager } from "../utils/formationManager";
import { ParticleSystem } from "../utils/particleSystem";
import { ResponseProtocolEngine } from "../utils/responseProtocols";
import { StrategicDeploymentEngine } from "../utils/strategicDeployment";
import { spawnThreat } from "../utils/threatUtils";

interface UseThreatSimulatorGameProps {
  gameRef: React.RefObject<HTMLButtonElement>;
  gameState: GameState;
  updateThreats: (threats: Threat[]) => void;
  addThreat: (threat: Threat) => void;
  removeThreat: (threatId: string) => void;
  updateScore: (score: number) => void;
  neutralizeThreat: (threatId: string) => void;
  fireWeapon: (x: number, y: number) => void;
  consumeEnergy: (amount: number) => void;
  consumeCooling: (amount: number) => void;
  checkAchievements: () => void;
  updateGameTime: (deltaTime: number) => void;
  updateWeaponCooldowns: () => void;
  updatePowerUps: () => void;
  updateResources: (deltaTime: number) => void;
  updateMothershipResources: (deltaTime: number) => void;
  updateDronePositions: (deltaTime: number) => void;
  setFrameRate: (rate: number) => void;
  addTimeout: (callback: () => void, delay: number) => void;
  clearTimeouts: () => void;
  processFadeOut: () => void;
}

export const useThreatSimulatorGame = ({
  gameRef,
  gameState,
  updateThreats,
  addThreat,
  removeThreat,
  updateScore,
  neutralizeThreat: _neutralizeThreat,
  fireWeapon,
  consumeEnergy,
  consumeCooling,
  checkAchievements,
  updateGameTime,
  updateWeaponCooldowns,
  updatePowerUps,
  updateResources,
  updateMothershipResources,
  updateDronePositions,
  addTimeout,
  clearTimeouts,
  processFadeOut,
}: UseThreatSimulatorGameProps) => {
  const lastFrameTime = useRef<number>(0);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastAutoTargetTime = useRef<number>(0);
  const lastCleanupTime = useRef<number>(0);

  // Core systems
  const [particleSystem] = useState(() => new ParticleSystem());
  const [autoTargeting] = useState(() => new AutoTargetingSystem());
  const [strategicEngine] = useState(() => new StrategicDeploymentEngine());
  const [responseEngine] = useState(() => new ResponseProtocolEngine());
  const [formationManager] = useState(() => new FormationManager());

  // Game state
  const [gameDimensions, setGameDimensions] = useState({
    width: 800,
    height: 600,
  });
  const [weatherMode, setWeatherMode] = useState<
    "none" | "rain" | "fog" | "night"
  >("none");
  const [missionType, setMissionType] = useState<
    "airport" | "military-base" | "vip-protection" | "border-patrol"
  >("military-base");
  const [automationMode, setAutomationMode] = useState<
    "manual" | "automated" | "hybrid"
  >("hybrid");
  const [showDeploymentZones, setShowDeploymentZones] = useState(false);

  // Spawn new threat
  const spawnNewThreat = useCallback(
    (threatType?: "drone" | "swarm" | "stealth") => {
      if (!gameRef.current) return;
      const rect = gameRef.current.getBoundingClientRect();
      const newThreat = spawnThreat(threatType, rect, gameState.level);
      addThreat(newThreat);
    },
    [addThreat, gameState.level, gameRef],
  );

  // Fixed movement function - smooth movement without jumping
  const moveAllThreats = useCallback(() => {
    if (!gameRef.current) return;

    const rect = gameRef.current.getBoundingClientRect();
    const centerPoint = { x: rect.width / 2, y: rect.height / 2 };

    const movedThreats = gameState.threats.map((threat) => {
      // Skip non-active threats
      if (threat.status !== "active" || !threat.isMoving) {
        return threat;
      }

      // Calculate direction to center
      const dx = centerPoint.x - threat.x;
      const dy = centerPoint.y - threat.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Stop if reached center
      if (distance < 30) {
        return { ...threat, isMoving: false };
      }

      // Calculate smooth movement
      const baseSpeed = threat.speed || 1;
      const speedMultiplier = 1 + (gameState.level - 1) * 0.1; // Speed increases with level
      const actualSpeed = baseSpeed * speedMultiplier;

      // Normalize direction and apply speed
      const moveX = (dx / distance) * actualSpeed;
      const moveY = (dy / distance) * actualSpeed;

      // Special movement patterns
      let finalX = threat.x + moveX;
      let finalY = threat.y + moveY;

      if (threat.type === "swarm") {
        // Swarm zigzag pattern
        const time = Date.now() / 1000;
        const zigzag = Math.sin(time * 5 + threat.createdAt) * 5;
        finalX += zigzag * (-moveY / actualSpeed);
        finalY += zigzag * (moveX / actualSpeed);
      } else if (threat.type === "stealth") {
        // Stealth opacity pulsing
        const time = Date.now() / 2000;
        threat.specialProperties = {
          ...threat.specialProperties,
          opacity: 0.3 + Math.sin(time + threat.createdAt) * 0.3,
        };
      }

      // Update trail
      const newTrail = [
        ...(threat.trail || []).slice(-9),
        { x: threat.x, y: threat.y, timestamp: Date.now() },
      ];

      return {
        ...threat,
        x: finalX,
        y: finalY,
        trail: newTrail,
        lastUpdate: Date.now(),
      };
    });

    updateThreats(movedThreats);
  }, [gameState.threats, gameState.level, updateThreats, gameRef]);

  // Enhanced neutralization with effects
  const neutralizeThreatWithEffects = useCallback(
    (threatId: string) => {
      const threat = gameState.threats.find((t) => t.id === threatId);
      if (!threat || threat.status !== "active") return;

      const weapon = gameState.weapons[gameState.selectedWeapon];
      if (!weapon) return;

      // Get weapon effectiveness against threat type
      const effectiveness = weapon.effectiveness?.[threat.type] ?? 1.0;

      // Check if we can fire
      if (!weapon.isReady || weapon.ammo <= 0 || gameState.energy < 10) {
        return;
      }

      // Fire weapon and consume resources
      fireWeapon(threat.x, threat.y);
      consumeEnergy(10);
      consumeCooling(5);

      // Create visual effects
      particleSystem.createExplosion(threat.x, threat.y, 1);

      if (threat.trail && threat.trail.length > 1) {
        const lastTrail = threat.trail[threat.trail.length - 1];
        particleSystem.createTrail(
          lastTrail.x,
          lastTrail.y,
          threat.x,
          threat.y,
        );
      }

      // Handle special threat types
      if (
        threat.type === "kamikaze" &&
        threat.specialProperties?.explosionRadius
      ) {
        // Area damage
        const explosionRadius = threat.specialProperties.explosionRadius;
        gameState.threats.forEach((nearbyThreat) => {
          if (nearbyThreat.id === threatId || nearbyThreat.status !== "active")
            return;

          const distance = Math.sqrt(
            Math.pow(nearbyThreat.x - threat.x, 2) +
              Math.pow(nearbyThreat.y - threat.y, 2),
          );

          if (distance <= explosionRadius) {
            particleSystem.createExplosion(nearbyThreat.x, nearbyThreat.y, 0.8);
            removeThreat(nearbyThreat.id);
            updateScore(50);
          }
        });
      }

      // Neutralize the threat
      removeThreat(threatId);
      updateScore(Math.floor(100 * effectiveness));
      checkAchievements();
    },
    [
      gameState.threats,
      gameState.weapons,
      gameState.selectedWeapon,
      gameState.energy,
      particleSystem,
      fireWeapon,
      consumeEnergy,
      consumeCooling,
      removeThreat,
      updateScore,
      checkAchievements,
    ],
  );

  // Generate swarm of threats
  const generateSwarm = useCallback(() => {
    clearTimeouts();
    for (let i = 0; i < 8; i++) {
      addTimeout(() => spawnNewThreat("swarm"), i * 150);
    }
  }, [spawnNewThreat, addTimeout, clearTimeouts]);

  // Spawn multiple drones
  const spawnMultipleDrones = useCallback(
    (count: number) => {
      if (!gameRef.current) return;
      const rect = gameRef.current.getBoundingClientRect();

      for (let i = 0; i < count; i++) {
        const drone = spawnThreat("drone", rect, gameState.level);
        addThreat(drone);
      }
    },
    [addThreat, gameState.level, gameRef],
  );

  // Main game loop with auto-targeting
  useEffect(() => {
    if (!gameState.isRunning) return;

    const gameLoop = (currentTime: number) => {
      const deltaTime = (currentTime - lastFrameTime.current) / 1000;
      lastFrameTime.current = currentTime;

      // Update core systems
      particleSystem.update(deltaTime);
      updateGameTime(deltaTime);
      updateWeaponCooldowns();
      updatePowerUps();
      updateResources(deltaTime);
      updateMothershipResources(deltaTime);
      updateDronePositions(deltaTime);
      processFadeOut();

      // Move threats smoothly
      moveAllThreats();

      // Auto-targeting system (runs every 100ms)
      if (currentTime - lastAutoTargetTime.current > 100) {
        lastAutoTargetTime.current = currentTime;

        if (gameState.automationMode !== "manual" && gameState.energy > 10) {
          const weapon = gameState.weapons[gameState.selectedWeapon];
          if (weapon && weapon.isReady && weapon.ammo > 0) {
            autoTargeting.processAutoTargeting(
              gameState,
              currentTime,
              (targetId, _x, _y) => {
                const threat = gameState.threats.find((t) => t.id === targetId);
                if (threat && threat.status === "active") {
                  neutralizeThreatWithEffects(targetId);
                }
              },
            );
          }
        }
      }

      // Cleanup old auto-targeting records (every 5 seconds)
      if (currentTime - lastCleanupTime.current > 5000) {
        lastCleanupTime.current = currentTime;
        autoTargeting.cleanup(currentTime);
      }

      // Spawn new threats
      const timeSinceLastSpawn = currentTime - gameState.lastSpawnTime;
      const maxThreats = 5 + gameState.level * 2;
      const activeThreats = gameState.threats.filter(
        (t) => t.status === "active",
      ).length;

      if (
        timeSinceLastSpawn > gameState.spawnRate &&
        activeThreats < maxThreats
      ) {
        if (Math.random() < 0.4 + gameState.level * 0.05) {
          spawnNewThreat();
        }
      }

      // Continue animation loop
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    lastFrameTime.current = performance.now();
    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [
    gameState,
    moveAllThreats,
    spawnNewThreat,
    neutralizeThreatWithEffects,
    particleSystem,
    autoTargeting,
    updateGameTime,
    updateWeaponCooldowns,
    updatePowerUps,
    updateResources,
    updateMothershipResources,
    updateDronePositions,
    processFadeOut,
  ]);

  // Initialize strategic systems
  useEffect(() => {
    strategicEngine.initializeDeploymentZones(missionType, 800, 600);
    responseEngine.initializeDefaultProtocols();
  }, [strategicEngine, responseEngine, missionType]);

  // Initial threat spawn
  useEffect(() => {
    const timer = setTimeout(() => {
      spawnNewThreat();
      spawnNewThreat();
      spawnNewThreat();
    }, 100);

    return () => clearTimeout(timer);
  }, [spawnNewThreat]);

  // Update game dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (gameRef.current) {
        const rect = gameRef.current.getBoundingClientRect();
        setGameDimensions({ width: rect.width, height: rect.height });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [gameRef]);

  return {
    particleSystem,
    gameDimensions,
    weatherMode,
    setWeatherMode,
    missionType,
    setMissionType,
    automationMode,
    setAutomationMode,
    showDeploymentZones,
    setShowDeploymentZones,
    strategicEngine,
    responseEngine,
    formationManager,
    spawnNewThreat,
    moveAllThreats,
    neutralizeThreatWithEffects,
    generateSwarm,
    spawnMultipleDrones,
  };
};
