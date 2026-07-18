import React from "react";

export interface ReaderStatsProps {
  wordsRead: number;
  totalWords: number;
  currentWPM: number;
}

export const ReaderStats: React.FC<ReaderStatsProps> = ({
  wordsRead,
  totalWords,
}) => {
  const formattedWords =
    wordsRead >= 1000 ? `${(wordsRead / 1000).toFixed(1)}k` : wordsRead;

  return (
    <div className="flex flex-col items-end px-sm select-none text-right leading-tight">
      <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
        Progress
      </span>
      <span className="font-label-md text-label-md text-on-surface font-semibold">
        {formattedWords}
        <span className="text-label-sm text-on-surface-variant font-normal ml-1">
          words
        </span>
      </span>
    </div>
  );
};
