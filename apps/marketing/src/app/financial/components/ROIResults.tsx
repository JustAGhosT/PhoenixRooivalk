import React from "react";
import styles from "../financial.module.css";

interface ROIResultsProps {
  phoenix: {
    prevented: number;
    savings: number;
    roi: number;
    successRate: number;
    paybackPeriod: number;
  };
  traditional: {
    prevented: number;
    savings: number;
    roi: number;
    successRate: number;
    paybackPeriod: number;
  };
}

export function ROIResults({
  phoenix,
  traditional,
}: ROIResultsProps): React.ReactElement {
  return (
    <div className={styles.resultsGrid}>
      {/* Phoenix Rooivalk Results */}
      <div className={styles.resultsCard}>
        <div className={styles.resultsHeader}>
          <div className={styles.resultsIcon}>P</div>
          <h3 className={styles.resultsTitle}>Phoenix Rooivalk</h3>
        </div>

        <div className={styles.resultsMetrics}>
          <div className={styles.resultsMetric}>
            <div className={styles.resultsMetricValue}>
              {(phoenix.successRate * 100).toFixed(1)}%
            </div>
            <div className={styles.resultsMetricLabel}>Success Rate</div>
          </div>
          <div className={styles.resultsMetric}>
            <div className={styles.resultsMetricValueWhite}>
              {phoenix.prevented.toFixed(1)}
            </div>
            <div className={styles.resultsMetricLabel}>
              Threats Prevented/Year
            </div>
          </div>
        </div>

        <div className={styles.resultsDetails}>
          <div className={styles.resultsDetailRow}>
            <span className={styles.resultsDetailLabel}>Annual Savings:</span>
            <span className={styles.resultsDetailValue}>
              ${phoenix.savings.toLocaleString()}
            </span>
          </div>
          <div className={styles.resultsDetailRow}>
            <span className={styles.resultsDetailLabel}>Payback Period:</span>
            <span className={styles.resultsDetailValueWhite}>
              {phoenix.paybackPeriod < 1
                ? "< 1 year"
                : `${phoenix.paybackPeriod.toFixed(1)} years`}
            </span>
          </div>
          <div
            className={`${styles.resultsDetailRow} ${styles.resultsDetailRowLast}`}
          >
            <span className={styles.resultsDetailLabel}>3-Year ROI:</span>
            <span className={styles.resultsDetailValueLarge}>
              {phoenix.roi.toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      {/* Traditional Systems Comparison */}
      <div className={`${styles.resultsCard} ${styles.resultsCardGray}`}>
        <div className={styles.resultsHeader}>
          <div className={`${styles.resultsIcon} ${styles.resultsIconGray}`}>
            T
          </div>
          <h3 className={`${styles.resultsTitle} ${styles.resultsTitleGray}`}>
            Traditional Systems
          </h3>
        </div>

        <div className={styles.resultsMetrics}>
          <div
            className={`${styles.resultsMetric} ${styles.resultsMetricGray}`}
          >
            <div className={styles.resultsMetricValueWarning}>
              {(traditional.successRate * 100).toFixed(1)}%
            </div>
            <div className={styles.resultsMetricLabel}>Success Rate</div>
          </div>
          <div
            className={`${styles.resultsMetric} ${styles.resultsMetricGray}`}
          >
            <div className={styles.resultsMetricValueWhite}>
              {traditional.prevented.toFixed(1)}
            </div>
            <div className={styles.resultsMetricLabel}>
              Threats Prevented/Year
            </div>
          </div>
        </div>

        <div className={styles.resultsDetails}>
          <div className={styles.resultsDetailRow}>
            <span className={styles.resultsDetailLabel}>Annual Savings:</span>
            <span className={styles.resultsDetailValueWarning}>
              ${traditional.savings.toLocaleString()}
            </span>
          </div>
          <div className={styles.resultsDetailRow}>
            <span className={styles.resultsDetailLabel}>Payback Period:</span>
            <span className={styles.resultsDetailValueWhite}>
              {traditional.paybackPeriod < 1
                ? "< 1 year"
                : `${traditional.paybackPeriod.toFixed(1)} years`}
            </span>
          </div>
          <div
            className={`${styles.resultsDetailRow} ${styles.resultsDetailRowLast}`}
          >
            <span className={styles.resultsDetailLabel}>3-Year ROI:</span>
            <span
              className={`${styles.resultsDetailValueLarge} ${styles.resultsDetailValueGray}`}
            >
              {traditional.roi.toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      {/* Savings Comparison */}
      <div className={styles.comparisonSection}>
        <h3 className={styles.comparisonTitle}>Annual Savings Difference</h3>
        <div className={styles.comparisonValue}>
          ${(phoenix.savings - traditional.savings).toLocaleString()}
        </div>
        <div className={styles.comparisonSubtext}>
          Additional savings with Phoenix Rooivalk
        </div>
        <div className={styles.comparisonSubtext}>
          {(
            ((phoenix.savings - traditional.savings) / traditional.savings) *
            100
          ).toFixed(0)}
          % more effective than traditional systems
        </div>
      </div>
    </div>
  );
}
