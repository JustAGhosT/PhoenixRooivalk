/**
 * Collision System for Drone Impact Detection
 * Provides realistic collision detection and impact physics
 */

import { distance } from "./mathUtils";

export interface CollisionBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CollisionCircle {
  x: number;
  y: number;
  radius: number;
}

export interface ImpactResult {
  hasCollision: boolean;
  collisionPoint?: { x: number; y: number };
  impactForce?: number;
  penetrationDepth?: number;
  collisionNormal?: { x: number; y: number };
}

export interface PhysicsObject {
  id: string;
  x: number;
  y: number;
  velocity: { x: number; y: number };
  mass: number;
  radius?: number;
  width?: number;
  height?: number;
  type: "circle" | "rectangle";
  restitution?: number; // Bounciness (0-1)
  friction?: number; // Friction coefficient (0-1)
}

export interface DebrisParticle {
  id: string;
  x: number;
  y: number;
  velocity: { x: number; y: number };
  size: number;
  life: number;
  maxLife: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
}


/**
 * Check collision between two circles
 */
export function circleCircleCollision(
  circle1: CollisionCircle,
  circle2: CollisionCircle,
): ImpactResult {
  const dist = distance(circle1.x, circle1.y, circle2.x, circle2.y);
  const combinedRadius = circle1.radius + circle2.radius;

  if (dist < combinedRadius) {
    const penetrationDepth = combinedRadius - dist;

    // Handle zero distance case to prevent NaN
    let collisionNormal;
    let collisionPoint;

    if (dist === 0) {
      // Use safe default unit vector when objects are exactly on top of each other
      collisionNormal = { x: 1, y: 0 };
      collisionPoint = {
        x: circle1.x + circle1.radius,
        y: circle1.y,
      };
    } else {
      // Normal case: normalize by distance
      collisionNormal = {
        x: (circle2.x - circle1.x) / dist,
        y: (circle2.y - circle1.y) / dist,
      };
      collisionPoint = {
        x:
          circle1.x +
          (circle2.x - circle1.x) * (circle1.radius / combinedRadius),
        y:
          circle1.y +
          (circle2.y - circle1.y) * (circle1.radius / combinedRadius),
      };
    }

    const impactForce = Math.max(0, penetrationDepth * 10); // Scale factor for visual impact

    return {
      hasCollision: true,
      collisionPoint,
      impactForce,
      penetrationDepth,
      collisionNormal,
    };
  }

  return { hasCollision: false };
}

/**
 * Check collision between circle and rectangle
 */
export function circleRectangleCollision(
  circle: CollisionCircle,
  rectangle: CollisionBox,
): ImpactResult {
  // Find closest point on rectangle to circle center
  const closestX = Math.max(
    rectangle.x,
    Math.min(circle.x, rectangle.x + rectangle.width),
  );
  const closestY = Math.max(
    rectangle.y,
    Math.min(circle.y, rectangle.y + rectangle.height),
  );

  const dist = distance(circle.x, circle.y, closestX, closestY);

  if (dist < circle.radius) {
    const penetrationDepth = circle.radius - dist;
    const collisionPoint = { x: closestX, y: closestY };

    // Handle zero distance case to prevent NaN
    let collisionNormal;
    if (dist === 0) {
      // Use safe default unit vector when circle is exactly on rectangle corner/edge
      collisionNormal = { x: 1, y: 0 };
    } else {
      // Normal case: normalize by distance
      collisionNormal = {
        x: (circle.x - closestX) / dist,
        y: (circle.y - closestY) / dist,
      };
    }

    const impactForce = Math.max(0, penetrationDepth * 10);

    return {
      hasCollision: true,
      collisionPoint,
      impactForce,
      penetrationDepth,
      collisionNormal,
    };
  }

  return { hasCollision: false };
}

/**
 * Check collision between two rectangles
 */
export function rectangleRectangleCollision(
  rect1: CollisionBox,
  rect2: CollisionBox,
): ImpactResult {
  const overlapX = Math.max(
    0,
    Math.min(rect1.x + rect1.width, rect2.x + rect2.width) -
      Math.max(rect1.x, rect2.x),
  );
  const overlapY = Math.max(
    0,
    Math.min(rect1.y + rect1.height, rect2.y + rect2.height) -
      Math.max(rect1.y, rect2.y),
  );

  if (overlapX > 0 && overlapY > 0) {
    const collisionPoint = {
      x:
        (Math.max(rect1.x, rect2.x) +
          Math.min(rect1.x + rect1.width, rect2.x + rect2.width)) /
        2,
      y:
        (Math.max(rect1.y, rect2.y) +
          Math.min(rect1.y + rect1.height, rect2.y + rect2.height)) /
        2,
    };

    const penetrationDepth = Math.min(overlapX, overlapY);
    const impactForce = penetrationDepth * 5;

    return {
      hasCollision: true,
      collisionPoint,
      impactForce,
      penetrationDepth,
    };
  }

  return { hasCollision: false };
}

/**
 * Main collision system class
 */
export class CollisionSystem {
  private objects: Map<string, PhysicsObject> = new Map();
  private debris: DebrisParticle[] = [];
  private debrisIdCounter = 0;

  /**
   * Add an object to collision detection
   */
  addObject(obj: PhysicsObject): void {
    this.objects.set(obj.id, obj);
  }

  /**
   * Remove an object from collision detection
   */
  removeObject(id: string): void {
    this.objects.delete(id);
  }

  /**
   * Update object position and check for collisions
   */
  updateObject(
    id: string,
    x: number,
    y: number,
    velocity?: { x: number; y: number },
  ): void {
    const obj = this.objects.get(id);
    if (obj) {
      obj.x = x;
      obj.y = y;
      if (velocity) {
        obj.velocity = velocity;
      }
    }
  }

  /**
   * Check all objects for collisions
   */
  checkCollisions(): Array<{
    obj1: PhysicsObject;
    obj2: PhysicsObject;
    result: ImpactResult;
  }> {
    const collisions: Array<{
      obj1: PhysicsObject;
      obj2: PhysicsObject;
      result: ImpactResult;
    }> = [];
    const objectArray = Array.from(this.objects.values());

    for (let i = 0; i < objectArray.length; i++) {
      for (let j = i + 1; j < objectArray.length; j++) {
        const obj1 = objectArray[i];
        const obj2 = objectArray[j];

        const result = this.checkObjectCollision(obj1, obj2);
        if (result.hasCollision) {
          collisions.push({ obj1, obj2, result });
        }
      }
    }

    return collisions;
  }

  /**
   * Check collision between two specific objects
   */
  private checkObjectCollision(
    obj1: PhysicsObject,
    obj2: PhysicsObject,
  ): ImpactResult {
    if (obj1.type === "circle" && obj2.type === "circle") {
      return circleCircleCollision(
        { x: obj1.x, y: obj1.y, radius: obj1.radius! },
        { x: obj2.x, y: obj2.y, radius: obj2.radius! },
      );
    } else if (obj1.type === "circle" && obj2.type === "rectangle") {
      return circleRectangleCollision(
        { x: obj1.x, y: obj1.y, radius: obj1.radius! },
        { x: obj2.x, y: obj2.y, width: obj2.width!, height: obj2.height! },
      );
    } else if (obj1.type === "rectangle" && obj2.type === "circle") {
      return circleRectangleCollision(
        { x: obj2.x, y: obj2.y, radius: obj2.radius! },
        { x: obj1.x, y: obj1.y, width: obj1.width!, height: obj1.height! },
      );
    } else if (obj1.type === "rectangle" && obj2.type === "rectangle") {
      return rectangleRectangleCollision(
        { x: obj1.x, y: obj1.y, width: obj1.width!, height: obj1.height! },
        { x: obj2.x, y: obj2.y, width: obj2.width!, height: obj2.height! },
      );
    }

    return { hasCollision: false };
  }

  /**
   * Create debris particles at collision point
   */
  createDebris(
    x: number,
    y: number,
    impactForce: number,
    count: number = Math.min(10, Math.floor(impactForce / 5)),
  ): void {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const speed = Math.random() * impactForce * 0.1 + 1;

      const particle: DebrisParticle = {
        id: `debris_${this.debrisIdCounter++}`,
        x,
        y,
        velocity: {
          x: Math.cos(angle) * speed,
          y: Math.sin(angle) * speed,
        },
        size: Math.random() * 3 + 1,
        life: 1.0,
        maxLife: Math.random() * 2 + 1,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        color: `hsl(${Math.random() * 60 + 20}, 70%, 50%)`, // Orange-red colors
      };

      this.debris.push(particle);
    }
  }

  /**
   * Update debris particles
   */
  updateDebris(deltaTime: number): void {
    this.debris = this.debris.filter((particle) => {
      particle.life -= deltaTime / particle.maxLife;
      particle.x += particle.velocity.x * deltaTime;
      particle.y += particle.velocity.y * deltaTime;
      particle.rotation += particle.rotationSpeed * deltaTime;

      // Apply gravity
      particle.velocity.y += 0.5 * deltaTime;

      // Apply air resistance
      particle.velocity.x *= 0.98;
      particle.velocity.y *= 0.98;

      return particle.life > 0;
    });
  }

  /**
   * Get all debris particles
   */
  getDebris(): DebrisParticle[] {
    return this.debris;
  }

  /**
   * Clear all debris
   */
  clearDebris(): void {
    this.debris = [];
  }

  /**
   * Get all objects
   */
  getObjects(): PhysicsObject[] {
    return Array.from(this.objects.values());
  }

  /**
   * Clear all objects
   */
  clear(): void {
    this.objects.clear();
    this.debris = [];
  }
}

/**
 * Create a physics object with default values
 */
export function createPhysicsObject(
  id: string,
  x: number,
  y: number,
  type: "circle" | "rectangle",
  options: Partial<PhysicsObject> = {},
): PhysicsObject {
  return {
    id,
    x,
    y,
    velocity: { x: 0, y: 0 },
    mass: 1,
    restitution: 0.3,
    friction: 0.8,
    radius: type === "circle" ? 10 : undefined,
    width: type === "rectangle" ? 20 : undefined,
    height: type === "rectangle" ? 20 : undefined,
    type,
    ...options,
  };
}

/**
 * Calculate impact damage based on collision
 */
export function calculateImpactDamage(
  obj1: PhysicsObject,
  obj2: PhysicsObject,
  impactResult: ImpactResult,
): number {
  if (!impactResult.hasCollision || !impactResult.impactForce) return 0;

  // Base damage from impact force
  let damage = impactResult.impactForce * 0.1;

  // Factor in relative velocities
  const relativeVelocity = Math.sqrt(
    (obj1.velocity.x - obj2.velocity.x) ** 2 +
      (obj1.velocity.y - obj2.velocity.y) ** 2,
  );

  damage += relativeVelocity * 0.5;

  // Factor in mass
  damage *= (obj1.mass + obj2.mass) / 2;

  return Math.max(0, damage);
}
