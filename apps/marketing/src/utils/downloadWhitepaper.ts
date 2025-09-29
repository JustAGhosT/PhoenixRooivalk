export const downloadWhitepaper = () => {
  // Create a link to download the whitepaper
  const link = document.createElement('a');
  link.href = '/docs/phoenix_rooivalk_whitepaper';
  link.download = 'Phoenix_Rooivalk_Technical_Whitepaper_v1.0.pdf';
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
