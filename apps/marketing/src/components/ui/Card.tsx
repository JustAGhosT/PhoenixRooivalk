import React from "react";
import styles from "./Card.module.css";

export interface CardProps {
  icon?: string;
  title: string;
  description: string;
  proof?: string;
  className?: string;
  colorVariant?: "default" | "green" | "blue" | "purple" | "yellow";
}

export const Card: React.FC<CardProps> = ({
  icon,
  title,
  description,
  proof,
  className = "",
  colorVariant = "default",
}) => {
  const colorClass = colorVariant !== "default" 
    ? styles[`card${colorVariant.charAt(0).toUpperCase() + colorVariant.slice(1)}`] 
    : "";

  return (
    <div className={`${styles.card} ${colorClass} ${className}`}>
      {icon && <div className={styles.cardIcon}>{icon}</div>}
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardDescription}>{description}</p>
      {proof && <div className={styles.cardProof}>✓ {proof}</div>}
    </div>
  );
};
