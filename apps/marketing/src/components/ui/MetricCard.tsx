import React from 'react';

interface MetricCardProps {
  value: string;
  label: string;
  description: string;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  value,
  label,
  description,
  className = ''
}) => {
  return (
    <div className={`text-center p-6 rounded-xl bg-[rgba(0,255,136,0.05)] border border-[rgba(0,255,136,0.2)] hover:border-[rgba(0,255,136,0.4)] transition-all hover:-translate-y-1 ${className}`}>
      <div className="text-3xl md:text-4xl font-bold text-[var(--primary)] mb-2">
        {value}
      </div>
      <div className="text-lg font-semibold text-white mb-1">
        {label}
      </div>
      <div className="text-sm text-[var(--gray)]">
        {description}
      </div>
    </div>
  );
};
