import React from 'react';
import { MetricCard } from '../ui/MetricCard';

const metrics = [
  ['95%+', 'Hit Rate', 'vs 60-70% current systems'],
  ['18 Months', 'Head Start', 'Ready before 2027 deadline'],
  ['$0.00025', 'Per Transaction', 'vs $150+ per drone'],
  ['Multi-Spectrum', 'Defense', 'Kinetic + EW + Laser'],
];

export const MetricsSection: React.FC = () => {
  return (
    <section className="px-[5%] py-16 bg-[linear-gradient(180deg,transparent,rgba(0,136,255,0.05))]" id="metrics">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center reveal mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Solving the 2027 Autonomous Warfare Challenge
          </h2>
          <p className="text-[var(--gray)] max-w-2xl mx-auto">
            While Ukraine races against an 18-month deadline, Phoenix Rooivalk delivers the defensive advantage today. Superior reliability, EW resistance, and swarm coordination capabilities.
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
