/**
 * Labour, wiring, civil & other service charges — separate from equipment prices.
 * Per-watt lines use total installed panel watts (or plant kW × 1000 for Tata kits).
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

/** Profit margin — plant load ≤ 5 kW → 25%; above 5 kW → 15% */
export const MARGIN = {
  thresholdKw: 5,
  rateUpTo5Kw: 0.25,
  rateAbove5Kw: 0.15,
};

/** @deprecated use getMarginRate(plantLoadKw) */
export const MARGIN_RATE = MARGIN.rateUpTo5Kw;

export function getMarginRate(plantLoadKw) {
  if (plantLoadKw == null) return MARGIN.rateUpTo5Kw;
  return plantLoadKw > MARGIN.thresholdKw ? MARGIN.rateAbove5Kw : MARGIN.rateUpTo5Kw;
}

export function getMarginRateLabel(plantLoadKw) {
  const rate = getMarginRate(plantLoadKw);
  return `${Math.round(rate * 100)}%`;
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

export const MISCELLANEOUS = {
  label: "Devices misc",
  amount: 5000,
};

export const EQUIPMENT = {
  label: "Paperwork misc",
  amount: 5000,
};
