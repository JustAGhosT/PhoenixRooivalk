import React, { useState } from "react";
import { DroneDeployment } from "./DroneDeployment";
import { EnergyManagement } from "./EnergyManagement";
import EventFeed from "./EventFeed";
import HUDBar from "./HUDBar";
import { ParticleEffects } from "./ParticleEffects";
import RadarCanvas from "./RadarCanvas";
import "./ThreatSimulator.css";
import { ThreatSimulatorComponents } from "./ThreatSimulatorComponents";
import { ThreatSimulatorOverlays } from "./ThreatSimulatorOverlays";
import { WeaponStatus } from "./WeaponStatus";
import { useEventFeed } from "./hooks/useEventFeed";
import { useGameState } from "./hooks/useGameState";

interface ThreatSimulatorGameProps {
  className?: string;
}

const ThreatSimulatorGame: React.FC<ThreatSimulatorGameProps> = ({
  className = "",
}) => {
  const {
    gameState,
    selectThreat,
    fireWeapon,
    deployDrone,
    setSelectionBox,
    switchWeapon,
  } = useGameState();
  const { feedItems } = useEventFeed();

  // State for overlays and fullscreen
  const [showSimulationWarning, setShowSimulationWarning] = useState(false);
  const [showFullscreenPrompt, setShowFullscreenPrompt] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // State for selection box
  const [selectionStart, setSelectionStart] = useState<{
    x: number;
    y: number;
  } | null>(null);

  // Game event handlers
  const handleThreatClick = (
    e: React.MouseEvent | React.KeyboardEvent,
    threatId: string,
  ) => {
    if (e.shiftKey || e.ctrlKey) {
      selectThreat(threatId);
    } else {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const x = "clientX" in e ? e.clientX - rect.left : 0;
      const y = "clientY" in e ? e.clientY - rect.top : 0;
      fireWeapon(x, y);
    }
  };

  const handleGameAreaClick = (e: React.MouseEvent) => {
    if (gameState.selectedDroneType) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      deployDrone(gameState.selectedDroneType, x, y);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setSelectionStart({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setSelectionBox({
      startX: e.clientX - rect.left,
      startY: e.clientY - rect.top,
      endX: e.clientX - rect.left,
      endY: e.clientY - rect.top,
      isActive: true,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (selectionStart) {
      const rect = e.currentTarget.getBoundingClientRect();
      setSelectionBox({
        startX: selectionStart.x,
        startY: selectionStart.y,
        endX: e.clientX - rect.left,
        endY: e.clientY - rect.top,
        isActive: true,
      });
    }
  };

  const handleMouseUp = (_e: React.MouseEvent) => {
    setSelectionStart(null);
    setSelectionBox(null);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("Context menu");
  };

  const handleWheel = (_e: React.WheelEvent) => {
    console.log("Wheel event");
  };

  // Fullscreen handlers
  const enterFullscreen = () => {
    setIsFullscreen(true);
    setShowFullscreenPrompt(false);
  };

  const exitFullscreen = () => {
    setIsFullscreen(false);
    setShowFullscreenPrompt(false);
  };

  // Threat appearance mapping
  const getThreatAppearance = (type: string) => {
    const normalizedType = type.toLowerCase();

    const threatAppearances: Record<
      string,
      { emoji: string; color: string; cssClass: string }
    > = {
      drone: { emoji: "🚁", color: "#ef4444", cssClass: "threat-drone" },
      swarm: { emoji: "🐝", color: "#f59e0b", cssClass: "threat-swarm" },
      missile: { emoji: "🚀", color: "#dc2626", cssClass: "threat-missile" },
      stealth: { emoji: "👻", color: "#6b7280", cssClass: "threat-stealth" },
      kamikaze: { emoji: "💥", color: "#dc2626", cssClass: "threat-kamikaze" },
      decoy: { emoji: "🎭", color: "#8b5cf6", cssClass: "threat-decoy" },
      shielded: { emoji: "🛡️", color: "#10b981", cssClass: "threat-shielded" },
      boss: { emoji: "👹", color: "#dc2626", cssClass: "threat-boss" },
    };

    return (
      threatAppearances[normalizedType] || {
        emoji: "❓",
        color: "#6b7280",
        cssClass: "threat-unknown",
      }
    );
  };

  return (
    <section className={`threatsim card flex flex-col h-full ${className}`}>
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
          onSwitchWeapon={(weapon) => {
            switchWeapon(weapon);
          }}
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
          {/* Visual Layers */}
          <RadarCanvas
            threats={gameState.threats}
            isResetting={false}
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

        {/* Side Panel */}
        <div className="flex flex-col w-80 p-4 space-y-4 bg-gray-800">
          <DroneDeployment
            drones={gameState.drones}
            deploymentBays={gameState.deploymentBays}
            selectedDroneType={gameState.selectedDroneType}
            onSelectDroneType={(type) => {
              console.log("Select drone type:", type);
            }}
            energy={gameState.energy}
          />
          <EnergyManagement
            maxEnergy={gameState.maxEnergy}
            selectedEffectors={gameState.selectedThreats || []}
            selectedDrones={gameState.drones
              .filter((d) => d.isActive)
              .map((d) => d.id)}
            activePowerUps={gameState.activePowerUps.map((p) => p.id)}
            onEnergyUpdate={() => {}}
          />
        </div>
      </div>

      <EventFeed feedItems={feedItems} />

      <ThreatSimulatorOverlays
        showSimulationWarning={showSimulationWarning}
        setShowSimulationWarning={setShowSimulationWarning}
        showFullscreenPrompt={showFullscreenPrompt}
        setShowFullscreenPrompt={setShowFullscreenPrompt}
        isTeaser={false}
        isFullscreen={isFullscreen}
        enterFullscreen={enterFullscreen}
        exitFullscreen={exitFullscreen}
      />
    </section>
  );
};

export default ThreatSimulatorGame;
