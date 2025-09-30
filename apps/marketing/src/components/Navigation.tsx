"use client";
import Link from "next/link";
import React from "react";
import { useTheme } from "../contexts/ThemeContext";

export const Navigation: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const navigationItems = [
    { href: "/interactive-demo", label: "Try Demo" },
    { href: "/technical", label: "Specs" },
    { href: "/financial", label: "Pricing" },
    { href: "/compliance", label: "Compliance" },
    { href: "/#contact", label: "Contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[rgba(10,14,26,0.95)] backdrop-blur-sm border-b border-[var(--primary)]/20 px-6 md:px-[5%] lg:px-8 py-4">
      <div className="mx-auto max-w-[1400px] flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="relative">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center shadow-lg shadow-[var(--primary)]/30 group-hover:shadow-[var(--primary)]/50 transition-all duration-300">
              <span className="text-lg font-bold text-white">P</span>
            </div>
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-md"></div>
          </div>
          <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] group-hover:from-[var(--accent)] group-hover:to-[var(--primary)] transition-all duration-300">
            Phoenix Rooivalk
          </div>
        </Link>

        {/* Navigation Items */}
        <ul className="hidden md:flex gap-8 text-[var(--gray)]">
          {navigationItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="relative hover:text-[var(--primary)] transition-colors duration-200 font-medium group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] group-hover:w-full transition-all duration-300"></span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Theme Toggle & CTA */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="relative p-2 rounded-lg bg-[rgba(15,23,42,0.8)] border border-[var(--primary)]/30 hover:border-[var(--primary)]/50 transition-all duration-300 group"
            aria-label="Toggle theme"
          >
            <div className="w-6 h-6 flex items-center justify-center">
              {theme === "phoenix" ? (
                // Phoenix theme icon (flame)
                <div className="relative">
                  <div className="w-4 h-4 bg-gradient-to-t from-[var(--primary)] via-[var(--orange)] to-[var(--accent)] rounded-full"></div>
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[var(--accent)] rounded-full animate-pulse"></div>
                </div>
              ) : (
                // Blue theme icon (shield)
                <div className="w-4 h-4 bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] rounded-sm"></div>
              )}
            </div>
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[var(--primary)]/10 to-[var(--accent)]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>

          {/* CTA Button */}
          <Link
            href="/#contact"
            className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-6 py-2.5 text-sm font-semibold text-white hover:from-[var(--accent)] hover:to-[var(--primary)] transition-all duration-300 shadow-lg shadow-[var(--primary)]/30 hover:shadow-[var(--primary)]/50 transform hover:scale-105"
          >
            Get Demo
          </Link>
        </div>
      </div>
    </nav>
  );
};
