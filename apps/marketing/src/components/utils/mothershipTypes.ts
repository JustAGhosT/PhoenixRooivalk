// Phoenix Rooivalk Sentinel Core and Drone System Types

export interface SentinelCore {
  id: string;
  x: number;
  y: number;
  energy: number;
  maxEnergy: number;
  energyRegenRate: number;
  fuel: number;
  maxFuel: number;
  fuelConsumptionRate: number;
  isDeploying: boolean;
  deploymentCooldown: number;
  lastDeployment: number;
  droneCapacity: number;
  deployedDrones: string[];
}

export interface Drone {
  id: string;
  type:
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
    | "spotter"
    | "hpm_uav"
    | "shield_wall"
    | "mapper_lidar"
    | "relay_optical";
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  speed: number;
  health: number;
  maxHealth: number;
  energy: number;
  maxEnergy: number;
  range: number;
  status: "idle" | "deploying" | "active" | "returning" | "destroyed";
  damage: number;
  cooldown: number;
  lastAction: number;
  isActive: boolean;
  isReturning: boolean;
  mothershipId: string;
  deploymentTime: number;
  mission: "patrol" | "intercept" | "jam" | "surveil" | "shield" | "coordinate";
  targetThreatId?: string;
  shouldRemove?: boolean;
}

export interface DeploymentBay {
  id: string;
  droneType: Drone["type"];
  x: number;
  y: number;
  isReady: boolean;
  cooldown: number;
  lastDeployment: number;
  capacity: number;
  currentDrones: number;
}

// Legacy alias for backward compatibility
export type Mothership = SentinelCore;

export interface Formation {
  id: string;
  name: string;
  droneIds: string[];
  centerX: number;
  centerY: number;
  pattern: "circle" | "line" | "diamond" | "wedge" | "semicircle";
  spacing: number;
  isActive: boolean;
  // Semi-circle specific properties
  semicircleDegrees?: number; // Degrees of arc to cover (e.g., 180 for half circle, 90 for quarter circle)
  semicircleRadius?: number; // Radius of the semicircle formation
  semicircleDirection?: "north" | "south" | "east" | "west"; // Direction the semicircle faces
  type: "defensive" | "offensive" | "patrol" | "escort";
  targetPosition?: { x: number; y: number };
  position: { x: number; y: number };
}

export const DRONE_CONFIGS: Record<
  Drone["type"],
  Omit<
    Drone,
    | "id"
    | "x"
    | "y"
    | "targetX"
    | "targetY"
    | "lastAction"
    | "mothershipId"
    | "deploymentTime"
  >
> = {
  effector: {
    type: "effector",
    speed: 2.0,
    health: 100,
    maxHealth: 100,
    energy: 80,
    maxEnergy: 80,
    range: 150,
    damage: 25,
    cooldown: 800,
    isActive: false,
    isReturning: false,
    mission: "intercept",
    status: "deploying",
  },
  jammer: {
    type: "jammer",
    speed: 1.5,
    health: 80,
    maxHealth: 80,
    energy: 100,
    maxEnergy: 100,
    range: 200,
    damage: 0,
    cooldown: 1200,
    isActive: false,
    isReturning: false,
    mission: "jam",
    status: "deploying",
  },
  surveillance: {
    type: "surveillance",
    speed: 1.0,
    health: 60,
    maxHealth: 60,
    energy: 120,
    maxEnergy: 120,
    range: 300,
    damage: 0,
    cooldown: 600,
    isActive: false,
    isReturning: false,
    mission: "surveil",
    status: "deploying",
  },
  shield: {
    type: "shield",
    speed: 0.8,
    health: 150,
    maxHealth: 150,
    energy: 200,
    maxEnergy: 200,
    range: 100,
    damage: 0,
    cooldown: 2000,
    isActive: false,
    isReturning: false,
    mission: "shield",
    status: "deploying",
  },
  "swarm-coordinator": {
    type: "swarm-coordinator",
    speed: 1.2,
    health: 120,
    maxHealth: 120,
    energy: 150,
    maxEnergy: 150,
    range: 250,
    damage: 15,
    cooldown: 1000,
    isActive: false,
    isReturning: false,
    mission: "coordinate",
    status: "deploying",
  },
  "decoy_uav": {
    type: "decoy_uav",
    speed: 2.0,
    health: 80,
    maxHealth: 80,
    energy: 60,
    maxEnergy: 60,
    range: 400,
    damage: 0,
    cooldown: 0,
    isActive: false,
    isReturning: false,
    mission: "patrol",
    status: "deploying",
  },
  "net_uav": {
    type: "net_uav",
    speed: 2.5,
    health: 100,
    maxHealth: 100,
    energy: 70,
    maxEnergy: 70,
    range: 200,
    damage: 15,
    cooldown: 3000,
    isActive: false,
    isReturning: false,
    mission: "intercept",
    status: "deploying",
  },
  "relay_uav": {
    type: "relay_uav",
    speed: 1.0,
    health: 150,
    maxHealth: 150,
    energy: 120,
    maxEnergy: 120,
    range: 500,
    damage: 0,
    cooldown: 0,
    isActive: false,
    isReturning: false,
    mission: "patrol",
    status: "deploying",
  },
  "overwatch_tether": {
    type: "overwatch_tether",
    speed: 0,
    health: 200,
    maxHealth: 200,
    energy: 150,
    maxEnergy: 150,
    range: 800,
    damage: 0,
    cooldown: 0,
    isActive: false,
    isReturning: false,
    mission: "surveil",
    status: "deploying",
  },
  "recovery_uav": {
    type: "recovery_uav",
    speed: 2.0,
    health: 90,
    maxHealth: 90,
    energy: 50,
    maxEnergy: 50,
    range: 300,
    damage: 0,
    cooldown: 0,
    isActive: false,
    isReturning: false,
    mission: "patrol",
    status: "deploying",
  },
  "lure_swarm": {
    type: "lure_swarm",
    speed: 3.0,
    health: 40,
    maxHealth: 40,
    energy: 30,
    maxEnergy: 30,
    range: 200,
    damage: 0,
    cooldown: 0,
    isActive: false,
    isReturning: false,
    mission: "patrol",
    status: "deploying",
  },
  "perimeter_sentry": {
    type: "perimeter_sentry",
    speed: 2.0,
    health: 110,
    maxHealth: 110,
    energy: 80,
    maxEnergy: 80,
    range: 250,
    damage: 20,
    cooldown: 2000,
    isActive: false,
    isReturning: false,
    mission: "patrol",
    status: "deploying",
  },
  "spotter": {
    type: "spotter",
    speed: 3.0,
    health: 70,
    maxHealth: 70,
    energy: 60,
    maxEnergy: 60,
    range: 400,
    damage: 0,
    cooldown: 0,
    isActive: false,
    isReturning: false,
    mission: "surveil",
    status: "deploying",
  },
  "hpm_uav": {
    type: "hpm_uav",
    speed: 1.0,
    health: 180,
    maxHealth: 180,
    energy: 140,
    maxEnergy: 140,
    range: 600,
    damage: 35,
    cooldown: 5000,
    isActive: false,
    isReturning: false,
    mission: "intercept",
    status: "deploying",
  },
  "shield_wall": {
    type: "shield_wall",
    speed: 0,
    health: 250,
    maxHealth: 250,
    energy: 200,
    maxEnergy: 200,
    range: 150,
    damage: 0,
    cooldown: 0,
    isActive: false,
    isReturning: false,
    mission: "shield",
    status: "deploying",
  },
  "mapper_lidar": {
    type: "mapper_lidar",
    speed: 2.0,
    health: 100,
    maxHealth: 100,
    energy: 80,
    maxEnergy: 80,
    range: 350,
    damage: 0,
    cooldown: 0,
    isActive: false,
    isReturning: false,
    mission: "surveil",
    status: "deploying",
  },
  "relay_optical": {
    type: "relay_optical",
    speed: 2.0,
    health: 90,
    maxHealth: 90,
    energy: 70,
    maxEnergy: 70,
    range: 500,
    damage: 0,
    cooldown: 0,
    isActive: false,
    isReturning: false,
    mission: "patrol",
    status: "deploying",
  },
};

export const SENTINEL_CONFIG = {
  initialEnergy: 1000,
  maxEnergy: 1000,
  energyRegenRate: 10, // per second
  initialFuel: 500,
  maxFuel: 500,
  fuelConsumptionRate: 2, // per deployment
  deploymentCooldown: 3000, // 3 seconds
  droneCapacity: 12,
  deploymentCost: 50, // energy cost per deployment
};

// Legacy alias for backward compatibility
export const MOTHERSHIP_CONFIG = SENTINEL_CONFIG;
