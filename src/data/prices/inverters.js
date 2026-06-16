/**
 * Inverter price index — re-exports brand-specific catalogs.
 * On-Grid & Hybrid: Invergy or Microtek (user choice).
 * Off-Grid: Microtek ≤4 kW, Invergy above 4 kW (or user choice when both apply).
 */

export {
  INVERGY_META,
  INVERGY_ONGRID,
  INVERGY_HYBRID_LV,
  INVERGY_HYBRID_HV,
  INVERGY_HYBRID_QUOTE_PRICES,
  INVERGY_OFFGRID_OGH,
  INVERGY_OFFGRID_OG,
  INVERGY_OFFGRID_COMBOS,
  INVERGY_LFP_BATTERIES,
  getInvergyHybridQuotePrice,
  getInvergyOnGridByKw,
  getInvergyOffGridOgByKw,
  getInvergyOffGridOghByKw,
} from "./invergy.js";

export {
  MICROTEK_META,
  MICROTEK_OFFGRID_MAX_KW,
  MICROTEK_ONGRID_GTI,
  MICROTEK_HYBRID,
  MICROTEK_OFFGRID_PWM,
  MICROTEK_OFFGRID_MPPT,
  MICROTEK_PANELS,
  MICROTEK_BATTERIES_DISTRIBUTOR,
  MICROTEK_DC_WIRE,
  getMicrotekOffGridForKw,
  getMicrotekOnGridByKw,
} from "./microtek.js";

export {
  INVERTER_SELECTION_RULES,
  getAllowedInverterBrands,
  getPreferredInverterBrand,
  getPreferredInverterDescription,
  resolveInverterBrand,
} from "./inverterRules.js";

export const INVERTER_BRAND_IDS = {
  Invergy: "invergy",
  Microtek: "microtek",
};
