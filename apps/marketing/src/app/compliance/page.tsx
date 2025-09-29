"use client";
import React from "react";
import Link from "next/link";

export default function CompliancePage(): React.ReactElement {
  return (
    <main className="relative overflow-hidden bg-[var(--darker)] text-white">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom,_#1b2735_0%,_#090a0f_100%)]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,136,0.03)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(0,255,136,0.03)_1px,_transparent_1px)] bg-[length:50px_50px] animate-gridMove" />
      </div>

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
              <Link href="/" className="hover:text-[var(--primary)]">
                Home
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
              <Link href="/compliance" className="text-[var(--primary)]">
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
            <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-white to-[var(--primary)]">
              Compliance & Certifications
            </h1>
            <p className="text-[var(--gray)] mt-4 max-w-3xl mx-auto">
              Meeting international standards for defense technology with
              comprehensive regulatory compliance.
            </p>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="px-[5%] py-16 bg-[linear-gradient(180deg,rgba(0,136,255,0.05),transparent)]">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-[var(--primary)]">
            International Certifications
          </h2>
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
            {[
              {
                icon: "🇺🇸",
                title: "ITAR Compliant",
                description:
                  "International Traffic in Arms Regulations compliance for defense technology export and deployment worldwide.",
                status: "Certified",
              },
              {
                icon: "🔒",
                title: "ISO 27001",
                description:
                  "Information security management system certification ensuring comprehensive data protection and operational security.",
                status: "Certified",
              },
              {
                icon: "🌍",
                title: "Export Control",
                description:
                  "Full compliance with international export control regulations including EAR and dual-use technology restrictions.",
                status: "Compliant",
              },
              {
                icon: "✅",
                title: "Regional Approvals",
                description:
                  "CE marking, FCC certification, and other regional approvals for global deployment capabilities.",
                status: "In Progress",
              },
            ].map((cert) => (
              <div
                key={cert.title}
                className="rounded-xl border border-[rgba(0,255,136,0.2)] bg-[rgba(15,23,42,0.8)] backdrop-blur p-6 text-center"
              >
                <div className="text-4xl mb-4">{cert.icon}</div>
                <h3 className="text-lg font-semibold mb-3 text-[var(--primary)]">
                  {cert.title}
                </h3>
                <p className="text-[var(--gray)] text-sm mb-4">
                  {cert.description}
                </p>
                <div
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    cert.status === "Certified"
                      ? "bg-green-500/20 text-green-400"
                      : cert.status === "Compliant"
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-yellow-500/20 text-yellow-400"
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
