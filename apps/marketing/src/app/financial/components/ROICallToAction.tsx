import React from "react";
import { CTAButton } from "./CTAButton";
import styles from "../financial.module.css";

export function ROICallToAction(): React.ReactElement {
  return (
    <div className={styles.ctaSection}>
      <h2 className={styles.ctaTitle}>Ready to Maximize Your ROI?</h2>
      <p className={styles.ctaDescription}>
        Get a detailed financial analysis tailored to your specific threat
        environment and budget constraints.
      </p>
      <div className={styles.ctaButtons}>
        <CTAButton href="#contact" variant="primary">
          Request Detailed Analysis
        </CTAButton>
        <CTAButton href="/interactive-demo" variant="secondary">
          Try Interactive Demo
        </CTAButton>
      </div>
    </div>
  );
}
