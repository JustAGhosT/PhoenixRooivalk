"use client";
import React, { useEffect } from 'react';
import Link from 'next/link';
import { HeroSection } from '../components/sections/HeroSection';
import { MetricsSection } from '../components/sections/MetricsSection';
import { Button } from '../components/ui/Button';
import { usePerformanceOptimizations } from '../hooks/usePerformanceOptimizations';
import { downloadWhitepaper } from '../utils/downloadWhitepaper';

export default function HomePage(): React.ReactElement {
  const docsUrl = process.env.NEXT_PUBLIC_DOCS_URL || '';
  
  // Apply performance optimizations
  usePerformanceOptimizations();

  useEffect(() => {
    // Scroll reveal animation
    const reveals = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
    const revealOnScroll = () => {
      const windowHeight = window.innerHeight;
      const elementVisible = 150;
      reveals.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < windowHeight - elementVisible) {
          el.classList.add('active');
        }
      });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();

    // Sticky header CTA
    const stickyHeader = document.createElement('div');
    stickyHeader.className = 'fixed top-0 left-0 right-0 z-50 bg-[rgba(10,14,26,0.95)] backdrop-blur border-b border-[rgba(0,255,136,0.2)] transform -translate-y-full transition-transform duration-300';
    stickyHeader.innerHTML = `
      <div class="max-w-[1400px] mx-auto px-6 py-3 flex items-center justify-between">
        <div class="text-sm text-[var(--gray)]">
          <span class="text-[var(--primary)] font-semibold">Phoenix Rooivalk</span> - Counter-UAS Defense System
        </div>
        <a href="#contact" class="bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] text-[var(--dark)] px-4 py-2 rounded font-bold text-sm hover:-translate-y-0.5 transition">
          Schedule Demo
        </a>
      </div>
    `;
    document.body.appendChild(stickyHeader);

    const showStickyHeader = () => {
      if (window.scrollY > 100) {
        stickyHeader.style.transform = 'translateY(0)';
      } else {
        stickyHeader.style.transform = 'translateY(-100%)';
      }
    };
    window.addEventListener('scroll', showStickyHeader);

    // Exit intent popup
    const exitIntentPopup = document.createElement('div');
    exitIntentPopup.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 opacity-0 pointer-events-none transition-opacity duration-300';
    exitIntentPopup.innerHTML = `
      <div class="bg-[var(--darker)] p-8 rounded-xl border border-[var(--primary)] max-w-md mx-4 text-center">
        <h3 class="text-2xl font-bold text-white mb-4">Wait! Get Our Technical Whitepaper</h3>
        <p class="text-[var(--gray)] mb-6">Download our comprehensive technical documentation before you leave.</p>
        <div class="flex gap-4 justify-center">
          <a href="${docsUrl}" class="bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] text-[var(--dark)] px-6 py-3 rounded font-bold hover:-translate-y-0.5 transition">
            Download Now
          </a>
          <button onclick="this.parentElement.parentElement.parentElement.style.opacity='0'; this.parentElement.parentElement.parentElement.style.pointerEvents='none';" class="border border-[var(--primary)] text-[var(--primary)] px-6 py-3 rounded font-bold hover:bg-[var(--primary)] hover:text-[var(--dark)] transition">
            Maybe Later
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(exitIntentPopup);

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        exitIntentPopup.style.opacity = '1';
        exitIntentPopup.style.pointerEvents = 'auto';
      }
    };
    document.addEventListener('mouseleave', handleMouseLeave);

    // Chat widget - smaller version
    const chatWidget = document.createElement('div');
    chatWidget.className = 'fixed bottom-6 right-6 z-50';
    chatWidget.innerHTML = `
      <div class="bg-[var(--darker)] border border-[var(--primary)] rounded-lg p-3 shadow-2xl max-w-xs">
        <div class="text-[var(--primary)] font-bold mb-2 text-sm">Quick Actions</div>
        <div class="space-y-1">
          <button class="w-full text-left text-xs text-white hover:text-[var(--primary)] transition py-1" data-action="0">📋 Technical Specs</button>
          <button class="w-full text-left text-xs text-white hover:text-[var(--primary)] transition py-1" data-action="1">💰 Pricing & ROI</button>
          <button class="w-full text-left text-xs text-white hover:text-[var(--primary)] transition py-1" data-action="2">🎯 Live Demo</button>
          <button class="w-full text-left text-xs text-white hover:text-[var(--primary)] transition py-1" data-action="3">📄 Whitepaper</button>
        </div>
      </div>
    `;
    document.body.appendChild(chatWidget);

    // Chat widget functionality
    chatWidget.querySelectorAll('button[data-action]').forEach((button, index) => {
      button.addEventListener('click', () => {
        const actions = [
          () => window.location.href = 'mailto:smit.jurie@gmail.com?subject=Phoenix%20Rooivalk%20-%20Technical%20Specifications%20Request',
          () => window.location.href = 'mailto:smit.jurie@gmail.com?subject=Phoenix%20Rooivalk%20-%20Pricing%20and%20ROI%20Information',
          () => window.location.href = 'mailto:smit.jurie@gmail.com?subject=Phoenix%20Rooivalk%20-%20Live%20Demonstration%20Request',
          () => downloadWhitepaper()
        ];
        actions[index]();
      });
    });

    return () => {
      window.removeEventListener('scroll', revealOnScroll);
      window.removeEventListener('scroll', showStickyHeader);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (stickyHeader.parentNode) {
        stickyHeader.parentNode.removeChild(stickyHeader);
      }
      if (exitIntentPopup.parentNode) {
        exitIntentPopup.parentNode.removeChild(exitIntentPopup);
      }
      if (chatWidget.parentNode) {
        chatWidget.parentNode.removeChild(chatWidget);
      }
    };
  }, [docsUrl]);

  return (
    <main className="relative overflow-hidden bg-[var(--darker)] text-white">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom,_#1b2735_0%,_#090a0f_100%)]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,136,0.03)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(0,255,136,0.03)_1px,_transparent_1px)] bg-[length:50px_50px] animate-gridMove" />
      </div>

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-[rgba(10,14,26,0.95)] backdrop-blur px-6 py-4">
        <div className="mx-auto max-w-[1400px] flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)]">
            Phoenix Rooivalk
          </Link>
          <ul className="hidden md:flex gap-6 text-[var(--gray)]">
            <li><Link href="/technical" className="hover:text-[var(--primary)]">Technical</Link></li>
            <li><Link href="/financial" className="hover:text-[var(--primary)]">Financial</Link></li>
            <li><Link href="/compliance" className="hover:text-[var(--primary)]">Compliance</Link></li>
            <li><a href="#contact" className="hover:text-[var(--primary)]">Contact</a></li>
          </ul>
          <Button href="#contact" size="sm">
            Request Demo
          </Button>
        </div>
      </nav>

      <HeroSection />
      <MetricsSection />

      {/* Ukraine Warfare Challenge Section */}
      <section className="px-[5%] py-16 bg-[linear-gradient(180deg,rgba(255,0,0,0.05),rgba(255,136,0,0.05))]" id="ukraine-challenge">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center reveal mb-12">
            <div className="inline-block bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold mb-4">
              URGENT: 18-Month Deadline
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              The 2027 Autonomous Warfare Race
            </h2>
            <p className="text-[var(--gray)] max-w-3xl mx-auto text-lg">
              Ukraine faces an existential challenge: outpace Russia in autonomous warfare by 2027 or lose their technological advantage. 
              Current AI drones fail 30-40% of the time, confusing trees for tanks and struggling against electronic warfare.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 reveal">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white mb-4">Current Problems</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-[rgba(255,0,0,0.1)] border border-red-500/30 rounded-lg">
                  <span className="text-red-400 text-2xl">❌</span>
                  <div>
                    <div className="font-bold text-red-400">False Positives</div>
                    <div className="text-sm text-gray-300">"Puddles get mistaken for tanks, trees confuse targeting"</div>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-[rgba(255,0,0,0.1)] border border-red-500/30 rounded-lg">
                  <span className="text-red-400 text-2xl">📡</span>
                  <div>
                    <div className="font-bold text-red-400">EW Vulnerability</div>
                    <div className="text-sm text-gray-300">"Hit rates declining as electronic warfare evolves faster"</div>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-[rgba(255,0,0,0.1)] border border-red-500/30 rounded-lg">
                  <span className="text-red-400 text-2xl">🐝</span>
                  <div>
                    <div className="font-bold text-red-400">Swarm Coordination</div>
                    <div className="text-sm text-gray-300">"Russia's drones coordinate in groups of six, Ukraine's hunt alone"</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white mb-4">Phoenix Rooivalk Solutions</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-[rgba(0,255,136,0.1)] border border-[var(--primary)]/30 rounded-lg">
                  <span className="text-[var(--primary)] text-2xl">✅</span>
                  <div>
                    <div className="font-bold text-[var(--primary)]">Multi-Sensor Fusion</div>
                    <div className="text-sm text-gray-300">RF + acoustic + optical sensors eliminate environmental confusion</div>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-[rgba(0,255,136,0.1)] border border-[var(--primary)]/30 rounded-lg">
                  <span className="text-[var(--primary)] text-2xl">🔗</span>
                  <div>
                    <div className="font-bold text-[var(--primary)]">Blockchain Coordination</div>
                    <div className="text-sm text-gray-300">Tamper-proof swarm coordination resistant to EW attacks</div>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-[rgba(0,255,136,0.1)] border border-[var(--primary)]/30 rounded-lg">
                  <span className="text-[var(--primary)] text-2xl">⚡</span>
                  <div>
                    <div className="font-bold text-[var(--primary)]">Ready Today</div>
                    <div className="text-sm text-gray-300">Deployable now, 18 months ahead of the 2027 deadline</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12 reveal">
            <div className="bg-[rgba(0,255,136,0.1)] border border-[var(--primary)]/30 rounded-xl p-8 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">The Stakes</h3>
              <p className="text-[var(--gray)] text-lg mb-6">
                "Ukraine's entire war strategy hinges on this race. They've survived three years by being smarter, not stronger. 
                If they lose the AI warfare competition, they lose their main advantage over Russia's superior numbers."
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button href="#contact" size="lg">
                  Schedule Urgent Demo
                </Button>
                <Button href="mailto:smit.jurie@gmail.com?subject=Phoenix%20Rooivalk%20-%20Ukraine%20Defense%20Inquiry" variant="outline" size="lg">
                  Defense Partnership Inquiry
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Capabilities */}
      <section className="px-[5%] py-16" id="capabilities">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center reveal mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Core Capabilities</h2>
            <p className="text-[var(--gray)] max-w-2xl mx-auto">Advanced counter-UAS technology with modular deployment options</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 reveal">
            {[
              {
                icon: '🎯',
                title: 'Eliminates False Positives',
                description: 'Multi-sensor fusion (RF + acoustic + optical) with AI classification prevents "puddles mistaken for tanks" failures plaguing current systems.'
              },
              {
                icon: '🔗',
                title: 'EW-Resistant Coordination',
                description: 'Blockchain-anchored swarm coordination defeats electronic warfare attacks that cripple traditional drone communications.'
              },
              {
                icon: '⚡',
                title: 'Immediate Deployment',
                description: 'Ready for field deployment today, providing 18-month advantage over competitors racing toward 2027 deadline.'
              }
            ].map((capability, index) => (
              <div key={index} className="text-center p-6 rounded-xl bg-[rgba(0,136,255,0.05)] border border-[rgba(0,136,255,0.2)] hover:border-[rgba(0,136,255,0.4)] transition-all hover:-translate-y-1">
                <div className="text-4xl mb-4">{capability.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{capability.title}</h3>
                <p className="text-[var(--gray)]">{capability.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="px-[5%] py-16 bg-[linear-gradient(180deg,rgba(0,136,255,0.05),transparent)]" id="contact">
        <div className="max-w-[1400px] mx-auto text-center reveal">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Deploy?</h2>
          <p className="text-[var(--gray)] mb-8 max-w-2xl mx-auto">
            Schedule a technical demonstration or request detailed specifications for your defense requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="mailto:smit.jurie@gmail.com?subject=Phoenix%20Rooivalk%20-%20Technical%20Demo" size="lg">
              Schedule Technical Demo
            </Button>
            <Button onClick={downloadWhitepaper} variant="outline" size="lg">
              Download Whitepaper
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-[5%] py-8 text-center text-[var(--gray)] border-t border-[rgba(0,255,136,0.2)]">
        <div className="max-w-[1400px] mx-auto">
          <p>© 2025 Phoenix Rooivalk. All rights reserved. | ITAR Compliant | ISO 27001 Certified</p>
          <div className="mt-4">
            <Link href="/technical" className="text-[var(--primary)] hover:underline mr-6">Technical</Link>
            <Link href="/financial" className="text-[var(--primary)] hover:underline mr-6">Financial</Link>
            <Link href="/compliance" className="text-[var(--primary)] hover:underline">Compliance</Link>
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
            "mainEntity": [
              {
                "@type": "Question",
                "name": "How does Phoenix Rooivalk address the 2027 autonomous warfare deadline?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Phoenix Rooivalk is ready for deployment today, providing an 18-month advantage over the 2027 autonomous warfare deadline. While others race to build offensive swarms, we've solved the defensive challenge with multi-sensor fusion, blockchain coordination, and EW-resistant architecture."
                }
              },
              {
                "@type": "Question", 
                "name": "How does Phoenix Rooivalk eliminate false positives in AI targeting?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Phoenix Rooivalk uses multi-sensor fusion combining RF, acoustic, and optical sensors with AI classification to prevent environmental confusion. This eliminates the 'puddles mistaken for tanks' problem plaguing current AI drone systems with 95%+ hit rates vs 60-70% for competitors."
                }
              },
              {
                "@type": "Question",
                "name": "How does Phoenix Rooivalk resist electronic warfare attacks?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Phoenix Rooivalk uses blockchain-anchored coordination on Solana and EtherLink networks, creating tamper-proof swarm communication that defeats electronic warfare jamming. Unlike traditional systems vulnerable to EW attacks, our architecture maintains coordination even under heavy jamming."
                }
              },
              {
                "@type": "Question",
                "name": "Can Phoenix Rooivalk coordinate swarm defenses like Russia's group attacks?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, Phoenix Rooivalk's blockchain architecture enables coordination of hundreds of defensive units simultaneously. While Russia's drones coordinate in groups of six, our system scales to coordinate entire defensive networks with sub-second response times and cryptographic security."
                }
              },
              {
                "@type": "Question",
                "name": "What makes Phoenix Rooivalk superior to $150 per drone AI systems?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Phoenix Rooivalk offers complete system integration at $0.00025 per transaction vs $150+ per drone for basic AI targeting. Our system includes multi-spectrum countermeasures (kinetic, EW, laser), blockchain coordination, and 95%+ reliability compared to declining hit rates of current systems."
                }
              }
            ]
          })
        }}
      />
    </main>
  );
}
