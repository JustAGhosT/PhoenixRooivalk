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

        {/* Navigation Items */}
        <ul className="hidden md:flex gap-8 text-[rgb(var(--gray))]">
          {navigationItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="relative hover:text-[rgb(var(--primary))] transition-colors duration-200 font-medium group px-3 py-2 rounded-lg hover:bg-[rgba(var(--primary),0.1)]"
              >
                {item.label}
                <span className="absolute -bottom-1 left-3 w-0 h-0.5 bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--accent))] group-hover:w-[calc(100%-1.5rem)] transition-all duration-300"></span>
              </Link>
            </li>
          ))}
        </ul>

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
            Get Demo
          </Link>
        </div>
      </div>
    </nav>
  );
};
