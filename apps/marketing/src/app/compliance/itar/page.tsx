"use client";
import Link from "next/link";
import * as React from "react";
import { Navigation } from "../../../components/Navigation";

export default function ITARCompliancePage(): React.ReactElement {
  return (
    <main className="relative overflow-hidden bg-[rgb(var(--darker))] text-white">
      <Navigation />

      {/* Hero Section */}
      <section className="px-[5%] py-20 bg-gradient-to-br from-[rgb(var(--darker))] via-[var(--dark)] to-[rgb(var(--darker))]">
        <div className="max-w-[1400px] mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--accent))]">
              ITAR Compliance
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-[rgb(var(--gray))] max-w-4xl mx-auto">
            International Traffic in Arms Regulations compliance framework for
            defense technology export controls
          </p>
        </div>
      </section>

      {/* ITAR Overview */}
      <section className="px-[5%] py-16">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-[rgb(var(--primary))]">
                ITAR Compliance Framework
              </h2>
              <p className="text-[rgb(var(--gray))] mb-6">
                Phoenix Rooivalk operates under strict ITAR compliance protocols
                to ensure all defense technology exports meet U.S. Department of
                State requirements. Our comprehensive framework includes:
              </p>
              <ul className="space-y-3 text-[rgb(var(--gray))]">
                <li className="flex items-start">
                  <span className="text-[rgb(var(--primary))] mr-3">✓</span>
                  Export license management and tracking
                </li>
                <li className="flex items-start">
                  <span className="text-[rgb(var(--primary))] mr-3">✓</span>
                  End-user verification and screening
                </li>
                <li className="flex items-start">
                  <span className="text-[rgb(var(--primary))] mr-3">✓</span>
                  Technical data protection protocols
                </li>
                <li className="flex items-start">
                  <span className="text-[rgb(var(--primary))] mr-3">✓</span>
                  Restricted party screening
                </li>
                <li className="flex items-start">
                  <span className="text-[rgb(var(--primary))] mr-3">✓</span>
                  Compliance training and certification
                </li>
              </ul>
            </div>
            <div className="bg-[rgba(var(--primary),0.1)] p-8 rounded-xl border border-[rgb(var(--primary))]/20">
              <h3 className="text-xl font-semibold mb-4 text-[rgb(var(--primary))]">
                Compliance Status
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[rgb(var(--gray))]">Export Licenses</span>
                  <span className="text-yellow-400 font-semibold">Planned</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[rgb(var(--gray))]">End-User Screening</span>
                  <span className="text-yellow-400 font-semibold">Planned</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[rgb(var(--gray))]">
                    Technical Data Controls
                  </span>
                  <span className="text-yellow-400 font-semibold">Planned</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[rgb(var(--gray))]">
                    Training Certification
                  </span>
                  <span className="text-yellow-400 font-semibold">Planned</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ITAR Requirements */}
      <section className="px-[5%] py-16 bg-[linear-gradient(180deg,rgba(var(--primary),0.05),transparent)]">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center text-[rgb(var(--primary))]">
            ITAR Requirements & Controls
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Export License Management",
                description:
                  "Comprehensive tracking and management of all export licenses with automated compliance monitoring and renewal alerts.",
                status: "Planned",
              },
              {
                title: "End-User Verification",
                description:
                  "Advanced screening and verification processes for all end-users with continuous monitoring and risk assessment.",
                status: "Planned",
              },
              {
                title: "Technical Data Protection",
                description:
                  "Multi-layered security controls for technical data including encryption, access controls, and audit logging.",
                status: "Planned",
              },
            ].map((requirement, index) => (
              <div
                key={index}
                className="bg-[rgba(15,23,42,0.8)] backdrop-blur p-6 rounded-xl border border-[rgb(var(--primary))]/20 hover:border-[rgb(var(--primary))]/30 transition-all duration-300"
              >
                <h3 className="text-lg font-semibold mb-3 text-[rgb(var(--primary))]">
                  {requirement.title}
                </h3>
                <p className="text-[rgb(var(--gray))] text-sm mb-4">
                  {requirement.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[rgb(var(--gray))]">Status</span>
                  <span className="text-green-400 text-sm font-semibold">
                    {requirement.status}
                  </span>
                </div>
              </div>
            ))}
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
              href="/compliance/iso-27001"
              className="text-[rgb(var(--primary))] hover:underline"
            >
              ISO 27001
            </Link>
            <Link
              href="/compliance/security-clearance"
              className="text-[rgb(var(--primary))] hover:underline"
            >
              Security Clearance
            </Link>
          </div>
          <p className="text-[rgb(var(--gray))] text-sm">
            ITAR compliance is maintained through continuous monitoring and
            regular audits.
          </p>
        </div>
      </footer>
    </main>
  );
}
