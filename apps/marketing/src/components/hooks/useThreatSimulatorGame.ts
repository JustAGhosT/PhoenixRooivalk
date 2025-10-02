import { useCallback, useEffect, useRef, useState } from "react";
import { FormationManager } from "../utils/formationManager";
import { ParticleSystem } from "../utils/particleSystem";
import { ResponseProtocolEngine } from "../utils/responseProtocols";
import { StrategicDeploymentEngine } from "../utils/strategicDeployment";
import { moveThreats, spawnThreat } from "../utils/threatUtils";
import type { GameState, Threat } from "../../types/game";

interface UseThreatSimulatorGameProps {
  gameRef: React.RefObject<HTMLDivElement>;
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
  setFrameRate: _setFrameRate,
  addTimeout,
  clearTimeouts,
}: UseThreatSimulatorGameProps) => {
  const lastFrameTime = useRef<number>(0);
  const animationFrameRef = useRef<number | undefined>(undefined);

  // Particle system
  const [particleSystem] = useState(() => new ParticleSystem());
  const [gameDimensions, setGameDimensions] = useState({
    width: 800,
    height: 600,
  });

  // Weather effects
  const [weatherMode, setWeatherMode] = useState<
    "none" | "rain" | "fog" | "night"
  >("none");

  // Strategic systems
  const [strategicEngine] = useState(() => new StrategicDeploymentEngine());
  const [responseEngine] = useState(() => new ResponseProtocolEngine());
  const [formationManager] = useState(() => new FormationManager());

  // Mission and automation state
  const [missionType, setMissionType] = useState<
    "airport" | "military-base" | "vip-protection" | "border-patrol"
  >("military-base");
  const [automationMode, setAutomationMode] = useState<
    "manual" | "automated" | "hybrid"
  >("hybrid");
  const [showDeploymentZones, setShowDeploymentZones] = useState(false);

  const spawnNewThreat = useCallback(
    (threatType?: "drone" | "swarm" | "stealth") => {
      if (!gameRef.current) return;

      const rect = gameRef.current.getBoundingClientRect();
      const newThreat = spawnThreat(threatType, rect, gameState.level);

      addThreat(newThreat);
    },
    [addThreat, gameState.level, gameRef],
  );

  const moveAllThreats = useCallback(() => {
    if (!gameRef.current) return;

    const rect = gameRef.current.getBoundingClientRect();
    const centerPoint = { x: rect.width / 2, y: rect.height / 2 };

    const movedThreats = moveThreats(
      gameState.threats,
      centerPoint,
      gameState.level,
    );
    updateThreats(movedThreats);
  }, [gameState.threats, updateThreats, gameState.level, gameRef]);

  const neutralizeThreatWithEffects = useCallback(
    (threatId: string) => {
      const threat = gameState.threats.find((t: any) => t.id === threatId);
      if (!threat) return;

      const weapon = gameState.weapons[gameState.selectedWeapon];
      if (!weapon) {
        return;
      }

      const effectiveness = weapon.effectiveness?.[threat.type] ?? 0;
      if (!Number.isFinite(effectiveness) || effectiveness <= 0) {
        return;
      }

      // Check if weapon is effective against this threat type
      if (
        effectiveness < 0.5 &&
        !gameState.activePowerUps.some((p: any) => p.effect.penetration)
      ) {
        // Weapon not effective - reduce damage or miss
        if (Math.random() > effectiveness) {
          return; // Miss
        }
      }

      // Fire weapon (consume resources)
      fireWeapon(threat.x, threat.y);
      consumeEnergy(weapon.damage * 5); // Energy cost based on weapon damage
      consumeCooling(weapon.damage * 2); // Cooling cost based on weapon damage

      // Create explosion effect
      const explosionIntensity = threat.specialProperties?.explosionRadius
        ? 1.5
        : 1;
      particleSystem.createExplosion(threat.x, threat.y, explosionIntensity);

      // Create trail effect
      if (threat.trail.length > 1) {
        const lastTrail = threat.trail[threat.trail.length - 1];
        particleSystem.createTrail(
          lastTrail.x,
          lastTrail.y,
          threat.x,
          threat.y,
        );
      }

      // Handle special threat effects
      if (
        threat.type === "kamikaze" &&
        threat.specialProperties?.explosionRadius
      ) {
        // Area damage to nearby threats
        const nearbyThreats = gameState.threats.filter((t: any) => {
          const distance = Math.sqrt(
            (t.x - threat.x) ** 2 + (t.y - threat.y) ** 2,
          );
          return (
            distance <= (threat.specialProperties?.explosionRadius || 50) &&
            t.id !== threatId
          );
        });

        nearbyThreats.forEach((nearbyThreat: any) => {
          particleSystem.createExplosion(nearbyThreat.x, nearbyThreat.y, 0.8);
          removeThreat(nearbyThreat.id);
          updateScore(50); // Bonus for collateral damage
        });
      }

      removeThreat(threatId);
      updateScore(Math.floor(100 * effectiveness));

      // Check for achievements
      checkAchievements();
    },
    [
      removeThreat,
      updateScore,
      gameState.threats,
      gameState.weapons,
      gameState.selectedWeapon,
      gameState.activePowerUps,
      particleSystem,
      fireWeapon,
      checkAchievements,
      consumeCooling,
      consumeEnergy,
    ],
  );

  const generateSwarm = useCallback(() => {
    clearTimeouts(); // Clear any existing timeouts first
    for (let i = 0; i < 8; i++) {
      addTimeout(() => spawnNewThreat("swarm"), i * 150);
    }
  }, [spawnNewThreat, addTimeout, clearTimeouts]);

  const spawnMultipleDrones = useCallback(
    (count: number) => {
      if (!gameRef.current) return;

      const boundingRect = gameRef.current?.getBoundingClientRect();
      if (!boundingRect) return;

      const drones = Array.from({ length: count }, () =>
        spawnThreat("drone", boundingRect),
      );

      drones.forEach((drone) => addThreat(drone));
    },
    [addThreat, gameRef],
  );

  // Enhanced game loop with frame rate control
  useEffect(() => {
    if (!gameState.isRunning) return;

    const gameLoop = (currentTime: number) => {
      const deltaTime = (currentTime - lastFrameTime.current) / 1000;
      lastFrameTime.current = currentTime;

      // Update particle system
      particleSystem.update(deltaTime);

      // Update game time
      updateGameTime(deltaTime);

      // Update weapon cooldowns
      updateWeaponCooldowns();

      // Update power-ups
      updatePowerUps();

      // Update resources
      updateResources(deltaTime);

      // Update mothership resources
      updateMothershipResources(deltaTime);

      // Update drone positions
      updateDronePositions(deltaTime);

      // Move threats
      moveAllThreats();

      // Spawn new threats based on level and spawn rate
      const timeSinceLastSpawn = currentTime - gameState.lastSpawnTime;
      const shouldSpawn =
        timeSinceLastSpawn > gameState.spawnRate &&
        gameState.threats.length < 5 + gameState.level;

      if (shouldSpawn && Math.random() < 0.3) {
        spawnNewThreat(); // Random threat type
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
    gameState.isRunning,
    gameState.threats.length,
    gameState.level,
    gameState.spawnRate,
    gameState.lastSpawnTime,
    moveAllThreats,
    spawnNewThreat,
    particleSystem,
    updateGameTime,
    updateDronePositions,
    updateMothershipResources,
    updatePowerUps,
    updateResources,
    updateWeaponCooldowns,
  ]);

  // Initialize strategic systems
  useEffect(() => {
    // Initialize strategic deployment zones
    strategicEngine.initializeDeploymentZones(missionType, 800, 600);

    // Initialize response protocols
    responseEngine.initializeDefaultProtocols();

    // Formation manager is already initialized in constructor
  }, [strategicEngine, responseEngine, formationManager, missionType]);

  // Initial threat spawn
  useEffect(() => {
    const timer = setTimeout(() => {
      spawnNewThreat(); // Random threat type
      spawnNewThreat(); // Random threat type
      spawnNewThreat(); // Random threat type
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
