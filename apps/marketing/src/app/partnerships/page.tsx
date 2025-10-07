"use client";
import * as React from "react";
import { Footer } from "../../components/Footer";
import { Navigation } from "../../components/Navigation";
import { usePerformanceOptimizations } from "../../hooks/usePerformanceOptimizations";

export default function PartnershipsPage(): React.ReactElement {
  // Apply performance optimizations
  usePerformanceOptimizations();

  return (
    <main className="relative overflow-hidden bg-darker text-white">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom,_#1b2735_0%,_#090a0f_100%)]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,136,0.03)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(0,255,136,0.03)_1px,_transparent_1px)] bg-[length:50px_50px] animate-gridMove" />
      </div>

      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <div className="pt-20">
        <section className="py-20 bg-gradient-to-br from-bg-primary to-darker relative overflow-hidden">
          <div className="relative z-10 px-6 md:px-[5%] lg:px-8">
            <div className="max-w-[1400px] mx-auto">
              {/* Section Header */}
              <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-text-primary to-primary mb-6">
                  Partnership Opportunities
                </h1>
                <p className="text-xl text-gray max-w-3xl mx-auto">
                  Explore collaboration opportunities with Phoenix
                  Rooivalk&apos;s innovative counter-drone defense technology.
                </p>
              </div>

              {/* Partnership Categories */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Civilian Applications */}
                <div className="card">
                  <div className="text-center mb-4">
                    <div className="text-3xl mb-2">🏢</div>
                    <h3 className="text-lg font-bold text-primary mb-2">
                      Civilian Applications
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div className="text-sm">
                      <div className="font-semibold text-text-primary mb-1">
                        Airport Security
                      </div>
                      <div className="text-text-muted">
                        Perimeter protection, runway monitoring
                      </div>
                    </div>
                    <div className="text-sm">
                      <div className="font-semibold text-text-primary mb-1">
                        Critical Infrastructure
                      </div>
                      <div className="text-text-muted">
                        Power plants, water facilities, communication towers
                      </div>
                    </div>
                    <div className="text-sm">
                      <div className="font-semibold text-text-primary mb-1">
                        Event Security
                      </div>
                      <div className="text-text-muted">
                        Stadiums, concerts, public gatherings
                      </div>
                    </div>
                  </div>
                </div>

                {/* Commercial Security */}
                <div className="card">
                  <div className="text-center mb-4">
                    <div className="text-3xl mb-2">🏭</div>
                    <h3 className="text-lg font-bold text-primary mb-2">
                      Commercial Security
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div className="text-sm">
                      <div className="font-semibold text-text-primary mb-1">
                        Corporate Campus
                      </div>
                      <div className="text-text-muted">
                        Headquarters, R&D facilities
                      </div>
                    </div>
                    <div className="text-sm">
                      <div className="font-semibold text-text-primary mb-1">
                        Data Center Security
                      </div>
                      <div className="text-text-muted">
                        Server farms, cloud infrastructure
                      </div>
                    </div>
                    <div className="text-sm">
                      <div className="font-semibold text-text-primary mb-1">
                        Port Security
                      </div>
                      <div className="text-text-muted">
                        Shipping terminals, cargo facilities
                      </div>
                    </div>
                  </div>
                </div>

                {/* Research & Development */}
                <div className="card">
                  <div className="text-center mb-4">
                    <div className="text-3xl mb-2">🔬</div>
                    <h3 className="text-lg font-bold text-primary mb-2">
                      Research & Development
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div className="text-sm">
                      <div className="font-semibold text-text-primary mb-1">
                        University Partnerships
                      </div>
                      <div className="text-text-muted">
                        Academic research collaboration
                      </div>
                    </div>
                    <div className="text-sm">
                      <div className="font-semibold text-text-primary mb-1">
                        Government Labs
                      </div>
                      <div className="text-text-muted">
                        DARPA, NSF, national laboratories
                      </div>
                    </div>
                    <div className="text-sm">
                      <div className="font-semibold text-text-primary mb-1">
                        International Cooperation
                      </div>
                      <div className="text-text-muted">
                        NATO, allied defense research
                      </div>
                    </div>
                  </div>
                </div>

                {/* Technology Licensing */}
                <div className="card">
                  <div className="text-center mb-4">
                    <div className="text-3xl mb-2">⚡</div>
                    <h3 className="text-lg font-bold text-primary mb-2">
                      Technology Licensing
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div className="text-sm">
                      <div className="font-semibold text-text-primary mb-1">
                        Sensor Fusion
                      </div>
                      <div className="text-text-muted">
                        Core detection algorithms
                      </div>
                    </div>
                    <div className="text-sm">
                      <div className="font-semibold text-text-primary mb-1">
                        Edge Processing
                      </div>
                      <div className="text-text-muted">
                        Autonomous decision-making
                      </div>
                    </div>
                    <div className="text-sm">
                      <div className="font-semibold text-text-primary mb-1">
                        Blockchain Integration
                      </div>
                      <div className="text-text-muted">
                        Evidence management systems
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Section */}
              <div className="mt-16 text-center">
                <h3 className="text-3xl font-bold text-text-primary mb-4">
                  Interested in Partnership?
                </h3>
                <p className="text-text-muted mb-6 max-w-2xl mx-auto">
                  Contact us to explore collaboration opportunities and learn
                  more about how Phoenix Rooivalk technology can be adapted for
                  your specific needs.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="mailto:partnerships@phoenixrooivalk.com"
                    className="btn btn--primary"
                  >
                    Partnership Inquiries
                  </a>
                  <a
                    href="mailto:demo@phoenixrooivalk.com"
                    className="btn btn--secondary"
                  >
                    Schedule Technical Demo
                  </a>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="mt-8 p-4 bg-[rgb(var(--action-warning))]/10 border border-[rgb(var(--action-warning))]/20 rounded-lg">
                <p className="text-sm text-[rgb(var(--action-warning))] text-center font-semibold">
                  💡 These are potential applications under exploration. Actual
                  deployment would require regulatory approval, market
                  validation, and technology adaptation for specific use cases.
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
