export const downloadWhitepaper = (customUrlOrEvent?: string | MouseEvent) => {
  if (typeof window === "undefined") return; // SSR guard

  // Swallow click events and derive URL
  if (
    customUrlOrEvent &&
    typeof customUrlOrEvent !== "string" &&
    "preventDefault" in customUrlOrEvent
  ) {
    customUrlOrEvent.preventDefault();
  }
  const url =
    typeof customUrlOrEvent === "string"
      ? customUrlOrEvent
      : "/technical-whitepaper.md";

  // Create a link to download the whitepaper
  const link = document.createElement("a");
  link.href = url;
  link.download = "Phoenix_Rooivalk_Technical_Whitepaper.md";

  // Optional: open in new tab (not needed for download). If kept, add rel.
  // link.target = '_blank';
  // link.rel = 'noopener noreferrer';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
