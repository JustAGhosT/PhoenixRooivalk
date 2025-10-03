import * as React from "react";
import { Button } from "../ui/button";

export const HeroSection: React.FC = () => {
  return (
    <section
      className="flex items-center px-6 md:px-[5%] lg:px-8 py-24 relative min-h-screen bg-gradient-to-br from-gray-900 to-black"
      id="hero"
    >
      <div className="mx-auto max-w-[1200px] text-center">
        {/* Development status indicators */}
        <div className="mb-6 flex flex-wrap gap-3 justify-center">
          <span className="pill pill--concept">Concept Phase</span>
          <span className="pill pill--partners">Seeking Design Partners</span>
          <span className="pill pill--sbir">Open to SBIR Collaboration</span>
        </div>

        {/* Vision-focused headline */}
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-br from-white to-[rgb(var(--primary))] animate-fadeInUp mb-6">
          Edge Autonomy in RF-Denied Environments
          <span className="block text-3xl md:text-5xl mt-3 text-[rgb(var(--accent))]">
            Level-0 Local Decisioning
          </span>
        </h1>
        <p className="mb-8 text-xl text-[rgb(var(--gray))] animate-fadeInUp [animation-delay:200ms] leading-relaxed max-w-3xl mx-auto">
          Autonomous counter-drone defense that operates without network
          connectivity. Sub-200ms response times in complete RF denial.
        </p>
        <div className="mt-6 p-6 bg-gradient-to-r from-[rgba(var(--primary),0.1)] to-[rgba(var(--secondary),0.1)] rounded-xl border border-[rgba(var(--primary),0.2)] max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-[rgb(var(--primary))]">
                &lt;200ms
              </div>
              <div className="text-sm text-[rgb(var(--gray))]">
                Response Time
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[rgb(var(--primary))]">
                100%
              </div>
              <div className="text-sm text-[rgb(var(--gray))]">
                Offline Operation
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[rgb(var(--primary))]">
                64%
              </div>
              <div className="text-sm text-[rgb(var(--gray))]">Market Gap</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[rgb(var(--primary))]">
                $26B
              </div>
              <div className="text-sm text-[rgb(var(--gray))]">
                Market by 2030
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced CTAs with specific value propositions */}
        <div className="mt-8 space-y-4 animate-fadeInUp [animation-delay:400ms] flex flex-col items-center">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button href="/interactive-demo" size="lg" variant="primary">
              Try the Simulation (Concept UI)
            </Button>
            <Button href="/contact" variant="secondary" size="lg">
              Join Early Access
            </Button>
          </div>
          <div className="flex flex-wrap gap-4 text-sm justify-center">
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

        {/* Level-0 Autonomy Concept Card - moved below as a row */}
        <div className="mt-6 max-w-4xl mx-auto">
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
