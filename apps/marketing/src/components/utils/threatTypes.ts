// Shared type definitions for Threat Simulator

export interface Threat {
  id: string;
  x: number;
  y: number;
  type: "drone" | "swarm" | "stealth" | "kamikaze" | "decoy" | "shielded";
  health: number;
  speed: number;
  trail: { x: number; y: number; timestamp: number }[];
  lastPosition: { x: number; y: number };
  behavior: "direct" | "evasive" | "zigzag" | "hover";
  evasionLevel: number; // 0-1, increases with difficulty
  specialProperties?: {
    isShielded?: boolean;
    shieldStrength?: number;
    isDecoy?: boolean;
    explosionRadius?: number;
    targetPriority?: "high" | "medium" | "low";
    vulnerability?: string[]; // What weapons are effective against this threat
  };
}
