/**
 * Inverter brand rules (client business rules).
 *
 * Both brands (Invergy & Microtek) are always offered for off-grid; the cheaper /
 * recommended one is flagged as "preferred":
 *   • On-grid (Residential): Invergy preferred, Microtek alternative.
 *   • Hybrid:                Microtek preferred @ 3 kW, Invergy preferred from 4 kW.
 *   • Off-grid (Commercial): Microtek preferred up to 4 kW, Invergy preferred from 5 kW.
 */

export const MICROTEK_OFFGRID_PWM_MAX_KW = 4;

export const INVERTER_SELECTION_RULES = {
  "on-grid": {
    allowedBrands: ["Invergy", "Microtek"],
    note: "On-Grid — Invergy preferred, Microtek alternative",
  },
  hybrid: {
    allowedBrands: ["Invergy", "Microtek"],
    note: "Hybrid — Microtek preferred up to 3 kW, Invergy from 4 kW",
  },
  "off-grid": {
    note: "Off-Grid — Microtek preferred up to 4 kW (PWM), MPPT above; Invergy preferred from 5 kW",
  },
};

/** Both brands are always selectable — preferred is marked in the UI only */
export function getAllowedInverterBrands(systemType, _plantKw = null) {
  if (systemType === "on-grid" || systemType === "hybrid" || systemType === "off-grid") {
    return ["Invergy", "Microtek"];
  }
  return [];
}

/** The recommended (cheaper) brand to default-select for a configuration */
export function getPreferredInverterBrand(systemType, plantKw = null) {
  if (systemType === "on-grid") return "Invergy";

  if (systemType === "hybrid") {
    return plantKw != null && plantKw <= 3 ? "Microtek" : "Invergy";
  }

  if (systemType === "off-grid") {
    return plantKw != null && plantKw <= MICROTEK_OFFGRID_PWM_MAX_KW ? "Microtek" : "Invergy";
  }

  return null;
}

/**
 * Resolve the brand used for pricing.
 * Uses the customer's choice when valid, otherwise falls back to the preferred brand.
 * @returns {"Invergy"|"Microtek"|null}
 */
export function resolveInverterBrand(systemType, plantKw, selectedBrand) {
  const allowed = getAllowedInverterBrands(systemType, plantKw);
  if (!allowed.length) return null;
  if (selectedBrand && allowed.includes(selectedBrand)) return selectedBrand;
  return getPreferredInverterBrand(systemType, plantKw);
}
