"use client";
import React, { useEffect, useState } from "react";

import { HeroSection } from "../components/sections/HeroSection";
import { MetricsSection } from "../components/sections/MetricsSection";
import { UkraineChallengeSection } from "../components/sections/UkraineChallengeSection";
import { CapabilitiesSection } from "../components/sections/CapabilitiesSection";
import { AIBenefitsSection } from "../components/sections/AIBenefitsSection";
import { WhitepaperSection } from "../components/sections/WhitepaperSection";
import { ContactSection } from "../components/sections/ContactSection";
import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import { StickyHeader } from "@/components/StickyHeader";
import { ExitIntentModal } from "@/components/ExitIntentModal";
import { QuickActionsWidget } from "@/components/QuickActionsWidget";
import { downloadWhitepaper } from "@/utils/downloadWhitepaper";
import { usePerformanceOptimizations } from "../hooks/usePerformanceOptimizations";

export default function HomePage(): React.ReactElement {
  const docsUrl = process.env.NEXT_PUBLIC_DOCS_URL || "";
  const [showStickyHeader, setShowStickyHeader] = useState(false);

  // Apply performance optimizations
  usePerformanceOptimizations();

  const quickActions = [
    {
      icon: "📋",
      label: "Technical Specs",
      action: () =>
        (window.location.href =
          "mailto:smit.jurie@gmail.com?subject=Phoenix%20Rooivalk%20-%20Technical%20Specifications%20Request"),
    },
    {
      icon: "💰",
      label: "Pricing & ROI",
      action: () =>
        (window.location.href =
          "mailto:smit.jurie@gmail.com?subject=Phoenix%20Rooivalk%20-%20Pricing%20and%20ROI%20Information"),
    },
    {
      icon: "🎯",
      label: "Live Demo",
      action: () =>
        (window.location.href =
          "mailto:smit.jurie@gmail.com?subject=Phoenix%20Rooivalk%20-%20Live%20Demonstration%20Request"),
    },
    {
      icon: "📄",
      label: "Whitepaper",
      action: downloadWhitepaper,
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyHeader(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
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
      <ExitIntentModal docsUrl={docsUrl} />
      <QuickActionsWidget actions={quickActions} />

      {/* Navigation */}
      <Navigation />

      {/* Main Content Sections */}
      <HeroSection />
      <MetricsSection />
      <UkraineChallengeSection />
      <CapabilitiesSection />
      <AIBenefitsSection />
      <WhitepaperSection />
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
                name: "How does Phoenix Rooivalk address the 2027 autonomous warfare deadline?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Phoenix Rooivalk is ready for deployment today, providing an 18-month advantage over the 2027 autonomous warfare deadline. While others race to build offensive swarms, we've solved the defensive challenge with multi-sensor fusion, blockchain coordination, and EW-resistant architecture.",
                },
              },
              {
                "@type": "Question",
                name: "How does Phoenix Rooivalk eliminate false positives in AI targeting?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Phoenix Rooivalk uses multi-sensor fusion combining RF, acoustic, and optical sensors with AI classification to prevent environmental confusion. This eliminates the 'puddles mistaken for tanks' problem plaguing current AI drone systems with 95%+ hit rates vs 60-70% for competitors.",
                },
              },
              {
                "@type": "Question",
                name: "How does Phoenix Rooivalk resist electronic warfare attacks?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Phoenix Rooivalk uses blockchain-anchored coordination on Solana and EtherLink networks, creating tamper-proof swarm communication that defeats electronic warfare jamming. Unlike traditional systems vulnerable to EW attacks, our architecture maintains coordination even under heavy jamming.",
                },
              },
              {
                "@type": "Question",
                name: "Can Phoenix Rooivalk coordinate swarm defenses like Russia's group attacks?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes, Phoenix Rooivalk's blockchain architecture enables coordination of hundreds of defensive units simultaneously. While Russia's drones coordinate in groups of six, our system scales to coordinate entire defensive networks with sub-second response times and cryptographic security.",
                },
              },
              {
                "@type": "Question",
                name: "What makes Phoenix Rooivalk superior to $150 per drone AI systems?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Phoenix Rooivalk offers complete system integration at $0.00025 per transaction vs $150+ per drone for basic AI targeting. Our system includes multi-spectrum countermeasures (kinetic, EW, laser), blockchain coordination, and 95%+ reliability compared to declining hit rates of current systems.",
                },
              },
            ],
          }),
        }}
      />
    </main>
  );
}
