import * as React from "react";
import { RevealSection } from "../RevealSection";

export const CapabilitiesSection: React.FC = () => {
  const coreCapabilities = [
    {
      icon: "⚡",
      title: "Sub-Second Response",
      description:
        "120-195ms autonomous detection and neutralization. Works when all communications are jammed.",
      proof: "Verified by independent testing lab",
    },
    {
      icon: "🔍",
      title: "Detects RF-Silent Drones",
      description:
        "Multi-sensor fusion (radar, cameras, microphones) catches autonomous drones others cannot see.",
      proof: "Patent-pending sensor fusion algorithm",
    },
    {
      icon: "🌐",
      title: "100% Edge Autonomy",
      description:
        "Like a flock of birds - nodes coordinate via light signals and sound pulses. 500m-1km range between nodes.",
      proof: "No network dependency",
    },
    {
      icon: "🔗",
      title: "Act & Record Locally",
      description:
        "Records everything locally in milliseconds. Uploads to blockchain when network returns for legal evidence.",
      proof: "Military-grade local storage",
    },
    {
      icon: "🗑️",
      title: "Auto-Wipe Security",
      description:
        "Data erases itself if: no signal for 60s, leaves authorized area, or tamper detected. Military-grade protection.",
      proof: "FIPS 140-2 Level 3 certified",
    },
    {
      icon: "🎯",
      title: "Swarm Defense Capability",
      description:
        "Handles coordinated swarm attacks in real-time. Scales to hundreds of simultaneous threats.",
      proof: "Tested against 50+ drone swarms",
    },
    {
      icon: "🛡️",
      title: "Human Authorization Backup",
      description:
        "Fiber-optic link for human weapons authorization. Multiple backup paths when radios are jammed.",
      proof: "Redundant communication paths",
    },
    {
      icon: "📊",
      title: "Enhanced Intelligence (Optional)",
      description:
        "When network is available: AI enhancement, threat intelligence, and blockchain evidence for legal compliance.",
      proof: "Hybrid edge + cloud processing",
    },
    {
      icon: "⛓️",
      title: "Blockchain Evidence (Optional)",
      description:
        "Immutable evidence trails on Solana blockchain. Tamper-proof records for legal compliance and audit trails.",
      proof: "Legal-grade evidence chain",
    },
  ];

  return (
    <section className="px-6 md:px-[5%] lg:px-8 py-12" id="capabilities">
      <div className="max-w-[1400px] mx-auto">
        <RevealSection className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Three-Tier Defense Architecture
          </h2>
          <p className="text-[rgb(var(--gray))] max-w-3xl mx-auto">
            <strong className="text-white">Tier 1 (Core):</strong> Autonomous
            edge operation with sub-second response.
            <strong className="text-white"> Tier 2 (Enhanced):</strong> AI and
            intelligence when network available.
            <strong className="text-white"> Tier 3 (Strategic):</strong>{" "}
            Analytics and compliance reporting.
          </p>
        </RevealSection>
        <RevealSection className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coreCapabilities.map((capability, index) => (
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
  proof?: string;
}> = ({ icon, title, description, proof }) => (
  <div className="text-center p-6 rounded-xl bg-[rgba(var(--primary),0.05)] border border-[rgba(var(--primary),0.2)] hover:border-[rgba(var(--primary),0.4)] transition-all hover:-translate-y-1">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
    <p className="text-[rgb(var(--gray))] mb-3">{description}</p>
    {proof && (
      <div className="text-xs text-green-400 font-medium">✓ {proof}</div>
    )}
  </div>
);
