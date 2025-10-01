import Link from "next/link";
import * as React from "react";

export const Footer: React.FC = () => {
  const footerSections = [
    {
      title: "Platform",
      links: [
        { href: "/technical", label: "Technical Specs" },
        { href: "/interactive-demo", label: "Interactive Demo" },
        { href: "/financial", label: "ROI Calculator" },
      ],
    },
    {
      title: "Compliance",
      links: [
        { href: "/compliance", label: "ITAR Compliance" },
        { href: "/compliance", label: "ISO 27001" },
        { href: "/compliance", label: "Security Clearance" },
      ],
    },
    {
      title: "Company",
      links: [
        { href: "/contact", label: "Contact Us" },
        { href: "/contact", label: "Partnerships" },
        { href: "/contact", label: "Careers" },
      ],
    },
  ];

  return (
    <footer className="bg-gradient-to-br from-[rgb(var(--tactical-obsidian))] to-[rgb(var(--tactical-black))] border-t border-[rgba(var(--primary),0.2)]">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(var(--primary),0.1)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(var(--primary),0.1)_1px,_transparent_1px)] bg-[length:50px_50px]"></div>
      </div>

      <div className="relative z-10 px-6 md:px-[5%] lg:px-8 py-12">
        <div className="max-w-[1400px] mx-auto">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div className="md:col-span-1">
              <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-[rgb(var(--phoenix-white))] to-[rgb(var(--primary))] mb-4">
                Phoenix Rooivalk
              </h3>
              <p className="text-[var(--gray)] text-sm mb-4">
                Advanced counter-UAS defense systems for military and civilian
                protection.
              </p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-[var(--primary)]/20 rounded-lg flex items-center justify-center">
                  <span className="text-[var(--primary)] text-sm">🛡️</span>
                </div>
                <div className="w-8 h-8 bg-[var(--primary)]/20 rounded-lg flex items-center justify-center">
                  <span className="text-[var(--primary)] text-sm">🚁</span>
                </div>
                <div className="w-8 h-8 bg-[var(--primary)]/20 rounded-lg flex items-center justify-center">
                  <span className="text-[var(--primary)] text-sm">📡</span>
                </div>
              </div>
            </div>

            {/* Footer Sections */}
            {footerSections.map((section) => (
              <div key={section.title} className="md:col-span-1">
                <h4 className="text-[rgb(var(--phoenix-white))] font-semibold mb-4 text-sm uppercase tracking-wider">
                  {section.title}
                </h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-[var(--gray)] hover:text-[var(--primary)] transition-colors duration-200 text-sm"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Section */}
          <div className="border-t border-[rgba(var(--primary),0.1)] pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-center md:text-left">
                <p className="text-[var(--gray)] text-sm mb-2">
                  © 2025 Phoenix Rooivalk. All rights reserved.
                </p>
                <p className="text-xs text-[var(--gray)]/70">
                  ITAR Compliant • ISO 27001 Certified • Classified Operations
                  Ready
                </p>
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-[var(--gray)]">
                    System Online
                  </span>
                </div>
                <div className="text-xs text-[var(--gray)]">v2.1.0-alpha</div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-6 p-4 bg-[rgba(var(--tactical-charcoal),0.5)] rounded-lg border border-[rgba(var(--primary),0.1)]">
              <p className="text-xs text-[var(--gray)] text-center leading-relaxed">
                <strong className="text-[var(--primary)]">Disclaimer:</strong>{" "}
                Phoenix Rooivalk is an R&D concept in planning. No
                certifications, pilots, or endorsements are claimed. All
                simulations and metrics are illustrative and subject to change.
                This platform demonstrates potential capabilities for
                educational and planning purposes only.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
