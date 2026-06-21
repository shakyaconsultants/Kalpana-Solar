/**
 * Full quotation calculation — delegates to catalog-driven engine v2.
 * Legacy API preserved for UI and PDF.
 */

import {
  quote as engineQuote,
  validateRequirements,
  selectionsToRequirements,
  CATALOG_UNAVAILABLE_ERROR,
  INVERTER_UNAVAILABLE_ERROR,
} from "../engine/index.js";
import { loadCatalog } from "../engine/catalog/loader.js";
import { engineResultToLegacyBreakdown } from "../engine/adapters/legacyBreakdown.js";

export {
  CATALOG_UNAVAILABLE_ERROR,
  INVERTER_UNAVAILABLE_ERROR,
} from "../engine/index.js";

export function isValidSelections(selections) {
  const catalog = loadCatalog();
  const requirements = selectionsToRequirements(selections);
  return validateRequirements(requirements, catalog.pricingConfig);
}

/**
 * @returns {object|null} Full quote with finalPrice, matched equipment, and components
 */
export function calculateQuoteBreakdown(selections) {
  if (!isValidSelections(selections)) return null;

  const engineResult = engineQuote(selections);

  if (
    engineResult?.error === CATALOG_UNAVAILABLE_ERROR ||
    engineResult?.error === INVERTER_UNAVAILABLE_ERROR
  ) {
    return {
      error: engineResult.error,
      finalPrice: null,
      quoteFailed: true,
      requirements: engineResult.requirements,
    };
  }

  if (!engineResult?.selected) return null;

  return engineResultToLegacyBreakdown(engineResult, selections);
}

/** Final customer price = equipment + services + margin */
export function calculateQuote(selections) {
  return calculateQuoteBreakdown(selections)?.finalPrice ?? null;
}

export function needsBattery(systemType, wantsBattery) {
  if (systemType === "on-grid") return false;
  if (systemType === "hybrid" || systemType === "off-grid") return wantsBattery === true;
  return false;
}
