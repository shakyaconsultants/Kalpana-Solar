/** Shared test fixtures for quotation engine */

export const PLANT_LOADS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
export const SYSTEM_TYPES = ["on-grid", "hybrid", "off-grid"];
export const BATTERY_OPTIONS = [false, true];
export const PHASE_OPTIONS = ["singlePhase", "threePhase"];

export function baseSelections(plantLoadKw, systemType, wantsBattery, phase = null) {
  const defaultPhase =
    plantLoadKw >= 5 && systemType !== "off-grid" ? "threePhase" : "singlePhase";

  return {
    plantLoadKw,
    installationType: plantLoadKw >= 5 ? "Commercial" : "Residential",
    systemType,
    floors: systemType === "off-grid" ? null : 1,
    wantsBattery: systemType === "on-grid" ? null : wantsBattery,
    panelCompany: "Adani",
    panelWatt: systemType === "off-grid" ? 630 : 590,
    inverterBrand: "Invergy",
    inverterPhase: phase ?? defaultPhase,
  };
}

export function tataSelections(plantLoadKw) {
  return {
    plantLoadKw,
    installationType: "Residential",
    systemType: "on-grid",
    floors: 1,
    wantsBattery: null,
    panelCompany: "Tata",
    panelWatt: null,
    inverterBrand: null,
    inverterPhase: "singlePhase",
  };
}
