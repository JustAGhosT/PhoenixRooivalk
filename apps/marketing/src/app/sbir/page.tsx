"use client";
import * as React from "react";
import { Footer } from "../../components/Footer";
import { Navigation } from "../../components/Navigation";
import { usePerformanceOptimizations } from "../../hooks/usePerformanceOptimizations";

export default function SBIRPage(): React.ReactElement {
  // Apply performance optimizations
  usePerformanceOptimizations();

  return (
    <main className="relative overflow-hidden bg-[var(--darker)] text-white">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom,_#1b2735_0%,_#090a0f_100%)]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,136,0.03)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(0,255,136,0.03)_1px,_transparent_1px)] bg-[length:50px_50px] animate-gridMove" />
      </div>

      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <div className="pt-20">
        <section className="py-20 bg-gradient-to-br from-[rgb(var(--bg-primary))] to-[rgb(var(--darker))] relative overflow-hidden">
          <div className="relative z-10 px-6 md:px-[5%] lg:px-8">
            <div className="max-w-[1400px] mx-auto">
              {/* Section Header */}
              <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-[rgb(var(--text-primary))] to-[rgb(var(--primary))] mb-6">
                  SBIR Program
                </h1>
                <p className="text-xl text-[rgb(var(--gray))] max-w-3xl mx-auto">
                  Phoenix Rooivalk is actively pursuing Air Force SBIR Phase I
                  funding and seeking partnerships with defense contractors for
                  market entry.
                </p>
              </div>

              {/* SBIR Program Details */}
              <div className="grid lg:grid-cols-2 gap-12">
                {/* Program Overview */}
                <div className="space-y-8">
                  <div className="card">
                    <h3 className="text-2xl font-bold text-[var(--action-primary)] mb-4">
                      Air Force SBIR Phase I
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-[var(--text-muted)]">
                          Funding Amount:
                        </span>
                        <span className="text-[var(--action-success)] font-bold">
                          $350,000
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-muted)]">
                          Duration:
                        </span>
                        <span className="text-[var(--text-primary)] font-bold">
                          6 months
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-muted)]">
                          Status:
                        </span>
                        <span className="text-[var(--action-warning)] font-bold">
                          In Progress
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <h3 className="text-2xl font-bold text-[var(--action-primary)] mb-4">
                      Program Objectives
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-[var(--action-success)] mr-2">
                          ✓
                        </span>
                        <span className="text-[var(--text-muted)]">
                          Technical validation of Level-0 autonomy concept
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[var(--action-success)] mr-2">
                          ✓
                        </span>
                        <span className="text-[var(--text-muted)]">
                          Demonstration of sub-200ms response times
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[var(--action-success)] mr-2">
                          ✓
                        </span>
                        <span className="text-[var(--text-muted)]">
                          RF-denied environment testing
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[var(--action-success)] mr-2">
                          ✓
                        </span>
                        <span className="text-[var(--text-muted)]">
                          Swarm defense capability validation
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Partnership Opportunities */}
                <div className="space-y-8">
                  <div className="card">
                    <h3 className="text-2xl font-bold text-[var(--action-primary)] mb-4">
                      Partnership Opportunities
                    </h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-[rgba(var(--primary),0.1)] rounded-lg border border-[rgba(var(--primary),0.2)]">
                        <h4 className="font-semibold text-[var(--text-primary)] mb-2">
                          Defense Contractors
                        </h4>
                        <p className="text-sm text-[var(--text-muted)]">
                          Integration with existing defense systems and
                          platforms
                        </p>
                      </div>
                      <div className="p-4 bg-[rgba(var(--primary),0.1)] rounded-lg border border-[rgba(var(--primary),0.2)]">
                        <h4 className="font-semibold text-[var(--text-primary)] mb-2">
                          Technology Partners
                        </h4>
                        <p className="text-sm text-[var(--text-muted)]">
                          Sensor fusion, AI/ML, and blockchain integration
                        </p>
                      </div>
                      <div className="p-4 bg-[rgba(var(--primary),0.1)] rounded-lg border border-[rgba(var(--primary),0.2)]">
                        <h4 className="font-semibold text-[var(--text-primary)] mb-2">
                          Academic Institutions
                        </h4>
                        <p className="text-sm text-[var(--text-muted)]">
                          Research collaboration and technology validation
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <h3 className="text-2xl font-bold text-[var(--action-primary)] mb-4">
                      Government Contracting
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-[var(--text-muted)]">
                          CMMC Level 2:
                        </span>
                        <span className="text-[var(--action-warning)] font-bold">
                          Planned
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-muted)]">
                          ITAR Compliance:
                        </span>
                        <span className="text-[var(--action-warning)] font-bold">
                          Planned
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-muted)]">
                          Security Clearance:
                        </span>
                        <span className="text-[var(--action-warning)] font-bold">
                          Planned
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Section */}
              <div className="mt-16 text-center">
                <h3 className="text-3xl font-bold text-[var(--text-primary)] mb-4">
                  Interested in SBIR Collaboration?
                </h3>
                <p className="text-[var(--text-muted)] mb-6 max-w-2xl mx-auto">
                  Contact us to learn more about our SBIR program participation
                  and explore collaboration opportunities for government
                  contracting and defense partnerships.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="mailto:sbir@phoenixrooivalk.com"
                    className="btn btn--primary"
                  >
                    SBIR Collaboration
                  </a>
                  <a
                    href="mailto:government@phoenixrooivalk.com"
                    className="btn btn--secondary"
                  >
                    Government Contracting
                  </a>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="mt-8 p-4 bg-[var(--action-warning)]/10 border border-[var(--action-warning)]/20 rounded-lg">
                <p className="text-sm text-[var(--action-warning)] text-center font-semibold">
                  💡 SBIR program participation is subject to proposal
                  acceptance and funding approval. All timelines and funding
                  amounts are estimates and subject to change.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
