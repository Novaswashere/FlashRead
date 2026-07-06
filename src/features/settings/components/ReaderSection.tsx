import React from "react";
import { Switch } from "@/components/ui/Switch";

export interface ReaderSectionProps {
  defaultWpm: number;
  orpEnabled: boolean;
  smartPauseEnabled: boolean;
  onWpmChange: (wpm: number) => void;
  onOrpChange: (enabled: boolean) => void;
  onSmartPauseChange: (enabled: boolean) => void;
}

export const ReaderSection: React.FC<ReaderSectionProps> = ({
  defaultWpm,
  orpEnabled,
  smartPauseEnabled,
  onWpmChange,
  onOrpChange,
  onSmartPauseChange
}) => {
  return (
    <div className="flex flex-col">
      {/* WPM Setting */}
      <div className="p-space-md flex items-center justify-between hover:bg-surface-container-low transition-colors">
        <div className="flex items-center gap-space-md text-left">
          <span className="material-symbols-outlined text-secondary">speed</span>
          <div>
            <p className="font-medium text-on-surface">Words Per Minute (WPM)</p>
            <p className="text-xs text-on-surface-variant">Adjust your target reading speed</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            className="w-20 px-3 py-1 border border-border-subtle rounded-lg font-label-mono text-center focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-transparent"
            type="number"
            value={defaultWpm}
            onChange={(e) => onWpmChange(parseInt(e.target.value) || 350)}
          />
          <span className="text-xs font-label-mono text-on-surface-variant">WPM</span>
        </div>
      </div>

      {/* ORP Toggle */}
      <Switch
        icon="format_paint"
        label="ORP Highlight"
        description="Highlight the Optimal Recognition Point in red"
        checked={orpEnabled}
        onChange={(e) => onOrpChange(e.target.checked)}
      />

      {/* Smart Pause Toggle */}
      <Switch
        icon="pause_circle"
        label="Smart Pause"
        description="Pause automatically at punctuations and paragraph ends"
        checked={smartPauseEnabled}
        onChange={(e) => onSmartPauseChange(e.target.checked)}
      />
    </div>
  );
};
