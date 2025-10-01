"use client";
import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./ThreatSimulator.module.css";
import { useGameState } from "./hooks/useGameState";
import { useTimeoutManager } from "./hooks/useTimeoutManager";
import { moveThreats, spawnThreat } from "./utils/threatUtils";
import { ParticleSystem } from "./utils/particleSystem";
import { ParticleRenderer } from "./ParticleRenderer";

export const ThreatSimulator: React.FC = (): JSX.Element => {
  const gameRef = useRef<HTMLDivElement>(null);
  const lastFrameTime = useRef<number>(0);
  const animationFrameRef = useRef<number>();

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
    addToLeaderboard,
    resetGameState,
  } = useGameState();

  const { addTimeout, clearTimeouts } = useTimeoutManager();

  // Particle system
  const [particleSystem] = useState(() => new ParticleSystem());
  const [gameDimensions, setGameDimensions] = useState({
    width: 800,
    height: 600,
  });

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
      const effectiveness = weapon.effectiveness[threat.type];

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

      // Fire weapon
      fireWeapon(threat.x, threat.y);

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
  ]);

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
          color: "bg-gray-600 shadow-lg shadow-gray-600/50",
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
      <div className="absolute top-2 left-2 right-2 z-50 bg-black/80 backdrop-blur-sm border border-red-500/30 rounded-lg p-2">
        <p className="text-xs text-red-400 text-center font-semibold">
          ⚠️ SIMULATION: This interactive module is designed to visualize
          concepts. It does not represent real-world sensor performance,
          detection ranges, or decision latency.
        </p>
      </div>

      {/* Technical grid background */}
      <div className={styles.technicalGrid}></div>

      {/* Particle Renderer */}
      <ParticleRenderer
        particleSystem={particleSystem}
        width={gameDimensions.width}
        height={gameDimensions.height}
      />

      <div ref={gameRef} className={styles.gameArea}>
        {/* Phoenix Rooivalk Logo - Central Defense System */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 flex items-center justify-center z-20">
          <div className="relative">
            {/* Phoenix Logo - Stylized */}
            <div className="relative w-16 h-16">
              {/* Phoenix Head */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-amber-400 rounded-full shadow-lg shadow-amber-400/30"></div>

              {/* Phoenix Wings */}
              <div className="absolute top-2 left-1 w-6 h-8 bg-gradient-to-r from-red-600 via-orange-500 to-red-600 transform -rotate-12 rounded-tl-full shadow-lg"></div>
              <div className="absolute top-2 right-1 w-6 h-8 bg-gradient-to-l from-red-600 via-orange-500 to-red-600 transform rotate-12 rounded-tr-full shadow-lg"></div>

              {/* Phoenix Body */}
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-4 h-8 bg-gradient-to-b from-orange-600 via-red-500 to-red-700 rounded-full"></div>
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-3 h-6 bg-gradient-to-b from-red-600 to-red-800 rounded-full"></div>

              {/* Phoenix Tail */}
              <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-2 h-4 bg-gradient-to-b from-red-700 to-orange-600 rounded-b-full"></div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-1 bg-amber-400 rounded-full"></div>
            </div>

            {/* Glow effect */}
            <div className="absolute inset-0 bg-orange-500/10 rounded-full blur-lg animate-pulse"></div>
          </div>
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
          const effectiveness = weapon.effectiveness[threat.type];
          const isEffective =
            effectiveness >= 0.5 ||
            gameState.activePowerUps.some((p) => p.effect.penetration);

          return (
            <button
              key={threat.id}
              className={`${styles.threat} ${styles.threatPosition} ${appearance.cssClass} ${
                !isEffective ? "opacity-50" : ""
              }`}
              /* eslint-disable react/forbid-dom-props */
              style={
                {
                  "--threat-x": `${threat.x}px`,
                  "--threat-y": `${threat.y}px`,
                } as React.CSSProperties
              }
              data-threat-id={threat.id}
              onClick={(e) => {
                e.stopPropagation();
                neutralizeThreat(threat.id);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  e.stopPropagation();
                  neutralizeThreat(threat.id);
                }
              }}
              aria-label={`${threat.type} threat with ${threat.health} health. Weapon effectiveness: ${Math.round(effectiveness * 100)}%`}
              title={`${threat.type} - ${Math.round(effectiveness * 100)}% effective`}
            >
              <div>{appearance.emoji}</div>
              <div className={styles.healthBar}>
                <div
                  className={`${styles.healthFill} ${styles.healthBarWidth}`}
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
              {threat.specialProperties?.targetPriority === "high" && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              )}
            </button>
          );
        })}

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
    </div>
  );
};
