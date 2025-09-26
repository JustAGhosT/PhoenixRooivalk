import React from 'react';

interface SwarmGeneratorProps {
  onGenerateSwarm: () => void;
  canGenerateSwarm: boolean;
}

export const SwarmGenerator: React.FC<SwarmGeneratorProps> = ({
  onGenerateSwarm,
  canGenerateSwarm
}) => {
  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-[rgba(0,0,0,0.8)] rounded-lg p-3 border border-[rgba(255,136,0,0.3)]">
      <button
        onClick={onGenerateSwarm}
        disabled={!canGenerateSwarm}
        className={`px-4 py-2 rounded font-bold text-sm transition-all ${
          canGenerateSwarm 
            ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white hover:scale-105 hover:shadow-lg' 
            : 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
        }`}
        title="Generate a coordinated swarm attack"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">🐝</span>
          <span>Generate Swarm</span>
        </div>
      </button>
      <div className="text-xs text-orange-400 mt-1 text-center">
        Spawns 3-5 coordinated attackers
      </div>
    </div>
  );
};
