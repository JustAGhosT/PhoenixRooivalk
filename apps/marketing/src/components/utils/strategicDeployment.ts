// Strategic Deployment System - Reusable Core Logic for Phoenix Rooivalk
// This system will be ported to Rust in the main application

export interface DeploymentZone {
  id: string;
  name: string;
  centerX: number;
  centerY: number;
  radius: number;
  priority: "critical" | "high" | "medium" | "low";
  threatLevel: number; // 0-1 scale
  coverage: number; // percentage of area covered
  assignedDrones: string[];
  lastThreatDetected: number;
  recommendedDroneTypes: DroneType[];
}

export interface ThreatAssessment {
  id: string;
  type: ThreatType;
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  heading: number; // degrees
  estimatedArrivalTime: number;
  threatLevel: number; // 0-1 scale
  priority: "critical" | "high" | "medium" | "low";
  recommendedResponse: ResponseType;
}

export interface DeploymentRecommendation {
  zoneId: string;
  droneType: DroneType;
  position: { x: number; y: number };
  priority: number;
  reasoning: string;
  estimatedEffectiveness: number;
}

export type DroneType =
  | "interceptor"
  | "jammer"
  | "surveillance"
  | "shield"
  | "swarm-coordinator";
export type ThreatType =
  | "drone"
  | "swarm"
  | "stealth"
  | "kamikaze"
  | "decoy"
  | "shielded";
export type ResponseType =
  | "intercept"
  | "jam"
  | "surveil"
  | "shield"
  | "evade"
  | "multi-target";

// Core strategic deployment algorithm
export class StrategicDeploymentEngine {
  private deploymentZones: Map<string, DeploymentZone> = new Map();
  private threatAssessments: Map<string, ThreatAssessment> = new Map();
  private deploymentHistory: DeploymentRecommendation[] = [];

  // Initialize deployment zones based on mission parameters
  initializeDeploymentZones(
    missionType:
      | "airport"
      | "military-base"
      | "vip-protection"
      | "border-patrol",
    areaWidth: number,
    areaHeight: number,
  ): void {
    this.deploymentZones.clear();

    const zones = this.generateMissionZones(missionType, areaWidth, areaHeight);
    zones.forEach((zone) => {
      this.deploymentZones.set(zone.id, zone);
    });
  }

  // Generate mission-specific deployment zones
  private generateMissionZones(
    missionType: string,
    areaWidth: number,
    areaHeight: number,
  ): DeploymentZone[] {
    const zones: DeploymentZone[] = [];

    switch (missionType) {
      case "airport":
        zones.push(
          {
            id: "runway-approach",
            name: "Runway Approach",
            centerX: areaWidth * 0.5,
            centerY: areaHeight * 0.2,
            radius: 150,
            priority: "critical",
            threatLevel: 0.8,
            coverage: 0,
            assignedDrones: [],
            lastThreatDetected: 0,
            recommendedDroneTypes: ["interceptor", "surveillance"],
          },
          {
            id: "terminal-perimeter",
            name: "Terminal Perimeter",
            centerX: areaWidth * 0.5,
            centerY: areaHeight * 0.7,
            radius: 200,
            priority: "high",
            threatLevel: 0.6,
            coverage: 0,
            assignedDrones: [],
            lastThreatDetected: 0,
            recommendedDroneTypes: ["jammer", "shield", "surveillance"],
          },
        );
        break;

      case "military-base":
        zones.push(
          {
            id: "command-center",
            name: "Command Center",
            centerX: areaWidth * 0.5,
            centerY: areaHeight * 0.5,
            radius: 100,
            priority: "critical",
            threatLevel: 0.9,
            coverage: 0,
            assignedDrones: [],
            lastThreatDetected: 0,
            recommendedDroneTypes: ["shield", "swarm-coordinator"],
          },
          {
            id: "perimeter-north",
            name: "Northern Perimeter",
            centerX: areaWidth * 0.5,
            centerY: areaHeight * 0.1,
            radius: 180,
            priority: "high",
            threatLevel: 0.7,
            coverage: 0,
            assignedDrones: [],
            lastThreatDetected: 0,
            recommendedDroneTypes: ["interceptor", "jammer"],
          },
          {
            id: "perimeter-south",
            name: "Southern Perimeter",
            centerX: areaWidth * 0.5,
            centerY: areaHeight * 0.9,
            radius: 180,
            priority: "high",
            threatLevel: 0.7,
            coverage: 0,
            assignedDrones: [],
            lastThreatDetected: 0,
            recommendedDroneTypes: ["interceptor", "jammer"],
          },
        );
        break;

      case "vip-protection":
        zones.push(
          {
            id: "vip-zone",
            name: "VIP Protection Zone",
            centerX: areaWidth * 0.5,
            centerY: areaHeight * 0.5,
            radius: 80,
            priority: "critical",
            threatLevel: 0.8,
            coverage: 0,
            assignedDrones: [],
            lastThreatDetected: 0,
            recommendedDroneTypes: ["shield", "interceptor"],
          },
          {
            id: "approach-vectors",
            name: "Approach Vectors",
            centerX: areaWidth * 0.5,
            centerY: areaHeight * 0.3,
            radius: 250,
            priority: "high",
            threatLevel: 0.6,
            coverage: 0,
            assignedDrones: [],
            lastThreatDetected: 0,
            recommendedDroneTypes: ["surveillance", "jammer"],
          },
        );
        break;

      case "border-patrol":
        zones.push({
          id: "border-line",
          name: "Border Line",
          centerX: areaWidth * 0.5,
          centerY: areaHeight * 0.1,
          radius: 300,
          priority: "high",
          threatLevel: 0.5,
          coverage: 0,
          assignedDrones: [],
          lastThreatDetected: 0,
          recommendedDroneTypes: ["surveillance", "interceptor"],
        });
        break;
    }

    return zones;
  }

  // Assess incoming threats and generate deployment recommendations
  assessThreatsAndRecommendDeployment(
    threats: Array<{
      id: string;
      type: ThreatType;
      x: number;
      y: number;
      velocity?: { x: number; y: number };
    }>,
    availableDrones: Array<{
      id: string;
      type: DroneType;
      x: number;
      y: number;
      energy: number;
    }>,
  ): DeploymentRecommendation[] {
    const recommendations: DeploymentRecommendation[] = [];

    // Update threat assessments
    threats.forEach((threat) => {
      const assessment = this.assessThreat(threat);
      this.threatAssessments.set(threat.id, assessment);

      // Update affected zones
      this.updateZoneThreatLevels(threat);
    });

    // Generate deployment recommendations for each zone
    this.deploymentZones.forEach((zone) => {
      const zoneRecommendations = this.generateZoneRecommendations(
        zone,
        availableDrones,
      );
      recommendations.push(...zoneRecommendations);
    });

    // Sort by priority and effectiveness
    recommendations.sort((a, b) => {
      const priorityWeight = { critical: 4, high: 3, medium: 2, low: 1 };
      const zoneA = this.deploymentZones.get(a.zoneId);
      const zoneB = this.deploymentZones.get(b.zoneId);

      const priorityA = zoneA ? priorityWeight[zoneA.priority] : 0;
      const priorityB = zoneB ? priorityWeight[zoneB.priority] : 0;

      if (priorityA !== priorityB) return priorityB - priorityA;
      return b.estimatedEffectiveness - a.estimatedEffectiveness;
    });

    return recommendations;
  }

  // Assess individual threat
  private assessThreat(threat: {
    id: string;
    type: ThreatType;
    x: number;
    y: number;
    velocity?: { x: number; y: number };
  }): ThreatAssessment {
    const velocity = threat.velocity || { x: 0, y: 0 };
    const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
    const heading = Math.atan2(velocity.y, velocity.x) * (180 / Math.PI);

    // Calculate threat level based on type and speed
    const threatLevel = this.calculateThreatLevel(threat.type, speed);
    const priority = this.calculateThreatPriority(threatLevel, speed);
    const responseType = this.determineResponseType(threat.type, threatLevel);

    return {
      id: threat.id,
      type: threat.type,
      position: { x: threat.x, y: threat.y },
      velocity,
      heading,
      estimatedArrivalTime: this.calculateArrivalTime(
        threat.x,
        threat.y,
        speed,
      ),
      threatLevel,
      priority,
      recommendedResponse: responseType,
    };
  }

  // Calculate threat level based on type and speed
  private calculateThreatLevel(type: ThreatType, speed: number): number {
    const baseThreatLevels = {
      drone: 0.6,
      swarm: 0.7,
      stealth: 0.8,
      kamikaze: 0.9,
      decoy: 0.3,
      shielded: 0.7,
    };

    const baseLevel = baseThreatLevels[type] || 0.5;
    const speedFactor = Math.min(speed / 100, 1); // Normalize speed

    return Math.min(baseLevel + speedFactor * 0.3, 1);
  }

  // Calculate threat priority
  private calculateThreatPriority(
    threatLevel: number,
    speed: number,
  ): "critical" | "high" | "medium" | "low" {
    const combinedScore = threatLevel + speed / 200;

    if (combinedScore >= 1.2) return "critical";
    if (combinedScore >= 0.9) return "high";
    if (combinedScore >= 0.6) return "medium";
    return "low";
  }

  // Determine response type based on threat
  private determineResponseType(
    type: ThreatType,
    threatLevel: number,
  ): ResponseType {
    if (type === "swarm") return "multi-target";
    if (type === "stealth") return "surveil";
    if (type === "shielded") return "jam";
    if (type === "kamikaze") return "intercept";
    if (type === "decoy") return "evade";
    return threatLevel > 0.7 ? "intercept" : "surveil";
  }

  // Calculate estimated arrival time
  private calculateArrivalTime(x: number, y: number, speed: number): number {
    // Assume threats are heading toward center of protected area
    const centerDistance = Math.sqrt(x * x + y * y);
    return speed > 0 ? centerDistance / speed : Infinity;
  }

  // Update zone threat levels based on detected threats
  private updateZoneThreatLevels(threat: {
    id: string;
    type: ThreatType;
    x: number;
    y: number;
  }): void {
    this.deploymentZones.forEach((zone) => {
      const distance = Math.sqrt(
        (threat.x - zone.centerX) ** 2 + (threat.y - zone.centerY) ** 2,
      );

      // If threat is within zone radius, update threat level
      if (distance <= zone.radius) {
        const threatLevel = this.calculateThreatLevel(threat.type, 0);
        zone.threatLevel = Math.max(zone.threatLevel, threatLevel);
        zone.lastThreatDetected = Date.now();
      }
    });
  }

  // Generate deployment recommendations for a specific zone
  private generateZoneRecommendations(
    zone: DeploymentZone,
    availableDrones: Array<{
      id: string;
      type: DroneType;
      x: number;
      y: number;
      energy: number;
    }>,
  ): DeploymentRecommendation[] {
    const recommendations: DeploymentRecommendation[] = [];

    // Skip if zone is already well covered
    if (zone.coverage > 0.8) return recommendations;

    // Find optimal drone types for this zone
    const optimalDroneTypes = this.selectOptimalDroneTypes(zone);

    optimalDroneTypes.forEach((droneType) => {
      const availableDrone = availableDrones.find(
        (d) => d.type === droneType && d.energy > 50,
      );

      if (availableDrone) {
        const position = this.calculateOptimalPosition(zone, droneType);
        const effectiveness = this.calculateDeploymentEffectiveness(
          zone,
          droneType,
          position,
        );

        recommendations.push({
          zoneId: zone.id,
          droneType,
          position,
          priority: this.calculateDeploymentPriority(zone, effectiveness),
          reasoning: this.generateDeploymentReasoning(zone, droneType),
          estimatedEffectiveness: effectiveness,
        });
      }
    });

    return recommendations;
  }

  // Select optimal drone types for zone
  private selectOptimalDroneTypes(zone: DeploymentZone): DroneType[] {
    // Base selection on zone priority and threat level
    const droneTypes: DroneType[] = [];

    if (zone.priority === "critical") {
      droneTypes.push("shield", "swarm-coordinator");
    }

    if (zone.threatLevel > 0.7) {
      droneTypes.push("interceptor", "jammer");
    } else {
      droneTypes.push("surveillance");
    }

    return droneTypes;
  }

  // Calculate optimal deployment position within zone
  private calculateOptimalPosition(
    zone: DeploymentZone,
    droneType: DroneType,
  ): { x: number; y: number } {
    // For now, deploy at zone center with slight offset based on drone type
    const offsets = {
      interceptor: { x: 0, y: -20 },
      jammer: { x: 20, y: 0 },
      surveillance: { x: -20, y: 20 },
      shield: { x: 0, y: 0 },
      "swarm-coordinator": { x: 0, y: -10 },
    };

    const offset = offsets[droneType] || { x: 0, y: 0 };

    return {
      x: zone.centerX + offset.x,
      y: zone.centerY + offset.y,
    };
  }

  // Calculate deployment effectiveness
  private calculateDeploymentEffectiveness(
    zone: DeploymentZone,
    droneType: DroneType,
    _position: { x: number; y: number },
  ): number {
    const baseEffectiveness = {
      interceptor: 0.8,
      jammer: 0.7,
      surveillance: 0.6,
      shield: 0.9,
      "swarm-coordinator": 0.8,
    };

    const base = baseEffectiveness[droneType] || 0.5;
    const zoneBonus = zone.priority === "critical" ? 0.1 : 0;
    const coverageBonus = (1 - zone.coverage) * 0.2;

    return Math.min(base + zoneBonus + coverageBonus, 1);
  }

  // Calculate deployment priority
  private calculateDeploymentPriority(
    zone: DeploymentZone,
    effectiveness: number,
  ): number {
    const priorityWeights = { critical: 4, high: 3, medium: 2, low: 1 };
    return priorityWeights[zone.priority] * effectiveness;
  }

  // Generate deployment reasoning
  private generateDeploymentReasoning(
    zone: DeploymentZone,
    droneType: DroneType,
  ): string {
    const reasoning = [];

    if (zone.priority === "critical") {
      reasoning.push("Critical zone protection required");
    }

    if (zone.threatLevel > 0.7) {
      reasoning.push("High threat level detected");
    }

    if (zone.coverage < 0.5) {
      reasoning.push("Zone coverage insufficient");
    }

    reasoning.push(`Deploy ${droneType} for optimal defense`);

    return reasoning.join("; ");
  }

  // Get current deployment zones
  getDeploymentZones(): DeploymentZone[] {
    return Array.from(this.deploymentZones.values());
  }

  // Get threat assessments
  getThreatAssessments(): ThreatAssessment[] {
    return Array.from(this.threatAssessments.values());
  }

  // Get deployment history
  getDeploymentHistory(): DeploymentRecommendation[] {
    return this.deploymentHistory;
  }

  // Record deployment action
  recordDeployment(
    recommendation: DeploymentRecommendation,
    success: boolean,
  ): void {
    this.deploymentHistory.push({
      ...recommendation,
      // Add timestamp and success status
      reasoning: `${recommendation.reasoning} [${success ? "SUCCESS" : "FAILED"}]`,
    });

    // Update zone coverage if successful
    if (success) {
      const zone = this.deploymentZones.get(recommendation.zoneId);
      if (zone) {
        zone.coverage = Math.min(zone.coverage + 0.2, 1);
        zone.assignedDrones.push(recommendation.droneType);
      }
    }
  }
}
