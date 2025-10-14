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
  const previousBodyOverflowRef = useRef<string | null>(null);

  // Focus management for accessibility
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Handle modal visibility and focus management
  useEffect(() => {
    if (!isVisible) return undefined;

    // Save current focus to return to when modal closes
    previousFocusRef.current = document.activeElement as HTMLElement;

    // Save current body overflow and lock body scroll when modal is open
    previousBodyOverflowRef.current = document.body.style.overflow || null;
    document.body.style.overflow = "hidden";

    // Focus the close button when modal opens
    closeButtonRef.current?.focus();

    // Event handlers
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
        } else if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    // Add event listeners
    document.addEventListener("keydown", handleEscape);
    document.addEventListener("keydown", handleFocusTrap);

    // Cleanup function
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("keydown", handleFocusTrap);

      // Restore original body overflow value
      if (previousBodyOverflowRef.current !== null) {
        document.body.style.overflow = previousBodyOverflowRef.current;
      } else {
        document.body.style.overflow = "";
      }
      previousBodyOverflowRef.current = null;

      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
        previousFocusRef.current = null;
      }
    };
  }, [isVisible]);

  // Handle mouse leave to show modal
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !isVisible) {
        setIsVisible(true);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [isVisible]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleBackdropClick = (
    e: ReactMouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>,
  ) => {
    // Check if it's a mouse click on the backdrop
    if (e.target === e.currentTarget) {
      e.preventDefault();
      handleClose();
      return;
    }

    // Check if it's a keyboard event (Enter or Space for ARIA button behavior)
    if ("key" in e) {
      const key = e.key;
      if (
        key === "Enter" ||
        key === " " ||
        key === "Space" ||
        key === "Spacebar"
      ) {
        e.preventDefault(); // Prevent page scrolling for Space
        handleClose();
      }
    }
  };

  if (!mounted || !isVisible) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
        onClick={handleBackdropClick}
        onKeyDown={handleBackdropClick}
        role="button"
        aria-label="Close modal"
      />
      <div
        ref={dialogRef}
        className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex justify-between items-center mb-4">
          <h2
            id="modal-title"
            className="text-xl font-bold text-gray-900 dark:text-white"
          >
            Stay on our site?
          </h2>
          <button
            ref={closeButtonRef}
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-white"
            aria-label="Close dialog"
          >
            <span className="sr-only">Close</span>
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="prose dark:prose-invert">
          <p className="text-gray-600 dark:text-gray-300">
            We noticed you&apos;re about to leave. Would you like to stay and
            check out our documentation?
          </p>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            No, thanks
          </button>
          <a
            href={docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            View Documentation
          </a>
        </div>
      </div>
    </div>,
    document.body,
  );
};
