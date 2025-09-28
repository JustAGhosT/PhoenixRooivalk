import React, { useEffect } from 'react';
import Layout from '@theme/Layout';

export default function Home(): React.ReactElement {
  useEffect(() => {
    // Smooth scrolling for navigation-like anchors within this page
    const anchors = Array.from(document.querySelectorAll<HTMLAnchorElement>('.marketing a[href^="#"]'));
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

    // Reveal on scroll
    const reveals = Array.from(document.querySelectorAll<HTMLElement>('.marketing .reveal'));
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

    // Feature card hover effects (minor polish)
    const featureCards = Array.from(document.querySelectorAll<HTMLElement>('.marketing .feature-card'));
    const onEnter = (thisEl: HTMLElement) => () => { thisEl.style.transform = 'translateY(-10px) scale(1.02)'; };
    const onLeave = (thisEl: HTMLElement) => () => { thisEl.style.transform = 'translateY(-5px) scale(1)'; };
    const handlers: Array<{ el: HTMLElement; enter: () => void; leave: () => void }> = [];
    featureCards.forEach(card => {
      const enter = onEnter(card);
      const leave = onLeave(card);
      card.addEventListener('mouseenter', enter);
      card.addEventListener('mouseleave', leave);
      handlers.push({ el: card, enter, leave });
    });

    // Cleanup
    return () => {
      anchors.forEach(a => a.removeEventListener('click', onAnchorClick));
      window.removeEventListener('scroll', revealOnScroll);
      handlers.forEach(h => {
        h.el.removeEventListener('mouseenter', h.enter);
        h.el.removeEventListener('mouseleave', h.leave);
      });
    };
  }, []);

  return (
    <Layout title="Phoenix Rooivalk" description="Blockchain-powered counter‑drone defense marketing overview">
      <style>{`
        .marketing * { box-sizing: border-box; }
        .marketing {
          color: #ffffff;
          line-height: 1.6;
          position: relative;
          overflow: hidden;
          background: #050811;
        }
        .marketing a { text-decoration: none; }

        :root {
          --primary: #00ff88;
          --secondary: #0088ff;
          --dark: #0a0e1a;
          --darker: #050811;
          --light: #ffffff;
          --gray: #8892b0;
          --card-bg: rgba(15, 23, 42, 0.8);
          --glow: 0 0 30px rgba(0, 255, 136, 0.3);
        }

        /* Background */
        .marketing .bg-animation {
          position: absolute; inset: 0; z-index: 0;
          background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
          overflow: hidden;
        }
        .marketing .grid-overlay {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(0, 255, 136, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 136, 0.03) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: marketing-gridMove 20s linear infinite;
        }
        @keyframes marketing-gridMove { 0% { transform: translate(0,0);} 100% { transform: translate(50px,50px);} }

        /* Hero */
        .marketing .hero { min-height: 90vh; display: flex; align-items: center; padding: 2rem 5%; position: relative; z-index: 1; }
        .marketing .hero-content { max-width: 1400px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
        .marketing .hero-text h1 { font-size: 3.2rem; line-height: 1.2; margin-bottom: 1.2rem; background: linear-gradient(135deg, var(--light) 0%, var(--primary) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: marketing-fadeInUp 1s ease; }
        .marketing .hero-text p { font-size: 1.15rem; color: var(--gray); margin-bottom: 1.6rem; animation: marketing-fadeInUp 1s ease 0.2s both; }
        .marketing .hero-buttons { display: flex; gap: 1rem; animation: marketing-fadeInUp 1s ease 0.4s both; }
        @keyframes marketing-fadeInUp { from { opacity: 0; transform: translateY(30px);} to { opacity: 1; transform: translateY(0);} }

        .marketing .cta-button { background: linear-gradient(135deg, var(--primary), var(--secondary)); color: var(--dark); padding: 0.75rem 1.5rem; border-radius: 5px; font-weight: 700; transition: all .3s; display: inline-block; }
        .marketing .cta-button:hover { transform: translateY(-2px); box-shadow: var(--glow); }
        .marketing .secondary-button { background: transparent; border: 2px solid var(--primary); color: var(--primary); padding: 0.75rem 1.5rem; border-radius: 5px; font-weight: 700; transition: all .3s; }
        .marketing .secondary-button:hover { background: var(--primary); color: var(--dark); }

        .marketing .hero-visual { position: relative; animation: marketing-float 3s ease-in-out infinite; }
        @keyframes marketing-float { 0%,100% { transform: translateY(0);} 50% { transform: translateY(-20px);} }
        .marketing .drone-graphic { width: 100%; height: 420px; background: linear-gradient(135deg, rgba(0,255,136,0.1), rgba(0,136,255,0.1)); border-radius: 20px; position: relative; display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .marketing .radar-sweep { position: absolute; width: 280px; height: 280px; border: 2px solid var(--primary); border-radius: 50%; opacity: .3; }
        .marketing .radar-sweep::after { content: ''; position: absolute; top: 50%; left: 50%; width: 100%; height: 2px; background: linear-gradient(90deg, transparent, var(--primary)); transform-origin: left center; animation: marketing-radar 3s linear infinite; }
        @keyframes marketing-radar { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }
        .marketing .shield-emoji { font-size: 4rem; z-index: 1; }
        .marketing .drone-emoji { font-size: 8rem; animation: marketing-float 3s ease-in-out infinite; }

        /* Sections */
        .marketing .section { padding: 4rem 5%; position: relative; z-index: 1; }
        .marketing .section-header { text-align: center; margin-bottom: 2rem; }
        .marketing .section-header h2 { font-size: 2.2rem; margin-bottom: .6rem; background: linear-gradient(135deg, var(--primary), var(--secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .marketing .section-header p { color: var(--gray); }

        /* Stats */
        .marketing .market-section { background: linear-gradient(180deg, transparent, rgba(0, 136, 255, 0.05)); }
        .marketing .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; margin: 2rem 0; }
        .marketing .stat-card { background: var(--card-bg); backdrop-filter: blur(10px); border: 1px solid rgba(0, 255, 136, 0.2); border-radius: 15px; padding: 1.6rem; text-align: center; transition: all .3s; }
        .marketing .stat-card:hover { transform: translateY(-5px); border-color: var(--primary); box-shadow: var(--glow); }
        .marketing .stat-value { font-size: 2.2rem; font-weight: 800; background: linear-gradient(135deg, var(--primary), var(--secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .marketing .stat-label { color: var(--gray); margin-top: .4rem; }

        /* Features */
        .marketing .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem; margin-top: 2rem; }
        .marketing .feature-card { background: var(--card-bg); backdrop-filter: blur(10px); border: 1px solid rgba(0,255,136,0.2); border-radius: 15px; padding: 1.6rem; position: relative; overflow: hidden; transition: all .3s; }
        .marketing .feature-card::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 3px; background: linear-gradient(90deg, var(--primary), var(--secondary)); }
        .marketing .feature-icon { width: 56px; height: 56px; background: linear-gradient(135deg, var(--primary), var(--secondary)); border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; margin-bottom: .8rem; }
        .marketing .feature-card h3 { margin-bottom: .6rem; font-size: 1.3rem; }
        .marketing .feature-card p { color: var(--gray); }

        /* Tech */
        .marketing .tech-showcase { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center; margin-top: 2rem; }
        .marketing .tech-list { list-style: none; padding: 0; }
        .marketing .tech-item { display: flex; align-items: flex-start; margin-bottom: 1.2rem; padding: 1.2rem; background: var(--card-bg); border-radius: 10px; transition: all .3s; }
        .marketing .tech-item:hover { transform: translateX(10px); background: rgba(0,255,136,0.1); }
        .marketing .tech-icon { width: 40px; height: 40px; background: var(--primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 1.2rem; flex-shrink: 0; }

        /* Comparison */
        .marketing .comparison-table { overflow-x: auto; margin-top: 2rem; }
        .marketing table { width: 100%; border-collapse: collapse; background: var(--card-bg); border-radius: 10px; overflow: hidden; }
        .marketing th { background: linear-gradient(135deg, var(--primary), var(--secondary)); color: var(--dark); padding: 1rem; text-align: left; font-weight: 800; }
        .marketing td { padding: 1rem; border-bottom: 1px solid rgba(0,255,136,0.1); }
        .marketing tr:hover { background: rgba(0,255,136,0.05); }
        .marketing .check { color: var(--primary); font-size: 1.1rem; }
        .marketing .cross { color: #ff4444; font-size: 1.1rem; }

        /* CTA */
        .marketing .cta-section { background: linear-gradient(135deg, rgba(0,255,136,0.1), rgba(0,136,255,0.1)); text-align: center; }
        .marketing .cta-content h2 { font-size: 2.6rem; margin-bottom: .8rem; background: linear-gradient(135deg, var(--light), var(--primary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .marketing .cta-content p { font-size: 1.1rem; color: var(--gray); margin-bottom: 1.4rem; max-width: 640px; margin-left: auto; margin-right: auto; }

        /* Footer-like bottom */
        .marketing .footer { padding: 2.4rem 5%; border-top: 1px solid rgba(0,255,136,0.2); color: var(--gray); text-align: center; }

        /* Responsive */
        @media (max-width: 768px) {
          .marketing .hero-content { grid-template-columns: 1fr; text-align: center; }
          .marketing .hero-text h1 { font-size: 2.4rem; }
          .marketing .hero-buttons { flex-direction: column; }
          .marketing .tech-showcase { grid-template-columns: 1fr; }
          .marketing .stats-grid { grid-template-columns: 1fr; }
          .marketing .features-grid { grid-template-columns: 1fr; }
        }

        /* Reveal */
        .marketing .reveal { opacity: 0; transform: translateY(30px); transition: all .8s ease; }
        .marketing .reveal.active { opacity: 1; transform: translateY(0); }
      `}</style>

      <main className="marketing">
        {/* Background Animation */}
        <div className="bg-animation" aria-hidden="true">
          <div className="grid-overlay" />
        </div>

        {/* Hero */}
        <section className="hero" id="hero">
          <div className="hero-content">
            <div className="hero-text">
              <h1>Blockchain-Powered Counter-Drone Defense</h1>
              <p>
                Revolutionary defense technology combining military-grade security with
                blockchain integrity. Protect your airspace with 95% accuracy and sub-6 second
                response times.
              </p>
              <div className="hero-buttons">
                <a href="/contact" className="cta-button">Get Started</a>
                <a href="#features" className="secondary-button">Learn More</a>
              </div>
            </div>
            <div className="hero-visual" aria-hidden="true">
              <div className="drone-graphic">
                <div className="radar-sweep" />
                <div className="shield-emoji">🛡️</div>
              </div>
            </div>
          </div>
        </section>

        {/* Market */}
        <section className="section market-section" id="market">
          <div className="section-header reveal">
            <h2>$14.51B Market Opportunity by 2030</h2>
            <p>Join the fastest-growing defense technology sector with 26.5% CAGR</p>
          </div>
          <div className="stats-grid reveal">
            <div className="stat-card">
              <div className="stat-value">R850K</div>
              <div className="stat-label">System Price</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">247%</div>
              <div className="stat-label">ROI in 36 Months</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">95%+</div>
              <div className="stat-label">Detection Accuracy</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">&lt; 6s</div>
              <div className="stat-label">Response Time</div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="section features-section" id="features">
          <div className="section-header reveal">
            <h2>Comprehensive Protection Suite</h2>
            <p>Multi-layered defense with blockchain-verified operations</p>
          </div>
          <div className="features-grid">
            <div className="feature-card reveal">
              <div className="feature-icon">🎯</div>
              <h3>Advanced Detection</h3>
              <p>Multi-sensor fusion combining RF, radar, optical, acoustic, and infrared detection for 5km range coverage with AI-powered threat classification.</p>
            </div>
            <div className="feature-card reveal">
              <div className="feature-icon">⚡</div>
              <h3>Rapid Neutralization</h3>
              <p>RF jamming, GPS spoofing, and unique physical countermeasures including net entanglement for non-destructive drone capture.</p>
            </div>
            <div className="feature-card reveal">
              <div className="feature-icon">🔗</div>
              <h3>Blockchain Security</h3>
              <p>Immutable audit trails, distributed coordination, and tamper-proof evidence logging for military-grade operational integrity.</p>
            </div>
            <div className="feature-card reveal">
              <div className="feature-icon">🎮</div>
              <h3>Unified Command</h3>
              <p>Real-time C2 dashboard with mobile support, customizable alerts, and remote operation capabilities for complete situational awareness.</p>
            </div>
            <div className="feature-card reveal">
              <div className="feature-icon">🔧</div>
              <h3>Modular Design</h3>
              <p>Scalable architecture allows customization for specific threats and easy upgrades as technology evolves, protecting your investment.</p>
            </div>
            <div className="feature-card reveal">
              <div className="feature-icon">🌍</div>
              <h3>Global Deployment</h3>
              <p>Fixed installations, portable units, or vehicle-mounted systems with battery, solar, and hybrid power options for any environment.</p>
            </div>
          </div>
        </section>

        {/* Technology */}
        <section className="section tech-section" id="technology">
          <div className="section-header reveal">
            <h2>Cutting-Edge Technology Stack</h2>
            <p>Military-grade components with blockchain innovation</p>
          </div>
          <div className="tech-showcase reveal">
            <div className="tech-details">
              <ul className="tech-list">
                <li className="tech-item">
                  <div className="tech-icon">📡</div>
                  <div>
                    <h4>Multi-Sensor Fusion</h4>
                    <p>Combines RF, radar, optical, acoustic, and infrared sensors for comprehensive threat detection in all conditions.</p>
                  </div>
                </li>
                <li className="tech-item">
                  <div className="tech-icon">🧠</div>
                  <div>
                    <h4>AI-Powered Analysis</h4>
                    <p>Machine learning algorithms reduce false positives to under 5% while identifying unknown drone models.</p>
                  </div>
                </li>
                <li className="tech-item">
                  <div className="tech-icon">🔐</div>
                  <div>
                    <h4>Blockchain Integration</h4>
                    <p>Evidence anchoring and append-only logs ensure data integrity across multiple chains with Byzantine fault tolerance.</p>
                  </div>
                </li>
                <li className="tech-item">
                  <div className="tech-icon">⚙️</div>
                  <div>
                    <h4>Edge Computing</h4>
                    <p>Local processing ensures sub-second response times even in disconnected environments.</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="drone-graphic" aria-hidden="true">
              <div className="drone-emoji">🚁</div>
            </div>
          </div>
        </section>

        {/* Comparison */}
        <section className="section comparison-section" id="comparison">
          <div className="section-header reveal">
            <h2>Industry-Leading Performance</h2>
            <p>See how Phoenix Rooivalk outperforms the competition</p>
          </div>
          <div className="comparison-table reveal">
            <table>
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Phoenix Rooivalk</th>
                  <th>DroneGuard Pro</th>
                  <th>AeroDefender</th>
                  <th>FortiDrone</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Price</td>
                  <td><strong>R850,000</strong></td>
                  <td>R1,200,000</td>
                  <td>R1,500,000</td>
                  <td>R1,000,000</td>
                </tr>
                <tr>
                  <td>Detection Range</td>
                  <td><strong>5 km</strong></td>
                  <td>2 km</td>
                  <td>5 km</td>
                  <td>5 km</td>
                </tr>
                <tr>
                  <td>Response Time</td>
                  <td><strong>3-6 seconds</strong></td>
                  <td>5 seconds</td>
                  <td>3 seconds</td>
                  <td>4 seconds</td>
                </tr>
                <tr>
                  <td>Accuracy</td>
                  <td><strong>95%+</strong></td>
                  <td>90%</td>
                  <td>95%</td>
                  <td>94%</td>
                </tr>
                <tr>
                  <td>Blockchain Security</td>
                  <td><span className="check">✔</span></td>
                  <td><span className="cross">✗</span></td>
                  <td><span className="cross">✗</span></td>
                  <td><span className="cross">✗</span></td>
                </tr>
                <tr>
                  <td>Modular Design</td>
                  <td><span className="check">✔</span></td>
                  <td><span className="cross">✗</span></td>
                  <td><span className="cross">✗</span></td>
                  <td><span className="cross">✗</span></td>
                </tr>
                <tr>
                  <td>Physical Countermeasures</td>
                  <td><span className="check">✔</span></td>
                  <td><span className="cross">✗</span></td>
                  <td><span className="check">✔</span></td>
                  <td><span className="check">✔</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* CTA */}
        <section className="section cta-section" id="contact">
          <div className="cta-content reveal">
            <h2>Secure Your Airspace Today</h2>
            <p>Join leading organizations worldwide in deploying the most advanced counter-drone defense system available</p>
            <div className="hero-buttons">
              <a href="/contact" className="cta-button">Request a Demo</a>
              <a href="/docs/overview" className="secondary-button">View Overview</a>
              <a href="/whitepaper" className="secondary-button">Download Whitepaper</a>
            </div>
          </div>
        </section>

        {/* Info footer (keeps Docusaurus site footer separate) */}
        <div className="footer">
          <p>© 2025 Phoenix Rooivalk. All rights reserved. | ITAR Compliant | ISO 27001 Certified</p>
        </div>
      </main>
    </Layout>
  );
}
