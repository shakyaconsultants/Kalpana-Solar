/** Form options — no pricing here, only UI choices */

export const INSTALLATION_TYPES = ["Residential", "Commercial"];

export const SYSTEM_TYPES = [
  { id: "on-grid", label: "On-Grid", desc: "Grid-tied, no battery backup" },
  { id: "hybrid", label: "Hybrid", desc: "Grid + optional battery backup" },
  { id: "off-grid", label: "Off-Grid", desc: "Standalone — optional battery storage" },
];

export const PANEL_COMPANIES = ["Adani", "Waaree", "Vikram", "Premier", "Tata"];

/** Retained for the quotation document label helper (not a form choice anymore) */
export const PANEL_CATEGORIES = [
  { id: "topcon", label: "Topcon", desc: "High-efficiency N-type cells" },
  { id: "bifacial", label: "Bifacial", desc: "Dual-side energy capture" },
];

export const INVERTER_BRANDS = ["Invergy", "Microtek"];

export const BATTERY_BRANDS = ["Microtek", "Invergy"];

/** Plant load options: 1 kW → 10 kW (integer steps only) */
export const PLANT_LOAD_MIN_KW = 1;
export const PLANT_LOAD_MAX_KW = 10;
export const PLANT_LOAD_STEP_KW = 1;

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

/** Three-phase inverter choice — available from 5 kW plant load (on-grid / hybrid) */
export const INVERTER_PHASE_THRESHOLD_KW = 5;

export const INVERTER_PHASE_OPTIONS = [
  { id: "singlePhase", label: "Single Phase", desc: "230 V — standard residential" },
  { id: "threePhase", label: "Three Phase", desc: "380/400 V — commercial / large systems" },
];

export function showInverterPhaseOption(plantLoadKw, systemType, isTata = false) {
  if (isTata || plantLoadKw == null || plantLoadKw < INVERTER_PHASE_THRESHOLD_KW) return false;
  return systemType === "on-grid" || systemType === "hybrid";
}
