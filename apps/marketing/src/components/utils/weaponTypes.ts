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
    boss: number;
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
  type: "rapid-fire" | "damage-boost" | "area-effect" | "range-boost";
  duration: number; // milliseconds
  startTime: number;
  isActive: boolean;
  effect: {
    damageMultiplier?: number;
    cooldownReduction?: number;
    rangeMultiplier?: number;
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
      boss: 0.5,
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
      boss: 0.8,
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
      boss: 0.7,
    },
    visualEffect: {
      color: "#f97316",
      size: 2,
      trail: false,
    },
  },
  net: {
    id: "net",
    name: "Net Interceptor",
    damage: 0.5,
    range: 150,
    cooldown: 6000,
    maxAmmo: 20,
    effectiveness: {
      drone: 1.2,
      swarm: 0.9,
      stealth: 0.3,
      kamikaze: 0.8,
      decoy: 0.1,
      shielded: 0.1,
      boss: 0.2,
    },
    visualEffect: {
      color: "#10b981",
      size: 2,
      trail: false,
    },
  },
  hpm: {
    id: "hpm",
    name: "HPM Burst",
    damage: 3,
    range: 800,
    cooldown: 10000,
    maxAmmo: 15,
    effectiveness: {
      drone: 2.0,
      swarm: 2.5,
      stealth: 1.8,
      kamikaze: 1.5,
      decoy: 0.2,
      shielded: 1.2,
      boss: 1.0,
    },
    visualEffect: {
      color: "#f59e0b",
      size: 6,
      trail: true,
    },
  },
  rf_take: {
    id: "rf_take",
    name: "RF Takeover",
    damage: 0,
    range: 1200,
    cooldown: 12000,
    maxAmmo: 10,
    effectiveness: {
      drone: 1.8,
      swarm: 1.5,
      stealth: 0.2,
      kamikaze: 0.1,
      decoy: 2.0,
      shielded: 0.8,
      boss: 0.3,
    },
    visualEffect: {
      color: "#8b5cf6",
      size: 5,
      trail: false,
    },
  },
  gnss_deny: {
    id: "gnss_deny",
    name: "GNSS Denial Bubble",
    damage: 0,
    range: 500,
    cooldown: 8000,
    maxAmmo: 25,
    effectiveness: {
      drone: 1.5,
      swarm: 2.0,
      stealth: 0.1,
      kamikaze: 0.3,
      decoy: 0.1,
      shielded: 0.2,
      boss: 0.1,
    },
    visualEffect: {
      color: "#06b6d4",
      size: 8,
      trail: false,
    },
  },
  optic_dazzle: {
    id: "optic_dazzle",
    name: "Optical Dazzler",
    damage: 0.5,
    range: 300,
    cooldown: 5000,
    maxAmmo: 40,
    effectiveness: {
      drone: 1.3,
      swarm: 1.0,
      stealth: 0.8,
      kamikaze: 0.6,
      decoy: 0.1,
      shielded: 0.1,
      boss: 0.4,
    },
    visualEffect: {
      color: "#f97316",
      size: 4,
      trail: true,
    },
  },
  acoustic: {
    id: "acoustic",
    name: "Acoustic Disruptor",
    damage: 0.3,
    range: 200,
    cooldown: 5000,
    maxAmmo: 60,
    effectiveness: {
      drone: 1.1,
      swarm: 1.4,
      stealth: 0.5,
      kamikaze: 0.7,
      decoy: 0.1,
      shielded: 0.1,
      boss: 0.3,
    },
    visualEffect: {
      color: "#84cc16",
      size: 3,
      trail: false,
    },
  },
  decoy_beacon: {
    id: "decoy_beacon",
    name: "Decoy Beacon",
    damage: 0,
    range: 1000,
    cooldown: 10000,
    maxAmmo: 8,
    effectiveness: {
      drone: 0.8,
      swarm: 1.2,
      stealth: 0.3,
      kamikaze: 0.5,
      decoy: 2.5,
      shielded: 0.1,
      boss: 0.2,
    },
    visualEffect: {
      color: "#ec4899",
      size: 2,
      trail: false,
    },
  },
  chaff: {
    id: "chaff",
    name: "Chaff/Obscurant",
    damage: 0,
    range: 100,
    cooldown: 8000,
    maxAmmo: 30,
    effectiveness: {
      drone: 0.6,
      swarm: 0.8,
      stealth: 0.4,
      kamikaze: 0.3,
      decoy: 0.1,
      shielded: 0.1,
      boss: 0.1,
    },
    visualEffect: {
      color: "#6b7280",
      size: 7,
      trail: false,
    },
  },
  smart_slug: {
    id: "smart_slug",
    name: "Smart Slug",
    damage: 2.5,
    range: 600,
    cooldown: 7000,
    maxAmmo: 12,
    effectiveness: {
      drone: 2.2,
      swarm: 1.8,
      stealth: 1.5,
      kamikaze: 2.0,
      decoy: 0.2,
      shielded: 1.0,
      boss: 1.8,
    },
    visualEffect: {
      color: "#dc2626",
      size: 2,
      trail: true,
    },
  },
  ai_deception: {
    id: "ai_deception",
    name: "AI Deception",
    damage: 0,
    range: 2000,
    cooldown: 12000,
    maxAmmo: 5,
    effectiveness: {
      drone: 1.6,
      swarm: 2.2,
      stealth: 1.2,
      kamikaze: 0.8,
      decoy: 1.8,
      shielded: 0.6,
      boss: 0.7,
    },
    visualEffect: {
      color: "#7c3aed",
      size: 6,
      trail: false,
    },
  },
};

export const POWER_UP_CONFIGS: Record<
  string,
  Omit<PowerUp, "startTime" | "isActive">
> = {
  "damage-boost": {
    id: "damage-boost",
    name: "Damage Boost",
    type: "damage-boost",
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
  "range-boost": {
    id: "range-boost",
    name: "Range Boost",
    type: "range-boost",
    duration: 12000, // 12 seconds
    effect: {
      rangeMultiplier: 1.5,
    },
  },
};
