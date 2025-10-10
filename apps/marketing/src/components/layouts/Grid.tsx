import React from "react";
import styles from "./Grid.module.css";

export interface GridProps {
  children: React.ReactNode;
  className?: string;
  columns?: {
    mobile?: 1 | 2;
    tablet?: 1 | 2 | 3 | 4;
    desktop?: 1 | 2 | 3 | 4 | 5 | 6;
  };
  gap?: "sm" | "md" | "lg";
}

/**
 * Grid Layout Component
 * Provides responsive grid layouts with consistent spacing
 */
export const Grid: React.FC<GridProps> = ({
  children,
  className = "",
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = "md",
}) => {
  const columnClasses = [
    columns.mobile ? styles[`mobile${columns.mobile}`] : "",
    columns.tablet ? styles[`tablet${columns.tablet}`] : "",
    columns.desktop ? styles[`desktop${columns.desktop}`] : "",
  ]
    .filter(Boolean)
    .join(" ");

  const gapClass = styles[`gap${gap.charAt(0).toUpperCase() + gap.slice(1)}`];

  return (
    <div className={`${styles.grid} ${columnClasses} ${gapClass} ${className}`}>
      {children}
    </div>
  );
};
