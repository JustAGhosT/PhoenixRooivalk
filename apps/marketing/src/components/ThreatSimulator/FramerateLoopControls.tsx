import React from 'react';
import { GameState, GameSettings } from './types';

interface FramerateLoopControlsProps {
  gameState: GameState;
  onSettingsChange: (settings: Partial<GameSettings>) => void;
  onTogglePlay: () => void;
  onReset: () => void;
  isPlaying: boolean;
}

export const FramerateLoopControls: React.FC<FramerateLoopControlsProps> = ({
  gameState,
  onSettingsChange,
  onTogglePlay,
  onReset,
  isPlaying,
}) => {
  const { settings, currentFrame } = gameState;

  return (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-green-500/30 shadow-lg">
      <h3 className="text-green-400 font-semibold mb-6 text-lg">Game Controls</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Playback Controls */}
        <div className="space-y-4">
          <h4 className="text-gray-300 text-sm font-medium">Playback</h4>
          <div className="flex gap-3">
            <button
              onClick={onTogglePlay}
              className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {isPlaying ? '⏸️ Pause' : '▶️ Play'}
            </button>
            <button
              onClick={onReset}
              className="px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              🔄 Reset
            </button>
          </div>
        </div>

        {/* Framerate Controls */}
        <div className="space-y-4">
          <h4 className="text-gray-300 text-sm font-medium">Framerate</h4>
          <div className="space-y-3">
            <label className="text-gray-300 text-sm block">FPS: <span className="text-blue-400 font-semibold">{settings.fps}</span></label>
            <input
              type="range"
              min="30"
              max="120"
              value={settings.fps}
              onChange={(e) => onSettingsChange({ fps: Number(e.target.value) })}
              className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>30</span>
              <span>60</span>
              <span>120</span>
            </div>
          </div>
        </div>

        {/* Loop Controls */}
        <div className="space-y-4">
          <h4 className="text-gray-300 text-sm font-medium">Loop Settings</h4>
          <div className="space-y-3">
            <select
              value={settings.loopType}
              onChange={(e) => onSettingsChange({
                loopType: e.target.value as GameSettings['loopType']
              })}
              className="w-full bg-gray-800 text-green-400 border border-green-500/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="infinite">Infinite Loop</option>
              <option value="count">Loop Count</option>
              <option value="range">Frame Range</option>
            </select>

            {settings.loopType === 'count' && (
              <input
                type="number"
                value={settings.loopCount}
                onChange={(e) => onSettingsChange({ loopCount: Number(e.target.value) })}
                className="w-full bg-gray-800 text-green-400 border border-green-500/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Loop count"
                min="1"
              />
            )}

            {settings.loopType === 'range' && (
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  value={settings.loopStart}
                  onChange={(e) => onSettingsChange({ loopStart: Number(e.target.value) })}
                  className="bg-gray-800 text-green-400 border border-green-500/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Start"
                  min="0"
                />
                <input
                  type="number"
                  value={settings.loopEnd}
                  onChange={(e) => onSettingsChange({ loopEnd: Number(e.target.value) })}
                  className="bg-gray-800 text-green-400 border border-green-500/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="End"
                  min="1"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Game Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
        <div className="bg-gray-900/60 p-3 rounded-lg border border-green-500/20">
          <div className="text-green-400 text-xl font-bold">{currentFrame}</div>
          <div className="text-gray-400 text-xs uppercase tracking-wide">Frame</div>
        </div>
        <div className="bg-gray-900/60 p-3 rounded-lg border border-blue-500/20">
          <div className="text-blue-400 text-xl font-bold">{settings.fps}</div>
          <div className="text-gray-400 text-xs uppercase tracking-wide">FPS</div>
        </div>
        <div className="bg-gray-900/60 p-3 rounded-lg border border-yellow-500/20">
          <div className="text-yellow-400 text-xl font-bold">{gameState.score}</div>
          <div className="text-gray-400 text-xs uppercase tracking-wide">Score</div>
        </div>
        <div className="bg-gray-900/60 p-3 rounded-lg border border-purple-500/20">
          <div className="text-purple-400 text-xl font-bold">{gameState.gameLevel}</div>
          <div className="text-gray-400 text-xs uppercase tracking-wide">Level</div>
        </div>
      </div>

      {/* Loop Info */}
      <div className="mt-5 pt-4 border-t border-gray-700/50">
        <div className="text-xs text-gray-400 text-center bg-gray-900/30 py-2 px-4 rounded">
          Loop: <span className="text-green-400 font-semibold">
            {settings.loopType === 'infinite' ? '∞ (Infinite)' :
             settings.loopType === 'count' ? `${settings.loopCount} frames` :
             `${settings.loopStart}-${settings.loopEnd}`}
          </span>
        </div>
      </div>
    </div>
  );
};
