import { useCallback, useState } from "react";
import type {
    GameState,
    PowerUp,
    SelectionBox,
    Threat,
} from "../../types/game";

interface UseThreatSimulatorEventsProps {
  gameRef: React.RefObject<HTMLElement>;
  gameState: GameState;
  updateThreats: (threats: Threat[]) => void;
  addThreat: (threat: Threat) => void;
  removeThreat: (threatId: string) => void;
  updateScore: (score: number) => void;
  selectThreat: (threatId: string) => void;
  setThreatPriority: (
    threatId: string,
    priority: "high" | "medium" | "low",
  ) => void;
  neutralizeThreat: (threatId: string) => void;
  switchWeapon: (weaponId: string) => void;
  deployDrone: (
    droneType:
      | "effector"
      | "jammer"
      | "surveillance"
      | "shield"
      | "swarm-coordinator"
      | "decoy_uav"
      | "net_uav"
      | "relay_uav"
      | "overwatch_tether"
      | "recovery_uav"
      | "lure_swarm"
      | "perimeter_sentry"
      | "hpm_pod_uav"
      | "lidar_mapper"
      | "micro_decoy_swarm"
      | "optical_mesh_drone"
      | "spotter_uav"
      | "tethered_overwatch"
      | "relay_optical",
    targetX: number,
    targetY: number,
  ) => void;
  selectDroneType: (
    droneType:
      | "effector"
      | "jammer"
      | "surveillance"
      | "shield"
      | "swarm-coordinator"
      | "decoy_uav"
      | "net_uav"
      | "relay_uav"
      | "overwatch_tether"
      | "recovery_uav"
      | "lure_swarm"
      | "perimeter_sentry"
      | "hpm_pod_uav"
      | "lidar_mapper"
      | "micro_decoy_swarm"
      | "optical_mesh_drone"
      | "spotter_uav"
      | "tethered_overwatch"
      | "relay_optical"
      | null,
  ) => void;
  returnDroneToBase: (droneId: string) => void;
  clearSelection: () => void;
  setSelectionBox: (box: SelectionBox | null) => void;
  spawnNewThreat: (threatType?: "drone" | "swarm" | "stealth") => void;
  moveAllThreats: () => void;
  generateSwarm: () => void;
  spawnMultipleDrones: (count: number) => void;
  activatePowerUp: (powerUpType: PowerUp["type"]) => void;
  clearTimeouts: () => void;
  resetGameState: () => void;
  toggleRunningState: () => void;
  setFrameRate: (rate: number) => void;
  consumeEnergy: (amount: number) => void;
  consumeCooling: (amount: number) => void;
  particleSystem: any;
}

export const useThreatSimulatorEvents = ({
  gameRef,
  gameState,
  updateThreats: _updateThreats,
  addThreat: _addThreat,
  removeThreat: _removeThreat,
  updateScore: _updateScore,
  selectThreat,
  setThreatPriority,
  neutralizeThreat,
  switchWeapon,
  deployDrone,
  selectDroneType,
  returnDroneToBase: _returnDroneToBase,
  clearSelection,
  setSelectionBox,
  spawnNewThreat: _spawnNewThreat,
  moveAllThreats: _moveAllThreats,
  generateSwarm: _generateSwarm,
  spawnMultipleDrones: _spawnMultipleDrones,
  activatePowerUp: _activatePowerUp,
  clearTimeouts: _clearTimeouts,
  resetGameState: _resetGameState,
  toggleRunningState,
  setFrameRate: _setFrameRate,
  consumeEnergy,
  consumeCooling: _consumeCooling,
  particleSystem,
}: UseThreatSimulatorEventsProps) => {
  // Mouse interaction state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragMode, setDragMode] = useState<"select" | "area-weapon">("select");

  // Mouse event handlers for selection and priority targeting
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button === 0) {
        // Left click
        const rect = gameRef.current?.getBoundingClientRect();
        if (rect) {
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          setDragStart({ x, y });
          setIsDragging(true);

          // Check if we're in area weapon mode (hold Shift for area effect)
          const isAreaWeapon =
            e.shiftKey && gameState.selectedWeapon === "electronic";
          setDragMode(isAreaWeapon ? "area-weapon" : "select");

          setSelectionBox({
            startX: x,
            startY: y,
            endX: x,
            endY: y,
            isActive: true,
          });
        }
      }
    },
    [gameState.selectedWeapon, setSelectionBox],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging && gameRef.current) {
        const rect = gameRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setSelectionBox({
          startX: dragStart.x,
          startY: dragStart.y,
          endX: x,
          endY: y,
          isActive: true,
        });
      }
    },
    [isDragging, dragStart, setSelectionBox, gameRef],
  );

  const handleMouseUp = useCallback(
    (_e: React.MouseEvent) => {
      if (isDragging) {
        setIsDragging(false);
        setSelectionBox(null);

        // Handle selection box actions
        if (gameState.selectionBox) {
          const minX = Math.min(
            gameState.selectionBox.startX,
            gameState.selectionBox.endX,
          );
          const maxX = Math.max(
            gameState.selectionBox.startX,
            gameState.selectionBox.endX,
          );
          const minY = Math.min(
            gameState.selectionBox.startY,
            gameState.selectionBox.endY,
          );
          const maxY = Math.max(
            gameState.selectionBox.startY,
            gameState.selectionBox.endY,
          );

          const selectedThreats = gameState.threats.filter((threat: any) => {
            return (
              threat.x >= minX &&
              threat.x <= maxX &&
              threat.y >= minY &&
              threat.y <= maxY
            );
          });

          if (dragMode === "area-weapon") {
            // Area effect weapon - neutralize all threats in selection
            selectedThreats.forEach((threat: any) => {
              neutralizeThreat(threat.id);
              // Create area effect explosion
              particleSystem.createExplosion(threat.x, threat.y, 1.2);
            });

            // Consume additional energy for area effect
            consumeEnergy(selectedThreats.length * 10);
          } else {
            // Normal selection mode
            selectedThreats.forEach((threat: any) => {
              selectThreat(threat.id);
            });
          }
        }
      }
    },
    [
      isDragging,
      gameState.selectionBox,
      gameState.threats,
      selectThreat,
      dragMode,
      neutralizeThreat,
      particleSystem,
      consumeEnergy,
      setSelectionBox,
      gameRef,
    ],
  );

  const handleThreatClick = useCallback(
    (e: React.MouseEvent | React.KeyboardEvent, threatId: string) => {
      e.stopPropagation();

      // Only prevent default for non-primary buttons to avoid interfering with normal selection
      if ("button" in e && e.button !== 0) {
        e.preventDefault();
      }

      if ("button" in e) {
        if (e.button === 0) {
          // Left click - select threat
          selectThreat(threatId);
        } else if (e.button === 1) {
          // Middle click - set priority
          // Use safer object property access with optional chaining
          const currentPriority = gameState.priorityThreats?.[threatId] as
            | string
            | undefined;
          if (currentPriority === "high") {
            setThreatPriority(threatId, "medium");
          } else if (currentPriority === "medium") {
            setThreatPriority(threatId, "low");
          } else {
            setThreatPriority(threatId, "high");
          }
        } else if (e.button === 2) {
          // Right click - neutralize
          neutralizeThreat(threatId);
        }
      } else {
        // Keyboard event - select threat
        selectThreat(threatId);
      }
    },
    [
      selectThreat,
      gameState.priorityThreats,
      setThreatPriority,
      neutralizeThreat,
    ],
  );

  // Enhanced mouse controls with drone deployment
  const handleGameAreaClick = useCallback(
    (e: React.MouseEvent) => {
      if (!gameRef.current) return;

      e.preventDefault();
      e.stopPropagation();

      const rect = gameRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (e.button === 0 && !isDragging) {
        // Left click - deploy selected drone type or select weapon
        if (gameState.selectedDroneType) {
          deployDrone(gameState.selectedDroneType, x, y);
        } else {
          switchWeapon("kinetic");
        }
      } else if (e.button === 1) {
        // Middle click - deploy jammer drone
        deployDrone("jammer", x, y);
      } else if (e.button === 2) {
        // Right click - deploy surveillance drone
        deployDrone("surveillance", x, y);
      }
    },
    [gameState.selectedDroneType, deployDrone, switchWeapon, isDragging],
  );

  // Keyboard activation handler (no mouse coordinates needed)
  const handleGameAreaActivate = useCallback(() => {
    if (!gameRef.current) return;

    const rect = gameRef.current.getBoundingClientRect();
    const x = rect.width / 2; // Center of game area
    const y = rect.height / 2;

    // Deploy selected drone type at center or select weapon
    if (gameState.selectedDroneType) {
      deployDrone(gameState.selectedDroneType, x, y);
    } else {
      switchWeapon("kinetic");
    }
  }, [gameState.selectedDroneType, deployDrone, switchWeapon, gameRef]);

  // Wheel event for weapon cycling
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const weapons = ["kinetic", "electronic", "laser"] as const;
      const currentIndex = weapons.indexOf(
        gameState.selectedWeapon as (typeof weapons)[number],
      );

      if (e.deltaY > 0) {
        // Scroll down - next weapon
        const nextIndex = (currentIndex + 1) % weapons.length;
        if (nextIndex >= 0 && nextIndex < weapons.length) {
          const nextWeapon = weapons[nextIndex];
          if (nextWeapon) {
            switchWeapon(nextWeapon);
          }
        }
      } else {
        // Scroll up - previous weapon
        const prevIndex =
          currentIndex === 0 ? weapons.length - 1 : currentIndex - 1;
        if (prevIndex >= 0 && prevIndex < weapons.length) {
          const prevWeapon = weapons[prevIndex];
          if (prevWeapon) {
            switchWeapon(prevWeapon);
          }
        }
      }
    },
    [gameState.selectedWeapon, switchWeapon, gameRef],
  );

  // Context menu handler to prevent right-click menu
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  // Keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Prevent default for game shortcuts to avoid conflicts with browser shortcuts
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      const key = e.key.toLowerCase();

      switch (key) {
        case " ":
          e.preventDefault();
          toggleRunningState();
          break;
        case "s":
          e.preventDefault();
          _generateSwarm();
          break;
        case "+":
        case "=": // Handle both + and = for convenience
          e.preventDefault();
          _spawnMultipleDrones(5);
          break;
        case "r":
          e.preventDefault();
          _resetGameState();
          break;
        case "1":
        case "2":
        case "3":
          e.preventDefault();
          // The setLevel function is not available here, so we need to handle this in ThreatSimulator.tsx
          // For now, we just prevent default. The actual level change will be handled there.
          break;
        case "escape":
          e.preventDefault();
          clearSelection();
          selectDroneType(null);
          break;
      }
    },
    [
      toggleRunningState,
      _generateSwarm,
      _spawnMultipleDrones,
      _resetGameState,
      clearSelection,
      selectDroneType,
    ],
  );

  return {
    isDragging,
    dragMode,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleThreatClick,
    handleGameAreaClick,
    handleGameAreaActivate,
    handleWheel,
    handleContextMenu,
    handleKeyDown,
  };
};
