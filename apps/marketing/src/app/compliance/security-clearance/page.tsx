"use client";
import Link from "next/link";
import * as React from "react";
import { Footer } from "../../../components/Footer";
import { Navigation } from "../../../components/Navigation";
import styles from "../compliance-subpage.module.css";

export default function SecurityClearancePage(): React.ReactElement {
  return (
    <main className={styles.main}>
      <Navigation />

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContainer}>
          <h1 className={styles.heroTitle}>
            <span className={styles.heroTitleGradient}>Security Clearance</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Personnel security clearance framework for classified operations and
            sensitive defense technology
          </p>
        </div>
      </section>

      {/* Security Clearance Overview */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.grid2Cols}>
            <div>
              <h2 className={styles.sectionTitle}>
                Personnel Security Framework
              </h2>
              <p className={styles.sectionText}>
                Phoenix Rooivalk maintains comprehensive security clearance
                protocols for all personnel involved in classified operations.
                Our security framework ensures:
              </p>
              <ul className={styles.checkList}>
                <li className={styles.checkListItem}>
                  <span className={styles.checkIcon}>✓</span>
                  Background investigation and vetting
                </li>
                <li className={styles.checkListItem}>
                  <span className={styles.checkIcon}>✓</span>
                  Continuous monitoring and evaluation
                </li>
                <li className={styles.checkListItem}>
                  <span className={styles.checkIcon}>✓</span>
                  Need-to-know access controls
                </li>
                <li className={styles.checkListItem}>
                  <span className={styles.checkIcon}>✓</span>
                  Security training and awareness
                </li>
                <li className={styles.checkListItem}>
                  <span className={styles.checkIcon}>✓</span>
                  Incident reporting and investigation
                </li>
              </ul>
            </div>
            <div className={styles.infoCard}>
              <h3 className={styles.infoCardTitle}>Clearance Levels</h3>
              <div className={styles.requirementsList}>
                <div className={styles.clearanceLevelItem}>
                  <span className={styles.clearanceLevelName}>
                    Confidential
                  </span>
                  <span className={styles.statusPlanned}>Planned</span>
                </div>
                <div className={styles.clearanceLevelItem}>
                  <span className={styles.clearanceLevelName}>Secret</span>
                  <span className={styles.statusPlanned}>Planned</span>
                </div>
                <div className={styles.clearanceLevelItem}>
                  <span className={styles.clearanceLevelName}>Top Secret</span>
                  <span className={styles.statusPlanned}>Planned</span>
                </div>
                <div className={styles.clearanceLevelItem}>
                  <span className={styles.clearanceLevelName}>SCI</span>
                  <span className={styles.statusPlanned}>Planned</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clearance Process */}
      <section className={styles.sectionGradient}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitleCenter}>
            Security Clearance Process
          </h2>
          <div className={styles.grid4Cols}>
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
              <div key={index} className={styles.processCard}>
                <div className={styles.processCardHeader}>
                  <div className={styles.processNumber}>{index + 1}</div>
                  <h3 className={styles.processTitle}>{step.title}</h3>
                </div>
                <p className={styles.processDescription}>{step.description}</p>
                <div className={styles.processDuration}>
                  <span className={styles.processDurationLabel}>Duration</span>
                  <div className={styles.processDurationValue}>
                    {step.duration}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Measures */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitleCenter}>
            Security Measures & Controls
          </h2>
          <div className={styles.grid2Cols}>
            <div>
              <h3 className={styles.subsectionTitle}>Physical Security</h3>
              <ul className={styles.checkList}>
                {[
                  "Secure facility access controls",
                  "Biometric authentication systems",
                  "Classified material handling procedures",
                  "Visitor screening and escort protocols",
                  "Secure communication systems",
                ].map((measure, index) => (
                  <li key={index} className={styles.checkListItem}>
                    <span className={styles.checkIcon}>🔒</span>
                    {measure}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className={styles.subsectionTitle}>Information Security</h3>
              <ul className={styles.checkList}>
                {[
                  "Encrypted data transmission",
                  "Secure document classification",
                  "Access control matrices",
                  "Audit logging and monitoring",
                  "Incident response procedures",
                ].map((measure, index) => (
                  <li key={index} className={styles.checkListItem}>
                    <span className={styles.checkIcon}>🛡️</span>
                    {measure}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
