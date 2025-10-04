// Shared type definitions for Threat Simulator

export interface Threat {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: "drone" | "swarm" | "stealth" | "kamikaze" | "decoy" | "shielded" | "boss";
  speed: number;
  health: number;
  maxHealth: number;
  trail: Array<{ x: number; y: number; timestamp: number }>;
  createdAt: number;
  lastUpdate: number;
  isMoving: boolean;
  status: "active" | "neutralized" | "crater";
  neutralizedAt?: number;
  fadeStartTime?: number;
  specialProperties?: {
    stealthMode?: boolean;
    swarmBehavior?: boolean;
    explosionRadius?: number;
    shieldStrength?: number;
    opacity?: number;
  };
  priorityLevel?: "high" | "medium" | "low";
  shouldRemove?: boolean;
}
