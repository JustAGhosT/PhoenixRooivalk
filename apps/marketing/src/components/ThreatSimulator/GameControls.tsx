import React from 'react';

interface GameControlsProps {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onGenerateSwarm: () => void;
  canGenerateSwarm: boolean;
}

export const GameControls: React.FC<GameControlsProps> = ({
  isFullscreen,
  onToggleFullscreen,
  onGenerateSwarm,
  canGenerateSwarm
}) => {
  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-[rgba(0,0,0,0.8)] rounded-lg p-3 border border-[rgba(0,255,136,0.3)]">
      <div className="flex items-center gap-3">
        {/* Generate Swarm Button */}
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

        {/* Divider */}
        <div className="w-px h-8 bg-[rgba(0,255,136,0.3)]"></div>

        {/* Fullscreen Button */}
        <button
          onClick={onToggleFullscreen}
          className="text-[var(--primary)] hover:text-white transition-colors p-2 rounded hover:bg-[rgba(0,255,136,0.1)]"
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          {isFullscreen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
            </svg>
          )}
        </button>
      </div>
      
      <div className="text-xs text-orange-400 mt-2 text-center">
        Spawns 3-5 coordinated attackers | Click fullscreen for immersive experience
      </div>
    </div>
  );
};
