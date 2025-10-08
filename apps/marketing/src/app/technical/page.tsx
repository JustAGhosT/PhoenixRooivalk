"use client";
import Link from "next/link";
import React from "react";

export default function TechnicalPage(): React.ReactElement {
  return (
    <main className="relative overflow-hidden bg-[rgb(var(--darker))] text-white">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom,_#1b2735_0%,_#090a0f_100%)]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,136,0.03)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(0,255,136,0.03)_1px,_transparent_1px)] bg-[length:50px_50px] animate-gridMove" />
      </div>

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-[rgba(10,14,26,0.95)] backdrop-blur px-6 py-4">
        <div className="mx-auto max-w-[1400px] flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-[rgb(var(--primary))] to-[rgb(var(--secondary))]"
          >
            Phoenix Rooivalk
          </Link>
          <ul className="hidden md:flex gap-6 text-[rgb(var(--gray))]">
            <li>
              <Link href="/" className="hover:text-[rgb(var(--primary))]">
                Home
              </Link>
            </li>
            <li>
              <Link href="/technical" className="text-[rgb(var(--primary))]">
                Technical
              </Link>
            </li>
            <li>
              <Link href="/financial" className="hover:text-[rgb(var(--primary))]">
                Financial
              </Link>
            </li>
            <li>
              <Link href="/compliance" className="hover:text-[rgb(var(--primary))]">
                Compliance
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Header */}
      <section className="px-[5%] py-16">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-white to-[rgb(var(--primary))]">
              AI + Blockchain Technical Specifications
            </h1>
            <p className="text-[rgb(var(--gray))] mt-4 max-w-3xl mx-auto">
              Revolutionary AI-blockchain counter-drone system with 99.7%
              accuracy, 99.3% data integrity, and autonomous swarm coordination
              capabilities.
            </p>
          </div>
        </div>
      </section>

      {/* AI + Blockchain Capabilities */}
      <section className="px-[5%] py-16 bg-[linear-gradient(180deg,rgba(0,255,136,0.05),rgba(0,136,255,0.05))]">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-[rgb(var(--primary))]">
            AI + Blockchain Capabilities
          </h2>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="rounded-xl border border-[rgba(0,255,136,0.2)] bg-[rgba(15,23,42,0.8)] backdrop-blur p-6">
              <h3 className="text-xl font-semibold mb-4 text-[rgb(var(--primary))]">
                AI Performance
              </h3>
              <ul className="space-y-2 text-[rgb(var(--gray))] text-sm">
                <li>
                  • 99.7% threat detection accuracy vs 60-70% industry standard
                </li>
                <li>
                  • &lt; 200ms response time vs 1-3 seconds traditional systems
                </li>
                <li>
                  • Multi-modal sensor fusion (RF, visual, acoustic, radar)
                </li>
                <li>• Federated learning with blockchain consensus</li>
                <li>• Explainable AI with transparent decision-making</li>
                <li>• Continuous learning and adaptation</li>
              </ul>
            </div>
            <div className="rounded-xl border border-[rgba(0,136,255,0.2)] bg-[rgba(15,23,42,0.8)] backdrop-blur p-6">
              <h3 className="text-xl font-semibold mb-4 text-[rgb(var(--primary))]">
                Blockchain Security
              </h3>
              <ul className="space-y-2 text-[rgb(var(--gray))] text-sm">
                <li>• 99.3% data integrity protection vs 85% traditional</li>
                <li>• &lt; 2ms authentication latency vs 50-100ms standard</li>
                <li>• Tamper-proof audit trails for military accountability</li>
                <li>• Cryptographic identity management</li>
                <li>• Byzantine fault tolerance (33% malicious nodes)</li>
                <li>• Quantum-resistant cryptography</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* System Architecture */}
      <section className="px-[5%] py-16 bg-[linear-gradient(180deg,rgba(0,136,255,0.05),transparent)]">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-[rgb(var(--primary))]">
            System Architecture
          </h2>
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
            <div className="rounded-xl border border-[rgba(0,255,136,0.2)] bg-[rgba(15,23,42,0.8)] backdrop-blur p-6">
              <h3 className="text-xl font-semibold mb-4 text-[rgb(var(--primary))]">
                Detection Module
              </h3>
              <ul className="space-y-2 text-[rgb(var(--gray))] text-sm">
                <li>• RF Scanning: Communication signal identification</li>
                <li>• Radar Systems: 3D movement tracking</li>
                <li>• Optical Cameras: AI-powered object recognition</li>
                <li>• Acoustic Sensors: Sound signature detection</li>
                <li>• Infrared Sensors: Night/low-visibility operation</li>
                <li>• EM Detection: Encrypted signal identification</li>
              </ul>
            </div>
            <div className="rounded-xl border border-[rgba(0,255,136,0.2)] bg-[rgba(15,23,42,0.8)] backdrop-blur p-6">
              <h3 className="text-xl font-semibold mb-4 text-[rgb(var(--primary))]">
                AI Identification Module
              </h3>
              <ul className="space-y-2 text-[rgb(var(--gray))] text-sm">
                <li>
                  • 99.7% AI Classification: Friendly/neutral/hostile
                  distinction
                </li>
                <li>• Multi-Modal AI: RF, visual, acoustic, radar fusion</li>
                <li>
                  • Explainable AI: Transparent decision-making with audit
                  trails
                </li>
                <li>• Federated Learning: Distributed AI model training</li>
                <li>
                  • Behavioral Analysis: AI-powered malicious intent detection
                </li>
                <li>• Continuous Learning: AI adapts to new threat patterns</li>
              </ul>
            </div>
            <div className="rounded-xl border border-[rgba(0,255,136,0.2)] bg-[rgba(15,23,42,0.8)] backdrop-blur p-6">
              <h3 className="text-xl font-semibold mb-4 text-[rgb(var(--primary))]">
                Neutralization Module
              </h3>
              <ul className="space-y-2 text-[rgb(var(--gray))] text-sm">
                <li>• RF Jamming: Communication disruption</li>
                <li>• GPS Spoofing: Navigation system confusion</li>
                <li>• Net Entanglement: Non-destructive capture</li>
                <li>• Kinetic Interceptors: Physical neutralization</li>
                <li>• Directed Energy: Low-energy laser systems</li>
                <li>• Autonomous Interceptors: Fiber-optic drone counter</li>
              </ul>
            </div>
            <div className="rounded-xl border border-[rgba(0,255,136,0.2)] bg-[rgba(15,23,42,0.8)] backdrop-blur p-6">
              <h3 className="text-xl font-semibold mb-4 text-[rgb(var(--primary))]">
                Blockchain C2 System
              </h3>
              <ul className="space-y-2 text-[rgb(var(--gray))] text-sm">
                <li>• 99.3% Data Integrity: Tamper-proof audit trails</li>
                <li>• &lt; 2ms Authentication: Blockchain-verified commands</li>
                <li>• Decentralized Control: No single points of failure</li>
                <li>• Multi-Site Coordination: Blockchain consensus</li>
                <li>• Immutable Logging: Complete forensic capabilities</li>
                <li>• Quantum-Resistant: Future-proof security</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Deployment Options */}
      <section className="px-[5%] py-16">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-[rgb(var(--primary))]">
            Deployment Configurations
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Fixed Installation",
                description:
                  "Permanent perimeter protection for critical infrastructure",
                features: [
                  "24/7 autonomous operation",
                  "Multi-sensor tower arrays",
                  "Underground cable management",
                  "Weather-resistant housing",
                  "Integration with facility security",
                ],
              },
              {
                title: "Portable Systems",
                description: "Rapid deployment for events and temporary sites",
                features: [
                  "Setup in under 30 minutes",
                  "Trailer-mounted configuration",
                  "Battery/generator powered",
                  "Satellite communication",
                  "Remote operation capability",
                ],
              },
              {
                title: "Vehicle-Mounted",
                description:
                  "Mobile protection for convoys and tactical operations",
                features: [
                  "Real-time convoy protection",
                  "On-the-move detection",
                  "Integrated vehicle systems",
                  "Tactical communication",
                  "Ruggedized for field use",
                ],
              },
            ].map((config) => (
              <div
                key={config.title}
                className="rounded-xl border border-[rgba(0,255,136,0.2)] bg-[rgba(15,23,42,0.8)] backdrop-blur p-6"
              >
                <h3 className="text-xl font-semibold mb-2 text-[rgb(var(--primary))]">
                  {config.title}
                </h3>
                <p className="text-[rgb(var(--gray))] mb-4 text-sm">
                  {config.description}
                </p>
                <ul className="space-y-2">
                  {config.features.map((feature) => (
                    <li
                      key={feature}
                      className="text-[rgb(var(--gray))] text-sm flex items-center"
                    >
                      <span className="text-[rgb(var(--primary))] mr-2">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage Map Simulator */}
      <section className="px-[5%] py-16 bg-[linear-gradient(180deg,transparent,rgba(0,136,255,0.05))]">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-[rgb(var(--primary))]">
            Detection Coverage Visualization
          </h2>
          <div className="rounded-xl border border-[rgba(0,255,136,0.2)] bg-[rgba(15,23,42,0.8)] backdrop-blur p-6 mb-8">
            <div className="relative h-96 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg overflow-hidden">
              {/* Simulated satellite view */}
              <div className="absolute inset-0 opacity-30">
                <div className="w-full h-full bg-gradient-to-br from-green-900 to-green-800"></div>
                {/* Simulated terrain features */}
                <div className="absolute top-12 left-16 w-20 h-8 bg-tactical-gray rounded opacity-50"></div>
                <div className="absolute bottom-20 right-12 w-16 h-16 bg-blue-600 rounded-full opacity-40"></div>
                <div className="absolute top-32 right-24 w-12 h-24 bg-tactical-gray rounded opacity-45"></div>
              </div>

              {/* Detection zones */}
              <div className="absolute inset-0 flex items-center justify-center">
                {/* 5km detection radius */}
                <div className="absolute w-80 h-80 border-2 border-[rgb(var(--primary))] rounded-full opacity-40 animate-pulse">
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-[rgb(var(--primary))] font-semibold">
                    5km Detection
                  </div>
                </div>
                {/* 2km neutralization radius */}
                <div className="absolute w-48 h-48 border-2 border-red-400 rounded-full opacity-60">
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-red-400 font-semibold">
                    2km Neutralization
                  </div>
                </div>

                {/* System location */}
                <div className="absolute w-8 h-8 bg-gradient-to-br from-[rgb(var(--primary))] to-[rgb(var(--secondary))] rounded-full flex items-center justify-center">
                  <span className="text-xs">🛡️</span>
                </div>

                {/* Animated threat paths */}
                <div className="absolute top-8 left-8 w-3 h-3 bg-red-500 rounded-full animate-bounce">
                  <div className="absolute -top-4 -left-2 text-xs text-red-400">
                    Threat
                  </div>
                </div>
                <div className="absolute bottom-12 right-16 w-3 h-3 bg-yellow-500 rounded-full animate-pulse">
                  <div className="absolute -bottom-4 -left-2 text-xs text-yellow-400">
                    Unknown
                  </div>
                </div>
              </div>

              {/* Coverage stats */}
              <div className="absolute bottom-4 left-4 bg-[rgba(0,0,0,0.7)] rounded-lg p-3 text-xs">
                <div className="text-[rgb(var(--primary))] font-semibold mb-1">
                  Coverage Analysis
                </div>
                <div className="text-white">Area Protected: 78.5 km²</div>
                <div className="text-green-400">Active Sensors: 5/5</div>
                <div className="text-yellow-400">Threats Tracked: 2</div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-[rgb(var(--gray))] text-sm">
                Interactive coverage map showing 5km detection radius and 2km
                neutralization zone
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Power and Portability */}
      <section className="px-[5%] py-16">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-[rgb(var(--primary))]">
            Power & Environmental Specifications
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="rounded-xl border border-[rgba(0,255,136,0.2)] bg-[rgba(15,23,42,0.8)] backdrop-blur p-6">
              <h3 className="text-xl font-semibold mb-4 text-[rgb(var(--primary))]">
                Power Requirements
              </h3>
              <ul className="space-y-3 text-[rgb(var(--gray))]">
                <li>
                  <strong>Primary:</strong> 220V AC mains power
                </li>
                <li>
                  <strong>Backup:</strong> Battery systems (8-hour operation)
                </li>
                <li>
                  <strong>Alternative:</strong> Solar panel integration
                </li>
                <li>
                  <strong>Generator:</strong> Diesel/petrol compatibility
                </li>
                <li>
                  <strong>Consumption:</strong> 2-5kW depending on configuration
                </li>
              </ul>
            </div>
            <div className="rounded-xl border border-[rgba(0,255,136,0.2)] bg-[rgba(15,23,42,0.8)] backdrop-blur p-6">
              <h3 className="text-xl font-semibold mb-4 text-[rgb(var(--primary))]">
                Environmental Specifications
              </h3>
              <ul className="space-y-3 text-[rgb(var(--gray))]">
                <li>
                  <strong>Operating Temperature:</strong> -20°C to +60°C
                </li>
                <li>
                  <strong>Humidity:</strong> 5% to 95% non-condensing
                </li>
                <li>
                  <strong>Weather Resistance:</strong> IP65 rated enclosures
                </li>
                <li>
                  <strong>Wind Resistance:</strong> Up to 120 km/h sustained
                </li>
                <li>
                  <strong>Altitude:</strong> Sea level to 3,000m operation
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-[5%] py-8 text-center text-[rgb(var(--gray))] border-t border-[rgba(0,255,136,0.2)]">
        <div className="max-w-[1400px] mx-auto">
          <p>
            © 2025 Phoenix Rooivalk. All rights reserved. | ITAR Compliance
            Planned | ISO 27001 Certification Planned
          </p>
          <div className="mt-4">
            <Link
              href="/"
              className="text-[rgb(var(--primary))] hover:underline mr-6"
            >
              Home
            </Link>
            <Link
              href="/financial"
              className="text-[rgb(var(--primary))] hover:underline mr-6"
            >
              Financial
            </Link>
            <Link
              href="/compliance"
              className="text-[rgb(var(--primary))] hover:underline"
            >
              Compliance
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
