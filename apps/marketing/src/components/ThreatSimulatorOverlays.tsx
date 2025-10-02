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
      {/* Critical Simulation Disclaimer */}
      {showSimulationWarning && (
        <div className="absolute top-2 left-2 right-2 z-50 bg-black/80 backdrop-blur-sm border border-red-500/30 rounded-lg p-2">
          <div className="flex items-center justify-between">
            <p className="text-xs text-red-400 font-semibold flex-1">
              ⚠️ SIMULATION: This interactive module is designed to visualize
              concepts. It does not represent real-world sensor performance,
              detection ranges, or decision latency.
            </p>
            <button
              onClick={() => setShowSimulationWarning(false)}
              className="ml-3 text-red-400 hover:text-red-300 transition-colors"
              title="Close warning"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Auto-Fullscreen Prompt */}
      {showFullscreenPrompt && (
        <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center p-8 max-w-md">
            <div className="mb-6">
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Entering Full-Screen Mode
              </h3>
              <p className="text-gray-300 text-sm mb-6">
                The demo is entering full-screen mode for optimal interaction
                experience. This ensures proper game area size for human
                control.
              </p>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
              <span className="text-orange-400 font-semibold">Loading...</span>
            </div>
          </div>
        </div>
      )}

      {/* Teaser Overlay */}
      {isTeaser && !isFullscreen && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center p-8 max-w-md">
            <div className="mb-6">
              <div className="text-6xl mb-4">🎮</div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Experience Full Defense
              </h3>
              <p className="text-gray-300 text-sm mb-6">
                This is a preview of the Phoenix Rooivalk defense system
                simulator. Enter full-screen mode to access all features and
                controls.
              </p>
            </div>

            <button
              onClick={enterFullscreen}
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              🚀 Enter Full-Screen Mode
            </button>

            <p className="text-xs text-gray-400 mt-4">
              Press ESC to exit full-screen at any time
            </p>
          </div>
        </div>
      )}

      {/* Fullscreen Indicator */}
      {showFullscreenIndicator && !isFullscreen && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-40">
          <div className="text-center p-6 max-w-md bg-black/80 border border-orange-500/30 rounded-lg">
            <div className="mb-4">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="text-xl font-bold text-white mb-2">
                Enter Fullscreen for Threat Simulation
              </h3>
              <p className="text-gray-300 text-sm mb-4">
                For the optimal threat simulation demonstration experience,
                please enter fullscreen mode to access all interactive features
                and controls.
              </p>
            </div>

            <button
              onClick={enterFullscreen}
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              🚀 Enter Fullscreen Mode
            </button>

            <p className="text-xs text-gray-400 mt-3">
              Press ESC to exit fullscreen at any time
            </p>
          </div>
        </div>
      )}

      {/* Fullscreen Exit Button */}
      {isFullscreen && (
        <button
          onClick={exitFullscreen}
          className="absolute top-4 right-4 z-50 bg-black/80 text-white p-2 rounded-lg hover:bg-black/90 transition-colors"
          title="Exit Fullscreen (ESC)"
        >
          ✕
        </button>
      )}
    </>
  );
};
