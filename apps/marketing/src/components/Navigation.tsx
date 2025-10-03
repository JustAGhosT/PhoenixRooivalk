"use client";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { useTheme } from "../contexts/ThemeContext";

export const Navigation: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const navigationItems = [
    {
      type: "dropdown",
      label: "Technology",
      items: [
        {
          href: "/interactive-demo",
          label: "Interactive Demo",
          description: "Try the threat simulator",
        },
        {
          href: "/technical",
          label: "Technical Specs",
          description: "Detailed specifications",
        },
        {
          href: "/capabilities",
          label: "Capabilities",
          description: "Core system features",
        },
        {
          href: "/methods",
          label: "Defense Methods",
          description: "Counter-drone strategies",
        },
      ],
    },
    {
      type: "dropdown",
      label: "Business",
      items: [
        {
          href: "/roi-calculator",
          label: "ROI Calculator",
          description: "Calculate your savings",
        },
        {
          href: "/timeline",
          label: "Development Timeline",
          description: "Project roadmap",
        },
        {
          href: "/partnerships",
          label: "Partnerships",
          description: "Collaboration opportunities",
        },
        {
          href: "/sbir",
          label: "SBIR Program",
          description: "Government funding",
        },
      ],
    },
    {
      href: "/about",
      label: "About",
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
              <Image
                src="/logo.svg"
                alt="Phoenix Rooivalk Logo"
                width={56}
                height={56}
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

        {/* Enhanced Navigation with Dropdowns */}
        <div className="hidden lg:flex items-center space-x-8">
          <ul className="flex gap-6 text-[var(--text-secondary)]">
            {navigationItems.map((item) => (
              <li key={item.href || item.label} className="relative group">
                {item.type === "dropdown" ? (
                  <>
                    <button className="hover:text-[var(--text-primary)] focus:text-[var(--text-primary)] transition-colors font-medium flex items-center gap-1">
                      {item.label}
                      <svg
                        className="w-4 h-4"
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
                    {/* Dropdown Menu */}
                    <div className="absolute top-full left-0 mt-2 w-64 bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-200 z-50">
                      <div className="py-2">
                        {item.items?.map((subItem) => (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className="flex flex-col px-4 py-3 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
                          >
                            <span className="font-medium">{subItem.label}</span>
                            <span className="text-xs text-[var(--text-muted)]">
                              {subItem.description}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href!}
                    className="hover:text-[var(--text-primary)] transition-colors font-medium"
                  >
                    {item.label}
                  </Link>
                )}
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

        {/* Theme Toggle & Links */}
        <div className="flex items-center space-x-4">
          {/* GitHub Dropdown */}
          <div className="hidden md:flex items-center">
            <div className="relative group">
              <button className="btn btn--ghost p-2 flex items-center space-x-1">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                <span className="text-sm font-medium">GitHub</span>
                <svg
                  className="w-4 h-4"
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

              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-56 bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  <a
                    href="https://github.com/JustAGhosT/PhoenixRooivalk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
                  >
                    <svg
                      className="w-4 h-4 mr-3"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    <div>
                      <div className="font-medium">Phoenix Rooivalk</div>
                      <div className="text-xs text-[var(--text-muted)]">
                        Main repository
                      </div>
                    </div>
                  </a>
                  <a
                    href="https://github.com/justaghost/cognitive-mesh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
                  >
                    <svg
                      className="w-4 h-4 mr-3"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    <div>
                      <div className="font-medium">Cognitive Mesh</div>
                      <div className="text-xs text-[var(--text-muted)]">
                        AI integration
                      </div>
                    </div>
                  </a>
                  <div className="border-t border-[var(--border)] my-1"></div>
                  <a
                    href="https://docs-phoenixrooivalk.netlify.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
                  >
                    <svg
                      className="w-4 h-4 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <div>
                      <div className="font-medium">Documentation</div>
                      <div className="text-xs text-[var(--text-muted)]">
                        Technical docs
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>

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
