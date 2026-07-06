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
  onSkipForward
}) => {
  return (
    <div className="flex items-center justify-center gap-space-lg my-space-md">
      <button
        onClick={onSkipBack}
        className="material-symbols-outlined text-outline hover:text-on-surface p-2 rounded-full hover:bg-surface-container-low transition-colors cursor-pointer"
      >
        replay_10
      </button>
      <button
        onClick={onPlayToggle}
        className="w-14 h-14 rounded-full bg-primary hover:bg-primary/95 text-on-primary flex items-center justify-center shadow-md active:scale-95 transition-all cursor-pointer"
      >
        <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
          {isPlaying ? "pause" : "play_arrow"}
        </span>
      </button>
      <button
        onClick={onSkipForward}
        className="material-symbols-outlined text-outline hover:text-on-surface p-2 rounded-full hover:bg-surface-container-low transition-colors cursor-pointer"
      >
        forward_10
      </button>
    </div>
  );
};
