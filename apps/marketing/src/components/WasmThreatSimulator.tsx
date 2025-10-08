"use client";

import React, { useEffect, useRef, useState } from "react";

interface WasmThreatSimulatorProps {
  autoFullscreen?: boolean;
  isTeaser?: boolean;
  className?: string;
}

/**
 * WasmThreatSimulator - Embeds the Leptos/WASM threat simulator
 *
 * This component loads and initializes the Rust-based WASM threat simulator
 * built with Leptos and Trunk. The WASM module provides a high-performance
 * simulation with native-like performance.
 */
export const WasmThreatSimulator: React.FC<WasmThreatSimulatorProps> = ({
  autoFullscreen = false,
  isTeaser = false,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wasmInitialized, setWasmInitialized] = useState(false);

  useEffect(() => {
    let mounted = true;

    const initWasm = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Load the WASM module using script tags for better Next.js compatibility
        const loadScript = (src: string): Promise<void> => {
          return new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.type = "module";
            script.textContent = `
              import init from '${src}';
              
              try {
                const wasm = await init({
                  module_or_path: '/wasm/threat-simulator-desktop-43e4df905ff42f76_bg.wasm'
                });
                
                window.dispatchEvent(new CustomEvent("WasmLoaded", {
                  detail: { wasm }
                }));
              } catch (error) {
                window.dispatchEvent(new CustomEvent("WasmError", {
                  detail: { error }
                }));
              }
            `;
            document.head.appendChild(script);

            // Listen for events
            const handleLoaded = () => {
              cleanup();
              resolve();
            };

            const handleError = (event: Event) => {
              cleanup();
              const detail = (event as CustomEvent).detail;
              reject(detail?.error || new Error("Failed to load WASM"));
            };

            const cleanup = () => {
              window.removeEventListener("WasmLoaded", handleLoaded);
              window.removeEventListener("WasmError", handleError);
            };

            window.addEventListener("WasmLoaded", handleLoaded);
            window.addEventListener("WasmError", handleError);

            // Timeout after 30 seconds
            setTimeout(() => {
              cleanup();
              reject(new Error("WASM loading timeout"));
            }, 30000);
          });
        };

        await loadScript("/wasm/threat-simulator-desktop-43e4df905ff42f76.js");

        if (!mounted) return;

        setWasmInitialized(true);
        setIsLoading(false);

        // Apply fullscreen if requested
        if (autoFullscreen && containerRef.current) {
          setTimeout(() => {
            containerRef.current?.requestFullscreen?.();
          }, 500);
        }
      } catch (err) {
        console.error("Failed to initialize WASM module:", err);
        if (mounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load the threat simulator",
          );
          setIsLoading(false);
        }
      }
    };

    initWasm();

    return () => {
      mounted = false;
    };
  }, [autoFullscreen]);

  return (
    <div
      ref={containerRef}
      className={`wasm-threat-simulator-container ${className}`}
      style={{
        width: "100%",
        height: isTeaser ? "600px" : "100vh",
        minHeight: isTeaser ? "600px" : "800px",
        position: "relative",
        backgroundColor: "#000",
        borderRadius: isTeaser ? "8px" : "0",
        overflow: "hidden",
      }}
    >
      {/* Load WASM styles */}
      <link rel="stylesheet" href="/wasm/styles-2e626ac1d358eb54.css" />

      {isLoading && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            color: "#00ff00",
            fontFamily: "monospace",
          }}
        >
          <div
            style={{
              fontSize: "24px",
              marginBottom: "20px",
              animation: "pulse 1.5s ease-in-out infinite",
            }}
          >
            ⚡ Loading Threat Simulator...
          </div>
          <div style={{ fontSize: "14px", color: "#0f0" }}>
            Initializing WASM Runtime
          </div>
        </div>
      )}

      {error && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            color: "#ff0000",
            fontFamily: "monospace",
            maxWidth: "80%",
          }}
        >
          <div style={{ fontSize: "24px", marginBottom: "20px" }}>
            ⚠️ Error Loading Simulator
          </div>
          <div style={{ fontSize: "14px", color: "#faa" }}>{error}</div>
          <div style={{ fontSize: "12px", color: "#888", marginTop: "10px" }}>
            Please try refreshing the page
          </div>
        </div>
      )}

      {/* Mount point for the Leptos WASM app */}
      <div
        id="app"
        style={{
          width: "100%",
          height: "100%",
          display: wasmInitialized ? "block" : "none",
        }}
      />

      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
};

export default WasmThreatSimulator;
