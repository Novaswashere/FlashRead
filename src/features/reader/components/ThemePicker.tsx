import React from "react";
import { cn } from "@/lib/utils";

export interface ThemePickerProps {
  currentTheme: "light" | "dark";
  onThemeSelect: (theme: "light" | "dark") => void;
}

export const ThemePicker: React.FC<ThemePickerProps> = ({
  currentTheme,
  onThemeSelect
}) => {
  const options: Array<{ id: "light" | "dark"; label: string; class: string }> = [
    { id: "light", label: "Light", class: "bg-[#FFFFFF] border-zinc-200 text-zinc-800" },
    { id: "dark", label: "Dark", class: "bg-[#0B0E14] border-[#1C202B] text-white" }
  ];

  return (
    <div className="flex gap-2">
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onThemeSelect(opt.id)}
          className={cn(
            "w-8 h-8 rounded-full border flex items-center justify-center transition-all cursor-pointer",
            opt.class,
            currentTheme === opt.id ? "ring-2 ring-primary ring-offset-2 scale-110" : "hover:scale-105"
          )}
          title={opt.label}
          aria-label={opt.label}
        >
          {currentTheme === opt.id && (
            <span className="material-symbols-outlined text-[14px]">check</span>
          )}
        </button>
      ))}
    </div>
  );
};
