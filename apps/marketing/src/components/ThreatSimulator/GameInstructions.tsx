import React from "react";

export const GameInstructions: React.FC = () => {
  return (
    <div className="absolute top-4 right-4 bg-[rgba(0,0,0,0.8)] rounded-lg p-3 text-xs text-[var(--gray)] max-w-48">
      <div className="text-[var(--primary)] font-bold mb-1">Mission:</div>
      <div>
        Drag threats to shield or let countermeasures auto-engage. Use "Generate
        Swarm" to test coordinated attacks. Match countermeasure to threat type
        for maximum effectiveness!
      </div>
    </div>
  );
};
