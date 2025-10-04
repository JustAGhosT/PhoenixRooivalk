import React from "react";
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
  const { gameState } = useGameState();
  const { feedItems } = useEventFeed();

  // Basic event handlers
  const handleThreatClick = (
    e: React.MouseEvent | React.KeyboardEvent,
    threatId: string,
  ) => {
    console.log("Threat clicked:", threatId);
  };

  const handleGameAreaClick = (_e: React.MouseEvent) => {
    console.log("Game area clicked");
  };

  const handleMouseDown = (_e: React.MouseEvent) => {
    console.log("Mouse down");
  };

  const handleMouseMove = (_e: React.MouseEvent) => {
    console.log("Mouse move");
  };

  const handleMouseUp = (_e: React.MouseEvent) => {
    console.log("Mouse up");
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("Context menu");
  };

  const handleWheel = (_e: React.WheelEvent) => {
    console.log("Wheel event");
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
            // Handle weapon switching
            console.log("Switch weapon:", weapon);
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
            getThreatAppearance={(_type) => ({
              emoji: "🚁",
              color: "#ef4444",
              cssClass: "threat-drone",
            })}
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
            selectedEffectors={[]}
            selectedDrones={[]}
            activePowerUps={gameState.activePowerUps.map((p) => p.id)}
            onEnergyUpdate={() => {}}
          />
        </div>
      </div>

      <EventFeed feedItems={feedItems} />

      <ThreatSimulatorOverlays
        showSimulationWarning={false}
        setShowSimulationWarning={() => {}}
        showFullscreenPrompt={false}
        setShowFullscreenPrompt={() => {}}
        isTeaser={false}
        isFullscreen={false}
        enterFullscreen={() => {}}
        exitFullscreen={() => {}}
      />
    </section>
  );
};

export default ThreatSimulatorGame;
