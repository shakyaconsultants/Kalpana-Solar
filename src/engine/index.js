/**
 * Kalpana Solar Quotation Engine v2
 * Catalog-driven matching + business-rule-aware optimization.
 */

import { loadCatalog } from "./catalog/loader.js";
import { selectionsToRequirements, validateRequirements } from "./requirements.js";
import { buildCombinations } from "./combinationBuilder.js";
import { optimizeCombinations } from "./optimizer.js";
import { buildExplanation } from "./explain.js";
import { CATALOG_UNAVAILABLE_ERROR, INVALID_SELECTIONS_ERROR } from "./errors.js";

/**
 * @param {object} selections — legacy wizard selections
 * @returns {object|null} Engine result with selected, alternatives, explainability — or error
 */
export function quote(selections) {
  const catalog = loadCatalog();
  const requirements = selectionsToRequirements(selections);

  if (!validateRequirements(requirements, catalog.pricingConfig)) {
    return {
      error: INVALID_SELECTIONS_ERROR,
      requirements,
    };
  }

  const combinations = buildCombinations(requirements, catalog);
  if (!combinations.length) {
    return {
      error: CATALOG_UNAVAILABLE_ERROR,
      requirements,
      candidateCount: 0,
    };
  }

  const { selected, alternatives } = optimizeCombinations(combinations, 5);
  const explainability = buildExplanation(selected);

  return {
    selected,
    alternatives: alternatives.map((alt) => ({
      finalPrice: alt.finalPrice,
      panel: alt.panel,
      inverter: alt.inverter,
      battery: alt.battery,
      kit: alt.kit,
      businessScore: alt.businessScore,
      explainability: buildExplanation(alt),
    })),
    explainability,
    catalog,
    engineMeta: {
      version: "2.0",
      candidateCount: combinations.length,
      selectedBusinessScore: selected.businessScore,
    },
  };
}

export { selectionsToRequirements, validateRequirements } from "./requirements.js";
export { loadCatalog, getCatalogHealth } from "./catalog/loader.js";
export { CATALOG_UNAVAILABLE_ERROR, INVALID_SELECTIONS_ERROR } from "./errors.js";
