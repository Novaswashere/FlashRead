import React from "react";
import { ThemePicker } from "./ThemePicker";

export interface KeyboardShortcutsHelpProps {
  onClose: () => void;
  currentTheme: "light" | "dark";
  onThemeSelect: (theme: "light" | "dark") => void;
}

export const KeyboardShortcutsHelp: React.FC<KeyboardShortcutsHelpProps> = ({
  onClose,
  currentTheme,
  onThemeSelect,
}) => {
  const shortcuts = [
    {
      icon: "play_circle",
      label: "Play / Pause",
      description: "Start or stop reading",
      keys: ["Space"],
    },
    {
      icon: "swap_horizontal_circle",
      label: "Skip Words",
      description: "Jump back or forward 10 words",
      keys: ["←", "→"],
    },
    {
      icon: "speed",
      label: "Change Speed",
      description: "Read faster or slower",
      keys: ["↑", "↓"],
    },
    {
      icon: "cancel",
      label: "Exit Reader",
      description: "Return to your library",
      keys: ["Esc"],
    },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-on-surface/50 backdrop-blur-sm p-4 animate-fade-in-up">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg w-full max-w-sm text-left flex flex-col gap-lg">
        <div>
          <div className="flex items-center justify-between mb-md">
            <h3 className="font-headline-md text-headline-md text-on-surface">
              Reader Options
            </h3>
            <button
              onClick={onClose}
              className="material-symbols-outlined text-on-surface-variant hover:bg-surface-container-high p-1 rounded-full cursor-pointer transition-colors"
              aria-label="Close"
            >
              close
            </button>
          </div>

          {/* Theme selection */}
          <div className="flex items-center justify-between py-2 border-b border-outline-variant/30">
            <span className="text-sm font-medium text-on-surface">Theme</span>
            <ThemePicker
              currentTheme={currentTheme}
              onThemeSelect={onThemeSelect}
            />
          </div>
        </div>

        <div>
          <h4 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-sm">
            Keyboard Shortcuts
          </h4>
          <div className="flex flex-col gap-2.5 bg-surface-container-low border border-outline-variant/30 rounded-xl p-md">
            {shortcuts.map((sh, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between py-2 border-b border-outline-variant/30 last:border-b-0 gap-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-outline text-lg">
                    {sh.icon}
                  </span>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-on-surface">
                      {sh.label}
                    </span>
                    <span className="text-[10px] mt-0.5 leading-tight text-on-surface-variant">
                      {sh.description}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1.5 flex-shrink-0 mt-0.5">
                  {sh.keys.map((k, kIdx) => (
                    <kbd
                      key={kIdx}
                      className="px-2 py-0.5 bg-surface-container-high border border-outline-variant/30 rounded text-[10px] font-label-md text-label-md text-on-surface font-bold"
                    >
                      {k}
                    </kbd>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
