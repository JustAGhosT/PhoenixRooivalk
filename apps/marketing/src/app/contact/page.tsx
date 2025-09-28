"use client";
import React from "react";
import Link from "next/link";

export default function ContactPage(): React.ReactElement {
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
              <Link href="/compliance" className="hover:text-[var(--primary)]">
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
              Contact Phoenix Rooivalk
            </h1>
            <p className="text-[var(--gray)] mt-4 max-w-3xl mx-auto">
              Ready to deploy advanced counter-UAS defense? Get in touch for
              technical demonstrations and partnership opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="px-[5%] py-16">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="rounded-xl border border-[rgba(0,255,136,0.2)] bg-[rgba(15,23,42,0.8)] backdrop-blur p-8">
              <h2 className="text-2xl font-bold mb-6 text-[var(--primary)]">
                Get in Touch
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Primary Contact</h3>
                  <p className="text-[var(--gray)]">
                    <strong>Jurie Smit</strong>
                    <br />
                    PhoenixVC
                    <br />
                    <a
                      href="mailto:smit.jurie@gmail.com"
                      className="text-[var(--primary)] hover:underline"
                    >
                      smit.jurie@gmail.com
                    </a>
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">
                    Technical Demonstrations
                  </h3>
                  <p className="text-[var(--gray)]">
                    Schedule a comprehensive technical demonstration showcasing
                    multi-sensor detection, neutralization capabilities, and
                    blockchain evidence logging.
                  </p>
                  <a
                    href="mailto:smit.jurie@gmail.com?subject=Phoenix%20Rooivalk%20Technical%20Demo&body=I%20would%20like%20to%20schedule%20a%20technical%20demonstration%20of%20the%20Phoenix%20Rooivalk%20Counter-UAS%20System."
                    className="inline-block mt-3 rounded bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] px-4 py-2 font-bold text-[var(--dark)] shadow-glow hover:-translate-y-0.5 transition"
                  >
                    Schedule Demo
                  </a>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Partnership Inquiries</h3>
                  <p className="text-[var(--gray)]">
                    Interested in distribution partnerships, system integration,
                    or custom deployment configurations? Contact us for
                    partnership opportunities.
                  </p>
                  <a
                    href="mailto:smit.jurie@gmail.com?subject=Phoenix%20Rooivalk%20Partnership%20Inquiry"
                    className="inline-block mt-3 rounded border-2 border-[var(--primary)] px-4 py-2 font-bold text-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--dark)] transition"
                  >
                    Partnership Inquiry
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[rgba(0,255,136,0.2)] bg-[rgba(15,23,42,0.8)] backdrop-blur p-8">
              <h2 className="text-2xl font-bold mb-6 text-[var(--primary)]">
                Access Requirements
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">
                    Restricted Partner Access
                  </h3>
                  <p className="text-[var(--gray)] text-sm">
                    This repository and associated artifacts are intended for
                    approved defense partners only. Redistribution or public
                    disclosure is prohibited without written authorization.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Who Can Apply</h3>
                  <ul className="text-[var(--gray)] text-sm space-y-1">
                    <li>• Government agencies with lawful mandates</li>
                    <li>• Defense integrators and contractors</li>
                    <li>• Vetted industrial partners</li>
                    <li>• Critical infrastructure operators</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Required Information</h3>
                  <ul className="text-[var(--gray)] text-sm space-y-1">
                    <li>• Organization name and jurisdiction</li>
                    <li>• Intended evaluation scope and end use</li>
                    <li>• Points of contact and security lead</li>
                    <li>• Export control considerations</li>
                  </ul>
                </div>
                <div className="p-4 bg-[rgba(0,255,136,0.1)] rounded-lg border border-[rgba(0,255,136,0.3)]">
                  <p className="text-sm">
                    <strong>Compliance Notice:</strong> All activities must
                    comply with applicable laws, export controls, and end-user
                    restrictions. ITAR compliance required for defense
                    applications.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="px-[5%] py-16 bg-[linear-gradient(180deg,transparent,rgba(0,136,255,0.05))]">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center text-[var(--primary)]">
            Explore Phoenix Rooivalk
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link
              href="/technical"
              className="rounded-xl border border-[rgba(0,255,136,0.2)] bg-[rgba(15,23,42,0.8)] backdrop-blur p-6 hover:-translate-y-1 transition block"
            >
              <h3 className="text-lg font-semibold mb-2 text-[var(--primary)]">
                Technical Specifications
              </h3>
              <p className="text-[var(--gray)] text-sm">
                Multi-sensor detection, neutralization modules, and deployment
                configurations.
              </p>
            </Link>
            <Link
              href="/financial"
              className="rounded-xl border border-[rgba(0,255,136,0.2)] bg-[rgba(15,23,42,0.8)] backdrop-blur p-6 hover:-translate-y-1 transition block"
            >
              <h3 className="text-lg font-semibold mb-2 text-[var(--primary)]">
                Financial Projections
              </h3>
              <p className="text-[var(--gray)] text-sm">
                Revenue forecasts, break-even analysis, and investment
                allocation details.
              </p>
            </Link>
            <Link
              href="/compliance"
              className="rounded-xl border border-[rgba(0,255,136,0.2)] bg-[rgba(15,23,42,0.8)] backdrop-blur p-6 hover:-translate-y-1 transition block"
            >
              <h3 className="text-lg font-semibold mb-2 text-[var(--primary)]">
                Compliance & Security
              </h3>
              <p className="text-[var(--gray)] text-sm">
                ITAR compliance, ISO certifications, and blockchain security
                framework.
              </p>
            </Link>
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
    </main>
  );
}
