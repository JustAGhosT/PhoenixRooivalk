import React from "react";
import { MetricCard } from "../ui/MetricCard";
import styles from "./MetricsSection.module.css";

const metrics = [
  ["Military-Grade", "Detection Accuracy", "Multi-sensor fusion approach"],
  ["Blockchain-Secured", "Evidence Integrity", "Tamper-proof audit trails"],
  ["< 200ms", "Response Time", "Edge computing architecture"],

  ["Contested", "Environment Ready", "Designed for degraded networks"],
];

export const MetricsSection: React.FC = () => {
  return (
    <section className={styles.section} id="metrics">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Technical Architecture</h2>
          <p className={styles.description}>
            Designed for contested environments with multi-layer resilience and
            evidence integrity.
          </p>
        </div>
        <div className={styles.grid}>
          {metrics.map(([value, label, description], index) => (
            <MetricCard
              key={index}
              value={value}
              label={label}
              description={description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
