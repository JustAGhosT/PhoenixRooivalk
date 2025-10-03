"use client";
import { downloadWhitepaper } from "@phoenix-rooivalk/utils";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-intent-title"
      aria-describedby="exit-intent-desc"
    >
      <div
        ref={dialogRef}
        className="relative bg-gray-900 border border-green-500/30 rounded-xl p-8 max-w-md mx-4 shadow-2xl"
      >
        {/* Close button */}
        <button
          ref={closeBtnRef}
          onClick={handleStayOnPage}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl leading-none"
        >
          ×
        </button>

        {/* Icon */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">📋</div>
          <h2
            id="exit-intent-title"
            className="text-2xl font-bold text-green-400 mb-2"
          >
            Wait! Get Our Technical Whitepaper
          </h2>
          <p id="exit-intent-desc" className="text-gray-300 text-sm">
            Download our comprehensive technical documentation before you leave.
          </p>
        </div>

        {/* Whitepaper preview */}
        <div className="bg-gray-800/50 rounded-lg p-4 mb-6 border border-green-500/20">
          <h3 className="text-green-400 font-semibold text-sm mb-2">
            What&apos;s Inside:
          </h3>
          <ul className="text-xs text-gray-300 space-y-1">
            <li>• Complete system architecture</li>
            <li>• Technical specifications</li>
            <li>• Security implementation details</li>
            <li>• Deployment configurations</li>
            <li>• Performance benchmarks</li>
          </ul>
        </div>

        {/* Action buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleDownloadNow}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-base font-semibold"
          >
            📥 Download Now
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleMaybeLater}
              variant="ghost"
              className="text-sm"
            >
              Maybe Later
            </Button>
            <Button
              onClick={handleStayOnPage}
              variant="ghost"
              className="text-sm"
            >
              Stay Here
            </Button>
          </div>
        </div>

        {/* Additional links */}
        <div className="mt-6 pt-4 border-t border-gray-700 text-center">
          <p className="text-xs text-gray-400 mb-2">Or explore more:</p>
          <div className="flex justify-center gap-4 text-xs">
            <a
              href="/technical"
              className="text-green-400 hover:text-green-300"
            >
              Technical Docs
            </a>
            <a
              href="/interactive-demo"
              className="text-green-400 hover:text-green-300"
            >
              Live Demo
            </a>
            <a href="#contact" className="text-green-400 hover:text-green-300">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
