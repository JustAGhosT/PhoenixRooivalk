import React from 'react';
import Link from 'next/link';

type CommonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
};

type ButtonOnlyProps = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children" | "disabled"> & {
    href?: undefined;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
  };

type LinkProps = CommonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children" | "disabled"> & {
    href: string;
    onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  };

export type ButtonProps = ButtonOnlyProps | LinkProps;

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  href,
  className = "",
  disabled = false,
  ...rest
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    primary: "bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105",
    secondary: "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105",
    outline: "border border-green-500/30 text-green-400 hover:bg-green-500/10 hover:border-green-500/50 hover:text-green-300",
  };

  const sizeClasses = {
    sm: "px-3 py-2 text-sm rounded",
    md: "px-4 py-2 text-base rounded-lg",
    lg: "px-6 py-3 text-lg rounded-lg",
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim();

  if (href) {
    return (
      <a
        {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        href={disabled ? undefined : href}
        aria-disabled={disabled ? "true" : undefined}
        tabIndex={disabled ? -1 : undefined}
        onClick={(event) => {
          if (disabled) {
            event.preventDefault();
            event.stopPropagation();
            return;
          }
          rest.onClick?.(event as any);
        }}
        className={classes}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      type={(rest as React.ButtonHTMLAttributes<HTMLButtonElement>).type ?? "button"}
      onClick={rest.onClick}
      disabled={disabled}
      className={classes}
    >
      {children}
    </button>
  );
};
