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
  onClose,
}) => {
  return (
    <div className="glass-dock p-md rounded-xl flex flex-col gap-sm max-w-xs text-left">
      <div className="flex items-center justify-between">
        <h4 className="font-headline-md text-headline-md text-on-surface">
          Reading Speed
        </h4>
        {onClose && (
          <button
            onClick={onClose}
            className="material-symbols-outlined text-on-surface-variant hover:bg-surface-container-high p-1 rounded-full cursor-pointer transition-colors"
            aria-label="Close"
          >
            close
          </button>
        )}
      </div>
      <div className="flex items-center gap-md">
        <Slider
          max="1000"
          min="100"
          step="50"
          value={currentWpm}
          onChange={(e) => onWpmChange(parseInt(e.target.value) || 350)}
          className="flex-1"
        />
        <span className="font-label-md text-label-md text-primary font-bold w-16 text-right shrink-0">
          {currentWpm}{" "}
          <span className="text-label-sm font-normal text-on-surface-variant">
            WPM
          </span>
        </span>
      </div>
    </div>
  );
};
