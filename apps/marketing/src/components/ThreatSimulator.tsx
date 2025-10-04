"use client";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { DetailedStats } from "./DetailedStats";
import HUDBar from "./HUDBar";
import HelpOverlay from "./HelpOverlay";
import { ParticleEffects } from "./ParticleEffects";
import RadarCanvas from "./RadarCanvas";
import { ResearchPanel } from "./ResearchPanel";
import "./ThreatSimulator.css";
import { ThreatSimulatorComponents } from "./ThreatSimulatorComponents";
import ThreatSimulatorGame from "./ThreatSimulatorGame";
import { ThreatSimulatorOverlays } from "./ThreatSimulatorOverlays";
import { TokenStore } from "./TokenStore";
import { WeaponStatus } from "./WeaponStatus";
import { useEventFeed } from "./hooks/useEventFeed";
import { useFullscreen } from "./hooks/useFullscreen";
import { useGameState } from "./hooks/useGameState";
import { useThreatSimulatorEvents } from "./hooks/useThreatSimulatorEvents";
import { useThreatSimulatorGame } from "./hooks/useThreatSimulatorGame";

interface ThreatSimulatorProps {
  isTeaser?: boolean;
  autoFullscreen?: boolean;
  demoMode?: boolean; // Show component showcase instead of game
}

export const ThreatSimulator: React.FC<ThreatSimulatorProps> = ({
  isTeaser = false,
  autoFullscreen = false,
  demoMode = false,
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

  // Demo mode state
  const [demoViewMode, setDemoViewMode] = useState<
    "full" | "components" | "systems"
  >("full");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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
    updateResources,
    consumeEnergy,
    consumeCooling,
    selectThreat,
    clearSelection,
    setSelectionBox,
    setThreatPriority,
    removeThreatPriority,
    deployDrone,
    updateDrones,
    selectDroneType,
    updateMothershipResources,
    returnDroneToBase,
    updateDronePositions,
    resetGameState,
    processFadeOut,
    setLevel,
    setWeatherMode,
    setMissionType,
    setAutomationMode,
    setShowDeploymentZones,
  } = useGameState();

  const {
    particleSystem,
    collisionSystem,
    gameDimensions,
    weatherMode,
    missionType,
    automationMode,
    showDeploymentZones,
    resourceManager,
  } = useThreatSimulatorGame({
    gameRef,
    gameState,
    updateThreats,
    addThreat,
    removeThreat,
    updateScore,
    neutralizeThreat: (threatId: string) => {
      // Implementation for neutralizing threats
    },
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
    addTimeout: (callback: () => void, delay: number) => {
      // Implementation for adding timeout
    },
    clearTimeouts: () => {
      // Implementation for clearing timeouts
    },
    processFadeOut,
  });


  const { isFullscreen, enterFullscreen, exitFullscreen } = useFullscreen();

  const { addFeed } = useEventFeed();

  const {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleContextMenu,
    handleWheel,
    handleGameAreaClick,
    handleThreatClick,
    handleDroneClick,
    handleWeaponActivate,
    handlePowerUpClick,
    handleResearchClick,
    handleTokenStoreClick,
  } = useThreatSimulatorEvents({
    gameRef,
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
    updateResources,
    consumeEnergy,
    consumeCooling,
    selectThreat,
    clearSelection,
    setSelectionBox,
    setThreatPriority,
    removeThreatPriority,
    deployDrone,
    updateDrones,
    selectDroneType,
    updateMothershipResources,
    returnDroneToBase,
    updateDronePositions,
    resetGameState,
    processFadeOut,
    setLevel,
    setWeatherMode,
    setMissionType,
    setAutomationMode,
    setShowDeploymentZones,
    setShowResearch,
    setShowTokenStore,
    setShowHelp,
    setShowDetailedStats,
    addFeed,
  });

  const getThreatAppearance = (type: string) => {
    const appearances = {
      drone: { color: "#ef4444", size: 8 },
      swarm: { color: "#f59e0b", size: 6 },
      stealth: { color: "#6b7280", size: 6 },
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
        case "r":
          if (e.shiftKey) {
            resetGameState();
          }
          break;
        case "h":
          setShowHelp(!showHelp);
          break;
        case "s":
          setShowDetailedStats(!showDetailedStats);
          break;
        case "f":
          if (isFullscreen) {
            exitFullscreen();
          } else {
            enterFullscreen();
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    toggleRunningState,
    resetGameState,
    showHelp,
    setShowHelp,
    showDetailedStats,
    setShowDetailedStats,
    isFullscreen,
    enterFullscreen,
    exitFullscreen,
  ]);

  // Demo mode - show component showcase
  if (demoMode) {
    return (
      <div className="threat-simulator-demo">
        <div className="demo-controls">
          <h1>Phoenix Rooivalk - Threat Simulator Demo</h1>
          <div className="demo-mode-selector">
            <button
              className={demoViewMode === "full" ? "active" : ""}
              onClick={() => setDemoViewMode("full")}
            >
              Full Simulator
            </button>
            <button
              className={demoViewMode === "components" ? "active" : ""}
              onClick={() => setDemoViewMode("components")}
            >
              Component Showcase
            </button>
            <button
              className={demoViewMode === "systems" ? "active" : ""}
              onClick={() => setDemoViewMode("systems")}
            >
              System Architecture
            </button>
          </div>
        </div>

        <div className="demo-content">
          {!isClient ? (
            <div className="loading">Loading demo...</div>
          ) : (
            <>
              {demoViewMode === "full" && (
                <div className="demo-simulator">
                  <ThreatSimulatorGame />
                </div>
              )}
              {demoViewMode === "components" && (
                <div className="component-showcase">
                  <div className="showcase-header">
                    <h1>Enhanced Threat Simulator Components</h1>
                    <p>
                      Explore the individual components that make up the Phoenix
                      Rooivalk threat simulation system.
                    </p>
                  </div>
                  <div className="component-grid">
                    <div className="component-card">
                      <h3>Radar System</h3>
                      <p>
                        Advanced threat detection and tracking with real-time
                        visualization.
                      </p>
                    </div>
                    <div className="component-card">
                      <h3>Drone Deployment</h3>
                      <p>
                        Intelligent drone deployment system with energy
                        management.
                      </p>
                    </div>
                    <div className="component-card">
                      <h3>Weapon Systems</h3>
                      <p>
                        Multi-spectrum weapon systems for threat neutralization.
                      </p>
                    </div>
                    <div className="component-card">
                      <h3>Research Panel</h3>
                      <p>Technology research and development interface.</p>
                    </div>
                  </div>
                </div>
              )}
              {demoViewMode === "systems" && (
                <div className="system-architecture">
                  <div className="architecture-header">
                    <h1>System Architecture</h1>
                    <p>
                      Comprehensive overview of the Phoenix Rooivalk system
                      architecture.
                    </p>
                  </div>
                  <div className="architecture-diagram">
                    <div className="system-layer">
                      <h3>Presentation Layer</h3>
                      <p>React components, UI/UX, visualization</p>
                    </div>
                    <div className="system-layer">
                      <h3>Application Layer</h3>
                      <p>Game logic, state management, event handling</p>
                    </div>
                    <div className="system-layer">
                      <h3>Data Layer</h3>
                      <p>Game state, persistence, configuration</p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

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
            onDroneClick={handleDroneClick}
            onWeaponActivate={handleWeaponActivate}
            onPowerUpClick={handlePowerUpClick}
            onResearchClick={handleResearchClick}
            onTokenStoreClick={handleTokenStoreClick}
            isResetting={isResetting}
          />
        </div>
      </div>

      {showResearch && (
        <ResearchPanel
          researchState={gameState.research}
          onStartResearch={(type) => {
            try {
              const success = startResearch(type);
              if (success) {
                addFeed(`Started research: ${type}`);
                setShowResearch(false);
              } else {
                addFeed(`Failed to start research: ${type}`);
              }
            } catch (error) {
              console.error("Failed to start research:", error);
              addFeed(`Failed to start research: ${type}`);
            }
          }}
        />
      )}

      {showTokenStore && (
        <TokenStore
          tokens={gameState.tokens}
          onPurchase={(type) => {
            try {
              // Call the actual purchase API
              const success = resourceManager.purchaseDrone(type);

              if (success) {
                // Dispatch the existing "drone-purchase" event
                const purchaseEvent = new CustomEvent("drone-purchase", {
                  detail: { type, timestamp: Date.now() },
                });
                window.dispatchEvent(purchaseEvent);

                // Close the token store modal after successful purchase
                setShowTokenStore(false);

                // Add success feedback to the game feed
                addFeed(`Drone ${type} purchased successfully!`);
              } else {
                // Purchase failed - don't close modal, show error
                addFeed(
                  `Failed to purchase drone ${type}. Insufficient tokens or drone not unlocked.`,
                );
              }
            } catch (error) {
              console.error("Failed to process drone purchase:", error);
              addFeed(`Failed to purchase drone ${type}.`);
            }
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

export default ThreatSimulator;
