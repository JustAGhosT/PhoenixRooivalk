/**
 * Wave Manager for Gradual Drone Spawning and Level Progression
 * Provides configurable spawn patterns and progressive difficulty
 */

export interface WaveConfig {
  waveNumber: number;
  totalThreats: number;
  spawnInterval: number; // ms between spawns
  threatTypes: Array<{
    type: string;
    count: number;
    delay?: number; // ms delay before spawning this type
  }>;
  difficulty: number; // 1-10 scale
  environment: {
    weather?: "clear" | "rain" | "fog" | "night";
    terrain?: "airport" | "military-base" | "vip-protection" | "border-patrol";
  };
}

export interface SpawnEvent {
  id: string;
  threatType: string;
  x: number;
  y: number;
  timestamp: number;
  delay: number;
}

export interface WaveProgress {
  currentWave: number;
  totalWaves: number;
  threatsSpawned: number;
  threatsRemaining: number;
  waveProgress: number; // 0-1
  timeToNextWave?: number;
}

export interface DifficultyScaling {
  speedMultiplier: number;
  healthMultiplier: number;
  damageMultiplier: number;
  spawnRateMultiplier: number;
  specialAbilityChance: number;
}

/**
 * Calculate difficulty scaling based on wave number
 */
export function calculateDifficultyScaling(
  waveNumber: number,
): DifficultyScaling {
  const baseWave = Math.max(1, waveNumber);
  const scalingFactor = 1 + (baseWave - 1) * 0.15; // 15% increase per wave

  return {
    speedMultiplier: Math.min(3, scalingFactor * 0.67), // Use scalingFactor with appropriate ratio
    healthMultiplier: Math.min(5, scalingFactor * 1.33), // Use scalingFactor with appropriate ratio
    damageMultiplier: Math.min(4, 1 + (baseWave - 1) * 0.15),
    spawnRateMultiplier: Math.min(2, 1 + (baseWave - 1) * 0.05),
    specialAbilityChance: Math.min(0.5, (baseWave - 1) * 0.03),
  };
}

/**
 * Generate wave configuration based on wave number and difficulty
 */
export function generateWaveConfig(
  waveNumber: number,
  baseDifficulty: number = 1,
  environment?: WaveConfig["environment"],
): WaveConfig {
  const difficulty = calculateDifficultyScaling(waveNumber);
  // Apply baseDifficulty multiplier to threat count and spawn rate
  const baseThreatCount = Math.min(
    20,
    Math.floor((3 + waveNumber * 2) * baseDifficulty),
  );

  // Determine threat types based on wave number
  const threatTypes: Array<{ type: string; count: number; delay?: number }> =
    [];

  if (waveNumber >= 1) {
    threatTypes.push({
      type: "drone",
      count: Math.floor(baseThreatCount * 0.6),
      delay: 0,
    });
  }

  if (waveNumber >= 3) {
    threatTypes.push({
      type: "swarm",
      count: Math.floor(baseThreatCount * 0.3),
      delay: 2000,
    });
  }

  if (waveNumber >= 5) {
    threatTypes.push({
      type: "stealth",
      count: Math.floor(baseThreatCount * 0.2),
      delay: 5000,
    });
  }

  if (waveNumber >= 7) {
    threatTypes.push({
      type: "kamikaze",
      count: Math.floor(baseThreatCount * 0.1),
      delay: 8000,
    });
  }

  if (waveNumber >= 10) {
    threatTypes.push({
      type: "boss",
      count: 1,
      delay: 10000,
    });
  }

  // Adjust spawn interval based on difficulty and baseDifficulty
  const baseInterval = Math.max(800, 1500 - waveNumber * 50);
  const spawnInterval = Math.floor(
    baseInterval / (difficulty.spawnRateMultiplier * baseDifficulty),
  );

  return {
    waveNumber,
    totalThreats: baseThreatCount,
    spawnInterval,
    threatTypes,
    difficulty: baseDifficulty,
    environment: environment || { weather: "clear", terrain: "airport" },
  };
}

/**
 * Main Wave Manager class
 */
export class WaveManager {
  private currentWave: number = 1;
  private maxWaves: number = 15;
  private isWaveActive: boolean = false;
  private waveStartTime: number = 0;
  private lastSpawnTime: number = 0;
  private spawnQueue: SpawnEvent[] = [];
  private threatsSpawned: number = 0;
  private threatsDefeated: number = 0;
  private currentWaveConfig: WaveConfig | null = null;
  private onSpawnThreat: (event: SpawnEvent) => void;
  private onWaveComplete: (waveNumber: number) => void;
  private onGameComplete: () => void;

  constructor(
    onSpawnThreat: (event: SpawnEvent) => void,
    onWaveComplete: (waveNumber: number) => void,
    onGameComplete: () => void = () => {},
  ) {
    this.onSpawnThreat = onSpawnThreat;
    this.onWaveComplete = onWaveComplete;
    this.onGameComplete = onGameComplete;
  }

  /**
   * Start the next wave
   */
  startWave(waveNumber?: number): void {
    if (waveNumber) {
      this.currentWave = waveNumber;
    }

    if (this.currentWave > this.maxWaves) {
      this.onGameComplete();
      return;
    }

    this.currentWaveConfig = generateWaveConfig(this.currentWave);
    this.isWaveActive = true;
    this.waveStartTime = Date.now();
    this.lastSpawnTime = 0;
    this.threatsSpawned = 0;
    this.threatsDefeated = 0;

    // Queue up spawn events
    this.queueSpawnEvents();
  }

  /**
   * Queue spawn events for the current wave
   */
  private queueSpawnEvents(): void {
    if (!this.currentWaveConfig) return;

    this.spawnQueue = [];
    let totalDelay = 0;
    let spawnIndex = this.threatsSpawned; // Monotonic counter for unique IDs

    for (const threatGroup of this.currentWaveConfig.threatTypes) {
      for (let i = 0; i < threatGroup.count; i++) {
        const spawnEvent: SpawnEvent = {
          id: `wave_${this.currentWave}_${spawnIndex}`,
          threatType: threatGroup.type,
          x: this.getRandomSpawnX(),
          y: this.getRandomSpawnY(),
          timestamp:
            Date.now() + totalDelay + i * this.currentWaveConfig.spawnInterval,
          delay: totalDelay + i * this.currentWaveConfig.spawnInterval,
        };

        this.spawnQueue.push(spawnEvent);
        spawnIndex++; // Increment for next unique ID
      }

      totalDelay += threatGroup.delay || 0;
    }

    // Update threatsSpawned to reflect the final spawnIndex
    this.threatsSpawned = spawnIndex;

    // Sort by timestamp
    this.spawnQueue.sort((a, b) => a.timestamp - b.timestamp);
  }

  /**
   * Update wave manager (call every frame)
   */
  update(): void {
    if (!this.isWaveActive || !this.currentWaveConfig) return;

    const now = Date.now();

    // Spawn threats that are ready
    while (this.spawnQueue.length > 0 && this.spawnQueue[0].timestamp <= now) {
      const event = this.spawnQueue.shift()!;
      this.onSpawnThreat(event);
      this.threatsSpawned++;
      this.lastSpawnTime = now;
    }

    // Check if wave is complete
    if (
      this.spawnQueue.length === 0 &&
      this.threatsDefeated >= this.threatsSpawned
    ) {
      this.completeWave();
    }
  }

  /**
   * Mark a threat as defeated
   */
  defeatThreat(): void {
    this.threatsDefeated++;
  }

  /**
   * Complete the current wave
   */
  private completeWave(): void {
    this.isWaveActive = false;
    this.onWaveComplete(this.currentWave);

    // Prepare for next wave after a delay
    setTimeout(() => {
      this.currentWave++;
      this.startWave();
    }, 5000); // 5 second break between waves
  }

  /**
   * Get random spawn position (outside radar area)
   */
  private getRandomSpawnX(): number {
    const radarRadius = 200;
    const margin = 50;
    const side = Math.random() < 0.5 ? -1 : 1;
    return side * (radarRadius + margin + Math.random() * 100);
  }

  /**
   * Get random spawn position (outside radar area)
   */
  private getRandomSpawnY(): number {
    const radarRadius = 200;
    const margin = 50;
    const side = Math.random() < 0.5 ? -1 : 1;
    return side * (radarRadius + margin + Math.random() * 100);
  }

  /**
   * Get current wave progress
   */
  getWaveProgress(): WaveProgress {
    const totalThreats = this.currentWaveConfig?.totalThreats || 0;
    const threatsRemaining = Math.max(0, totalThreats - this.threatsDefeated);
    const waveProgress =
      totalThreats > 0 ? this.threatsDefeated / totalThreats : 1;

    return {
      currentWave: this.currentWave,
      totalWaves: this.maxWaves,
      threatsSpawned: this.threatsSpawned,
      threatsRemaining,
      waveProgress,
      timeToNextWave: this.isWaveActive ? undefined : 5000,
    };
  }

  /**
   * Get current wave configuration
   */
  getCurrentWaveConfig(): WaveConfig | null {
    return this.currentWaveConfig;
  }

  /**
   * Check if wave is currently active
   */
  isWaveRunning(): boolean {
    return this.isWaveActive;
  }

  /**
   * Pause the current wave
   */
  pauseWave(): void {
    this.isWaveActive = false;
  }

  /**
   * Resume the current wave
   */
  resumeWave(): void {
    this.isWaveActive = true;
  }

  /**
   * Skip to next wave
   */
  skipWave(): void {
    if (this.isWaveActive) {
      this.isWaveActive = false;
      this.spawnQueue = [];
      this.completeWave();
    }
  }

  /**
   * Reset to wave 1
   */
  reset(): void {
    this.currentWave = 1;
    this.isWaveActive = false;
    this.spawnQueue = [];
    this.threatsSpawned = 0;
    this.threatsDefeated = 0;
    this.currentWaveConfig = null;
  }

  /**
   * Set maximum number of waves
   */
  setMaxWaves(maxWaves: number): void {
    this.maxWaves = maxWaves;
  }

  /**
   * Get predefined wave configurations for specific scenarios
   */
  static getScenarioWaves(
    scenario: "tutorial" | "easy" | "medium" | "hard" | "expert",
  ): WaveConfig[] {
    const scenarios = {
      tutorial: [
        generateWaveConfig(1, 1),
        generateWaveConfig(2, 1),
        generateWaveConfig(3, 1),
      ],
      easy: [
        generateWaveConfig(1, 2),
        generateWaveConfig(2, 2),
        generateWaveConfig(3, 2),
        generateWaveConfig(4, 2),
        generateWaveConfig(5, 2),
      ],
      medium: [
        generateWaveConfig(1, 4),
        generateWaveConfig(3, 4),
        generateWaveConfig(5, 4),
        generateWaveConfig(7, 4),
        generateWaveConfig(10, 4),
      ],
      hard: [
        generateWaveConfig(1, 6),
        generateWaveConfig(4, 6),
        generateWaveConfig(7, 6),
        generateWaveConfig(10, 6),
        generateWaveConfig(15, 6),
      ],
      expert: [
        generateWaveConfig(1, 8),
        generateWaveConfig(5, 8),
        generateWaveConfig(10, 8),
        generateWaveConfig(15, 8),
        generateWaveConfig(20, 8),
      ],
    };

    return scenarios[scenario] || scenarios.medium;
  }
}
