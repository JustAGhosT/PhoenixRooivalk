// Custom hook for managing timeouts, particularly for swarm management

import { useRef, useCallback } from "react";

export const useTimeoutManager = () => {
  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Clear all active timeouts
  const clearTimeouts = useCallback(() => {
    timeoutRefs.current.forEach((timeoutId) => clearTimeout(timeoutId));
    timeoutRefs.current = [];
  }, []);

  // Add a new timeout
  const addTimeout = useCallback((callback: () => void, delay: number) => {
    const timeoutId = setTimeout(() => {
      callback();
      // Remove the timeout from the list when it completes
      timeoutRefs.current = timeoutRefs.current.filter(
        (id) => id !== timeoutId,
      );
    }, delay);
    timeoutRefs.current.push(timeoutId);
  }, []);

  return { addTimeout, clearTimeouts };
};
