import React from "react";

export interface ReaderStatsProps {
  wordsRead: number;
  totalWords: number;
  currentWPM: number;
}

export const ReaderStats: React.FC<ReaderStatsProps> = ({
  wordsRead,
  totalWords,
  currentWPM
}) => {
  return (
    <div className="flex items-center justify-between text-xs font-label-mono text-outline select-none mt-2">
      <div>
        WORDS: <span className="font-bold text-on-surface">{wordsRead}</span> / {totalWords}
      </div>
      <div>
        SPEED: <span className="font-bold text-primary">{currentWPM} WPM</span>
      </div>
    </div>
  );
};
