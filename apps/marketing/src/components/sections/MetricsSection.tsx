import React from "react";
import { MetricCard } from "../ui/MetricCard";

const metrics = [
  ["Military-Grade", "Detection Accuracy", "Multi-sensor fusion approach"],
  ["Blockchain-Secured", "Evidence Integrity", "Tamper-proof audit trails"],
  ["&lt; 200ms", "Response Time", "Edge computing architecture"],
  ["Contested", "Environment Ready", "Designed for degraded networks"],
];

export const MetricsSection: React.FC = () => {
  return (
    <section
      className="px-[5%] py-12 bg-[linear-gradient(180deg,transparent,rgba(0,136,255,0.05))]"
      id="metrics"
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center reveal mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Technical Architecture
          </h2>
          <p className="text-[var(--gray)] max-w-2xl mx-auto">
            Designed for contested environments with multi-layer resilience and evidence integrity.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 reveal">
          {metrics.map(([value, label, description], index) => (
            <MetricCard
              key={index}
              value={value}
              label={label}
              description={description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
