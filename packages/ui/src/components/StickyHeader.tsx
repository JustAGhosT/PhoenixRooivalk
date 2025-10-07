"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface StickyHeaderProps {
  isVisible: boolean;
}

export function StickyHeader({ isVisible }: StickyHeaderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      className={`fixed top-0 left-0 right-0 z-50 bg-[var(--bg-primary)] bg-opacity-95 backdrop-blur border-b border-[var(--border)] transform transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 py-3 flex items-center justify-between">
        <div className="text-sm text-[var(--gray)]">
          <span className="text-[var(--primary)] font-semibold">
            Phoenix Rooivalk
          </span>{" "}
          - Counter-UAS Defense System
        </div>
        <a
          href="#contact"
          className="bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] text-[var(--dark)] px-4 py-2 rounded font-bold text-sm hover:-translate-y-0.5 transition"
        >
          Schedule Demo
        </a>
      </div>
    </div>,
    document.body,
  );
}
