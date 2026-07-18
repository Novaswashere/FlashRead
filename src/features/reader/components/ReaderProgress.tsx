import React from "react";

export interface ReaderProgressProps {
  currentIndex: number;
  totalWords: number;
  elapsedTimeLabel: string;
  remainingTimeLabel: string;
  onProgressScrub: (index: number) => void;
}

export const ReaderProgress: React.FC<ReaderProgressProps> = ({
  currentIndex,
  totalWords,
  elapsedTimeLabel,
  remainingTimeLabel,
  onProgressScrub,
}) => {
  const safeTotal = totalWords > 0 ? totalWords : 1;
  const clamped = Math.max(0, Math.min(currentIndex, safeTotal));
  const percent = Math.round((clamped / safeTotal) * 100);

  return (
    <div className="flex flex-col gap-xs w-full">
      <div className="flex items-center justify-between font-label-sm text-label-sm text-outline select-none">
        <span>{elapsedTimeLabel}</span>
        <span>{percent}% complete · {remainingTimeLabel}</span>
      </div>
      <div className="relative h-1 w-full bg-surface-container-highest/20 rounded-full">
        <div
          className="absolute left-0 top-0 h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
        <input
          type="range"
          max={totalWords}
          min={0}
          value={currentIndex}
          onChange={(e) => onProgressScrub(parseInt(e.target.value) || 0)}
          aria-label="Reading progress"
          className="absolute inset-0 w-full h-1 appearance-none bg-transparent cursor-pointer"
        />
      </div>
    </div>
  );
};
