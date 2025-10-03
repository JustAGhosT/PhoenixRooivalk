// Weapon system types and configurations

export interface Weapon {
  id: string;
  name: string;
  damage: number;
  range: number;
  cooldown: number; // milliseconds
  lastFired: number;
  isReady: boolean;
  ammo: number;
  maxAmmo: number;
  effectiveness: {
    drone: number;
    swarm: number;
    stealth: number;
    kamikaze: number;
    decoy: number;
    shielded: number;
  };
  visualEffect: {
    color: string;
    size: number;
    trail: boolean;
  };
}

export interface PowerUp {
  id: string;
  name: string;
  type:
    | "rapid-fire"
    | "damage-boost"
    | "area-effect"
    | "energy-boost"
    | "range-boost";
  duration: number; // milliseconds
  startTime: number;
  isActive: boolean;
  effect: {
    damageMultiplier?: number;
    cooldownReduction?: number;
    rangeMultiplier?: number;
    energyBoost?: number;
    penetration?: boolean;
  };
}

export const WEAPON_CONFIGS: Record<
  string,
  Omit<Weapon, "lastFired" | "isReady" | "ammo">
> = {
  kinetic: {
    id: "kinetic",
    name: "Kinetic Interceptor",
    damage: 1,
    range: 120,
    cooldown: 800,
    maxAmmo: 50,
    effectiveness: {
      drone: 1.0,
      swarm: 0.8,
      stealth: 0.6,
      kamikaze: 1.2,
      decoy: 0.3,
      shielded: 0.2,
    },
    visualEffect: {
      color: "#ef4444",
      size: 3,
      trail: true,
    },
  },
  electronic: {
    id: "electronic",
    name: "EMP Disruptor",
    damage: 2,
    range: 150,
    cooldown: 1200,
    maxAmmo: 30,
    effectiveness: {
      drone: 1.5,
      swarm: 1.2,
      stealth: 0.4,
      kamikaze: 0.8,
      decoy: 0.1,
      shielded: 0.9,
    },
    visualEffect: {
      color: "#3b82f6",
      size: 4,
      trail: false,
    },
  },
  laser: {
    id: "laser",
    name: "Directed Energy",
    damage: 1.5,
    range: 200,
    cooldown: 600,
    maxAmmo: 100,
    effectiveness: {
      drone: 1.1,
      swarm: 0.9,
      stealth: 1.8,
      kamikaze: 0.7,
      decoy: 0.5,
      shielded: 1.5,
    },
    visualEffect: {
      color: "#f97316",
      size: 2,
      trail: false,
    },
  },
};

export const POWER_UP_CONFIGS: Record<
  string,
  Omit<PowerUp, "startTime" | "isActive">
> = {
  "multi-shot": {
    id: "multi-shot",
    name: "Multi-Shot",
    type: "multi-shot",
    duration: 10000, // 10 seconds
    effect: {
      damageMultiplier: 1.5,
    },
  },
  "rapid-fire": {
    id: "rapid-fire",
    name: "Rapid Fire",
    type: "rapid-fire",
    duration: 8000, // 8 seconds
    effect: {
      cooldownReduction: 0.5, // 50% faster
    },
  },
  "area-effect": {
    id: "area-effect",
    name: "Area Effect",
    type: "area-effect",
    duration: 6000, // 6 seconds
    effect: {
      rangeMultiplier: 2.0,
    },
  },
  "shield-penetration": {
    id: "shield-penetration",
    name: "Shield Penetration",
    type: "shield-penetration",
    duration: 12000, // 12 seconds
    effect: {
      penetration: true,
    },
  },
};
