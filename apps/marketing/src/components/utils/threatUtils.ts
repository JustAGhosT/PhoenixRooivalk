// Utilities for threat management

import { Threat } from "./threatTypes";

// Function to move threats toward a specified target position with AI behavior
export const moveThreats = (
  threats: Threat[],
  target: { x: number; y: number },
  gameLevel: number = 1,
): Threat[] => {
  return threats.map((threat) => {
    const currentTime = Date.now();
    
    // Store current position as last position
    const lastPos = { x: threat.x, y: threat.y };
    
    // Add to trail (keep last 10 positions)
    const newTrail = [
      ...threat.trail.slice(-9),
      { x: threat.x, y: threat.y, timestamp: currentTime }
    ];

    let newX = threat.x;
    let newY = threat.y;

    // Apply different behaviors based on threat type and level
    switch (threat.behavior) {
      case "evasive":
        // Evasive behavior - move away from center when close
        const dx = target.x - threat.x;
        const dy = target.y - threat.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          // Move away from center
          newX = threat.x - (dx / distance) * threat.speed * threat.evasionLevel;
          newY = threat.y - (dy / distance) * threat.speed * threat.evasionLevel;
        } else {
          // Move toward center
          newX = threat.x + (dx / distance) * threat.speed;
          newY = threat.y + (dy / distance) * threat.speed;
        }
        break;
        
      case "zigzag":
        // Zigzag pattern
        const angle = Math.sin(currentTime * 0.01) * 0.5;
        const baseDx = target.x - threat.x;
        const baseDy = target.y - threat.y;
        const baseDistance = Math.sqrt(baseDx * baseDx + baseDy * baseDy);
        
        if (baseDistance > 5) {
          const perpX = -baseDy / baseDistance;
          const perpY = baseDx / baseDistance;
          
          newX = threat.x + (baseDx / baseDistance) * threat.speed + perpX * threat.speed * angle * threat.evasionLevel;
          newY = threat.y + (baseDy / baseDistance) * threat.speed + perpY * threat.speed * angle * threat.evasionLevel;
        }
        break;
        
      case "hover":
        // Hover behavior - stay at a distance
        const hoverDx = target.x - threat.x;
        const hoverDy = target.y - threat.y;
        const hoverDistance = Math.sqrt(hoverDx * hoverDx + hoverDy * hoverDy);
        const desiredDistance = 80 + threat.evasionLevel * 40;
        
        if (hoverDistance > desiredDistance + 10) {
          newX = threat.x + (hoverDx / hoverDistance) * threat.speed;
          newY = threat.y + (hoverDy / hoverDistance) * threat.speed;
        } else if (hoverDistance < desiredDistance - 10) {
          newX = threat.x - (hoverDx / hoverDistance) * threat.speed;
          newY = threat.y - (hoverDy / hoverDistance) * threat.speed;
        }
        break;
        
      default: // "direct"
        // Direct movement toward target
        const directDx = target.x - threat.x;
        const directDy = target.y - threat.y;
        const directDistance = Math.sqrt(directDx * directDx + directDy * directDy);

        if (directDistance > 5) {
          newX = threat.x + (directDx / directDistance) * threat.speed;
          newY = threat.y + (directDy / directDistance) * threat.speed;
        }
        break;
    }

    return {
      ...threat,
      x: newX,
      y: newY,
      trail: newTrail,
      lastPosition: lastPos,
      evasionLevel: Math.min(1, 0.3 + (gameLevel - 1) * 0.1), // Increase evasion with level
    };
  });
};

// Function to spawn a single threat
export const spawnThreat = (
  threatType: "drone" | "swarm" | "stealth" | undefined = undefined,
  boundingRect: DOMRect,
  gameLevel: number = 1,
): Threat => {
  const types: ("drone" | "swarm" | "stealth")[] = [
    "drone",
    "swarm",
    "stealth",
  ];
  const type = threatType || types[Math.floor(Math.random() * types.length)];
  
  // Determine behavior based on type and level
  const behaviors: ("direct" | "evasive" | "zigzag" | "hover")[] = ["direct", "evasive", "zigzag", "hover"];
  const behavior = gameLevel > 3 ? behaviors[Math.floor(Math.random() * behaviors.length)] : "direct";
  
  // Scale speed and health with level
  const levelMultiplier = 1 + (gameLevel - 1) * 0.2;
  const baseHealth = type === "stealth" ? 3 : type === "swarm" ? 2 : 1;
  const baseSpeed = type === "stealth" ? 0.5 : type === "swarm" ? 1.5 : 1;

  return {
    id: `threat-${Date.now()}-${Math.random()}`,
    x: Math.random() * Math.max(boundingRect.width - 40, 200),
    y: Math.random() * Math.max(boundingRect.height - 40, 200),
    type,
    health: Math.floor(baseHealth * levelMultiplier),
    speed: baseSpeed * levelMultiplier,
    trail: [],
    lastPosition: { x: 0, y: 0 },
    behavior,
    evasionLevel: Math.min(1, 0.3 + (gameLevel - 1) * 0.1),
  };
};
