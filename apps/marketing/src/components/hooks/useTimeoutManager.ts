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
      removeTimeout(timeoutId);
    }, delay);
    timeoutRefs.current.push(timeoutId);
  }, [removeTimeout]);

  // Remove a specific timeout from the list
  const removeTimeout = useCallback(
    (timeoutId: ReturnType<typeof setTimeout>) => {
      timeoutRefs.current = timeoutRefs.current.filter(
        (id) => id !== timeoutId,
      );
    },
    [],
  );

  return { addTimeout, clearTimeouts };
};
