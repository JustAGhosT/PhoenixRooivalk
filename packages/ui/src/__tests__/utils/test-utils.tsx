import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';

// Custom render function that includes providers if needed
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { ...options });

// Re-export everything from React Testing Library
export * from '@testing-library/react';
export { customRender as render };

// Common test IDs and utilities
export const TEST_IDS = {
  BUTTON: 'button',
  MODAL: 'modal',
  MODAL_OVERLAY: 'modal-overlay',
  QUICK_ACTIONS: 'quick-actions',
  REVEAL_SECTION: 'reveal-section',
  STICKY_HEADER: 'sticky-header',
} as const;

// Mock implementations for external dependencies
export const mockIntersectionObserver = () => {
  const mockIntersectionObserver = jest.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  });
  window.IntersectionObserver = mockIntersectionObserver;
  return mockIntersectionObserver;
};

// Utility to create mock props
export const createMockProps = <T extends Record<string, any>>(overrides: T) => overrides;
