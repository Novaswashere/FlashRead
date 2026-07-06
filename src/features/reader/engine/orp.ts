export interface IOrpResult {
  word: string;
  orpIndex: number;
  prefix: string;
  orpChar: string;
  suffix: string;
}

export function calculateOrp(word: string): IOrpResult {
  // Pure TypeScript stub signature for Optimal Recognition Point calculations.
  // Will be implemented dynamically in later phases.
  return {
    word,
    orpIndex: 0,
    prefix: "",
    orpChar: word.charAt(0),
    suffix: word.substring(1),
  };
}
