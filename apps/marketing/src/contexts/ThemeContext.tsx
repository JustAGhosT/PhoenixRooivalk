"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "phoenix" | "blue";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>("phoenix");

  useEffect(() => {
    // Apply theme to CSS custom properties
    const root = document.documentElement;

    if (theme === "phoenix") {
      // Red/Yellow/Orange theme
      root.style.setProperty("--primary", "#dc2626");
      root.style.setProperty("--secondary", "#374151");
      root.style.setProperty("--accent", "#fbbf24");
      root.style.setProperty("--orange", "#f97316");
      root.style.setProperty("--red-glow", "rgba(220, 38, 38, 0.2)");
      root.style.setProperty("--orange-glow", "rgba(249, 115, 22, 0.15)");
      root.style.setProperty("--amber-glow", "rgba(251, 191, 36, 0.15)");
    } else {
      // Blue theme
      root.style.setProperty("--primary", "#1e40af");
      root.style.setProperty("--secondary", "#374151");
      root.style.setProperty("--accent", "#3b82f6");
      root.style.setProperty("--orange", "#3b82f6");
      root.style.setProperty("--red-glow", "rgba(30, 64, 175, 0.2)");
      root.style.setProperty("--orange-glow", "rgba(59, 130, 246, 0.15)");
      root.style.setProperty("--amber-glow", "rgba(59, 130, 246, 0.15)");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "phoenix" ? "blue" : "phoenix"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
