/**
 * Catalog loader — single entry for all engine JSON data.
 * Production: placeholders rejected at load; no duplicate sources of truth.
 */

import panels from "../data/panels.json" with { type: "json" };
import batteries from "../data/batteries.json" with { type: "json" };
import kits from "../data/kits.json" with { type: "json" };
import pricingConfig from "../data/pricing-config.json" with { type: "json" };
import compatibilityRules from "../data/compatibility-rules.json" with { type: "json" };
import invergyCatalog from "../data/inverters-invergy.json" with { type: "json" };
import microtekCatalog from "../data/inverters-microtek.json" with { type: "json" };
import { buildUnifiedInverters } from "./normalizeInverters.js";
import { sanitizeProductionCatalog } from "./validateCatalog.js";

let _cache = null;
let _health = null;

export function loadCatalog() {
  if (_cache) return _cache;

  const inverters = buildUnifiedInverters(invergyCatalog, microtekCatalog);

  const { catalog, health } = sanitizeProductionCatalog({
    panels,
    batteries: batteries.batteries,
    kits: kits.kits,
    kitBrand: kits.brand,
    inverters,
    pricingConfig,
    compatibilityRules,
  });

  _health = health;
  _cache = catalog;
  return _cache;
}

export function getCatalogHealth() {
  loadCatalog();
  return _health;
}

export function getPricingConfig() {
  return loadCatalog().pricingConfig;
}

export function getCompatibilityRules() {
  return loadCatalog().compatibilityRules;
}
