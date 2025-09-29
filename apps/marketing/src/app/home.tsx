"use client";
import React, { useEffect, useState } from "react";

import { StickyHeader } from "@/components/StickyHeader";
import { Footer } from "../components/Footer";
import { Navigation } from "../components/Navigation";
import { CapabilitiesSection } from "../components/sections/CapabilitiesSection";
import { ContactSection } from "../components/sections/ContactSection";
import { CredibilitySection } from "../components/sections/CredibilitySection";
import { HeroSection } from "../components/sections/HeroSection";
import { MarketIntelligenceSection } from "../components/sections/MarketIntelligenceSection";
import { usePerformanceOptimizations } from "../hooks/usePerformanceOptimizations";

export default function HomePage(): React.ReactElement {
  const docsUrl = process.env.NEXT_PUBLIC_DOCS_URL || "";
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
      <MarketIntelligenceSection />
      <CapabilitiesSection />
      <CredibilitySection />
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
                name: "What is Level-0 autonomous architecture in counter-drone systems?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Level-0 autonomous architecture enables complete edge operation without communications dependency. Phoenix Rooivalk achieves &lt;2ms response time vs 2-5 seconds for competitors, with Byzantine fault-tolerant consensus for resilience in contested environments.",
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
                  text: "The counter-drone market is $2.3-4.5B currently, growing to $9-26B by 2030. Phoenix Rooivalk's 100x performance improvement and Level-0 autonomous capabilities position it to capture significant market share in this rapidly expanding sector.",
                },
              },
              {
                "@type": "Question",
                name: "How does Phoenix Rooivalk compare to Anduril, Fortem, and DroneShield?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Phoenix Rooivalk offers &lt;2ms latency vs Anduril's 2-5 seconds, defeats RF-silent drones that Fortem cannot detect, and provides complete autonomous operation unlike DroneShield's RF-dependent systems. Our Level-0 architecture provides 100x performance improvement over all competitors.",
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
