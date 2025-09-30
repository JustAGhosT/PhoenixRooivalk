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
        {/* Left: Enhanced messaging with credibility */}
        <div>
          {/* Development status indicators */}
          <div className="mb-6 flex flex-wrap gap-3">
            <span className="inline-block bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))] text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg shadow-[rgba(var(--primary),0.3)]">
              Concept Phase • Seeking Funding
            </span>
            <span className="inline-block bg-[rgba(var(--status-warning),0.2)] text-[rgb(var(--status-warning))] px-4 py-2 rounded-full text-sm font-semibold border border-[rgba(var(--status-warning),0.3)]">
              SBIR Application Planned
            </span>
          </div>

          {/* Vision-focused headline */}
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-br from-white to-[rgb(var(--primary))] animate-fadeInUp">
            Autonomous Counter-Drone Defense
            <span className="block text-2xl md:text-4xl mt-2 text-[rgb(var(--accent))]">
              Target: 120ms Response Time
            </span>
          </h1>
          <p className="mt-6 text-xl text-[rgb(var(--gray))] animate-fadeInUp [animation-delay:200ms]">
            Phoenix Rooivalk is designed to detect and neutralize hostile drones
            in 120-195ms even when communications are jammed. The system will
            make "soft-kill first" decisions at the edge without requiring
            network connectivity.
          </p>
          <div className="mt-4 p-4 bg-gradient-to-r from-[rgba(var(--primary),0.1)] to-[rgba(var(--secondary),0.1)] rounded-lg border border-[rgba(var(--primary),0.2)]">
            <p className="text-[rgb(var(--primary))] font-semibold mb-2">
              Why This Matters:
            </p>
            <p className="text-sm text-[rgb(var(--gray))]">
              Traditional systems fail when enemies jam communications (3-10
              second response). Phoenix Rooivalk is designed to work 100%
              without network - targeting 250x faster response when it counts
              most.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-[rgb(var(--accent))] font-bold text-lg">
                  120ms
                </div>
                <div className="text-[rgb(var(--gray))]">Target Response</div>
              </div>
              <div className="text-center">
                <div className="text-[rgb(var(--accent))] font-bold text-lg">
                  100%
                </div>
                <div className="text-[rgb(var(--gray))]">Offline Design</div>
              </div>
              <div className="text-center">
                <div className="text-[rgb(var(--accent))] font-bold text-lg">
                  250x
                </div>
                <div className="text-[rgb(var(--gray))]">
                  Performance Target
                </div>
              </div>
              <div className="text-center">
                <div className="text-[rgb(var(--accent))] font-bold text-lg">
                  $26B
                </div>
                <div className="text-[rgb(var(--gray))]">Market by 2030</div>
              </div>
            </div>
            <div className="text-xs text-[rgb(var(--gray))] text-center border-t border-[rgba(var(--primary),0.1)] pt-3 mt-4">
              Designed to address 64% market vulnerability gap in RF-silent
              drone detection
            </div>
          </div>

          {/* Enhanced CTAs with specific value propositions */}
          <div className="mt-8 space-y-4 animate-fadeInUp [animation-delay:400ms]">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                href="#contact"
                size="lg"
                className="bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--accent))] hover:from-[rgb(var(--accent))] hover:to-[rgb(var(--primary))] shadow-xl"
              >
                Join Development Program
              </Button>
              <Button
                href="/interactive-demo"
                variant="outline"
                size="lg"
                className="border-[rgb(var(--primary))] text-[rgb(var(--primary))] hover:bg-[rgba(var(--primary),0.1)]"
              >
                View Technical Concept
              </Button>
            </div>
            <div className="flex flex-wrap gap-4 text-sm">
              <Button
                href="/technical"
                variant="outline"
                size="sm"
                className="border-[rgba(var(--primary),0.3)] text-[rgb(var(--gray))] hover:text-[rgb(var(--primary))] hover:border-[rgb(var(--primary))]"
              >
                Technical Specifications →
              </Button>
              <Button
                href="/financial"
                variant="outline"
                size="sm"
                className="border-[rgba(var(--primary),0.3)] text-[rgb(var(--gray))] hover:text-[rgb(var(--primary))] hover:border-[rgb(var(--primary))]"
              >
                ROI Calculator →
              </Button>
              <Button
                href="/compliance"
                variant="outline"
                size="sm"
                className="border-[rgba(var(--primary),0.3)] text-[rgb(var(--gray))] hover:text-[rgb(var(--primary))] hover:border-[rgb(var(--primary))]"
              >
                Compliance & Certifications →
              </Button>
            </div>
          </div>
        </div>

        {/* Right: ThreatSimulator as candy bait */}
        <div className="relative animate-float">
          <div className="bg-gradient-to-br from-[rgb(var(--dark))] to-[rgb(var(--darker))] rounded-2xl p-6 border border-[rgba(var(--primary),0.2)] shadow-2xl shadow-[rgba(var(--primary),0.1)]">
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-[rgb(var(--primary))] mb-2">
                Edge Autonomy Demo
              </h3>
              <p className="text-sm text-[rgb(var(--gray))]">
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
