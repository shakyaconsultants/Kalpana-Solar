// Panels
export {
  PANEL_COMPANY_IDS,
  PANEL_CATEGORY_IDS,
  PANEL_GST_RATE,
  PANEL_PRICES,
  getPanelPrice,
  getPanelCompanyId,
} from "./panels.js";

// Batteries (Kalpana sheet)
export {
  BATTERY_BRAND_IDS,
  BATTERY_TYPES,
  BATTERY_PRICES,
  getBatteryModels,
  getBatteryById,
  getBatteryPrice,
} from "./batteries.js";

// Inverters
export * from "./inverters.js";

// Invergy & Microtek direct access
export * from "./invergy.js";
export * from "./microtek.js";

// Services, taxes, rules, packages
export { WIRING, INSTALLATION, CIVIL_WORK, INSTALLATION_MATERIAL, MISCELLANEOUS, EQUIPMENT, CLIENT_MARGIN, getClientMargin, CLIENT_SERVICE_FEE, getClientServiceFee, MARGIN_RATE, getMarginRate, getMarginRateLabel, calculatePerWattServiceCost, getWiringRate, needsWiring, calculateWiringCost } from "./services.js";
export { GST } from "./taxes.js";
export { SYSTEM_PACKAGES, findSystemPackage } from "./systemPackages.js";
export { DEFAULT_PLANT_KW, PLANT_KW_OPTIONS } from "./constants.js";
