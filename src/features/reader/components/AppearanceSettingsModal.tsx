import React from "react";
import { ThemePicker } from "./ThemePicker";
import { useSettingsContext } from "@/providers/SettingsProvider";
import { Slider } from "@/components/ui/Slider";

interface AppearanceSettingsModalProps {
  onClose: () => void;
  currentTheme: "light" | "dark";
  onThemeSelect: (theme: "light" | "dark") => void;
}

export const AppearanceSettingsModal: React.FC<AppearanceSettingsModalProps> = ({
  onClose,
  currentTheme,
  onThemeSelect,
}) => {
  const { settings, updateSettings } = useSettingsContext();

  const fonts: Array<
    "Inter" | "Open Sans" | "Merriweather" | "JetBrains Mono"
  > = ["Inter", "Open Sans", "Merriweather", "JetBrains Mono"];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-zinc-950/65 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-surface-container dark:bg-surface-dark border border-border-subtle dark:border-outline-variant rounded-2xl p-space-lg w-full max-w-sm text-left flex flex-col gap-space-lg shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-subtle dark:border-outline-variant pb-3">
          <h3 className="font-headline-md text-lg font-bold text-on-surface">
            Appearance
          </h3>
          <button
            onClick={onClose}
            className="material-symbols-outlined text-on-surface-variant hover:bg-surface-container-high dark:hover:bg-surface-container-highest p-1.5 rounded-full cursor-pointer transition-colors"
          >
            close
          </button>
        </div>

        {/* Theme select */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
            Theme
          </span>
          <ThemePicker
            currentTheme={currentTheme}
            onThemeSelect={onThemeSelect}
          />
        </div>

        {/* Font Family */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
            Font Family
          </span>
          <div className="grid grid-cols-2 gap-2">
            {fonts.map((f) => (
              <button
                key={f}
                onClick={() => updateSettings({ font: f })}
                className={`px-3 py-2.5 rounded-xl border-2 text-sm transition-all active:scale-95 duration-150 ${
                  settings.font === f
                    ? "border-primary bg-primary/5 font-bold text-primary dark:text-primary-fixed"
                    : "border-border-subtle dark:border-outline-variant hover:bg-surface-container-low dark:hover:bg-surface-container-highest text-on-surface"
                }`}
                style={{
                  fontFamily:
                    f === "JetBrains Mono"
                      ? "JetBrains Mono, monospace"
                      : f === "Merriweather"
                        ? "Merriweather, serif"
                        : f,
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Font Size */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              Font Size
            </span>
            <span className="text-xs font-label-mono text-primary font-bold">
              {settings.fontSize}px
            </span>
          </div>
          <Slider
            max="96"
            min="16"
            value={settings.fontSize}
            onChange={(e) =>
              updateSettings({ fontSize: parseInt(e.target.value) || 48 })
            }
          />
        </div>
      </div>
    </div>
  );
};
