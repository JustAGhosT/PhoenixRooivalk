"use client";
import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import ControlBar from "./ControlBar";
import { DetailedStats } from "./DetailedStats";
import Disclaimer from "./Disclaimer";
import { DroneDeployment } from "./DroneDeployment";
import { EnergyBudget } from "./EnergyBudget";
import { EnergyManagement } from "./EnergyManagement";
import {
  DemoCooldownMeter,
  WeaponCooldownMeter,
} from "./EnhancedCooldownMeter";
import EventFeed from "./EventFeed";
import { FilterChips } from "./FilterChips";
import HUDBar from "./HUDBar";
import HelpOverlay from "./HelpOverlay";
import { InfoPopover } from "./InfoPopover";
import { LegalBadge } from "./LegalBadge";
import { MultiSelectDeployment } from "./MultiSelectDeployment";
import { ParticleEffects } from "./ParticleEffects";
import { ROEIndicator } from "./ROEIndicator";
import RadarCanvas from "./RadarCanvas";
import { FriendlyDeployment, RadarSystem, RadarTarget } from "./RadarSystem";
import { ResearchPanel } from "./ResearchPanel";
import { SynergySystem } from "./SynergySystem";
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

  // Demo data for component showcase
  const demoTargets: RadarTarget[] = [
    {
      id: "TGT-001",
      type: "hostile",
      position: { x: 150, y: 200 },
      distance: 250,
      bearing: 45,
      speed: 15,
      altitude: 100,
      confidence: 0.85,
      lastUpdate: Date.now(),
    },
    {
      id: "TGT-002",
      type: "unknown",
      position: { x: -100, y: 150 },
      distance: 180,
      bearing: 135,
      speed: 8,
      altitude: 50,
      confidence: 0.65,
      lastUpdate: Date.now(),
    },
    {
      id: "TGT-003",
      type: "friendly",
      position: { x: 80, y: -120 },
      distance: 144,
      bearing: 315,
      speed: 12,
      altitude: 75,
      confidence: 0.95,
      lastUpdate: Date.now(),
    },
  ];

  const demoDeployments: FriendlyDeployment[] = [
    {
      id: "DRONE-001",
      role: "recon",
      position: { x: 50, y: -100 },
      status: "active",
      energy: 80,
      maxEnergy: 100,
    },
    {
      id: "DRONE-002",
      role: "guard",
      position: { x: -80, y: 50 },
      status: "idle",
      energy: 60,
      maxEnergy: 100,
    },
    {
      id: "DRONE-003",
      role: "ecm",
      position: { x: 120, y: 80 },
      status: "returning",
      energy: 40,
      maxEnergy: 100,
    },
  ];

  const demoEffectors = [
    "spotter",
    "smart_slug",
    "laser",
    "gnss_deny",
    "rf_take",
  ];

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

  // Demo mode rendering
  if (demoMode) {
    return (
      <div className="threat-simulator-demo">
        <div className="demo-controls">
          <h1>Phoenix Rooivalk - Threat Simulator Demo</h1>
          <div className="demo-mode-selector">
            <button
              className={`mode-btn ${demoViewMode === "full" ? "active" : ""}`}
              onClick={() => setDemoViewMode("full")}
            >
              Full Simulator
            </button>
            <button
              className={`mode-btn ${demoViewMode === "components" ? "active" : ""}`}
              onClick={() => setDemoViewMode("components")}
            >
              Component Showcase
            </button>
            <button
              className={`mode-btn ${demoViewMode === "systems" ? "active" : ""}`}
              onClick={() => setDemoViewMode("systems")}
            >
              System Integration
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
                  <ThreatSimulator demoMode={false} />
                </div>
              )}
              {demoViewMode === "components" && (
                <div className="component-showcase">
                  <div className="showcase-header">
                    <h1>Enhanced Threat Simulator Components</h1>
                    <p>
                      Individual component demonstrations with real-world data
                    </p>
                  </div>

                  <div className="showcase-grid">
                    {/* Radar System */}
                    <div className="showcase-section">
                      <h2>Enhanced Radar System</h2>
                      <div className="component-demo">
                        <RadarSystem
                          targets={demoTargets}
                          friendlyDeployments={demoDeployments}
                          range={500}
                          centerPosition={{ x: 200, y: 200 }}
                        />
                      </div>
                    </div>

                    {/* Synergy System */}
                    <div className="showcase-section">
                      <h2>Synergy System</h2>
                      <div className="component-demo">
                        <SynergySystem
                          selectedEffectors={demoEffectors}
                          onSynergyUpdate={() => {}}
                        />
                      </div>
                    </div>

                    {/* Energy Management */}
                    <div className="showcase-section">
                      <h2>Energy Management</h2>
                      <div className="component-demo">
                        <EnergyManagement
                          maxEnergy={100}
                          selectedEffectors={demoEffectors}
                          selectedDrones={["recon", "guard", "ecm"]}
                          activePowerUps={["damage-boost"]}
                          onEnergyUpdate={() => {}}
                        />
                      </div>
                    </div>

                    {/* Multi-Select Deployment */}
                    <div className="showcase-section">
                      <h2>Multi-Select Deployment</h2>
                      <div className="component-demo">
                        <MultiSelectDeployment
                          availableEnergy={75}
                          onSelectionChange={() => {}}
                        />
                      </div>
                    </div>

                    {/* Cooldown Meters */}
                    <div className="showcase-section">
                      <h2>Cooldown Meters</h2>
                      <div className="component-demo">
                        <div className="cooldown-showcase">
                          <div className="cooldown-item">
                            <h3>Enhanced Cooldown Meter</h3>
                            <DemoCooldownMeter
                              cooldownTime={8}
                              isActive={true}
                              size={60}
                              label="Smart Slug"
                            />
                          </div>
                          <div className="cooldown-item">
                            <h3>Weapon Cooldown Meter</h3>
                            <WeaponCooldownMeter
                              weaponId="laser"
                              cooldownTime={5}
                              isActive={false}
                              isReady={true}
                              energyCost={12}
                              currentEnergy={85}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ROE Indicators */}
                    <div className="showcase-section">
                      <h2>ROE Risk Indicators</h2>
                      <div className="component-demo">
                        <div className="roe-showcase">
                          <div className="roe-item">
                            <h3>Low Risk</h3>
                            <ROEIndicator
                              riskLevel="low"
                              showDetails={true}
                              size="medium"
                            />
                          </div>
                          <div className="roe-item">
                            <h3>Medium Risk</h3>
                            <ROEIndicator
                              riskLevel="medium"
                              showDetails={true}
                              size="medium"
                            />
                          </div>
                          <div className="roe-item">
                            <h3>High Risk</h3>
                            <ROEIndicator
                              riskLevel="high"
                              showDetails={true}
                              size="medium"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Filter Chips */}
                    <div className="showcase-section">
                      <h2>Filter Chips</h2>
                      <div className="component-demo">
                        <FilterChips
                          chips={[
                            {
                              id: "hard_kill",
                              label: "Hard Kill",
                              color: "#ef4444",
                            },
                            {
                              id: "soft_kill",
                              label: "Soft Kill",
                              color: "#f59e0b",
                            },
                            {
                              id: "deception",
                              label: "Deception",
                              color: "#70A1FF",
                            },
                            { id: "denial", label: "Denial", color: "#8b5cf6" },
                          ]}
                          selectedFilters={["hard_kill", "deception"]}
                          onFilterChange={() => {}}
                        />
                      </div>
                    </div>

                    {/* Info Popover */}
                    <div className="showcase-section">
                      <h2>Info Popover</h2>
                      <div className="component-demo">
                        <InfoPopover
                          title="Smart Slug"
                          brands={["Raytheon", "Lockheed Martin"]}
                          sources={["Defense News", "Jane's Defence Weekly"]}
                        >
                          <button className="demo-info-btn">
                            Smart Slug Details
                          </button>
                        </InfoPopover>
                      </div>
                    </div>

                    {/* Legal Badge */}
                    <div className="showcase-section">
                      <h2>Legal Badge</h2>
                      <div className="component-demo">
                        <div className="legal-showcase">
                          <LegalBadge
                            legalFlags={["operational_approval"]}
                            onAcknowledge={() => {}}
                          />
                          <LegalBadge
                            legalFlags={["command_approval"]}
                            onAcknowledge={() => {}}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Energy Budget */}
                    <div className="showcase-section">
                      <h2>Energy Budget</h2>
                      <div className="component-demo">
                        <EnergyBudget used={75} max={100} showDetails={true} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {demoViewMode === "systems" && (
                <div className="systems-showcase">
                  <div className="showcase-header">
                    <h1>System Integration Showcase</h1>
                    <p>Demonstrating how all components work together</p>
                  </div>

                  <div className="systems-grid">
                    <div className="system-demo">
                      <h2>Planning Phase</h2>
                      <p>
                        Select effectors and drones with energy constraints and
                        legal compliance
                      </p>
                      <div className="demo-placeholder">
                        <p>Full planning interface with:</p>
                        <ul>
                          <li>Effector selection with ROE indicators</li>
                          <li>Legal compliance badges</li>
                          <li>Energy budgeting</li>
                          <li>Synergy detection</li>
                          <li>Multi-select deployment</li>
                        </ul>
                      </div>
                    </div>

                    <div className="system-demo">
                      <h2>Active Phase</h2>
                      <p>
                        Real-time threat engagement with cooldown management
                      </p>
                      <div className="demo-placeholder">
                        <p>Active engagement interface with:</p>
                        <ul>
                          <li>Live radar tracking</li>
                          <li>Cooldown meters</li>
                          <li>Energy management</li>
                          <li>Synergy bonuses</li>
                          <li>ROE compliance monitoring</li>
                        </ul>
                      </div>
                    </div>

                    <div className="system-demo">
                      <h2>Analysis Phase</h2>
                      <p>Post-engagement analysis and system optimization</p>
                      <div className="demo-placeholder">
                        <p>Analysis interface with:</p>
                        <ul>
                          <li>Performance metrics</li>
                          <li>Synergy effectiveness</li>
                          <li>Energy efficiency</li>
                          <li>ROE compliance reports</li>
                          <li>System recommendations</li>
                        </ul>
                      </div>
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
          onPurchaseDrone={async (type) => {
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
