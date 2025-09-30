import React from "react";
import { RevealSection } from "../RevealSection";

export const CredibilitySection: React.FC = () => {
  return (
    <section
      className="px-6 md:px-[5%] lg:px-8 py-12 bg-[linear-gradient(180deg,rgba(0,136,255,0.05),rgba(0,255,136,0.05))]"
      id="credibility"
    >
      <div className="max-w-[1400px] mx-auto">
        <RevealSection className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Development Status
          </h2>
          <p className="text-[var(--gray)] max-w-2xl mx-auto">
            Transparent development process with military-grade security
            standards
          </p>
        </RevealSection>

        <RevealSection className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-900/50 border border-gray-700/50 rounded-lg p-6 text-center">
            <div className="text-3xl mb-3">🔬</div>
            <h3 className="text-lg font-bold text-white mb-2">
              Prototype Phase
            </h3>
            <p className="text-sm text-gray-400">
              Core architecture validated in controlled environments
            </p>
          </div>

          <div className="bg-gray-900/50 border border-gray-700/50 rounded-lg p-6 text-center">
            <div className="text-3xl mb-3">🚀</div>
            <h3 className="text-lg font-bold text-white mb-2">SBIR Strategy</h3>
            <p className="text-sm text-gray-400">
              Air Force SBIR Phase I application ($350K) in progress
            </p>
          </div>

          <div className="bg-gray-900/50 border border-gray-700/50 rounded-lg p-6 text-center">
            <div className="text-3xl mb-3">🛡️</div>
            <h3 className="text-lg font-bold text-white mb-2">
              DoD Compliance
            </h3>
            <p className="text-sm text-gray-400">
              CMMC 2.0 Level 2 certification pathway
            </p>
          </div>

          <div className="bg-gray-900/50 border border-gray-700/50 rounded-lg p-6 text-center">
            <div className="text-3xl mb-3">🤝</div>
            <h3 className="text-lg font-bold text-white mb-2">
              Partnership Ready
            </h3>
            <p className="text-sm text-gray-400">
              Seeking Anduril integration and defense contractor partnerships
            </p>
          </div>
        </RevealSection>

        <RevealSection className="text-center mt-8">
          <div className="bg-gray-900/30 border border-gray-700/50 rounded-lg p-6 max-w-4xl mx-auto">
            <h3 className="text-xl font-bold text-white mb-4">
              Technical Advisory
            </h3>
            <p className="text-gray-300 mb-4">
              Development guided by defense industry veterans with expertise in
              counter-UAS systems, blockchain security, and military-grade
              software architecture.
            </p>
            <div className="text-sm text-gray-400">
              Contact for technical advisory board information and partnership
              discussions
            </div>
          </div>
        </RevealSection>
      </div>
    </section>
  );
};
