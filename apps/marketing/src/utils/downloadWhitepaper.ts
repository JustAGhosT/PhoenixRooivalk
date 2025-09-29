export const downloadWhitepaper = () => {
  if (typeof window === 'undefined') return; // SSR guard
  
  // Create a link to download the whitepaper
  const link = document.createElement('a');
  link.href = '/technical-whitepaper.md';
  link.download = 'Phoenix_Rooivalk_Technical_Whitepaper.md';
  
  // Optional: open in new tab (not needed for download). If kept, add rel.
  // link.target = '_blank';
  // link.rel = 'noopener noreferrer';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
