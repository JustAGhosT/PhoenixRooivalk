"use client";

import React from "react";

export interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  href?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export const Button: React.FC<
  ButtonProps &
    React.AnchorHTMLAttributes<HTMLAnchorElement> &
    React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({
  children,
  variant = "primary",
  size = "md",
  href,
  onClick,
  className = "",
  disabled = false,
  type = "button",
  ...rest
}) => {
  const baseClasses =
    "inline-block rounded font-bold transition hover:-translate-y-0.5";

  const variantClasses = {
    primary:
      "bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] text-[var(--dark)] shadow-glow",
    secondary: "bg-[var(--secondary)] text-[var(--dark)]",
    outline:
      "border-2 border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--dark)]",
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3",
    lg: "px-8 py-4 text-lg",
  };

  const classes = `${baseClasses} ${variantClasses[variant as keyof typeof variantClasses]} ${sizeClasses[size as keyof typeof sizeClasses]} ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`;

  if (href) {
    const handleLinkClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (disabled) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      onClick?.(event);
    };

    // Compute safe rel attribute when opening in a new tab
    const anchorProps = rest as React.AnchorHTMLAttributes<HTMLAnchorElement>;
    const computedRel =
      anchorProps?.target === "_blank"
        ? ["noopener", "noreferrer", anchorProps.rel].filter(Boolean).join(" ")
        : anchorProps?.rel;

    return (
      <a
        href={disabled ? undefined : href}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : undefined}
        rel={computedRel}
        onClick={handleLinkClick}
        className={classes}
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      {...rest}
    >
      {children}
    </button>
  );
};
