import * as React from "react";
import { RevealSection } from "../RevealSection";
import styles from "./TechnicalIntegrationsSection.module.css";

export const TechnicalIntegrationsSection: React.FC = () => {
  const coreIntegrations = [
    {
      name: "Solana Blockchain",
      description: "Immutable evidence trails and legal compliance",
      icon: "⛓️",
      features: [
        "400ms transaction confirmation",
        "Tamper-proof evidence storage",
        "Legal compliance records",
        "Audit trail transparency",
      ],
      colorClass: "purple",
      status: "Live",
      tier: "Core",
    },
    {
      name: "Morpheus AI",
      description: "Enhanced threat analysis when network available",
      icon: "🤖",
      features: [
        "97% classification accuracy",
        "10-30s enhanced analysis",
        "Distributed model inference",
        "Optional cloud enhancement",
      ],
      colorClass: "green",
      status: "Beta",
      tier: "Enhanced",
    },
    {
      name: "Hivemapper Network",
      description: "Anti-spoofing protection and location validation",
      icon: "🗺️",
      features: [
        "Cross-node verification",
        "Economic incentives",
        "Anti-spoofing protection",
        "Network resilience",
      ],
      colorClass: "teal",
      status: "Planned",
      tier: "Enhanced",
    },
    {
      name: "Pinax Analytics",
      description: "Historical pattern analysis and compliance reporting",
      icon: "📊",
      features: [
        "99.9% uptime SLA",
        "Complex historical queries",
        "Pattern recognition",
        "Regulatory compliance",
      ],
      colorClass: "orange",
      status: "Planned",
      tier: "Strategic",
    },
  ];

  return (
    <section className={styles.section} id="integrations">
      <div className={styles.container}>
        <RevealSection>
          <div className={styles.header}>
            <h2 className={styles.title}>
              Core Technical Integrations
            </h2>
            <p className={styles.description}>
              Phoenix Rooivalk operates autonomously at the edge, with optional
              blockchain and AI enhancements when network connectivity is
              available. Core functionality never depends on external services.
            </p>
          </div>

          <div className={styles.grid}>
            {coreIntegrations.map((integration, _index) => (
              <div
                key={integration.name}
                className={`${styles.card} ${styles[`card${integration.colorClass.charAt(0).toUpperCase() + integration.colorClass.slice(1)}`]}`}
              >
                <div className={styles.badges}>
                  <span
                    className={`${styles.badge} ${
                      integration.status === "Live"
                        ? styles.badgeLive
                        : integration.status === "Beta"
                          ? styles.badgeBeta
                          : styles.badgePlanned
                    }`}
                  >
                    {integration.status}
                  </span>
                  <span
                    className={`${styles.badge} ${
                      integration.tier === "Core"
                        ? styles.badgeCore
                        : integration.tier === "Enhanced"
                          ? styles.badgeEnhanced
                          : styles.badgeStrategic
                    }`}
                  >
                    {integration.tier}
                  </span>
                </div>
                <div className={styles.cardContent}>
                  <div
                    className={`${styles.icon} ${styles[`icon${integration.colorClass.charAt(0).toUpperCase() + integration.colorClass.slice(1)}`]}`}
                  >
                    {integration.icon}
                  </div>
                  <div>
                    <h3 className={styles.cardTitle}>
                      {integration.name}
                    </h3>
                    <p className={styles.cardDescription}>
                      {integration.description}
                    </p>
                  </div>
                </div>

                <ul className={styles.featureList}>
                  {integration.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className={styles.featureItem}
                    >
                      <div
                        className={`${styles.featureBullet} ${styles[`featureBullet${integration.colorClass.charAt(0).toUpperCase() + integration.colorClass.slice(1)}`]}`}
                      ></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Technical Architecture Diagram */}
          <div className={styles.architectureDiagram}>
            <h3 className={styles.architectureTitle}>
              Three-Tier Defense Architecture
            </h3>
            <div className={styles.architectureGrid}>
              <div className={styles.architectureItem}>
                <div className={`${styles.architectureIcon} ${styles.architectureIconBlue}`}>
                  ⚡
                </div>
                <h4 className={styles.architectureItemTitle}>
                  Edge Processing
                </h4>
                <p className={styles.architectureItemSubtitle}>&lt;50ms response</p>
                <span className={`${styles.architectureItemBadge} ${styles.architectureItemBadgeCore}`}>
                  Core
                </span>
              </div>

              <div className={styles.architectureItem}>
                <div className={`${styles.architectureIcon} ${styles.architectureIconGreen}`}>
                  🤖
                </div>
                <h4 className={styles.architectureItemTitle}>
                  Morpheus AI
                </h4>
                <p className={styles.architectureItemSubtitle}>10-30s analysis</p>
                <span className={`${styles.architectureItemBadge} ${styles.architectureItemBadgeEnhanced}`}>
                  Enhanced
                </span>
              </div>

              <div className={styles.architectureItem}>
                <div className={`${styles.architectureIcon} ${styles.architectureIconPurple}`}>
                  ⛓️
                </div>
                <h4 className={styles.architectureItemTitle}>
                  Solana Blockchain
                </h4>
                <p className={styles.architectureItemSubtitle}>400ms confirmation</p>
                <span className={`${styles.architectureItemBadge} ${styles.architectureItemBadgeCore}`}>
                  Core
                </span>
              </div>

              <div className={styles.architectureItem}>
                <div className={`${styles.architectureIcon} ${styles.architectureIconOrange}`}>
                  📊
                </div>
                <h4 className={styles.architectureItemTitle}>
                  Pinax Analytics
                </h4>
                <p className={styles.architectureItemSubtitle}>99.9% uptime</p>
                <span className={`${styles.architectureItemBadge} ${styles.architectureItemBadgeStrategic}`}>
                  Strategic
                </span>
              </div>
            </div>

            <div className={styles.architectureFooter}>
              <div className={styles.architectureFooterText}>
                Core functionality operates autonomously, with optional
                enhancements when network connectivity is available
              </div>
              <div className={styles.architectureFooterGrid}>
                <div className={styles.architectureFooterCard}>
                  <div className={styles.architectureFooterCardTitle}>
                    Core Defense
                  </div>
                  <div>Edge processing, sensor fusion, autonomous response</div>
                </div>
                <div className={styles.architectureFooterCard}>
                  <div className={styles.architectureFooterCardTitle}>
                    Enhanced Intelligence
                  </div>
                  <div>AI analysis, blockchain evidence, anti-spoofing</div>
                </div>
                <div className={styles.architectureFooterCard}>
                  <div className={styles.architectureFooterCardTitle}>
                    Strategic Analytics
                  </div>
                  <div>Historical patterns, compliance reporting, insights</div>
                </div>
              </div>
            </div>
          </div>

          {/* Value Proposition */}
          <div className={styles.valueProposition}>
            <div className={`${styles.valueCard} ${styles.valueCardGreen}`}>
              <h4 className={styles.valueCardTitle}>
                <span className={styles.valueCardIcon}>⚡</span>
                Core Performance
              </h4>
              <ul className={styles.valueCardList}>
                <li className={styles.valueCardListItem}>• Sub-second response times</li>
                <li className={styles.valueCardListItem}>• 100% autonomous operation</li>
                <li className={styles.valueCardListItem}>• Zero network dependency</li>
                <li className={styles.valueCardListItem}>• Military-grade reliability</li>
              </ul>
            </div>

            <div className={`${styles.valueCard} ${styles.valueCardPurple}`}>
              <h4 className={styles.valueCardTitle}>
                <span className={styles.valueCardIcon}>🧠</span>
                Enhanced Intelligence
              </h4>
              <ul className={styles.valueCardList}>
                <li className={styles.valueCardListItem}>• 97% accuracy with AI enhancement</li>
                <li className={styles.valueCardListItem}>• Immutable evidence trails</li>
                <li className={styles.valueCardListItem}>• Historical pattern analysis</li>
                <li className={styles.valueCardListItem}>• Optional network features</li>
              </ul>
            </div>

            <div className={`${styles.valueCard} ${styles.valueCardOrange}`}>
              <h4 className={styles.valueCardTitle}>
                <span className={styles.valueCardIcon}>🎯</span>
                Strategic Value
              </h4>
              <ul className={styles.valueCardList}>
                <li className={styles.valueCardListItem}>• Future-proof architecture</li>
                <li className={styles.valueCardListItem}>• Scalable intelligence layer</li>
                <li className={styles.valueCardListItem}>• Compliance-ready design</li>
                <li className={styles.valueCardListItem}>• Investment protection</li>
              </ul>
            </div>
          </div>
        </RevealSection>
      </div>
    </section>
  );
};
