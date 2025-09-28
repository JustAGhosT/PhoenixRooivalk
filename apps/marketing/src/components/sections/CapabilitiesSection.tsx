import React from 'react';
import { RevealSection } from '@/components/RevealSection';

export const CapabilitiesSection: React.FC = () => {
  const capabilities = [
    {
      icon: "🎯",
      title: "Eliminates False Positives",
      description: 'Multi-sensor fusion (RF + acoustic + optical) with AI classification prevents "puddles mistaken for tanks" failures plaguing current systems.',
    },
    {
      icon: "🔗",
      title: "EW-Resistant Coordination",
      description: "Blockchain-anchored swarm coordination defeats electronic warfare attacks that cripple traditional drone communications.",
    },
    {
      icon: "⚡",
      title: "Immediate Deployment",
      description: "Ready for field deployment today, providing 18-month advantage over competitors racing toward 2027 deadline.",
    },
  ];

  return (
    <section className="px-[5%] py-12" id="capabilities">
      <div className="max-w-[1400px] mx-auto">
        <RevealSection className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Core Capabilities</h2>
          <p className="text-[var(--gray)] max-w-2xl mx-auto">
            Advanced counter-UAS technology with modular deployment options
          </p>
        </RevealSection>
        <RevealSection className="grid md:grid-cols-3 gap-6">
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
