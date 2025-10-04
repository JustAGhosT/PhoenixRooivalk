"use client";
import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import ControlBar from "./ControlBar";
import { DetailedStats } from "./DetailedStats";
import Disclaimer from "./Disclaimer";
import { DroneDeployment } from "./DroneDeployment";
import EventFeed from "./EventFeed";
import HUDBar from "./HUDBar";
import HelpOverlay from "./HelpOverlay";
import { ParticleEffects } from "./ParticleEffects";
import RadarCanvas from "./RadarCanvas";
import { ResearchPanel } from "./ResearchPanel";
import "./ThreatSimulator.css";
import { ThreatSimulatorComponents } from "./ThreatSimulatorComponents";
import { ThreatSimulatorOverlays } from "./ThreatSimulatorOverlays";
import { TokenStore } from "./TokenStore";
import { WeaponStatus } from "./WeaponStatus";
import { useEventFeed } from "./hooks/useEventFeed";
import { useFullscreen } from "./hooks/useFullscreen";
import { useGameState } from "./hooks/useGameState";
import { useThreatSimulatorEvents } from "./hooks/useThreatSimulatorEvents";
import { useThreatSimulatorGame } from "./hooks/useThreatSimulatorGame";
import { useTimeoutManager } from "./hooks/useTimeoutManager";

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
  const [showDetailedStats, setShowDetailedStats] = useState(false);
  const [showSimulationWarning, setShowSimulationWarning] = useState(true);
  const [showResearch, setShowResearch] = useState(false);
  const [showTokenStore, setShowTokenStore] = useState(false);
  const [showFullscreenPrompt, setShowFullscreenPrompt] =
    useState(autoFullscreen);

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
    setWeatherMode,
    setMissionType,
    setAutomationMode,
    setShowDeploymentZones,
  } = useGameState();

  const { addTimeout, clearTimeouts } = useTimeoutManager();
  const { feedItems, addFeed } = useEventFeed();

  const neutralizeAndLogThreat = (threatId: string) => {
    const threat = gameState.threats.find((t) => t.id === threatId);
    if (threat) {
      addFeed(`Neutralized hostile @ ${Math.round(threat.x)}m`);
    }
    removeThreat(threatId);
  };

  const {
    particleSystem,
    generateSwarm,
    spawnMultipleDrones,
    spawnNewThreat,
    moveAllThreats,
    waveManager: _waveManager,
    startWave,
    getWaveProgress: _getWaveProgress,
    isWaveRunning,
    resourceManager,
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
    generateSwarm,
    spawnMultipleDrones,
    activatePowerUp,
    clearTimeouts,
    resetGameState,
    toggleRunningState,
    setFrameRate,
    consumeEnergy,
    consumeCooling,
    spawnNewThreat,
    moveAllThreats,
    particleSystem,
  });

  const { isFullscreen, enterFullscreen, exitFullscreen } = useFullscreen({
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
    if (isWaveRunning()) {
      generateSwarm();
      addFeed("Spawning hostile swarm.");
    } else {
      startWave(1);
      addFeed("Starting Wave 1 - Tutorial.");
    }
  }, [generateSwarm, addFeed, isWaveRunning, startWave]);

  const handlePlus5 = useCallback(() => {
    spawnMultipleDrones(5);
    addFeed("Deploying 5 friendly drones.");
  }, [spawnMultipleDrones, addFeed]);

  useEffect(() => {
    return () => clearTimeouts();
  }, [clearTimeouts]);

  const getThreatAppearance = (type: string) => {
    const appearances = {
      drone: { emoji: "🚁", color: "bg-red-600", cssClass: "" },
      swarm: { emoji: "🐝", color: "bg-orange-500", cssClass: "" },
      stealth: { emoji: "👻", color: "bg-gray-600", cssClass: "" },
      kamikaze: { emoji: "💥", color: "bg-red-800", cssClass: "" },
      decoy: { emoji: "🎭", color: "bg-gray-500", cssClass: "" },
      shielded: { emoji: "🛡️", color: "bg-blue-700", cssClass: "" },
    };
    return appearances[type as keyof typeof appearances] || appearances.drone;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const key = e.key.toLowerCase();

      switch (key) {
        case " ":
          e.preventDefault();
          toggleRunningState();
          break;
        case "s":
          e.preventDefault();
          handleSwarm();
          break;
        case "+":
        case "=":
          e.preventDefault();
          handlePlus5();
          break;
        case "r":
          e.preventDefault();
          handleReset();
          break;
        case "1":
          e.preventDefault();
          switchWeapon("kinetic");
          addFeed("Kinetic weapon selected.");
          break;
        case "2":
          e.preventDefault();
          switchWeapon("electronic");
          addFeed("EMP weapon selected.");
          break;
        case "3":
          e.preventDefault();
          switchWeapon("laser");
          addFeed("Laser weapon selected.");
          break;
        case "t":
          e.preventDefault();
          setShowDetailedStats((prev) => !prev);
          break;
        case "escape":
          e.preventDefault();
          clearSelection();
          selectDroneType(null);
          break;
        case "?":
          e.preventDefault();
          setShowHelp((prev) => !prev);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    toggleRunningState,
    handleSwarm,
    handlePlus5,
    handleReset,
    switchWeapon,
    addFeed,
    clearSelection,
    selectDroneType,
    setShowDetailedStats,
    setShowHelp,
  ]);

  return (
    <section
      ref={gameRef}
      className="threatsim card flex flex-col h-full"
      aria-labelledby="sim-title"
      style={{ minHeight: "800px" }} // Ensure the container has a height
    >
      {showHelp && <HelpOverlay onClose={() => setShowHelp(false)} />}
      {showDetailedStats && (
        <DetailedStats
          gameState={gameState}
          onClose={() => setShowDetailedStats(false)}
        />
      )}

      <HUDBar
        score={gameState.score}
        threats={gameState.threats.length}
        neutralized={gameState.neutralized}
        level={gameState.level}
      />

      <div className="flex flex-row flex-grow overflow-hidden">
        <WeaponStatus
          weapons={gameState.weapons}
          selectedWeapon={gameState.selectedWeapon}
          onSwitchWeapon={switchWeapon}
        />
        {/* Game Area Container */}
        <div
          className="relative flex-grow"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onContextMenu={handleContextMenu}
          onWheel={handleWheel}
          onClick={handleGameAreaClick}
          tabIndex={0}
        >
          {/* Visual Layers (absolutely positioned inside) */}
          <RadarCanvas
            threats={gameState.threats}
            isResetting={isResetting}
            onThreatClick={handleThreatClick}
          />
          <ParticleEffects
            activePowerUps={gameState.activePowerUps}
            gameArea={{ width: 800, height: 600 }}
          />
          <ThreatSimulatorComponents
            gameState={gameState}
            onThreatClick={handleThreatClick}
            onThreatHover={() => {}}
            getThreatAppearance={getThreatAppearance}
          />
        </div>
        <DroneDeployment
          drones={gameState.drones}
          deploymentBays={gameState.deploymentBays}
          selectedDroneType={gameState.selectedDroneType}
          onSelectDroneType={selectDroneType}
          energy={gameState.energy}
        />
      </div>

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
        weatherMode={gameState.weatherMode}
        setWeatherMode={setWeatherMode}
        missionType={gameState.missionType}
        setMissionType={setMissionType}
        automationMode={gameState.automationMode}
        setAutomationMode={setAutomationMode}
        showDeploymentZones={gameState.showDeploymentZones}
        setShowDeploymentZones={setShowDeploymentZones}
        showStats={showDetailedStats}
        onShowStats={() => setShowDetailedStats(true)}
        onShowHelp={() => setShowHelp(true)}
        onShowResearch={() => setShowResearch(true)}
        onShowTokenStore={() => setShowTokenStore(true)}
      />
      <EventFeed feedItems={feedItems} />
      <Disclaimer />
      {showResearch && (
        <ResearchPanel
          resourceManager={resourceManager}
          onClose={() => setShowResearch(false)}
        />
      )}
      {showTokenStore && (
        <TokenStore
          resourceManager={resourceManager}
          onClose={() => setShowTokenStore(false)}
          onPurchaseDrone={(type) => {
            // Handle drone purchase logic here
            console.log(`Purchased drone: ${type}`);
          }}
        />
      )}
      <ThreatSimulatorOverlays
        showSimulationWarning={showSimulationWarning}
        setShowSimulationWarning={setShowSimulationWarning}
        showFullscreenPrompt={showFullscreenPrompt}
        setShowFullscreenPrompt={setShowFullscreenPrompt}
        isTeaser={isTeaser}
        isFullscreen={isFullscreen}
        enterFullscreen={enterFullscreen}
        exitFullscreen={exitFullscreen}
      />
    </section>
  );
};
