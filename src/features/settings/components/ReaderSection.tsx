import React from "react";
import { Switch } from "@/components/ui/Switch";

export interface ReaderSectionProps {
  defaultWpm: number;
  orpEnabled: boolean;
  smartPauseEnabled: boolean;
  readingAnchorEnabled: boolean;
  onWpmChange: (wpm: number) => void;
  onOrpChange: (enabled: boolean) => void;
  onSmartPauseChange: (enabled: boolean) => void;
  onReadingAnchorChange: (enabled: boolean) => void;
}

export const ReaderSection: React.FC<ReaderSectionProps> = ({
  defaultWpm,
  orpEnabled,
  smartPauseEnabled,
  readingAnchorEnabled,
  onWpmChange,
  onOrpChange,
  onSmartPauseChange,
  onReadingAnchorChange,
}) => {
  return (
    <div className="flex flex-col">
      {/* WPM Setting */}
      <div className="p-space-md flex items-center justify-between hover:bg-surface-container-low transition-colors">
        <div className="flex items-center gap-space-md text-left">
          <span className="material-symbols-outlined text-secondary">
            speed
          </span>
          <div>
            <p className="font-medium text-on-surface">
              Reading Speed
            </p>
            <p className="text-xs text-on-surface-variant">
              How fast words appear (higher = faster reading)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            className="w-20 px-3 py-1 border border-border-subtle rounded-lg font-label-mono text-center focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-transparent"
            type="number"
            value={defaultWpm}
            onChange={(e) => onWpmChange(parseInt(e.target.value) || 350)}
          />
          <span className="text-xs font-label-mono text-on-surface-variant">
            words/min
          </span>
        </div>
      </div>

      {/* ORP Toggle */}
      <Switch
        icon="center_focus_strong"
        label="Word Focus Mode"
        description="Highlights the center of each word to help your eyes focus"
        checked={orpEnabled}
        onChange={(e) => onOrpChange(e.target.checked)}
      />

      {/* Smart Pause Toggle */}
      <Switch
        icon="pause_circle"
        label="Smart Pause"
        description="Pause briefly at commas, periods, and paragraph breaks"
        checked={smartPauseEnabled}
        onChange={(e) => onSmartPauseChange(e.target.checked)}
      />

      {/* Reading Anchor Toggle */}
      <Switch
        icon="bookmarks"
        label="Reading Anchor"
        description="Show paragraph context below the reader for better comprehension"
        checked={readingAnchorEnabled}
        onChange={(e) => onReadingAnchorChange(e.target.checked)}
      />
    </div>
  );
};
