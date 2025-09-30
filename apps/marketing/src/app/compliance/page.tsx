"use client";
import Link from "next/link";
import React from "react";
import { Navigation } from "../../components/Navigation";

export default function CompliancePage(): React.ReactElement {
  return (
    <main className="relative overflow-hidden bg-[var(--darker)] text-white">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom,_#1b2735_0%,_#090a0f_100%)]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,136,0.03)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(0,255,136,0.03)_1px,_transparent_1px)] bg-[length:50px_50px] animate-gridMove" />
      </div>

      {/* Navigation */}
      <Navigation />

      {/* Header */}
      <section className="px-[5%] py-16">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-white to-[var(--primary)]">
              Compliance & Assurance Roadmap
            </h1>
            <p className="text-[var(--gray)] mt-4 max-w-3xl mx-auto">
              Planning compliance framework for defense technology development.
              All standards listed as targets, not current certifications.
            </p>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="px-[5%] py-16 bg-[linear-gradient(180deg,rgba(var(--primary),0.05),transparent)]">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-[var(--primary)]">
            Assurance Roadmap (Targets, Post-Funding)
          </h2>
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
            {[
              {
                icon: "🇺🇸",
                title: "ITAR Compliance",
                description:
                  "ITAR compliance framework planning for defense technology export controls. Target standard, pre-audit.",
                status: "Planned",
                progress: "0%",
              },
              {
                icon: "🔒",
                title: "ISO 27001",
                description:
                  "ISO 27001 information security management system planning. Planned post-MVP.",
                status: "Planned",
                progress: "0%",
              },
              {
                icon: "🌍",
                title: "Export Control",
                description:
                  "EAR and dual-use technology compliance framework established. Regional restrictions mapped.",
                status: "Planned",
                progress: "0%",
              },
              {
                icon: "✅",
                title: "Regional Approvals",
                description:
                  "CE marking, FCC certification, and regional approval processes initiated. Documentation prepared.",
                status: "Planned",
                progress: "0%",
              },
              {
                icon: "🛡️",
                title: "Military Standards",
                description:
                  "MIL-STD-810G environmental testing and MIL-STD-461 electromagnetic compatibility standards compliance.",
                status: "Planned",
                progress: "0%",
              },
              {
                icon: "🔐",
                title: "FIPS 140-2",
                description:
                  "Federal Information Processing Standard for cryptographic modules. Hardware security module integration planned.",
                status: "Planned",
                progress: "0%",
              },
              {
                icon: "🌐",
                title: "GDPR Compliance",
                description:
                  "General Data Protection Regulation compliance framework for European operations and data handling.",
                status: "Planned",
                progress: "0%",
              },
              {
                icon: "⚖️",
                title: "Legal Framework",
                description:
                  "Comprehensive legal compliance framework including liability, insurance, and operational restrictions.",
                status: "Planned",
                progress: "0%",
              },
            ].map((cert) => (
              <div
                key={cert.title}
                className="rounded-xl border border-[var(--primary)]/20 bg-[rgba(15,23,42,0.8)] backdrop-blur p-6 text-center hover:border-[var(--primary)]/30 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{cert.icon}</div>
                <h3 className="text-lg font-semibold mb-3 text-[var(--primary)]">
                  {cert.title}
                </h3>
                <p className="text-[var(--gray)] text-sm mb-4">
                  {cert.description}
                </p>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-[var(--gray)] mb-2">
                    <span>Progress</span>
                    <span>{cert.progress}</span>
                  </div>
                  <div className="w-full bg-[rgba(15,23,42,0.8)] rounded-full h-2 border border-[var(--primary)]/20">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] transition-all duration-1000 ease-out"
                      style={{ width: cert.progress }}
                    ></div>
                  </div>
                </div>

                <div
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    cert.status === "Certified"
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : cert.status === "In Progress"
                        ? "bg-[var(--accent)]/20 text-[var(--accent)] border border-[var(--accent)]/30"
                        : "bg-[var(--primary)]/20 text-[var(--primary)] border border-[var(--primary)]/30"
                  }`}
                >
                  {cert.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Measures */}
      <section className="px-[5%] py-16">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-[var(--primary)]">
            Security & Privacy Framework
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="rounded-xl border border-[rgba(0,255,136,0.2)] bg-[rgba(15,23,42,0.8)] backdrop-blur p-6">
              <h3 className="text-xl font-semibold mb-4 text-[var(--primary)]">
                Data Protection
              </h3>
              <ul className="space-y-3 text-[var(--gray)]">
                <li className="flex items-start">
                  <span className="text-[var(--primary)] mr-2 mt-1">•</span>
                  <div>
                    <strong>End-to-End Encryption:</strong> All communications
                    encrypted using AES-256 standards
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-[var(--primary)] mr-2 mt-1">•</span>
                  <div>
                    <strong>Zero-Knowledge Architecture:</strong> Sensitive
                    operational data never stored in plaintext
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-[var(--primary)] mr-2 mt-1">•</span>
                  <div>
                    <strong>GDPR Compliance:</strong> Full compliance for
                    European deployments and data handling
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-[var(--primary)] mr-2 mt-1">•</span>
                  <div>
                    <strong>Key Management:</strong> Secure key rotation and
                    hardware security module integration
                  </div>
                </li>
              </ul>
            </div>
            <div className="rounded-xl border border-[rgba(0,255,136,0.2)] bg-[rgba(15,23,42,0.8)] backdrop-blur p-6">
              <h3 className="text-xl font-semibold mb-4 text-[var(--primary)]">
                Operational Security
              </h3>
              <ul className="space-y-3 text-[var(--gray)]">
                <li className="flex items-start">
                  <span className="text-[var(--primary)] mr-2 mt-1">•</span>
                  <div>
                    <strong>Mandatory Geofencing:</strong> Configurable
                    no-engage zones and operational boundaries
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-[var(--primary)] mr-2 mt-1">•</span>
                  <div>
                    <strong>Fail-Safe Protocols:</strong> Return-to-launch and
                    safe-mode activation on system failure
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-[var(--primary)] mr-2 mt-1">•</span>
                  <div>
                    <strong>Multi-Factor Authentication:</strong> Biometric and
                    token-based operator verification
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-[var(--primary)] mr-2 mt-1">•</span>
                  <div>
                    <strong>Comprehensive Audit Logging:</strong> Immutable
                    blockchain-anchored operation records
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Blockchain Security */}
      <section className="px-[5%] py-16 bg-[linear-gradient(180deg,transparent,rgba(0,136,255,0.05))]">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-[var(--primary)]">
            Blockchain Evidence Integrity
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="rounded-xl border border-[rgba(0,255,136,0.2)] bg-[rgba(15,23,42,0.8)] backdrop-blur p-6">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-2xl mb-4">
                🔗
              </div>
              <h3 className="text-lg font-semibold mb-3">
                Multi-Chain Anchoring
              </h3>
              <p className="text-[var(--gray)] text-sm">
                Every defensive action cryptographically anchored to Solana and
                EtherLink blockchains for tamper-proof audit trails.
              </p>
            </div>
            <div className="rounded-xl border border-[rgba(0,255,136,0.2)] bg-[rgba(15,23,42,0.8)] backdrop-blur p-6">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-2xl mb-4">
                📋
              </div>
              <h3 className="text-lg font-semibold mb-3">Immutable Logging</h3>
              <p className="text-[var(--gray)] text-sm">
                All system events recorded in append-only logs with SHA-256
                integrity verification and distributed consensus.
              </p>
            </div>
            <div className="rounded-xl border border-[rgba(0,255,136,0.2)] bg-[rgba(15,23,42,0.8)] backdrop-blur p-6">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-2xl mb-4">
                🛡️
              </div>
              <h3 className="text-lg font-semibold mb-3">Fault Tolerance</h3>
              <p className="text-[var(--gray)] text-sm">
                Redundant blockchain anchoring ensures evidence integrity even
                during network outages or targeted attacks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Responsible Use */}
      <section className="px-[5%] py-16">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-[var(--primary)]">
            Responsible Use Framework
          </h2>
          <div className="rounded-xl border border-[rgba(0,255,136,0.2)] bg-[rgba(15,23,42,0.8)] backdrop-blur p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-[var(--primary)]">
                  Acceptable Use
                </h3>
                <ul className="space-y-2 text-[var(--gray)]">
                  <li>• Defensive counter-UAS applications</li>
                  <li>• Safety testing and evaluation</li>
                  <li>• Critical infrastructure protection</li>
                  <li>• Government and military operations</li>
                  <li>• Event security and crowd safety</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 text-[var(--primary)]">
                  Prohibited Use
                </h3>
                <ul className="space-y-2 text-[var(--gray)]">
                  <li>• Unlawful surveillance or harassment</li>
                  <li>• Targeting of civilian populations</li>
                  <li>• Circumvention of export controls</li>
                  <li>• Unauthorized weapons integration</li>
                  <li>• Violation of international law</li>
                </ul>
              </div>
            </div>
            <div className="mt-8 p-4 bg-[rgba(0,255,136,0.1)] rounded-lg border border-[rgba(0,255,136,0.3)]">
              <p className="text-sm text-center">
                <strong>Compliance Notice:</strong> All deployments must include
                mandatory geofences, fail-safe RTL protocols, do-not-engage
                zones, and comprehensive audit logging. Violations may result in
                access revocation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-[5%] py-8 text-center text-[var(--gray)] border-t border-[rgba(0,255,136,0.2)]">
        <div className="max-w-[1400px] mx-auto">
          <p>
            © 2025 Phoenix Rooivalk. All rights reserved. | ITAR Compliant |
            ISO 27001 Certified
          </p>
          <div className="mt-4">
            <Link
              href="/"
              className="text-[var(--primary)] hover:underline mr-6"
            >
              Home
            </Link>
            <Link
              href="/technical"
              className="text-[var(--primary)] hover:underline mr-6"
            >
              Technical
            </Link>
            <Link
              href="/financial"
              className="text-[var(--primary)] hover:underline"
            >
              Financial
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
