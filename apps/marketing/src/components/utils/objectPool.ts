// Object Pool System - Memory Efficient Resource Management
// This system will be ported to Rust in the main application

export interface Poolable {
  id: string;
  isActive: boolean;
  lastUsed: number;
}

export interface PoolConfig<T> {
  initialSize: number;
  maxSize: number;
  createFn: () => T;
  resetFn: (obj: T) => void;
  validateFn?: (obj: T) => boolean;
}

export interface PoolStats {
  totalObjects: number;
  activeObjects: number;
  inactiveObjects: number;
  utilizationRate: number;
}

// Generic Object Pool for efficient memory management
export class ObjectPool<T extends Poolable> {
  private pool: T[] = [];
  private active: Set<string> = new Set();
  private config: PoolConfig<T>;
  private nextId = 0;

  constructor(config: PoolConfig<T>) {
    this.config = config;
    this.initializePool();
  }

  // Initialize pool with initial objects
  private initializePool(): void {
    for (let i = 0; i < this.config.initialSize; i++) {
      const obj = this.config.createFn();
      obj.id = this.generateId();
      obj.isActive = false;
      obj.lastUsed = 0;
      this.pool.push(obj);
    }
  }

  // Get object from pool
  acquire(): T | null {
    // Try to find inactive object
    let obj = this.pool.find((o) => !o.isActive);

    // If no inactive objects and under max size, create new one
    if (!obj && this.pool.length < this.config.maxSize) {
      obj = this.config.createFn();
      obj.id = this.generateId();
      this.pool.push(obj);
    }

    if (obj) {
      obj.isActive = true;
      obj.lastUsed = Date.now();
      this.active.add(obj.id);
      return obj;
    }

    return null;
  }

  // Return object to pool
  release(obj: T): void {
    if (!this.active.has(obj.id)) {
      return; // Object not from this pool
    }

    // Reset object state
    this.config.resetFn(obj);
    obj.isActive = false;
    obj.lastUsed = Date.now();

    this.active.delete(obj.id);
  }

  // Release object by ID
  releaseById(id: string): void {
    const obj = this.pool.find((o) => o.id === id);
    if (obj) {
      this.release(obj);
    }
  }

  // Get active object by ID
  getById(id: string): T | null {
    return this.pool.find((o) => o.id === id && o.isActive) || null;
  }

  // Get all active objects
  getActive(): T[] {
    return this.pool.filter((o) => o.isActive);
  }

  // Clean up inactive objects older than specified time
  cleanup(maxAge: number = 30000): void {
    const cutoff = Date.now() - maxAge;
    const inactive = this.pool.filter(
      (o) => !o.isActive && o.lastUsed < cutoff,
    );

    inactive.forEach((obj) => {
      const index = this.pool.indexOf(obj);
      if (index > -1) {
        this.pool.splice(index, 1);
      }
    });
  }

  // Validate all active objects
  validateActive(): void {
    if (!this.config.validateFn) return;

    const invalid = this.getActive().filter(
      (obj) => !this.config.validateFn!(obj),
    );
    invalid.forEach((obj) => this.release(obj));
  }

  // Get pool statistics
  getStats(): PoolStats {
    const activeCount = this.active.size;
    const totalCount = this.pool.length;
    const inactiveCount = totalCount - activeCount;

    return {
      totalObjects: totalCount,
      activeObjects: activeCount,
      inactiveObjects: inactiveCount,
      utilizationRate: totalCount > 0 ? activeCount / totalCount : 0,
    };
  }

  // Generate unique ID
  private generateId(): string {
    return `pool-${this.nextId++}-${Date.now()}`;
  }
}

// Specialized Pools for Game Entities
export interface ThreatPoolObject extends Poolable {
  type: "threat";
  threatType: string;
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  health: number;
  maxHealth: number;
  behavior: string;
  trail: Array<{ x: number; y: number; timestamp: number }>;
  specialProperties: Record<string, unknown>;
}

export interface DronePoolObject extends Poolable {
  type: "drone";
  droneType: string;
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  health: number;
  maxHealth: number;
  energy: number;
  maxEnergy: number;
  mission: string;
  targetId?: string;
  formationId?: string;
  isReturning: boolean;
}

export interface ProjectilePoolObject extends Poolable {
  type: "projectile";
  weaponType: string;
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  damage: number;
  range: number;
  targetId: string;
  ownerId: string;
}

export interface ParticlePoolObject extends Poolable {
  type: "particle";
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  opacity: number;
}

// Pool Factory Functions
export const createThreatPool = (
  initialSize: number = 50,
): ObjectPool<ThreatPoolObject> => {
  return new ObjectPool<ThreatPoolObject>({
    initialSize,
    maxSize: 200,
    createFn: (): ThreatPoolObject => ({
      id: "",
      isActive: false,
      lastUsed: 0,
      type: "threat",
      threatType: "drone",
      position: { x: 0, y: 0 },
      velocity: { x: 0, y: 0 },
      health: 100,
      maxHealth: 100,
      behavior: "direct",
      trail: [],
      specialProperties: {},
    }),
    resetFn: (threat: ThreatPoolObject): void => {
      threat.threatType = "drone";
      threat.position = { x: 0, y: 0 };
      threat.velocity = { x: 0, y: 0 };
      threat.health = 100;
      threat.maxHealth = 100;
      threat.behavior = "direct";
      threat.trail = [];
      threat.specialProperties = {};
    },
    validateFn: (threat: ThreatPoolObject): boolean => {
      return (
        threat.health > 0 && threat.position.x >= 0 && threat.position.y >= 0
      );
    },
  });
};

export const createDronePool = (
  initialSize: number = 20,
): ObjectPool<DronePoolObject> => {
  return new ObjectPool<DronePoolObject>({
    initialSize,
    maxSize: 100,
    createFn: (): DronePoolObject => ({
      id: "",
      isActive: false,
      lastUsed: 0,
      type: "drone",
      droneType: "interceptor",
      position: { x: 0, y: 0 },
      velocity: { x: 0, y: 0 },
      health: 100,
      maxHealth: 100,
      energy: 100,
      maxEnergy: 100,
      mission: "patrol",
      isReturning: false,
    }),
    resetFn: (drone: DronePoolObject): void => {
      drone.droneType = "interceptor";
      drone.position = { x: 0, y: 0 };
      drone.velocity = { x: 0, y: 0 };
      drone.health = 100;
      drone.maxHealth = 100;
      drone.energy = 100;
      drone.maxEnergy = 100;
      drone.mission = "patrol";
      drone.targetId = undefined;
      drone.formationId = undefined;
      drone.isReturning = false;
    },
    validateFn: (drone: DronePoolObject): boolean => {
      return drone.health > 0 && drone.energy > 0;
    },
  });
};

export const createProjectilePool = (
  initialSize: number = 100,
): ObjectPool<ProjectilePoolObject> => {
  return new ObjectPool<ProjectilePoolObject>({
    initialSize,
    maxSize: 500,
    createFn: (): ProjectilePoolObject => ({
      id: "",
      isActive: false,
      lastUsed: 0,
      type: "projectile",
      weaponType: "kinetic",
      position: { x: 0, y: 0 },
      velocity: { x: 0, y: 0 },
      damage: 50,
      range: 200,
      targetId: "",
      ownerId: "",
    }),
    resetFn: (projectile: ProjectilePoolObject): void => {
      projectile.weaponType = "kinetic";
      projectile.position = { x: 0, y: 0 };
      projectile.velocity = { x: 0, y: 0 };
      projectile.damage = 50;
      projectile.range = 200;
      projectile.targetId = "";
      projectile.ownerId = "";
    },
    validateFn: (projectile: ProjectilePoolObject): boolean => {
      return projectile.damage > 0 && projectile.range > 0;
    },
  });
};

export const createParticlePool = (
  initialSize: number = 200,
): ObjectPool<ParticlePoolObject> => {
  return new ObjectPool<ParticlePoolObject>({
    initialSize,
    maxSize: 1000,
    createFn: (): ParticlePoolObject => ({
      id: "",
      isActive: false,
      lastUsed: 0,
      type: "particle",
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      life: 1.0,
      maxLife: 1.0,
      size: 2,
      color: "#ffffff",
      opacity: 1.0,
    }),
    resetFn: (particle: ParticlePoolObject): void => {
      particle.x = 0;
      particle.y = 0;
      particle.vx = 0;
      particle.vy = 0;
      particle.life = 1.0;
      particle.maxLife = 1.0;
      particle.size = 2;
      particle.color = "#ffffff";
      particle.opacity = 1.0;
    },
    validateFn: (particle: ParticlePoolObject): boolean => {
      return particle.life > 0;
    },
  });
};

// Pool Manager for centralized management
export class PoolManager {
  private pools: Map<string, ObjectPool<any>> = new Map();

  constructor() {
    this.initializePools();
  }

  private initializePools(): void {
    this.pools.set("threats", createThreatPool());
    this.pools.set("drones", createDronePool());
    this.pools.set("projectiles", createProjectilePool());
    this.pools.set("particles", createParticlePool());
  }

  // Get pool by name
  getPool<T extends Poolable>(name: string): ObjectPool<T> | null {
    return (this.pools.get(name) as ObjectPool<T>) || null;
  }

  // Cleanup all pools
  cleanupAll(maxAge: number = 30000): void {
    this.pools.forEach((pool) => pool.cleanup(maxAge));
  }

  // Validate all pools
  validateAll(): void {
    this.pools.forEach((pool) => pool.validateActive());
  }

  // Get statistics for all pools
  getAllStats(): Record<string, PoolStats> {
    const stats: Record<string, PoolStats> = {};
    this.pools.forEach((pool, name) => {
      stats[name] = pool.getStats();
    });
    return stats;
  }

  // Get total memory usage estimate
  getMemoryUsage(): {
    totalObjects: number;
    activeObjects: number;
    estimatedMemoryMB: number;
  } {
    let totalObjects = 0;
    let activeObjects = 0;

    this.pools.forEach((pool) => {
      const poolStats = pool.getStats();
      totalObjects += poolStats.totalObjects;
      activeObjects += poolStats.activeObjects;
    });

    // Rough estimate: 1KB per object
    const estimatedMemoryMB = (totalObjects * 1024) / (1024 * 1024);

    return {
      totalObjects,
      activeObjects,
      estimatedMemoryMB,
    };
  }
}
