import React, { useState, useRef, useEffect } from "react";

interface InfoPopoverProps {
  title: string;
  brands: string[];
  sources: string[];
  children: React.ReactNode;
  className?: string;
}

export const InfoPopover: React.FC<InfoPopoverProps> = ({
  title,
  brands,
  sources,
  children,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const updatePosition = () => {
    if (triggerRef.current && popoverRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const popoverRect = popoverRef.current.getBoundingClientRect();

      let x = rect.left + rect.width / 2 - popoverRect.width / 2;
      let y = rect.bottom + 8;

      // Adjust if popover goes off screen
      if (x < 8) x = 8;
      if (x + popoverRect.width > window.innerWidth - 8) {
        x = window.innerWidth - popoverRect.width - 8;
      }
      if (y + popoverRect.height > window.innerHeight - 8) {
        y = rect.top - popoverRect.height - 8;
      }

      setPosition({ x, y });
    }
  };

  useEffect(() => {
    if (isOpen) {
      updatePosition();
      const handleResize = () => updatePosition();
      const handleScroll = () => updatePosition();

      window.addEventListener("resize", handleResize);
      window.addEventListener("scroll", handleScroll, true);

      return () => {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("scroll", handleScroll, true);
      };
    }
  }, [isOpen]);

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  return (
    <div
      className={`info-popover-trigger ${className}`}
      ref={triggerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="button"
      tabIndex={0}
      aria-describedby={isOpen ? "popover-content" : undefined}
    >
      {children}

      {isOpen && (
        <div
          ref={popoverRef}
          className="info-popover"
          style={{
            position: "fixed",
            left: position.x,
            top: position.y,
            zIndex: 1000,
          }}
          id="popover-content"
          role="tooltip"
          aria-hidden={false}
        >
          <div className="info-popover-header">
            <h4 className="info-popover-title">{title}</h4>
            <button
              className="info-popover-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close popover"
            >
              ×
            </button>
          </div>

          <div className="info-popover-content">
            {brands.length > 0 && (
              <div className="info-popover-section">
                <h5 className="info-popover-section-title">
                  Real-World Analogues:
                </h5>
                <ul className="info-popover-list">
                  {brands.map((brand, index) => (
                    <li key={index} className="info-popover-item">
                      {brand}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {sources.length > 0 && (
              <div className="info-popover-section">
                <h5 className="info-popover-section-title">Sources:</h5>
                <ul className="info-popover-list">
                  {sources.map((source, index) => (
                    <li key={index} className="info-popover-item">
                      <a
                        href={source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="info-popover-link"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {new URL(source).hostname}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="info-popover-arrow"></div>
        </div>
      )}
    </div>
  );
};

export default InfoPopover;
