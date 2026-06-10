/**
 * Invergy inverter & battery catalog — MSP price list (W.E.F. Oct 25).
 * MSP prices are GST-inclusive per supplier sheet.
 * Stored separately from Microtek and from Kalpana battery list.
 */

export const INVERGY_BRAND = "invergy";

export const INVERGY_META = {
  brand: "Invergy",
  listGstIncluded: true,
  source: "INVERGY PRICE LIST (W.E.F Oct 25)",
};

/**
 * Kalpana quote override — Hybrid OGH models (ex-GST + 5% GST at calculation).
 * These override MSP for quotation when matched by capacity.
 */
export const INVERGY_HYBRID_QUOTE_PRICES = [
  {
    modelNo: "INV-OGH-3.0K",
    capacityKw: 3,
    priceExGst: 35200,
    gstRate: 0.05,
  },
  {
    modelNo: "INV-OGH-5.0K",
    capacityKw: 5,
    priceExGst: 48000,
    gstRate: 0.05,
  },
];

// ─── On-Grid String Inverters (GST included MSP) ───────────────────────────

export const INVERGY_ONGRID = [
  { modelNo: "INV (EU)-E-3 GT-01", capacityKw: 3, phase: "1P", voltage: "230VAC", msp: 14983 },
  { modelNo: "INV (EU)-E-3.3 GT-01", capacityKw: 3.3, phase: "1P", voltage: "230VAC", msp: 15352 },
  { modelNo: "INV (EU)-E-3.6 GT-01", capacityKw: 3.6, phase: "1P", voltage: "230VAC", msp: 15702 },
  { modelNo: "INV (EU)-E-4.0 GT-01", capacityKw: 4, phase: "1P", voltage: "230VAC", msp: 21047 },
  { modelNo: "INV (EU)-E-5 GT-01", capacityKw: 5, phase: "1P", voltage: "230VAC", msp: 25002 },
  { modelNo: "INV (EU)-E-6 GT-01", capacityKw: 6, phase: "1P", voltage: "230VAC", msp: 28172 },
  { modelNo: "INV (EU)-E-5 GT-03(P)", capacityKw: 5, phase: "3P", voltage: "380VAC", msp: 38817 },
  { modelNo: "INV (EU)-E-6 GT-03(P)", capacityKw: 6, phase: "3P", voltage: "380VAC", msp: 40374 },
  { modelNo: "INV (EU)-E-8 GT-03(P)", capacityKw: 8, phase: "3P", voltage: "380VAC", msp: 42657 },
  { modelNo: "INV (EU)-E-10 GT-03(P)", capacityKw: 10, phase: "3P", voltage: "380VAC", msp: 45906 },
  { modelNo: "INV (EU)-E-12 GT-03(P)", capacityKw: 12, phase: "3P", voltage: "380VAC", msp: 52213 },
  { modelNo: "INV (EU)-E-15 GT-03(P)", capacityKw: 15, phase: "3P", voltage: "380VAC", msp: 54002 },
  { modelNo: "INV (EU)-E-18 GT-03(P)", capacityKw: 18, phase: "3P", voltage: "380VAC", msp: 60701 },
  { modelNo: "INV (EU)-E-20 GT-03(P)", capacityKw: 20, phase: "3P", voltage: "380VAC", msp: 66388 },
  { modelNo: "INV (EU)-E-25 GT-03(P)", capacityKw: 25, phase: "3P", voltage: "380VAC", msp: 70348 },
];

// ─── Hybrid Inverters — LV Series (GST included MSP) ───────────────────────

export const INVERGY_HYBRID_LV = [
  { modelNo: "INV EU 3KW-24V-1P", capacityKw: 3, phase: "1P", voltage: "230VAC", msp: 64879 },
  { modelNo: "INV EU 3.6KW-48V-1P", capacityKw: 3.6, phase: "1P", voltage: "230VAC", msp: 72224 },
  { modelNo: "INV EU 5KW-48V-1P", capacityKw: 5, phase: "1P", voltage: "230VAC", msp: 80540 },
  { modelNo: "INV EU 6KW-48V-1P", capacityKw: 6, phase: "1P", voltage: "230VAC", msp: 85015 },
  { modelNo: "INV EU 8KW-48V-1P", capacityKw: 8, phase: "1P", voltage: "230VAC", msp: 122497 },
  { modelNo: "INV 5K-3P(LV)", capacityKw: 5, phase: "3P", voltage: "400VAC", msp: 140543 },
  { modelNo: "INV 6K-3P(LV)", capacityKw: 6, phase: "3P", voltage: "400VAC", msp: 169273 },
  { modelNo: "INV 8K-3P(LV)", capacityKw: 8, phase: "3P", voltage: "400VAC", msp: 177737 },
  { modelNo: "INV 10K-3P(LV)", capacityKw: 10, phase: "3P", voltage: "400VAC", msp: 186723 },
  { modelNo: "INV 12K-3P(LV)", capacityKw: 12, phase: "3P", voltage: "400VAC", msp: 192746 },
  { modelNo: "INV 15K-3P(LV)", capacityKw: 15, phase: "3P", voltage: "400VAC", msp: 247110 },
  { modelNo: "INV 20K-3P(LV)", capacityKw: 20, phase: "3P", voltage: "400VAC", msp: 323238 },
];

// ─── Hybrid Inverters — HV Series (GST included MSP) ───────────────────────

export const INVERGY_HYBRID_HV = [
  { modelNo: "INV (EU)-15K(HV)", capacityKw: 15, phase: "3P", voltage: "400VAC", msp: 210765 },
  { modelNo: "INV (EU)-20K(HV)", capacityKw: 20, phase: "3P", voltage: "400VAC", msp: 234544 },
  { modelNo: "INV (EU)-30K(HV)", capacityKw: 30, phase: "3P", voltage: "400VAC", msp: 404645 },
  { modelNo: "INV (EU)-40K(HV)", capacityKw: 40, phase: "3P", voltage: "400VAC", msp: 482462 },
  { modelNo: "INV (EU)-50K(HV)", capacityKw: 50, phase: "3P", voltage: "400VAC", msp: 541926 },
  { modelNo: "INV (EU)-80K(HV)", capacityKw: 80, phase: "3P", voltage: "400VAC", msp: 778165 },
];

// ─── Off-Grid Hybrid (OGH) — MSP + Kalpana quote overrides ─────────────────

export const INVERGY_OFFGRID_OGH = [
  { modelNo: "INV-OGH-1.5K (AVMIIP)-12V", capacityKw: 1.5, msp: 33976 },
  { modelNo: "INV-OGH-3.0K (AVMIIP)-24V", capacityKw: 3, msp: 35640 },
  { modelNo: "INV-OGH-4.0K (AVMIIP)-24V", capacityKw: 4, msp: 38728 },
  { modelNo: "INV-OGH-5.0K (AVMIIP)-24V", capacityKw: 5, msp: 48410 },
  { modelNo: "INV-OGH-6.2K (AVMIIP)-48V", capacityKw: 6.2, msp: 52509 },
  { modelNo: "INV-OGH-8.0K (AMIIT)-48V", capacityKw: 8, msp: 112661 },
  { modelNo: "INV-OGH-10.0K (AMIIT)-48V", capacityKw: 10, msp: 114641 },
  { modelNo: "INV-OGH-11.0K (AMIIT)-48V", capacityKw: 11, msp: 125062 },
];

// ─── Off-Grid (OG) — for >4 kW off-grid per business rule ──────────────────

export const INVERGY_OFFGRID_OG = [
  { modelNo: "INV-OG-1.2K(VMIIP)-12V", capacityKw: 1.2, msp: 25241 },
  { modelNo: "INV-OG-2.5K(VMIIP)-124V", capacityKw: 2.5, msp: 26901 },
  { modelNo: "INV-OG-3K(VMIIP)-24V", capacityKw: 3, msp: 27233 },
  { modelNo: "INV-OG-5K(VMIIP)-48V", capacityKw: 5, msp: 36864 },
  { modelNo: "INV-OG-4.0K(VM4 T)-48V", capacityKw: 4, msp: 39355 },
  { modelNo: "INV-OG-6.0K(VM4 T)-48V", capacityKw: 6, msp: 45499 },
];

// ─── Off-Grid System Combos (inverter + battery) ───────────────────────────

export const INVERGY_OFFGRID_COMBOS = [
  { modelNo: "INV-OGS-0550", description: "5KW 51.2V 100AH", msp: 174582 },
  { modelNo: "INV-OGS0510", description: "5KW 51.2V 200AH", msp: 269809 },
];

// ─── Invergy LFP Batteries (supplier MSP — separate from Kalpana battery sheet) ─

export const INVERGY_LFP_BATTERIES = {
  rack: [
    { modelNo: "INV (EU) - 5.0 W01-51.2", description: "5KWH 51.2V Wall Mount (LV)", msp: 81529 },
    { modelNo: "INV (EU) - 5.0 F01-51.2", description: "5KWH 51.2V Floor Mount (LV)", msp: 84494 },
    { modelNo: "INV (EU) - 5.0 S01-51.2", description: "5KWH 51.2V Stackable (LV)", msp: 85235 },
    { modelNo: "INV(EU) - 51.2 RHV-512", description: "100AH 512V Rack (HV)", msp: 992931 },
    { modelNo: "INV(EU) - 66.5 RHM-665", description: "100AH 665V Rack (HV)", msp: 1319181 },
  ],
  tubular: [
    { modelNo: "INV LFP 12080-TB", description: "80AH 12V BT", msp: 11747 },
    { modelNo: "INV LFP 12100-TB", description: "100AH 12V BT", msp: 15349 },
    { modelNo: "INV LFP 12150-TB", description: "150AH 12V BT", msp: 22996 },
    { modelNo: "INV LFP 12200-TB", description: "200AH 12V BT", msp: 28745 },
    { modelNo: "INV LFP 24100-TB", description: "100AH 24V BT", msp: 29463 },
    { modelNo: "INV LFP 24200-TB", description: "200AH 24V BT", msp: 52459 },
    { modelNo: "INV LFP 12007-TB", description: "7AH 12V BT", msp: 2228 },
    { modelNo: "INV LFP 12012-TB", description: "12AH 12V BT", msp: 3162 },
    { modelNo: "INV LFP 12018-TB", description: "18AH 12V BT", msp: 4455 },
  ],
};

export function getInvergyHybridQuotePrice(capacityKw) {
  return INVERGY_HYBRID_QUOTE_PRICES.find((p) => p.capacityKw === capacityKw) ?? null;
}

export function getInvergyOnGridByKw(capacityKw) {
  return INVERGY_ONGRID.find((i) => i.capacityKw === capacityKw) ?? null;
}

export function getInvergyOffGridOgByKw(capacityKw) {
  return INVERGY_OFFGRID_OG.find((i) => i.capacityKw === capacityKw) ?? null;
}

export function getInvergyOffGridOghByKw(capacityKw) {
  return INVERGY_OFFGRID_OGH.find((i) => i.capacityKw === capacityKw) ?? null;
}
