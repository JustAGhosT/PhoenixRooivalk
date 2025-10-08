import React from "react";
import { RevealSection } from "../RevealSection";
import styles from "./CredibilitySection.module.css";

export const CredibilitySection: React.FC = () => {
  return (
    <section className={styles.section} id="credibility">
      <div className={styles.container}>
        <RevealSection className={styles.header}>
          <h2 className={styles.title}>Development Status</h2>
          <p className={styles.description}>
            Transparent development process with military-grade security
            standards
          </p>
        </RevealSection>

        <RevealSection className={styles.grid}>
          <div className={styles.card}>
            <div className={styles.cardIcon}>🔬</div>
            <h3 className={styles.cardTitle}>Prototype Phase</h3>
            <p className={styles.cardDescription}>
              Core architecture validated in controlled environments
            </p>
          </div>

          <div className={styles.card}>
            <div className={styles.cardIcon}>🚀</div>
            <h3 className={styles.cardTitle}>SBIR Strategy</h3>
            <p className={styles.cardDescription}>
              Air Force SBIR Phase I application ($350K) in progress
            </p>
          </div>

          <div className={styles.card}>
            <div className={styles.cardIcon}>🛡️</div>
            <h3 className={styles.cardTitle}>DoD Compliance</h3>
            <p className={styles.cardDescription}>
              CMMC 2.0 Level 2 certification pathway
            </p>
          </div>

          <div className={styles.card}>
            <div className={styles.cardIcon}>🤝</div>
            <h3 className={styles.cardTitle}>Partnership Ready</h3>
            <p className={styles.cardDescription}>
              Seeking Anduril integration and defense contractor partnerships
            </p>
          </div>
        </RevealSection>

        <RevealSection className={styles.advisorySection}>
          <div className={styles.advisoryCard}>
            <h3 className={styles.advisoryTitle}>Technical Advisory</h3>
            <p className={styles.advisoryText}>
              Development guided by defense industry veterans with expertise in
              counter-UAS systems, blockchain security, and military-grade
              software architecture.
            </p>
            <div className={styles.advisoryFooter}>
              Contact for technical advisory board information and partnership
              discussions
            </div>
          </div>
        </RevealSection>
      </div>
    </section>
  );
};
