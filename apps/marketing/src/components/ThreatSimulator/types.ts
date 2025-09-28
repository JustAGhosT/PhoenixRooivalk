export interface ThreatType {
  emoji: string;
  speed: number;
  health: number;
  points: number;
  weakness: string;
  color: string;
}

export interface CountermeasureType {
  name: string;
  color: string;
  effectiveness: Record<string, number>;
  range: number; // Neutralization range in pixels
  autoTrigger: boolean; // Whether it auto-triggers within range
  cooldown: number; // Cooldown time in milliseconds
  ammo?: number; // Limited ammo (undefined = unlimited)
}

export interface GameSettings {
  fps: number;
  loopType: 'infinite' | 'count' | 'range';
  loopCount: number;
  loopStart: number;
  loopEnd: number;
}

export interface GameState {
  score: number;
  gameLevel: number;
  activeThreats: number;
  maxThreats: number;
  threatSpawnRate: number;
  gameRunning: boolean;
  neutralizedCount: number;
  selectedCountermeasure: string;
  isFullscreen: boolean;
  countermeasureAmmo: Record<string, number>; // Track ammo for each countermeasure
  countermeasureCooldowns: Record<string, number>; // Track cooldown timestamps
  settings: GameSettings;
  currentFrame: number;
}

// Slower threat types for better gameplay with dynamic scaling
export const threatTypes: Record<string, ThreatType> = {
  drone: {
    emoji: "🚁",
    speed: 0.2,
    health: 1,
    points: 100,
    weakness: "kinetic",
    color: "#ef4444",
  },
  radar: {
    emoji: "📡",
    speed: 0.15,
    health: 2,
    points: 150,
    weakness: "electronic",
    color: "#f97316",
  },
  stealth: {
    emoji: "🛸",
    speed: 0.25,
    health: 1,
    points: 200,
    weakness: "laser",
    color: "#eab308",
  },
  swarm: {
    emoji: "🐝",
    speed: 0.3,
    health: 1,
    points: 75,
    weakness: "kinetic",
    color: "#8b5cf6",
  },
  heavy: {
    emoji: "🚀",
    speed: 0.1,
    health: 3,
    points: 300,
    weakness: "laser",
    color: "#dc2626",
  },
};

export const countermeasures: Record<string, CountermeasureType> = {
  kinetic: {
    name: "Kinetic Interceptor",
    color: "#00ff88",
    effectiveness: {
      drone: 1.0,
      swarm: 1.0,
      radar: 0.5,
      stealth: 0.7,
      heavy: 0.3,
    },
    range: 80, // Medium range
    autoTrigger: false, // Manual targeting required
    cooldown: 1000, // 1 second cooldown
    ammo: 20, // Limited ammo
  },
  electronic: {
    name: "EW Jammer",
    color: "#0088ff",
    effectiveness: {
      drone: 0.7,
      swarm: 0.8,
      radar: 1.0,
      stealth: 0.5,
      heavy: 0.6,
    },
    range: 120, // Long range
    autoTrigger: true, // Auto-triggers within range
    cooldown: 2000, // 2 second cooldown
    // Unlimited ammo
  },
  laser: {
    name: "Directed Energy",
    color: "#ff0088",
    effectiveness: {
      drone: 0.8,
      swarm: 0.6,
      radar: 0.7,
      stealth: 1.0,
      heavy: 1.0,
    },
    range: 100, // Long range but precise
    autoTrigger: false, // Manual targeting for precision
    cooldown: 500, // Fast cooldown
    ammo: 50, // High ammo capacity
  },
};
