import React from "react";
import { RevealSection } from "../RevealSection";
import styles from "./MarketIntelligenceSection.module.css";

export const MarketIntelligenceSection: React.FC = () => {
  const marketData = [
    {
      metric: "$26B",
      label: "Market by 2030",
      description: "Counter-drone market growing from $2.3-4.5B to $9-26B",
    },
    {
      metric: "100x",
      label: "Performance Improvement",
      description: "<2ms vs 2-5 seconds for current systems",
    },
    {
      metric: "64%",
      label: "Market Vulnerability",
      description: "RF-dependent systems cannot detect autonomous drones",
    },
    {
      metric: "2-5s",
      label: "Current Latency",
      description: "Detection-to-engagement time for existing systems",
    },
  ];

  const competitors = [
    {
      name: "Anduril",
      status: "$14B valuation",
      capability: "Lattice OS integration, DoD contracts",
      limitation: "2-5 second latency, cloud dependency",
    },
    {
      name: "Fortem",
      status: "4,500+ drone kills in Ukraine",
      capability: "DroneHunter F700, battlefield-proven",
      limitation: "Kinetic only, no RF-silent detection",
    },
    {
      name: "DroneShield",
      status: "700+ global deployments",
      capability: "Electronic warfare, cost-effective",
      limitation: "RF-dependent, no kinetic capability",
    },
  ];

  return (
    <section className={styles.section} id="market">
      <div className={styles.container}>
        <RevealSection className={styles.header}>
          <h2 className={styles.title}>
            Market Opportunity & Competitive Position
          </h2>
          <p className={styles.description}>
            Phoenix Rooivalk addresses critical gaps in the $26B counter-drone
            market with SAE Level 4 autonomous architecture
          </p>
        </RevealSection>

        {/* Market Metrics */}
        <RevealSection className={styles.subsection}>
          <h3 className={styles.subsectionTitle}>Market Intelligence</h3>
          <div className={styles.metricsGrid}>
            {marketData.map((data, index) => (
              <div key={index} className={styles.metricCard}>
                <div className={styles.metricValue}>{data.metric}</div>
                <div className={styles.metricLabel}>{data.label}</div>
                <div className={styles.metricDescription}>
                  {data.description}
                </div>
              </div>
            ))}
          </div>
        </RevealSection>

        {/* Competitive Analysis */}
        <RevealSection>
          <h3 className={styles.subsectionTitle}>Competitive Landscape</h3>
          <div className={styles.competitorsGrid}>
            {competitors.map((competitor, index) => (
              <div key={index} className={styles.competitorCard}>
                <div className={styles.competitorName}>{competitor.name}</div>
                <div className={styles.competitorStatus}>
                  {competitor.status}
                </div>
                <div className={styles.competitorCapability}>
                  <strong>Strengths:</strong> {competitor.capability}
                </div>
                <div className={styles.competitorLimitation}>
                  <strong>Limitations:</strong> {competitor.limitation}
                </div>
              </div>
            ))}
          </div>
        </RevealSection>

        {/* Phoenix Advantage */}
        <RevealSection className={styles.advantageSection}>
          <div className={styles.advantageCard}>
            <h3 className={styles.advantageTitle}>
              Phoenix Rooivalk Advantage
            </h3>
            <div className={styles.advantageGrid}>
              <div className={styles.advantageItem}>
                <div className={styles.advantageItemTitle}>Speed</div>
                <div className={styles.advantageItemDescription}>
                  &lt;2ms latency vs 2-5 seconds for competitors
                </div>
              </div>
              <div className={styles.advantageItem}>
                <div className={styles.advantageItemTitle}>Autonomy</div>
                <div className={styles.advantageItemDescription}>
                  Complete edge operation without communications
                </div>
              </div>
              <div className={styles.advantageItem}>
                <div className={styles.advantageItemTitle}>Accountability</div>
                <div className={styles.advantageItemDescription}>
                  Blockchain-verified engagement records
                </div>
              </div>
            </div>
          </div>
        </RevealSection>
      </div>
    </section>
  );
};
