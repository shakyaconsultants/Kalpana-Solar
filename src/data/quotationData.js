/**
 * Re-exports for components — options, formatting, and quote calculation.
 * Canonical catalog: src/engine/data/
 */

export {
  INSTALLATION_TYPES,
  SYSTEM_TYPES,
  PANEL_COMPANIES,
  PANEL_CATEGORIES,
  INVERTER_BRANDS,
  BATTERY_BRANDS,
  PLANT_LOAD_OPTIONS,
  PLANT_LOAD_MIN_KW,
  PLANT_LOAD_MAX_KW,
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
  TATA_BRAND,
  isTataBrand,
  isTataEligible,
  getAllowedInverterBrands,
  getPreferredInverterBrand,
  getPreferredInverterDescription,
  resolveInverterBrand,
} from "./uiCatalog.js";
export { calculateQuote, calculateQuoteBreakdown, isValidSelections } from "../calculations/calculateQuote.js";
