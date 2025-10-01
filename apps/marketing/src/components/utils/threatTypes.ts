// Shared type definitions for Threat Simulator

export interface Threat {
  id: string;
  x: number;
  y: number;
  type: "drone" | "swarm" | "stealth";
  health: number;
  speed: number;
  trail: { x: number; y: number; timestamp: number }[];
  lastPosition: { x: number; y: number };
  behavior: "direct" | "evasive" | "zigzag" | "hover";
  evasionLevel: number; // 0-1, increases with difficulty
}
