/**
 * Kalpana Solar Quotation Engine v2
 * Catalog-driven matching + business-rule-aware optimization.
 */

import { loadCatalog } from "./catalog/loader.js";
import { selectionsToRequirements, validateRequirements } from "./requirements.js";
import { buildCombinations } from "./combinationBuilder.js";
import { optimizeCombinations } from "./optimizer.js";
import { buildExplanation } from "./explain.js";
import {
  CATALOG_UNAVAILABLE_ERROR,
  INVERTER_UNAVAILABLE_ERROR,
  INVALID_SELECTIONS_ERROR,
} from "./errors.js";

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
      error: INVERTER_UNAVAILABLE_ERROR,
      requirements,
      candidateCount: 0,
    };
  }

  const { selected, alternatives } = optimizeCombinations(combinations, 5);
  if (!selected) {
    return {
      error: INVERTER_UNAVAILABLE_ERROR,
      requirements,
      candidateCount: combinations.length,
    };
  }

  const explainability = buildExplanation(selected);

  return {
    selected,
    alternatives: alternatives.map((alt) => ({
      finalPrice: alt.finalPrice,
      panel: alt.panel,
      inverter: alt.inverter,
      battery: alt.battery,
      kit: alt.kit,
      batteryStatus: alt.batteryStatus,
      batteryWarning: alt.batteryWarning,
      explainability: buildExplanation(alt),
    })),
    explainability,
    warnings: selected.batteryWarning ? [selected.batteryWarning] : [],
    batteryStatus: selected.batteryStatus ?? null,
    catalog,
    engineMeta: {
      version: "2.0",
      candidateCount: combinations.length,
    },
  };
}

export { selectionsToRequirements, validateRequirements } from "./requirements.js";
export { loadCatalog, getCatalogHealth } from "./catalog/loader.js";
export {
  BRAND_UNAVAILABLE_ERROR,
  BATTERY_UNAVAILABLE_WARNING,
  CATALOG_UNAVAILABLE_ERROR,
  INVERTER_UNAVAILABLE_ERROR,
  INVALID_SELECTIONS_ERROR,
} from "./errors.js";
