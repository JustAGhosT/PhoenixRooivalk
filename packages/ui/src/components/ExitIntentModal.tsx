"use client";

import { FC, useEffect, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { createPortal } from "react-dom";

interface ExitIntentModalProps {
  docsUrl: string;
}

export const ExitIntentModal: FC<ExitIntentModalProps> = ({ docsUrl }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Focus management for accessibility
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isVisible) {
      // Save current focus to return to when modal closes
      const previousFocus = document.activeElement as HTMLElement;
      // Lock body scroll when modal is open
      document.body.style.overflow = "hidden";
      // Focus the modal when it opens
      if (dialogRef.current) {
        dialogRef.current.focus();
      }

      return () => {
        // Restore body scroll and return focus
        document.body.style.overflow = "";
        previousFocus?.focus();
      };
    }
  }, [isVisible]);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !isVisible) {
        previousFocusRef.current =
          document.activeElement instanceof HTMLElement
            ? document.activeElement
            : null;
        setIsVisible(true);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isVisible]);

  useEffect(() => {
    if (isVisible) {
      // Focus management - focus the close button when modal opens
      closeButtonRef.current?.focus();

      // Escape key handler
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          handleClose();
        }
      };

      // Focus trap - keep focus within modal
      const handleFocusTrap = (e: KeyboardEvent) => {
        if (e.key === "Tab" && dialogRef.current) {
          const focusableElements = dialogRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          );
          const firstElement = focusableElements[0] as HTMLElement;
          const lastElement = focusableElements[
            focusableElements.length - 1
          ] as HTMLElement;

          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
      };

      document.addEventListener("keydown", handleEscape);
      document.addEventListener("keydown", handleFocusTrap);

      return () => {
        document.removeEventListener("keydown", handleEscape);
        document.removeEventListener("keydown", handleFocusTrap);
      };
    }

    if (previousFocusRef.current && !isVisible) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  }, [isVisible]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleBackdropClick = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!mounted || !isVisible) return null;

  return createPortal(
    // Backdrop with click handler and keyboard support
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300"
      onClick={handleBackdropClick}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.preventDefault();
          handleClose();
        }
      }}
      role="presentation"
    >
      {/* Modal dialog */}
      <div
        ref={dialogRef}
        className="bg-[var(--darker)] p-8 rounded-xl border border-[var(--primary)] max-w-md mx-4 text-center outline-none"
        role="dialog"
        aria-modal="true"
        aria-labelledby="exit-intent-title"
        aria-describedby="exit-intent-description"
        tabIndex={-1}
        onKeyDown={(e) => {
          // Trap focus inside the modal
          if (e.key === "Escape") {
            e.preventDefault();
            handleClose();
          } else if (e.key === "Tab") {
            const focusableElements = dialogRef.current?.querySelectorAll(
              'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
            );

            if (!focusableElements || focusableElements.length === 0) return;

            const firstElement = focusableElements[0] as HTMLElement;
            const lastElement = focusableElements[
              focusableElements.length - 1
            ] as HTMLElement;

            if (e.shiftKey && document.activeElement === firstElement) {
              lastElement.focus();
              e.preventDefault();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
              firstElement.focus();
              e.preventDefault();
            }
          }
        }}
      >
        <h3
          id="exit-intent-title"
          className="text-2xl font-bold text-white mb-4"
        >
          Wait! Get Our Technical Whitepaper
        </h3>
        <p id="exit-intent-description" className="text-[var(--gray)] mb-6">
          Download our comprehensive technical documentation before you leave.
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href={docsUrl}
            className="bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] text-[var(--dark)] px-6 py-3 rounded font-bold hover:-translate-y-0.5 transition focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 focus:ring-offset-[var(--darker)]"
          >
            Download Now
          </a>
          <button
            ref={closeButtonRef}
            onClick={handleClose}
            type="button"
            className="border border-[var(--primary)] text-[var(--primary)] px-6 py-3 rounded font-bold hover:bg-[var(--primary)] hover:text-[var(--dark)] transition focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 focus:ring-offset-[var(--darker)]"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};
