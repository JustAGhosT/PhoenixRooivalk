"use client";
import React, { useEffect } from 'react';
import Link from 'next/link';

export default function HomePage(): React.ReactElement {
  const docsUrl = process.env.NEXT_PUBLIC_DOCS_URL || '';
  
  useEffect(() => {
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

    return () => {
      window.removeEventListener('scroll', revealOnScroll);
    };
  }, []);

  return (
    <main className="relative overflow-hidden bg-[var(--darker)] text-white">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom,_#1b2735_0%,_#090a0f_100%)]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,136,0.03)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(0,255,136,0.03)_1px,_transparent_1px)] bg-[length:50px_50px] animate-gridMove" />
      </div>

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-[rgba(10,14,26,0.95)] backdrop-blur px-6 py-4">
        <div className="mx-auto max-w-[1400px] flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)]">Phoenix Rooivalk</Link>
          <ul className="hidden md:flex gap-6 text-[var(--gray)]">
            <li><Link href="/technical" className="hover:text-[var(--primary)]">Technical</Link></li>
            <li><Link href="/financial" className="hover:text-[var(--primary)]">Financial</Link></li>
            <li><Link href="/compliance" className="hover:text-[var(--primary)]">Compliance</Link></li>
            <li><a href="#contact" className="hover:text-[var(--primary)]">Contact</a></li>
          </ul>
          <a href="#contact" className="inline-block rounded bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] px-4 py-2 font-bold text-[var(--dark)] shadow-glow hover:-translate-y-0.5 transition">Request Demo</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-[90vh] flex items-center px-[5%] py-12 relative" id="hero">
        <div className="mx-auto max-w-[1400px] grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="mb-4">
              <span className="inline-block bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-[var(--dark)] px-3 py-1 rounded-full text-sm font-bold">Real-Time Defense on Solana</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-br from-white to-[var(--primary)] animate-fadeInUp">
              Counter-UAS System
            </h1>
            <p className="mt-4 text-lg text-[var(--gray)] animate-fadeInUp [animation-delay:200ms]">
              Sub-second threat verification at $0.00025 per transaction. Modular design with 20-30% cost advantage over competitors.
            </p>
            <div className="mt-8 space-y-4 animate-fadeInUp [animation-delay:400ms]">
              <div className="flex items-center gap-4 text-sm">
                <span className="text-[var(--primary)]">✓</span>
                <span>Multi-sensor detection with AI classification</span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-[var(--primary)]">✓</span>
                <span>Blockchain evidence logging on Solana + EtherLink</span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-[var(--primary)]">✓</span>
                <span>ITAR compliant with ISO 27001 certification</span>
              </div>
            </div>
            <div className="mt-8 flex gap-4 animate-fadeInUp [animation-delay:600ms]">
              <a href="#contact" className="inline-block rounded bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] px-6 py-3 font-bold text-[var(--dark)] shadow-glow hover:-translate-y-0.5 transition">
                Schedule Technical Demo
              </a>
              <Link href="/financial" className="inline-block rounded border-2 border-[var(--primary)] px-6 py-3 font-bold text-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--dark)] transition">
                View Projections
              </Link>
            </div>
          </div>
          <div className="relative animate-float">
            <div className="h-[500px] w-full rounded-2xl bg-[linear-gradient(135deg,rgba(0,255,136,0.1),rgba(0,136,255,0.1))] flex items-center justify-center overflow-hidden relative">
              {/* Enhanced 3D-style drone interception visual */}
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Radar sweep */}
                <div className="absolute h-80 w-80 rounded-full border-2 border-[var(--primary)] opacity-20">
                  <div className="absolute top-1/2 left-1/2 h-0.5 w-full origin-left bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent animate-radar" />
                </div>
                {/* Detection zones */}
                <div className="absolute h-60 w-60 rounded-full border border-[var(--primary)] opacity-30" />
                <div className="absolute h-40 w-40 rounded-full border border-[var(--primary)] opacity-40" />
                
                {/* Central shield - much larger and prominent */}
                <div className="relative z-10 w-24 h-24 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-full flex items-center justify-center shadow-2xl">
                  <div className="text-4xl">🛡️</div>
                </div>
                
                {/* Threat indicators */}
                <div className="absolute top-16 right-16 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                  <div className="text-sm">🚁</div>
                </div>
                <div className="absolute bottom-20 left-12 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center animate-bounce">
                  <div className="text-xs">📡</div>
                </div>
                
                {/* Neutralization effect */}
                <div className="absolute top-16 right-16 w-12 h-12 border-2 border-[var(--primary)] rounded-full animate-ping opacity-75" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="px-[5%] py-16 bg-[linear-gradient(180deg,transparent,rgba(0,136,255,0.05))]" id="metrics">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center reveal mb-12">
            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)]">Proven Performance</h2>
            <p className="text-[var(--gray)] mt-2">Data-driven results from documented projections</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 reveal">
            {[
              ['ZAR 850K', 'Unit Price', 'Complete system cost'],
              ['Year 3', 'Break-Even', '50 units sold'],
              ['ZAR 170M', 'Year 5 Revenue', 'Projected growth'],
              ['20-30%', 'Cost Advantage', 'vs competitors'],
            ].map(([value, label, description]) => (
              <div key={label} className="text-center rounded-xl border border-[rgba(0,255,136,0.2)] bg-[rgba(15,23,42,0.8)] backdrop-blur p-6 hover:-translate-y-1 hover:shadow-glow transition">
                <div className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] mb-2">{value}</div>
                <div className="text-white font-semibold mb-1">{label}</div>
                <div className="text-[var(--gray)] text-sm">{description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Capabilities */}
      <section className="px-[5%] py-16" id="capabilities">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center reveal mb-12">
            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)]">Multi-Layered Defense</h2>
            <p className="text-[var(--gray)] mt-2">Comprehensive threat detection and neutralization</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 reveal">
            {[
              {
                icon: '📡',
                title: 'Detection',
                description: 'RF, radar, optical, acoustic, and infrared sensors with AI-powered threat classification',
                features: ['Multi-sensor fusion', 'AI classification', 'Behavioral analysis']
              },
              {
                icon: '⚡',
                title: 'Neutralization',
                description: 'RF jamming, GPS spoofing, and physical countermeasures for comprehensive threat response',
                features: ['Electronic warfare', 'Net entanglement', 'Kinetic interceptors']
              },
              {
                icon: '🔗',
                title: 'Evidence',
                description: 'Blockchain-anchored audit trails on Solana and EtherLink for military-grade integrity',
                features: ['Immutable logging', 'Multi-chain anchoring', 'Compliance ready']
              }
            ].map((capability) => (
              <div key={capability.title} className="rounded-xl border border-[rgba(0,255,136,0.2)] bg-[rgba(15,23,42,0.8)] backdrop-blur p-8 hover:-translate-y-1 transition">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-2xl mb-6">{capability.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{capability.title}</h3>
                <p className="text-[var(--gray)] mb-4">{capability.description}</p>
                <ul className="space-y-2">
                  {capability.features.map((feature) => (
                    <li key={feature} className="text-sm text-[var(--gray)] flex items-center">
                      <span className="text-[var(--primary)] mr-2">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="text-center mt-12 reveal">
            <Link href="/technical" className="inline-block rounded border-2 border-[var(--primary)] px-6 py-3 font-bold text-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--dark)] transition">
              Technical Specifications
            </Link>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="px-[5%] py-16 text-center bg-[linear-gradient(135deg,rgba(0,255,136,0.1),rgba(0,136,255,0.1))]" id="contact">
        <div className="max-w-[1400px] mx-auto">
          <div className="reveal">
            <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-[var(--primary)]">Ready to Deploy?</h2>
            <p className="text-[var(--gray)] mt-3 max-w-2xl mx-auto">
              Join defense organizations worldwide deploying blockchain-secured counter-UAS systems
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="mailto:smit.jurie@gmail.com?subject=Phoenix%20Rooivalk%20Technical%20Demo" 
                 className="inline-block rounded bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] px-6 py-3 font-bold text-[var(--dark)] shadow-glow hover:-translate-y-0.5 transition">
                Schedule Technical Demo
              </a>
              <Link href="/financial" 
                    className="inline-block rounded border-2 border-[var(--primary)] px-6 py-3 font-bold text-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--dark)] transition">
                Financial Projections
              </Link>
            </div>
            <div className="mt-8 text-sm text-[var(--gray)]">
              <p><strong>Contact:</strong> Jurie Smit | PhoenixVC | smit.jurie@gmail.com</p>
            </div>
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
    </main>
  );
}
