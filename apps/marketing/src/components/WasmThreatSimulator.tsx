"use client";

import React, { useEffect, useId, useRef, useState } from "react";

interface WasmThreatSimulatorProps {
  autoFullscreen?: boolean;
  isTeaser?: boolean;
  className?: string;
}

// Singleton flag to prevent multiple WASM instances
// Leptos targets a specific mount point and multiple instances would conflict
let wasmInstanceInitialized = false;

/**
 * WasmThreatSimulator - Embeds the Leptos/WASM threat simulator
 *
 * This component loads and initializes the Rust-based WASM threat simulator
 * built with Leptos and Trunk. The WASM module provides a high-performance
 * simulation with native-like performance.
 *
 * Note: Only one instance of this component can be active at a time due to
 * WASM module constraints. Multiple instances will be prevented automatically.
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
  const [cssUrl, setCssUrl] = useState<string | null>(null);
  const [wasmStylesLoaded, setWasmStylesLoaded] = useState(false);

  // Generate unique mount ID for this instance
  const mountId = useId().replace(/:/g, "-"); // Replace React's : separator
  const uniqueMountId = `wasm-mount-${mountId}`;

  useEffect(() => {
    let mounted = true;

    const initWasm = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Enforce singleton: only one WASM instance can be initialized
        if (wasmInstanceInitialized) {
          console.warn(
            "WASM Threat Simulator is already initialized. Only one instance is allowed.",
          );
          setError(
            "Another simulator instance is already active. Only one can run at a time.",
          );
          setIsLoading(false);
          return;
        }

        // Mark this instance as initialized
        wasmInstanceInitialized = true;

        // Resolve asset URLs via manifest to avoid hardcoded hashes
        const manifest = await fetch("/wasm/manifest.json", {
          cache: "no-store",
        })
          .then((r) => (r.ok ? r.json() : null))
          .catch((err) => {
            console.warn("Failed to load WASM manifest:", err);
            return null;
          });

        const pick = (ext: string, fallback?: string) => {
          if (manifest && Array.isArray(manifest.files)) {
            const match = manifest.files.find((f: string) => f.endsWith(ext));
            if (match) return `/wasm/${match}`;
          }
          return fallback || null;
        };

        const jsUrl = pick(
          ".js",
          "/wasm/threat-simulator-desktop-43e4df905ff42f76.js",
        );
        const wasmUrl = pick(
          ".wasm",
          "/wasm/threat-simulator-desktop-43e4df905ff42f76_bg.wasm",
        );
        const resolvedCssUrl = pick(".css");

        // Set CSS URL in state for rendering
        if (mounted && resolvedCssUrl) {
          setCssUrl(resolvedCssUrl);
        } else if (mounted) {
          console.warn("WASM stylesheet not found in manifest");
        }

        // Validate required assets
        if (!jsUrl || !wasmUrl) {
          throw new Error("Required WASM assets (JS or WASM) not found");
        }

        // Wait for mount element to be available with retry logic
        let mountElement = document.getElementById(uniqueMountId);
        let retries = 0;
        const maxRetries = 10;

        while (!mountElement && retries < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, 50));
          mountElement = document.getElementById(uniqueMountId);
          retries++;
        }

        if (!mountElement) {
          throw new Error(
            `Mount element not found after ${maxRetries} retries`,
          );
        }
        const originalId = mountElement.id;
        mountElement.id = "app";

        // Load WASM via dynamic import to avoid inline scripts/CSP issues
        const mod = await import(/* webpackIgnore: true */ jsUrl);
        const init = mod.default || mod.__wbg_init;
        if (typeof init !== "function")
          throw new Error("Invalid WASM module: missing default init");
        await init({ module_or_path: wasmUrl });

        // Restore original unique ID after Leptos mounts
        setTimeout(() => {
          if (mountElement && mounted) {
            mountElement.id = originalId;
          }
        }, 100);

        if (!mounted) return;

        setWasmInitialized(true);
        setIsLoading(false);

        // Removed auto-fullscreen as it interferes with page scrolling
        // Users can manually enter fullscreen if needed
        // if (autoFullscreen && containerRef.current?.requestFullscreen) {
        //   setTimeout(() => {
        //     containerRef.current!.requestFullscreen().catch(() => {
        //       /* ignore: user gesture required or denied */
        //     });
        //   }, 500);
        // }
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
      // Reset singleton flag when component unmounts
      wasmInstanceInitialized = false;
    };
  }, [autoFullscreen, uniqueMountId]);

  // Dynamically load and scope WASM CSS to prevent global interference
  useEffect(() => {
    if (!cssUrl || wasmStylesLoaded) return;

    const loadWasmStyles = async () => {
      try {
        const response = await fetch(cssUrl);
        const cssText = await response.text();

        // Create a scoped style element
        const styleElement = document.createElement("style");
        styleElement.id = `wasm-styles-${uniqueMountId}`;

        // Scope all CSS rules to the simulator container
        const scopedCss = cssText.replace(/([^{}]+){/g, (match, selector) => {
          // Skip @ rules (media queries, keyframes, etc.)
          if (selector.trim().startsWith("@")) {
            return match;
          }
          // Scope regular selectors to the container
          const scopedSelector = selector
            .split(",")
            .map((s) => `.wasm-threat-simulator-container ${s.trim()}`)
            .join(", ");
          return `${scopedSelector} {`;
        });

        styleElement.textContent = scopedCss;
        document.head.appendChild(styleElement);
        setWasmStylesLoaded(true);
      } catch (err) {
        console.warn("Failed to load WASM styles:", err);
        setWasmStylesLoaded(true); // Continue without styles
      }
    };

    loadWasmStyles();

    return () => {
      // Cleanup scoped styles on unmount
      const styleElement = document.getElementById(
        `wasm-styles-${uniqueMountId}`,
      );
      if (styleElement) {
        styleElement.remove();
      }
    };
  }, [cssUrl, uniqueMountId, wasmStylesLoaded]);

  return (
    <div
      ref={containerRef}
      className={`wasm-threat-simulator-container ${className}`}
      style={{
        width: "100%",
        maxWidth: isTeaser ? "100%" : "100vw",
        height: isTeaser ? "600px" : "100vh",
        minHeight: isTeaser ? "600px" : "800px",
        maxHeight: isTeaser ? "600px" : "none",
        position: "relative",
        backgroundColor: "#000",
        borderRadius: isTeaser ? "8px" : "0",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        margin: "0 auto",
      }}
    >
      {/* Scoped WASM styles - no global CSS interference */}
      <style jsx>{`
        .wasm-threat-simulator-container {
          isolation: isolate;
          contain: layout style paint;
          position: relative;
          z-index: 1;
        }

        /* Scope all WASM styles to this container only */
        .wasm-threat-simulator-container * {
          box-sizing: border-box;
          font-family: "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell",
            "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
          background: #0a0e1a;
          color: #e0e0e0;
          overflow: hidden;
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
        }

        /* Hide overlays in teaser mode for cleaner presentation */
        ${isTeaser
          ? `
          .wasm-threat-simulator-container .warning-overlay {
            display: none !important;
          }
          .wasm-threat-simulator-container .achievement-notification {
            display: none !important;
          }
          .wasm-threat-simulator-container .game-over-overlay {
            display: none !important;
          }
        `
          : ""}
      `}</style>

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

      {/* Mount point for the Leptos WASM app - uses unique ID to prevent conflicts */}
      <div
        id={uniqueMountId}
        style={{
          width: "100%",
          height: "100%",
          display: wasmInitialized ? "block" : "none",
          flex: 1,
          position: "relative",
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
