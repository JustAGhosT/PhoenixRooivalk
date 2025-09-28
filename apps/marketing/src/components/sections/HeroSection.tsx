import React from "react";
import { ThreatSimulator } from "../ThreatSimulator";
import { Button } from '../ui/button';

export const HeroSection: React.FC = () => {
  return (
    <section
      className="flex items-center px-6 md:px-[5%] lg:px-8 py-16 relative"
      id="hero"
    >
      <div className="mx-auto max-w-[1400px] grid md:grid-cols-2 gap-16 items-center">
        <div>
          <div className="mb-4">
            <span className="inline-block bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-[var(--dark)] px-3 py-1 rounded-full text-sm font-bold">
              AI + Blockchain Revolution
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-br from-white to-[var(--primary)] animate-fadeInUp">
            Revolutionary AI + Blockchain Defense
          </h1>
          <div className="mt-2 text-xl text-[var(--secondary)] font-bold animate-fadeInUp [animation-delay:100ms]">
            Phoenix Rooivalk Counter-UAS Defense System
          </div>
          <p className="mt-4 text-lg text-[var(--gray)] animate-fadeInUp [animation-delay:200ms]">
            The world's first AI-blockchain counter-drone system. 99.7% AI
            accuracy with 99.3% data integrity protection. Federated learning,
            explainable AI, and autonomous swarm coordination. Ready now, 18
            months ahead of the 2027 deadline.
          </p>
          <div className="mt-8 space-y-4 animate-fadeInUp [animation-delay:400ms]">
            <div className="flex items-center gap-4 text-sm">
              <span className="text-[var(--primary)]">✓</span>
              <span>
                99.7% AI accuracy eliminates false positives (no more "puddles
                mistaken for tanks")
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-[var(--primary)]">✓</span>
              <span>
                99.3% data integrity with blockchain-verified audit trails
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-[var(--primary)]">✓</span>
              <span>
                Federated learning with blockchain consensus for distributed AI
                training
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-[var(--primary)]">✓</span>
              <span>
                Autonomous swarm coordination with explainable AI and blockchain
                security
              </span>
            </div>
          </div>
          <div className="mt-8 flex gap-4 animate-fadeInUp [animation-delay:600ms]">
            <Button href="#contact" size="lg">
              Schedule Technical Demo
            </Button>
            <Button href="/financial" variant="outline" size="lg">
              View Projections
            </Button>
          </div>
        </div>
        <div className="relative animate-float">
          <ThreatSimulator />
        </div>
      </div>
    </section>
  );
};
