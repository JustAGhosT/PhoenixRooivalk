import React from "react";
import { MetricCard } from "../ui/MetricCard";

const metrics = [
  ["99.7%", "AI Accuracy", "vs 60-70% current systems"],
  ["99.3%", "Data Integrity", "vs 85% traditional systems"],
  ["&lt; 200ms", "Response Time", "vs 1-3 seconds industry standard"],
  ["18 Months", "Head Start", "Ready before 2027 deadline"],
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
            Revolutionary AI + Blockchain Performance
          </h2>
          <p className="text-[var(--gray)] max-w-2xl mx-auto">
            Phoenix Rooivalk combines cutting-edge AI with military-grade
            blockchain technology to deliver unprecedented performance. 99.7%
            accuracy with 99.3% data integrity protection, ready 18 months ahead
            of the 2027 deadline.
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
