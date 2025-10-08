/**
 * Skip Navigation Component
 * Provides keyboard users with ability to skip to main content
 * WCAG 2.1 AA Compliance - Required for accessibility
 */

import * as React from "react";
import styles from "./SkipNav.module.css";

export function SkipNav(): React.ReactElement {
  return (
    <a href="#main-content" className={styles.skipNav}>
      Skip to main content
    </a>
  );
}
