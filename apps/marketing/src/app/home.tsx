"use client";
import * as React from "react";

import { Footer } from "../components/Footer";
import { Navigation } from "../components/Navigation";
import { ContactSection } from "../components/sections/ContactSection";
import { HeroSection } from "../components/sections/HeroSection";
import { InteractiveElementsSection } from "../components/sections/InteractiveElementsSection";
import { usePerformanceOptimizations } from "../hooks/usePerformanceOptimizations";
import styles from "./home.module.css";

export default function HomePage(): React.ReactElement {
  // Apply performance optimizations
  usePerformanceOptimizations();

  return (
    <main className={styles.main}>
      {/* Background */}
      <div className={styles.background}>
        <div className={styles.backgroundGrid} />
      </div>

      {/* Global Components */}

      {/* Navigation */}
      <Navigation />

      {/* Main Content Sections */}
      <HeroSection />
      <InteractiveElementsSection />
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
                  text: "The counter-drone market is $2.3-4.5B currently, growing to $9-26B by 2030. Phoenix Rooivalk's SAE Level 4 autonomous capabilities and multi-sensor fusion approach are designed to address key market gaps in this rapidly expanding sector.",
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
