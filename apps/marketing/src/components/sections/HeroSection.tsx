import * as React from "react";
import { Button } from "../ui/button";
import styles from "./HeroSection.module.css";

export const HeroSection: React.FC = () => {
  return (
    <section className={styles.section} id="hero">
      <div className={styles.container}>
        {/* Development status indicators */}
        <div className={styles.statusBadges}>
          <span className="pill pill--concept">Concept Phase</span>
          <span className="pill pill--partners">Seeking Design Partners</span>
          <span className="pill pill--sbir">Open to SBIR Collaboration</span>
        </div>

        {/* Vision-focused headline */}
        <h1 className={styles.headline}>
          Edge Autonomy <span className={styles.headlineOrange}>in</span> RF-
          Denied <span className={styles.headlineOrange}>Environments</span>
          <span className={styles.headlineSubtext}>
            SAE Level 4 Local Decisioning
          </span>
        </h1>
        <p className={styles.description}>
          Autonomous counter-drone defense that operates without network
          connectivity. Sub-200ms response times in complete RF denial.
        </p>
        <div className={styles.metricsCard}>
          <div className={styles.metricsGrid}>
            <div className={styles.metric}>
              <div className={styles.metricValue}>&lt;200ms</div>
              <div className={styles.metricLabel}>Response Time</div>
            </div>
            <div className={styles.metric}>
              <div className={styles.metricValue}>100%</div>
              <div className={styles.metricLabel}>Offline Operation</div>
            </div>
            <div className={styles.metric}>
              <div className={styles.metricValue}>64%</div>
              <div className={styles.metricLabel}>Market Gap</div>
            </div>
            <div className={styles.metric}>
              <div className={styles.metricValue}>$26B</div>
              <div className={styles.metricLabel}>Market by 2030</div>
            </div>
          </div>
        </div>

        {/* Enhanced CTAs with specific value propositions */}
        <div className={styles.ctaSection}>
          <div className={styles.ctaButtons}>
            <Button href="/interactive-demo" size="lg" variant="primary">
              Try the Simulation (Concept UI)
            </Button>
            <Button href="/contact" variant="secondary" size="lg">
              Join Early Access
            </Button>
          </div>
          <div className={styles.secondaryLinks}>
            <Button href="/technical" variant="ghost" size="sm">
              Technical Specifications →
            </Button>
            <Button href="/financial" variant="ghost" size="sm">
              ROI Calculator →
            </Button>
            <Button href="/compliance" variant="ghost" size="sm">
              Compliance & Certifications →
            </Button>
          </div>
        </div>

        {/* SAE Level 4 Autonomy Concept Card - moved below as a row */}
        <div className={styles.conceptCard}>
          <div className="card card--elevated">
            <div className={styles.conceptTitle}>
              <h3 className={styles.conceptTitleText}>
                SAE Level 4 Autonomy Concept
              </h3>
              <p className={styles.conceptDescription}>
                Edge-first decision making without network dependency
              </p>
            </div>

            {/* Visual concept representation */}
            <div className={styles.conceptMetrics}>
              <div className={styles.conceptMetric}>
                <span className={styles.conceptMetricLabel}>
                  Detection Latency
                </span>
                <span className={styles.conceptMetricValue}>&lt;200ms</span>
              </div>
              <div className={styles.conceptMetric}>
                <span className={styles.conceptMetricLabel}>
                  Network Independence
                </span>
                <span className={styles.conceptMetricValue}>100%</span>
              </div>
              <div className={styles.conceptMetric}>
                <span className={styles.conceptMetricLabel}>
                  Market Gap Addressed
                </span>
                <span className={styles.conceptMetricValue}>64%</span>
              </div>
            </div>

            <div className={styles.disclaimer}>
              <p className={styles.disclaimerText}>
                💡 This represents a conceptual approach under development.
                Performance metrics are targets for validation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
