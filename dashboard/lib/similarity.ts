/**
 * Similarity metrics for PAOS.
 *
 * Provides cosine similarity between text prompts using
 * term frequency–based vectorization (no ML dependencies).
 * Used for matching pipeline templates, agents, and tasks.
 */

/** Tokenize text into lowercase word frequency map. */
function tokenize(text: string): Map<string, number> {
  const freq = new Map<string, number>();
  const words = text.toLowerCase().match(/\p{L}+/gu) || [];
  for (const w of words) {
    const stopWords = new Set([
      "the", "a", "an", "is", "are", "was", "were", "be", "been",
      "being", "have", "has", "had", "do", "does", "did", "will",
      "would", "could", "should", "may", "might", "shall", "can",
      "to", "of", "in", "for", "on", "with", "at", "by", "from",
      "as", "into", "through", "during", "before", "after", "above",
      "below", "between", "out", "off", "over", "under", "again",
      "further", "then", "once", "here", "there", "when", "where",
      "why", "how", "all", "each", "every", "both", "few", "more",
      "most", "other", "some", "such", "no", "nor", "not", "only",
      "own", "same", "so", "than", "too", "very", "just", "because",
      "but", "and", "or", "if", "while", "that", "this", "these",
      "those", "it", "its", "you", "your", "we", "our", "they",
      "their", "what", "which", "who", "whom",
    ]);
    if (!stopWords.has(w) && w.length > 2) {
      freq.set(w, (freq.get(w) || 0) + 1);
    }
  }
  return freq;
}

/** Compute cosine similarity between two term-frequency vectors. */
export function cosineSimilarity(a: string, b: string): number {
  const vecA = tokenize(a);
  const vecB = tokenize(b);

  // Collect all terms
  const allTerms = new Set([...vecA.keys(), ...vecB.keys()]);
  if (allTerms.size === 0) return 0;

  let dot = 0, magA = 0, magB = 0;

  for (const term of allTerms) {
    const fa = vecA.get(term) || 0;
    const fb = vecB.get(term) || 0;
    dot += fa * fb;
    magA += fa * fa;
    magB += fb * fb;
  }

  const denom = Math.sqrt(magA) * Math.sqrt(magB);
  return denom === 0 ? 0 : dot / denom;
}

/** Rank items by similarity to a query. Returns top-k results with scores. */
export function rankBySimilarity<T>(
  query: string,
  items: T[],
  extractText: (item: T) => string,
  topK = 5,
): { item: T; score: number }[] {
  const scored = items
    .map((item) => ({
      item,
      score: cosineSimilarity(query, extractText(item)),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  return scored;
}
