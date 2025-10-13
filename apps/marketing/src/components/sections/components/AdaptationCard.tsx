import * as React from "react";
import styles from "../InteractiveElementsSection.module.css";

// Types
export interface AdaptationItem {
  title: string;
  description: string;
}

export interface AdaptationCardProps {
  icon: string;
  title: string;
  items: AdaptationItem[];
}

// Component for rendering an adaptation item
const AdaptationItem: React.FC<AdaptationItem> = ({ title, description }) => (
  <div className={styles.adaptationItem}>
    <div className={styles.adaptationItemTitle}>{title}</div>
    <div className={styles.adaptationItemDescription}>{description}</div>
  </div>
);

// Component for rendering an adaptation card
export const AdaptationCard: React.FC<AdaptationCardProps> = ({
  icon,
  title,
  items,
}) => (
  <div className={styles.adaptationCard}>
    <div className={styles.adaptationCardHeader}>
      <div className={styles.adaptationCardIcon}>{icon}</div>
      <h4 className={styles.adaptationCardTitle}>{title}</h4>
    </div>
    <div className={styles.resultRows}>
      {items.map((item, index) => (
        <AdaptationItem key={index} {...item} />
      ))}
    </div>
  </div>
);
