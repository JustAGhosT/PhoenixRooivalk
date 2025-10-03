// apps/marketing/src/components/utils/autoTargeting.ts
import { GameState } from "../../types/game";
import { Threat } from "./threatTypes";
import { calculateThreatPriority, isPointNearThreat } from "./threatUtils";

export class AutoTargetingSystem {
  private lastEngagementTime: Map<string, number> = new Map();
  private engagementCooldown = 500; // ms between shots at same target

  /**
   * Finds the best target based on priority and distance
   */
  findBestTarget(
    threats: Threat[],
    mothershipPos: { x: number; y: number },
    weaponRange: number
  ): Threat | null {
    // Filter active threats within range
    const threatsInRange = threats.filter(threat => {
      if (threat.status !== "active" || !threat.isMoving) return false;
      return isPointNearThreat(mothershipPos, threat, weaponRange);
    });

    if (threatsInRange.length === 0) return null;

    // Sort by priority and distance
    const prioritizedThreats = threatsInRange.map(threat => ({
      threat,
      priority: calculateThreatPriority(threat, mothershipPos),
      distance: Math.sqrt(
        Math.pow(threat.x - mothershipPos.x, 2) + 
        Math.pow(threat.y - mothershipPos.y, 2)
      )
    }));

    prioritizedThreats.sort((a, b) => {
      // First sort by priority
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      // Then by distance (closer is higher priority)
      return a.distance - b.distance;
    });

    return prioritizedThreats[0]?.threat || null;
  }

  /**
   * Check if we can engage a target (cooldown check)
   */
  canEngageTarget(threatId: string, currentTime: number): boolean {
    const lastEngagement = this.lastEngagementTime.get(threatId) || 0;
    return currentTime - lastEngagement >= this.engagementCooldown;
  }

  /**
   * Record engagement time
   */
  recordEngagement(threatId: string, currentTime: number): void {
    this.lastEngagementTime.set(threatId, currentTime);
  }

  /**
   * Main auto-targeting logic
   */
  processAutoTargeting(
    gameState: GameState,
    currentTime: number,
    onFireWeapon: (targetId: string, x: number, y: number) => void
  ): void {
    // Only run in automated or hybrid mode
    if (gameState.automationMode === "manual") return;

    // Check if we have energy and weapon is ready
    const weapon = gameState.weapons[gameState.selectedWeapon];
    if (!weapon || !weapon.isReady || weapon.ammo <= 0) return;
    if (gameState.energy < 10) return; // Minimum energy required

    // Get weapon range
    const weaponRange = weapon.range || 200;

    // Find best target
    const target = this.findBestTarget(
      gameState.threats,
      gameState.mothership,
      weaponRange
    );

    if (!target) return;

    // Check cooldown
    if (!this.canEngageTarget(target.id, currentTime)) return;

    // Fire at target
    onFireWeapon(target.id, target.x, target.y);
    this.recordEngagement(target.id, currentTime);
  }

  /**
   * Process multi-target engagement for area weapons
   */
  processAreaEngagement(
    threats: Threat[],
    centerPoint: { x: number; y: number },
    radius: number,
    onNeutralizeTarget: (targetId: string) => void
  ): number {
    let targetsHit = 0;

    threats.forEach(threat => {
      if (threat.status !== "active") return;
      
      if (isPointNearThreat(centerPoint, threat, radius)) {
        onNeutralizeTarget(threat.id);
        targetsHit++;
      }
    });

    return targetsHit;
  }

  /**
   * Clean up old engagement records
   */
  cleanup(currentTime: number): void {
    const oldThreshold = currentTime - 10000; // Clean entries older than 10 seconds
    
    for (const [threatId, time] of this.lastEngagementTime.entries()) {
      if (time < oldThreshold) {
        this.lastEngagementTime.delete(threatId);
      }
    }
  }
}