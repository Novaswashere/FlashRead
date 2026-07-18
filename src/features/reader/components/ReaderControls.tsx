import React from "react";

export interface ReaderControlsProps {
  isPlaying: boolean;
  onPlayToggle: () => void;
  onSkipBack: () => void;
  onSkipForward: () => void;
}

export const ReaderControls: React.FC<ReaderControlsProps> = ({
  isPlaying,
  onPlayToggle,
  onSkipBack,
  onSkipForward,
}) => {
  return (
    <div className="flex items-center justify-center gap-lg">
      <button
        onClick={onSkipBack}
        className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:scale-90 p-2 rounded-full"
        aria-label="Skip back 10 words"
      >
        replay_10
      </button>
      <button
        onClick={onPlayToggle}
        className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg hover:brightness-110 active:scale-90 transition-all cursor-pointer"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        <span
          className="material-symbols-outlined text-[28px]"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          {isPlaying ? "pause" : "play_arrow"}
        </span>
      </button>
      <button
        onClick={onSkipForward}
        className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:scale-90 p-2 rounded-full"
        aria-label="Skip forward 10 words"
      >
        forward_10
      </button>
    </div>
  );
};
