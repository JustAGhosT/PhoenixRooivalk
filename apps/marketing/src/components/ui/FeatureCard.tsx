import React from "react";
import styles from "./FeatureCard.module.css";

export interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  className?: string;
}

/**
 * FeatureCard component - A horizontal layout card with icon, title, and description
 * Used for displaying features, problems, solutions, etc.
 */
export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  className = "",
}) => {
  return (
    <div className={`${styles.featureCard} ${className}`}>
      <span className={styles.featureIcon}>{icon}</span>
      <div className={styles.featureContent}>
        <div className={styles.featureTitle}>{title}</div>
        <div className={styles.featureDescription}>{description}</div>
      </div>
    </div>
  );
};
