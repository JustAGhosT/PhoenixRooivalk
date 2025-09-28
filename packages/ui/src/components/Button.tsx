'use client';

import React from 'react';

export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  className = '',
  disabled = false
}) => {
  const baseClasses = 'inline-block rounded font-bold transition hover:-translate-y-0.5';
  
  const variantClasses = {
    primary: 'bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] text-[var(--dark)] shadow-glow',
    secondary: 'bg-[var(--secondary)] text-[var(--dark)]',
    outline: 'border-2 border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--dark)]'
  };
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3',
    lg: 'px-8 py-4 text-lg'
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`;
  
  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }
  
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      type="button"
      className={classes}
    >
      {children}
    </button>
  );
};
