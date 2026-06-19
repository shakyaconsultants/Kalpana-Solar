/**
 * Full quotation calculation — delegates to catalog-driven engine v2.
 * Legacy API preserved for UI and PDF.
 */

import {
  quote as engineQuote,
  validateRequirements,
  selectionsToRequirements,
  CATALOG_UNAVAILABLE_ERROR,
} from "../engine/index.js";
import { loadCatalog } from "../engine/catalog/loader.js";
import { engineResultToLegacyBreakdown } from "../engine/adapters/legacyBreakdown.js";
import { resolveInverterBrand } from "../data/uiCatalog.js";

export { CATALOG_UNAVAILABLE_ERROR } from "../engine/index.js";

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

  const resolved = {
    ...selections,
    inverterBrand:
      selections.inverterBrand ??
      resolveInverterBrand(selections.systemType, selections.plantLoadKw, selections.inverterBrand),
  };

  const engineResult = engineQuote(resolved);

  if (engineResult?.error === CATALOG_UNAVAILABLE_ERROR) {
    return {
      error: CATALOG_UNAVAILABLE_ERROR,
      finalPrice: null,
      quoteFailed: true,
      requirements: engineResult.requirements,
    };
  }

  if (!engineResult?.selected) return null;

  return engineResultToLegacyBreakdown(engineResult, resolved);
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
