// Shared type definitions for Threat Simulator

export interface Threat {
  id: string;
  x: number;
  y: number;
  type: "drone" | "swarm" | "stealth";
  health: number;
  speed: number;
}
