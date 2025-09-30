"use client";

import React from "react";

interface StickyHeaderProps {
  isVisible: boolean;
}

export const StickyHeader: React.FC<StickyHeaderProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <header className="fixed top-0 left-0 right-0 bg-black/90 backdrop-blur-md z-50 transition-all duration-300 transform-gpu">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="text-white font-bold text-xl">Phoenix Rooivalk</div>
        <nav className="hidden md:flex space-x-6">
          <a
            href="#capabilities"
            className="text-white hover:text-green-400 transition-colors"
          >
            Capabilities
          </a>
          <a
            href="#ai-benefits"
            className="text-white hover:text-green-400 transition-colors"
          >
            AI Benefits
          </a>
          <a
            href="#market"
            className="text-white hover:text-green-400 transition-colors"
          >
            Market
          </a>
          <a
            href="#credibility"
            className="text-white hover:text-green-400 transition-colors"
          >
            Credibility
          </a>
          <a
            href="#contact"
            className="text-white hover:text-green-400 transition-colors"
          >
            Contact
          </a>
        </nav>
        <button className="bg-green-500 hover:bg-green-600 text-black font-semibold px-4 py-2 rounded-md transition-colors">
          Request Demo
        </button>
      </div>
    </header>
  );
};
