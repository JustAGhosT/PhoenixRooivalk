/**
 * Shared type definitions for research and unlock systems
 */

export interface ResearchOption {
  type: string;
  category: "effector" | "drone";
  name: string;
  description: string;
  researchCost: number;
  unlockCost: number;
  isUnlocked: boolean;
}
