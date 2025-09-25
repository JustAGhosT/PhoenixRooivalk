"use client";
import React from 'react';
import Link from 'next/link';

export default function TechnicalPage(): React.ReactElement {
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
            <li><Link href="/" className="hover:text-[var(--primary)]">Home</Link></li>
            <li><Link href="/technical" className="text-[var(--primary)]">Technical</Link></li>
            <li><Link href="/financial" className="hover:text-[var(--primary)]">Financial</Link></li>
            <li><Link href="/compliance" className="hover:text-[var(--primary)]">Compliance</Link></li>
          </ul>
        </div>
      </nav>

      {/* Header */}
      <section className="px-[5%] py-16">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-white to-[var(--primary)]">Technical Specifications</h1>
            <p className="text-[var(--gray)] mt-4 max-w-3xl mx-auto">Multi-sensor detection and neutralization platform with modular architecture for diverse operational environments.</p>
          </div>
        </div>
      </section>

      {/* System Architecture */}
      <section className="px-[5%] py-16 bg-[linear-gradient(180deg,rgba(0,136,255,0.05),transparent)]">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-[var(--primary)]">System Architecture</h2>
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
            <div className="rounded-xl border border-[rgba(0,255,136,0.2)] bg-[rgba(15,23,42,0.8)] backdrop-blur p-6">
              <h3 className="text-xl font-semibold mb-4 text-[var(--primary)]">Detection Module</h3>
              <ul className="space-y-2 text-[var(--gray)] text-sm">
                <li>• RF Scanning: Communication signal identification</li>
                <li>• Radar Systems: 3D movement tracking</li>
                <li>• Optical Cameras: AI-powered object recognition</li>
                <li>• Acoustic Sensors: Sound signature detection</li>
                <li>• Infrared Sensors: Night/low-visibility operation</li>
                <li>• EM Detection: Encrypted signal identification</li>
              </ul>
            </div>
            <div className="rounded-xl border border-[rgba(0,255,136,0.2)] bg-[rgba(15,23,42,0.8)] backdrop-blur p-6">
              <h3 className="text-xl font-semibold mb-4 text-[var(--primary)]">Identification Module</h3>
              <ul className="space-y-2 text-[var(--gray)] text-sm">
                <li>• Database Integration: Known UAV model matching</li>
                <li>• AI Classification: Friendly/neutral/hostile distinction</li>
                <li>• Behavioral Analysis: Malicious intent detection</li>
                <li>• Dynamic Signatures: Unknown drone identification</li>
                <li>• Pattern Recognition: Flight behavior analysis</li>
                <li>• Threat Assessment: Risk level evaluation</li>
              </ul>
            </div>
            <div className="rounded-xl border border-[rgba(0,255,136,0.2)] bg-[rgba(15,23,42,0.8)] backdrop-blur p-6">
              <h3 className="text-xl font-semibold mb-4 text-[var(--primary)]">Neutralization Module</h3>
              <ul className="space-y-2 text-[var(--gray)] text-sm">
                <li>• RF Jamming: Communication disruption</li>
                <li>• GPS Spoofing: Navigation system confusion</li>
                <li>• Net Entanglement: Non-destructive capture</li>
                <li>• Kinetic Interceptors: Physical neutralization</li>
                <li>• Directed Energy: Low-energy laser systems</li>
                <li>• Autonomous Interceptors: Fiber-optic drone counter</li>
              </ul>
            </div>
            <div className="rounded-xl border border-[rgba(0,255,136,0.2)] bg-[rgba(15,23,42,0.8)] backdrop-blur p-6">
              <h3 className="text-xl font-semibold mb-4 text-[var(--primary)]">Command & Control</h3>
              <ul className="space-y-2 text-[var(--gray)] text-sm">
                <li>• Centralized Dashboard: Real-time monitoring</li>
                <li>• Customizable Alerts: User-defined notifications</li>
                <li>• Remote Operation: Off-site management</li>
                <li>• Mobile App Control: Field operation support</li>
                <li>• Data Analytics: Predictive threat analysis</li>
                <li>• Multi-site Coordination: Distributed operations</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Deployment Options */}
      <section className="px-[5%] py-16">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-[var(--primary)]">Deployment Configurations</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Fixed Installation',
                description: 'Permanent perimeter protection for critical infrastructure',
                features: ['24/7 autonomous operation', 'Multi-sensor tower arrays', 'Underground cable management', 'Weather-resistant housing', 'Integration with facility security']
              },
              {
                title: 'Portable Systems',
                description: 'Rapid deployment for events and temporary sites',
                features: ['Setup in under 30 minutes', 'Trailer-mounted configuration', 'Battery/generator powered', 'Satellite communication', 'Remote operation capability']
              },
              {
                title: 'Vehicle-Mounted',
                description: 'Mobile protection for convoys and tactical operations',
                features: ['Real-time convoy protection', 'On-the-move detection', 'Integrated vehicle systems', 'Tactical communication', 'Ruggedized for field use']
              }
            ].map((config) => (
              <div key={config.title} className="rounded-xl border border-[rgba(0,255,136,0.2)] bg-[rgba(15,23,42,0.8)] backdrop-blur p-6">
                <h3 className="text-xl font-semibold mb-2 text-[var(--primary)]">{config.title}</h3>
                <p className="text-[var(--gray)] mb-4 text-sm">{config.description}</p>
                <ul className="space-y-2">
                  {config.features.map((feature) => (
                    <li key={feature} className="text-[var(--gray)] text-sm flex items-center">
                      <span className="text-[var(--primary)] mr-2">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Power and Portability */}
      <section className="px-[5%] py-16 bg-[linear-gradient(180deg,transparent,rgba(0,136,255,0.05))]">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-[var(--primary)]">Power & Environmental Specifications</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="rounded-xl border border-[rgba(0,255,136,0.2)] bg-[rgba(15,23,42,0.8)] backdrop-blur p-6">
              <h3 className="text-xl font-semibold mb-4 text-[var(--primary)]">Power Requirements</h3>
              <ul className="space-y-3 text-[var(--gray)]">
                <li><strong>Primary:</strong> 220V AC mains power</li>
                <li><strong>Backup:</strong> Battery systems (8-hour operation)</li>
                <li><strong>Alternative:</strong> Solar panel integration</li>
                <li><strong>Generator:</strong> Diesel/petrol compatibility</li>
                <li><strong>Consumption:</strong> 2-5kW depending on configuration</li>
              </ul>
            </div>
            <div className="rounded-xl border border-[rgba(0,255,136,0.2)] bg-[rgba(15,23,42,0.8)] backdrop-blur p-6">
              <h3 className="text-xl font-semibold mb-4 text-[var(--primary)]">Environmental Specifications</h3>
              <ul className="space-y-3 text-[var(--gray)]">
                <li><strong>Operating Temperature:</strong> -20°C to +60°C</li>
                <li><strong>Humidity:</strong> 5% to 95% non-condensing</li>
                <li><strong>Weather Resistance:</strong> IP65 rated enclosures</li>
                <li><strong>Wind Resistance:</strong> Up to 120 km/h sustained</li>
                <li><strong>Altitude:</strong> Sea level to 3,000m operation</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-[5%] py-8 text-center text-[var(--gray)] border-t border-[rgba(0,255,136,0.2)]">
        <div className="max-w-[1400px] mx-auto">
          <p>© 2025 Phoenix Rooivalk. All rights reserved. | ITAR Compliant | ISO 27001 Certified</p>
          <div className="mt-4">
            <Link href="/" className="text-[var(--primary)] hover:underline mr-6">Home</Link>
            <Link href="/financial" className="text-[var(--primary)] hover:underline mr-6">Financial</Link>
            <Link href="/compliance" className="text-[var(--primary)] hover:underline">Compliance</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
