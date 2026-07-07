/**
 * Returns a delay multiplier based on trailing punctuation.
 *
 *   . ? !       → 2.0x (sentence-ending)
 *   , ; : - — – → 1.5x (clause-ending)
 *   everything else → 1.0x
 */
export function getDelayMultiplier(word: string): number {
  if (!word) return 1.0;

  const last = word.charAt(word.length - 1);

  if (last === "." || last === "?" || last === "!") {
    return 2.0;
  }
  if (
    last === "," ||
    last === ";" ||
    last === ":" ||
    last === "-" ||
    last === "—" ||
    last === "–"
  ) {
    return 1.5;
  }
  return 1.0;
}

/**
 * Returns how long a word should be displayed at the given WPM.
 *
 *   duration = (60000 / wpm) * multiplier
 */
export function getWordDurationMs(wpm: number, word: string): number {
  if (wpm <= 0) return 0;
  const baseMs = 60000 / wpm;
  return baseMs * getDelayMultiplier(word);
}
