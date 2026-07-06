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
  onThemeSelect
}) => {
  const shortcuts = [
    { keys: ["Space"], description: "Play / Pause playback" },
    { keys: ["←", "→"], description: "Seek backward / forward" },
    { keys: ["↑", "↓"], description: "Increase / decrease speed" },
    { keys: ["Esc"], description: "Exit reader mode" }
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-zinc-950/65 backdrop-blur-sm p-4">
      <div className="bg-surface-container border border-border-subtle rounded-xl p-space-lg w-full max-w-sm text-left flex flex-col gap-space-lg">
        <div>
          <div className="flex items-center justify-between mb-space-md">
            <h3 className="font-headline-md text-headline-md text-on-surface">Reader Options</h3>
            <button
              onClick={onClose}
              className="material-symbols-outlined text-on-surface-variant hover:bg-surface-container-high p-1 rounded-full cursor-pointer"
            >
              close
            </button>
          </div>
          
          {/* Theme selection */}
          <div className="flex items-center justify-between py-2 border-b border-border-subtle">
            <span className="text-sm font-medium text-on-surface">Theme</span>
            <ThemePicker currentTheme={currentTheme} onThemeSelect={onThemeSelect} />
          </div>
        </div>

        <div>
          <h4 className="font-label-mono text-label-mono text-on-surface-variant uppercase tracking-wider mb-space-sm">
            Keyboard Shortcuts
          </h4>
          <div className="flex flex-col gap-3">
            {shortcuts.map((sh, idx) => (
              <div key={idx} className="flex items-center justify-between py-1 border-b border-border-subtle last:border-b-0">
                <span className="text-sm text-on-surface-variant">{sh.description}</span>
                <div className="flex gap-1">
                  {sh.keys.map((k, kIdx) => (
                    <kbd
                      key={kIdx}
                      className="px-2 py-1 bg-surface-container-high border border-border-subtle rounded text-xs font-label-mono text-on-surface font-semibold"
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
