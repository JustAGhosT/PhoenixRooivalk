import React from "react";
import { RevealSection } from "../RevealSection";
import { Button } from "../ui/button";
import { FeatureCard } from "../ui/FeatureCard";
import styles from "./UkraineChallengeSection.module.css";

export const UkraineChallengeSection: React.FC = () => {
  return (
    <section className={styles.section} id="ukraine-challenge">
      <div className={styles.container}>
        <RevealSection className={styles.header}>
          <div className={styles.urgentBadge}>URGENT: 18-Month Deadline</div>
          <h2 className={styles.title}>The 2027 Autonomous Warfare Race</h2>
          <p className={styles.description}>
            Ukraine faces an existential challenge: outpace Russia in autonomous
            warfare by 2027 or lose their technological advantage. Current AI
            drones fail 30-40% of the time, confusing trees for tanks and
            struggling against electronic warfare.
          </p>
        </RevealSection>

        <RevealSection className={styles.grid}>
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Current Problems</h3>
            <div className={styles.cards}>
              <FeatureCard
                icon="❌"
                title="False Positives"
                description='"Puddles get mistaken for tanks, trees confuse targeting"'
                className={styles.problemCard}
              />
              <FeatureCard
                icon="📡"
                title="EW Vulnerability"
                description='"Hit rates declining as electronic warfare evolves faster"'
                className={styles.problemCard}
              />
              <FeatureCard
                icon="🐝"
                title="Swarm Coordination"
                description="Russia's drones coordinate in groups of six, Ukraine's hunt alone"
                className={styles.problemCard}
              />
            </div>
          </div>

          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Phoenix Rooivalk Solutions</h3>
            <div className={styles.cards}>
              <FeatureCard
                icon="✅"
                title="Multi-Sensor Fusion"
                description="RF + acoustic + optical sensors eliminate environmental confusion"
                className={styles.solutionCard}
              />
              <FeatureCard
                icon="🔗"
                title="Blockchain Coordination"
                description="Tamper-proof swarm coordination resistant to EW attacks"
                className={styles.solutionCard}
              />
              <FeatureCard
                icon="⚡"
                title="Ready Today"
                description="Deployable now, 18 months ahead of the 2027 deadline"
                className={styles.solutionCard}
              />
            </div>
          </div>
        </RevealSection>

        <RevealSection className={styles.stakesSection}>
          <div className={styles.stakesCard}>
            <h3 className={styles.stakesTitle}>The Stakes</h3>
            <p className={styles.stakesText}>
              &quot;Ukraine&apos;s entire war strategy hinges on this race.
              They&apos;ve survived three years by being smarter, not stronger.
              If they lose the AI warfare competition, they lose their main
              advantage over Russia&apos;s superior numbers.&quot;
            </p>
            <div className={styles.actions}>
              <Button href="#contact" size="lg">
                Schedule Urgent Demo
              </Button>
              <Button
                href="mailto:smit.jurie@gmail.com?subject=Phoenix%20Rooivalk%20-%20Ukraine%20Defense%20Inquiry"
                variant="ghost"
                size="lg"
              >
                Defense Partnership Inquiry
              </Button>
            </div>
          </div>
        </RevealSection>
      </div>
    </section>
  );
};
