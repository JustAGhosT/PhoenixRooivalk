"use client";
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */
import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ParticleRenderer } from "./ParticleRenderer";
import styles from "./ThreatSimulator.module.css";
import { useGameState } from "./hooks/useGameState";
import { useTimeoutManager } from "./hooks/useTimeoutManager";
import { FormationManager } from "./utils/formationManager";
import { ParticleSystem } from "./utils/particleSystem";
import { ResponseProtocolEngine } from "./utils/responseProtocols";
import { StrategicDeploymentEngine } from "./utils/strategicDeployment";
import { moveThreats, spawnThreat } from "./utils/threatUtils";

interface ThreatSimulatorProps {
  isTeaser?: boolean;
  autoFullscreen?: boolean;
}

export const ThreatSimulator: React.FC<ThreatSimulatorProps> = ({
  isTeaser = false,
  autoFullscreen = false,
}): JSX.Element => {
  const gameRef = useRef<HTMLDivElement>(null);
  const lastFrameTime = useRef<number>(0);
  const animationFrameRef = useRef<number | undefined>(undefined);

  // Custom hooks for state and timeouts
  const {
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
    // addToLeaderboard, // TODO: Implement leaderboard UI
    updateResources,
    consumeEnergy,
    consumeCooling,
    selectThreat,
    clearSelection,
    setSelectionBox,
    setThreatPriority,
    // removeThreatPriority, // TODO: Implement priority removal UI
    deployDrone,
    // updateDrones, // TODO: Implement drone update UI
    selectDroneType,
    updateMothershipResources,
    returnDroneToBase,
    updateDronePositions,
    resetGameState,
  } = useGameState();

  const { addTimeout, clearTimeouts } = useTimeoutManager();

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

  // Mouse interaction state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragMode, setDragMode] = useState<"select" | "area-weapon">("select");

  // UI state
  const [showSimulationWarning, setShowSimulationWarning] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Fullscreen functionality
  const enterFullscreen = useCallback(async () => {
    if (gameRef.current && !document.fullscreenElement) {
      try {
        await gameRef.current.requestFullscreen();
        setIsFullscreen(true);
      } catch (error) {
        // Fullscreen not supported or denied
      }
    }
  }, []);

  const exitFullscreen = useCallback(async () => {
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
        setIsFullscreen(false);
      } catch (error) {
        // Exit fullscreen failed
      }
    }
  }, []);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

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
    [addThreat, gameState.level],
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
  }, [gameState.threats, updateThreats, gameState.level]);

  const neutralizeThreat = useCallback(
    (threatId: string) => {
      const threat = gameState.threats.find((t) => t.id === threatId);
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
        !gameState.activePowerUps.some((p) => p.effect.penetration)
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
        const nearbyThreats = gameState.threats.filter((t) => {
          const distance = Math.sqrt(
            (t.x - threat.x) ** 2 + (t.y - threat.y) ** 2,
          );
          return (
            distance <= (threat.specialProperties?.explosionRadius || 50) &&
            t.id !== threatId
          );
        });

        nearbyThreats.forEach((nearbyThreat) => {
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
    clearTimeouts();
    for (let i = 0; i < 8; i++) {
      addTimeout(() => spawnNewThreat("swarm"), i * 150);
    }
  }, [clearTimeouts, addTimeout, spawnNewThreat]);

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
    [addThreat],
  );

  const resetGame = useCallback(() => {
    clearTimeouts();
    resetGameState();
  }, [clearTimeouts, resetGameState]);

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
  }, []);

  useEffect(() => {
    return () => clearTimeouts();
  }, [clearTimeouts]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default for game shortcuts
      if (e.ctrlKey || e.metaKey) return;

      switch (e.key) {
        case "1":
          e.preventDefault();
          switchWeapon("kinetic");
          break;
        case "2":
          e.preventDefault();
          switchWeapon("electronic");
          break;
        case "3":
          e.preventDefault();
          switchWeapon("laser");
          break;
        case "w":
          e.preventDefault();
          if (gameState.selectedDroneType) {
            deployDrone(
              gameState.selectedDroneType,
              gameState.mothership.x,
              gameState.mothership.y - 100,
            );
          }
          break;
        case "s":
          e.preventDefault();
          if (gameState.selectedDroneType) {
            deployDrone(
              gameState.selectedDroneType,
              gameState.mothership.x,
              gameState.mothership.y + 100,
            );
          }
          break;
        case "a":
          e.preventDefault();
          if (gameState.selectedDroneType) {
            deployDrone(
              gameState.selectedDroneType,
              gameState.mothership.x - 100,
              gameState.mothership.y,
            );
          }
          break;
        case "d":
          e.preventDefault();
          if (gameState.selectedDroneType) {
            deployDrone(
              gameState.selectedDroneType,
              gameState.mothership.x + 100,
              gameState.mothership.y,
            );
          }
          break;
        case "Escape":
          e.preventDefault();
          clearSelection();
          selectDroneType(null);
          break;
        case " ":
          e.preventDefault();
          toggleRunningState();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    switchWeapon,
    gameState.selectedDroneType,
    gameState.mothership.x,
    gameState.mothership.y,
    deployDrone,
    clearSelection,
    selectDroneType,
    toggleRunningState,
  ]);

  // Mouse event handlers for selection and priority targeting
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button === 0) {
        // Left click
        const rect = gameRef.current?.getBoundingClientRect();
        if (rect) {
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          setDragStart({ x, y });
          setIsDragging(true);

          // Check if we're in area weapon mode (hold Shift for area effect)
          const isAreaWeapon =
            e.shiftKey && gameState.selectedWeapon === "electronic";
          setDragMode(isAreaWeapon ? "area-weapon" : "select");

          setSelectionBox({
            startX: x,
            startY: y,
            endX: x,
            endY: y,
            isActive: true,
          });
        }
      }
    },
    [gameState.selectedWeapon, setSelectionBox],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging && gameRef.current) {
        const rect = gameRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setSelectionBox({
          startX: dragStart.x,
          startY: dragStart.y,
          endX: x,
          endY: y,
          isActive: true,
        });
      }
    },
    [isDragging, dragStart, setSelectionBox],
  );

  const handleMouseUp = useCallback(
    (_e: React.MouseEvent) => {
      if (isDragging) {
        setIsDragging(false);
        setSelectionBox(null);

        // Handle selection box actions
        if (gameState.selectionBox) {
          const minX = Math.min(
            gameState.selectionBox.startX,
            gameState.selectionBox.endX,
          );
          const maxX = Math.max(
            gameState.selectionBox.startX,
            gameState.selectionBox.endX,
          );
          const minY = Math.min(
            gameState.selectionBox.startY,
            gameState.selectionBox.endY,
          );
          const maxY = Math.max(
            gameState.selectionBox.startY,
            gameState.selectionBox.endY,
          );

          const selectedThreats = gameState.threats.filter((threat) => {
            return (
              threat.x >= minX &&
              threat.x <= maxX &&
              threat.y >= minY &&
              threat.y <= maxY
            );
          });

          if (dragMode === "area-weapon") {
            // Area effect weapon - neutralize all threats in selection
            selectedThreats.forEach((threat) => {
              neutralizeThreat(threat.id);
              // Create area effect explosion
              particleSystem.createExplosion(threat.x, threat.y, 1.2);
            });

            // Consume additional energy for area effect
            consumeEnergy(selectedThreats.length * 10);
          } else {
            // Normal selection mode
            selectedThreats.forEach((threat) => {
              selectThreat(threat.id);
            });
          }
        }
      }
    },
    [
      isDragging,
      gameState.selectionBox,
      gameState.threats,
      selectThreat,
      dragMode,
      neutralizeThreat,
      particleSystem,
      consumeEnergy,
      setSelectionBox,
    ],
  );

  const handleThreatClick = useCallback(
    (e: React.MouseEvent, threatId: string) => {
      e.stopPropagation();

      if (e.button === 0) {
        // Left click - select threat
        selectThreat(threatId);
      } else if (e.button === 1) {
        // Middle click - set priority
        const currentPriority = gameState.priorityThreats[threatId] as
          | string
          | undefined;
        if (currentPriority === "high") {
          setThreatPriority(threatId, "medium");
        } else if (currentPriority === "medium") {
          setThreatPriority(threatId, "low");
        } else {
          setThreatPriority(threatId, "high");
        }
      } else if (e.button === 2) {
        // Right click - neutralize
        neutralizeThreat(threatId);
      }
    },
    [
      selectThreat,
      gameState.priorityThreats,
      setThreatPriority,
      neutralizeThreat,
    ],
  );

  // Enhanced mouse controls with drone deployment
  const handleGameAreaClick = useCallback(
    (e: React.MouseEvent) => {
      if (!gameRef.current) return;

      const rect = gameRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (e.button === 0 && !isDragging) {
        // Left click - deploy selected drone type or select weapon
        if (gameState.selectedDroneType) {
          deployDrone(gameState.selectedDroneType, x, y);
        } else {
          switchWeapon("kinetic");
        }
      } else if (e.button === 1) {
        // Middle click - deploy jammer drone
        deployDrone("jammer", x, y);
      } else if (e.button === 2) {
        // Right click - deploy surveillance drone
        deployDrone("surveillance", x, y);
      }
    },
    [gameState.selectedDroneType, deployDrone, switchWeapon, isDragging],
  );

  // Keyboard handler for game area
  const handleGameAreaKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!gameRef.current) return;

      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        // Deploy selected drone type at center of game area
        if (gameState.selectedDroneType) {
          const rect = gameRef.current.getBoundingClientRect();
          const x = rect.width / 2;
          const y = rect.height / 2;
          deployDrone(gameState.selectedDroneType, x, y);
        } else {
          switchWeapon("kinetic");
        }
      }
    },
    [gameState.selectedDroneType, deployDrone, switchWeapon],
  );

  // Wheel event for weapon cycling
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const weapons = ["kinetic", "electronic", "laser"] as const;
      const currentIndex = weapons.indexOf(
        gameState.selectedWeapon as (typeof weapons)[number],
      );

      if (e.deltaY > 0) {
        // Scroll down - next weapon
        const nextIndex = (currentIndex + 1) % weapons.length;
        const nextWeapon = weapons[nextIndex];
        if (nextWeapon) {
          switchWeapon(nextWeapon);
        }
      } else {
        // Scroll up - previous weapon
        const prevIndex =
          currentIndex === 0 ? weapons.length - 1 : currentIndex - 1;
        const prevWeapon = weapons[prevIndex];
        if (prevWeapon) {
          switchWeapon(prevWeapon);
        }
      }
    },
    [gameState.selectedWeapon, switchWeapon],
  );

  const getThreatAppearance = (type: string) => {
    switch (type) {
      case "drone":
        return {
          emoji: "🚁",
          color: "bg-red-600 shadow-lg shadow-red-600/50",
          cssClass: "",
        };
      case "swarm":
        return {
          emoji: "🐝",
          color: "bg-orange-500 shadow-lg shadow-orange-500/50",
          cssClass: "",
        };
      case "stealth":
        return {
          emoji: "👻",
          color: "bg-tactical-gray shadow-lg shadow-gray-600/50",
          cssClass: "",
        };
      case "kamikaze":
        return {
          emoji: "💥",
          color: "bg-red-800 shadow-lg shadow-red-800/60",
          cssClass: styles.threatKamikaze,
        };
      case "decoy":
        return {
          emoji: "🎭",
          color: "bg-gray-500 shadow-lg shadow-gray-500/40",
          cssClass: styles.threatDecoy,
        };
      case "shielded":
        return {
          emoji: "🛡️",
          color: "bg-blue-700 shadow-lg shadow-blue-700/60",
          cssClass: styles.threatShielded,
        };
      default:
        return {
          emoji: "🚁",
          color: "bg-red-600 shadow-lg shadow-red-600/50",
          cssClass: "",
        };
    }
  };

  return (
    <div className="relative w-full h-[600px] bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 rounded-xl border border-red-500/20 overflow-hidden shadow-2xl">
      {/* Critical Simulation Disclaimer */}
      {showSimulationWarning && (
        <div className="absolute top-2 left-2 right-2 z-50 bg-black/80 backdrop-blur-sm border border-red-500/30 rounded-lg p-2">
          <div className="flex items-center justify-between">
            <p className="text-xs text-red-400 font-semibold flex-1">
              ⚠️ SIMULATION: This interactive module is designed to visualize
              concepts. It does not represent real-world sensor performance,
              detection ranges, or decision latency.
            </p>
            <button
              onClick={() => setShowSimulationWarning(false)}
              className="ml-3 text-red-400 hover:text-red-300 transition-colors"
              title="Close warning"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Control Instructions */}
      <div className="absolute top-16 left-2 z-40 bg-black/80 backdrop-blur-sm border border-orange-500/30 rounded-lg p-2">
        <div className="text-xs text-orange-400 font-semibold mb-1">
          CONTROLS:
        </div>
        <div className="text-xs text-gray-300 space-y-1">
          <div>
            • <span className="text-orange-400">Left Click:</span> Deploy
            selected drone
          </div>
          <div>
            • <span className="text-orange-400">Middle Click:</span> Deploy
            jammer drone
          </div>
          <div>
            • <span className="text-orange-400">Right Click:</span> Deploy
            surveillance drone
          </div>
          <div>
            • <span className="text-orange-400">Scroll Wheel:</span> Cycle
            weapons
          </div>
          <div>
            • <span className="text-orange-400">Drag:</span> Multi-select
            threats
          </div>
          <div>
            • <span className="text-orange-400">Shift+Drag:</span> Area effect
            weapon
          </div>
          <div>
            • <span className="text-orange-400">Click Drone:</span> Return to
            base
          </div>
          <div>
            • <span className="text-orange-400">Click Bay:</span> Select drone
            type
          </div>
          <div className="mt-2 pt-1 border-t border-gray-600">
            <div className="text-orange-400 font-semibold mb-1">KEYBOARD:</div>
            <div>
              • <span className="text-orange-400">1-3:</span> Select weapons
            </div>
            <div>
              • <span className="text-orange-400">WASD:</span> Deploy drones
            </div>
            <div>
              • <span className="text-orange-400">ESC:</span> Clear selection
            </div>
            <div>
              • <span className="text-orange-400">SPACE:</span> Pause/Resume
            </div>
          </div>
        </div>
      </div>

      {/* Technical grid background */}
      <div className={styles.technicalGrid}></div>

      {/* Weather Effects */}
      {weatherMode === "rain" && <div className={styles.weatherRain}></div>}
      {weatherMode === "fog" && <div className={styles.weatherFog}></div>}

      {/* Selection Box */}
      {gameState.selectionBox && (
        <div
          className={styles.selectionBox}
          style={{
            left: Math.min(
              gameState.selectionBox.startX,
              gameState.selectionBox.endX,
            ),
            top: Math.min(
              gameState.selectionBox.startY,
              gameState.selectionBox.endY,
            ),
            width: Math.abs(
              gameState.selectionBox.endX - gameState.selectionBox.startX,
            ),
            height: Math.abs(
              gameState.selectionBox.endY - gameState.selectionBox.startY,
            ),
          }}
        />
      )}

      {/* Particle Renderer */}
      <ParticleRenderer
        particleSystem={particleSystem}
        width={gameDimensions.width}
        height={gameDimensions.height}
      />

      <div
        ref={gameRef}
        className={`${styles.gameArea} ${weatherMode === "night" ? styles.nightVision : ""}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        onContextMenu={(e) => e.preventDefault()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleRunningState();
          }
        }}
        role="application"
        aria-label="Threat Simulator Game Area"
        tabIndex={0}
      >
        {/* Phoenix Rooivalk Mothership - Central Command */}
        <div
          className={`${styles.mothership}`}
          style={{
            left: `${gameState.mothership.x - 48}px`,
            top: `${gameState.mothership.y - 48}px`,
          }}
          onClick={handleGameAreaClick}
          onKeyDown={handleGameAreaKeyDown}
          role="button"
          aria-label="Mothership command center"
          tabIndex={0}
        >
          {/* Mothership Core */}
          <div className={styles.mothershipCore}></div>

          {/* Deployment Bays */}
          {gameState.deploymentBays.map((bay) => (
            <div
              key={bay.id}
              className={`${styles.deploymentBay} ${
                bay.currentDrones > 0
                  ? styles.deploymentBayReady
                  : styles.deploymentBayEmpty
              }`}
              style={{
                left: `${bay.x - 12}px`,
                top: `${bay.y - 12}px`,
              }}
              onClick={(e) => {
                e.stopPropagation();
                selectDroneType(bay.currentDrones > 0 ? bay.droneType : null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  e.stopPropagation();
                  selectDroneType(bay.currentDrones > 0 ? bay.droneType : null);
                }
              }}
              role="button"
              aria-label={`Deployment bay for ${bay.droneType} drones`}
              tabIndex={0}
              title={`${bay.droneType} Bay: ${bay.currentDrones}/${bay.capacity} drones`}
            >
              <div className={styles.deploymentBayIndicator}></div>
            </div>
          ))}
        </div>

        {/* Detection Coverage Visualization */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80">
          {/* Outer detection ring */}
          <div className="absolute inset-0 border-2 border-[var(--primary)]/20 rounded-full opacity-30 animate-pulse"></div>

          {/* Radar sweep line */}
          <div className="absolute top-1/2 left-1/2 w-full h-0.5 bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent animate-spin origin-left opacity-60"></div>

          {/* Coverage zones */}
          <div className="absolute inset-4 border border-[var(--accent)]/15 rounded-full opacity-25"></div>
          <div className="absolute inset-8 border border-[var(--primary)]/10 rounded-full opacity-20"></div>

          {/* Detection pings */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-2 h-2 bg-[var(--accent)] rounded-full animate-ping opacity-75"></div>
          </div>
        </div>

        {/* Strategic Deployment Zones */}
        {showDeploymentZones &&
          strategicEngine.getDeploymentZones().map((zone) => (
            <div
              key={zone.id}
              className="absolute border-2 border-dashed rounded-full pointer-events-none"
              style={{
                left: `${zone.centerX - zone.radius}px`,
                top: `${zone.centerY - zone.radius}px`,
                width: `${zone.radius * 2}px`,
                height: `${zone.radius * 2}px`,
                borderColor:
                  zone.priority === "critical"
                    ? "#ef4444"
                    : zone.priority === "high"
                      ? "#f97316"
                      : zone.priority === "medium"
                        ? "#eab308"
                        : "#84cc16",
                opacity: 0.6,
              }}
            >
              {/* Zone label */}
              <div
                className="absolute text-xs font-mono text-white bg-black/50 px-1 rounded"
                style={{
                  left: "50%",
                  top: "-20px",
                  transform: "translateX(-50%)",
                }}
              >
                {zone.name}
              </div>

              {/* Coverage indicator */}
              <div
                className="absolute text-xs font-mono text-white bg-black/50 px-1 rounded"
                style={{
                  left: "50%",
                  bottom: "-20px",
                  transform: "translateX(-50%)",
                }}
              >
                {Math.round(zone.coverage * 100)}%
              </div>

              {/* Threat level indicator */}
              <div
                className="absolute w-2 h-2 rounded-full"
                style={{
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  backgroundColor:
                    zone.threatLevel > 0.7
                      ? "#ef4444"
                      : zone.threatLevel > 0.4
                        ? "#f97316"
                        : "#84cc16",
                }}
              ></div>
            </div>
          ))}

        {/* Inner defense ring */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-[var(--primary)]/15 rounded-full opacity-30">
          <div className="absolute inset-2 border border-[var(--accent)]/10 rounded-full opacity-20"></div>
        </div>

        {/* Detection range indicators */}
        <div className="absolute top-4 left-4 text-xs text-[var(--accent)] font-mono opacity-70">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-[var(--primary)] rounded-full animate-pulse"></div>
            <span>5km Detection</span>
          </div>
        </div>

        <div className="absolute top-4 right-4 text-xs text-[var(--accent)] font-mono opacity-70">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-[var(--accent)] rounded-full animate-pulse"></div>
            <span>2km Engage</span>
          </div>
        </div>

        {gameState.threats.map((threat) => {
          const appearance = getThreatAppearance(threat.type);
          const weapon = gameState.weapons[gameState.selectedWeapon];
          const effectiveness = weapon?.effectiveness?.[threat.type] ?? 0;
          const isEffective =
            effectiveness >= 0.5 ||
            gameState.activePowerUps.some((p) => p.effect.penetration);
          const isSelected = gameState.selectedThreats.includes(threat.id);
          const priority =
            gameState.priorityThreats[threat.id] ||
            threat.specialProperties?.targetPriority ||
            "medium";

          return (
            <button
              key={threat.id}
              className={`${styles.threat} ${styles.threatPosition} ${appearance.cssClass} ${
                !isEffective ? "opacity-50" : ""
              } ${isSelected ? styles.threatSelected : ""}`}
              /* eslint-disable react/forbid-dom-props */
              style={
                {
                  "--threat-x": `${threat.x}px`,
                  "--threat-y": `${threat.y}px`,
                } as React.CSSProperties
              }
              data-threat-id={threat.id}
              onMouseDown={(e) => handleThreatClick(e, threat.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  e.stopPropagation();
                  neutralizeThreat(threat.id);
                }
              }}
              aria-label={`${threat.type} threat with ${threat.health} health. Weapon effectiveness: ${Math.round(effectiveness * 100)}%. Priority: ${priority}`}
              title={`${threat.type} - ${Math.round(effectiveness * 100)}% effective. Priority: ${priority}`}
            >
              <div>{appearance.emoji}</div>
              <div className={styles.threatHealthBar}>
                <div
                  className={`${styles.threatHealthFill} ${styles.healthBarWidth}`}
                  /* eslint-disable react/forbid-dom-props */
                  style={
                    {
                      "--health-width": `${
                        (threat.health /
                          (threat.type === "stealth"
                            ? 3
                            : threat.type === "swarm"
                              ? 2
                              : threat.type === "shielded"
                                ? 4
                                : threat.type === "kamikaze"
                                  ? 1
                                  : threat.type === "decoy"
                                    ? 0.5
                                    : 1)) *
                        100
                      }%`,
                    } as React.CSSProperties
                  }
                />
              </div>

              {/* Priority indicator */}
              <div
                className={`${styles.priorityIndicator} ${styles[`priority${priority.charAt(0).toUpperCase() + priority.slice(1)}`]}`}
              ></div>

              {/* Trajectory prediction */}
              {priority === "high" && (
                <div
                  className={styles.trajectoryPrediction}
                  style={{
                    left: threat.x,
                    top: threat.y,
                    width: "100px",
                    height: "2px",
                    transform: `rotate(${(Math.atan2(300 - threat.y, 400 - threat.x) * 180) / Math.PI}deg)`,
                  }}
                />
              )}
            </button>
          );
        })}

        {/* Deployed Drones */}
        {gameState.drones.map((drone) => (
          <button
            key={drone.id}
            className={`${styles.deployedDrone} ${styles[`drone${drone.type.charAt(0).toUpperCase() + drone.type.slice(1)}`]} ${
              drone.isReturning ? styles.droneReturning : ""
            }`}
            style={{
              left: `${drone.x - 8}px`,
              top: `${drone.y - 8}px`,
            }}
            onClick={(e) => {
              e.stopPropagation();
              returnDroneToBase(drone.id);
            }}
            title={`${drone.type} Drone - Mission: ${drone.mission} - Energy: ${Math.round(drone.energy)}/${drone.maxEnergy}`}
          >
            {/* Mission Indicator */}
            <div
              className={`${styles.droneMissionIndicator} ${styles[`mission${drone.mission.charAt(0).toUpperCase() + drone.mission.slice(1)}`]}`}
            ></div>
          </button>
        ))}

        {/* Enhanced Stats Overlay */}
        <div className={styles.statsOverlay}>
          <div className={styles.statsContent}>
            <div className={styles.statItem}>
              <div className={styles.statValue}>
                {gameState.score.toLocaleString()}
              </div>
              <div className={styles.statLabel}>SCORE</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>{gameState.threats.length}</div>
              <div className={styles.statLabel}>THREATS</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>{gameState.neutralized}</div>
              <div className={styles.statLabel}>NEUTRALIZED</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>{gameState.level}</div>
              <div className={styles.statLabel}>LEVEL</div>
            </div>
          </div>
        </div>

        {/* Combo Indicator */}
        {gameState.comboMultiplier > 1 && (
          <div className={styles.comboIndicator}>
            COMBO x{gameState.comboMultiplier.toFixed(1)}
          </div>
        )}

        {/* Weapon Selection */}
        <div className={styles.weaponSelection}>
          <div className="text-xs text-gray-300 mb-2">WEAPONS</div>
          {Object.entries(gameState.weapons).map(([weaponId, weapon]) => (
            <button
              key={weaponId}
              className={`${styles.weaponButton} ${
                gameState.selectedWeapon === weaponId
                  ? styles.weaponButtonActive
                  : styles.weaponButtonInactive
              } ${!weapon.isReady || weapon.ammo <= 0 ? styles.weaponButtonDisabled : ""}`}
              onClick={() => switchWeapon(weaponId)}
              disabled={!weapon.isReady || weapon.ammo <= 0}
            >
              <div className="font-bold">{weapon.name.split(" ")[0]}</div>
              <div className="text-xs">
                {weapon.ammo}/{weapon.maxAmmo}
              </div>
            </button>
          ))}
        </div>

        {/* Ammo Display */}
        <div className={styles.ammoDisplay}>
          <div className="text-xs text-gray-300 mb-1">AMMO</div>
          <div className={styles.ammoBar}>
            <div
              className={styles.ammoFill}
              style={{
                width: `${
                  (gameState.weapons[gameState.selectedWeapon].ammo /
                    gameState.weapons[gameState.selectedWeapon].maxAmmo) *
                  100
                }%`,
              }}
            />
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {gameState.weapons[gameState.selectedWeapon].ammo}/
            {gameState.weapons[gameState.selectedWeapon].maxAmmo}
          </div>
        </div>

        {/* Active Power-ups */}
        {gameState.activePowerUps.map((powerUp) => (
          <div key={powerUp.id} className={styles.powerUpIndicator}>
            {powerUp.name.toUpperCase()}
          </div>
        ))}

        {/* Achievement Notifications */}
        {gameState.achievements.length > 0 && (
          <div className={styles.achievementNotification}>
            🏆 ACHIEVEMENT UNLOCKED! 🏆
            <br />
            {gameState.achievements[gameState.achievements.length - 1]
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
          </div>
        )}

        {/* Mothership Resource Display */}
        <div className={styles.mothershipResources}>
          <div className="text-xs text-gray-300 mb-2">MOTHERSHIP</div>
          <div className="mb-2">
            <div className={styles.resourceLabel}>ENERGY</div>
            <div className={styles.mothershipResourceBar}>
              <div
                className={styles.mothershipResourceFill}
                style={{
                  width: `${(gameState.mothership.energy / gameState.mothership.maxEnergy) * 100}%`,
                }}
              />
            </div>
            <div className="text-xs text-gray-400">
              {Math.round(gameState.mothership.energy)}/
              {gameState.mothership.maxEnergy}
            </div>
          </div>
          <div className="mb-2">
            <div className={styles.resourceLabel}>FUEL</div>
            <div className={styles.mothershipResourceBar}>
              <div
                className={styles.mothershipResourceFill}
                style={{
                  width: `${(gameState.mothership.fuel / gameState.mothership.maxFuel) * 100}%`,
                }}
              />
            </div>
            <div className="text-xs text-gray-400">
              {Math.round(gameState.mothership.fuel)}/
              {gameState.mothership.maxFuel}
            </div>
          </div>
          <div className="text-xs text-gray-400">
            Drones: {gameState.drones.length}/
            {gameState.mothership.droneCapacity}
          </div>
        </div>

        {/* Resource Management Display */}
        <div className={styles.resourceDisplay}>
          <div className="text-xs text-gray-300 mb-2">RESOURCES</div>
          <div className="mb-2">
            <div className={styles.resourceLabel}>ENERGY</div>
            <div className={styles.resourceBar}>
              <div
                className={styles.resourceBarEnergy}
                style={{
                  width: `${(gameState.energy / gameState.maxEnergy) * 100}%`,
                }}
              />
            </div>
            <div className="text-xs text-gray-400">
              {Math.round(gameState.energy)}/{gameState.maxEnergy}
            </div>
          </div>
          <div>
            <div className={styles.resourceLabel}>COOLING</div>
            <div className={styles.resourceBar}>
              <div
                className={styles.resourceBarCooling}
                style={{
                  width: `${(gameState.cooling / gameState.maxCooling) * 100}%`,
                }}
              />
            </div>
            <div className="text-xs text-gray-400">
              {Math.round(gameState.cooling)}/{gameState.maxCooling}
            </div>
          </div>
        </div>

        {/* Mini-map */}
        <div className={styles.miniMap}>
          <div className="text-xs text-gray-300 mb-1 text-center">RADAR</div>
          <div className={styles.miniMapCenter}></div>
          {gameState.threats.map((threat) => {
            const scale = 120; // Mini-map scale factor
            const centerX = 60; // Mini-map center X
            const centerY = 60; // Mini-map center Y
            const mapX =
              centerX + (threat.x - gameDimensions.width / 2) / scale;
            const mapY =
              centerY + (threat.y - gameDimensions.height / 2) / scale;

            if (mapX >= 0 && mapX <= 120 && mapY >= 0 && mapY <= 120) {
              return (
                <div
                  key={threat.id}
                  className={styles.miniMapThreat}
                  style={{
                    left: `${mapX}px`,
                    top: `${mapY}px`,
                    backgroundColor:
                      threat.specialProperties?.targetPriority === "high"
                        ? "#ef4444"
                        : "#f97316",
                  }}
                />
              );
            }
            return null;
          })}
        </div>

        {/* Drone Selection Controls */}
        <div className="absolute bottom-4 left-4 backdrop-blur-sm border rounded-md shadow-lg bg-black/80 border-orange-500/30 p-2">
          <div className="text-xs text-gray-300 mb-2">DRONE DEPLOYMENT</div>
          <div className="flex gap-1 flex-wrap">
            {(
              [
                "interceptor",
                "jammer",
                "surveillance",
                "shield",
                "swarm-coordinator",
              ] as const
            ).map((droneType) => {
              const bay = gameState.deploymentBays.find(
                (b) => b.droneType === droneType,
              );
              const isSelected = gameState.selectedDroneType === droneType;
              const isAvailable = bay && bay.currentDrones > 0;

              return (
                <button
                  key={droneType}
                  onClick={() =>
                    selectDroneType(isAvailable ? droneType : null)
                  }
                  className={`px-2 py-1 text-xs rounded ${
                    isSelected
                      ? "bg-orange-500 text-white"
                      : isAvailable
                        ? "bg-tactical-gray text-gray-300 hover:bg-gray-500"
                        : "bg-gray-800 text-gray-500 cursor-not-allowed"
                  }`}
                  disabled={!isAvailable}
                  title={`${droneType}: ${bay?.currentDrones || 0}/${bay?.capacity || 0} available`}
                >
                  {droneType.toUpperCase().split("-")[0]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Weather Controls */}
        <div className="absolute bottom-4 left-48 backdrop-blur-sm border rounded-md shadow-lg bg-black/80 border-orange-500/30 p-2">
          <div className="text-xs text-gray-300 mb-2">WEATHER</div>
          <div className="flex gap-1">
            {(["none", "rain", "fog", "night"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setWeatherMode(mode)}
                className={`px-2 py-1 text-xs rounded ${
                  weatherMode === mode
                    ? "bg-orange-500 text-white"
                    : "bg-tactical-gray text-gray-300 hover:bg-gray-500"
                }`}
              >
                {mode.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Mission Controls */}
        <div className="absolute bottom-4 left-80 backdrop-blur-sm border rounded-md shadow-lg bg-black/80 border-orange-500/30 p-2">
          <div className="text-xs text-gray-300 mb-2">MISSION</div>
          <div className="flex gap-1 flex-wrap">
            {(
              [
                "military-base",
                "airport",
                "vip-protection",
                "border-patrol",
              ] as const
            ).map((mission) => (
              <button
                key={mission}
                onClick={() => setMissionType(mission)}
                className={`px-2 py-1 text-xs rounded ${
                  missionType === mission
                    ? "bg-orange-500 text-white"
                    : "bg-tactical-gray text-gray-300 hover:bg-gray-500"
                }`}
              >
                {mission.replace("-", " ").toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Automation Controls */}
        <div className="absolute bottom-4 left-[28rem] backdrop-blur-sm border rounded-md shadow-lg bg-black/80 border-orange-500/30 p-2">
          <div className="text-xs text-gray-300 mb-2">AUTOMATION</div>
          <div className="flex gap-1">
            {(["manual", "automated", "hybrid"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setAutomationMode(mode)}
                className={`px-2 py-1 text-xs rounded ${
                  automationMode === mode
                    ? "bg-orange-500 text-white"
                    : "bg-tactical-gray text-gray-300 hover:bg-gray-500"
                }`}
              >
                {mode.toUpperCase()}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowDeploymentZones(!showDeploymentZones)}
            className={`mt-1 px-2 py-1 text-xs rounded w-full ${
              showDeploymentZones
                ? "bg-green-500 text-white"
                : "bg-tactical-gray text-gray-300 hover:bg-gray-500"
            }`}
          >
            {showDeploymentZones ? "HIDE ZONES" : "SHOW ZONES"}
          </button>
        </div>

        {/* Interactive Controls */}
        <div className={styles.controlsOverlay}>
          <div className={styles.controlsContent}>
            <button
              onClick={toggleRunningState}
              className={`${styles.controlButton} ${
                gameState.isRunning
                  ? styles.controlButtonOrange
                  : styles.controlButtonGray
              }`}
            >
              {gameState.isRunning ? "PAUSE" : "RESUME"}
            </button>
            <button
              onClick={generateSwarm}
              className={`${styles.controlButton} ${styles.controlButtonOrange}`}
            >
              SWARM
            </button>
            <button
              onClick={() => spawnMultipleDrones(5)}
              className={`${styles.controlButton} ${styles.controlButtonOrange}`}
            >
              +5 DRONES
            </button>
            <button
              onClick={() => activatePowerUp("multi-shot")}
              className={`${styles.controlButton} ${styles.controlButtonOrange}`}
            >
              POWER-UP
            </button>
            <button
              onClick={clearSelection}
              className={`${styles.controlButton} ${styles.controlButtonGray}`}
            >
              CLEAR SEL
            </button>
            <button
              onClick={resetGame}
              className={`${styles.controlButton} ${styles.controlButtonGray}`}
            >
              RESET
            </button>
          </div>
        </div>

        {/* Frame Rate Control */}
        <div className={styles.frameRateControl}>
          <div className="text-xs text-gray-300 mb-1">FPS</div>
          <input
            type="range"
            min="30"
            max="120"
            step="10"
            value={gameState.targetFrameRate}
            onChange={(e) => setFrameRate(parseInt(e.target.value))}
            className={styles.frameRateSlider}
          />
          <div className="text-xs text-gray-400 mt-1">
            {gameState.targetFrameRate}
          </div>
        </div>
      </div>

      {/* Teaser Overlay */}
      {isTeaser && !isFullscreen && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center p-8 max-w-md">
            <div className="mb-6">
              <div className="text-6xl mb-4">🎮</div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Experience Full Defense
              </h3>
              <p className="text-gray-300 text-sm mb-6">
                This is a preview of the Phoenix Rooivalk defense system
                simulator. Enter full-screen mode to access all features and
                controls.
              </p>
            </div>

            <button
              onClick={enterFullscreen}
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              🚀 Enter Full-Screen Mode
            </button>

            <p className="text-xs text-gray-400 mt-4">
              Press ESC to exit full-screen at any time
            </p>
          </div>
        </div>
      )}

      {/* Fullscreen Exit Button */}
      {isFullscreen && (
        <button
          onClick={exitFullscreen}
          className="absolute top-4 right-4 z-50 bg-black/80 text-white p-2 rounded-lg hover:bg-black/90 transition-colors"
          title="Exit Fullscreen (ESC)"
        >
          ✕
        </button>
      )}
    </div>
  );
};
