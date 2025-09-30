import Link from "next/link";
import React from "react";

export const Footer: React.FC = () => {
  const footerLinks = [
    { href: "/technical", label: "Technical" },
    { href: "/financial", label: "Financial" },
    { href: "/compliance", label: "Compliance" },
  ];

  return (
    <footer className="px-6 md:px-[5%] lg:px-8 py-6 text-center text-[var(--gray)] border-t border-[rgba(0,255,136,0.2)]">
      <div className="max-w-[1400px] mx-auto">
        <p className="mb-4">© 2025 Phoenix Rooivalk. All rights reserved.</p>
        <p className="text-sm text-[rgb(var(--gray))] border-t border-[rgba(var(--primary),0.1)] pt-4 max-w-4xl mx-auto">
          <strong>Disclaimer:</strong> Phoenix Rooivalk is an R&D concept in
          planning. No certifications, pilots, or endorsements are claimed. All
          simulations and metrics are illustrative and subject to change.
        </p>
        <div className="mt-4">
          {footerLinks.map((link, index) => (
            <React.Fragment key={link.href}>
              <Link
                href={link.href}
                className="text-[var(--primary)] hover:underline mr-6"
              >
                {link.label}
              </Link>
              {index < footerLinks.length - 1 && (
                <span className="text-[var(--gray)]">|</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </footer>
  );
};
