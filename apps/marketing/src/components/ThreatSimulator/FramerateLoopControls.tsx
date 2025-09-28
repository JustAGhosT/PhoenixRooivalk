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
    <div className="bg-gray-800/50 p-4 rounded-lg border border-green-500/30">
      <h3 className="text-green-400 font-semibold mb-4">Game Controls</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Playback Controls */}
        <div className="space-y-3">
          <h4 className="text-gray-300 text-sm font-medium">Playback</h4>
          <div className="flex gap-2">
            <button
              onClick={onTogglePlay}
              className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium transition-colors"
            >
              {isPlaying ? '⏸️ Pause' : '▶️ Play'}
            </button>
            <button
              onClick={onReset}
              className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm font-medium transition-colors"
            >
              🔄 Reset
            </button>
          </div>
        </div>

        {/* Framerate Controls */}
        <div className="space-y-3">
          <h4 className="text-gray-300 text-sm font-medium">Framerate</h4>
          <div className="space-y-2">
            <label className="text-gray-300 text-sm">FPS: {settings.fps}</label>
            <input
              type="range"
              min="30"
              max="120"
              value={settings.fps}
              onChange={(e) => onSettingsChange({ fps: Number(e.target.value) })}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>30</span>
              <span>60</span>
              <span>120</span>
            </div>
          </div>
        </div>

        {/* Loop Controls */}
        <div className="space-y-3">
          <h4 className="text-gray-300 text-sm font-medium">Loop Settings</h4>
          <div className="space-y-2">
            <select
              value={settings.loopType}
              onChange={(e) => onSettingsChange({
                loopType: e.target.value as GameSettings['loopType']
              })}
              className="w-full bg-gray-800 text-green-400 border border-green-500/30 rounded px-2 py-1 text-sm"
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
                className="w-full bg-gray-800 text-green-400 border border-green-500/30 rounded px-2 py-1 text-sm"
                placeholder="Loop count"
                min="1"
              />
            )}

            {settings.loopType === 'range' && (
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  value={settings.loopStart}
                  onChange={(e) => onSettingsChange({ loopStart: Number(e.target.value) })}
                  className="bg-gray-800 text-green-400 border border-green-500/30 rounded px-2 py-1 text-sm"
                  placeholder="Start"
                  min="0"
                />
                <input
                  type="number"
                  value={settings.loopEnd}
                  onChange={(e) => onSettingsChange({ loopEnd: Number(e.target.value) })}
                  className="bg-gray-800 text-green-400 border border-green-500/30 rounded px-2 py-1 text-sm"
                  placeholder="End"
                  min="1"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Game Stats */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="bg-gray-900/50 p-2 rounded">
          <div className="text-green-400 text-lg font-bold">{currentFrame}</div>
          <div className="text-gray-400 text-xs">Frame</div>
        </div>
        <div className="bg-gray-900/50 p-2 rounded">
          <div className="text-blue-400 text-lg font-bold">{settings.fps}</div>
          <div className="text-gray-400 text-xs">FPS</div>
        </div>
        <div className="bg-gray-900/50 p-2 rounded">
          <div className="text-yellow-400 text-lg font-bold">{gameState.score}</div>
          <div className="text-gray-400 text-xs">Score</div>
        </div>
        <div className="bg-gray-900/50 p-2 rounded">
          <div className="text-purple-400 text-lg font-bold">{gameState.gameLevel}</div>
          <div className="text-gray-400 text-xs">Level</div>
        </div>
      </div>

      {/* Loop Info */}
      <div className="mt-3 text-xs text-gray-400 text-center">
        Loop: {settings.loopType === 'infinite' ? '∞' :
               settings.loopType === 'count' ? `${settings.loopCount} frames` :
               `${settings.loopStart}-${settings.loopEnd}`}
      </div>
    </div>
  );
};
