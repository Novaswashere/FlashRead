export type PlaybackState = "playing" | "paused" | "completed";

export interface PlaybackSnapshot {
  state: PlaybackState;
  wpm: number;
  currentIndex: number;
  currentWord: string;
  orpIndex: number;
  progressPercent: number;
  wordsRead: number;
  totalWords: number;
  elapsedTimeLabel: string;
  remainingTimeLabel: string;
}

export interface PlaybackActions {
  play: () => void;
  pause: () => void;
  seek: (index: number) => void;
  setWpm: (wpm: number) => void;
  setSmartPause: (enabled: boolean) => void;
}
