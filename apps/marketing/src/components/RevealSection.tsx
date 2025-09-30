"use client";

import React, { ReactNode } from "react";

interface RevealSectionProps {
  children: ReactNode;
  className?: string;
}

export const RevealSection: React.FC<RevealSectionProps> = ({
  children,
  className = "",
}) => {
  return <div className={className}>{children}</div>;
};
