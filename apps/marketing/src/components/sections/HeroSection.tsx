import React from 'react';
import Link from 'next/link';
import { Button } from '../ui/Button';
import { ThreatSimulator } from '../ThreatSimulator';

export const HeroSection: React.FC = () => {
  return (
    <section className="min-h-[90vh] flex items-center px-[5%] py-12 relative" id="hero">
      <div className="mx-auto max-w-[1400px] grid md:grid-cols-2 gap-16 items-center">
        <div>
          <div className="mb-4">
            <span className="inline-block bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-[var(--dark)] px-3 py-1 rounded-full text-sm font-bold">
              Real-Time Defense on Solana
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-br from-white to-[var(--primary)] animate-fadeInUp">
            Ready for 2027 Autonomous Warfare
          </h1>
          <div className="mt-2 text-xl text-[var(--secondary)] font-bold animate-fadeInUp [animation-delay:100ms]">
            Phoenix Rooivalk Counter-UAS Defense System
          </div>
          <p className="mt-4 text-lg text-[var(--gray)] animate-fadeInUp [animation-delay:200ms]">
            While others race to build offensive swarms, we've solved the defensive challenge. Multi-sensor fusion eliminates false positives. Blockchain coordination defeats EW attacks. Ready now, not in 18 months.
          </p>
          <div className="mt-8 space-y-4 animate-fadeInUp [animation-delay:400ms]">
            <div className="flex items-center gap-4 text-sm">
              <span className="text-[var(--primary)]">✓</span>
              <span>Eliminates false positives (no more "puddles mistaken for tanks")</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-[var(--primary)]">✓</span>
              <span>EW-resistant blockchain coordination defeats jamming attacks</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-[var(--primary)]">✓</span>
              <span>Multi-spectrum countermeasures: Kinetic, EW, Directed Energy</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-[var(--primary)]">✓</span>
              <span>Swarm-ready architecture scales to coordinate hundreds of units</span>
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
