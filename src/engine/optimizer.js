/**
 * Rank combinations: lowest final price first, business score as tiebreaker only.
 */

export function optimizeCombinations(combinations, limit = 5) {
  if (!combinations.length) return { selected: null, alternatives: [] };

  const sorted = [...combinations].sort(
    (a, b) => a.finalPrice - b.finalPrice || a.businessScore - b.businessScore
  );

  return {
    selected: sorted[0],
    alternatives: sorted.slice(1, limit + 1),
  };
}
