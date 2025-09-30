import React from "react";
import Link from "next/link";

export const Footer: React.FC = () => {
  const footerLinks = [
    { href: "/technical", label: "Technical" },
    { href: "/financial", label: "Financial" },
    { href: "/compliance", label: "Compliance" },
  ];

  return (
    <footer className="px-6 md:px-[5%] lg:px-8 py-6 text-center text-[var(--gray)] border-t border-[rgba(0,255,136,0.2)]">
      <div className="max-w-[1400px] mx-auto">
        <p>
          © 2025 Phoenix Rooivalk. All rights reserved. | ITAR Compliant | ISO
          27001 Certified
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
