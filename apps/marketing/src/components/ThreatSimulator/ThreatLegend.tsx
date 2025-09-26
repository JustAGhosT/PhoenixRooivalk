import React from 'react';

export const ThreatLegend: React.FC = () => {
  return (
    <div className="absolute bottom-20 left-4 bg-[rgba(0,0,0,0.8)] rounded-lg p-3 text-xs border border-[rgba(0,255,136,0.3)]">
      <div className="text-[var(--primary)] font-bold mb-2">Threat Types:</div>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span>🚁</span><span className="text-red-400">Drone</span><span className="text-[#00ff88]">(Kinetic)</span>
        </div>
        <div className="flex items-center gap-2">
          <span>📡</span><span className="text-orange-400">Radar</span><span className="text-[#0088ff]">(EW)</span>
        </div>
        <div className="flex items-center gap-2">
          <span>🛸</span><span className="text-yellow-400">Stealth</span><span className="text-[#ff0088]">(Laser)</span>
        </div>
        <div className="flex items-center gap-2">
          <span>🐝</span><span className="text-purple-400">Swarm</span><span className="text-[#00ff88]">(Kinetic)</span>
        </div>
        <div className="flex items-center gap-2">
          <span>🚀</span><span className="text-red-600">Heavy</span><span className="text-[#ff0088]">(Laser)</span>
        </div>
      </div>
    </div>
  );
};
