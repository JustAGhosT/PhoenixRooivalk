"use client";
import * as React from "react";
import { useEffect, useState } from "react";

import { StickyHeader } from "../components/StickyHeader";
import { Footer } from "../components/Footer";
import { Navigation } from "../components/Navigation";
import { CapabilitiesSection } from "../components/sections/CapabilitiesSection";
import { ContactSection } from "../components/sections/ContactSection";
import { HeroSection } from "../components/sections/HeroSection";
import { InteractiveElementsSection } from "../components/sections/InteractiveElementsSection";
import { TimelineSection } from "../components/sections/TimelineSection";
import { usePerformanceOptimizations } from "../hooks/usePerformanceOptimizations";

export default function HomePage(): React.ReactElement {
  const [showStickyHeader, setShowStickyHeader] = useState(false);

  // Apply performance optimizations
  usePerformanceOptimizations();

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyHeader(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="relative overflow-hidden bg-[var(--darker)] text-white">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom,_#1b2735_0%,_#090a0f_100%)]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,136,0.03)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(0,255,136,0.03)_1px,_transparent_1px)] bg-[length:50px_50px] animate-gridMove" />
      </div>

      {/* Global Components */}
      <StickyHeader isVisible={showStickyHeader} />

      {/* Navigation */}
      <Navigation />

      {/* Main Content Sections */}
      <HeroSection />
      <InteractiveElementsSection />
      <TimelineSection />
      <CapabilitiesSection />
      <ContactSection />

      {/* Footer */}
      <Footer />

      {/* FAQ Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "How does Phoenix Rooivalk work when all communications are jammed?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Phoenix Rooivalk uses edge autonomy - like a flock of birds that coordinate without radios. Defense nodes communicate via light signals and sound pulses across 500m-1km ranges, making decisions in 120-195ms even under complete jamming.",
                },
              },
              {
                "@type": "Question",
                name: "How does Phoenix Rooivalk detect RF-silent autonomous drones?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Phoenix Rooivalk uses multi-sensor fusion combining radar, optical, acoustic, and infrared sensors to detect RF-silent threats that 64% of current market systems cannot handle. This addresses the fastest-growing threat vector in the $26B counter-drone market.",
                },
              },
              {
                "@type": "Question",
                name: "What is the market opportunity for Phoenix Rooivalk?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "The counter-drone market is $2.3-4.5B currently, growing to $9-26B by 2030. Phoenix Rooivalk's Level-0 autonomous capabilities and multi-sensor fusion approach are designed to address key market gaps in this rapidly expanding sector.",
                },
              },
              {
                "@type": "Question",
                name: "How does Phoenix Rooivalk perform compared to typical market offerings?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Designed for ultra-low latency edge operation and RF-silent detection via multi-sensor fusion. Performance claims are based on internal benchmarks under defined test conditions and may vary by deployment. The system targets sub-200ms response times and autonomous operation without network connectivity.",
                },
              },
              {
                "@type": "Question",
                name: "What is Phoenix Rooivalk's SBIR strategy for market entry?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Phoenix Rooivalk is applying for Air Force SBIR Phase I ($350K) following Anduril's proven path to $14B valuation. We're targeting CMMC 2.0 Level 2 certification and partnerships with established defense contractors for market credibility.",
                },
              },
            ],
          }),
        }}
      />
    </main>
  );
}
