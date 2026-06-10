// Form options — pricing logic will be wired in later
export const INSTALLATION_TYPES = ["Residential", "Commercial"];

export const SYSTEM_TYPES = [
  { id: "on-grid", label: "On-Grid", desc: "Grid-tied, no battery backup" },
  { id: "hybrid", label: "Hybrid", desc: "Grid + optional battery backup" },
  { id: "off-grid", label: "Off-Grid", desc: "Fully standalone with batteries" },
];

export const PANEL_COMPANIES = ["Adani", "Waaree", "Vikram"];

export const PANEL_CATEGORIES = [
  { id: "topcon", label: "Topcon", desc: "High-efficiency N-type cells" },
  { id: "bifacial", label: "Bifacial", desc: "Dual-side energy capture" },
];

export const INVERTER_BRANDS = ["Invergy", "Microtek"];

export const BATTERY_BRANDS = ["Microtek", "Invergy"];

export function formatINR(amount) {
  if (amount == null) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Placeholder — returns final price when all selections are valid.
 * Calculation logic will be added when pricing data is provided.
 */
export function calculateQuote(selections) {
  const {
    installationType,
    systemType,
    wantsBattery,
    panelCompany,
    panelCategory,
    inverterBrand,
    batteryBrand,
  } = selections;

  if (!installationType || !systemType || !panelCompany || !panelCategory || !inverterBrand) {
    return null;
  }

  if (systemType === "hybrid" && wantsBattery == null) return null;
  if (systemType === "hybrid" && wantsBattery && !batteryBrand) return null;

  // Pricing logic to be implemented
  return null;
}
