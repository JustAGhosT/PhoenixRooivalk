import { RevealSection } from '@/components/RevealSection';
import React from 'react';

export const MarketIntelligenceSection: React.FC = () => {
  const marketData = [
    {
      metric: "$26B",
      label: "Market by 2030",
      description: "Counter-drone market growing from $2.3-4.5B to $9-26B",
    },
    {
      metric: "100x",
      label: "Performance Improvement",
      description: "&lt;2ms vs 2-5 seconds for current systems",
    },
    {
      metric: "64%",
      label: "Market Vulnerability",
      description: "RF-dependent systems cannot detect autonomous drones",
    },
    {
      metric: "2-5s",
      label: "Current Latency",
      description: "Detection-to-engagement time for existing systems",
    },
  ];

  const competitors = [
    {
      name: "Anduril",
      status: "$14B valuation",
      capability: "Lattice OS integration, DoD contracts",
      limitation: "2-5 second latency, cloud dependency",
    },
    {
      name: "Fortem",
      status: "4,500+ drone kills in Ukraine",
      capability: "DroneHunter F700, battlefield-proven",
      limitation: "Kinetic only, no RF-silent detection",
    },
    {
      name: "DroneShield",
      status: "700+ global deployments",
      capability: "Electronic warfare, cost-effective",
      limitation: "RF-dependent, no kinetic capability",
    },
  ];

  return (
    <section className="px-6 md:px-[5%] lg:px-8 py-12 bg-[linear-gradient(180deg,rgba(0,136,255,0.05),rgba(0,255,136,0.05))]" id="market">
      <div className="max-w-[1400px] mx-auto">
        <RevealSection className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Market Opportunity & Competitive Position</h2>
          <p className="text-[var(--gray)] max-w-3xl mx-auto">
            Phoenix Rooivalk addresses critical gaps in the $26B counter-drone market with Level-0 autonomous architecture
          </p>
        </RevealSection>

        {/* Market Metrics */}
        <RevealSection className="mb-12">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">Market Intelligence</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {marketData.map((data, index) => (
              <div key={index} className="bg-gray-900/50 border border-gray-700/50 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-[var(--primary)] mb-2">{data.metric}</div>
                <div className="text-lg font-semibold text-white mb-2">{data.label}</div>
                <div className="text-sm text-gray-400">{data.description}</div>
              </div>
            ))}
          </div>
        </RevealSection>

        {/* Competitive Analysis */}
        <RevealSection>
          <h3 className="text-2xl font-bold text-white mb-6 text-center">Competitive Landscape</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {competitors.map((competitor, index) => (
              <div key={index} className="bg-gray-900/30 border border-gray-700/50 rounded-lg p-6">
                <div className="text-xl font-bold text-white mb-2">{competitor.name}</div>
                <div className="text-sm text-[var(--primary)] mb-3">{competitor.status}</div>
                <div className="text-sm text-gray-300 mb-3">
                  <strong>Strengths:</strong> {competitor.capability}
                </div>
                <div className="text-sm text-gray-400">
                  <strong>Limitations:</strong> {competitor.limitation}
                </div>
              </div>
            ))}
          </div>
        </RevealSection>

        {/* Phoenix Advantage */}
        <RevealSection className="mt-12">
          <div className="bg-gradient-to-r from-[var(--primary)]/10 to-[var(--secondary)]/10 border border-[var(--primary)]/30 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Phoenix Rooivalk Advantage</h3>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div>
                <div className="text-lg font-semibold text-[var(--primary)] mb-2">Speed</div>
                <div className="text-sm text-gray-300">&lt;2ms latency vs 2-5 seconds for competitors</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-[var(--primary)] mb-2">Autonomy</div>
                <div className="text-sm text-gray-300">Complete edge operation without communications</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-[var(--primary)] mb-2">Accountability</div>
                <div className="text-sm text-gray-300">Blockchain-verified engagement records</div>
              </div>
            </div>
          </div>
        </RevealSection>
      </div>
    </section>
  );
};
