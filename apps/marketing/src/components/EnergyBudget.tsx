import React from 'react';

interface EnergyBudgetProps {
  used: number;
  max: number;
  className?: string;
  showDetails?: boolean;
}

export const EnergyBudget: React.FC<EnergyBudgetProps> = ({
  used,
  max,
  className = '',
  showDetails = true,
}) => {
  const percentage = max > 0 ? (used / max) * 100 : 0;
  const remaining = max - used;
  
  const getStatusColor = () => {
    if (percentage >= 90) return 'var(--sim-danger)';
    if (percentage >= 75) return 'var(--sim-warning)';
    return 'var(--sim-success)';
  };

  return (
    <div className={`energy-budget ${className}`}>
      <div className="energy-budget-header">
        <span className="energy-budget-title">Energy Budget</span>
        <span 
          className="energy-budget-status"
          style={{ color: getStatusColor() }}
        >
          {percentage.toFixed(0)}%
        </span>
      </div>
      
      <div className="energy-budget-bar">
        <div 
          className="energy-budget-fill"
          style={{
            width: `${Math.min(100, percentage)}%`,
            backgroundColor: getStatusColor(),
          }}
        />
      </div>
      
      {showDetails && (
        <div className="energy-budget-details">
          <div className="energy-budget-values">
            <span className="energy-budget-used">
              Used: <strong>{used}</strong>
            </span>
            <span className="energy-budget-remaining">
              Available: <strong>{remaining}</strong>
            </span>
            <span className="energy-budget-total">
              Total: <strong>{max}</strong>
            </span>
          </div>
        </div>
      )}
      
      {percentage >= 90 && (
        <div className="energy-budget-warning">
          ⚠️ Energy budget nearly exhausted
        </div>
      )}
    </div>
  );
};

export default EnergyBudget;
