// Game State and Entity Type Definitions
// Re-export existing types to maintain compatibility

export type { Threat } from "../components/utils/threatTypes";
export type { Weapon, PowerUp } from "../components/utils/weaponTypes";
export type {
  Mothership,
  Drone,
  DeploymentBay,
  Formation,
} from "../components/utils/mothershipTypes";
export type { GameState } from "../components/hooks/useGameState";

export interface SelectionBox {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  isActive: boolean;
}

export interface GameDimensions {
  width: number;
  height: number;
  centerX: number;
  centerY: number;
}

export interface ParticleEffect {
  id: string;
  x: number;
  y: number;
  type: "explosion" | "trail" | "impact" | "energy";
  intensity: number;
  duration: number;
  color: string;
  size: number;
  velocity: { x: number; y: number };
}

export interface StrategicZone {
  x: number;
  y: number;
  radius: number;
  type: "deployment" | "exclusion" | "priority";
  priority: "high" | "medium" | "low";
  active: boolean;
}
