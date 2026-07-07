export interface IOrpResult {
  word: string;
  orpIndex: number;
  prefix: string;
  orpChar: string;
  suffix: string;
}

/**
 * Strips trailing punctuation from a word and returns the clean letters.
 */
function stripTrailingPunctuation(word: string): string {
  return word.replace(/[.,!?;:\-—–'")\]}>]+$/, "");
}

/**
 * Calculates the Optimal Recognition Point (ORP) index for a given word.
 *
 * ORP rules based on letter count (ignoring trailing punctuation):
 *   0–1 letters  → index 0
 *   2–5 letters  → index 1
 *   6–9 letters  → index 2
 *   10–13 letters → index 3
 *   >13 letters  → index 4
 */
export function calculateOrp(word: string): IOrpResult {
  if (!word || word.length === 0) {
    return { word: "", orpIndex: 0, prefix: "", orpChar: "", suffix: "" };
  }

  const clean = stripTrailingPunctuation(word);
  const len = clean.length;

  let orpIndex: number;
  if (len <= 1) {
    orpIndex = 0;
  } else if (len <= 5) {
    orpIndex = 1;
  } else if (len <= 9) {
    orpIndex = 2;
  } else if (len <= 13) {
    orpIndex = 3;
  } else {
    orpIndex = 4;
  }

  // Clamp to valid range of the original word
  orpIndex = Math.min(orpIndex, word.length - 1);

  return {
    word,
    orpIndex,
    prefix: word.substring(0, orpIndex),
    orpChar: word.charAt(orpIndex),
    suffix: word.substring(orpIndex + 1),
  };
}
