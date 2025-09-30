"use client";

import { RevealSection } from "@/components/RevealSection";
import { downloadWhitepaper } from "@/utils/downloadWhitepaper";
import React from "react";
import { Button } from "../ui/button";

export const ContactSection: React.FC = () => {
  return (
    <section
      className="px-6 md:px-[5%] lg:px-8 py-12 bg-[linear-gradient(180deg,rgba(0,136,255,0.05),transparent)]"
      id="contact"
    >
      <div className="max-w-[1400px] mx-auto">
        <RevealSection className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Deploy Level-0 Autonomous Defense?
          </h2>
          <p className="text-[var(--gray)] max-w-2xl mx-auto">
            Join the next generation of counter-drone defense. Request
            capability demonstration or download technical whitepaper.
          </p>
        </RevealSection>

        <RevealSection className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-900/50 border border-gray-700/50 rounded-lg p-8">
            <h3 className="text-xl font-bold text-white mb-4">
              Request Capability Demonstration
            </h3>
            <p className="text-gray-300 mb-6">
              See Phoenix Rooivalk's Level-0 autonomous architecture in action.
              Demonstrate &lt;2ms response time, RF-silent drone detection, and
              swarm defense capabilities.
            </p>
            <div className="space-y-4">
              <Button
                href="mailto:demo@phoenixrooivalk.com"
                size="lg"
                className="w-full"
              >
                Schedule Technical Demo
              </Button>
              <Button
                href="mailto:partnerships@phoenixrooivalk.com"
                variant="outline"
                size="lg"
                className="w-full"
              >
                Partnership Inquiries
              </Button>
            </div>
          </div>

          <div className="bg-gray-900/50 border border-gray-700/50 rounded-lg p-8">
            <h3 className="text-xl font-bold text-white mb-4">
              Technical Resources
            </h3>
            <p className="text-gray-300 mb-6">
              Download comprehensive technical documentation and market
              analysis. Learn about Level-0 architecture, market opportunity,
              and competitive positioning.
            </p>
            <div className="space-y-4">
              <Button onClick={downloadWhitepaper} size="lg" className="w-full">
                Download Technical Whitepaper
              </Button>
              <Button
                href="/technical"
                variant="outline"
                size="lg"
                className="w-full"
              >
                View Technical Specifications
              </Button>
            </div>
          </div>
        </RevealSection>

        <RevealSection className="text-center mt-12">
          <div className="bg-gradient-to-r from-[var(--primary)]/10 to-[var(--secondary)]/10 border border-[var(--primary)]/30 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              SBIR & Government Opportunities
            </h3>
            <p className="text-gray-300 mb-6">
              Phoenix Rooivalk is actively pursuing Air Force SBIR Phase I
              ($350K) and seeking partnerships with defense contractors for
              market entry. Contact us for SBIR collaboration or government
              contracting opportunities.
            </p>
            <Button href="mailto:government@phoenixrooivalk.com" size="lg">
              Government Contracting Inquiries
            </Button>
          </div>
        </RevealSection>
      </div>
    </section>
  );
};
