export function getDelayMultiplier(word: string): number {
  // Pure TypeScript stub signature for punctuation delay multiplier calculations.
  // Will be implemented dynamically in later phases.
  return 1.0;
}

export function getWordDurationMs(wpm: number, word: string): number {
  // Pure TypeScript stub signature for word display duration in milliseconds.
  // Will be implemented dynamically in later phases.
  const baseMs = (60 * 1000) / wpm;
  return baseMs * getDelayMultiplier(word);
}
