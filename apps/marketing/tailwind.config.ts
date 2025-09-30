import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Phoenix Rooivalk Brand Colors
        "phoenix-white": "rgb(var(--phoenix-white))",
        "phoenix-cream": "rgb(var(--phoenix-cream))",
        "phoenix-gold": "rgb(var(--phoenix-gold))",
        "phoenix-amber": "rgb(var(--phoenix-amber))",
        "phoenix-orange": "rgb(var(--phoenix-orange))",
        "phoenix-red": "rgb(var(--phoenix-red))",
        "phoenix-crimson": "rgb(var(--phoenix-crimson))",
        "phoenix-maroon": "rgb(var(--phoenix-maroon))",
        "phoenix-deep": "rgb(var(--phoenix-deep))",
        
        // Tactical Neutrals
        "tactical-black": "rgb(var(--tactical-black))",
        "tactical-obsidian": "rgb(var(--tactical-obsidian))",
        "tactical-charcoal": "rgb(var(--tactical-charcoal))",
        "tactical-gunmetal": "rgb(var(--tactical-gunmetal))",
        "tactical-gray-dark": "rgb(var(--tactical-gray-dark))",
        "tactical-gray": "rgb(var(--tactical-gray))",
        "tactical-gray-light": "rgb(var(--tactical-gray-light))",
        "tactical-silver": "rgb(var(--tactical-silver))",
        
        // Sensor Accents
        "sensor-green": "rgb(var(--sensor-green))",
        "sensor-amber": "rgb(var(--sensor-amber))",
        "sensor-red": "rgb(var(--sensor-red))",
        
        // Legacy compatibility
        primary: "rgb(var(--primary))",
        secondary: "rgb(var(--secondary))",
        accent: "rgb(var(--accent))",
        orange: "rgb(var(--orange))",
        dark: "rgb(var(--dark))",
        darker: "rgb(var(--darker))",
        light: "rgb(var(--light))",
        gray: "rgb(var(--gray))",
        steel: "rgb(var(--steel))",
        graytext: "rgb(var(--gray))",
        
        // Semantic shortcuts
        "brand-primary": "rgb(var(--brand-primary))",
        "brand-accent": "rgb(var(--brand-accent))",
        "bg-primary": "rgb(var(--bg-primary))",
        "bg-secondary": "rgb(var(--bg-secondary))",
        "text-primary": "rgb(var(--text-primary))",
        "text-secondary": "rgb(var(--text-secondary))",
        
        // Status colors
        "status-active": "rgb(var(--status-active))",
        "status-warning": "rgb(var(--status-warning))",
        "status-alert": "rgb(var(--status-alert))",
        "status-critical": "rgb(var(--status-critical))",
        "status-offline": "rgb(var(--status-offline))",
      },
      boxShadow: {
        glow: "0 0 30px rgba(var(--phoenix-orange), 0.2)",
        "red-glow": "0 0 20px rgba(var(--phoenix-red), 0.25)",
        "orange-glow": "0 0 20px rgba(var(--phoenix-orange), 0.15)",
        "amber-glow": "0 0 20px rgba(var(--phoenix-amber), 0.15)",
        "phoenix-glow": "0 0 30px rgba(var(--phoenix-orange), 0.2)",
        "tactical-glow": "0 0 20px rgba(var(--tactical-silver), 0.1)",
      },
      keyframes: {
        gridMove: {
          "0%": { transform: "translate(0,0)" },
          "100%": { transform: "translate(50px,50px)" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        radar: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        gridMove: "gridMove 20s linear infinite",
        fadeInUp: "fadeInUp 1s ease both",
        float: "float 3s ease-in-out infinite",
        radar: "radar 3s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
