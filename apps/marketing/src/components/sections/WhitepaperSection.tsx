import { downloadWhitepaper } from "@phoenix-rooivalk/utils";
import React from "react";
import { RevealSection } from "../RevealSection";
import { Button } from "../ui/button";
import { Card } from "../ui/Card";
import styles from "./WhitepaperSection.module.css";

export const WhitepaperSection: React.FC = () => {
  const features = [
    {
      icon: "🏗️",
      title: "System Architecture",
      description: "Complete technical design and component integration",
      colorVariant: "green" as const,
    },
    {
      icon: "🔒",
      title: "Security Framework",
      description: "Blockchain security and compliance standards",
      colorVariant: "blue" as const,
    },
    {
      icon: "📊",
      title: "Performance Metrics",
      description: "Detailed benchmarks and testing results",
      colorVariant: "purple" as const,
    },
    {
      icon: "🚀",
      title: "Deployment Guide",
      description: "Implementation and configuration instructions",
      colorVariant: "yellow" as const,
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
              <Card key={index} {...feature} />
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
