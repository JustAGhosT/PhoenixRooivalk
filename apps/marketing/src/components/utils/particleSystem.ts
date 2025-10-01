// Particle System for Visual Effects
export interface Particle {
  id: string;
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

export interface ParticleEffect {
  id: string;
  x: number;
  y: number;
  particles: Particle[];
  active: boolean;
  type: 'explosion' | 'trail' | 'sparkle';
}

export class ParticleSystem {
  private particles: Particle[] = [];
  private effects: ParticleEffect[] = [];
  private nextId = 0;

  createExplosion(x: number, y: number, intensity: number = 1): ParticleEffect {
    const particleCount = Math.floor(15 * intensity);
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5;
      const speed = 2 + Math.random() * 4;
      
      particles.push({
        id: `particle-${this.nextId++}`,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        maxLife: 1.0,
        size: 2 + Math.random() * 4,
        color: this.getExplosionColor(),
        opacity: 1.0,
      });
    }

    const effect: ParticleEffect = {
      id: `effect-${this.nextId++}`,
      x,
      y,
      particles,
      active: true,
      type: 'explosion',
    };

    this.effects.push(effect);
    return effect;
  }

  createTrail(startX: number, startY: number, endX: number, endY: number): ParticleEffect {
    const particles: Particle[] = [];
    const distance = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
    const particleCount = Math.floor(distance / 10);

    for (let i = 0; i < particleCount; i++) {
      const t = i / particleCount;
      const x = startX + (endX - startX) * t;
      const y = startY + (endY - startY) * t;

      particles.push({
        id: `particle-${this.nextId++}`,
        x,
        y,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        life: 1.0,
        maxLife: 2.0,
        size: 1 + Math.random() * 2,
        color: '#f97316',
        opacity: 1.0,
      });
    }

    const effect: ParticleEffect = {
      id: `effect-${this.nextId++}`,
      x: startX,
      y: startY,
      particles,
      active: true,
      type: 'trail',
    };

    this.effects.push(effect);
    return effect;
  }

  update(deltaTime: number): void {
    // Update all effects
    this.effects.forEach((effect) => {
      effect.particles.forEach((particle) => {
        particle.x += particle.vx * deltaTime * 60;
        particle.y += particle.vy * deltaTime * 60;
        particle.life -= deltaTime;
        particle.opacity = particle.life / particle.maxLife;
        particle.vx *= 0.98; // Friction
        particle.vy *= 0.98;
      });

      // Remove dead particles
      effect.particles = effect.particles.filter(p => p.life > 0);
      
      // Remove effects with no particles
      if (effect.particles.length === 0) {
        effect.active = false;
      }
    });

    // Remove inactive effects
    this.effects = this.effects.filter(effect => effect.active);
  }

  getActiveEffects(): ParticleEffect[] {
    return this.effects.filter(effect => effect.active);
  }

  clear(): void {
    this.effects = [];
    this.particles = [];
  }

  private getExplosionColor(): string {
    const colors = ['#ef4444', '#f97316', '#eab308', '#84cc16'];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}
