import React from 'react';

interface FullscreenControlsProps {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const FullscreenControls: React.FC<FullscreenControlsProps> = ({
  isFullscreen,
  onToggleFullscreen
}) => {
  return (
    <div className="absolute top-32 right-4 bg-[rgba(0,0,0,0.8)] rounded-lg p-2 border border-[rgba(0,255,136,0.3)]">
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
  );
};
