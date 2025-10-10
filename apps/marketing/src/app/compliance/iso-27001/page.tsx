"use client";
import Link from "next/link";
import * as React from "react";
import { Footer } from "../../../components/Footer";
import { Navigation } from "../../../components/Navigation";
import styles from "../compliance-subpage.module.css";

export default function ISO27001Page(): React.ReactElement {
  return (
    <main className={styles.main}>
      <Navigation />

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.container}>
          <h1 className={styles.title}>
            <span className={styles.titleGradient}>
              ISO 27001 Certification
            </span>
          </h1>
          <p className={styles.subtitle}>
            International standard for information security management systems
          </p>
        </div>
      </section>

      {/* ISO 27001 Overview */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.grid2Cols}>
            <div>
              <h2 className={styles.subsectionTitle}>
                Information Security Management
              </h2>
              <p className={styles.description}>
                Phoenix Rooivalk maintains ISO 27001 certification ensuring
                comprehensive information security management across all
                operations. Our ISMS framework provides:
              </p>
              <ul className={styles.requirementsList}>
                <li className={styles.clearanceLevelItem}>
                  <span className={styles.checkMark}>✓</span>
                  Risk assessment and management
                </li>
                <li className={styles.clearanceLevelItem}>
                  <span className={styles.checkMark}>✓</span>
                  Security policy implementation
                </li>
                <li className={styles.clearanceLevelItem}>
                  <span className={styles.checkMark}>✓</span>
                  Access control and authentication
                </li>
                <li className={styles.clearanceLevelItem}>
                  <span className={styles.checkMark}>✓</span>
                  Incident response procedures
                </li>
                <li className={styles.clearanceLevelItem}>
                  <span className={styles.checkMark}>✓</span>
                  Continuous improvement processes
                </li>
              </ul>
            </div>
            <div className={styles.statusCard}>
              <h3 className={styles.statusCardTitle}>Certification Status</h3>
              <div className={styles.statusCardContent}>
                <div className={styles.statusItem}>
                  <span className={styles.statusLabel}>Certification</span>
                  <span className={styles.statusBadgePlanned}>Planned</span>
                </div>
                <div className={styles.statusItem}>
                  <span className={styles.statusLabel}>Target Date</span>
                  <span className={styles.statusBadgePlanned}>Q4 2025</span>
                </div>
                <div className={styles.statusItem}>
                  <span className={styles.statusLabel}>Implementation</span>
                  <span className={styles.statusBadgePlanned}>In Progress</span>
                </div>
                <div className={styles.statusItem}>
                  <span className={styles.statusLabel}>Next Milestone</span>
                  <span className={styles.statusBadgePlanned}>Q2 2025</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Controls */}
      <section className={styles.sectionGradient}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitleCenter}>
            Security Control Framework
          </h2>
          <div className={styles.grid3Cols}>
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
              <div key={index} className={styles.requirementCard}>
                <h3 className={styles.requirementTitle}>{control.title}</h3>
                <p className={styles.requirementDescription}>
                  {control.description}
                </p>
                <div className={styles.requirementMeta}>
                  <span className={styles.requirementLabel}>Controls</span>
                  <span className={styles.requirementValue}>
                    {control.controls}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Risk Management */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitleCenter}>Risk Management Process</h2>
          <div className={styles.grid4Cols}>
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
              <div key={index} className={styles.processCard}>
                <div className={styles.processIcon}>{step.icon}</div>
                <h3 className={styles.processTitle}>{step.title}</h3>
                <p className={styles.processDescription}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
