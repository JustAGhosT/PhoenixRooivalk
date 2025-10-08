"use client";

import React, { ReactNode } from "react";
import styles from "./RevealSection.module.css";

interface RevealSectionProps {
  children: ReactNode;
  className?: string;
}

export const RevealSection: React.FC<RevealSectionProps> = ({
  children,
  className = "",
}) => {
  return <div className={`${styles.revealSection} ${className}`}>{children}</div>;
};
