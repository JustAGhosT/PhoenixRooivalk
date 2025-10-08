"use client";
import Link from "next/link";
import * as React from "react";
import { useEffect, useState } from "react";
import styles from "./contact.module.css";

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
    <main className={styles.pageContainer}>
      {/* Background */}
      <div className={styles.backgroundWrapper}>
        <div className={styles.gridPattern} />
      </div>

      {/* Nav */}
      <nav className={styles.nav}>
        <div className={styles.navContainer}>
          <Link href="/" className={styles.navLogo}>
            Phoenix Rooivalk
          </Link>
          <ul className={styles.navList}>
            <li>
              <Link href="/" className={styles.navLink}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/technical" className={styles.navLink}>
                Technical
              </Link>
            </li>
            <li>
              <Link href="/financial" className={styles.navLink}>
                Financial
              </Link>
            </li>
            <li>
              <Link href="/compliance" className={styles.navLink}>
                Compliance
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Header */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.headerContainer}>
            <h1 className={styles.pageTitle}>Contact Phoenix Rooivalk</h1>
            <p className={styles.pageSubtitle}>
              Interested in the Phoenix Rooivalk concept? Get in touch for
              partnership opportunities, investment discussions, and design
              collaboration.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.grid}>
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Get in Touch</h2>
              <div className={styles.contentGroup}>
                <div>
                  <h3 className={styles.subsectionTitle}>Primary Contact</h3>
                  <p className={styles.subsectionText}>
                    <strong>Jurie Smit</strong>
                    <br />
                    PhoenixVC
                    <br />
                    <button
                      onClick={() => handleEmailClick()}
                      className={styles.emailButton}
                      disabled={!email}
                    >
                      {email || "Loading..."}
                    </button>
                  </p>
                </div>
                <div>
                  <h3 className={styles.subsectionTitle}>Concept Discussion</h3>
                  <p className={styles.subsectionText}>
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
                    className={styles.primaryButton}
                    disabled={!email}
                  >
                    Request Intro Call
                  </button>
                </div>
                <div>
                  <h3 className={styles.subsectionTitle}>Investment & Funding</h3>
                  <p className={styles.subsectionText}>
                    Interested in funding opportunities, SBIR collaboration, or
                    early-stage investment? Contact us to discuss partnership
                    and funding opportunities.
                  </p>
                  <button
                    onClick={() =>
                      handleEmailClick("Phoenix Rooivalk Investment Inquiry")
                    }
                    className={styles.secondaryButton}
                    disabled={!email}
                  >
                    Investment Inquiry
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Market Exploration</h2>
              <div className={styles.contentGroup}>
                <div>
                  <h3 className={styles.subsectionTitle}>
                    Alternative Applications Under Exploration
                  </h3>
                  <div className={styles.applicationsGrid}>
                    <div className={styles.applicationCategory}>
                      <div className={styles.listItem}>
                        <div className={styles.listItemTitle}>
                          Civilian Applications
                        </div>
                        <ul>
                          <li>• Airport security & perimeter protection</li>
                          <li>• Critical infrastructure monitoring</li>
                          <li>• Event security & crowd safety</li>
                          <li>• Border security applications</li>
                        </ul>
                      </div>
                      <div className={styles.listItem}>
                        <div className={styles.listItemTitle}>
                          Commercial Security
                        </div>
                        <ul>
                          <li>• Corporate campus protection</li>
                          <li>• Data center security</li>
                          <li>• Port & shipping terminal security</li>
                          <li>• VIP protection services</li>
                        </ul>
                      </div>
                    </div>
                    <div className={styles.applicationCategory}>
                      <div className={styles.listItem} id="partnerships">
                        <div className={styles.listItemTitle}>
                          Research Partnerships
                        </div>
                        <ul>
                          <li>• University research collaboration</li>
                          <li>• Government laboratory partnerships</li>
                          <li>• International cooperation (NATO)</li>
                          <li>• Technology transfer programs</li>
                        </ul>
                      </div>
                      <div className={styles.listItem}>
                        <div className={styles.listItemTitle}>
                          Technology Licensing
                        </div>
                        <ul>
                          <li>• Sensor fusion algorithms</li>
                          <li>• Edge processing capabilities</li>
                          <li>• Blockchain evidence systems</li>
                          <li>• Countermeasure technologies</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className={styles.warningBox}>
                    <p className={styles.warningText}>
                      💡 These are potential applications under exploration.
                      Actual deployment would require regulatory approval,
                      market validation, and technology adaptation for specific
                      use cases.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Access Requirements</h2>
              <div className={styles.contentGroup}>
                <div>
                  <h3 className={styles.subsectionTitle}>
                    Restricted Partner Access
                  </h3>
                  <p className={styles.listItem}>
                    This repository and associated artifacts are intended for
                    approved defense partners only. Redistribution or public
                    disclosure is prohibited without written authorization.
                  </p>
                </div>
                <div>
                  <h3 className={styles.subsectionTitle}>Who Can Apply</h3>
                  <ul className={styles.listItem}>
                    <li>• Government agencies with lawful mandates</li>
                    <li>• Defense integrators and contractors</li>
                    <li>• Vetted industrial partners</li>
                    <li>• Critical infrastructure operators</li>
                  </ul>
                </div>
                <div>
                  <h3 className={styles.subsectionTitle}>Required Information</h3>
                  <ul className={styles.listItem}>
                    <li>• Organization name and jurisdiction</li>
                    <li>• Intended evaluation scope and end use</li>
                    <li>• Points of contact and security lead</li>
                    <li>• Export control considerations</li>
                  </ul>
                </div>
                <div className={styles.complianceBox}>
                  <p className={styles.complianceText}>
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
      <section className={styles.quickLinksSection}>
        <div className={styles.container}>
          <h2 className={styles.quickLinksTitle}>Explore Phoenix Rooivalk</h2>
          <div className={styles.quickLinksGrid}>
            <Link href="/technical" className={styles.quickLinkCard}>
              <h3 className={styles.quickLinkTitle}>
                Technical Specifications
              </h3>
              <p className={styles.quickLinkText}>
                Multi-sensor detection, neutralization modules, and deployment
                configurations.
              </p>
            </Link>
            <Link href="/financial" className={styles.quickLinkCard}>
              <h3 className={styles.quickLinkTitle}>Financial Projections</h3>
              <p className={styles.quickLinkText}>
                Revenue forecasts, break-even analysis, and investment
                allocation details.
              </p>
            </Link>
            <Link href="/compliance" className={styles.quickLinkCard}>
              <h3 className={styles.quickLinkTitle}>Compliance & Security</h3>
              <p className={styles.quickLinkText}>
                ITAR compliance, ISO certifications, and blockchain security
                framework.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Careers Section */}
      <section id="careers" className={styles.careersSection}>
        <div className={styles.container}>
          <h2 className={styles.careersTitle}>Career Opportunities</h2>
          <div className={styles.careersGrid}>
            <div className={styles.careerCard}>
              <h3 className={styles.careerCardTitle}>Current Openings</h3>
              <div className={styles.contentGroup}>
                <div>
                  <h4 className={styles.jobTitle}>Senior Software Engineer</h4>
                  <p className={styles.jobDescription}>
                    Lead development of counter-drone defense algorithms and
                    blockchain evidence systems.
                  </p>
                  <div className={styles.tagContainer}>
                    <span className={styles.tag}>TypeScript</span>
                    <span className={styles.tag}>Rust</span>
                    <span className={styles.tag}>Blockchain</span>
                  </div>
                </div>
                <div>
                  <h4 className={styles.jobTitle}>Defense Systems Engineer</h4>
                  <p className={styles.jobDescription}>
                    Design and implement RF jamming and GPS spoofing
                    countermeasures.
                  </p>
                  <div className={styles.tagContainer}>
                    <span className={styles.tag}>RF Engineering</span>
                    <span className={styles.tag}>Signal Processing</span>
                    <span className={styles.tag}>Military Systems</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.careerCard}>
              <h3 className={styles.careerCardTitle}>Application Process</h3>
              <div className={styles.contentGroup}>
                <div>
                  <h4 className={styles.jobTitle}>Requirements</h4>
                  <ul className={styles.listItem}>
                    <li>• Security clearance eligibility</li>
                    <li>• Relevant technical background</li>
                    <li>• Defense industry experience preferred</li>
                    <li>• Strong problem-solving skills</li>
                  </ul>
                </div>
                <div>
                  <h4 className={styles.jobTitle}>Next Steps</h4>
                  <p className={styles.jobDescription}>
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
                    className={styles.applyButton}
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
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <p>
            © 2025 Phoenix Rooivalk. All rights reserved. | ITAR Compliance
            Planned | ISO 27001 Certification Planned
          </p>
          <div className={styles.footerLinks}>
            <Link href="/" className={styles.footerLink}>
              Home
            </Link>
            <Link href="/technical" className={styles.footerLink}>
              Technical
            </Link>
            <Link href="/financial" className={styles.footerLink}>
              Financial
            </Link>
            <Link href="/compliance" className={styles.footerLink}>
              Compliance
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
