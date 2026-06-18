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
  INVERTER_PHASE_OPTIONS,
  INVERTER_PHASE_THRESHOLD_KW,
  formatPlantLoad,
  formatFloors,
  systemNeedsWiring,
  showInverterPhaseOption,
} from "./quotationOptions.js";

export { formatINR } from "./formatCurrency.js";
export {
  getWattOptionsForSystem,
  getWattOptionsForCompany,
  getPanelCompaniesForSelection,
  getWattOption,
  PANEL_WATT_OPTIONS,
  STANDARD_PANEL_COMPANIES,
} from "./prices/panels.js";
export {
  getAllowedInverterBrands,
  getPreferredInverterBrand,
  getPreferredInverterDescription,
  resolveInverterBrand,
} from "./prices/inverterRules.js";
export { TATA_BRAND, isTataBrand, isTataEligible, getTataKit } from "./prices/tata.js";
export { calculateQuote, calculateQuoteBreakdown, isValidSelections } from "../calculations/calculateQuote.js";
