import Link from "next/link";
import React from "react";

export const Navigation: React.FC = () => {
  const navigationItems = [
    { href: "/interactive-demo", label: "Try Demo" },
    { href: "/technical", label: "Specs" },
    { href: "/financial", label: "Pricing" },
    { href: "/#contact", label: "Contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[rgba(10,14,26,0.95)] backdrop-blur px-6 md:px-[5%] lg:px-8 py-3">
      <div className="mx-auto max-w-[1400px] flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)]"
        >
          Phoenix Rooivalk
        </Link>
        <ul className="hidden md:flex gap-6 text-[var(--gray)]">
          {navigationItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="hover:text-[var(--primary)]">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/#contact"
          className="inline-flex items-center justify-center rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--dark)] hover:bg-[var(--primary)]/90 transition-colors"
        >
          Get Demo
        </Link>
      </div>
    </nav>
  );
};
