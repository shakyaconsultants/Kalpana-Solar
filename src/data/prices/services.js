/**
 * Labour, wiring, civil & other service charges — separate from equipment prices.
 */

export const WIRING = {
  "on-grid": {
    label: "On-Grid wiring",
    pricePerFloor: 3000,
  },
  hybrid: {
    label: "Hybrid wiring",
    pricePerFloor: 5000,
  },
  "off-grid": {
    label: "Off-Grid wiring",
    pricePerFloor: null, // not specified — set when rule is confirmed
  },
};

export const INSTALLATION = {
  label: "Installation labour",
  pricePerWatt: 2, // ₹2 per watt
};

export const CIVIL_WORK = {
  label: "Civil work",
  pricePerKw: 400, // ₹400 per kW
};

export const INSTALLATION_MATERIAL = {
  label: "Installation material",
  amount: 14000,
};

export function getWiringRate(systemType) {
  return WIRING[systemType] ?? null;
}

export function needsWiring(systemType) {
  return systemType === "on-grid" || systemType === "hybrid";
}

export function calculateWiringCost(systemType, floors) {
  if (!needsWiring(systemType) || !floors) return 0;
  const rate = WIRING[systemType]?.pricePerFloor;
  if (rate == null) return 0;
  return rate * floors;
}

export const MISCELLANEOUS = {
  label: "Miscellaneous (saman)",
  amount: 5000,
};

export const EQUIPMENT = {
  label: "Miscellaneous (labour)",
  amount: 5000,
};

/** Applied to subtotal before tax adjustments on final customer price */
export const MARGIN_RATE = 0.25;
