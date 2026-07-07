import { PlaybackSnapshot, PlaybackState } from "./types";
import { WordQueue } from "./queue";
import { calculateOrp } from "./orp";
import { getWordDurationMs } from "./timing";

type Listener = () => void;

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/**
 * PlaybackController — the single source of truth for RSVP playback state.
 *
 * React-agnostic. Communicates with React via subscribe/getSnapshot (useSyncExternalStore).
 * Only one requestAnimationFrame loop may exist at any time.
 */
export class PlaybackController {
  private queue: WordQueue;
  private _state: PlaybackState = "paused";
  private _wpm: number;

  // Timing internals
  private rafId: number | null = null;
  private lastTickTime: number = 0;
  private accumulated: number = 0;
  private elapsedMs: number = 0;

  // Listener management
  private listeners: Set<Listener> = new Set();

  // Cached snapshot for reference-stable getSnapshot()
  private cachedSnapshot: PlaybackSnapshot | null = null;
  private snapshotVersion: number = 0;
  private lastEmittedVersion: number = -1;

  constructor(text: string, options?: { wpm?: number }) {
    this.queue = new WordQueue(text);
    this._wpm = options?.wpm ?? 350;
    this.cachedSnapshot = this.buildSnapshot();
  }

  // ── Public API ──────────────────────────────────────────────

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  getSnapshot(): PlaybackSnapshot {
    return this.cachedSnapshot!;
  }

  play(): void {
    // Double-play circuit breaker
    if (this._state === "playing") return;

    // If completed, restart from beginning
    if (this._state === "completed") {
      this.queue.seek(0);
      this.elapsedMs = 0;
    }

    this._state = "playing";
    this.lastTickTime = performance.now();
    this.accumulated = 0;
    this.invalidateAndNotify();
    this.startLoop();
  }

  pause(): void {
    if (this._state !== "playing") return;
    this._state = "paused";
    this.stopLoop();
    this.invalidateAndNotify();
  }

  seek(index: number): void {
    const total = this.queue.getLength();
    if (total === 0) return;

    const clamped = Math.max(0, Math.min(index, total - 1));
    this.queue.seek(clamped);

    // Recalculate elapsed time proportionally
    if (total > 0) {
      const avgMs = 60000 / this._wpm;
      this.elapsedMs = clamped * avgMs;
    }

    // If we were completed, reset to paused so we can play again
    if (this._state === "completed") {
      this._state = "paused";
    }

    this.invalidateAndNotify();
  }

  setWpm(wpm: number): void {
    if (wpm <= 0) return;
    this._wpm = wpm;
    // Reset accumulator so the current word gets the new timing
    this.accumulated = 0;
    this.lastTickTime = performance.now();
    this.invalidateAndNotify();
  }

  destroy(): void {
    this.stopLoop();
    this.listeners.clear();
  }

  // ── Private: Animation Loop ──────────────────────────────────

  private startLoop(): void {
    // Guarantee only one loop
    if (this.rafId !== null) return;
    this.rafId = requestAnimationFrame(this.tick);
  }

  private stopLoop(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private tick = (now: number): void => {
    if (this._state !== "playing") {
      this.rafId = null;
      return;
    }

    const delta = now - this.lastTickTime;
    this.lastTickTime = now;
    this.accumulated += delta;
    this.elapsedMs += delta;

    const currentWord = this.queue.getCurrentWord();
    const duration = currentWord
      ? getWordDurationMs(this._wpm, currentWord)
      : 0;

    if (duration > 0 && this.accumulated >= duration) {
      this.accumulated -= duration;

      const hasNext = this.queue.next();
      if (!hasNext) {
        // Reached end of text
        this._state = "completed";
        this.stopLoop();
        this.invalidateAndNotify();
        return;
      }

      this.invalidateAndNotify();
    }

    // Continue loop
    if (this._state === "playing") {
      this.rafId = requestAnimationFrame(this.tick);
    } else {
      this.rafId = null;
    }
  };

  // ── Private: Snapshot Management ──────────────────────────────

  private buildSnapshot(): PlaybackSnapshot {
    const currentWord = this.queue.getCurrentWord() || "";
    const orp = calculateOrp(currentWord);
    const total = this.queue.getLength();
    const idx = this.queue.getIndex();
    const wordsRead = idx;
    const progressPercent = total > 0 ? (idx / total) * 100 : 0;

    const avgMsPerWord = this._wpm > 0 ? 60000 / this._wpm : 0;
    const remainingWords = Math.max(0, total - idx);
    const remainingMs = remainingWords * avgMsPerWord;

    const snapshot: PlaybackSnapshot = {
      state: this._state,
      wpm: this._wpm,
      currentIndex: idx,
      currentWord,
      orpIndex: orp.orpIndex,
      progressPercent,
      wordsRead,
      totalWords: total,
      elapsedTimeLabel: formatTime(this.elapsedMs / 1000),
      remainingTimeLabel: formatTime(remainingMs / 1000),
    };

    return snapshot;
  }

  /**
   * Builds a new snapshot and compares it to the cached one.
   * Only updates the cached reference and increments the version
   * if the snapshot has actually changed.
   */
  private invalidateAndNotify(): void {
    const next = this.buildSnapshot();

    // Structural equality check — avoid creating new references when nothing changed
    if (
      this.cachedSnapshot !== null &&
      this.snapshotsEqual(this.cachedSnapshot, next)
    ) {
      return;
    }

    this.cachedSnapshot = next;
    this.snapshotVersion++;
    this.emitChange();
  }

  private snapshotsEqual(a: PlaybackSnapshot, b: PlaybackSnapshot): boolean {
    return (
      a.state === b.state &&
      a.wpm === b.wpm &&
      a.currentIndex === b.currentIndex &&
      a.currentWord === b.currentWord &&
      a.orpIndex === b.orpIndex &&
      a.progressPercent === b.progressPercent &&
      a.wordsRead === b.wordsRead &&
      a.totalWords === b.totalWords &&
      a.elapsedTimeLabel === b.elapsedTimeLabel &&
      a.remainingTimeLabel === b.remainingTimeLabel
    );
  }

  private emitChange(): void {
    if (this.snapshotVersion === this.lastEmittedVersion) return;
    this.lastEmittedVersion = this.snapshotVersion;
    this.listeners.forEach((l) => l());
  }
}
