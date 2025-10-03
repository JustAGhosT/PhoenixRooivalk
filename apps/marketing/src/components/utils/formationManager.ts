// Formation Management System - Reusable Core Logic for Phoenix Rooivalk
// This system will be ported to Rust in the main application

export interface Formation {
  id: string;
  name: string;
  type: "circle" | "line" | "diamond" | "wedge" | "semicircle" | "swarm";
  centerX: number;
  centerY: number;
  radius: number;
  spacing: number;
  droneIds: string[];
  isActive: boolean;
  priority: number;
  effectiveness: number;
  lastUpdate: number;
  // Semicircle specific
  semicircleDegrees?: number;
  semicircleDirection?: "north" | "south" | "east" | "west";
}

export interface DronePosition {
  droneId: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  formationRole: "leader" | "wingman" | "flanker" | "support" | "reserve";
  priority: number;
}

export interface FormationCommand {
  id: string;
  type: "create" | "modify" | "disband" | "reposition";
  formationId?: string;
  droneIds: string[];
  parameters: Partial<Formation>;
  priority: number;
  estimatedExecutionTime: number;
}

export interface FormationEffectiveness {
  formationId: string;
  threatType: string;
  effectiveness: number;
  advantages: string[];
  disadvantages: string[];
  recommendedModifications: string[];
}

// Core formation management engine
export class FormationManager {
  private formations: Map<string, Formation> = new Map();
  private dronePositions: Map<string, DronePosition> = new Map();
  private commandQueue: FormationCommand[] = [];
  private effectivenessMatrix: Map<string, FormationEffectiveness> = new Map();

  constructor() {
    this.initializeEffectivenessMatrix();
  }

  // Initialize effectiveness matrix for different threat types
  private initializeEffectivenessMatrix(): void {
    const threatTypes = [
      "drone",
      "swarm",
      "stealth",
      "kamikaze",
      "decoy",
      "shielded",
    ];
    const formationTypes = [
      "circle",
      "line",
      "diamond",
      "wedge",
      "semicircle",
      "swarm",
    ];

    formationTypes.forEach((formationType) => {
      threatTypes.forEach((threatType) => {
        const effectiveness = this.calculateBaseEffectiveness(
          formationType,
          threatType,
        );
        const key = `${formationType}-${threatType}`;

        this.effectivenessMatrix.set(key, {
          formationId: formationType as Formation["type"],
          threatType,
          effectiveness: effectiveness.score,
          advantages: effectiveness.advantages,
          disadvantages: effectiveness.disadvantages,
          recommendedModifications: effectiveness.modifications,
        });
      });
    });
  }

  // Calculate base effectiveness for formation vs threat type
  private calculateBaseEffectiveness(
    formationType: string,
    threatType: string,
  ): {
    score: number;
    advantages: string[];
    disadvantages: string[];
    modifications: string[];
  } {
    const combinations: Record<
      string,
      {
        score: number;
        advantages: string[];
        disadvantages: string[];
        modifications: string[];
      }
    > = {
      "circle-drone": {
        score: 0.8,
        advantages: ["360-degree coverage", "mutual support"],
        disadvantages: ["vulnerable to area attacks"],
        modifications: ["tighten formation", "increase spacing"],
      },
      "circle-swarm": {
        score: 0.6,
        advantages: ["defensive perimeter"],
        disadvantages: ["overwhelmed by numbers"],
        modifications: ["switch to wedge", "add interceptors"],
      },
      "line-stealth": {
        score: 0.7,
        advantages: ["linear detection", "overlapping coverage"],
        disadvantages: ["flank vulnerability"],
        modifications: ["add surveillance drones", "create staggered line"],
      },
      "diamond-kamikaze": {
        score: 0.9,
        advantages: ["central protection", "intercept capabilities"],
        disadvantages: ["limited mobility"],
        modifications: ["dynamic positioning", "rapid response protocols"],
      },
      "wedge-shielded": {
        score: 0.5,
        advantages: ["concentrated firepower"],
        disadvantages: ["ineffective against shields"],
        modifications: ["switch to jamming formation", "deploy shield drones"],
      },
      "semicircle-swarm": {
        score: 0.8,
        advantages: ["focused defense", "flexible positioning"],
        disadvantages: ["rear vulnerability"],
        modifications: ["adjust arc coverage", "add rear guards"],
      },
    };

    return (
      combinations[`${formationType}-${threatType}`] || {
        score: 0.5,
        advantages: ["standard effectiveness"],
        disadvantages: ["no specific advantages"],
        modifications: ["maintain formation"],
      }
    );
  }

  // Create a new formation
  createFormation(
    name: string,
    type: Formation["type"],
    centerX: number,
    centerY: number,
    droneIds: string[],
    options?: {
      radius?: number;
      spacing?: number;
      semicircleDegrees?: number;
      semicircleDirection?: Formation["semicircleDirection"];
    },
  ): Formation {
    const formation: Formation = {
      id: `formation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      type,
      centerX,
      centerY,
      radius: options?.radius || 100,
      spacing: options?.spacing || 50,
      droneIds,
      isActive: true,
      priority: 1,
      effectiveness: 0.8,
      lastUpdate: Date.now(),
      semicircleDegrees: options?.semicircleDegrees,
      semicircleDirection: options?.semicircleDirection,
    };

    this.formations.set(formation.id, formation);
    this.updateDronePositions(formation);

    return formation;
  }

  // Update drone positions based on formation
  private updateDronePositions(formation: Formation): void {
    const positions = this.calculateFormationPositions(formation);

    positions.forEach((position, index) => {
      this.dronePositions.set(position.droneId, {
        ...position,
        formationRole: this.assignFormationRole(formation.type, index),
        priority: formation.priority,
      });
    });
  }

  // Calculate positions for different formation types
  private calculateFormationPositions(formation: Formation): DronePosition[] {
    const positions: DronePosition[] = [];
    const { type } = formation;

    switch (type) {
      case "circle":
        return this.calculateCirclePositions(formation, formation.droneIds);
      case "line":
        return this.calculateLinePositions(formation, formation.droneIds);
      case "diamond":
        return this.calculateDiamondPositions(formation, formation.droneIds);
      case "wedge":
        return this.calculateWedgePositions(formation, formation.droneIds);
      case "semicircle":
        return this.calculateSemicirclePositions(formation, formation.droneIds);
      case "swarm":
        return this.calculateSwarmPositions(formation, formation.droneIds);
      default:
        return positions;
    }
  }

  // Calculate circle formation positions
  private calculateCirclePositions(
    formation: Formation,
    droneIds: string[],
  ): DronePosition[] {
    const positions: DronePosition[] = [];
    const angleStep = (2 * Math.PI) / droneIds.length;

    droneIds.forEach((droneId, index) => {
      const angle = index * angleStep;
      const x = formation.centerX + Math.cos(angle) * formation.radius;
      const y = formation.centerY + Math.sin(angle) * formation.radius;

      positions.push({
        droneId,
        x,
        y,
        targetX: x,
        targetY: y,
        formationRole: "wingman",
        priority: formation.priority,
      });
    });

    return positions;
  }

  // Calculate line formation positions
  private calculateLinePositions(
    formation: Formation,
    droneIds: string[],
  ): DronePosition[] {
    const positions: DronePosition[] = [];
    const totalWidth = (droneIds.length - 1) * formation.spacing;
    const startX = formation.centerX - totalWidth / 2;

    droneIds.forEach((droneId, index) => {
      const x = startX + index * formation.spacing;
      const y = formation.centerY;

      positions.push({
        droneId,
        x,
        y,
        targetX: x,
        targetY: y,
        formationRole: index === 0 ? "leader" : "wingman",
        priority: formation.priority,
      });
    });

    return positions;
  }

  // Calculate diamond formation positions
  private calculateDiamondPositions(
    formation: Formation,
    droneIds: string[],
  ): DronePosition[] {
    const positions: DronePosition[] = [];

    if (droneIds.length === 1) {
      positions.push({
        droneId: droneIds[0],
        x: formation.centerX,
        y: formation.centerY,
        targetX: formation.centerX,
        targetY: formation.centerY,
        formationRole: "leader",
        priority: formation.priority,
      });
    } else if (droneIds.length >= 4) {
      const diamondPositions = [
        { x: formation.centerX, y: formation.centerY - formation.radius }, // Top
        { x: formation.centerX + formation.radius, y: formation.centerY }, // Right
        { x: formation.centerX, y: formation.centerY + formation.radius }, // Bottom
        { x: formation.centerX - formation.radius, y: formation.centerY }, // Left
      ];

      droneIds.slice(0, 4).forEach((droneId, index) => {
        const pos = diamondPositions[index];
        positions.push({
          droneId,
          x: pos.x,
          y: pos.y,
          targetX: pos.x,
          targetY: pos.y,
          formationRole: index === 0 ? "leader" : "wingman",
          priority: formation.priority,
        });
      });

      // Additional drones in center
      droneIds.slice(4).forEach((droneId, index) => {
        positions.push({
          droneId,
          x:
            formation.centerX +
            (index % 2 === 0 ? -formation.spacing / 2 : formation.spacing / 2),
          y:
            formation.centerY +
            (index % 2 === 0 ? -formation.spacing / 2 : formation.spacing / 2),
          targetX:
            formation.centerX +
            (index % 2 === 0 ? -formation.spacing / 2 : formation.spacing / 2),
          targetY:
            formation.centerY +
            (index % 2 === 0 ? -formation.spacing / 2 : formation.spacing / 2),
          formationRole: "support",
          priority: formation.priority,
        });
      });
    }

    return positions;
  }

  // Calculate wedge formation positions
  private calculateWedgePositions(
    formation: Formation,
    droneIds: string[],
  ): DronePosition[] {
    const positions: DronePosition[] = [];

    if (droneIds.length === 1) {
      positions.push({
        droneId: droneIds[0],
        x: formation.centerX,
        y: formation.centerY,
        targetX: formation.centerX,
        targetY: formation.centerY,
        formationRole: "leader",
        priority: formation.priority,
      });
    } else {
      // Leader at front
      positions.push({
        droneId: droneIds[0],
        x: formation.centerX,
        y: formation.centerY - formation.radius,
        targetX: formation.centerX,
        targetY: formation.centerY - formation.radius,
        formationRole: "leader",
        priority: formation.priority,
      });

      // Others fan out behind
      const remainingDrones = droneIds.slice(1);
      const halfWidth = Math.floor(remainingDrones.length / 2);

      remainingDrones.forEach((droneId, index) => {
        const sideOffset = (index - halfWidth) * formation.spacing;
        positions.push({
          droneId,
          x: formation.centerX + sideOffset,
          y: formation.centerY + formation.spacing,
          targetX: formation.centerX + sideOffset,
          targetY: formation.centerY + formation.spacing,
          formationRole: "wingman",
          priority: formation.priority,
        });
      });
    }

    return positions;
  }

  // Calculate semicircle formation positions
  private calculateSemicirclePositions(
    formation: Formation,
    droneIds: string[],
  ): DronePosition[] {
    const positions: DronePosition[] = [];
    const degrees = formation.semicircleDegrees || 180;
    const radius = formation.radius;
    const direction = formation.semicircleDirection || "north";

    if (droneIds.length === 0) return positions;

    const radians = (degrees * Math.PI) / 180;
    const angleStep = droneIds.length > 1 ? radians / (droneIds.length - 1) : 0;

    // Calculate starting angle based on direction
    let startAngle: number;
    switch (direction) {
      case "north":
        startAngle = -radians / 2;
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

    droneIds.forEach((droneId, index) => {
      const angle = startAngle + index * angleStep;
      const x = formation.centerX + Math.cos(angle) * radius;
      const y = formation.centerY + Math.sin(angle) * radius;

      positions.push({
        droneId,
        x,
        y,
        targetX: x,
        targetY: y,
        formationRole: index === 0 ? "leader" : "wingman",
        priority: formation.priority,
      });
    });

    return positions;
  }

  // Calculate swarm formation positions
  private calculateSwarmPositions(
    formation: Formation,
    droneIds: string[],
  ): DronePosition[] {
    const positions: DronePosition[] = [];
    const clusterSize = Math.min(droneIds.length, 6);
    const clusters = Math.ceil(droneIds.length / clusterSize);

    droneIds.forEach((droneId, index) => {
      const clusterIndex = Math.floor(index / clusterSize);
      const clusterAngle = (clusterIndex * 2 * Math.PI) / clusters;
      const clusterRadius = formation.radius * (0.5 + clusterIndex * 0.3);

      const localIndex = index % clusterSize;
      const localAngle = (localIndex * 2 * Math.PI) / clusterSize;
      const localRadius = formation.spacing * 0.5;

      const x =
        formation.centerX +
        Math.cos(clusterAngle) * clusterRadius +
        Math.cos(localAngle) * localRadius;
      const y =
        formation.centerY +
        Math.sin(clusterAngle) * clusterRadius +
        Math.sin(localAngle) * localRadius;

      positions.push({
        droneId,
        x,
        y,
        targetX: x,
        targetY: y,
        formationRole: index === 0 ? "leader" : "wingman",
        priority: formation.priority,
      });
    });

    return positions;
  }

  // Assign formation role based on position
  private assignFormationRole(
    formationType: string,
    index: number,
  ): DronePosition["formationRole"] {
    if (index === 0) return "leader";

    switch (formationType) {
      case "wedge":
        return index <= 2 ? "wingman" : "support";
      case "diamond":
        return index < 4 ? "wingman" : "support";
      case "line":
        return index % 2 === 0 ? "wingman" : "flanker";
      default:
        return "wingman";
    }
  }

  // Modify existing formation
  modifyFormation(
    formationId: string,
    modifications: {
      centerX?: number;
      centerY?: number;
      radius?: number;
      spacing?: number;
      droneIds?: string[];
      semicircleDegrees?: number;
      semicircleDirection?: Formation["semicircleDirection"];
    },
  ): boolean {
    const formation = this.formations.get(formationId);
    if (!formation) return false;

    // Apply modifications
    Object.assign(formation, modifications);
    formation.lastUpdate = Date.now();

    // Update drone positions
    this.updateDronePositions(formation);

    return true;
  }

  // Disband formation
  disbandFormation(formationId: string): boolean {
    const formation = this.formations.get(formationId);
    if (!formation) return false;

    // Remove drone positions
    formation.droneIds.forEach((droneId) => {
      this.dronePositions.delete(droneId);
    });

    // Remove formation
    this.formations.delete(formationId);

    return true;
  }

  // Get optimal formation for threat type
  getOptimalFormation(
    threatType: string,
    droneCount: number,
    centerX: number,
    centerY: number,
  ): { type: Formation["type"]; parameters: Partial<Formation> } {
    const effectivenessScores = new Map<string, number>();

    // Evaluate each formation type
    const formationTypes: Formation["type"][] = [
      "circle",
      "line",
      "diamond",
      "wedge",
      "semicircle",
      "swarm",
    ];

    formationTypes.forEach((formationType) => {
      const key = `${formationType}-${threatType}`;
      const effectiveness = this.effectivenessMatrix.get(key);
      if (effectiveness) {
        effectivenessScores.set(formationType, effectiveness.effectiveness);
      }
    });

    // Select best formation
    const bestFormation = Array.from(effectivenessScores.entries()).sort(
      (a, b) => b[1] - a[1],
    )[0];

    if (!bestFormation) {
      return { type: "circle", parameters: { radius: 100, spacing: 50 } };
    }

    // Generate parameters based on formation type and drone count
    const parameters = this.generateFormationParameters(
      bestFormation[0] as Formation["type"],
      droneCount,
      centerX,
      centerY,
    );

    return {
      type: bestFormation[0] as Formation["type"],
      parameters,
    };
  }

  // Generate formation parameters
  private generateFormationParameters(
    formationType: Formation["type"],
    droneCount: number,
    _centerX: number,
    _centerY: number,
  ): Partial<Formation> {
    const parameters: Partial<Formation> = {
      radius: Math.max(50, droneCount * 10),
      spacing: Math.max(30, droneCount * 5),
    };

    switch (formationType) {
      case "semicircle":
        parameters.semicircleDegrees = Math.min(180, droneCount * 20);
        parameters.semicircleDirection = "north";
        break;
      case "swarm":
        parameters.radius = Math.max(80, droneCount * 15);
        break;
    }

    return parameters;
  }

  // Update formation effectiveness based on performance
  updateFormationEffectiveness(
    formationId: string,
    threatType: string,
    success: boolean,
    _performanceMetrics?: Record<string, number>,
  ): void {
    const formation = this.formations.get(formationId);
    if (!formation) return;

    // Update effectiveness score
    const adjustment = success ? 0.05 : -0.1;
    formation.effectiveness = Math.max(
      0,
      Math.min(1, formation.effectiveness + adjustment),
    );

    // Update effectiveness matrix
    const key = `${formation.type}-${threatType}`;
    const effectiveness = this.effectivenessMatrix.get(key);
    if (effectiveness) {
      effectiveness.effectiveness = Math.max(
        0,
        Math.min(1, effectiveness.effectiveness + adjustment),
      );
    }
  }

  // Get all formations
  getFormations(): Formation[] {
    return Array.from(this.formations.values());
  }

  // Get drone positions
  getDronePositions(): DronePosition[] {
    return Array.from(this.dronePositions.values());
  }

  // Get formation effectiveness data
  getFormationEffectiveness(): FormationEffectiveness[] {
    return Array.from(this.effectivenessMatrix.values());
  }

  // Queue formation command
  queueFormationCommand(command: FormationCommand): void {
    this.commandQueue.push(command);
    this.commandQueue.sort((a, b) => a.priority - b.priority);
  }

  // Process queued commands
  processCommandQueue(): void {
    const currentTime = Date.now();

    this.commandQueue = this.commandQueue.filter((command) => {
      if (currentTime >= command.estimatedExecutionTime) {
        this.executeFormationCommand(command);
        return false; // Remove from queue
      }
      return true; // Keep in queue
    });
  }

  // Execute formation command
  private executeFormationCommand(command: FormationCommand): void {
    switch (command.type) {
      case "create":
        this.createFormation(
          command.parameters.name as string,
          command.parameters.type as Formation["type"],
          command.parameters.centerX as number,
          command.parameters.centerY as number,
          command.droneIds,
          command.parameters,
        );
        break;
      case "modify":
        if (command.formationId) {
          this.modifyFormation(command.formationId, command.parameters);
        }
        break;
      case "disband":
        if (command.formationId) {
          this.disbandFormation(command.formationId);
        }
        break;
    }
  }

  // Get formation statistics
  getFormationStatistics(): {
    totalFormations: number;
    activeFormations: number;
    averageEffectiveness: number;
    mostEffectiveFormation: string;
  } {
    const formations = Array.from(this.formations.values());
    const activeFormations = formations.filter((f) => f.isActive);
    const averageEffectiveness =
      activeFormations.reduce((sum, f) => sum + f.effectiveness, 0) /
      activeFormations.length;

    const mostEffectiveFormation =
      activeFormations.sort((a, b) => b.effectiveness - a.effectiveness)[0]
        ?.type || "none";

    return {
      totalFormations: formations.length,
      activeFormations: activeFormations.length,
      averageEffectiveness: averageEffectiveness || 0,
      mostEffectiveFormation,
    };
  }
}
