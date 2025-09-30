import React from "react";
import { ThreatSimulator } from "../ThreatSimulator";
import { Button } from "../ui/button";

export const HeroSection: React.FC = () => {
  return (
    <section
      className="flex items-center px-6 md:px-[5%] lg:px-8 py-16 relative min-h-screen bg-gradient-to-br from-gray-900 to-black"
      id="hero"
    >
      <div className="mx-auto max-w-[1400px] grid lg:grid-cols-2 gap-16 items-center">
        {/* Left: Clean messaging */}
        <div>
          <div className="mb-6">
            <span className="inline-block bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-[var(--dark)] px-4 py-2 rounded-full text-sm font-bold">
              In Development • Prototype Phase
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-br from-white to-[var(--primary)] animate-fadeInUp">
            Drone Defense That Works When Radios Don't
          </h1>
          <p className="mt-6 text-xl text-[var(--gray)] animate-fadeInUp [animation-delay:200ms]">
            Phoenix Rooivalk detects and stops hostile drones in 120-195ms even
            when all communications are jammed. Makes "soft-kill first"
            decisions at the edge without waiting for the cloud or command
            center.
          </p>
          <div className="mt-4 p-4 bg-gradient-to-r from-blue-900/20 to-slate-900/20 rounded-lg border border-blue-600/20">
            <p className="text-blue-400 font-semibold mb-2">
              Why This Matters:
            </p>
            <p className="text-sm text-gray-300">
              Traditional systems fail when enemies jam communications (3-10
              second response). Phoenix works 100% without network - 250x faster
              response when it counts most.
            </p>
          </div>
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
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl p-6 border border-blue-600/20 shadow-2xl shadow-blue-500/10">
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-blue-400 mb-2">
                Edge Autonomy Demo
              </h3>
              <p className="text-sm text-gray-400">
                No network needed - decisions in milliseconds
              </p>
            </div>
            <ThreatSimulator />
          </div>
        </div>
      </div>
    </section>
  );
};
