// Game Engine Core - Language-Agnostic System for Phoenix Rooivalk
// This system will be ported to Rust in the main application

export interface GameConfig {
  width: number;
  height: number;
  targetFPS: number;
  difficulty: number;
  missionType: string;
  automationMode: string;
}

export interface GameState {
  // Core game state
  score: number;
  level: number;
  gameTime: number;
  isRunning: boolean;
  frameRate: number;

  // Entities
  threats: ThreatEntity[];
  drones: DroneEntity[];
  projectiles: ProjectileEntity[];

  // Resources
  energy: number;
  maxEnergy: number;
  ammunition: number;
  maxAmmunition: number;

  // Systems
  weather: WeatherState;
  formations: FormationState[];
  deploymentZones: DeploymentZoneState[];
}

export interface Entity {
  id: string;
  type: string;
  position: Position;
  velocity: Velocity;
  health: number;
  maxHealth: number;
  lastUpdate: number;
}

export interface ThreatEntity extends Entity {
  threatType: string;
  behavior: string;
  targetPriority: number;
  trail: Position[];
  specialProperties: Record<string, unknown>;
}

export interface DroneEntity extends Entity {
  droneType: string;
  mission: string;
  targetId?: string;
  formationId?: string;
  energy: number;
  maxEnergy: number;
  isReturning: boolean;
}

export interface ProjectileEntity extends Entity {
  weaponType: string;
  damage: number;
  range: number;
  targetId: string;
  ownerId: string;
}

export interface Position {
  x: number;
  y: number;
}

export interface Velocity {
  x: number;
  y: number;
}

export interface WeatherState {
  type: "none" | "rain" | "fog" | "night";
  intensity: number;
  windDirection: number;
  windSpeed: number;
}

export interface FormationState {
  id: string;
  type: string;
  center: Position;
  droneIds: string[];
  isActive: boolean;
}

export interface DeploymentZoneState {
  id: string;
  center: Position;
  radius: number;
  priority: string;
  threatLevel: number;
  coverage: number;
}

// Core Game Engine - Pure Functions Only
export class GameEngine {
  private config: GameConfig;
  private state: GameState;
  private systems: Map<string, GameSystem> = new Map();
  private eventQueue: GameEvent<unknown>[] = [];

  constructor(config: GameConfig) {
    this.config = config;
    this.state = this.initializeGameState(config);
  }

  // Pure function to initialize game state
  private initializeGameState(config: GameConfig): GameState {
    return {
      score: 0,
      level: 1,
      gameTime: 0,
      isRunning: true,
      frameRate: config.targetFPS,
      threats: [],
      drones: [],
      projectiles: [],
      energy: 100,
      maxEnergy: 100,
      ammunition: 100,
      maxAmmunition: 100,
      weather: {
        type: "none",
        intensity: 0,
        windDirection: 0,
        windSpeed: 0,
      },
      formations: [],
      deploymentZones: [],
    };
  }

  // Register a game system
  registerSystem(name: string, system: GameSystem): void {
    this.systems.set(name, system);
  }

  // Process game events
  processEvents(): void {
    while (this.eventQueue.length > 0) {
      const event = this.eventQueue.shift();
      if (event) {
        this.handleEvent(event);
      }
    }
  }

  // Handle individual game event
  private handleEvent(event: GameEvent<unknown>): void {
    switch (event.type) {
      case "spawn-threat":
        this.spawnThreat(event.data as ThreatSpawnEvent);
        break;
      case "deploy-drone":
        this.deployDrone(event.data as DroneDeployEvent);
        break;
      case "fire-weapon":
        this.fireWeapon(event.data as WeaponFireEvent);
        break;
      case "neutralize-threat":
        this.neutralizeThreat(event.data as ThreatNeutralizeEvent);
        break;
      case "update-resources":
        this.updateResources(event.data as ResourceUpdateEvent);
        break;
    }
  }

  // Pure function to spawn threat
  private spawnThreat(event: ThreatSpawnEvent): void {
    const threat: ThreatEntity = {
      id: `threat-${Date.now()}-${Math.random()}`,
      type: "threat",
      position: event.position,
      velocity: event.velocity || { x: 0, y: 0 },
      health: event.health || 100,
      maxHealth: event.health || 100,
      lastUpdate: Date.now(),
      threatType: event.threatType,
      behavior: event.behavior || "direct",
      targetPriority: event.priority || 1,
      trail: [],
      specialProperties: event.specialProperties || {},
    };

    this.state.threats.push(threat);
  }

  // Pure function to deploy drone
  private deployDrone(event: DroneDeployEvent): void {
    if (this.state.energy < 50) return; // Insufficient energy

    const drone: DroneEntity = {
      id: `drone-${Date.now()}-${Math.random()}`,
      type: "drone",
      position: event.position,
      velocity: { x: 0, y: 0 },
      health: 100,
      maxHealth: 100,
      lastUpdate: Date.now(),
      droneType: event.droneType,
      mission: event.mission || "patrol",
      targetId: event.targetId,
      formationId: event.formationId,
      energy: 100,
      maxEnergy: 100,
      isReturning: false,
    };

    this.state.drones.push(drone);
    this.state.energy -= 50;
  }

  // Pure function to fire weapon
  private fireWeapon(event: WeaponFireEvent): void {
    if (this.state.ammunition <= 0) return;

    const projectile: ProjectileEntity = {
      id: `projectile-${Date.now()}-${Math.random()}`,
      type: "projectile",
      position: event.position,
      velocity: event.velocity,
      health: 1,
      maxHealth: 1,
      lastUpdate: Date.now(),
      weaponType: event.weaponType,
      damage: event.damage,
      range: event.range,
      targetId: event.targetId,
      ownerId: event.ownerId,
    };

    this.state.projectiles.push(projectile);
    this.state.ammunition -= 1;
  }

  // Pure function to neutralize threat
  private neutralizeThreat(event: ThreatNeutralizeEvent): void {
    this.state.threats = this.state.threats.filter(
      (threat) => threat.id !== event.threatId,
    );
    this.state.score += event.scoreBonus || 100;
  }

  // Pure function to update resources
  private updateResources(event: ResourceUpdateEvent): void {
    this.state.energy = Math.min(
      this.state.maxEnergy,
      this.state.energy + event.energyDelta,
    );
    this.state.ammunition = Math.min(
      this.state.maxAmmunition,
      this.state.ammunition + event.ammunitionDelta,
    );
  }

  // Update game state - called each frame
  update(deltaTime: number): void {
    if (!this.state.isRunning) return;

    // Process events
    this.processEvents();

    // Update systems
    this.systems.forEach((system) => {
      system.update(this.state, deltaTime);
    });

    // Update game time
    this.state.gameTime += deltaTime;

    // Update entities
    this.updateEntities(deltaTime);

    // Check win/lose conditions
    this.checkGameConditions();
  }

  // Pure function to update entities
  private updateEntities(deltaTime: number): void {
    // Update threats
    this.state.threats = this.state.threats.map((threat) =>
      this.updateThreat(threat, deltaTime),
    );

    // Update drones
    this.state.drones = this.state.drones.map((drone) =>
      this.updateDrone(drone, deltaTime),
    );

    // Update projectiles
    this.state.projectiles = this.state.projectiles
      .map((projectile) => this.updateProjectile(projectile, deltaTime))
      .filter((projectile) => projectile.health > 0);
  }

  // Pure function to update threat
  private updateThreat(threat: ThreatEntity, deltaTime: number): ThreatEntity {
    // Update position based on behavior
    const newPosition = this.calculateThreatPosition(threat, deltaTime);

    // Update trail
    const newTrail = [
      ...threat.trail.slice(-9),
      { x: threat.position.x, y: threat.position.y },
    ];

    return {
      ...threat,
      position: newPosition,
      trail: newTrail,
      lastUpdate: Date.now(),
    };
  }

  // Pure function to update drone
  private updateDrone(drone: DroneEntity, deltaTime: number): DroneEntity {
    // Update position based on mission
    const newPosition = this.calculateDronePosition(drone, deltaTime);

    return {
      ...drone,
      position: newPosition,
      lastUpdate: Date.now(),
    };
  }

  // Pure function to update projectile
  private updateProjectile(
    projectile: ProjectileEntity,
    deltaTime: number,
  ): ProjectileEntity {
    const newPosition = {
      x: projectile.position.x + projectile.velocity.x * deltaTime,
      y: projectile.position.y + projectile.velocity.y * deltaTime,
    };

    // Check if projectile has reached its target
    const target = this.findEntity(projectile.targetId);
    if (target) {
      const distance = this.calculateDistance(newPosition, target.position);
      if (distance < 10) {
        // Hit target
        return { ...projectile, health: 0 };
      }
    }

    return {
      ...projectile,
      position: newPosition,
      lastUpdate: Date.now(),
    };
  }

  // Pure function to calculate threat position
  private calculateThreatPosition(
    threat: ThreatEntity,
    deltaTime: number,
  ): Position {
    const centerX = this.config.width / 2;
    const centerY = this.config.height / 2;

    switch (threat.behavior) {
      case "direct":
        return {
          x: threat.position.x + threat.velocity.x * deltaTime,
          y: threat.position.y + threat.velocity.y * deltaTime,
        };

      case "evasive": {
        const dx = centerX - threat.position.x;
        const dy = centerY - threat.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          // Move away from center
          return {
            x:
              threat.position.x -
              (dx / distance) * threat.velocity.x * deltaTime,
            y:
              threat.position.y -
              (dy / distance) * threat.velocity.y * deltaTime,
          };
        } else {
          // Move toward center
          return {
            x:
              threat.position.x +
              (dx / distance) * threat.velocity.x * deltaTime,
            y:
              threat.position.y +
              (dy / distance) * threat.velocity.y * deltaTime,
          };
        }
      }

      default:
        return threat.position;
    }
  }

  // Pure function to calculate drone position
  private calculateDronePosition(
    drone: DroneEntity,
    deltaTime: number,
  ): Position {
    if (drone.targetId) {
      const target = this.findEntity(drone.targetId);
      if (target) {
        const dx = target.position.x - drone.position.x;
        const dy = target.position.y - drone.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 10) {
          return {
            x: drone.position.x + (dx / distance) * 50 * deltaTime,
            y: drone.position.y + (dy / distance) * 50 * deltaTime,
          };
        }
      }
    }

    return drone.position;
  }

  // Pure function to find entity by ID
  private findEntity(id: string): Entity | null {
    return (
      this.state.threats.find((t) => t.id === id) ||
      this.state.drones.find((d) => d.id === id) ||
      null
    );
  }

  // Pure function to calculate distance
  private calculateDistance(pos1: Position, pos2: Position): number {
    const dx = pos1.x - pos2.x;
    const dy = pos1.y - pos2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // Check win/lose conditions
  private checkGameConditions(): void {
    // Implement win/lose logic
    if (this.state.threats.length === 0 && this.state.level > 1) {
      this.state.level += 1;
    }
  }

  // Get current game state (immutable)
  getState(): Readonly<GameState> {
    return Object.freeze({ ...this.state });
  }

  // Queue game event
  queueEvent(event: GameEvent<unknown>): void {
    this.eventQueue.push(event);
  }

  // Update configuration
  updateConfig(newConfig: Partial<GameConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  // Reset game state
  reset(): void {
    this.state = this.initializeGameState(this.config);
    this.eventQueue = [];
  }
}

// Game System Interface
export interface GameSystem {
  name: string;
  update(state: GameState, deltaTime: number): void;
}

// Game Event System
export interface GameEvent<T> {
  type: string;
  data: T;
  timestamp: number;
}

export interface ThreatSpawnEvent {
  position: Position;
  velocity?: Velocity;
  threatType: string;
  behavior?: string;
  health?: number;
  priority?: number;
  specialProperties?: Record<string, unknown>;
}

export interface DroneDeployEvent {
  position: Position;
  droneType: string;
  mission?: string;
  targetId?: string;
  formationId?: string;
}

export interface WeaponFireEvent {
  position: Position;
  velocity: Velocity;
  weaponType: string;
  damage: number;
  range: number;
  targetId: string;
  ownerId: string;
}

export interface ThreatNeutralizeEvent {
  threatId: string;
  scoreBonus?: number;
}

export interface ResourceUpdateEvent {
  energyDelta: number;
  ammunitionDelta: number;
}

// Event Factory Functions
export const createEvent = <T>(type: string, data: T): GameEvent<T> => ({
  type,
  data,
  timestamp: Date.now(),
});

export const createThreatSpawnEvent = (
  position: Position,
  threatType: string,
  options?: Partial<ThreatSpawnEvent>,
): GameEvent<ThreatSpawnEvent> =>
  createEvent("spawn-threat", {
    position,
    threatType,
    ...options,
  });

export const createDroneDeployEvent = (
  position: Position,
  droneType: string,
  options?: Partial<DroneDeployEvent>,
): GameEvent<DroneDeployEvent> =>
  createEvent("deploy-drone", {
    position,
    droneType,
    ...options,
  });

export const createWeaponFireEvent = (
  position: Position,
  targetId: string,
  weaponType: string,
  options?: Partial<WeaponFireEvent>,
): GameEvent<WeaponFireEvent> =>
  createEvent("fire-weapon", {
    position,
    targetId,
    weaponType,
    damage: 50,
    range: 200,
    ownerId: "player",
    velocity: { x: 0, y: 0 },
    ...options,
  });

export const createThreatNeutralizeEvent = (
  threatId: string,
  scoreBonus?: number,
): GameEvent<ThreatNeutralizeEvent> =>
  createEvent("neutralize-threat", {
    threatId,
    scoreBonus,
  });

export const createResourceUpdateEvent = (
  energyDelta: number,
  ammunitionDelta: number,
): GameEvent<ResourceUpdateEvent> =>
  createEvent("update-resources", {
    energyDelta,
    ammunitionDelta,
  });
