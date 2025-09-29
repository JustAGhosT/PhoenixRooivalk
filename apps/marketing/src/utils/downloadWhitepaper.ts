export const downloadWhitepaper = () => {
  // Create a link to download the whitepaper
  const link = document.createElement('a');
  link.href = '/technical-whitepaper.md';
  link.download = 'Phoenix_Rooivalk_Technical_Whitepaper.md';
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
