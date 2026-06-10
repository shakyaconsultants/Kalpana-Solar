/** Form options — no pricing here, only UI choices */

export const INSTALLATION_TYPES = ["Residential", "Commercial"];

export const SYSTEM_TYPES = [
  { id: "on-grid", label: "On-Grid", desc: "Grid-tied, no battery backup" },
  { id: "hybrid", label: "Hybrid", desc: "Grid + optional battery backup" },
  { id: "off-grid", label: "Off-Grid", desc: "Standalone — optional battery storage" },
];

export const PANEL_COMPANIES = ["Adani", "Waaree", "Vikram"];

export const PANEL_CATEGORIES = [
  { id: "topcon", label: "Topcon", desc: "High-efficiency N-type cells" },
  { id: "bifacial", label: "Bifacial", desc: "Dual-side energy capture" },
];

export const INVERTER_BRANDS = ["Invergy", "Microtek"];

export const BATTERY_BRANDS = ["Microtek", "Invergy"];

/** Plant load options: 2 kW → 10 kW in 0.5 kW steps */
export const PLANT_LOAD_MIN_KW = 2;
export const PLANT_LOAD_MAX_KW = 10;
export const PLANT_LOAD_STEP_KW = 0.5;

export const PLANT_LOAD_OPTIONS = buildPlantLoadOptions(
  PLANT_LOAD_MIN_KW,
  PLANT_LOAD_MAX_KW,
  PLANT_LOAD_STEP_KW
);

export function buildPlantLoadOptions(minKw, maxKw, stepKw) {
  const options = [];
  const steps = Math.round((maxKw - minKw) / stepKw);
  for (let i = 0; i <= steps; i++) {
    const kw = Math.round((minKw + i * stepKw) * 10) / 10;
    options.push({
      id: kw,
      label: `${kw} kW`,
    });
  }
  return options;
}

export function formatPlantLoad(kw) {
  if (kw == null || kw === "") return "";
  return `${kw} kW`;
}

/** Floors — on-grid & hybrid only */
export const FLOOR_OPTIONS = [1, 2, 3, 4, 5].map((n) => ({
  id: n,
  label: n === 1 ? "1 floor (G)" : `${n} floors`,
  desc: n === 1 ? "Single floor / ground only" : `${n}-storey building`,
}));

export function formatFloors(floors) {
  if (floors == null) return "";
  return floors === 1 ? "1 floor" : `${floors} floors`;
}

export function systemNeedsWiring(systemType) {
  return systemType === "on-grid" || systemType === "hybrid";
}
