export function formatTimeRemaining(wordsCount: number, wpm: number): string {
  // Stub function to calculate remaining duration based on WPM.
  if (wpm <= 0) return "0s";
  const totalMinutes = wordsCount / wpm;
  const minutes = Math.floor(totalMinutes);
  const seconds = Math.round((totalMinutes - minutes) * 60);

  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
}

export function formatDate(isoString: string): string {
  try {
    return new Date(isoString).toLocaleDateString();
  } catch {
    return "Unknown date";
  }
}
