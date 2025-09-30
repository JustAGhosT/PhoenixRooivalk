import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#dc2626",
        secondary: "#374151",
        accent: "#fbbf24",
        dark: "#0f172a",
        darker: "#020617",
        graytext: "#6b7280",
        steel: "#94a3b8",
        orange: "#f97316",
        "phoenix-red": "#dc2626",
        "phoenix-orange": "#f97316",
        "phoenix-yellow": "#fbbf24",
      },
      boxShadow: {
        glow: "0 0 30px rgba(220, 38, 38, 0.2)",
        "red-glow": "0 0 20px rgba(220, 38, 38, 0.25)",
        "orange-glow": "0 0 20px rgba(249, 115, 22, 0.15)",
        "amber-glow": "0 0 20px rgba(251, 191, 36, 0.15)",
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
