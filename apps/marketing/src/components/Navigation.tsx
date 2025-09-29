import Link from 'next/link';
import React from 'react';
import { Button } from './ui/button';

export const Navigation: React.FC = () => {
  const navigationItems = [
    { href: '/interactive-demo', label: 'Try Demo' },
    { href: '/technical', label: 'Specs' },
    { href: '/financial', label: 'Pricing' },
    { href: '#contact', label: 'Contact' },
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
          Get Demo
        </Button>
      </div>
    </nav>
  );
};
