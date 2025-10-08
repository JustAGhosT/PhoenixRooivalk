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

        // Resolve asset URLs via manifest to avoid hardcoded hashes
        const manifest = await fetch("/wasm/manifest.json", { cache: "no-store" })
          .then(r => (r.ok ? r.json() : null))
          .catch(() => null);
        const pick = (ext: string, fallback: string) => {
          if (manifest && Array.isArray(manifest.files)) {
            const match = manifest.files.find((f: string) => f.endsWith(ext));
            if (match) return `/wasm/${match}`;
          }
          return fallback;
        };
        const jsUrl = pick(".js", "/wasm/threat-simulator-desktop-43e4df905ff42f76.js");
        const wasmUrl = pick(".wasm", "/wasm/threat-simulator-desktop-43e4df905ff42f76_bg.wasm");

        // Load WASM via dynamic import to avoid inline scripts/CSP issues
        const mod = await import(/* webpackIgnore: true */ jsUrl);
        const init = mod.default || mod.__wbg_init;
        if (typeof init !== "function") throw new Error("Invalid WASM module: missing default init");
        await init({ module_or_path: wasmUrl });
        if (!mounted) return;

        setWasmInitialized(true);
        setIsLoading(false);

        // Apply fullscreen if requested
        if (autoFullscreen && containerRef.current?.requestFullscreen) {
          setTimeout(() => {
            containerRef.current!
              .requestFullscreen()
              .catch(() => { /* ignore: user gesture required or denied */ });
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
