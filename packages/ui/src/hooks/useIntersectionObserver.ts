"use client";

import { useCallback, useEffect, useState } from "react";

interface UseIntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {},
) {
  const { threshold = 0.1, rootMargin = "0px", triggerOnce = true } = options;
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [element, setElement] = useState<HTMLElement | null>(null);
  const targetRef = useCallback((node: HTMLElement | null) => {
    setElement(node);
  }, []);

  // Reset when a new element is attached
  useEffect(() => {
    if (!element) return;
    setHasTriggered(false);
    setIsIntersecting(false);
  }, [element]);

  useEffect(() => {
    if (!element) return;
    // Guard: environments without IntersectionObserver (e.g., jsdom) or SSR
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setIsIntersecting(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting;

        if (isVisible && (!triggerOnce || !hasTriggered)) {
          setIsIntersecting(true);
          if (triggerOnce) {
            setHasTriggered(true);
          }
        } else if (!triggerOnce) {
          setIsIntersecting(isVisible);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [element, threshold, rootMargin, triggerOnce, hasTriggered]);

  return { ref: targetRef, isIntersecting };
}
