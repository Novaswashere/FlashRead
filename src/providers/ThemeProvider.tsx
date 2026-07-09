"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Theme = "light" | "dark" | "sepia" | "system";

interface ThemeContextProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    // 1. Try to read theme from settings first to prevent out-of-sync settings
    const savedSettings = localStorage.getItem("flashread_settings");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        if (
          parsed.theme &&
          (parsed.theme === "light" ||
            parsed.theme === "dark" ||
            parsed.theme === "sepia" ||
            parsed.theme === "system")
        ) {
          setThemeState(parsed.theme);
          return;
        }
      } catch (e) {
        console.error("Failed to parse settings for theme", e);
      }
    }

    // 2. Fallback to standalone theme
    const saved = localStorage.getItem("flashread_theme") as Theme;
    if (
      saved === "light" ||
      saved === "dark" ||
      saved === "sepia" ||
      saved === "system"
    ) {
      setThemeState(saved);
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("flashread_theme", newTheme);
  };

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark", "sepia");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
};
