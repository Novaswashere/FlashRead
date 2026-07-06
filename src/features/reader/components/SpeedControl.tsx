import React from "react";
import { Slider } from "@/components/ui/Slider";

export interface SpeedControlProps {
  currentWpm: number;
  onWpmChange: (wpm: number) => void;
  onClose?: () => void;
}

export const SpeedControl: React.FC<SpeedControlProps> = ({
  currentWpm,
  onWpmChange,
  onClose
}) => {
  return (
    <div className="p-space-md bg-surface-container border border-border-subtle rounded-xl flex flex-col gap-space-sm max-w-xs text-left">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-sm text-on-surface">Reading Speed</h4>
        {onClose && (
          <button
            onClick={onClose}
            className="material-symbols-outlined text-sm hover:opacity-80 cursor-pointer"
          >
            close
          </button>
        )}
      </div>
      <div className="flex items-center gap-space-md">
        <Slider
          max="1000"
          min="100"
          step="50"
          value={currentWpm}
          onChange={(e) => onWpmChange(parseInt(e.target.value) || 350)}
          className="flex-1"
        />
        <span className="font-label-mono text-label-mono text-primary font-bold w-16 text-right shrink-0">
          {currentWpm} <span className="text-[10px] font-normal">WPM</span>
        </span>
      </div>
    </div>
  );
};
