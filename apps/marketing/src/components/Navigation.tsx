"use client";
import Link from "next/link";
import React from "react";
import { useTheme } from "../contexts/ThemeContext";

export const Navigation: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const navigationItems = [
    {
      href: "/interactive-demo",
      label: "Demo",
    },
    {
      href: "/technical",
      label: "Technical",
    },
    {
      href: "/#why-now",
      label: "Why Now",
    },
    {
      href: "/contact",
      label: "Contact",
    },
  ];


  return (
    <nav className="sticky top-0 z-50 bg-[var(--bg-primary)] border-b border-[var(--border)] px-6 py-4">
      <div className="container flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-4 group">
          <div className="relative">
            <div className="w-14 h-14 rounded-xl overflow-hidden shadow-xl shadow-[rgba(var(--primary),0.3)] group-hover:shadow-[rgba(var(--primary),0.5)] transition-all duration-300 bg-[rgba(var(--logo-bg))] border border-[rgba(var(--primary),0.2)] group-hover:border-[rgba(var(--primary),0.4)]">
              <img
                src="/logo.svg"
                alt="Phoenix Rooivalk Logo"
                className="w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform duration-300"
              />
            </div>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[rgba(var(--primary),0.3)] to-[rgba(var(--accent),0.3)] opacity-0 group-hover:opacity-30 transition-opacity duration-300 blur-lg"></div>
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-[rgba(var(--primary),0.1)] to-[rgba(var(--accent),0.1)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
          </div>
          <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-[rgb(var(--primary))] to-[rgb(var(--accent))] group-hover:from-[rgb(var(--accent))] group-hover:to-[rgb(var(--primary))] transition-all duration-300 tracking-tight">
            Phoenix Rooivalk
          </div>
        </Link>

        {/* Simplified Navigation */}
        <div className="hidden lg:flex items-center space-x-8">
          <ul className="flex gap-6 text-[var(--text-secondary)]">
            {navigationItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="hover:text-[var(--text-primary)] transition-colors font-medium"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile navigation */}
        <div className="lg:hidden">
          <button className="text-[rgb(var(--gray))] hover:text-[rgb(var(--primary))] p-2">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Theme Toggle & Single CTA */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="btn btn--ghost p-2"
            aria-label={`Switch to ${theme === "phoenix" ? "blue" : "phoenix"} theme`}
          >
            <div className="w-5 h-5">
              {theme === "phoenix" ? (
                <div className="w-full h-full bg-[var(--action-primary)] rounded-full"></div>
              ) : (
                <div className="w-full h-full bg-[var(--action-secondary)] rounded"></div>
              )}
            </div>
          </button>

          {/* Single CTA Button */}
          <Link href="/contact" className="btn btn--primary">
            Join Early Access
          </Link>
        </div>
      </div>
    </nav>
  );
};
