import React from "react";
import styles from "./MetricCard.module.css";

interface MetricCardProps {
  value: string;
  label: string;
  description: string;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  value,
  label,
  description,
  className = "",
}) => {
  return (
    <div className={`${styles.card} ${className}`}>
      <div className={styles.value}>{value}</div>
      <div className={styles.label}>{label}</div>
      <div className={styles.description}>{description}</div>
    </div>
  );
};
