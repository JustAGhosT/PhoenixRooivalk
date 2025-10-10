import { downloadWhitepaper } from "@phoenix-rooivalk/utils";
import React from "react";
import { RevealSection } from "../RevealSection";
import { Button } from "../ui/button";
import styles from "./WhitepaperSection.module.css";

export const WhitepaperSection: React.FC = () => {
  const features: Array<{
    icon: string;
    title: string;
    description: string;
    color: "green" | "blue" | "purple" | "yellow";
  }> = [
    {
      icon: "🏗️",
      title: "System Architecture",
      description: "Complete technical design and component integration",
      color: "green",
    },
    {
      icon: "🔒",
      title: "Security Framework",
      description: "Blockchain security and compliance standards",
      color: "blue",
    },
    {
      icon: "📊",
      title: "Performance Metrics",
      description: "Detailed benchmarks and testing results",
      color: "purple",
    },
    {
      icon: "🚀",
      title: "Deployment Guide",
      description: "Implementation and configuration instructions",
      color: "yellow",
    },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <RevealSection>
          <div className={styles.badge}>
            📋 COMPREHENSIVE TECHNICAL DOCUMENTATION
          </div>
          <h2 className={styles.title}>
            Get the Complete Technical Whitepaper
          </h2>
          <p className={styles.description}>
            Download our detailed technical documentation covering system
            architecture, security implementation, deployment configurations,
            and performance specifications.
          </p>

          <div className={styles.grid}>
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                color={feature.color}
              />
            ))}
          </div>

          <div className={styles.actions}>
            <Button
              onClick={() => downloadWhitepaper()}
              size="lg"
              className={styles.downloadButton}
            >
              📥 Download Technical Whitepaper
            </Button>
            <Button href="#contact" variant="ghost" size="lg">
              Request Full Documentation
            </Button>
          </div>
        </RevealSection>
      </div>
    </section>
  );
};

const FeatureCard: React.FC<{
  icon: string;
  title: string;
  description: string;
  color: "green" | "blue" | "purple" | "yellow";
}> = ({ icon, title, description, color }) => {
  const colorClass = `card${color.charAt(0).toUpperCase() + color.slice(1)}`;

  return (
    <div className={`${styles.card} ${styles[colorClass]}`}>
      <div className={styles.cardIcon}>{icon}</div>
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardDescription}>{description}</p>
    </div>
  );
};
