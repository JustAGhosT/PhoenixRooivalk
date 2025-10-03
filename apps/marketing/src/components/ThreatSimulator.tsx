"use client";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { useFullscreen } from "./hooks/useFullscreen";
import { useGameState } from "./hooks/useGameState";
import { useThreatSimulatorEvents } from "./hooks/useThreatSimulatorEvents";
import { useThreatSimulatorGame } from "./hooks/useThreatSimulatorGame";
import { useTimeoutManager } from "./hooks/useTimeoutManager";
import { useEventFeed } from "./hooks/useEventFeed";
import HUDBar from './HUDBar';
import RadarCanvas from './RadarCanvas';
import ControlBar from './ControlBar';
import EventFeed from './EventFeed';
import Disclaimer from './Disclaimer';
import './NewThreatSimulator.css';


interface ThreatSimulatorProps {
  isTeaser?: boolean;
  autoFullscreen?: boolean;
}

export const ThreatSimulator: React.FC<ThreatSimulatorProps> = ({
  isTeaser = false,
  autoFullscreen = false,
}): JSX.Element => {
  const gameRef = useRef<HTMLDivElement>(null);
  const [showSimulationWarning, setShowSimulationWarning] = useState(true);

  // Core game state
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
    updateResources,
    consumeEnergy,
    consumeCooling,
    selectThreat,
    clearSelection,
    setSelectionBox,
    setThreatPriority,
    deployDrone,
    selectDroneType,
    updateMothershipResources,
    returnDroneToBase,
    updateDronePositions,
    resetGameState,
    processFadeOut,
    setLevel,
  } = useGameState();

  const { addTimeout, clearTimeouts } = useTimeoutManager();

  const { feedItems, addFeed } = useEventFeed();

  const neutralizeAndLogThreat = (threatId: string) => {
    const threat = gameState.threats.find(t => t.id === threatId);
    if (threat) {
      addFeed(`Neutralized hostile @ ${Math.round(threat.x)}m`);
    }
    removeThreat(threatId);
  };

  // Game logic hook
  const {
    particleSystem,
    setWeatherMode,
    setMissionType,
    setAutomationMode,
    showDeploymentZones,
    setShowDeploymentZones,
    spawnNewThreat,
    moveAllThreats,
    generateSwarm,
    spawnMultipleDrones,
  } = useThreatSimulatorGame({
    gameRef,
    gameState,
    updateThreats,
    addThreat,
    removeThreat,
    updateScore,
    neutralizeThreat: neutralizeAndLogThreat,
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
    setFrameRate,
    addTimeout,
    clearTimeouts,
    processFadeOut,
  });

  // Events hook
  const {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleThreatClick,
    handleGameAreaClick,
    handleWheel,
    handleKeyDown,
    handleContextMenu,
  } = useThreatSimulatorEvents({
    gameRef,
    gameState,
    updateThreats,
    addThreat,
    removeThreat,
    updateScore,
    selectThreat,
    setThreatPriority,
    neutralizeThreat: neutralizeAndLogThreat,
    switchWeapon,
    deployDrone,
    selectDroneType,
    returnDroneToBase,
    clearSelection,
    spawnNewThreat,
    moveAllThreats,
    generateSwarm,
    spawnMultipleDrones,
    activatePowerUp,
    clearTimeouts,
    resetGameState,
    toggleRunningState,
    setFrameRate,
    consumeEnergy,
    consumeCooling,
    setSelectionBox,
    particleSystem,
  });

  // Fullscreen hook
  const {
    isFullscreen,
    enterFullscreen,
    exitFullscreen,
    showFullscreenPrompt,
  } = useFullscreen({
    gameRef,
    autoFullscreen,
    isTeaser,
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => clearTimeouts();
  }, [clearTimeouts]);

  // Keyboard shortcuts managed in the main component
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      const key = e.key.toLowerCase();

      switch (key) {
        case '1':
        case '2':
        case '3':
          e.preventDefault();
          const level = parseInt(key, 10);
          setLevel(level);
          addFeed(`Level set to ${level}.`);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [setLevel, addFeed]);

  return (
    <section ref={gameRef} className="threatsim card" aria-labelledby="sim-title">
      <HUDBar
        score={gameState.score}
        threats={gameState.threats.length}
        neutralized={gameState.neutralized}
        level={gameState.level}
      />
      <RadarCanvas blips={gameState.threats} />
      <ControlBar
        onPause={toggleRunningState}
        onSwarm={() => {
          generateSwarm();
          addFeed("Spawning hostile swarm.");
        }}
        onPlus5={() => {
          spawnMultipleDrones(5);
          addFeed("Deploying 5 friendly drones.");
        }}
        onReset={() => {
          resetGameState();
          addFeed("Simulator reset.");
        }}
        onLevelChange={(level) => {
          setLevel(level);
          addFeed(`Level set to ${level}.`);
        }}
        isPaused={!gameState.isRunning}
        currentLevel={gameState.level}
      />
      <EventFeed feedItems={feedItems} />
      <Disclaimer />
    </section>
  );
};
