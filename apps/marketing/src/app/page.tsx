"use client";
import React, { useEffect } from 'react';

export default function Page(): React.ReactElement {
  const docsUrl = process.env.NEXT_PUBLIC_DOCS_URL || '';
  useEffect(() => {
    const anchors = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'));
    const onAnchorClick = (e: Event) => {
      const a = e.currentTarget as HTMLAnchorElement;
      const targetSel = a.getAttribute('href');
      if (!targetSel) return;
      const target = document.querySelector(targetSel);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
    anchors.forEach(a => a.addEventListener('click', onAnchorClick));

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
      anchors.forEach(a => a.removeEventListener('click', onAnchorClick));
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
          <a className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)]" href="#">Phoenix Rooivalk</a>
          <ul className="hidden md:flex gap-6 text-[var(--gray)]">
            <li><a href="#features" className="hover:text-[var(--primary)]">Features</a></li>
            <li><a href="#technology" className="hover:text-[var(--primary)]">Technology</a></li>
            <li><a href="#market" className="hover:text-[var(--primary)]">Market</a></li>
            <li><a href="#contact" className="hover:text-[var(--primary)]">Contact</a></li>
          </ul>
          <a href="/contact" className="inline-block rounded bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] px-4 py-2 font-bold text-[var(--dark)] shadow-glow hover:-translate-y-0.5 transition">Request Demo</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-[90vh] flex items-center px-[5%] py-12 relative" id="hero">
        <div className="mx-auto max-w-[1400px] grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-br from-white to-[var(--primary)] animate-fadeInUp">Blockchain-Powered Counter-Drone Defense</h1>
            <p className="mt-4 text-lg text-[var(--gray)] animate-fadeInUp [animation-delay:200ms]">
              Revolutionary defense technology combining military-grade security with blockchain integrity. Protect your airspace with 95% accuracy and sub-6 second response times.
            </p>
            <div className="mt-6 flex gap-4 animate-fadeInUp [animation-delay:400ms]">
              <a href={docsUrl ? `${docsUrl}/contact` : '#'} className="inline-block rounded bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] px-5 py-3 font-bold text-[var(--dark)] shadow-glow hover:-translate-y-0.5 transition">Get Started</a>
              <a href="#features" className="inline-block rounded border-2 border-[var(--primary)] px-5 py-3 font-bold text-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--dark)] transition">Learn More</a>
            </div>
          </div>
          <div className="relative animate-float">
            <div className="h-[420px] w-full rounded-2xl bg-[linear-gradient(135deg,rgba(0,255,136,0.1),rgba(0,136,255,0.1))] flex items-center justify-center overflow-hidden">
              <div className="absolute h-72 w-72 rounded-full border-2 border-[var(--primary)] opacity-30">
                <div className="absolute top-1/2 left-1/2 h-0.5 w-full origin-left bg-gradient-to-r from-transparent to-[var(--primary)] animate-radar" />
              </div>
              <div className="text-6xl z-10">🛡️</div>
            </div>
          </div>
        </div>
      </section>

      {/* Market */}
      <section className="px-[5%] py-16 bg-[linear-gradient(180deg,transparent,rgba(0,136,255,0.05))]" id="market">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center reveal">
            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)]">$14.51B Market Opportunity by 2030</h2>
            <p className="text-[var(--gray)] mt-2">Join the fastest-growing defense technology sector with 26.5% CAGR</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10 reveal">
            {[
              ['R850K', 'System Price'],
              ['247%', 'ROI in 36 Months'],
              ['95%+', 'Detection Accuracy'],
              ['< 6s', 'Response Time'],
            ].map(([value, label]) => (
              <div key={label} className="text-center rounded-xl border border-[rgba(0,255,136,0.2)] bg-[rgba(15,23,42,0.8)] backdrop-blur p-6 hover:-translate-y-1 hover:shadow-glow transition">
                <div className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)]">{value}</div>
                <div className="text-[var(--gray)] mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-[5%] py-16" id="features">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center reveal">
            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)]">Comprehensive Protection Suite</h2>
            <p className="text-[var(--gray)] mt-2">Multi-layered defense with blockchain-verified operations</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-10">
            {[
              ['🎯','Advanced Detection','Multi-sensor fusion combining RF, radar, optical, acoustic, and infrared detection for 5km range coverage with AI-powered threat classification.'],
              ['⚡','Rapid Neutralization','RF jamming, GPS spoofing, and unique physical countermeasures including net entanglement for non-destructive drone capture.'],
              ['🔗','Blockchain Security','Immutable audit trails, distributed coordination, and tamper-proof evidence logging for military-grade operational integrity.'],
              ['🎮','Unified Command','Real-time C2 dashboard with mobile support, customizable alerts, and remote operation capabilities.'],
              ['🔧','Modular Design','Scalable architecture allows customization for specific threats and easy upgrades as technology evolves.'],
              ['🌍','Global Deployment','Fixed installations, portable units, or vehicle-mounted systems with flexible power options.'],
            ].map(([icon, title, text]) => (
              <div key={title as string} className="relative rounded-xl border border-[rgba(0,255,136,0.2)] bg-[rgba(15,23,42,0.8)] backdrop-blur p-6 overflow-hidden hover:-translate-y-1 transition">
                <div className="absolute left-0 top-0 h-[3px] w-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]" />
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-xl mb-3">{icon}</div>
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-[var(--gray)]">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology */}
      <section className="px-[5%] py-16 bg-[linear-gradient(180deg,rgba(0,136,255,0.05),transparent)]" id="technology">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center reveal">
            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)]">Cutting-Edge Technology Stack</h2>
            <p className="text-[var(--gray)] mt-2">Military-grade components with blockchain innovation</p>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center mt-10 reveal">
            <ul className="space-y-4 list-none">
              {[
                ['📡','Multi-Sensor Fusion','Combines RF, radar, optical, acoustic, and infrared sensors for comprehensive threat detection.'],
                ['🧠','AI-Powered Analysis','Machine learning reduces false positives to under 5% while identifying unknown models.'],
                ['🔐','Blockchain Integration','Evidence anchoring and append-only logs across multiple chains with fault tolerance.'],
                ['⚙️','Edge Computing','Local processing ensures sub-second response times even in disconnected environments.'],
              ].map(([icon, title, text]) => (
                <li key={title as string} className="flex items-start p-4 rounded-lg bg-[rgba(15,23,42,0.8)]">
                  <div className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center mr-4 flex-shrink-0">{icon}</div>
                  <div>
                    <h4 className="font-semibold">{title}</h4>
                    <p className="text-[var(--gray)]">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="h-[420px] rounded-2xl bg-[linear-gradient(135deg,rgba(0,255,136,0.1),rgba(0,136,255,0.1))] flex items-center justify-center">
              <div className="text-[8rem] animate-float">🚁</div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="px-[5%] py-16" id="comparison">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center reveal">
            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)]">Industry-Leading Performance</h2>
            <p className="text-[var(--gray)] mt-2">See how Phoenix Rooivalk outperforms the competition</p>
          </div>
          <div className="overflow-x-auto mt-10 reveal">
            <table className="w-full border-collapse rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] text-[var(--dark)]">
                  <th className="p-4 text-left font-bold">Feature</th>
                  <th className="p-4 text-left font-bold">Phoenix Rooivalk</th>
                  <th className="p-4 text-left font-bold">DroneGuard Pro</th>
                  <th className="p-4 text-left font-bold">AeroDefender</th>
                  <th className="p-4 text-left font-bold">FortiDrone</th>
                </tr>
              </thead>
              <tbody className="bg-[rgba(15,23,42,0.8)]">
                {[
                  ['Price','R850,000','R1,200,000','R1,500,000','R1,000,000'],
                  ['Detection Range','5 km','2 km','5 km','5 km'],
                  ['Response Time','3-6 seconds','5 seconds','3 seconds','4 seconds'],
                  ['Accuracy','95%+','90%','95%','94%'],
                  ['Blockchain Security','✔','✗','✗','✗'],
                  ['Modular Design','✔','✗','✗','✗'],
                  ['Physical Countermeasures','✔','✗','✔','✔'],
                ].map((row) => (
                  <tr key={row[0] as string} className="hover:bg-[rgba(0,255,136,0.05)]">
                    <td className="p-4 border-b border-[rgba(0,255,136,0.1)]">{row[0]}</td>
                    <td className="p-4 border-b border-[rgba(0,255,136,0.1)] font-semibold">{row[1]}</td>
                    <td className="p-4 border-b border-[rgba(0,255,136,0.1)]">{row[2]}</td>
                    <td className="p-4 border-b border-[rgba(0,255,136,0.1)]">{row[3]}</td>
                    <td className="p-4 border-b border-[rgba(0,255,136,0.1)]">{row[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-[5%] py-16 text-center bg-[linear-gradient(135deg,rgba(0,255,136,0.1),rgba(0,136,255,0.1))]" id="contact">
        <div className="max-w-[1400px] mx-auto">
          <div className="reveal">
            <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-[var(--primary)]">Secure Your Airspace Today</h2>
            <p className="text-[var(--gray)] mt-3 max-w-2xl mx-auto">Join leading organizations worldwide in deploying the most advanced counter-drone defense system available</p>
            <div className="mt-6 flex items-center justify-center gap-4">
              <a href={docsUrl ? `${docsUrl}/contact` : '#'} className="inline-block rounded bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] px-5 py-3 font-bold text-[var(--dark)] shadow-glow hover:-translate-y-0.5 transition">Request a Demo</a>
              <a href={docsUrl ? `${docsUrl}/overview` : '#'} className="inline-block rounded border-2 border-[var(--primary)] px-5 py-3 font-bold text-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--dark)] transition">View Overview</a>
              <a href={docsUrl ? `${docsUrl}/whitepaper` : '#'} className="inline-block rounded border-2 border-[var(--primary)] px-5 py-3 font-bold text-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--dark)] transition">Download Whitepaper</a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-[5%] py-8 text-center text-[var(--gray)] border-t border-[rgba(0,255,136,0.2)]">
        © 2025 Phoenix Rooivalk. All rights reserved. | ITAR Compliant | ISO 27001 Certified
      </footer>
    </main>
  );
}
