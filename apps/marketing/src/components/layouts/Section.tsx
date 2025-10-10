import React from "react";
import styles from "./Section.module.css";

export interface SectionProps {
  id?: string;
  className?: string;
  children: React.ReactNode;
  background?: "default" | "gradient" | "primary" | "none";
}

/**
 * Section Layout Component
 * Provides consistent section structure across the application
 */
export const Section: React.FC<SectionProps> = ({
  id,
  className = "",
  children,
  background = "default",
}) => {
  const backgroundClass =
    background !== "default"
      ? styles[
          `background${background.charAt(0).toUpperCase() + background.slice(1)}`
        ]
      : "";

  return (
    <section
      id={id}
      className={`${styles.section} ${backgroundClass} ${className}`}
    >
      {children}
    </section>
  );
};

export interface SectionContainerProps {
  className?: string;
  children: React.ReactNode;
  maxWidth?: "default" | "wide" | "narrow";
  centered?: boolean;
}

/**
 * Section Container Component
 * Provides consistent container structure with max-width and centering
 */
export const SectionContainer: React.FC<SectionContainerProps> = ({
  className = "",
  children,
  maxWidth = "default",
  centered = false,
}) => {
  const maxWidthClass =
    maxWidth !== "default"
      ? styles[
          `maxWidth${maxWidth.charAt(0).toUpperCase() + maxWidth.slice(1)}`
        ]
      : "";
  const centeredClass = centered ? styles.centered : "";

  return (
    <div
      className={`${styles.container} ${maxWidthClass} ${centeredClass} ${className}`}
    >
      {children}
    </div>
  );
};
