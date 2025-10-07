"use client";
import Link from "next/link";
import * as React from "react";
import { useEffect, useState } from "react";

export default function ContactPage(): React.ReactElement {
  const [email, setEmail] = useState("");

  // Obfuscate email at render time to prevent scraping
  useEffect(() => {
    const user = "smit.jurie";
    const domain = "gmail.com";
    setEmail(`${user}@${domain}`);
  }, []);

  const handleEmailClick = (subject?: string, body?: string) => {
    if (!email) return;
    const params = new URLSearchParams();
    if (subject) params.append("subject", subject);
    if (body) params.append("body", body);
    const queryString = params.toString();
    window.location.href = `mailto:${email}${queryString ? "?" + queryString : ""}`;
  };

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
              <Link href="/technical" className="hover:text-[rgb(var(--primary))]">
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
              Contact Phoenix Rooivalk
            </h1>
            <p className="text-[rgb(var(--gray))] mt-4 max-w-3xl mx-auto">
              Interested in the Phoenix Rooivalk concept? Get in touch for
              partnership opportunities, investment discussions, and design
              collaboration.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="px-[5%] py-16">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="rounded-xl border border-[rgba(0,255,136,0.2)] bg-[rgba(15,23,42,0.8)] backdrop-blur p-8">
              <h2 className="text-2xl font-bold mb-6 text-[rgb(var(--primary))]">
                Get in Touch
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Primary Contact</h3>
                  <p className="text-[rgb(var(--gray))]">
                    <strong>Jurie Smit</strong>
                    <br />
                    PhoenixVC
                    <br />
                    <button
                      onClick={() => handleEmailClick()}
                      className="text-[rgb(var(--primary))] hover:underline cursor-pointer bg-transparent border-none p-0 font-inherit"
                      disabled={!email}
                    >
                      {email || "Loading..."}
                    </button>
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Concept Discussion</h3>
                  <p className="text-[rgb(var(--gray))]">
                    Discuss the Phoenix Rooivalk concept, technical
                    architecture, and potential applications in your operational
                    environment.
                  </p>
                  <button
                    onClick={() =>
                      handleEmailClick(
                        "Phoenix Rooivalk Concept Discussion",
                        "I would like to discuss the Phoenix Rooivalk concept and explore potential collaboration opportunities.",
                      )
                    }
                    className="inline-block mt-3 rounded bg-gradient-to-br from-[rgb(var(--primary))] to-[rgb(var(--secondary))] px-4 py-2 font-bold text-[rgb(var(--dark))] shadow-glow hover:-translate-y-0.5 transition disabled:opacity-50"
                    disabled={!email}
                  >
                    Request Intro Call
                  </button>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Investment & Funding</h3>
                  <p className="text-[rgb(var(--gray))]">
                    Interested in funding opportunities, SBIR collaboration, or
                    early-stage investment? Contact us to discuss partnership
                    and funding opportunities.
                  </p>
                  <button
                    onClick={() =>
                      handleEmailClick("Phoenix Rooivalk Investment Inquiry")
                    }
                    className="inline-block mt-3 rounded border-2 border-[rgb(var(--primary))] px-4 py-2 font-bold text-[rgb(var(--primary))] hover:bg-[var(--primary)] hover:text-[rgb(var(--dark))] transition disabled:opacity-50"
                    disabled={!email}
                  >
                    Investment Inquiry
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[rgba(0,255,136,0.2)] bg-[rgba(15,23,42,0.8)] backdrop-blur p-8">
              <h2 className="text-2xl font-bold mb-6 text-[rgb(var(--primary))]">
                Market Exploration
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3 text-[rgb(var(--text-primary))]">
                    Alternative Applications Under Exploration
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="text-sm">
                        <div className="font-semibold text-[rgb(var(--action-primary))] mb-1">
                          Civilian Applications
                        </div>
                        <ul className="text-[rgb(var(--text-muted))] space-y-1">
                          <li>• Airport security & perimeter protection</li>
                          <li>• Critical infrastructure monitoring</li>
                          <li>• Event security & crowd safety</li>
                          <li>• Border security applications</li>
                        </ul>
                      </div>
                      <div className="text-sm">
                        <div className="font-semibold text-[rgb(var(--action-primary))] mb-1">
                          Commercial Security
                        </div>
                        <ul className="text-[rgb(var(--text-muted))] space-y-1">
                          <li>• Corporate campus protection</li>
                          <li>• Data center security</li>
                          <li>• Port & shipping terminal security</li>
                          <li>• VIP protection services</li>
                        </ul>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="text-sm" id="partnerships">
                        <div className="font-semibold text-[rgb(var(--action-primary))] mb-1">
                          Research Partnerships
                        </div>
                        <ul className="text-[rgb(var(--text-muted))] space-y-1">
                          <li>• University research collaboration</li>
                          <li>• Government laboratory partnerships</li>
                          <li>• International cooperation (NATO)</li>
                          <li>• Technology transfer programs</li>
                        </ul>
                      </div>
                      <div className="text-sm">
                        <div className="font-semibold text-[rgb(var(--action-primary))] mb-1">
                          Technology Licensing
                        </div>
                        <ul className="text-[rgb(var(--text-muted))] space-y-1">
                          <li>• Sensor fusion algorithms</li>
                          <li>• Edge processing capabilities</li>
                          <li>• Blockchain evidence systems</li>
                          <li>• Countermeasure technologies</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-[rgb(var(--action-warning))]/10 border border-[rgb(var(--action-warning))]/20 rounded-lg">
                    <p className="text-xs text-[rgb(var(--action-warning))] text-center font-semibold">
                      💡 These are potential applications under exploration.
                      Actual deployment would require regulatory approval,
                      market validation, and technology adaptation for specific
                      use cases.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[rgba(0,255,136,0.2)] bg-[rgba(15,23,42,0.8)] backdrop-blur p-8">
              <h2 className="text-2xl font-bold mb-6 text-[rgb(var(--primary))]">
                Access Requirements
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">
                    Restricted Partner Access
                  </h3>
                  <p className="text-[rgb(var(--gray))] text-sm">
                    This repository and associated artifacts are intended for
                    approved defense partners only. Redistribution or public
                    disclosure is prohibited without written authorization.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Who Can Apply</h3>
                  <ul className="text-[rgb(var(--gray))] text-sm space-y-1">
                    <li>• Government agencies with lawful mandates</li>
                    <li>• Defense integrators and contractors</li>
                    <li>• Vetted industrial partners</li>
                    <li>• Critical infrastructure operators</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Required Information</h3>
                  <ul className="text-[rgb(var(--gray))] text-sm space-y-1">
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
          <h2 className="text-2xl font-bold mb-8 text-center text-[rgb(var(--primary))]">
            Explore Phoenix Rooivalk
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link
              href="/technical"
              className="rounded-xl border border-[rgba(0,255,136,0.2)] bg-[rgba(15,23,42,0.8)] backdrop-blur p-6 hover:-translate-y-1 transition block"
            >
              <h3 className="text-lg font-semibold mb-2 text-[rgb(var(--primary))]">
                Technical Specifications
              </h3>
              <p className="text-[rgb(var(--gray))] text-sm">
                Multi-sensor detection, neutralization modules, and deployment
                configurations.
              </p>
            </Link>
            <Link
              href="/financial"
              className="rounded-xl border border-[rgba(0,255,136,0.2)] bg-[rgba(15,23,42,0.8)] backdrop-blur p-6 hover:-translate-y-1 transition block"
            >
              <h3 className="text-lg font-semibold mb-2 text-[rgb(var(--primary))]">
                Financial Projections
              </h3>
              <p className="text-[rgb(var(--gray))] text-sm">
                Revenue forecasts, break-even analysis, and investment
                allocation details.
              </p>
            </Link>
            <Link
              href="/compliance"
              className="rounded-xl border border-[rgba(0,255,136,0.2)] bg-[rgba(15,23,42,0.8)] backdrop-blur p-6 hover:-translate-y-1 transition block"
            >
              <h3 className="text-lg font-semibold mb-2 text-[rgb(var(--primary))]">
                Compliance & Security
              </h3>
              <p className="text-[rgb(var(--gray))] text-sm">
                ITAR compliance, ISO certifications, and blockchain security
                framework.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Careers Section */}
      <section id="careers" className="px-[5%] py-16">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center text-[rgb(var(--primary))]">
            Career Opportunities
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="rounded-xl border border-[rgba(0,255,136,0.2)] bg-[rgba(15,23,42,0.8)] backdrop-blur p-8">
              <h3 className="text-xl font-bold mb-4 text-[rgb(var(--primary))]">
                Current Openings
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 text-[rgb(var(--text-primary))]">
                    Senior Software Engineer
                  </h4>
                  <p className="text-[rgb(var(--gray))] text-sm mb-2">
                    Lead development of counter-drone defense algorithms and
                    blockchain evidence systems.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-[rgba(var(--primary),0.2)] text-[rgb(var(--primary))] text-xs rounded">
                      TypeScript
                    </span>
                    <span className="px-2 py-1 bg-[rgba(var(--primary),0.2)] text-[rgb(var(--primary))] text-xs rounded">
                      Rust
                    </span>
                    <span className="px-2 py-1 bg-[rgba(var(--primary),0.2)] text-[rgb(var(--primary))] text-xs rounded">
                      Blockchain
                    </span>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-[rgb(var(--text-primary))]">
                    Defense Systems Engineer
                  </h4>
                  <p className="text-[rgb(var(--gray))] text-sm mb-2">
                    Design and implement RF jamming and GPS spoofing
                    countermeasures.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-[rgba(var(--primary),0.2)] text-[rgb(var(--primary))] text-xs rounded">
                      RF Engineering
                    </span>
                    <span className="px-2 py-1 bg-[rgba(var(--primary),0.2)] text-[rgb(var(--primary))] text-xs rounded">
                      Signal Processing
                    </span>
                    <span className="px-2 py-1 bg-[rgba(var(--primary),0.2)] text-[rgb(var(--primary))] text-xs rounded">
                      Military Systems
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[rgba(0,255,136,0.2)] bg-[rgba(15,23,42,0.8)] backdrop-blur p-8">
              <h3 className="text-xl font-bold mb-4 text-[rgb(var(--primary))]">
                Application Process
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 text-[rgb(var(--text-primary))]">
                    Requirements
                  </h4>
                  <ul className="text-[rgb(var(--gray))] text-sm space-y-1">
                    <li>• Security clearance eligibility</li>
                    <li>• Relevant technical background</li>
                    <li>• Defense industry experience preferred</li>
                    <li>• Strong problem-solving skills</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-[rgb(var(--text-primary))]">
                    Next Steps
                  </h4>
                  <p className="text-[rgb(var(--gray))] text-sm mb-3">
                    Submit your application with CV and cover letter detailing
                    your relevant experience.
                  </p>
                  <button
                    onClick={() =>
                      handleEmailClick(
                        "Career Application",
                        "I am interested in career opportunities at Phoenix Rooivalk. Please find my application attached.",
                      )
                    }
                    className="w-full bg-[rgb(var(--primary))] text-black font-semibold py-3 px-6 rounded-lg hover:bg-[rgb(var(--primary))]/90 transition-colors"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
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
              href="/technical"
              className="text-[rgb(var(--primary))] hover:underline mr-6"
            >
              Technical
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
