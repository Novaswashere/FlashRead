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
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-on-surface/50 backdrop-blur-sm p-4 animate-fade-in-up">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg w-full max-w-sm text-left flex flex-col gap-lg relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
          <h3 className="font-headline-md text-headline-md text-on-surface">
            Appearance
          </h3>
          <button
            onClick={onClose}
            className="material-symbols-outlined text-on-surface-variant hover:bg-surface-container-high p-1.5 rounded-full cursor-pointer transition-colors"
            aria-label="Close"
          >
            close
          </button>
        </div>

        {/* Theme select */}
        <div className="flex flex-col gap-2">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">
            Theme
          </span>
          <ThemePicker
            currentTheme={currentTheme}
            onThemeSelect={onThemeSelect}
          />
        </div>

        {/* Font Family */}
        <div className="flex flex-col gap-2">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">
            Font Family
          </span>
          <div className="grid grid-cols-2 gap-2">
            {fonts.map((f) => (
              <button
                key={f}
                onClick={() => updateSettings({ font: f })}
                className={`px-3 py-2.5 rounded-lg border text-sm transition-all active:scale-95 duration-150 ${
                  settings.font === f
                    ? "border-primary bg-primary/10 font-bold text-primary"
                    : "border-outline-variant/30 hover:bg-surface-container-high text-on-surface"
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
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">
              Font Size
            </span>
            <span className="font-label-md text-label-md text-primary font-bold">
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
