import * as React from "react";

interface ThreatSimulatorOverlaysProps {
  showSimulationWarning: boolean;
  setShowSimulationWarning: (show: boolean) => void;
  showFullscreenPrompt: boolean;
  isTeaser: boolean;
  isFullscreen: boolean;
  enterFullscreen: () => void;
  exitFullscreen: () => void;
  showFullscreenIndicator?: boolean;
}

export const ThreatSimulatorOverlays: React.FC<
  ThreatSimulatorOverlaysProps
> = ({
  showSimulationWarning,
  setShowSimulationWarning,
  showFullscreenPrompt,
  isTeaser,
  isFullscreen,
  enterFullscreen,
  exitFullscreen,
  showFullscreenIndicator = false,
}) => {
  return (
    <>
      {/* Simulation Warning */}
      {showSimulationWarning && (
        <div className="absolute top-4 left-4 right-4 z-50 bg-red-900/95 backdrop-blur-md border border-red-500/60 rounded-lg p-4 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                <span className="text-red-400 text-lg">⚠️</span>
              </div>
              <div>
                <div className="text-sm text-white font-semibold mb-1">
                  SIMULATION MODULE
                </div>
                <div className="text-xs text-red-200">
                  This interactive module is designed to visualize concepts. It
                  does not represent real-world sensor performance, detection
                  ranges, or decision latency.
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowSimulationWarning(false)}
              className="text-red-400 hover:text-red-300 transition-colors p-2 hover:bg-red-500/20 rounded"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      {/* Enhanced Fullscreen Prompt */}
      {showFullscreenPrompt && !isFullscreen && (
        <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-600/50 rounded-xl p-8 max-w-lg text-center shadow-2xl">
            <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🎮</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              Enter Fullscreen Mode
            </h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              The threat simulation requires fullscreen mode for the optimal
              tactical experience. This ensures maximum immersion and precise
              control.
            </p>
            <div className="flex space-x-4">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-all shadow-lg flex-1"
                onClick={enterFullscreen}
              >
                Enter Fullscreen
              </button>
              <button
                className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg transition-all shadow-lg"
                onClick={() => setShowSimulationWarning(false)}
              >
                Continue in Window
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
