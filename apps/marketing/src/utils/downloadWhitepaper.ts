import React from 'react';

export const downloadWhitepaper = (customUrlOrEvent?: string | React.MouseEvent): void => {
  if (typeof window === "undefined") return; // SSR guard

  // Handle click events
  if (customUrlOrEvent && typeof customUrlOrEvent !== 'string') {
    customUrlOrEvent.preventDefault();
  }

  const url = typeof customUrlOrEvent === 'string' ? customUrlOrEvent : '/technical-whitepaper.md';
  
  // Create a link to download the whitepaper
  const link = document.createElement('a');
  link.href = url;
  link.download = 'Phoenix_Rooivalk_Technical_Whitepaper.md';
  
  // Append to body, click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
