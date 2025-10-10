import { downloadWhitepaper } from "@phoenix-rooivalk/utils";
import React from "react";
import { RevealSection } from "../RevealSection";
import { Section, SectionContainer } from "../layouts";
import { Grid } from "../layouts/Grid";
import { Badge, Button, Card } from "../ui";
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
    <Section background="gradient">
      <SectionContainer centered>
        <RevealSection>
          <Badge variant="gradient">
            📋 COMPREHENSIVE TECHNICAL DOCUMENTATION
          </Badge>
          <h2 className={styles.title}>
            Get the Complete Technical Whitepaper
          </h2>
          <p className={styles.description}>
            Download our detailed technical documentation covering system
            architecture, security implementation, deployment configurations,
            and performance specifications.
          </p>

          <Grid columns={{ mobile: 1, tablet: 2, desktop: 4 }} gap="lg">
            {features.map((feature, index) => (
              <Card key={index} {...feature} />
            ))}
          </Grid>

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
      </SectionContainer>
    </Section>
  );
};
