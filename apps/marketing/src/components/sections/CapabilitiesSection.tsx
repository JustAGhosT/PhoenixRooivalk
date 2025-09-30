import { RevealSection } from "@/components/RevealSection";
import React from "react";

export const CapabilitiesSection: React.FC = () => {
  const capabilities = [
    {
      icon: "⚡",
      title: "250x Faster Response",
      description:
        "120-195ms response time vs 3-10 seconds for competitors. Works when all communications are jammed.",
    },
    {
      icon: "🔍",
      title: "Detects RF-Silent Drones",
      description:
        "Multi-sensor fusion (radar, cameras, microphones) catches autonomous drones others cannot see.",
    },
    {
      icon: "🌐",
      title: "Edge Autonomy (No Network Needed)",
      description:
        "Like a flock of birds - nodes coordinate via light signals and sound pulses. 500m-1km range between nodes.",
    },
    {
      icon: "🔗",
      title: "Act & Record Locally, Report Later",
      description:
        "Records everything locally in milliseconds. Uploads to blockchain when network returns for legal evidence.",
    },
    {
      icon: "🗑️",
      title: "Auto-Wipe Security",
      description:
        "Data erases itself if: no signal for 60s, leaves authorized area, or tamper detected. Military-grade protection.",
    },
    {
      icon: "🎯",
      title: "Swarm Defense Capability",
      description:
        "Handles coordinated swarm attacks in real-time. Scales to hundreds of simultaneous threats.",
    },
    {
      icon: "🛡️",
      title: "Human Authorization Backup",
      description:
        "Fiber-optic link for human weapons authorization. Multiple backup paths when radios are jammed.",
    },
  ];

  return (
    <section className="px-6 md:px-[5%] lg:px-8 py-12" id="capabilities">
      <div className="max-w-[1400px] mx-auto">
        <RevealSection className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            What Makes Phoenix Different
          </h2>
          <p className="text-[var(--gray)] max-w-2xl mx-auto">
            The only counter-drone system that works 100% without network
            connectivity. Stops threats in milliseconds while competitors wait
            for jammed communications.
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
