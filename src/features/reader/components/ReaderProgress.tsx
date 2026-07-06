import React from "react";
import { Slider } from "@/components/ui/Slider";

export interface ReaderProgressProps {
  progressPercent: number; 
  elapsedTimeLabel: string;
  remainingTimeLabel: string;
  onProgressScrub: (percent: number) => void;
}

export const ReaderProgress: React.FC<ReaderProgressProps> = ({
  progressPercent,
  elapsedTimeLabel,
  remainingTimeLabel,
  onProgressScrub
}) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center justify-between text-xs font-label-mono text-outline select-none">
        <span>{elapsedTimeLabel}</span>
        <span>{remainingTimeLabel}</span>
      </div>
      <Slider
        max="100"
        min="0"
        value={progressPercent}
        onChange={(e) => onProgressScrub(parseInt(e.target.value) || 0)}
      />
    </div>
  );
};
