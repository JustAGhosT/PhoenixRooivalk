// Game State and Entity Type Definitions
// Re-export existing types to maintain compatibility

import {
  DeploymentBay,
  Drone,
  Formation,
  Mothership,
} from "../components/utils/mothershipTypes";
import { Threat } from "../components/utils/threatTypes";
import { PowerUp, Weapon } from "../components/utils/weaponTypes";

export type {
  DeploymentBay,
  Drone,
  Formation,
  Mothership,
} from "../components/utils/mothershipTypes";
export type { Threat } from "../components/utils/threatTypes";
export type { PowerUp, Weapon } from "../components/utils/weaponTypes";

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
  centerX?: number;
  centerY?: number;
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

export interface GameState {
  // Core game state
  score: number;
  threats: Threat[];
  neutralized: number;
  level: number;
  isRunning: boolean;

  // Weapons
  selectedWeapon: "kinetic" | "electronic" | "laser";
  weapons: Record<string, Weapon>;

  // Power-ups and timing
  activePowerUps: PowerUp[];
  gameTime: number;
  spawnRate: number;
  lastSpawnTime: number;
  comboMultiplier: number;
  lastNeutralizationTime: number;
  frameRate: number;
  targetFrameRate: number;

  // Achievements and scores
  achievements: string[];
  leaderboard: Array<{
    score: number;
    level: number;
    date: string;
    threatsNeutralized: number;
  }>;

  // Resource Management
  energy: number;
  maxEnergy: number;
  energyRegenRate: number;
  cooling: number;
  maxCooling: number;
  coolingRate: number;

  // Selection and targeting
  selectedThreats: string[];
  selectionBox: SelectionBox | null;
  priorityThreats: Record<string, "high" | "medium" | "low">;

  // Mothership system
  mothership: Mothership;
  drones: Drone[];
  deploymentBays: DeploymentBay[];
  formations: Formation[];
  selectedDroneType: Drone["type"] | null;

  // Environment
  weatherMode: "none" | "rain" | "fog" | "night";
  missionType: "airport" | "military-base" | "vip-protection" | "border-patrol";
  automationMode: "manual" | "automated" | "hybrid";
  showDeploymentZones: boolean;
}

export interface Point {
  x: number;
  y: number;
}

export interface Trail {
  x: number;
  y: number;
  timestamp: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: number;
}

export interface LeaderboardEntry {
  score: number;
  level: number;
  date: string;
  threatsNeutralized: number;
  playerName?: string;
}

export interface WeaponFireEvent {
  weaponId: string;
  targetX: number;
  targetY: number;
  damage: number;
  effectiveness: number;
  timestamp: number;
}

export interface ThreatNeutralizedEvent {
  threatId: string;
  threatType: Threat["type"];
  position: Point;
  score: number;
  timestamp: number;
}

export interface ThreatSpawnedEvent {
  threat: Threat;
}

export interface PowerUpActivatedEvent {
  powerUpType: string;
  duration: number;
}

export interface LevelUpEvent {
  level: number;
}

export interface GameOverEvent {
  score: number;
  threatsNeutralized: number;
}

export type GameEventData =
  | { type: "threat_spawned"; data: ThreatSpawnedEvent }
  | { type: "threat_neutralized"; data: ThreatNeutralizedEvent }
  | { type: "weapon_fired"; data: WeaponFireEvent }
  | { type: "power_up_activated"; data: PowerUpActivatedEvent }
  | { type: "level_up"; data: LevelUpEvent }
  | { type: "game_over"; data: GameOverEvent };

export type GameEvent = GameEventData & {
  timestamp: number;
};
