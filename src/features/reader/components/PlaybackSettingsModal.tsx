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
    {
      icon: "play_circle",
      label: "Play / Pause",
      description: "Toggle RSVP word flashing",
      keys: ["Space"],
    },
    {
      icon: "swap_horizontal_circle",
      label: "Seek Navigation",
      description: "Step back/forward 10 words",
      keys: ["←", "→"],
    },
    {
      icon: "speed",
      label: "Adjust WPM",
      description: "Increase/decrease speed",
      keys: ["↑", "↓"],
    },
    {
      icon: "cancel",
      label: "Exit Reader",
      description: "Close the reading session",
      keys: ["Esc"],
    },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-on-surface/50 backdrop-blur-sm p-4 animate-fade-in-up">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg w-full max-w-sm text-left flex flex-col gap-lg shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
          <h3 className="font-headline-md text-headline-md text-on-surface">
            Playback Controls
          </h3>
          <button
            onClick={onClose}
            className="material-symbols-outlined text-on-surface-variant hover:bg-surface-container-high p-1.5 rounded-full cursor-pointer transition-colors"
            aria-label="Close"
          >
            close
          </button>
        </div>

        {/* Toggles List */}
        <div className="flex flex-col border border-outline-variant/30 rounded-xl overflow-hidden divide-y divide-outline-variant/30 bg-surface-container-low">
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

          {/* Reading Anchor Toggle */}
          <Switch
            icon="bookmarks"
            label="Reading Anchor"
            description="Show paragraph context below the reader for comprehension"
            checked={settings.readingAnchorEnabled ?? false}
            onChange={(e) =>
              updateSettings({ readingAnchorEnabled: e.target.checked })
            }
          />
        </div>

        {/* Keyboard Shortcuts */}
        <div className="flex flex-col gap-sm">
          <h4 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">
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
