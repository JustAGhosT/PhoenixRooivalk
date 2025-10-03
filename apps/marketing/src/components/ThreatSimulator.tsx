"use client";
import * as React from "react";
import { useEffect, useRef, useState, useCallback } from "react";
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
import HelpOverlay from './HelpOverlay';
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
  const [isResetting, setIsResetting] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const {
    gameState,
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
    updateScore,
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

  const {
    particleSystem,
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

  const {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleThreatClick,
    handleGameAreaClick,
    handleWheel,
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
    setSelectionBox,
    spawnNewThreat: () => {},
    moveAllThreats: () => {},
    generateSwarm,
    spawnMultipleDrones,
    activatePowerUp,
    clearTimeouts,
    resetGameState,
    toggleRunningState,
    setFrameRate,
    consumeEnergy,
    consumeCooling,
    particleSystem,
  });

  useFullscreen({
    gameRef,
    autoFullscreen,
    isTeaser,
  });

  const handleReset = useCallback(() => {
    setIsResetting(true);
    resetGameState();
    addFeed("Simulator reset.");
    setTimeout(() => setIsResetting(false), 200);
  }, [resetGameState, addFeed]);

  const handleSwarm = useCallback(() => {
    generateSwarm();
    addFeed("Spawning hostile swarm.");
  }, [generateSwarm, addFeed]);

  const handlePlus5 = useCallback(() => {
    spawnMultipleDrones(5);
    addFeed("Deploying 5 friendly drones.");
  }, [spawnMultipleDrones, addFeed]);

  useEffect(() => {
    return () => clearTimeouts();
  }, [clearTimeouts]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const key = e.key.toLowerCase();

      switch (key) {
        case ' ': e.preventDefault(); toggleRunningState(); break;
        case 's': e.preventDefault(); handleSwarm(); break;
        case '+': case '=': e.preventDefault(); handlePlus5(); break;
        case 'r': e.preventDefault(); handleReset(); break;
        case '1': case '2': case '3':
          e.preventDefault();
          const level = parseInt(key, 10);
          setLevel(level);
          addFeed(`Level set to ${level}.`);
          break;
        case 'escape': e.preventDefault(); clearSelection(); selectDroneType(null); break;
        case '?': e.preventDefault(); setShowHelp(prev => !prev); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [toggleRunningState, handleSwarm, handlePlus5, handleReset, setLevel, addFeed, clearSelection, selectDroneType]);

  return (
    <section ref={gameRef} className="threatsim card" aria-labelledby="sim-title"
             onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}
             onContextMenu={handleContextMenu} onWheel={handleWheel} onClick={handleGameAreaClick} tabIndex={0}>

      {showHelp && <HelpOverlay onClose={() => setShowHelp(false)} />}

      <HUDBar
        score={gameState.score}
        threats={gameState.threats.length}
        neutralized={gameState.neutralized}
        level={gameState.level}
      />
      <RadarCanvas
        blips={gameState.threats}
        isResetting={isResetting}
        onThreatClick={handleThreatClick}
      />
      <ControlBar
        onPause={toggleRunningState}
        onSwarm={handleSwarm}
        onPlus5={handlePlus5}
        onReset={handleReset}
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