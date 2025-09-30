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
      description: "Interactive Simulator",
    },
    {
      href: "/technical",
      label: "Technical",
      description: "Specifications & Architecture",
    },
    {
      href: "/financial",
      label: "ROI",
      description: "Calculator & Pricing",
    },
    {
      href: "/compliance",
      label: "Compliance",
      description: "Certifications & Standards",
    },
  ];

  const audienceMenus = {
    military: [
      { href: "/technical", label: "Technical Specifications" },
      { href: "/compliance", label: "Security Standards" },
      { href: "/financial", label: "Deployment Costs" },
      { href: "#contact", label: "Schedule Briefing" },
    ],
    contractors: [
      { href: "/financial", label: "ROI Calculator" },
      { href: "/technical", label: "Integration Guide" },
      { href: "/compliance", label: "Certification Process" },
      { href: "#contact", label: "Partner Program" },
    ],
    government: [
      { href: "/compliance", label: "Regulatory Compliance" },
      { href: "/technical", label: "Security Architecture" },
      { href: "/financial", label: "Budget Planning" },
      { href: "#contact", label: "Government Relations" },
    ],
  };

  return (
    <nav className="sticky top-0 z-50 bg-[rgba(var(--dark),0.95)] backdrop-blur-md border-b border-[rgba(var(--primary),0.2)] px-6 md:px-[5%] lg:px-8 py-4 shadow-lg shadow-[rgba(var(--primary),0.1)]">
      <div className="mx-auto max-w-[1400px] flex items-center justify-between">
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

        {/* Enhanced Navigation Items */}
        <div className="hidden lg:flex items-center space-x-1">
          {/* Main navigation items */}
          <ul className="flex gap-2 text-[rgb(var(--gray))]">
            {navigationItems.map((item) => (
              <li key={item.href} className="relative group">
                <Link
                  href={item.href}
                  className="relative hover:text-[rgb(var(--primary))] transition-colors duration-200 font-medium px-3 py-2 rounded-lg hover:bg-[rgba(var(--primary),0.1)] flex flex-col items-center"
                >
                  <span className="text-sm font-semibold">{item.label}</span>
                  <span className="text-xs text-[rgb(var(--gray))] opacity-80">
                    {item.description}
                  </span>
                  <span className="absolute -bottom-1 left-3 w-0 h-0.5 bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--accent))] group-hover:w-[calc(100%-1.5rem)] transition-all duration-300"></span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Audience selector */}
          <div className="ml-6 pl-6 border-l border-[rgba(var(--primary),0.2)]">
            <div className="relative group">
              <button className="flex items-center space-x-2 text-[rgb(var(--gray))] hover:text-[rgb(var(--primary))] transition-colors duration-200 font-medium px-3 py-2 rounded-lg hover:bg-[rgba(var(--primary),0.1)]">
                <span className="text-sm">I'm a</span>
                <svg
                  className="w-4 h-4 transition-transform group-hover:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Audience dropdown */}
              <div className="absolute top-full left-0 mt-2 w-64 bg-[rgba(var(--tactical-black),0.95)] backdrop-blur-md border border-[rgba(var(--primary),0.2)] rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="p-4">
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs font-semibold text-[rgb(var(--primary))] mb-2">
                        MILITARY
                      </div>
                      <div className="space-y-1">
                        {audienceMenus.military.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="block text-sm text-[rgb(var(--gray))] hover:text-[rgb(var(--primary))] py-1 transition-colors"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div className="border-t border-[rgba(var(--primary),0.1)] pt-3">
                      <div className="text-xs font-semibold text-[rgb(var(--primary))] mb-2">
                        CONTRACTORS
                      </div>
                      <div className="space-y-1">
                        {audienceMenus.contractors.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="block text-sm text-[rgb(var(--gray))] hover:text-[rgb(var(--primary))] py-1 transition-colors"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div className="border-t border-[rgba(var(--primary),0.1)] pt-3">
                      <div className="text-xs font-semibold text-[rgb(var(--primary))] mb-2">
                        GOVERNMENT
                      </div>
                      <div className="space-y-1">
                        {audienceMenus.government.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="block text-sm text-[rgb(var(--gray))] hover:text-[rgb(var(--primary))] py-1 transition-colors"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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

        {/* Theme Toggle & CTA */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="relative p-3 rounded-xl bg-[rgba(var(--logo-bg))] border border-[rgba(var(--primary),0.3)] hover:border-[rgba(var(--primary),0.5)] transition-all duration-300 group hover:bg-[rgba(var(--primary),0.1)]"
            aria-label={`Switch to ${theme === "phoenix" ? "blue" : "phoenix"} theme`}
          >
            <div className="w-6 h-6 flex items-center justify-center">
              {theme === "phoenix" ? (
                // Phoenix theme icon (flame)
                <div className="relative">
                  <div className="w-5 h-5 bg-gradient-to-t from-[rgb(var(--primary))] via-[rgb(var(--orange))] to-[rgb(var(--accent))] rounded-full"></div>
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[rgb(var(--accent))] rounded-full animate-pulse"></div>
                </div>
              ) : (
                // Blue theme icon (shield)
                <div className="w-5 h-5 bg-gradient-to-br from-[rgb(var(--primary))] to-[rgb(var(--accent))] rounded-lg"></div>
              )}
            </div>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[rgba(var(--primary),0.1)] to-[rgba(var(--accent),0.1)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>

          {/* CTA Button */}
          <Link
            href="/#contact"
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--accent))] px-8 py-3 text-sm font-semibold text-white hover:from-[rgb(var(--accent))] hover:to-[rgb(var(--primary))] transition-all duration-300 shadow-xl shadow-[rgba(var(--primary),0.3)] hover:shadow-[rgba(var(--primary),0.5)] transform hover:scale-105 border border-[rgba(var(--primary),0.2)]"
          >
            Join Program
          </Link>
        </div>
      </div>
    </nav>
  );
};
