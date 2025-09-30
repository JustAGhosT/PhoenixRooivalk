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
      root.style.setProperty("--primary", "220, 38, 38"); // red-600
      root.style.setProperty("--secondary", "55, 65, 81"); // gray-700
      root.style.setProperty("--accent", "251, 191, 36"); // amber-400
      root.style.setProperty("--orange", "249, 115, 22"); // orange-500
      root.style.setProperty("--red-glow", "rgba(220, 38, 38, 0.2)");
      root.style.setProperty("--orange-glow", "rgba(249, 115, 22, 0.15)");
      root.style.setProperty("--amber-glow", "rgba(251, 191, 36, 0.15)");
    } else {
      // Blue theme
      root.style.setProperty("--primary", "30, 64, 175"); // blue-700
      root.style.setProperty("--secondary", "55, 65, 81"); // gray-700
      root.style.setProperty("--accent", "59, 130, 246"); // blue-500
      root.style.setProperty("--orange", "59, 130, 246"); // blue-500 (using blue for orange in blue theme)
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
