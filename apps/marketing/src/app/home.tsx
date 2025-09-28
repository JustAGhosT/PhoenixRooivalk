"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import { HeroSection } from "../components/sections/HeroSection";
import { MetricsSection } from "../components/sections/MetricsSection";
import { Button } from "@/components/Button";
import { ExitIntentModal } from "@/components/ExitIntentModal";
import { QuickActionsWidget } from "@/components/QuickActionsWidget";
import { RevealSection } from "@/components/RevealSection";
import { StickyHeader } from "@/components/StickyHeader";
import { usePerformanceOptimizations } from "../hooks/usePerformanceOptimizations";
import { downloadWhitepaper } from "@/utils/downloadWhitepaper";

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

      {/* Sticky Header */}
      <StickyHeader isVisible={showStickyHeader} />

      {/* Exit Intent Modal */}
      <ExitIntentModal docsUrl={docsUrl} />

      {/* Quick Actions Widget */}
      <QuickActionsWidget actions={quickActions} />

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-[rgba(10,14,26,0.95)] backdrop-blur px-6 py-4">
        <div className="mx-auto max-w-[1400px] flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)]"
          >
            Phoenix Rooivalk
          </Link>
          <ul className="hidden md:flex gap-6 text-[var(--gray)]">
            <li>
              <Link href="/interactive-demo" className="hover:text-[var(--primary)]">
                Interactive Demo
              </Link>
            </li>
            <li>
              <Link href="/technical" className="hover:text-[var(--primary)]">
                Technical
              </Link>
            </li>
            <li>
              <Link href="/financial" className="hover:text-[var(--primary)]">
                Financial
              </Link>
            </li>
            <li>
              <Link href="/compliance" className="hover:text-[var(--primary)]">
                Compliance
              </Link>
            </li>
            <li>
              <a href="#metrics" className="hover:text-[var(--primary)]">
                Metrics
              </a>
            </li>
            <li>
              <a href="#ukraine-challenge" className="hover:text-[var(--primary)]">
                Ukraine Challenge
              </a>
            </li>
            <li>
              <a href="#capabilities" className="hover:text-[var(--primary)]">
                Capabilities
              </a>
            </li>
            <li>
              <a href="#ai-benefits" className="hover:text-[var(--primary)]">
                AI Benefits
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-[var(--primary)]">
                Contact
              </a>
            </li>
          </ul>
          <Button href="#contact" size="sm">
            Request Demo
          </Button>
        </div>
      </nav>

      <HeroSection />
      <MetricsSection />

      {/* Ukraine Warfare Challenge Section */}
      <section
        className="px-[5%] py-16 bg-[linear-gradient(180deg,rgba(255,0,0,0.05),rgba(255,136,0,0.05))]"
        id="ukraine-challenge"
      >
        <div className="max-w-[1400px] mx-auto">
          <RevealSection className="text-center mb-12">
            <div className="inline-block bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold mb-4">
              URGENT: 18-Month Deadline
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              The 2027 Autonomous Warfare Race
            </h2>
            <p className="text-[var(--gray)] max-w-3xl mx-auto text-lg">
              Ukraine faces an existential challenge: outpace Russia in
              autonomous warfare by 2027 or lose their technological advantage.
              Current AI drones fail 30-40% of the time, confusing trees for
              tanks and struggling against electronic warfare.
            </p>
          </RevealSection>

          <RevealSection className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white mb-4">
                Current Problems
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-[rgba(255,0,0,0.1)] border border-red-500/30 rounded-lg">
                  <span className="text-red-400 text-2xl">❌</span>
                  <div>
                    <div className="font-bold text-red-400">
                      False Positives
                    </div>
                    <div className="text-sm text-gray-300">
                      "Puddles get mistaken for tanks, trees confuse targeting"
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-[rgba(255,0,0,0.1)] border border-red-500/30 rounded-lg">
                  <span className="text-red-400 text-2xl">📡</span>
                  <div>
                    <div className="font-bold text-red-400">
                      EW Vulnerability
                    </div>
                    <div className="text-sm text-gray-300">
                      "Hit rates declining as electronic warfare evolves faster"
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-[rgba(255,0,0,0.1)] border border-red-500/30 rounded-lg">
                  <span className="text-red-400 text-2xl">🐝</span>
                  <div>
                    <div className="font-bold text-red-400">
                      Swarm Coordination
                    </div>
                    <div className="text-sm text-gray-300">
                      "Russia's drones coordinate in groups of six, Ukraine's
                      hunt alone"
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white mb-4">
                Phoenix Rooivalk Solutions
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-[rgba(0,255,136,0.1)] border border-[var(--primary)]/30 rounded-lg">
                  <span className="text-[var(--primary)] text-2xl">✅</span>
                  <div>
                    <div className="font-bold text-[var(--primary)]">
                      Multi-Sensor Fusion
                    </div>
                    <div className="text-sm text-gray-300">
                      RF + acoustic + optical sensors eliminate environmental
                      confusion
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-[rgba(0,255,136,0.1)] border border-[var(--primary)]/30 rounded-lg">
                  <span className="text-[var(--primary)] text-2xl">🔗</span>
                  <div>
                    <div className="font-bold text-[var(--primary)]">
                      Blockchain Coordination
                    </div>
                    <div className="text-sm text-gray-300">
                      Tamper-proof swarm coordination resistant to EW attacks
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-[rgba(0,255,136,0.1)] border border-[var(--primary)]/30 rounded-lg">
                  <span className="text-[var(--primary)] text-2xl">⚡</span>
                  <div>
                    <div className="font-bold text-[var(--primary)]">
                      Ready Today
                    </div>
                    <div className="text-sm text-gray-300">
                      Deployable now, 18 months ahead of the 2027 deadline
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </RevealSection>

          <RevealSection className="text-center mt-12">
            <div className="bg-[rgba(0,255,136,0.1)] border border-[var(--primary)]/30 rounded-xl p-8 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">The Stakes</h3>
              <p className="text-[var(--gray)] text-lg mb-6">
                "Ukraine's entire war strategy hinges on this race. They've
                survived three years by being smarter, not stronger. If they
                lose the AI warfare competition, they lose their main advantage
                over Russia's superior numbers."
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button href="#contact" size="lg">
                  Schedule Urgent Demo
                </Button>
                <Button
                  href="mailto:smit.jurie@gmail.com?subject=Phoenix%20Rooivalk%20-%20Ukraine%20Defense%20Inquiry"
                  variant="outline"
                  size="lg"
                >
                  Defense Partnership Inquiry
                </Button>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* Core Capabilities */}
      <section className="px-[5%] py-16" id="capabilities">
        <div className="max-w-[1400px] mx-auto">
          <RevealSection className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Core Capabilities
            </h2>
            <p className="text-[var(--gray)] max-w-2xl mx-auto">
              Advanced counter-UAS technology with modular deployment options
            </p>
          </RevealSection>
          <RevealSection className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🎯",
                title: "Eliminates False Positives",
                description:
                  'Multi-sensor fusion (RF + acoustic + optical) with AI classification prevents "puddles mistaken for tanks" failures plaguing current systems.',
              },
              {
                icon: "🔗",
                title: "EW-Resistant Coordination",
                description:
                  "Blockchain-anchored swarm coordination defeats electronic warfare attacks that cripple traditional drone communications.",
              },
              {
                icon: "⚡",
                title: "Immediate Deployment",
                description:
                  "Ready for field deployment today, providing 18-month advantage over competitors racing toward 2027 deadline.",
              },
            ].map((capability, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-xl bg-[rgba(0,136,255,0.05)] border border-[rgba(0,136,255,0.2)] hover:border-[rgba(0,136,255,0.4)] transition-all hover:-translate-y-1"
              >
                <div className="text-4xl mb-4">{capability.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {capability.title}
                </h3>
                <p className="text-[var(--gray)]">{capability.description}</p>
              </div>
            ))}
          </RevealSection>
        </div>
      </section>

      {/* AI Benefits Section */}
      <section
        className="px-[5%] py-16 bg-[linear-gradient(180deg,rgba(0,255,136,0.05),rgba(0,136,255,0.05))]"
        id="ai-benefits"
      >
        <div className="max-w-[1400px] mx-auto">
          <RevealSection className="text-center mb-12">
            <div className="inline-block bg-[var(--primary)] text-black px-4 py-2 rounded-full text-sm font-bold mb-4">
              AI + BLOCKCHAIN REVOLUTION
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Revolutionary AI + Blockchain Performance
            </h2>
            <p className="text-[var(--gray)] max-w-3xl mx-auto text-lg">
              PhoenixRooivalk combines cutting-edge AI with military-grade
              blockchain technology to deliver unprecedented performance: 99.7%
              accuracy with 99.3% data integrity protection.
            </p>
          </RevealSection>

          <RevealSection className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white mb-6">
                AI + Blockchain Performance
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[rgba(0,255,136,0.1)] border border-[var(--primary)]/30 rounded-lg">
                  <div>
                    <div className="font-bold text-[var(--primary)]">
                      AI Detection Accuracy
                    </div>
                    <div className="text-sm text-gray-300">
                      vs 60-70% industry standard
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-[var(--primary)]">
                    99.7%
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-[rgba(0,255,136,0.1)] border border-[var(--primary)]/30 rounded-lg">
                  <div>
                    <div className="font-bold text-[var(--primary)]">
                      Data Integrity
                    </div>
                    <div className="text-sm text-gray-300">
                      vs 85% traditional systems
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-[var(--primary)]">
                    99.3%
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-[rgba(0,255,136,0.1)] border border-[var(--primary)]/30 rounded-lg">
                  <div>
                    <div className="font-bold text-[var(--primary)]">
                      Response Time
                    </div>
                    <div className="text-sm text-gray-300">
                      vs 1-3 seconds industry standard
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-[var(--primary)]">
                    &lt; 200ms
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-[rgba(0,255,136,0.1)] border border-[var(--primary)]/30 rounded-lg">
                  <div>
                    <div className="font-bold text-[var(--primary)]">
                      Authentication Latency
                    </div>
                    <div className="text-sm text-gray-300">
                      vs 50-100ms traditional
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-[var(--primary)]">
                    &lt; 2ms
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white mb-6">
                AI + Blockchain Capabilities
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-[rgba(0,136,255,0.1)] border border-blue-500/30 rounded-lg">
                  <span className="text-blue-400 text-2xl">🧠</span>
                  <div>
                    <div className="font-bold text-blue-400">
                      Multi-Modal AI Intelligence
                    </div>
                    <div className="text-sm text-gray-300">
                      Processes RF, visual, acoustic, and radar data with
                      blockchain-verified results for comprehensive threat
                      analysis
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-[rgba(0,136,255,0.1)] border border-blue-500/30 rounded-lg">
                  <span className="text-blue-400 text-2xl">🔗</span>
                  <div>
                    <div className="font-bold text-blue-400">
                      Blockchain Security
                    </div>
                    <div className="text-sm text-gray-300">
                      99.3% data integrity protection with tamper-proof audit
                      trails and cryptographic identity management
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-[rgba(0,136,255,0.1)] border border-blue-500/30 rounded-lg">
                  <span className="text-blue-400 text-2xl">🔄</span>
                  <div>
                    <div className="font-bold text-blue-400">
                      Federated Learning + Blockchain
                    </div>
                    <div className="text-sm text-gray-300">
                      Distributed AI model training with blockchain consensus
                      while maintaining data privacy and model provenance
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-[rgba(0,136,255,0.1)] border border-blue-500/30 rounded-lg">
                  <span className="text-blue-400 text-2xl">🎯</span>
                  <div>
                    <div className="font-bold text-blue-400">
                      Explainable AI + Audit Trails
                    </div>
                    <div className="text-sm text-gray-300">
                      Transparent AI decision-making with immutable blockchain
                      audit trails for military accountability and regulatory
                      compliance
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-[rgba(0,136,255,0.1)] border border-blue-500/30 rounded-lg">
                  <span className="text-blue-400 text-2xl">⚡</span>
                  <div>
                    <div className="font-bold text-blue-400">
                      Autonomous Swarm Coordination
                    </div>
                    <div className="text-sm text-gray-300">
                      AI-powered swarm intelligence with blockchain consensus
                      for coordinated multi-drone operations in contested
                      environments
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </RevealSection>

          <RevealSection className="text-center mt-12">
            <div className="bg-[rgba(0,255,136,0.1)] border border-[var(--primary)]/30 rounded-xl p-8 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">
                18-Month AI + Blockchain Advantage
              </h3>
              <p className="text-[var(--gray)] text-lg mb-6">
                While competitors race to meet the 2027 autonomous warfare
                deadline, PhoenixRooivalk's integrated AI-blockchain system is
                ready for immediate deployment, providing a decisive
                technological advantage in the critical race for autonomous
                warfare dominance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button href="#contact" size="lg">
                  Request AI + Blockchain Demo
                </Button>
                <Button
                  href="mailto:smit.jurie@gmail.com?subject=Phoenix%20Rooivalk%20-%20AI%20%2B%20Blockchain%20Capabilities%20Inquiry"
                  variant="outline"
                  size="lg"
                >
                  Technical Brief
                </Button>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* Technical Whitepaper Download */}
      <section className="px-[5%] py-16 bg-[linear-gradient(180deg,rgba(0,255,136,0.1),rgba(0,136,255,0.1))]">
        <div className="max-w-[1400px] mx-auto text-center">
          <RevealSection>
            <div className="inline-block bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-black px-4 py-2 rounded-full text-sm font-bold mb-6">
              📋 COMPREHENSIVE TECHNICAL DOCUMENTATION
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Get the Complete Technical Whitepaper
            </h2>
            <p className="text-[var(--gray)] max-w-3xl mx-auto text-lg mb-8">
              Download our detailed technical documentation covering system architecture,
              security implementation, deployment configurations, and performance specifications.
            </p>

            {/* Whitepaper features */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 max-w-4xl mx-auto">
              <div className="bg-gray-800/50 p-4 rounded-lg border border-green-500/20">
                <div className="text-2xl mb-2">🏗️</div>
                <h3 className="text-green-400 font-semibold text-sm mb-1">System Architecture</h3>
                <p className="text-xs text-gray-300">Complete technical design and component integration</p>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg border border-blue-500/20">
                <div className="text-2xl mb-2">🔒</div>
                <h3 className="text-blue-400 font-semibold text-sm mb-1">Security Framework</h3>
                <p className="text-xs text-gray-300">Blockchain security and compliance standards</p>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg border border-purple-500/20">
                <div className="text-2xl mb-2">📊</div>
                <h3 className="text-purple-400 font-semibold text-sm mb-1">Performance Metrics</h3>
                <p className="text-xs text-gray-300">Detailed benchmarks and testing results</p>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg border border-yellow-500/20">
                <div className="text-2xl mb-2">🚀</div>
                <h3 className="text-yellow-400 font-semibold text-sm mb-1">Deployment Guide</h3>
                <p className="text-xs text-gray-300">Implementation and configuration instructions</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={downloadWhitepaper} size="lg" className="bg-green-600 hover:bg-green-700">
                📥 Download Technical Whitepaper
              </Button>
              <Button href="#contact" variant="outline" size="lg">
                Request Full Documentation
              </Button>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* Contact */}
      <section
        className="px-[5%] py-16 bg-[linear-gradient(180deg,rgba(0,136,255,0.05),transparent)]"
        id="contact"
      >
        <RevealSection className="max-w-[1400px] mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Deploy?
          </h2>
          <p className="text-[var(--gray)] mb-8 max-w-2xl mx-auto">
            Schedule a technical demonstration or request detailed
          </p>
          <div className="mt-8 flex gap-4 animate-fadeInUp [animation-delay:600ms]">
            <Button href="#contact" size="lg">
              Schedule Technical Demo
            </Button>
            <Button onClick={downloadWhitepaper} variant="outline" size="lg">
              Download Whitepaper
            </Button>
          </div>
        </RevealSection>
      </section>
      <footer className="px-[5%] py-8 text-center text-[var(--gray)] border-t border-[rgba(0,255,136,0.2)]">
        <div className="max-w-[1400px] mx-auto">
          <p>
            © 2025 Phoenix Rooivalk. All rights reserved. | ITAR Compliant |
            ISO 27001 Certified
          </p>
          <div className="mt-4">
            <Link
              href="/technical"
              className="text-[var(--primary)] hover:underline mr-6"
            >
              Technical
            </Link>
            <Link
              href="/financial"
              className="text-[var(--primary)] hover:underline mr-6"
            >
              Financial
            </Link>
            <Link
              href="/compliance"
              className="text-[var(--primary)] hover:underline"
            >
              Compliance
            </Link>
          </div>
        </div>
      </footer>

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
