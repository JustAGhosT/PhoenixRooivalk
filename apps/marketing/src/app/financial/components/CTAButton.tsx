import React from "react";
import Link from "next/link";
import styles from "./CTAButton.module.css";

interface CTAButtonProps {
  href: string;
  variant?: "primary" | "secondary";
  children: React.ReactNode;
}

export function CTAButton({
  href,
  variant = "primary",
  children,
}: CTAButtonProps): React.ReactElement {
  const buttonClass = `${styles.ctaButton} ${styles.ctaButtonLarge} ${
    variant === "primary"
      ? styles.ctaButtonPrimary
      : styles.ctaButtonSecondary
  }`;

  return (
    <Link href={href} className={buttonClass}>
      {children}
    </Link>
  );
}
