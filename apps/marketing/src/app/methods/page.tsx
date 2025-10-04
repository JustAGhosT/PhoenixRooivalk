"use client";
import * as React from "react";
import { Footer } from "../../components/Footer";
import { Navigation } from "../../components/Navigation";
import { CounterDroneMethodsSection } from "../../components/sections/CounterDroneMethodsSection";
import { usePerformanceOptimizations } from "../../hooks/usePerformanceOptimizations";

export default function MethodsPage(): React.ReactElement {
  // Apply performance optimizations
  usePerformanceOptimizations();

  return (
    <main className="relative overflow-hidden bg-[var(--darker)] text-white">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom,_#1b2735_0%,_#090a0f_100%)]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,136,0.03)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(0,255,136,0.03)_1px,_transparent_1px)] bg-[length:50px_50px] animate-gridMove" />
      </div>

      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <div className="pt-20">
        <CounterDroneMethodsSection />
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
