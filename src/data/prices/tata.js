/**
 * Tata bundled solar kit — On-Grid 3 kW / 4 kW base kit price (rate list).
 * Services and flat profit margin by plant kW are added in calculateQuote.js.
 */

export const TATA_BRAND = "Tata";

export const TATA_KITS = {
  3: { plantKw: 3, price: 200000, label: "Tata 3 kW On-Grid Solar Kit" },
  4: { plantKw: 4, price: 250000, label: "Tata 4 kW On-Grid Solar Kit" },
};

export function isTataBrand(panelCompany) {
  return panelCompany === TATA_BRAND;
}

/** Tata kit only applies to On-Grid 3 kW & 4 kW */
export function isTataEligible(systemType, plantKw) {
  return systemType === "on-grid" && (plantKw === 3 || plantKw === 4);
}

export function getTataKit(systemType, plantKw) {
  if (!isTataEligible(systemType, plantKw)) return null;
  return TATA_KITS[plantKw] ?? null;
}
