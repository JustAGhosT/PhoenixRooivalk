import { RevealSection } from '@/components/RevealSection';
import React from 'react';

export const CapabilitiesSection: React.FC = () => {
  const capabilities = [
    {
      icon: "⚡",
      title: "100x Performance Improvement",
      description: '<2ms response time vs 2-5 seconds for competitors. Edge-only processing with 275 TOPS AI inference.',
    },
    {
      icon: "🔍",
      title: "RF-Silent Drone Detection",
      description: "Defeats autonomous drones others cannot detect. Multi-sensor fusion handles RF-silent threats.",
    },
    {
      icon: "🌐",
      title: "Level-0 Autonomous Operation",
      description: "Complete edge operation without communications. Byzantine fault-tolerant consensus for resilience.",
    },
    {
      icon: "🔗",
      title: "Blockchain Audit Trails",
      description: "Tamper-proof engagement records for legal compliance. Solana-based evidence chain.",
    },
    {
      icon: "🎯",
      title: "Swarm Defense Capability",
      description: "Handles coordinated swarm attacks in real-time. Scales to hundreds of simultaneous threats.",
    },
    {
      icon: "🛡️",
      title: "DoD Compliance Ready",
      description: "Operator-supervised autonomous system. Human-on-the-loop with override mechanisms.",
    },
  ];

  return (
    <section className="px-6 md:px-[5%] lg:px-8 py-12" id="capabilities">
      <div className="max-w-[1400px] mx-auto">
        <RevealSection className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Level-0 Autonomous Capabilities</h2>
          <p className="text-[var(--gray)] max-w-2xl mx-auto">
            First true autonomous counter-drone platform addressing $26B market opportunity with 100x performance improvement
          </p>
        </RevealSection>
        <RevealSection className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((capability, index) => (
            <CapabilityCard key={index} {...capability} />
          ))}
        </RevealSection>
      </div>
    </section>
  );
};

const CapabilityCard: React.FC<{
  icon: string;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <div className="text-center p-6 rounded-xl bg-[rgba(0,136,255,0.05)] border border-[rgba(0,136,255,0.2)] hover:border-[rgba(0,136,255,0.4)] transition-all hover:-translate-y-1">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
    <p className="text-[var(--gray)]">{description}</p>
  </div>
);
