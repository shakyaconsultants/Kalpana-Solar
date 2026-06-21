/**
 * Rank combinations: smallest sufficient inverter capacity, then lowest final price.
 */

export function optimizeCombinations(combinations, limit = 5) {
  if (!combinations.length) return { selected: null, alternatives: [] };

  if (combinations.every((c) => c.kit)) {
    return { selected: combinations[0], alternatives: combinations.slice(1, limit + 1) };
  }

  const plantLoadKw = combinations[0].requirements.plantLoadKw;
  const tolerance = 0.05;

  const viable = combinations.filter(
    (c) => c.inverter && c.inverter.capacityAcKw >= plantLoadKw - tolerance
  );
  if (!viable.length) return { selected: null, alternatives: [] };

  const targetCapacity = Math.min(...viable.map((c) => c.inverter.capacityAcKw));
  const atTarget = viable.filter(
    (c) => Math.abs(c.inverter.capacityAcKw - targetCapacity) < 0.001
  );

  const sorted = [...atTarget].sort((a, b) => a.finalPrice - b.finalPrice);

  return {
    selected: sorted[0],
    alternatives: sorted.slice(1, limit + 1),
  };
}
