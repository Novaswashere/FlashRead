import React from "react";

export interface ThemeSectionProps {
  currentTheme: string;
  onThemeChange: (theme: "light" | "dark" | "system") => void;
}

export const ThemeSection: React.FC<ThemeSectionProps> = ({
  currentTheme,
  onThemeChange
}) => {
  return (
    <div className="p-space-md flex flex-col gap-space-md">
      <div className="flex items-center gap-space-md">
        <span className="material-symbols-outlined text-secondary">contrast</span>
        <p className="font-medium">Interface Theme</p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => onThemeChange("light")}
          className={`flex flex-col items-center justify-center gap-2 p-3 rounded-lg border-2 ${
            currentTheme === "light" ? "border-primary bg-primary-container/10" : "border-border-subtle hover:bg-surface-container-low"
          }`}
        >
          <span className="material-symbols-outlined">light_mode</span>
          <span className="text-xs font-medium">Light</span>
        </button>
        <button
          onClick={() => onThemeChange("dark")}
          className={`flex flex-col items-center justify-center gap-2 p-3 rounded-lg border-2 ${
            currentTheme === "dark" ? "border-primary bg-primary-container/10" : "border-border-subtle hover:bg-surface-container-low"
          }`}
        >
          <span className="material-symbols-outlined">dark_mode</span>
          <span className="text-xs font-medium">Dark</span>
        </button>
        <button
          onClick={() => onThemeChange("system")}
          className={`flex flex-col items-center justify-center gap-2 p-3 rounded-lg border-2 ${
            currentTheme === "system" ? "border-primary bg-primary-container/10" : "border-border-subtle hover:bg-surface-container-low"
          }`}
        >
          <span className="material-symbols-outlined">settings_brightness</span>
          <span className="text-xs font-medium">System</span>
        </button>
      </div>
    </div>
  );
};
