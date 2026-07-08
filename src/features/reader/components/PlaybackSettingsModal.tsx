import React from "react";
import { useSettingsContext } from "@/providers/SettingsProvider";
import { Switch } from "@/components/ui/Switch";

interface PlaybackSettingsModalProps {
  onClose: () => void;
}

export const PlaybackSettingsModal: React.FC<PlaybackSettingsModalProps> = ({
  onClose,
}) => {
  const { settings, updateSettings } = useSettingsContext();

  const shortcuts = [
    { keys: ["Space"], description: "Play / Pause playback" },
    { keys: ["←", "→"], description: "Seek backward / forward" },
    { keys: ["↑", "↓"], description: "Increase / decrease speed" },
    { keys: ["Esc"], description: "Exit reader mode" },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-zinc-950/65 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-surface-container dark:bg-surface-dark border border-border-subtle dark:border-outline-variant rounded-2xl p-space-lg w-full max-w-sm text-left flex flex-col gap-space-lg shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-subtle dark:border-outline-variant pb-3">
          <h3 className="font-headline-md text-lg font-bold text-on-surface">
            Playback Controls
          </h3>
          <button
            onClick={onClose}
            className="material-symbols-outlined text-on-surface-variant hover:bg-surface-container-high dark:hover:bg-surface-container-highest p-1.5 rounded-full cursor-pointer transition-colors"
          >
            close
          </button>
        </div>

        {/* Toggles List */}
        <div className="flex flex-col border border-border-subtle dark:border-outline-variant rounded-xl overflow-hidden divide-y divide-border-subtle dark:divide-outline-variant bg-surface-container-low dark:bg-surface-dark">
          {/* ORP Toggle */}
          <Switch
            icon="format_paint"
            label="ORP Highlight"
            description="Highlight the Optimal Recognition Point in blue"
            checked={settings.orpEnabled}
            onChange={(e) => updateSettings({ orpEnabled: e.target.checked })}
          />

          {/* Smart Pause Toggle */}
          <Switch
            icon="pause_circle"
            label="Smart Pause"
            description="Pause automatically at punctuation marks"
            checked={settings.smartPauseEnabled}
            onChange={(e) =>
              updateSettings({ smartPauseEnabled: e.target.checked })
            }
          />
        </div>

        {/* Keyboard Shortcuts */}
        <div className="flex flex-col gap-space-sm">
          <h4
            className="text-[10px] font-bold uppercase tracking-widest"
            style={{ color: "var(--on-surface-variant)" }}
          >
            Keyboard Shortcuts
          </h4>
          <div className="flex flex-col gap-2 bg-surface-container-low dark:bg-surface-dark border border-border-subtle dark:border-outline-variant rounded-xl p-space-md">
            {shortcuts.map((sh, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-1.5 border-b border-border-subtle/50 dark:border-outline-variant/30 last:border-b-0"
              >
                <span
                  className="text-xs"
                  style={{ color: "var(--on-surface-variant)" }}
                >
                  {sh.description}
                </span>
                <div className="flex gap-1">
                  {sh.keys.map((k, kIdx) => (
                    <kbd
                      key={kIdx}
                      className="px-2 py-0.5 bg-surface-container-high dark:bg-surface-container-highest border border-border-subtle dark:border-outline-variant rounded text-[10px] font-label-mono text-on-surface font-semibold"
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
