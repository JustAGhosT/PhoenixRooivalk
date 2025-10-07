import { downloadWhitepaper } from "@phoenix-rooivalk/utils";
import React from "react";
import { RevealSection } from "../RevealSection";
import { Button } from "../ui/button";

export const WhitepaperSection: React.FC = () => {
  const features: Array<{
    icon: string;
    title: string;
    description: string;
    color: "green" | "blue" | "purple" | "yellow";
  }> = [
    {
      icon: "🏗️",
      title: "System Architecture",
      description: "Complete technical design and component integration",
      color: "green",
    },
    {
      icon: "🔒",
      title: "Security Framework",
      description: "Blockchain security and compliance standards",
      color: "blue",
    },
    {
      icon: "📊",
      title: "Performance Metrics",
      description: "Detailed benchmarks and testing results",
      color: "purple",
    },
    {
      icon: "🚀",
      title: "Deployment Guide",
      description: "Implementation and configuration instructions",
      color: "yellow",
    },
  ];

  return (
    <section className="px-6 md:px-[5%] lg:px-8 py-12 bg-[linear-gradient(180deg,rgba(0,255,136,0.1),rgba(0,136,255,0.1))]">
      <div className="max-w-[1400px] mx-auto text-center">
        <RevealSection>
          <div className="inline-block bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))] text-black px-4 py-2 rounded-full text-sm font-bold mb-6">
            📋 COMPREHENSIVE TECHNICAL DOCUMENTATION
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Get the Complete Technical Whitepaper
          </h2>
          <p className="text-[rgb(var(--gray))] max-w-3xl mx-auto text-lg mb-6">
            Download our detailed technical documentation covering system
            architecture, security implementation, deployment configurations,
            and performance specifications.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                color={feature.color}
              />
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => downloadWhitepaper()}
              size="lg"
              className="bg-green-600 hover:bg-green-700"
            >
              📥 Download Technical Whitepaper
            </Button>
            <Button href="#contact" variant="ghost" size="lg">
              Request Full Documentation
            </Button>
          </div>
        </RevealSection>
      </div>
    </section>
  );
};

const FeatureCard: React.FC<{
  icon: string;
  title: string;
  description: string;
  color: "green" | "blue" | "purple" | "yellow";
}> = ({ icon, title, description, color }) => {
  const getColorClass = (color: string) => {
    switch (color) {
      case "green":
        return "bg-gray-800/50 border-green-500/20 text-green-400";
      case "blue":
        return "bg-gray-800/50 border-blue-500/20 text-blue-400";
      case "purple":
        return "bg-gray-800/50 border-purple-500/20 text-purple-400";
      case "yellow":
        return "bg-gray-800/50 border-yellow-500/20 text-yellow-400";
      default:
        return "bg-gray-800/50 border-blue-500/20 text-blue-400";
    }
  };

  return (
    <div className={`p-4 rounded-lg border ${getColorClass(color)}`}>
      <div className="text-2xl mb-2">{icon}</div>
      <h3 className={`font-semibold text-sm mb-1`}>{title}</h3>
      <p className="text-xs text-gray-300">{description}</p>
    </div>
  );
};
