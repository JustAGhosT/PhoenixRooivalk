"use client";
import Link from "next/link";
import * as React from "react";
import { Footer } from "../../../components/Footer";
import { Navigation } from "../../../components/Navigation";
import styles from "../compliance-subpage.module.css";

export default function ITARCompliancePage(): React.ReactElement {
  return (
    <main className={styles.main}>
      <Navigation />

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.container}>
          <h1 className={styles.title}>
            <span className={styles.titleGradient}>ITAR Compliance</span>
          </h1>
          <p className={styles.subtitle}>
            International Traffic in Arms Regulations compliance framework for
            defense technology export controls
          </p>
        </div>
      </section>

      {/* ITAR Overview */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.grid2Cols}>
            <div>
              <h2 className={styles.subsectionTitle}>
                ITAR Compliance Framework
              </h2>
              <p className={styles.description}>
                Phoenix Rooivalk operates under strict ITAR compliance protocols
                to ensure all defense technology exports meet U.S. Department of
                State requirements. Our comprehensive framework includes:
              </p>
              <ul className={styles.requirementsList}>
                <li className={styles.clearanceLevelItem}>
                  <span className={styles.checkMark}>✓</span>
                  Export license management and tracking
                </li>
                <li className={styles.clearanceLevelItem}>
                  <span className={styles.checkMark}>✓</span>
                  End-user verification and screening
                </li>
                <li className={styles.clearanceLevelItem}>
                  <span className={styles.checkMark}>✓</span>
                  Technical data protection protocols
                </li>
                <li className={styles.clearanceLevelItem}>
                  <span className={styles.checkMark}>✓</span>
                  Restricted party screening
                </li>
                <li className={styles.clearanceLevelItem}>
                  <span className={styles.checkMark}>✓</span>
                  Compliance training and certification
                </li>
              </ul>
            </div>
            <div className={styles.statusCard}>
              <h3 className={styles.statusCardTitle}>Compliance Status</h3>
              <div className={styles.statusCardContent}>
                <div className={styles.statusItem}>
                  <span className={styles.statusLabel}>Export Licenses</span>
                  <span className={styles.statusBadgePlanned}>Planned</span>
                </div>
                <div className={styles.statusItem}>
                  <span className={styles.statusLabel}>End-User Screening</span>
                  <span className={styles.statusBadgePlanned}>Planned</span>
                </div>
                <div className={styles.statusItem}>
                  <span className={styles.statusLabel}>
                    Technical Data Controls
                  </span>
                  <span className={styles.statusBadgePlanned}>Planned</span>
                </div>
                <div className={styles.statusItem}>
                  <span className={styles.statusLabel}>
                    Training Certification
                  </span>
                  <span className={styles.statusBadgePlanned}>Planned</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ITAR Requirements */}
      <section className={styles.sectionGradient}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitleCenter}>
            ITAR Requirements & Controls
          </h2>
          <div className={styles.grid3Cols}>
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
              <div key={index} className={styles.requirementCard}>
                <h3 className={styles.requirementTitle}>{requirement.title}</h3>
                <p className={styles.requirementDescription}>
                  {requirement.description}
                </p>
                <div className={styles.requirementMeta}>
                  <span className={styles.requirementLabel}>Status</span>
                  <span className={styles.requirementValue}>
                    {requirement.status}
                  </span>
                </div>
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
