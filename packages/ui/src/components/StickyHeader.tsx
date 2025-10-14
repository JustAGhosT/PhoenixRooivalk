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
      className={`fixed top-0 left-0 right-0 z-50 bg-[rgba(10,14,26,0.98)] backdrop-blur-md border-b border-[rgba(0,255,136,0.2)] shadow-lg transform transition-all duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
        <div className="text-sm text-[var(--gray)]">
          <span className="text-[var(--primary)] font-bold text-base">
            Phoenix Rooivalk
          </span>{" "}
          <span className="hidden sm:inline">- Counter-UAS Defense System</span>
        </div>
        <a
          href="#contact"
          className="bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] text-[var(--dark)] px-5 py-2.5 rounded-md font-bold text-sm hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(249,115,22,0.4)] transition-all duration-200"
        >
          Schedule Demo
        </a>
      </div>
    </div>,
    document.body,
  );
}
