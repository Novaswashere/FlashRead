"use client";

import { useThemeContext } from "../providers/ThemeProvider";

export function useTheme() {
  const { theme, setTheme } = useThemeContext();
  return {
    theme,
    setTheme,
    isDark: theme === "dark",
  };
}
