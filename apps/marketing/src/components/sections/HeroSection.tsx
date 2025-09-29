import React from "react";
import { ThreatSimulator } from "../ThreatSimulator";
import { Button } from '../ui/button';

export const HeroSection: React.FC = () => {
  return (
    <section className="flex items-center px-6 md:px-[5%] lg:px-8 py-16 relative min-h-screen bg-gradient-to-br from-gray-900 to-black" id="hero">
      <div className="mx-auto max-w-[1400px] grid lg:grid-cols-2 gap-16 items-center">
        {/* Left: Clean messaging */}
        <div>
          <div className="mb-6">
            <span className="inline-block bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-[var(--dark)] px-4 py-2 rounded-full text-sm font-bold">
              In Development • Prototype Phase
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-br from-white to-[var(--primary)] animate-fadeInUp">
            Level-0 Autonomous Counter-Drone Architecture
          </h1>
          <p className="mt-6 text-xl text-[var(--gray)] animate-fadeInUp [animation-delay:200ms]">
            <2ms response time vs 2-5 seconds for competitors. Defeats RF-silent drones others cannot detect. 
            Operates in completely denied electromagnetic environments.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 animate-fadeInUp [animation-delay:400ms]">
            <Button href="#contact" size="lg">
              Request Capability Demonstration
            </Button>
            <Button href="/interactive-demo" variant="outline" size="lg">
              View Technical Demo
            </Button>
          </div>
        </div>

        {/* Right: ThreatSimulator as candy bait */}
        <div className="relative animate-float">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-green-500/30 shadow-2xl">
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-green-400 mb-2">Live Defense System</h3>
              <p className="text-sm text-gray-400">Click threats to neutralize them</p>
            </div>
            <ThreatSimulator />
          </div>
        </div>
      </div>
    </section>
  );
};
