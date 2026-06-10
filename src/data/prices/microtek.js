/**
 * Microtek inverter, panel & battery catalog — Jaganlite price list (W.E.F. 01.06.2026).
 * Prices are ex-GST; 5% GST is added on inverters at calculation (see taxes.js).
 * Stored separately from Invergy and Kalpana battery sheet.
 *
 * Business rule: Microtek inverters used for Off-Grid systems up to 4 kW only.
 */

import { GST } from "./taxes.js";

export const MICROTEK_BRAND = "microtek";

export const MICROTEK_META = {
  brand: "Microtek",
  distributor: "Jaganlite India Private Limited",
  effectiveFrom: "2026-06-01",
  inverterGstRate: GST.MICROTEK_INVERTER_RATE,
  note: "GST & freight extra as per actual on distributor sheet",
};

export const MICROTEK_OFFGRID_MAX_KW = 4;

// ─── On-Grid GTI (ex-GST + 5% GST) ──────

export const MICROTEK_ONGRID_GTI = {
  singlePhase: [
    { capacityKw: 3, priceExGst: 16350 },
    { capacityKw: 5, priceExGst: 28000 },
  ],
  threePhase: [
    { capacityKw: 5, priceExGst: 45000 },
    { capacityKw: 8, priceExGst: 50000 },
    { capacityKw: 10, priceExGst: 54000 },
    { capacityKw: 15, priceExGst: 62000 },
    { capacityKw: 20, priceExGst: 72000 },
    { capacityKw: 30, priceExGst: 109000 },
    { capacityKw: 40, priceExGst: 126000 },
    { capacityKw: 50, priceExGst: 144000 },
    { capacityKw: 60, priceExGst: 159000 },
    { capacityKw: 80, priceExGst: 211000 },
    { capacityKw: 100, priceExGst: 250000 },
    { capacityKw: 250, priceExGst: 415000 },
  ],
};

// ─── Hybrid IP65 (ex-GST + 5% GST) ──────

export const MICROTEK_HYBRID = {
  singlePhase: [
    { capacityKw: 3, voltage: "48-51.2V", priceExGst: 54000 },
    { capacityKw: 5, voltage: "48-51.2V", priceExGst: 74000 },
    { capacityKw: 6, voltage: "48-51.2V", priceExGst: 86000 },
    { capacityKw: 8, voltage: "48-51.2V", priceExGst: 114000 },
    { capacityKw: 10, voltage: "48-51.2V", priceExGst: 140000 },
  ],
  threePhase: [
    { capacityKw: 8, voltage: "48-51.2V", priceExGst: 157000 },
    { capacityKw: 10, voltage: "48-51.2V", priceExGst: 173000 },
  ],
};

// ─── Off-Grid PWM (ex-GST + 5% GST) — use up to 4 kW ───────────────────────

export const MICROTEK_OFFGRID_PWM = [
  { model: "2550/24v", capacityKva: 2.55, voltage: "24V", priceExGst: 11200 },
  { model: "3050/24v", capacityKva: 3.05, voltage: "24V", priceExGst: 11500 },
  { model: "4050/48v", capacityKva: 4.05, voltage: "48V", priceExGst: 18800 },
  { model: "4550/48v", capacityKva: 4.55, voltage: "48V", priceExGst: 18600 },
  { model: "6 kva/48v", capacityKva: 6, voltage: "48V", priceExGst: 33000 },
];

// ─── Off-Grid MPPT (ex-GST + 5% GST) — above 4 kW use Invergy per rule ─────

export const MICROTEK_OFFGRID_MPPT = [
  { model: "5 kva/48v", capacityKva: 5, voltage: "48V", priceExGst: 39900 },
  { model: "8070/96v", capacityKva: 7.5, voltage: "96V", priceExGst: 64400 },
  { model: "10070/120v", capacityKva: 10, voltage: "120V", priceExGst: 82800 },
];

// ─── Microtek panels (ex-GST + 5% GST on panels) — reference catalog ───────

export const MICROTEK_PANELS = {
  dcr: [
    { model: "580W Topcon", watt: 580, pricePerWattExGst: 27.0 },
    { model: "545W Bifacial", watt: 545, pricePerWattExGst: 25.75 },
    { model: "500W Bifacial", watt: 500, pricePerWattExGst: 26.0 },
  ],
  nonDcr: [
    { model: "625W TopCon", watt: 625, pricePerWattExGst: 16.25 },
    { model: "590W TopCon", watt: 590, pricePerWattExGst: 16.25 },
    { model: "550W Bifacial", watt: 550, pricePerWattExGst: 14.5 },
  ],
};

// ─── Microtek batteries — distributor list (Kalpana sheet prices in batteries.js) ─

export const MICROTEK_BATTERIES_DISTRIBUTOR = {
  lithium: [
    { size: "1280 WH", ah: 100, voltage: 12.8, priceExGst: 16000 },
    { size: "2560 WH", ah: 100, voltage: 25.6, priceExGst: 32000 },
    { size: "5120 WH", ah: 100, voltage: 51.2, priceExGst: 64000 },
  ],
};

// ─── DC Wire (ex-GST) ──────────────────────────────────────────────────────

export const MICROTEK_DC_WIRE = [
  { sqmm: 4, pricePerMeterExGst: 54 },
  { sqmm: 6, pricePerMeterExGst: 84 },
  { sqmm: 10, pricePerMeterExGst: 165 },
];

/** Pick best Microtek off-grid inverter for capacity ≤ 4 kW */
export function getMicrotekOffGridForKw(plantKw) {
  if (plantKw > MICROTEK_OFFGRID_MAX_KW) return null;

  const pwm = MICROTEK_OFFGRID_PWM.filter((i) => i.capacityKva <= plantKw + 0.5);
  if (pwm.length === 0) return MICROTEK_OFFGRID_PWM[0];

  return pwm.reduce((best, cur) =>
    cur.capacityKva >= plantKw && (!best || cur.capacityKva < best.capacityKva)
      ? cur
      : best
  , null) ?? MICROTEK_OFFGRID_PWM[pwm.length - 1];
}

export function getMicrotekOnGridByKw(capacityKw, phase = "singlePhase") {
  const list = MICROTEK_ONGRID_GTI[phase === "3P" ? "threePhase" : "singlePhase"];
  return list?.find((i) => i.capacityKw === capacityKw) ?? null;
}
