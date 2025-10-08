"use client";
import * as React from "react";
import { useEffect, useRef } from "react";
import { ParticleSystem } from "./utils/particleSystem";

interface ParticleRendererProps {
  particleSystem: ParticleSystem;
  width: number;
  height: number;
}

export const ParticleRenderer: React.FC<ParticleRendererProps> = ({
  particleSystem,
  width,
  height,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Render all active effects
      const activeEffects = particleSystem.getActiveEffects();

      activeEffects.forEach((effect) => {
        effect.particles.forEach((particle) => {
          ctx.save();
          ctx.globalAlpha = particle.opacity;
          ctx.fillStyle = particle.color;
          ctx.shadowBlur = 10;
          ctx.shadowColor = particle.color;

          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });
      });

      animationFrameRef.current = requestAnimationFrame(render);
    };

    // Start animation loop
    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [particleSystem, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 10 }}
    />
  );
};
