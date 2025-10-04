// Formation Control Utilities for Phoenix Rooivalk Drone System

import { Drone, Formation } from "./mothershipTypes";

export interface FormationPosition {
  x: number;
  y: number;
  droneId: string;
}

/**
 * Calculate drone positions for different formation patterns
 */
export const calculateFormationPositions = (
  formation: Formation,
  drones: Drone[],
): FormationPosition[] => {
  const positions: FormationPosition[] = [];
  const activeDrones = drones.filter((drone) =>
    formation.droneIds.includes(drone.id),
  );

  if (activeDrones.length === 0) return positions;

  switch (formation.pattern) {
    case "circle":
      return calculateCircleFormation(formation, activeDrones);
    case "line":
      return calculateLineFormation(formation, activeDrones);
    case "diamond":
      return calculateDiamondFormation(formation, activeDrones);
    case "wedge":
      return calculateWedgeFormation(formation, activeDrones);
    case "semicircle":
      return calculateSemicircleFormation(formation, activeDrones);
    default:
      return positions;
  }
};

/**
 * Calculate positions for circular formation
 */
const calculateCircleFormation = (
  formation: Formation,
  drones: Drone[],
): FormationPosition[] => {
  const positions: FormationPosition[] = [];
  const angleStep = (2 * Math.PI) / drones.length;

  drones.forEach((drone, index) => {
    const angle = index * angleStep;
    const x = formation.centerX + Math.cos(angle) * formation.spacing;
    const y = formation.centerY + Math.sin(angle) * formation.spacing;

    positions.push({
      x,
      y,
      droneId: drone.id,
    });
  });

  return positions;
};

/**
 * Calculate positions for line formation
 */
const calculateLineFormation = (
  formation: Formation,
  drones: Drone[],
): FormationPosition[] => {
  const positions: FormationPosition[] = [];
  const totalWidth = (drones.length - 1) * formation.spacing;
  const startX = formation.centerX - totalWidth / 2;

  drones.forEach((drone, index) => {
    const x = startX + index * formation.spacing;
    const y = formation.centerY;

    positions.push({
      x,
      y,
      droneId: drone.id,
    });
  });

  return positions;
};

/**
 * Calculate positions for diamond formation
 */
const calculateDiamondFormation = (
  formation: Formation,
  drones: Drone[],
): FormationPosition[] => {
  const positions: FormationPosition[] = [];

  // Diamond formation: 1 at center, others in diamond pattern
  if (drones.length === 1) {
    positions.push({
      x: formation.centerX,
      y: formation.centerY,
      droneId: drones[0].id,
    });
  } else if (drones.length >= 4) {
    // Place drones in diamond corners
    const diamondPositions = [
      { x: formation.centerX, y: formation.centerY - formation.spacing }, // Top
      { x: formation.centerX + formation.spacing, y: formation.centerY }, // Right
      { x: formation.centerX, y: formation.centerY + formation.spacing }, // Bottom
      { x: formation.centerX - formation.spacing, y: formation.centerY }, // Left
    ];

    drones.slice(0, 4).forEach((drone, index) => {
      positions.push({
        ...diamondPositions[index],
        droneId: drone.id,
      });
    });

    // Additional drones fill the center
    drones.slice(4).forEach((drone, index) => {
      positions.push({
        x:
          formation.centerX +
          (index % 2 === 0 ? -formation.spacing / 2 : formation.spacing / 2),
        y:
          formation.centerY +
          (index % 2 === 0 ? -formation.spacing / 2 : formation.spacing / 2),
        droneId: drone.id,
      });
    });
  }

  return positions;
};

/**
 * Calculate positions for wedge formation
 */
const calculateWedgeFormation = (
  formation: Formation,
  drones: Drone[],
): FormationPosition[] => {
  const positions: FormationPosition[] = [];

  // Wedge formation: leader at front, others fan out behind
  if (drones.length === 1) {
    positions.push({
      x: formation.centerX,
      y: formation.centerY,
      droneId: drones[0].id,
    });
  } else {
    // Leader at front
    positions.push({
      x: formation.centerX,
      y: formation.centerY - formation.spacing,
      droneId: drones[0].id,
    });

    // Others fan out behind
    const remainingDrones = drones.slice(1);
    const halfWidth = Math.floor(remainingDrones.length / 2);

    remainingDrones.forEach((drone, index) => {
      const sideOffset = (index - halfWidth) * formation.spacing;
      positions.push({
        x: formation.centerX + sideOffset,
        y: formation.centerY + formation.spacing,
        droneId: drone.id,
      });
    });
  }

  return positions;
};

/**
 * Calculate positions for semicircle formation
 */
const calculateSemicircleFormation = (
  formation: Formation,
  drones: Drone[],
): FormationPosition[] => {
  const positions: FormationPosition[] = [];

  if (drones.length === 0) return positions;

  // Default semicircle properties
  const degrees = formation.semicircleDegrees || 180; // Default to half circle
  const radius = formation.semicircleRadius || formation.spacing;
  const direction = formation.semicircleDirection || "north";

  // Convert degrees to radians
  const radians = (degrees * Math.PI) / 180;
  const angleStep = drones.length > 1 ? radians / (drones.length - 1) : 0;

  // Calculate starting angle based on direction
  let startAngle: number;
  switch (direction) {
    case "north":
      startAngle = -radians / 2; // Start from left side of semicircle
      break;
    case "south":
      startAngle = Math.PI - radians / 2;
      break;
    case "east":
      startAngle = Math.PI / 2 - radians / 2;
      break;
    case "west":
      startAngle = (3 * Math.PI) / 2 - radians / 2;
      break;
    default:
      startAngle = -radians / 2;
  }

  drones.forEach((drone, index) => {
    const angle = startAngle + index * angleStep;
    const x = formation.centerX + Math.cos(angle) * radius;
    const y = formation.centerY + Math.sin(angle) * radius;

    positions.push({
      x,
      y,
      droneId: drone.id,
    });
  });

  return positions;
};

/**
 * Create a new formation with specified parameters
 */
export const createFormation = (
  name: string,
  pattern: Formation["pattern"],
  centerX: number,
  centerY: number,
  droneIds: string[],
  spacing: number = 50,
  semicircleDegrees?: number,
  semicircleRadius?: number,
  semicircleDirection?: Formation["semicircleDirection"],
): Formation => {
  return {
    id: `formation-${Date.now()}-${Math.random()}`,
    name,
    droneIds,
    centerX,
    centerY,
    pattern,
    spacing,
    isActive: true,
    semicircleDegrees,
    semicircleRadius: semicircleRadius,
    semicircleDirection,
    type: "patrol",
    position: { x: centerX, y: centerY },
  };
};

/**
 * Formation pattern descriptions for UI
 */
export const FORMATION_DESCRIPTIONS = {
  circle: "Circular defensive perimeter around target",
  line: "Linear formation for patrol or escort missions",
  diamond: "Tactical diamond for 360-degree coverage",
  wedge: "Attack formation with leader and supporting elements",
  semicircle: "Flexible arc formation with customizable coverage",
};

/**
 * Default semicircle configurations
 */
export const SEMICIRCLE_PRESETS = {
  "half-circle": { degrees: 180, radius: 100, direction: "north" as const },
  "quarter-circle": { degrees: 90, radius: 100, direction: "north" as const },
  "three-quarter": { degrees: 270, radius: 100, direction: "north" as const },
  "defensive-arc": { degrees: 120, radius: 150, direction: "south" as const },
  "attack-wedge": { degrees: 60, radius: 80, direction: "north" as const },
};
