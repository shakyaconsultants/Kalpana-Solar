/**
 * Which inverter brand applies per system type (business rules).
 */

export const INVERTER_SELECTION_RULES = {
  "on-grid": {
    allowedBrands: ["Invergy", "Microtek"],
    note: "On-Grid — Invergy or Microtek",
  },
  hybrid: {
    allowedBrands: ["Invergy", "Microtek"],
    note: "Hybrid — Invergy or Microtek",
  },
  "off-grid": {
    microtekMaxKw: 4,
    note: "Off-Grid — Microtek up to 4 kW; above 4 kW use Invergy",
  },
};

/**
 * Resolve which brand should price the inverter for a given system size.
 * @returns {"microtek"|"invergy"|null}
 */
export function resolveOffGridInverterBrand(plantKw) {
  if (plantKw <= INVERTER_SELECTION_RULES["off-grid"].microtekMaxKw) {
    return "microtek";
  }
  return "invergy";
}

export function getAllowedInverterBrands(systemType, plantKw = null) {
  const rule = INVERTER_SELECTION_RULES[systemType];
  if (!rule) return [];

  if (systemType === "off-grid") {
    if (plantKw != null && plantKw > rule.microtekMaxKw) {
      return ["Invergy"];
    }
    return ["Invergy", "Microtek"];
  }

  return rule.allowedBrands;
}

/** Resolved brand for quote — auto-picks when only one option exists */
export function resolveInverterBrand(systemType, plantKw, selectedBrand) {
  const allowed = getAllowedInverterBrands(systemType, plantKw);
  if (!allowed.length) return null;
  if (allowed.length === 1) return allowed[0];
  return allowed.includes(selectedBrand) ? selectedBrand : null;
}
