export function getLevenshteinDistance(a: string, b: string): number {
  const matrix = Array.from({ length: a.length + 1 }, () =>
    Array(b.length + 1).fill(0)
  );

  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // deletion
        matrix[i][j - 1] + 1, // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return matrix[a.length][b.length];
}

export interface SearchableItem {
  title: string;
  author: string;
}

export function findSpellingSuggestion(
  query: string,
  items: SearchableItem[]
): string | null {
  if (!query || items.length === 0) return null;
  const cleanQuery = query.trim().toLowerCase();
  if (cleanQuery.length < 2) return null;

  let bestSuggestion: string | null = null;
  let lowestDistance = Infinity;

  for (const item of items) {
    const titleLower = item.title.toLowerCase();
    const authorLower = item.author.toLowerCase();

    // Check if the query is an exact substring (e.g., "dune" in "Dune: Messiah")
    if (titleLower.includes(cleanQuery) && cleanQuery.length >= 3) {
      return item.title;
    }
    if (authorLower.includes(cleanQuery) && cleanQuery.length >= 3) {
      return item.author;
    }

    const titleDist = getLevenshteinDistance(cleanQuery, titleLower);
    const authorDist = getLevenshteinDistance(cleanQuery, authorLower);

    // Dynamic thresholds: Levenshtein distance must be small relative to input/target length
    const titleThreshold = Math.max(3, Math.floor(titleLower.length / 2));
    if (titleDist < lowestDistance && titleDist <= titleThreshold) {
      lowestDistance = titleDist;
      bestSuggestion = item.title;
    }

    const authorThreshold = Math.max(3, Math.floor(authorLower.length / 2));
    if (authorDist < lowestDistance && authorDist <= authorThreshold) {
      lowestDistance = authorDist;
      bestSuggestion = item.author;
    }
  }

  // Only return suggestion if it's sufficiently close (edit distance <= 3)
  return lowestDistance <= 3 ? bestSuggestion : null;
}
