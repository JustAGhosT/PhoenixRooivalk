import * as React from "react";
import { Button } from "../ui/button";

export const HeroSection: React.FC = () => {
  return (
    <section
      className="flex items-center px-6 md:px-[5%] lg:px-8 py-20 relative min-h-screen bg-gradient-to-br from-gray-900 to-black"
      id="hero"
    >
      <div className="mx-auto max-w-[1400px] grid lg:grid-cols-2 gap-20 items-center">
        {/* Left: Enhanced messaging with credibility */}
        <div>
          {/* Development status indicators */}
          <div className="mb-6 flex flex-wrap gap-3">
            <span className="pill pill--concept">Concept Phase</span>
            <span className="pill pill--partners">Seeking Design Partners</span>
            <span className="pill pill--sbir">Open to SBIR Collaboration</span>
          </div>

          {/* Vision-focused headline */}
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-br from-white to-[rgb(var(--primary))] animate-fadeInUp mb-8">
            Concept: Edge Autonomy in RF-Denied Environments
            <span className="block text-2xl md:text-4xl mt-4 text-[rgb(var(--accent))]">
              Level-0 Local Decisioning
            </span>
          </h1>
          <p className="mb-8 text-xl text-[rgb(var(--gray))] animate-fadeInUp [animation-delay:200ms] leading-relaxed">
            We are exploring a Level-0 autonomy approach designed to make
            immediate, local decisions without network connectivity. This site
            presents concepts and a simulation—not a fielded system.
          </p>
          <div className="mt-4 p-4 bg-gradient-to-r from-[rgba(var(--primary),0.1)] to-[rgba(var(--secondary),0.1)] rounded-lg border border-[rgba(var(--primary),0.2)]">
            <p className="text-[rgb(var(--primary))] font-semibold mb-2">
              Hypothesis (to be validated):
            </p>
            <p className="text-sm text-[rgb(var(--gray))]">
              Local, on-device decisioning could reduce time-to-action from
              seconds to &lt;200ms in lab conditions.
              <br />
              <strong>Status:</strong> Planning (no field data).
              <br />
              <strong>Ask:</strong> Looking for design partners to define
              evaluation criteria and datasets.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-[rgb(var(--accent))] font-bold text-lg">
                  &lt;200ms
                </div>
                <div className="text-[rgb(var(--gray))]">Lab Target</div>
              </div>
              <div className="text-center">
                <div className="text-[rgb(var(--accent))] font-bold text-lg">
                  100%
                </div>
                <div className="text-[rgb(var(--gray))]">Offline Concept</div>
              </div>
              <div className="text-center">
                <div className="text-[rgb(var(--accent))] font-bold text-lg">
                  TBD
                </div>
                <div className="text-[rgb(var(--gray))]">
                  Performance Validation
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
              Concept designed to address 64% market vulnerability gap in
              RF-silent drone detection
            </div>
          </div>

          {/* Enhanced CTAs with specific value propositions */}
          <div className="mt-8 space-y-4 animate-fadeInUp [animation-delay:400ms]">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button href="/interactive-demo" size="lg" variant="primary">
                Try the Simulation (Concept UI)
              </Button>
              <Button href="/contact" variant="secondary" size="lg">
                Join Early Access
              </Button>
            </div>
            <div className="flex flex-wrap gap-4 text-sm">
              <Button href="/technical" variant="ghost" size="sm">
                Technical Specifications →
              </Button>
              <Button href="/financial" variant="ghost" size="sm">
                ROI Calculator →
              </Button>
              <Button href="/compliance" variant="ghost" size="sm">
                Compliance & Certifications →
              </Button>
            </div>
          </div>
        </div>

        {/* Right: Visual representation */}
        <div className="relative">
          <div className="card card--elevated">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-[var(--action-primary)] mb-4">
                Level-0 Autonomy Concept
              </h3>
              <p className="text-[var(--text-muted)] mb-6">
                Edge-first decision making without network dependency
              </p>
            </div>

            {/* Visual concept representation */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[rgba(var(--primary),0.1)] rounded-lg border border-[rgba(var(--primary),0.2)]">
                <span className="text-sm font-medium text-[var(--text-primary)]">
                  Detection Latency
                </span>
                <span className="text-lg font-bold text-[var(--action-success)]">
                  &lt;200ms
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-[rgba(var(--primary),0.1)] rounded-lg border border-[rgba(var(--primary),0.2)]">
                <span className="text-sm font-medium text-[var(--text-primary)]">
                  Network Independence
                </span>
                <span className="text-lg font-bold text-[var(--action-success)]">
                  100%
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-[rgba(var(--primary),0.1)] rounded-lg border border-[rgba(var(--primary),0.2)]">
                <span className="text-sm font-medium text-[var(--text-primary)]">
                  Market Gap Addressed
                </span>
                <span className="text-lg font-bold text-[var(--action-success)]">
                  64%
                </span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-[var(--action-warning)]/10 border border-[var(--action-warning)]/20 rounded-lg">
              <p className="text-xs text-[var(--action-warning)] text-center font-semibold">
                💡 This represents a conceptual approach under development.
                Performance metrics are targets for validation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
