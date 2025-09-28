"use client";
import React, { useEffect, useRef } from "react";
import { GameInstructions } from "./GameInstructions";
import { ThreatLegend } from "./ThreatLegend";
import { ExternalControls } from "./ExternalControls";
import { GameOverlay } from "./GameOverlay";
import { FramerateLoopControls } from "./FramerateLoopControls";
import { useThreatGame } from "./hooks/useThreatGame";
import { useThreatSpawner } from "./hooks/useThreatSpawner";
import { useDragAndDrop } from "./hooks/useDragAndDrop";
import { threatTypes, countermeasures } from "./types";

interface ThreatSimulatorProps {
  className?: string;
}

export const ThreatSimulator: React.FC<ThreatSimulatorProps> = ({
  className = "",
}) => {
  const simulatorRef = useRef<HTMLDivElement>(null);
  const {
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
  } = useThreatGame();

  // Neutralization function with enhanced effects
  const neutralizeThreat = (
    threat: HTMLElement,
    countermeasureType?: string,
  ) => {
    if (threat.classList.contains("neutralized")) return;

    const usedCountermeasure =
      countermeasureType || gameState.selectedCountermeasure;
    const countermeasure = countermeasures[usedCountermeasure];
    const currentThreatType =
      threatTypes[threat.dataset.type as keyof typeof threatTypes];

    if (!countermeasure || !currentThreatType) return;

    // Use countermeasure (handles ammo and cooldown)
    useCountermeasure(usedCountermeasure);

    threat.classList.add("neutralized");
    threat.style.pointerEvents = "none";
    threat.style.cursor = "default";

    // Create explosion effect
    const explosionEffect = document.createElement("div");
    explosionEffect.className = "absolute pointer-events-none";
    explosionEffect.style.left = threat.style.left;
    explosionEffect.style.top = threat.style.top;
    explosionEffect.style.width = "60px";
    explosionEffect.style.height = "60px";
    explosionEffect.style.borderRadius = "50%";
    explosionEffect.style.background =
      "radial-gradient(circle, #ff6b6b, #ff8e53, #ff6b6b)";
    explosionEffect.style.animation = "explosion 0.6s ease-out forwards";
    explosionEffect.style.zIndex = "999";
    explosionEffect.innerHTML = "💥";
    explosionEffect.style.display = "flex";
    explosionEffect.style.alignItems = "center";
    explosionEffect.style.justifyContent = "center";
    explosionEffect.style.fontSize = "24px";

    simulatorRef.current?.appendChild(explosionEffect);

    // Threat destruction animation
    threat.style.transition = "all 0.5s ease-out";
    threat.style.transform = "scale(0.3) rotate(180deg)";
    threat.style.opacity = "0.1";
    threat.style.filter = "grayscale(100%)";

    // Add score effect with effectiveness multiplier
    const effectiveness =
      countermeasure.effectiveness[threat.dataset.type || "drone"] || 0.5;
    const basePoints = currentThreatType?.points || 100;
    const points = Math.round(basePoints * effectiveness);

    const scoreEffect = document.createElement("div");
    scoreEffect.className =
      "absolute pointer-events-none text-green-400 font-bold text-lg";
    scoreEffect.style.left = threat.style.left;
    scoreEffect.style.top = `${parseFloat(threat.style.top) - 30}px`;
    scoreEffect.style.animation = "scoreFloat 2s ease-out forwards";
    scoreEffect.style.zIndex = "1000";
    scoreEffect.textContent = `+${points}`;
    simulatorRef.current?.appendChild(scoreEffect);

    updateScore(points);
    incrementNeutralized();
    updateActiveThreats(-1);

    // Clean up effects
    setTimeout(() => {
      explosionEffect.remove();
      scoreEffect.remove();
    }, 2000);

    // Remove threat after animation
    setTimeout(() => {
      threat.remove();
    }, 4000);
  };

  // Enhanced automated threat movement with auto-countermeasures and dynamic scaling
  const startAutomatedThreat = (threat: HTMLElement) => {
    if (!simulatorRef.current) return;

    const threatTypeData =
      threatTypes[threat.dataset.type as keyof typeof threatTypes];
    if (!threatTypeData) return;

    // Dynamic speed scaling based on game level
    const speedMultiplier = 1 + (gameState.gameLevel - 1) * 0.15; // 15% increase per level

    const moveTowardShield = () => {
      if (threat.classList.contains("neutralized") || !gameState.gameRunning)
        return;

      const rect = simulatorRef.current!.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const currentX =
        parseFloat(threat.style.left) ||
        parseInt(getComputedStyle(threat).left);
      const currentY =
        parseFloat(threat.style.top) || parseInt(getComputedStyle(threat).top);

      const dx = centerX - (currentX + threat.offsetWidth / 2);
      const dy = centerY - (currentY + threat.offsetHeight / 2);
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Check auto-countermeasures first
      for (const [cmType, cm] of Object.entries(countermeasures)) {
        if (
          cm.autoTrigger &&
          canUseCountermeasure(cmType) &&
          distance <= cm.range
        ) {
          neutralizeThreat(threat, cmType);
          return;
        }
      }

      // Check if threat reached the shield (game over condition)
      if (distance < 50) {
        gameOver();
        return;
      }

      // Random movement variation for more realistic behavior
      const randomX = (Math.random() - 0.5) * 0.5;
      const randomY = (Math.random() - 0.5) * 0.5;

      const speed = threatTypeData.speed * speedMultiplier;
      const moveX = (dx / distance) * speed + randomX;
      const moveY = (dy / distance) * speed + randomY;

      threat.style.position = "absolute";
      threat.style.left = `${Math.max(0, Math.min(rect.width - 40, currentX + moveX))}px`;
      threat.style.top = `${Math.max(0, Math.min(rect.height - 40, currentY + moveY))}px`;

      requestAnimationFrame(moveTowardShield);
    };

    // Random delay before starting movement
    const delay = Math.random() * 1000 + 500;
    setTimeout(() => {
      moveTowardShield();
    }, delay);
  };

  const { addDragFunctionality, handleMouseMove, handleMouseUp } =
    useDragAndDrop(
      simulatorRef,
      neutralizeThreat,
      gameState.selectedCountermeasure,
      canUseCountermeasure,
    );

  const { spawnThreat, generateSwarm } = useThreatSpawner(
    simulatorRef,
    gameState.gameRunning,
    gameState.activeThreats,
    gameState.maxThreats,
    updateActiveThreats,
    (threat) => {
      addDragFunctionality(threat);
      startAutomatedThreat(threat);
    },
  );

  // Initialize game
  useEffect(() => {
    if (!gameState.gameRunning) return;

    // Add event listeners
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    // Start spawning threats
    const spawnInterval = setInterval(() => {
      if (gameState.gameRunning) {
        spawnThreat();
      } else {
        clearInterval(spawnInterval);
      }
    }, gameState.threatSpawnRate);

    // Start the game loop
    startGameLoop();

    // Spawn initial threats
    setTimeout(() => spawnThreat(), 1000);
    setTimeout(() => spawnThreat(), 2000);
    setTimeout(() => spawnThreat(), 3000);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      clearInterval(spawnInterval);
      stopGameLoop();
    };
  }, [
    gameState.gameRunning,
    gameState.threatSpawnRate,
    handleMouseMove,
    handleMouseUp,
    spawnThreat,
    startGameLoop,
    stopGameLoop,
  ]);

  // Handle fullscreen toggle - only for the game container
  useEffect(() => {
    console.log(
      "Fullscreen effect triggered, isFullscreen:",
      gameState.isFullscreen,
    );

    const handleFullscreen = async () => {
      if (!simulatorRef.current) {
        console.log("No simulator ref available");
        return;
      }

      console.log("Simulator ref available, proceeding with fullscreen logic");

      try {
        if (gameState.isFullscreen) {
          console.log("Attempting to enter fullscreen");
          // Request fullscreen for the game container only
          if (!document.fullscreenElement) {
            console.log("No current fullscreen element, requesting fullscreen");
            await simulatorRef.current.requestFullscreen?.();
            console.log("Fullscreen requested");
          } else {
            console.log("Already in fullscreen mode");
          }
        } else {
          console.log("Attempting to exit fullscreen");
          // Exit fullscreen if currently in fullscreen
          if (document.fullscreenElement) {
            console.log("Currently in fullscreen, exiting");
            await document.exitFullscreen?.();
            console.log("Fullscreen exited");
          } else {
            console.log("Not currently in fullscreen");
          }
        }
      } catch (error) {
        console.warn("Fullscreen operation failed:", error);
      }
    };

    handleFullscreen();

    // Listen for fullscreen changes to sync state
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      console.log("Fullscreen change detected:", isCurrentlyFullscreen);
      if (isCurrentlyFullscreen !== gameState.isFullscreen) {
        console.log("Syncing fullscreen state");
        setFullscreenState(isCurrentlyFullscreen);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [gameState.isFullscreen, setFullscreenState]);

  const containerClasses = `
    ${gameState.isFullscreen ? "fixed inset-0 z-50" : "h-[500px]"} 
    w-full rounded-2xl bg-[linear-gradient(135deg,rgba(0,255,136,0.1),rgba(0,136,255,0.1))] 
    flex items-center justify-center overflow-hidden relative border border-[rgba(0,255,136,0.3)] 
    ${className}
  `;

  return (
    <div className="space-y-8">
      <div ref={simulatorRef} className={containerClasses}>
        <GameInstructions />

        {/* Enhanced 3D-style drone interception visual */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Radar sweep */}
          <div className="absolute h-80 w-80 rounded-full border-2 border-[var(--primary)] opacity-20">
            <div className="absolute top-1/2 left-1/2 h-0.5 w-full origin-left bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent animate-radar" />
          </div>

          {/* Central shield - much larger and prominent */}
          <div className="relative z-10 w-24 h-24 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
            <div className="text-4xl">🛡️</div>
          </div>
        </div>

        <GameOverlay
          gameState={gameState}
          onRestart={() => {
            resetGame();
            window.location.reload();
          }}
        />
      </div>

      {/* Game Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <FramerateLoopControls
          gameState={gameState}
          onSettingsChange={updateSettings}
          onTogglePlay={toggleGameRunning}
          onReset={resetGame}
          isPlaying={gameState.gameRunning}
        />

        <ExternalControls
          gameState={gameState}
          selectedCountermeasure={gameState.selectedCountermeasure}
          onCountermeasureChange={setCountermeasure}
          canUseCountermeasure={canUseCountermeasure}
          onGenerateSwarm={() => {
            console.log("Main component generateSwarm called");
            generateSwarm();
          }}
          canGenerateSwarm={canGenerateSwarm()}
          isFullscreen={gameState.isFullscreen}
          onToggleFullscreen={() => {
            console.log("toggleFullscreen called from ExternalControls");
            toggleFullscreen();
          }}
        />
      </div>

      <ThreatLegend />
    </div>
  );
};
