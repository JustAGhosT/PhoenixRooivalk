"use client";
import * as React from "react";
import { useCallback, useEffect, useRef } from "react";
import styles from "./ThreatSimulator.module.css";
import { useGameState } from "./hooks/useGameState";
import { useTimeoutManager } from "./hooks/useTimeoutManager";
import { moveThreats, spawnThreat } from "./utils/threatUtils";

export const ThreatSimulator: React.FC = (): JSX.Element => {
  const gameRef = useRef<HTMLDivElement>(null);

  // Custom hooks for state and timeouts
  const {
    gameState,
    updateScore,
    addThreat,
    removeThreat,
    updateThreats,
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

    const movedThreats = moveThreats(gameState.threats, centerPoint);
    updateThreats(movedThreats);
  }, [gameState.threats, updateThreats]);

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
        return { emoji: "🚁", color: "bg-red-600 shadow-lg shadow-red-600/50" };
      case "swarm":
        return {
          emoji: "🐝",
          color: "bg-orange-500 shadow-lg shadow-orange-500/50",
        };
      case "stealth":
        return {
          emoji: "👻",
          color: "bg-gray-600 shadow-lg shadow-gray-600/50",
        };
      default:
        return { emoji: "🚁", color: "bg-red-600 shadow-lg shadow-red-600/50" };
    }
  };

  return (
    <div className="relative w-full h-[600px] bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-xl border border-orange-500/30 overflow-hidden shadow-2xl">
      {/* Technical grid background */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
            linear-gradient(rgba(255, 165, 0, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 165, 0, 0.1) 1px, transparent 1px)
          `,
            backgroundSize: "20px 20px",
          }}
        ></div>
      </div>

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
        {/* Phoenix Rooivalk Logo - Central Defense System */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 flex items-center justify-center z-20">
          <div className="relative">
            {/* Phoenix Logo - Stylized */}
            <div className="relative w-16 h-16">
              {/* Phoenix Head */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50"></div>

              {/* Phoenix Wings */}
              <div className="absolute top-2 left-1 w-6 h-8 bg-gradient-to-r from-red-500 via-orange-500 to-red-600 transform -rotate-12 rounded-tl-full shadow-lg"></div>
              <div className="absolute top-2 right-1 w-6 h-8 bg-gradient-to-l from-red-500 via-orange-500 to-red-600 transform rotate-12 rounded-tr-full shadow-lg"></div>

              {/* Phoenix Body */}
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-4 h-8 bg-gradient-to-b from-orange-600 via-red-500 to-red-700 rounded-full"></div>
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-3 h-6 bg-gradient-to-b from-red-600 to-red-800 rounded-full"></div>

              {/* Phoenix Tail */}
              <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-2 h-4 bg-gradient-to-b from-red-700 to-orange-600 rounded-b-full"></div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-1 bg-yellow-400 rounded-full"></div>
            </div>

            {/* Glow effect */}
            <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-lg animate-pulse"></div>
          </div>
        </div>

        {/* Radar Sweep Circle */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 border-2 border-orange-500/30 rounded-full opacity-20">
          <div className="absolute top-1/2 left-1/2 w-full h-0.5 bg-gradient-to-r from-transparent via-orange-500 to-transparent animate-spin origin-left"></div>
        </div>

        {/* Inner defense ring */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-orange-400/20 rounded-full opacity-30"></div>

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
