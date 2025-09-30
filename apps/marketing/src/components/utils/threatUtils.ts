// Utilities for threat management

import { Threat } from "./threatTypes";

// Function to move threats toward a specified target position
export const moveThreats = (
  threats: Threat[],
  target: { x: number; y: number },
): Threat[] => {
  return threats.map((threat) => {
    const dx = target.x - threat.x;
    const dy = target.y - threat.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 5) {
      const moveX = (dx / distance) * threat.speed;
      const moveY = (dy / distance) * threat.speed;

      return {
        ...threat,
        x: threat.x + moveX,
        y: threat.y + moveY,
      };
    }

    return threat;
  });
};

// Function to spawn a single threat
export const spawnThreat = (
  threatType: "drone" | "swarm" | "stealth",
  boundingRect: DOMRect,
): Threat => {
  const types: ("drone" | "swarm" | "stealth")[] = [
    "drone",
    "swarm",
    "stealth",
  ];
  const type = threatType || types[Math.floor(Math.random() * types.length)];

  return {
    id: `threat-${Date.now()}-${Math.random()}`,
    x: Math.random() * Math.max(boundingRect.width - 40, 200),
    y: Math.random() * Math.max(boundingRect.height - 40, 200),
    type,
    health: type === "stealth" ? 3 : type === "swarm" ? 2 : 1,
    speed: type === "stealth" ? 0.5 : type === "swarm" ? 1.5 : 1,
  };
};
