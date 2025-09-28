import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ExitIntentModalProps {
  docsUrl: string;
}

export function ExitIntentModal({ docsUrl }: ExitIntentModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !isVisible) {
        setIsVisible(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!mounted || !isVisible) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-[var(--darker)] p-8 rounded-xl border border-[var(--primary)] max-w-md mx-4 text-center">
        <h3 className="text-2xl font-bold text-white mb-4">Wait! Get Our Technical Whitepaper</h3>
        <p className="text-[var(--gray)] mb-6">Download our comprehensive technical documentation before you leave.</p>
        <div className="flex gap-4 justify-center">
          <a
            href={docsUrl}
            className="bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] text-[var(--dark)] px-6 py-3 rounded font-bold hover:-translate-y-0.5 transition"
          >
            Download Now
          </a>
          <button
            onClick={handleClose}
            className="border border-[var(--primary)] text-[var(--primary)] px-6 py-3 rounded font-bold hover:bg-[var(--primary)] hover:text-[var(--dark)] transition"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
