/**
 * Solar panel specs & rates — Adani / Waaree / Vikram.
 * DCR & Non-DCR rates from Kalpana rate sheet (₹/W ex-GST).
 * 5% GST applied at calculation time (see taxes.js).
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

export const PANEL_WATTAGES = {
  topcon: [590, 620],
  bifacial: [550],
};

export const PANEL_RATES_EX_GST = {
  dcr: {
    adani_waaree: { topcon: 29, bifacial: 27 },
    vikram: { topcon: 25, bifacial: 23 },
  },
  nonDcr: {
    adani_waaree: { topcon: 17.5, bifacial: null },
    vikram: { topcon: 15.5, bifacial: null },
  },
};

export const PANEL_GST_RATE = GST.PANEL_RATE;

/** Off-grid → Non-DCR; on-grid & hybrid → DCR */
export function useDcrPanels(systemType) {
  return systemType === "on-grid" || systemType === "hybrid";
}

/**
 * Panel configs for a company + category.
 * DCR tier is fixed by system type; wattage variants still compared for lowest cost.
 */
export function getPanelConfigOptions(company, category, systemType) {
  const group = PANEL_PRICE_GROUP[company];
  if (!group || !systemType) return [];

  const dcr = useDcrPanels(systemType);
  const tier = dcr ? PANEL_RATES_EX_GST.dcr : PANEL_RATES_EX_GST.nonDcr;
  const rate = tier[group]?.[category];
  if (rate == null) return [];

  const wattages = PANEL_WATTAGES[category] ?? [];

  return wattages.map((watt) => ({
    company,
    category,
    dcr,
    dcrLabel: dcr ? "DCR" : "Non-DCR",
    wattPerPanel: watt,
    pricePerWattExGst: rate,
  }));
}

export function getPanelCompanyId(company) {
  return PANEL_COMPANY_IDS[company] ?? null;
}
