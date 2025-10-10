import React from "react";
import styles from "./Badge.module.css";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "gradient" | "outlined" | "status";
  status?: "live" | "beta" | "planned";
  tier?: "core" | "enhanced" | "strategic";
  className?: string;
}

/**
 * Badge Component
 * Unified badge component for status indicators, labels, and tags
 */
export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  status,
  tier,
  className = "",
}) => {
  const variantClass =
    styles[`variant${variant.charAt(0).toUpperCase() + variant.slice(1)}`];
  const statusClass = status
    ? styles[`status${status.charAt(0).toUpperCase() + status.slice(1)}`]
    : "";
  const tierClass = tier
    ? styles[`tier${tier.charAt(0).toUpperCase() + tier.slice(1)}`]
    : "";

  return (
    <span
      className={`${styles.badge} ${variantClass} ${statusClass} ${tierClass} ${className}`}
    >
      {children}
    </span>
  );
};
