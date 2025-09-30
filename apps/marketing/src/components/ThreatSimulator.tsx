"use client";
import * as React from "react";
import { useCallback, useEffect, useRef } from "react";
import styles from "./ThreatSimulator.module.css";
import { useGameState } from "./hooks/useGameState";
import { useTimeoutManager } from "./hooks/useTimeoutManager";
import { spawnThreat, moveThreats } from "./utils/threatUtils";

interface Threat {
  id: string;
  x: number;
  y: number;
  type: "drone" | "swarm" | "stealth";
  health: number;
  speed: number;
}

export const ThreatSimulator: React.FC = (): JSX.Element => {
  const gameRef = useRef<HTMLDivElement>(null);

  // Custom hooks for state and timeouts
  const {
    gameState,
    updateScore,
    addThreat,
    removeThreat,
    toggleRunningState,
    resetGameState,
  } = useGameState();

  const { addTimeout, clearTimeouts } = useTimeoutManager();

  const spawnNewThreat = useCallback(
    (threatType: "drone" | "swarm" | "stealth" = "drone") => {
      if (!gameRef.current) return;

      const rect = gameRef.current.getBoundingClientRect();
      const newThreat = spawnThreat(threatType, rect);

      addThreat(newThreat);
    },
    [addThreat],
  );

  const moveAllThreats = useCallback(() => {
    if (!gameRef.current) return;

    const rect = gameRef.current.getBoundingClientRect();
    const centerPoint = { x: rect.width / 2, y: rect.height / 2 };

    moveThreats(gameState.threats, centerPoint).forEach((threat) => {
      addThreat(threat);
    });
  }, [gameState.threats, addThreat]);

  const neutralizeThreat = useCallback(
    (threatId: string) => {
      removeThreat(threatId);
      updateScore(100);
    },
    [removeThreat, updateScore],
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

  useEffect(() => {
    if (!gameState.isRunning) return;

    const interval = setInterval(() => {
      moveAllThreats();

      if (gameState.threats.length < 5 && Math.random() < 0.5) {
        spawnNewThreat();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [
    gameState.isRunning,
    gameState.threats.length,
    moveAllThreats,
    spawnNewThreat,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      spawnNewThreat();
      spawnNewThreat();
      spawnNewThreat();
    }, 100);

    return () => clearTimeout(timer);
  }, [spawnNewThreat]);

  useEffect(() => {
    return () => clearTimeouts();
  }, [clearTimeouts]);

  const getThreatAppearance = (type: string) => {
    switch (type) {
      case "drone":
        return { emoji: "🚁", color: "bg-red-500" };
      case "swarm":
        return { emoji: "🐝", color: "bg-orange-500" };
      case "stealth":
        return { emoji: "👻", color: "bg-purple-500" };
      default:
        return { emoji: "🚁", color: "bg-red-500" };
    }
  };

  return (
    <div className="relative w-full h-[600px] bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-green-500/30 overflow-hidden">
      <div
        ref={gameRef}
        className="absolute inset-0 w-full h-full"
        onClick={(e) => {
          const target = e.target as HTMLElement;
          const el = target.closest<HTMLElement>("[data-threat-id]");
          const threatId = el?.getAttribute("data-threat-id");
          if (threatId) neutralizeThreat(threatId);
        }}
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center shadow-2xl z-20">
          <span className="text-2xl">🛡️</span>
        </div>

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 border-2 border-green-500/30 rounded-full opacity-20">
          <div className="absolute top-1/2 left-1/2 w-full h-0.5 bg-gradient-to-r from-transparent via-green-500 to-transparent animate-spin origin-left"></div>
        </div>

        {gameState.threats.map((threat) => {
          const appearance = getThreatAppearance(threat.type);

          return (
            <button
              key={threat.id}
              className={`${styles.threat}`}
              style={{
                left: `${threat.x}px`,
                top: `${threat.y}px`,
              }}
              data-threat-id={threat.id}
              onClick={(e) => {
                e.stopPropagation();
                neutralizeThreat(threat.id);
              }}
              aria-label={`${threat.type} threat`}
            >
              <div>{appearance.emoji}</div>
              <div className={styles.healthBar}>
                <div
                  className={styles.healthFill}
                  style={{
                    width: `${
                      (threat.health /
                        (threat.type === "stealth"
                          ? 3
                          : threat.type === "swarm"
                            ? 2
                            : 1)) *
                      100
                    }%`,
                  }}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
