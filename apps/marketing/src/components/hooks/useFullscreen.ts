import { useCallback, useEffect, useState, type RefObject } from "react";

interface UseFullscreenProps {
  gameRef: RefObject<HTMLButtonElement>;
  autoFullscreen?: boolean;
  isTeaser?: boolean;
}

export const useFullscreen = ({
  gameRef,
  autoFullscreen = false,
  isTeaser = false,
}: UseFullscreenProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFullscreenPrompt, setShowFullscreenPrompt] = useState(false);

  const enterFullscreen = useCallback(async () => {
    if (gameRef.current && !document.fullscreenElement) {
      try {
        await gameRef.current.requestFullscreen();
        setIsFullscreen(true);
      } catch (error) {
        // Fullscreen not supported or denied
      }
    }
  }, [gameRef]);

  const exitFullscreen = useCallback(async () => {
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
        setIsFullscreen(false);
      } catch (error) {
        // Exit fullscreen failed
      }
    }
  }, []);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Auto-enter fullscreen for dedicated demo page
  useEffect(() => {
    if (
      autoFullscreen &&
      !isTeaser &&
      gameRef.current &&
      !document.fullscreenElement
    ) {
      setShowFullscreenPrompt(true);
      const timer = setTimeout(() => {
        enterFullscreen();
        setShowFullscreenPrompt(false);
      }, 1500); // Give users time to see the prompt

      return () => clearTimeout(timer);
    }
  }, [autoFullscreen, isTeaser, enterFullscreen, gameRef]);

  return {
    isFullscreen,
    showFullscreenPrompt,
    enterFullscreen,
    exitFullscreen,
  };
};
