"use client";
import { downloadWhitepaper } from "@phoenix-rooivalk/utils";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import styles from "./ExitIntentModal.module.css";

interface ExitIntentModalProps {
  docsUrl?: string;
}

export const ExitIntentModal: React.FC<ExitIntentModalProps> = ({
  docsUrl,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse is leaving towards the top of the screen
      // and hasn't been triggered before
      if (e.clientY <= 0 && !hasTriggered) {
        setIsVisible(true);
        setHasTriggered(true);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [hasTriggered]);

  // Focus and scroll management
  useEffect(() => {
    if (!isVisible) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleStayOnPage();
      if (e.key === "Tab" && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return; // guard: nothing to trap
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isVisible]);

  const handleMaybeLater = () => {
    setIsVisible(false);
  };

  const handleDownloadNow = (e: React.MouseEvent) => {
    e.preventDefault();
    downloadWhitepaper(docsUrl);
    setIsVisible(false);
  };

  const handleStayOnPage = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-intent-title"
      aria-describedby="exit-intent-desc"
    >
      <div ref={dialogRef} className={styles.dialog}>
        {/* Close button */}
        <button
          ref={closeBtnRef}
          onClick={handleStayOnPage}
          className={styles.closeButton}
        >
          ×
        </button>

        {/* Icon */}
        <div className={styles.header}>
          <div className={styles.icon}>📋</div>
          <h2 id="exit-intent-title" className={styles.title}>
            Wait! Get Our Technical Whitepaper
          </h2>
          <p id="exit-intent-desc" className={styles.description}>
            Download our comprehensive technical documentation before you leave.
          </p>
        </div>

        {/* Whitepaper preview */}
        <div className={styles.preview}>
          <h3 className={styles.previewTitle}>What&apos;s Inside:</h3>
          <ul className={styles.previewList}>
            <li>• Complete system architecture</li>
            <li>• Technical specifications</li>
            <li>• Security implementation details</li>
            <li>• Deployment configurations</li>
            <li>• Performance benchmarks</li>
          </ul>
        </div>

        {/* Action buttons */}
        <div className={styles.actions}>
          <Button onClick={handleDownloadNow} className={styles.primaryButton}>
            📥 Download Now
          </Button>

          <div className={styles.secondaryActions}>
            <Button
              onClick={handleMaybeLater}
              variant="ghost"
              className={styles.secondaryButton}
            >
              Maybe Later
            </Button>
            <Button
              onClick={handleStayOnPage}
              variant="ghost"
              className={styles.secondaryButton}
            >
              Stay Here
            </Button>
          </div>
        </div>

        {/* Additional links */}
        <div className={styles.footer}>
          <p className={styles.footerText}>Or explore more:</p>
          <div className={styles.footerLinks}>
            <a href="/technical" className={styles.footerLink}>
              Technical Docs
            </a>
            <a href="/interactive-demo" className={styles.footerLink}>
              Live Demo
            </a>
            <a href="#contact" className={styles.footerLink}>
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
