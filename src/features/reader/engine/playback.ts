import { WordQueue } from "./queue";

export type PlaybackState = "playing" | "paused" | "completed";

export class PlaybackController {
  private queue: WordQueue;
  private state: PlaybackState = "paused";
  private wpm = 350;
  private onWordChange: (word: string, index: number) => void;
  private onStateChange: (state: PlaybackState) => void;

  constructor(
    content: string,
    options: {
      wpm?: number;
      onWordChange: (word: string, index: number) => void;
      onStateChange: (state: PlaybackState) => void;
    }
  ) {
    // Pure TypeScript stub signature for coordinating queue, playback state, and WPM timing.
    this.queue = new WordQueue(content);
    this.wpm = options.wpm || 350;
    this.onWordChange = options.onWordChange;
    this.onStateChange = options.onStateChange;
  }

  play(): void {
    this.state = "playing";
    this.onStateChange(this.state);
  }

  pause(): void {
    this.state = "paused";
    this.onStateChange(this.state);
  }

  setWpm(wpm: number): void {
    this.wpm = wpm;
  }

  getWpm(): number {
    return this.wpm;
  }

  getState(): PlaybackState {
    return this.state;
  }

  seek(index: number): void {
    this.queue.seek(index);
    const word = this.queue.getCurrentWord();
    if (word) {
      this.onWordChange(word, this.queue.getIndex());
    }
  }

  destroy(): void {
    this.pause();
  }
}
