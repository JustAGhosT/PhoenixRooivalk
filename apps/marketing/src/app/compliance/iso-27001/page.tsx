"use client";
import Link from "next/link";
import * as React from "react";
import { Navigation } from "../../../components/Navigation";

export default function ISO27001Page(): React.ReactElement {
  return (
    <main className="relative overflow-hidden bg-[rgb(var(--darker))] text-white">
      <Navigation />

      {/* Hero Section */}
      <section className="px-[5%] py-20 bg-gradient-to-br from-[var(--darker)] via-[var(--dark)] to-[var(--darker)]">
        <div className="max-w-[1400px] mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgb(var(--primary))] to-[var(--accent)]">
              ISO 27001 Certification
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-[rgb(var(--gray))] max-w-4xl mx-auto">
            International standard for information security management systems
          </p>
        </div>
      </section>

      {/* ISO 27001 Overview */}
      <section className="px-[5%] py-16">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-[rgb(var(--primary))]">
                Information Security Management
              </h2>
              <p className="text-[rgb(var(--gray))] mb-6">
                Phoenix Rooivalk maintains ISO 27001 certification ensuring
                comprehensive information security management across all
                operations. Our ISMS framework provides:
              </p>
              <ul className="space-y-3 text-[rgb(var(--gray))]">
                <li className="flex items-start">
                  <span className="text-[rgb(var(--primary))] mr-3">✓</span>
                  Risk assessment and management
                </li>
                <li className="flex items-start">
                  <span className="text-[rgb(var(--primary))] mr-3">✓</span>
                  Security policy implementation
                </li>
                <li className="flex items-start">
                  <span className="text-[rgb(var(--primary))] mr-3">✓</span>
                  Access control and authentication
                </li>
                <li className="flex items-start">
                  <span className="text-[rgb(var(--primary))] mr-3">✓</span>
                  Incident response procedures
                </li>
                <li className="flex items-start">
                  <span className="text-[rgb(var(--primary))] mr-3">✓</span>
                  Continuous improvement processes
                </li>
              </ul>
            </div>
            <div className="bg-[rgba(var(--primary),0.1)] p-8 rounded-xl border border-[rgb(var(--primary))]/20">
              <h3 className="text-xl font-semibold mb-4 text-[rgb(var(--primary))]">
                Certification Status
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[rgb(var(--gray))]">Certification</span>
                  <span className="text-yellow-400 font-semibold">Planned</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[rgb(var(--gray))]">Target Date</span>
                  <span className="text-yellow-400 font-semibold">Q4 2025</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[rgb(var(--gray))]">
                    Implementation
                  </span>
                  <span className="text-yellow-400 font-semibold">
                    In Progress
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[rgb(var(--gray))]">
                    Next Milestone
                  </span>
                  <span className="text-yellow-400 font-semibold">Q2 2025</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Controls */}
      <section className="px-[5%] py-16 bg-[linear-gradient(180deg,rgba(var(--primary),0.05),transparent)]">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center text-[rgb(var(--primary))]">
            Security Control Framework
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Access Control",
                description:
                  "Multi-factor authentication, role-based access controls, and privileged access management for all systems and data.",
                controls: "14 Controls",
              },
              {
                title: "Cryptography",
                description:
                  "End-to-end encryption, key management, and cryptographic controls for data protection and secure communications.",
                controls: "2 Controls",
              },
              {
                title: "Operations Security",
                description:
                  "Security monitoring, incident management, and operational procedures to maintain system security and availability.",
                controls: "14 Controls",
              },
            ].map((control, index) => (
              <div
                key={index}
                className="bg-[rgba(15,23,42,0.8)] backdrop-blur p-6 rounded-xl border border-[rgb(var(--primary))]/20 hover:border-[rgb(var(--primary))]/30 transition-all duration-300"
              >
                <h3 className="text-lg font-semibold mb-3 text-[rgb(var(--primary))]">
                  {control.title}
                </h3>
                <p className="text-[rgb(var(--gray))] text-sm mb-4">
                  {control.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[rgb(var(--gray))]">
                    Controls
                  </span>
                  <span className="text-[rgb(var(--primary))] text-sm font-semibold">
                    {control.controls}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Risk Management */}
      <section className="px-[5%] py-16">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center text-[rgb(var(--primary))]">
            Risk Management Process
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                title: "Risk Identification",
                description:
                  "Systematic identification of information security risks across all business processes and systems.",
                icon: "🔍",
              },
              {
                title: "Risk Assessment",
                description:
                  "Quantitative and qualitative analysis of identified risks to determine impact and likelihood.",
                icon: "📊",
              },
              {
                title: "Risk Treatment",
                description:
                  "Implementation of appropriate controls and measures to mitigate or accept identified risks.",
                icon: "🛡️",
              },
              {
                title: "Risk Monitoring",
                description:
                  "Continuous monitoring and review of risk landscape and effectiveness of implemented controls.",
                icon: "📈",
              },
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="text-lg font-semibold mb-3 text-[rgb(var(--primary))]">
                  {step.title}
                </h3>
                <p className="text-[rgb(var(--gray))] text-sm">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-[5%] py-12 bg-[rgb(var(--darker))] border-t border-[rgba(var(--primary),0.1)]">
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
              href="/compliance/security-clearance"
              className="text-[rgb(var(--primary))] hover:underline"
            >
              Security Clearance
            </Link>
          </div>
          <p className="text-[rgb(var(--gray))] text-sm">
            ISO 27001 certification ensures international standards for
            information security management.
          </p>
        </div>
      </footer>
    </main>
  );
}
