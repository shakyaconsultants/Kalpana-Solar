/**
 * Labour, wiring, civil & service charges — separate from equipment prices.
 * Profit margin is a flat ₹ amount by plant load (not a %), see CLIENT_MARGIN.
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
    pricePerFloor: null,
  },
};

export const INSTALLATION = {
  label: "Installation charge",
  pricePerWatt: 2,
};

export const INSTALLATION_MATERIAL = {
  label: "Installation material",
  pricePerWatt: 3.5,
};

export const CIVIL_WORK = {
  label: "Civil work",
  pricePerWatt: 0.4,
};

export const MISCELLANEOUS = {
  label: "Devices misc",
  amount: 5000,
};

export const EQUIPMENT = {
  label: "Paperwork misc",
  amount: 5000,
};

/**
 * Client profit margin — flat ₹ by plant load (NOT a percentage).
 * Replaces old 25% / 15% margin on subtotal.
 *
 *   2 kW → ₹30,000 · 3 kW → ₹35,000 · 4 kW → ₹40,000 · 5 kW → ₹45,000
 *   6 kW → ₹50,000 … +₹5,000 per kW through 10 kW → ₹70,000
 */
export const CLIENT_MARGIN = {
  label: "Profit margin (flat by plant load)",
  byKw: {
    1: 25000,
    2: 30000,
    3: 35000,
    4: 40000,
    5: 45000,
    6: 50000,
    7: 55000,
    8: 60000,
    9: 65000,
    10: 70000,
    11: 75000,
  },
};

export function getClientMargin(plantLoadKw) {
  if (plantLoadKw == null) return 0;
  const kw = Math.round(plantLoadKw);
  if (CLIENT_MARGIN.byKw[kw] != null) return CLIENT_MARGIN.byKw[kw];
  if (kw >= 2) return kw * 5000 + 20000;
  return 25000;
}

/** @deprecated no longer a % — use getClientMargin(plantLoadKw) */
export const MARGIN_RATE = 0;

export function getMarginRate() {
  return 0;
}

export function getMarginRateLabel(plantLoadKw) {
  return `Flat ${getClientMargin(plantLoadKw).toLocaleString("en-IN")}`;
}

export function calculatePerWattServiceCost(pricePerWatt, totalWatts) {
  return Math.round(totalWatts * pricePerWatt);
}

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

/** @deprecated alias — was misnamed as service fee */
export const CLIENT_SERVICE_FEE = CLIENT_MARGIN;
export function getClientServiceFee(plantLoadKw) {
  return getClientMargin(plantLoadKw);
}
