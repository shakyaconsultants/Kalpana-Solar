/**
 * Re-exports for components — options, formatting, and quote calculation.
 * Pricing data: src/data/prices/
 * Calculation logic: src/calculations/calculateQuote.js
 */

export {
  INSTALLATION_TYPES,
  SYSTEM_TYPES,
  PANEL_COMPANIES,
  PANEL_CATEGORIES,
  INVERTER_BRANDS,
  BATTERY_BRANDS,
  PLANT_LOAD_OPTIONS,
  FLOOR_OPTIONS,
  formatPlantLoad,
  formatFloors,
  systemNeedsWiring,
} from "./quotationOptions.js";

export { formatINR } from "./formatCurrency.js";
export {
  getWattOptionsForSystem,
  getWattOption,
  PANEL_WATT_OPTIONS,
} from "./prices/panels.js";
export {
  getAllowedInverterBrands,
  getPreferredInverterBrand,
  resolveInverterBrand,
} from "./prices/inverterRules.js";
export { TATA_BRAND, isTataBrand, isTataEligible, getTataKit } from "./prices/tata.js";
export { calculateQuote, calculateQuoteBreakdown, isValidSelections } from "../calculations/calculateQuote.js";
