"use client";

/**
 * Plausible Analytics Component
 * Privacy-focused, GDPR-compliant analytics
 * No cookies, no personal data collection
 *
 * To enable:
 * 1. Sign up at https://plausible.io
 * 2. Add domain: phoenixrooivalk.netlify.app
 * 3. Uncomment the Script tag below
 */
export function Analytics() {
  // Set to false to disable analytics (development)
  const enableAnalytics = process.env.NODE_ENV === "production";

  if (!enableAnalytics) {
    return null;
  }

  return (
    <>
      {/* Plausible Analytics - Uncomment after setting up account */}
      {/* 
      <Script
        defer
        data-domain="phoenixrooivalk.netlify.app"
        src="https://plausible.io/js/script.js"
      />
      */}

      {/* Google Analytics 4 - Alternative option */}
      {/* 
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'GA_MEASUREMENT_ID');
        `}
      </Script>
      */}
    </>
  );
}
