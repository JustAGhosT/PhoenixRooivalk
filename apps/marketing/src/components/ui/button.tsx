import React from "react";

type CommonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
};

type ButtonOnlyProps = CommonProps &
  Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "className" | "children" | "disabled"
  > & {
    href?: undefined;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
  };

type LinkProps = CommonProps &
  Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    "className" | "children" | "disabled"
  > & {
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
  const onClick = rest.onClick;

  // Use the new CSS classes from globals.css
  const getVariantClass = (variant: string) => {
    switch (variant) {
      case "primary":
        return "btn btn--primary";
      case "secondary":
        return "btn btn--secondary";
      case "ghost":
        return "btn btn--ghost";
      default:
        return "btn btn--primary";
    }
  };

  const getSizeClass = (size: string) => {
    switch (size) {
      case "sm":
        return "text-sm py-2 px-3";
      case "md":
        return "text-base py-3 px-4";
      case "lg":
        return "text-lg py-4 px-6";
      default:
        return "text-base py-3 px-4";
    }
  };

  const classes =
    `${getVariantClass(variant)} ${getSizeClass(size)} ${className}`.trim();

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
          if (onClick) {
            onClick(event as any);
          }
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
      type={
        (rest as React.ButtonHTMLAttributes<HTMLButtonElement>).type ?? "button"
      }
      onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
      disabled={disabled}
      className={classes}
    >
      {children}
    </button>
  );
};
