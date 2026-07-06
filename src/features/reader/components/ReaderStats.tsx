import React from "react";

export interface ReaderStatsProps {
  wordsRead: number;
  totalWords: number;
  currentWPM: number;
}

export const ReaderStats: React.FC<ReaderStatsProps> = ({
  wordsRead,
  totalWords
}) => {
  const formattedWords = wordsRead >= 1000 ? `${(wordsRead / 1000).toFixed(1)}k` : wordsRead;

  return (
    <div className="flex flex-col items-end px-3 select-none text-right">
      <span className="font-label-mono text-[10px] text-on-surface-variant uppercase tracking-wider">Progress</span>
      <span className="font-label-mono text-lg text-on-surface font-semibold">
        {formattedWords}
        <span className="text-[10px] text-on-surface-variant font-normal ml-1">words</span>
      </span>
    </div>
  );
};
