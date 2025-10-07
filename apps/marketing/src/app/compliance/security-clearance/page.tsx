"use client";
import Link from "next/link";
import * as React from "react";
import { Navigation } from "../../../components/Navigation";

export default function SecurityClearancePage(): React.ReactElement {
  return (
    <main className="relative overflow-hidden bg-[rgb(var(--darker))] text-white">
      <Navigation />

      {/* Hero Section */}
      <section className="px-[5%] py-20 bg-gradient-to-br from-[rgb(var(--darker))] via-[var(--dark)] to-[rgb(var(--darker))]">
        <div className="max-w-[1400px] mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--accent))]">
              Security Clearance
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-[rgb(var(--gray))] max-w-4xl mx-auto">
            Personnel security clearance framework for classified operations and
            sensitive defense technology
          </p>
        </div>
      </section>

      {/* Security Clearance Overview */}
      <section className="px-[5%] py-16">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-[rgb(var(--primary))]">
                Personnel Security Framework
              </h2>
              <p className="text-[rgb(var(--gray))] mb-6">
                Phoenix Rooivalk maintains comprehensive security clearance
                protocols for all personnel involved in classified operations.
                Our security framework ensures:
              </p>
              <ul className="space-y-3 text-[rgb(var(--gray))]">
                <li className="flex items-start">
                  <span className="text-[rgb(var(--primary))] mr-3">✓</span>
                  Background investigation and vetting
                </li>
                <li className="flex items-start">
                  <span className="text-[rgb(var(--primary))] mr-3">✓</span>
                  Continuous monitoring and evaluation
                </li>
                <li className="flex items-start">
                  <span className="text-[rgb(var(--primary))] mr-3">✓</span>
                  Need-to-know access controls
                </li>
                <li className="flex items-start">
                  <span className="text-[rgb(var(--primary))] mr-3">✓</span>
                  Security training and awareness
                </li>
                <li className="flex items-start">
                  <span className="text-[rgb(var(--primary))] mr-3">✓</span>
                  Incident reporting and investigation
                </li>
              </ul>
            </div>
            <div className="bg-[rgba(var(--primary),0.1)] p-8 rounded-xl border border-[rgb(var(--primary))]/20">
              <h3 className="text-xl font-semibold mb-4 text-[rgb(var(--primary))]">
                Clearance Levels
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[rgb(var(--gray))]">Confidential</span>
                  <span className="text-yellow-400 font-semibold">Planned</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[rgb(var(--gray))]">Secret</span>
                  <span className="text-yellow-400 font-semibold">Planned</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[rgb(var(--gray))]">Top Secret</span>
                  <span className="text-yellow-400 font-semibold">Planned</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[rgb(var(--gray))]">SCI</span>
                  <span className="text-yellow-400 font-semibold">Planned</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clearance Process */}
      <section className="px-[5%] py-16 bg-[linear-gradient(180deg,rgba(var(--primary),0.05),transparent)]">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center text-[rgb(var(--primary))]">
            Security Clearance Process
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                title: "Application",
                description:
                  "Comprehensive security clearance application with detailed personal and professional history.",
                duration: "1-2 weeks",
              },
              {
                title: "Background Investigation",
                description:
                  "Thorough background investigation including financial, criminal, and personal history review.",
                duration: "3-6 months",
              },
              {
                title: "Adjudication",
                description:
                  "Security clearance adjudication process with risk assessment and decision making.",
                duration: "1-3 months",
              },
              {
                title: "Continuous Monitoring",
                description:
                  "Ongoing monitoring and periodic reinvestigation to maintain clearance status.",
                duration: "Ongoing",
              },
            ].map((step, index) => (
              <div
                key={index}
                className="bg-[rgba(15,23,42,0.8)] backdrop-blur p-6 rounded-xl border border-[rgb(var(--primary))]/20 hover:border-[rgb(var(--primary))]/30 transition-all duration-300"
              >
                <div className="text-center mb-4">
                  <div className="w-12 h-12 bg-[rgb(var(--primary))] rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-3">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-semibold text-[rgb(var(--primary))]">
                    {step.title}
                  </h3>
                </div>
                <p className="text-[rgb(var(--gray))] text-sm mb-4 text-center">
                  {step.description}
                </p>
                <div className="text-center">
                  <span className="text-xs text-[rgb(var(--gray))]">Duration</span>
                  <div className="text-[rgb(var(--primary))] text-sm font-semibold">
                    {step.duration}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Measures */}
      <section className="px-[5%] py-16">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center text-[rgb(var(--primary))]">
            Security Measures & Controls
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-[rgb(var(--primary))] mb-4">
                Physical Security
              </h3>
              {[
                "Secure facility access controls",
                "Biometric authentication systems",
                "Classified material handling procedures",
                "Visitor screening and escort protocols",
                "Secure communication systems",
              ].map((measure, index) => (
                <div key={index} className="flex items-start">
                  <span className="text-[rgb(var(--primary))] mr-3 mt-1">🔒</span>
                  <span className="text-[rgb(var(--gray))]">{measure}</span>
                </div>
              ))}
            </div>
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-[rgb(var(--primary))] mb-4">
                Information Security
              </h3>
              {[
                "Encrypted data transmission",
                "Secure document classification",
                "Access control matrices",
                "Audit logging and monitoring",
                "Incident response procedures",
              ].map((measure, index) => (
                <div key={index} className="flex items-start">
                  <span className="text-[rgb(var(--primary))] mr-3 mt-1">🛡️</span>
                  <span className="text-[rgb(var(--gray))]">{measure}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-[5%] py-12 bg-[var(--darker)] border-t border-[rgba(var(--primary),0.1)]">
        <div className="max-w-[1400px] mx-auto text-center">
          <div className="flex flex-wrap justify-center gap-6 mb-6">
            <Link
              href="/compliance"
              className="text-[rgb(var(--primary))] hover:underline"
            >
              Compliance Overview
            </Link>
            <Link
              href="/compliance/itar"
              className="text-[rgb(var(--primary))] hover:underline"
            >
              ITAR Compliance
            </Link>
            <Link
              href="/compliance/iso-27001"
              className="text-[rgb(var(--primary))] hover:underline"
            >
              ISO 27001
            </Link>
          </div>
          <p className="text-[rgb(var(--gray))] text-sm">
            Security clearance protocols ensure personnel meet the highest
            standards for classified operations.
          </p>
        </div>
      </footer>
    </main>
  );
}
