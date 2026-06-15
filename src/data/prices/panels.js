/**
 * Solar panel specs & rates — Adani / Waaree / Vikram.
 * DCR & Non-DCR rates from Kalpana rate sheet (₹/W ex-GST).
 * 5% GST applied at calculation time (see taxes.js).
 *
 * Panel category (Topcon / Bifacial) is NOT chosen by the customer — it is
 * derived in the backend from the selected wattage option. The quotation only
 * shows the wattage and the number of panels.
 *
 * Wattage options (priced on the MAX watt of each range, per client rule):
 *   Bifacial 540–555 → priced @ 555 W
 *   Topcon   580–590 → priced @ 590 W
 *   Topcon   600–630 → priced @ 630 W
 *
 * System-type rules:
 *   On-grid & Hybrid → DCR panels; Bifacial (555) + Topcon (590, 630) all offered.
 *   Off-grid         → Non-DCR panels; Topcon 600–630 (630 W) only.
 */

import { GST } from "./taxes.js";

export const PANEL_COMPANY_IDS = {
  Adani: "adani",
  Waaree: "waaree",
  Vikram: "vikram",
};

/** Adani & Waaree share the same ₹/W rates on the sheet */
export const PANEL_PRICE_GROUP = {
  Adani: "adani_waaree",
  Waaree: "adani_waaree",
  Vikram: "vikram",
};

/**
 * ₹/W ex-GST — from Kalpana rate sheet.
 *   DCR     → Topcon: Adani/Waaree 29, Vikram 27 · Bifacial: Adani/Waaree 27, Vikram 25
 *   Non-DCR → Topcon: Adani/Waaree 17, Vikram 16 · (no Bifacial in Non-DCR)
 */
export const PANEL_RATES_EX_GST = {
  dcr: {
    adani_waaree: { topcon: 29, bifacial: 27 },
    vikram: { topcon: 27, bifacial: 25 },
  },
  nonDcr: {
    adani_waaree: { topcon: 17, bifacial: null },
    vikram: { topcon: 16, bifacial: null },
  },
};

export const PANEL_GST_RATE = GST.PANEL_RATE;

/**
 * Wattage options. `watt` is the max of each range and is used for both
 * pricing and panel-count sizing. `category` is the derived (hidden) panel type.
 */
export const PANEL_WATT_OPTIONS = [
  {
    id: 555,
    category: "bifacial",
    minWatt: 540,
    maxWatt: 555,
    watt: 555,
    rangeLabel: "540–555 Wp",
    label: "555 Wp (540–555 range)",
  },
  {
    id: 590,
    category: "topcon",
    minWatt: 580,
    maxWatt: 590,
    watt: 590,
    rangeLabel: "580–590 Wp",
    label: "590 Wp (580–590 range)",
  },
  {
    id: 630,
    category: "topcon",
    minWatt: 600,
    maxWatt: 630,
    watt: 630,
    rangeLabel: "600–630 Wp",
    label: "630 Wp (600–630 range)",
  },
];

/** Off-grid only uses the 600–630 Topcon panel */
export const OFFGRID_WATT_ID = 630;

/** Off-grid → Non-DCR; on-grid & hybrid → DCR */
export function useDcrPanels(systemType) {
  return systemType === "on-grid" || systemType === "hybrid";
}

export function getWattOption(wattId) {
  return PANEL_WATT_OPTIONS.find((o) => o.id === Number(wattId)) ?? null;
}

/** Wattage options available for a given system type */
export function getWattOptionsForSystem(systemType) {
  if (!systemType) return [];
  if (systemType === "off-grid") {
    return PANEL_WATT_OPTIONS.filter((o) => o.id === OFFGRID_WATT_ID);
  }
  return PANEL_WATT_OPTIONS;
}

/**
 * Resolve the panel configuration (rate + watt) for a company, selected wattage
 * option, and system type. Returns null if the combination is not offered.
 */
export function getPanelConfig(company, wattId, systemType) {
  const group = PANEL_PRICE_GROUP[company];
  if (!group || !systemType) return null;

  const opt = getWattOption(wattId);
  if (!opt) return null;

  // Off-grid only offers the 600–630 Topcon panel
  if (systemType === "off-grid" && opt.id !== OFFGRID_WATT_ID) return null;

  const dcr = useDcrPanels(systemType);
  const tier = dcr ? PANEL_RATES_EX_GST.dcr : PANEL_RATES_EX_GST.nonDcr;
  const rate = tier[group]?.[opt.category];
  if (rate == null) return null;

  return {
    company,
    category: opt.category,
    dcr,
    dcrLabel: dcr ? "DCR" : "Non-DCR",
    wattPerPanel: opt.watt,
    wattRangeLabel: opt.rangeLabel,
    pricePerWattExGst: rate,
  };
}

export function getPanelCompanyId(company) {
  return PANEL_COMPANY_IDS[company] ?? null;
}
