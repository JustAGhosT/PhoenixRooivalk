/**
 * Drone Path Interpolation System
 * Provides smooth, realistic movement for drones and threats
 */

export interface PathPoint {
  x: number;
  y: number;
  timestamp: number;
}

export interface InterpolatedPath {
  points: PathPoint[];
  targetX: number;
  targetY: number;
  startTime: number;
  duration: number;
  easing: (t: number) => number;
}

export interface MovementConfig {
  speed: number;
  maxSpeed: number;
  acceleration: number;
  deceleration: number;
  turnRate: number; // degrees per frame
  smoothing: number; // 0-1, higher = smoother
}

/**
 * Easing functions for natural movement
 */
export const easingFunctions = {
  linear: (t: number) => t,
  easeInOut: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeOut: (t: number) => 1 - Math.pow(1 - t, 3),
  easeIn: (t: number) => t * t * t,
  bezier: (t: number) => 3 * t * t - 2 * t * t * t, // Smooth S-curve
  bounce: (t: number) => {
    if (t < 1 / 2.75) return 7.5625 * t * t;
    if (t < 2 / 2.75) return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
    if (t < 2.5 / 2.75) return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
    return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
  },
};

/**
 * Calculate distance between two points
 */
export function distance(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): number {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

/**
 * Calculate angle between two points in degrees
 */
export function angleBetween(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): number {
  return Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
}

/**
 * Normalize angle to 0-360 range
 */
export function normalizeAngle(angle: number): number {
  while (angle < 0) angle += 360;
  while (angle >= 360) angle -= 360;
  return angle;
}

/**
 * Calculate shortest angle difference between two angles
 */
export function angleDifference(from: number, to: number): number {
  let diff = to - from;
  while (diff > 180) diff -= 360;
  while (diff < -180) diff += 360;
  return diff;
}

/**
 * Smooth interpolation between two points with physics
 */
export class DronePathInterpolator {
  private config: MovementConfig;
  private currentPath: InterpolatedPath | null = null;
  private currentVelocity: { x: number; y: number } = { x: 0, y: 0 };
  private lastPosition: { x: number; y: number } = { x: 0, y: 0 };

  constructor(config: Partial<MovementConfig> = {}) {
    this.config = {
      speed: 2,
      maxSpeed: 5,
      acceleration: 0.1,
      deceleration: 0.15,
      turnRate: 5,
      smoothing: 0.8,
      ...config,
    };
  }

  /**
   * Start a new path to a target position
   */
  setTarget(
    targetX: number,
    targetY: number,
    currentX: number,
    currentY: number,
  ): void {
    const dist = distance(currentX, currentY, targetX, targetY);
    const duration = Math.max(1000, (dist / this.config.speed) * 1000); // Minimum 1 second

    this.currentPath = {
      points: [
        { x: currentX, y: currentY, timestamp: Date.now() },
        { x: targetX, y: targetY, timestamp: Date.now() + duration },
      ],
      targetX,
      targetY,
      startTime: Date.now(),
      duration,
      easing: easingFunctions.easeInOut,
    };

    this.lastPosition = { x: currentX, y: currentY };
  }

  /**
   * Update position based on current path and physics
   */
  updatePosition(
    currentX: number,
    currentY: number,
  ): { x: number; y: number; velocity: { x: number; y: number } } {
    if (!this.currentPath) {
      return { x: currentX, y: currentY, velocity: this.currentVelocity };
    }

    const now = Date.now();
    const elapsed = now - this.currentPath.startTime;
    const progress = Math.min(elapsed / this.currentPath.duration, 1);

    // Calculate target position using easing
    const easedProgress = this.currentPath.easing(progress);

    const startX = this.currentPath.points[0].x;
    const startY = this.currentPath.points[0].y;
    const targetX = this.currentPath.targetX;
    const targetY = this.currentPath.targetY;

    // Apply physics-based movement
    const targetPosition = {
      x: startX + (targetX - startX) * easedProgress,
      y: startY + (targetY - startY) * easedProgress,
    };

    // Calculate desired velocity
    const desiredVelocity = {
      x: (targetPosition.x - currentX) * this.config.acceleration,
      y: (targetPosition.y - currentY) * this.config.acceleration,
    };

    // Apply velocity constraints
    const desiredSpeed = Math.sqrt(
      desiredVelocity.x ** 2 + desiredVelocity.y ** 2,
    );
    if (desiredSpeed > this.config.maxSpeed) {
      desiredVelocity.x =
        (desiredVelocity.x / desiredSpeed) * this.config.maxSpeed;
      desiredVelocity.y =
        (desiredVelocity.y / desiredSpeed) * this.config.maxSpeed;
    }

    // Smooth velocity changes
    this.currentVelocity.x +=
      (desiredVelocity.x - this.currentVelocity.x) * this.config.smoothing;
    this.currentVelocity.y +=
      (desiredVelocity.y - this.currentVelocity.y) * this.config.smoothing;

    // Apply velocity to position
    const newPosition = {
      x: currentX + this.currentVelocity.x,
      y: currentY + this.currentVelocity.y,
    };

    // Check if we've reached the target (within tolerance)
    const distanceToTarget = distance(
      newPosition.x,
      newPosition.y,
      targetX,
      targetY,
    );
    if (distanceToTarget < 5 || progress >= 1) {
      // Path complete
      this.currentPath = null;
      this.currentVelocity = { x: 0, y: 0 };
      return { x: targetX, y: targetY, velocity: this.currentVelocity };
    }

    this.lastPosition = newPosition;
    return {
      x: newPosition.x,
      y: newPosition.y,
      velocity: this.currentVelocity,
    };
  }

  /**
   * Check if currently moving along a path
   */
  isMoving(): boolean {
    return this.currentPath !== null;
  }

  /**
   * Get current path progress (0-1)
   */
  getProgress(): number {
    if (!this.currentPath) return 1;
    const elapsed = Date.now() - this.currentPath.startTime;
    return Math.min(elapsed / this.currentPath.duration, 1);
  }

  /**
   * Stop current movement
   */
  stop(): void {
    this.currentPath = null;
    this.currentVelocity = { x: 0, y: 0 };
  }
}

/**
 * Create a smooth waypoint path for complex movements
 */
export function createWaypointPath(
  waypoints: Array<{ x: number; y: number; duration?: number }>,
  config: Partial<MovementConfig> = {},
): DronePathInterpolator {
  const interpolator = new DronePathInterpolator(config);

  if (waypoints.length > 0) {
    const first = waypoints[0];
    interpolator.setTarget(first.x, first.y, first.x, first.y);
  }

  return interpolator;
}

/**
 * Create a curved path using Bezier curves
 */
export function createBezierPath(
  start: { x: number; y: number },
  control: { x: number; y: number },
  end: { x: number; y: number },
  config: Partial<MovementConfig> = {},
): DronePathInterpolator {
  const interpolator = new DronePathInterpolator({
    ...config,
    easing: easingFunctions.bezier,
  });

  interpolator.setTarget(end.x, end.y, start.x, start.y);
  return interpolator;
}

/**
 * Create a patrol path that loops between points
 */
export class PatrolPath {
  private waypoints: Array<{ x: number; y: number }>;
  private currentIndex: number = 0;
  private interpolator: DronePathInterpolator;
  private direction: number = 1; // 1 for forward, -1 for backward

  constructor(
    waypoints: Array<{ x: number; y: number }>,
    config: Partial<MovementConfig> = {},
  ) {
    this.waypoints = waypoints;
    this.interpolator = new DronePathInterpolator(config);

    if (waypoints.length > 0) {
      this.interpolator.setTarget(
        waypoints[0].x,
        waypoints[0].y,
        waypoints[0].x,
        waypoints[0].y,
      );
    }
  }

  updatePosition(
    currentX: number,
    currentY: number,
  ): { x: number; y: number; velocity: { x: number; y: number } } {
    const result = this.interpolator.updatePosition(currentX, currentY);

    // Check if we've reached the current waypoint
    if (!this.interpolator.isMoving()) {
      this.nextWaypoint();
    }

    return result;
  }

  private nextWaypoint(): void {
    if (this.waypoints.length <= 1) return;

    this.currentIndex += this.direction;

    // Reverse direction at ends
    if (this.currentIndex >= this.waypoints.length) {
      this.currentIndex = this.waypoints.length - 2;
      this.direction = -1;
    } else if (this.currentIndex < 0) {
      this.currentIndex = 1;
      this.direction = 1;
    }

    const target = this.waypoints[this.currentIndex];
    this.interpolator.setTarget(target.x, target.y, target.x, target.y);
  }
}
