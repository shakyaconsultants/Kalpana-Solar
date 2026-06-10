/**
 * Which inverter brand applies per system type (business rules).
 */

export const INVERTER_SELECTION_RULES = {
  "on-grid": {
    allowedBrands: ["Invergy"],
    note: "On-Grid — Invergy only",
  },
  hybrid: {
    allowedBrands: ["Invergy"],
    note: "Hybrid — Invergy only",
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

export function getAllowedInverterBrands(systemType) {
  const rule = INVERTER_SELECTION_RULES[systemType];
  if (!rule) return [];
  if (systemType === "off-grid") return ["Microtek", "Invergy"];
  return rule.allowedBrands;
}
