export const downloadWhitepaper = () => {
  // Create a link element
  const link = document.createElement("a");

  // Set the href to the whitepaper file in the public directory
  link.href = "/Phoenix-Rooivalk-Technical-Whitepaper.md";

  // Set the download attribute to specify the filename
  link.download = "Phoenix-Rooivalk-Technical-Whitepaper.md";

  // Append to body, click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
