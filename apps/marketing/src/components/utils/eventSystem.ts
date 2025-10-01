// Event System - Protocol-Based Communication Patterns
// This system will be ported to Rust in the main application

export interface Event {
  id: string;
  type: string;
  timestamp: number;
  source: string;
  target?: string;
  data: any;
  priority: number;
}

export interface EventHandler {
  id: string;
  type: string;
  handler: (event: Event) => void;
  priority: number;
  once?: boolean;
}

export interface EventFilter {
  types?: string[];
  sources?: string[];
  targets?: string[];
  priority?: { min: number; max: number };
  custom?: (event: Event) => boolean;
}

// Core Event System
export class EventSystem {
  private handlers: Map<string, EventHandler[]> = new Map();
  private eventQueue: Event[] = [];
  private eventHistory: Event[] = [];
  private maxHistorySize: number = 1000;
  private nextEventId = 0;

  // Subscribe to events
  subscribe(
    eventType: string,
    handler: (event: Event) => void,
    options?: {
      priority?: number;
      once?: boolean;
      id?: string;
    },
  ): string {
    const handlerId = options?.id || `handler-${this.nextEventId++}`;
    const eventHandler: EventHandler = {
      id: handlerId,
      type: eventType,
      handler,
      priority: options?.priority || 0,
      once: options?.once || false,
    };

    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }

    const handlers = this.handlers.get(eventType)!;
    handlers.push(eventHandler);

    // Sort by priority (higher priority first)
    handlers.sort((a, b) => b.priority - a.priority);

    return handlerId;
  }

  // Unsubscribe from events
  unsubscribe(eventType: string, handlerId: string): boolean {
    const handlers = this.handlers.get(eventType);
    if (!handlers) return false;

    const index = handlers.findIndex((h) => h.id === handlerId);
    if (index === -1) return false;

    handlers.splice(index, 1);
    return true;
  }

  // Emit event
  emit(event: Omit<Event, "id" | "timestamp">): void {
    const fullEvent: Event = {
      ...event,
      id: `event-${this.nextEventId++}`,
      timestamp: Date.now(),
    };

    this.eventQueue.push(fullEvent);
  }

  // Process event queue
  processEvents(): void {
    while (this.eventQueue.length > 0) {
      const event = this.eventQueue.shift()!;
      this.processEvent(event);
      this.addToHistory(event);
    }
  }

  // Process individual event
  private processEvent(event: Event): void {
    const handlers = this.handlers.get(event.type) || [];
    const handlersToRemove: string[] = [];

    for (const handler of handlers) {
      try {
        handler.handler(event);

        if (handler.once) {
          handlersToRemove.push(handler.id);
        }
      } catch (error) {
        console.error(`Error in event handler ${handler.id}:`, error);
      }
    }

    // Remove one-time handlers
    handlersToRemove.forEach((id) => {
      const index = handlers.findIndex((h) => h.id === id);
      if (index !== -1) {
        handlers.splice(index, 1);
      }
    });
  }

  // Add event to history
  private addToHistory(event: Event): void {
    this.eventHistory.push(event);

    // Maintain history size limit
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.shift();
    }
  }

  // Get events matching filter
  getEvents(filter?: EventFilter): Event[] {
    if (!filter) return [...this.eventHistory];

    return this.eventHistory.filter((event) => {
      if (filter.types && !filter.types.includes(event.type)) return false;
      if (filter.sources && !filter.sources.includes(event.source))
        return false;
      if (
        filter.targets &&
        event.target &&
        !filter.targets.includes(event.target)
      )
        return false;
      if (
        filter.priority &&
        (event.priority < filter.priority.min ||
          event.priority > filter.priority.max)
      )
        return false;
      if (filter.custom && !filter.custom(event)) return false;

      return true;
    });
  }

  // Get event history
  getHistory(): Event[] {
    return [...this.eventHistory];
  }

  // Clear event history
  clearHistory(): void {
    this.eventHistory = [];
  }

  // Get queue size
  getQueueSize(): number {
    return this.eventQueue.length;
  }

  // Set max history size
  setMaxHistorySize(size: number): void {
    this.maxHistorySize = size;

    // Trim history if necessary
    if (this.eventHistory.length > size) {
      this.eventHistory = this.eventHistory.slice(-size);
    }
  }
}

// Game-Specific Event Types
export interface GameEventTypes {
  // Threat Events
  "threat:spawned": {
    threatId: string;
    threatType: string;
    position: { x: number; y: number };
  };
  "threat:neutralized": {
    threatId: string;
    score: number;
    position: { x: number; y: number };
  };
  "threat:damaged": { threatId: string; damage: number; health: number };
  "threat:behavior-changed": {
    threatId: string;
    oldBehavior: string;
    newBehavior: string;
  };

  // Drone Events
  "drone:deployed": {
    droneId: string;
    droneType: string;
    position: { x: number; y: number };
  };
  "drone:returned": { droneId: string; energy: number; health: number };
  "drone:mission-completed": {
    droneId: string;
    mission: string;
    success: boolean;
  };
  "drone:damaged": { droneId: string; damage: number; health: number };

  // Weapon Events
  "weapon:fired": {
    weaponId: string;
    weaponType: string;
    targetId?: string;
    position: { x: number; y: number };
  };
  "weapon:reloaded": { weaponId: string; ammo: number; maxAmmo: number };
  "weapon:overheated": { weaponId: string; energy: number };

  // System Events
  "game:started": { level: number; missionType: string };
  "game:paused": { reason: string };
  "game:resumed": {};
  "game:level-completed": { level: number; score: number; time: number };
  "game:game-over": { finalScore: number; reason: string };

  // Resource Events
  "resource:energy-changed": {
    oldValue: number;
    newValue: number;
    delta: number;
  };
  "resource:ammunition-changed": {
    oldValue: number;
    newValue: number;
    delta: number;
  };
  "resource:critical": { resourceType: string; value: number };

  // Formation Events
  "formation:created": {
    formationId: string;
    formationType: string;
    droneIds: string[];
  };
  "formation:modified": { formationId: string; changes: Record<string, any> };
  "formation:disbanded": { formationId: string; reason: string };

  // Deployment Events
  "deployment:zone-updated": {
    zoneId: string;
    threatLevel: number;
    coverage: number;
  };
  "deployment:recommendation": {
    zoneId: string;
    droneType: string;
    priority: number;
  };
  "deployment:executed": { zoneId: string; droneId: string; success: boolean };

  // Protocol Events
  "protocol:triggered": { protocolId: string; reason: string };
  "protocol:executed": {
    protocolId: string;
    success: boolean;
    actions: string[];
  };
  "protocol:failed": { protocolId: string; error: string };
}

// Event Factory Functions
export class GameEventFactory {
  private eventSystem: EventSystem;

  constructor(eventSystem: EventSystem) {
    this.eventSystem = eventSystem;
  }

  // Threat Events
  emitThreatSpawned(
    threatId: string,
    threatType: string,
    position: { x: number; y: number },
  ): void {
    this.eventSystem.emit({
      type: "threat:spawned",
      source: "threat-system",
      data: { threatId, threatType, position },
      priority: 3,
    });
  }

  emitThreatNeutralized(
    threatId: string,
    score: number,
    position: { x: number; y: number },
  ): void {
    this.eventSystem.emit({
      type: "threat:neutralized",
      source: "weapon-system",
      data: { threatId, score, position },
      priority: 5,
    });
  }

  emitThreatDamaged(threatId: string, damage: number, health: number): void {
    this.eventSystem.emit({
      type: "threat:damaged",
      source: "weapon-system",
      data: { threatId, damage, health },
      priority: 4,
    });
  }

  emitThreatBehaviorChanged(
    threatId: string,
    oldBehavior: string,
    newBehavior: string,
  ): void {
    this.eventSystem.emit({
      type: "threat:behavior-changed",
      source: "ai-system",
      data: { threatId, oldBehavior, newBehavior },
      priority: 2,
    });
  }

  // Drone Events
  emitDroneDeployed(
    droneId: string,
    droneType: string,
    position: { x: number; y: number },
  ): void {
    this.eventSystem.emit({
      type: "drone:deployed",
      source: "deployment-system",
      data: { droneId, droneType, position },
      priority: 4,
    });
  }

  emitDroneReturned(droneId: string, energy: number, health: number): void {
    this.eventSystem.emit({
      type: "drone:returned",
      source: "drone-system",
      data: { droneId, energy, health },
      priority: 3,
    });
  }

  emitDroneMissionCompleted(
    droneId: string,
    mission: string,
    success: boolean,
  ): void {
    this.eventSystem.emit({
      type: "drone:mission-completed",
      source: "drone-system",
      data: { droneId, mission, success },
      priority: 4,
    });
  }

  // Weapon Events
  emitWeaponFired(
    weaponId: string,
    weaponType: string,
    targetId: string | undefined,
    position: { x: number; y: number },
  ): void {
    this.eventSystem.emit({
      type: "weapon:fired",
      source: "weapon-system",
      target: targetId,
      data: { weaponId, weaponType, targetId, position },
      priority: 5,
    });
  }

  emitWeaponReloaded(weaponId: string, ammo: number, maxAmmo: number): void {
    this.eventSystem.emit({
      type: "weapon:reloaded",
      source: "weapon-system",
      data: { weaponId, ammo, maxAmmo },
      priority: 2,
    });
  }

  emitWeaponOverheated(weaponId: string, energy: number): void {
    this.eventSystem.emit({
      type: "weapon:overheated",
      source: "weapon-system",
      data: { weaponId, energy },
      priority: 3,
    });
  }

  // System Events
  emitGameStarted(level: number, missionType: string): void {
    this.eventSystem.emit({
      type: "game:started",
      source: "game-engine",
      data: { level, missionType },
      priority: 1,
    });
  }

  emitGamePaused(reason: string): void {
    this.eventSystem.emit({
      type: "game:paused",
      source: "game-engine",
      data: { reason },
      priority: 1,
    });
  }

  emitGameResumed(): void {
    this.eventSystem.emit({
      type: "game:resumed",
      source: "game-engine",
      data: {},
      priority: 1,
    });
  }

  emitGameLevelCompleted(level: number, score: number, time: number): void {
    this.eventSystem.emit({
      type: "game:level-completed",
      source: "game-engine",
      data: { level, score, time },
      priority: 2,
    });
  }

  emitGameOver(finalScore: number, reason: string): void {
    this.eventSystem.emit({
      type: "game:game-over",
      source: "game-engine",
      data: { finalScore, reason },
      priority: 1,
    });
  }

  // Resource Events
  emitResourceEnergyChanged(oldValue: number, newValue: number): void {
    this.eventSystem.emit({
      type: "resource:energy-changed",
      source: "resource-system",
      data: { oldValue, newValue, delta: newValue - oldValue },
      priority: 2,
    });
  }

  emitResourceAmmunitionChanged(oldValue: number, newValue: number): void {
    this.eventSystem.emit({
      type: "resource:ammunition-changed",
      source: "resource-system",
      data: { oldValue, newValue, delta: newValue - oldValue },
      priority: 2,
    });
  }

  emitResourceCritical(resourceType: string, value: number): void {
    this.eventSystem.emit({
      type: "resource:critical",
      source: "resource-system",
      data: { resourceType, value },
      priority: 5,
    });
  }

  // Formation Events
  emitFormationCreated(
    formationId: string,
    formationType: string,
    droneIds: string[],
  ): void {
    this.eventSystem.emit({
      type: "formation:created",
      source: "formation-system",
      data: { formationId, formationType, droneIds },
      priority: 3,
    });
  }

  emitFormationModified(
    formationId: string,
    changes: Record<string, any>,
  ): void {
    this.eventSystem.emit({
      type: "formation:modified",
      source: "formation-system",
      data: { formationId, changes },
      priority: 2,
    });
  }

  emitFormationDisbanded(formationId: string, reason: string): void {
    this.eventSystem.emit({
      type: "formation:disbanded",
      source: "formation-system",
      data: { formationId, reason },
      priority: 3,
    });
  }

  // Deployment Events
  emitDeploymentZoneUpdated(
    zoneId: string,
    threatLevel: number,
    coverage: number,
  ): void {
    this.eventSystem.emit({
      type: "deployment:zone-updated",
      source: "deployment-system",
      data: { zoneId, threatLevel, coverage },
      priority: 2,
    });
  }

  emitDeploymentRecommendation(
    zoneId: string,
    droneType: string,
    priority: number,
  ): void {
    this.eventSystem.emit({
      type: "deployment:recommendation",
      source: "deployment-system",
      data: { zoneId, droneType, priority },
      priority: 3,
    });
  }

  emitDeploymentExecuted(
    zoneId: string,
    droneId: string,
    success: boolean,
  ): void {
    this.eventSystem.emit({
      type: "deployment:executed",
      source: "deployment-system",
      data: { zoneId, droneId, success },
      priority: 4,
    });
  }

  // Protocol Events
  emitProtocolTriggered(protocolId: string, reason: string): void {
    this.eventSystem.emit({
      type: "protocol:triggered",
      source: "protocol-system",
      data: { protocolId, reason },
      priority: 4,
    });
  }

  emitProtocolExecuted(
    protocolId: string,
    success: boolean,
    actions: string[],
  ): void {
    this.eventSystem.emit({
      type: "protocol:executed",
      source: "protocol-system",
      data: { protocolId, success, actions },
      priority: 3,
    });
  }

  emitProtocolFailed(protocolId: string, error: string): void {
    this.eventSystem.emit({
      type: "protocol:failed",
      source: "protocol-system",
      data: { protocolId, error },
      priority: 5,
    });
  }
}

// Event System Factory
export const createGameEventSystem = (): {
  eventSystem: EventSystem;
  eventFactory: GameEventFactory;
} => {
  const eventSystem = new EventSystem();
  const eventFactory = new GameEventFactory(eventSystem);

  return {
    eventSystem,
    eventFactory,
  };
};
