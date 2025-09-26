import { useEffect } from 'react';

export const usePerformanceOptimizations = () => {
  useEffect(() => {
    // Add custom animations for threat simulator
    const style = document.createElement('style');
    style.textContent = `
      @keyframes explosion {
        0% { transform: scale(0.5); opacity: 1; }
        50% { transform: scale(1.2); opacity: 0.8; }
        100% { transform: scale(2); opacity: 0; }
      }
      
      @keyframes scoreFloat {
        0% { transform: translateY(0); opacity: 1; }
        100% { transform: translateY(-50px); opacity: 0; }
      }
      
      @keyframes neutralizationPulse {
        0% { transform: scale(1); border-width: 2px; }
        50% { transform: scale(1.5); border-width: 4px; }
        100% { transform: scale(2); border-width: 1px; opacity: 0; }
      }
      
      @keyframes radar {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      .animate-radar {
        animation: radar 3s linear infinite;
        will-change: transform;
      }
      
      .threat-moving {
        will-change: transform;
      }
      
      .threat-moving:not(.neutralized) {
        will-change: auto;
      }
    `;
    document.head.appendChild(style);

    // Add font preloading links
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.href = '/fonts/inter-var.woff2';
    preloadLink.as = 'font';
    preloadLink.type = 'font/woff2';
    preloadLink.crossOrigin = 'anonymous';
    document.head.appendChild(preloadLink);

    const preconnect1 = document.createElement('link');
    preconnect1.rel = 'preconnect';
    preconnect1.href = 'https://fonts.googleapis.com';
    document.head.appendChild(preconnect1);

    const preconnect2 = document.createElement('link');
    preconnect2.rel = 'preconnect';
    preconnect2.href = 'https://fonts.gstatic.com';
    preconnect2.crossOrigin = 'anonymous';
    document.head.appendChild(preconnect2);

    return () => {
      // Cleanup on unmount
      if (style.parentNode) style.parentNode.removeChild(style);
      if (preloadLink.parentNode) preloadLink.parentNode.removeChild(preloadLink);
      if (preconnect1.parentNode) preconnect1.parentNode.removeChild(preconnect1);
      if (preconnect2.parentNode) preconnect2.parentNode.removeChild(preconnect2);
    };
  }, []);
};
