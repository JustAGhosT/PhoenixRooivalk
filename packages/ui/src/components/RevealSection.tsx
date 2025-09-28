"use client";

import { ReactNode, RefObject } from "react";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";

interface RevealSectionProps {
  children: ReactNode;
  className?: string;
  threshold?: number;
}

export function RevealSection({
  children,
  className = "",
  threshold = 0.1,
}: RevealSectionProps) {
  const { ref, isIntersecting } = useIntersectionObserver({ threshold });

  return (
    <div
      ref={ref as RefObject<HTMLDivElement>}
      className={`transition-all duration-700 ${
        isIntersecting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
    >
      {children}
    </div>
  );
}
