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

// Define power-up types as a union type to avoid string errors
type PowerUpType = "rapid-fire" | "damage-boost" | "area-effect" | "range-boost";

export const ThreatSimulator: React.FC<ThreatSimulatorProps> = ({
  isTeaser = false,
  autoFullscreen = false,
  demoMode = false,
}): JSX.Element => {
  const gameRef = useRef<HTMLDivElement>(null);
  const [isResetting, _setIsResetting] = useState(false);
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
    setAutomationMode
  } = useGameState();

  // Create a startResearch function since it's not part of useGameState
  const startResearch = (type: string): boolean => {
    // Implement research logic here
    console.log(`Starting research: ${type}`);
    // For now, just return true to indicate success
    return true;
  };

  const { resourceManager } = useThreatSimulatorGame({
    gameRef,
    gameState,
    updateThreats,
    addThreat,
    removeThreat,
    updateScore,
    neutralizeThreat: (_threatId: string) => {
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
    addTimeout: (_callback: () => void, _delay: number) => {
      // Implementation for adding timeout
    },
    clearTimeouts: () => {
      // Implementation for clearing timeouts
    },
    processFadeOut,
  });

  // Pass correct props structure to useFullscreen hook
  const { isFullscreen, enterFullscreen, exitFullscreen } = useFullscreen({ gameRef });

  const { addFeed } = useEventFeed();

const {
    isDragging: _isDragging,
    dragMode: _dragMode,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleContextMenu,
    handleWheel,
    handleGameAreaClick,
    handleThreatClick,
    handleKeyDown,
  } = useThreatSimulatorEvents({
    gameRef,
    gameState,
    updateScore,
    addThreat,
    removeThreat,
    updateThreats,
    toggleRunningState,
    setFrameRate,
    switchWeapon,
    activatePowerUp,
    consumeEnergy,
    consumeCooling,
    selectThreat,
    clearSelection,
    setSelectionBox,
    setThreatPriority,
    deployDrone,
    selectDroneType,
    returnDroneToBase,
    resetGameState,
    // Add the missing properties
    neutralizeThreat: (threatId: string) => {
      // Implementation for neutralizing threats
      removeThreat(threatId);
      updateScore(100); // Add score for neutralizing threat
    },
    spawnNewThreat: (threatType = "drone") => {
      // Implementation for spawning a new threat
      const newThreat = {
        id: `threat-${Date.now()}`,
        type: threatType || "drone",
        x: Math.random() * 800,
        y: Math.random() * 600,
        health: 100,
        speed: 2,
        detected: true,
        tracked: false,
      };
      addThreat(newThreat);
    },
    moveAllThreats: () => {
      // Implementation for moving all threats
      const updatedThreats = gameState.threats.map(threat => ({
        ...threat,
        x: threat.x + (Math.random() * 10 - 5),
        y: threat.y + (Math.random() * 10 - 5),
      }));
      updateThreats(updatedThreats);
    },
    generateSwarm: () => {
      // Implementation for generating a swarm
      for (let i = 0; i < 5; i++) {
        const newThreat = {
          id: `swarm-${Date.now()}-${i}`,
          type: "swarm",
          x: Math.random() * 800,
          y: Math.random() * 600,
          health: 50,
          speed: 3,
          detected: true,
          tracked: false,
        };
        addThreat(newThreat);
      }
    },
    spawnMultipleDrones: (count: number) => {
      // Implementation for spawning multiple drones
      for (let i = 0; i < count; i++) {
        const newThreat = {
          id: `drone-${Date.now()}-${i}`,
          type: "drone",
          x: Math.random() * 800,
          y: Math.random() * 600,
          health: 100,
          speed: 2,
          detected: true,
          tracked: false,
        };
        addThreat(newThreat);
      }
    },
    clearTimeouts: () => {
      // Implementation for clearing timeouts
      // This would typically clear any active timeouts in the game
    },
    particleSystem: {
      createExplosion: (x: number, y: number, intensity: number) => {
        // Implementation for creating explosions
        // This would typically trigger visual effects
        console.log(`Explosion at (${x},${y}) with intensity ${intensity}`);
      }
    }
  });

  // Handle threat hover events
  const handleThreatHover = (threatId: string | null) => {
    // Implementation for threat hover
    console.log("Threat hover:", threatId);
  };

  // Define the handler functions separately since they're not returned from the hook
  const _handleDroneClick = (e: React.MouseEvent, droneId: string) => {
    // Implementation for handling drone clicks
    console.log("Drone clicked:", droneId);
  };

  const handleWeaponActivate = (weaponId: string | null) => {
    // Implementation for handling weapon activation
    if (weaponId) {
      switchWeapon(weaponId);
    }
  };

  // Create getThreatAppearance function with proper return type
  const getThreatAppearance = (type: string) => {
    const appearances: Record<string, { emoji: string; color: string; cssClass: string }> = {
      drone: { emoji: "🚁", color: "bg-red-500", cssClass: "threat-drone" },
      swarm: { emoji: "👾", color: "bg-yellow-500", cssClass: "threat-swarm" },
      stealth: { emoji: "🥷", color: "bg-gray-700", cssClass: "threat-stealth" },
      // Add more threat types as needed
    };
    return appearances[type] || appearances.drone;
  };

  // These functions are marked as unused with underscore prefix
  const _handlePowerUpClick = (powerUpType: PowerUpType) => {
    // Implementation for handling power-up clicks
    activatePowerUp(powerUpType);
  };

  const _handleResearchClick = (_researchId: string) => {
    // Implementation for handling research clicks
    setShowResearch(true);
  };

  const _handleTokenStoreClick = () => {
    // Implementation for handling token store clicks
    setShowTokenStore(true);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

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
          {/* Match the ThreatSimulatorComponentsProps interface exactly */}
          <ThreatSimulatorComponents
            gameState={gameState}
            onThreatClick={handleThreatClick}
            onThreatHover={handleThreatHover}
            onActivateWeapon={handleWeaponActivate}
            getThreatAppearance={getThreatAppearance}
          />
        </div>
      </div>

      {showResearch && (
        <ResearchPanel
          data={(gameState as { research?: Record<string, unknown> }).research || {}}
          onStartResearch={(type: string) => {
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
          data={(gameState as { tokens?: Record<string, unknown> }).tokens || {}}
          onPurchase={(type: string) => {
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
