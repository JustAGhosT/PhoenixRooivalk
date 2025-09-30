import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  theme: {
    extend: {
        colors: {
          primary: "#1e40af",
          secondary: "#374151",
          accent: "#f59e0b",
          dark: "#0f172a",
          darker: "#020617",
          graytext: "#6b7280",
          steel: "#94a3b8",
          "navy-blue": "#1e40af",
          "steel-gray": "#374151",
          "muted-amber": "#f59e0b",
        },
        boxShadow: {
          glow: "0 0 30px rgba(30, 64, 175, 0.2)",
          "navy-glow": "0 0 20px rgba(30, 64, 175, 0.25)",
          "amber-glow": "0 0 20px rgba(245, 158, 11, 0.15)",
          "steel-glow": "0 0 20px rgba(148, 163, 184, 0.2)",
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
