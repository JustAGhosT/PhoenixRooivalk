import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/Button';

export const Navigation: React.FC = () => {
  const navigationItems = [
    { href: '/interactive-demo', label: 'Interactive Demo' },
    { href: '/technical', label: 'Technical' },
    { href: '/financial', label: 'Financial' },
    { href: '/compliance', label: 'Compliance' },
    { href: '#metrics', label: 'Metrics' },
    { href: '#ukraine-challenge', label: 'Ukraine Challenge' },
    { href: '#capabilities', label: 'Capabilities' },
    { href: '#ai-benefits', label: 'AI Benefits' },
    { href: '#contact', label: 'Contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[rgba(10,14,26,0.95)] backdrop-blur px-6 py-3">
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
              {item.href.startsWith('#') ? (
                <a href={item.href} className="hover:text-[var(--primary)]">
                  {item.label}
                </a>
              ) : (
                <Link href={item.href} className="hover:text-[var(--primary)]">
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
        <Button href="#contact" size="sm">
          Request Demo
        </Button>
      </div>
    </nav>
  );
};
