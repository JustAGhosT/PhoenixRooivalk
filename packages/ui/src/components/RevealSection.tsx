"use client";

import { ReactNode } from "react";

import { useIntersectionObserver } from "../hooks/useIntersectionObserver";

interface RevealSectionProps {
  children: ReactNode;
  className?: string;
  threshold?: number;
  triggerOnce?: boolean;
}

export function RevealSection({
  children,
  className = "",
  threshold = 0.1,
  triggerOnce = true,
}: RevealSectionProps) {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold,
    triggerOnce,
  });

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        isIntersecting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
    >
      {children}
    </div>
  );
}
