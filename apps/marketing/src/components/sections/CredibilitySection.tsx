import React from "react";
import { RevealSection } from "../RevealSection";
import { Card } from "../ui/Card";
import styles from "./CredibilitySection.module.css";

export const CredibilitySection: React.FC = () => {
  const cards = [
    {
      icon: "🔬",
      title: "Prototype Phase",
      description: "Core architecture validated in controlled environments",
    },
    {
      icon: "🚀",
      title: "SBIR Strategy",
      description: "Air Force SBIR Phase I application ($350K) in progress",
    },
    {
      icon: "🛡️",
      title: "DoD Compliance",
      description: "CMMC 2.0 Level 2 certification pathway",
    },
    {
      icon: "🤝",
      title: "Partnership Ready",
      description: "Seeking Anduril integration and defense contractor partnerships",
    },
  ];

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
          {cards.map((card, index) => (
            <Card key={index} {...card} />
          ))}
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
