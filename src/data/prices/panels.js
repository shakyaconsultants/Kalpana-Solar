/**
 * Solar panel specs & rates — Adani / Waaree / Vikram / Premier.
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
 *   On-grid & Hybrid → DCR panels.
 *   Off-grid         → Non-DCR panels; Topcon 600–630 (630 W) only.
 *
 * Company availability (form + pricing):
 *   Adani / Waaree  → DCR: 555, 590, 630 · Off-grid: 630
 *   Vikram / Premier → DCR: 555 (Bifacial) only · Off-grid: 630 (Topcon)
 *   Tata kit        → On-grid 3 kW / 4 kW only (see tata.js)
 */

import { GST } from "./taxes.js";
import { TATA_BRAND, isTataEligible } from "./tata.js";

export const PANEL_COMPANY_IDS = {
  Adani: "adani",
  Waaree: "waaree",
  Vikram: "vikram",
  Premier: "premier",
};

/** Adani & Waaree share the same ₹/W rates on the sheet; Vikram & Premier share Vikram rates */
export const PANEL_PRICE_GROUP = {
  Adani: "adani_waaree",
  Waaree: "adani_waaree",
  Vikram: "vikram",
  Premier: "vikram",
};

/**
 * ₹/W ex-GST — from Kalpana rate sheet.
 *   DCR     → Topcon: Adani/Waaree 29, Vikram/Premier 27 · Bifacial: Adani/Waaree 27, Vikram/Premier 25
 *   Non-DCR → Topcon: Adani/Waaree 17, Vikram/Premier 16 · (no Bifacial in Non-DCR)
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

/** Standard panel brands (excluding Tata kit) */
export const STANDARD_PANEL_COMPANIES = ["Adani", "Waaree", "Vikram", "Premier"];

/**
 * Which watt option IDs each company actually supplies.
 * Adani/Waaree → all options for the system tier; Vikram/Premier → Bifacial 555 on DCR only.
 */
export const COMPANY_WATT_IDS = {
  Adani: null,
  Waaree: null,
  Vikram: { dcr: [555], nonDcr: [630] },
  Premier: { dcr: [555], nonDcr: [630] },
};

/** Off-grid → Non-DCR; on-grid & hybrid → DCR */
export function useDcrPanels(systemType) {
  return systemType === "on-grid" || systemType === "hybrid";
}

export function getWattOption(wattId) {
  return PANEL_WATT_OPTIONS.find((o) => o.id === Number(wattId)) ?? null;
}

/** Wattage options available for a given system type (before company filter) */
export function getWattOptionsForSystem(systemType) {
  if (!systemType) return [];
  if (systemType === "off-grid") {
    return PANEL_WATT_OPTIONS.filter((o) => o.id === OFFGRID_WATT_ID);
  }
  return PANEL_WATT_OPTIONS;
}

/** Panel companies shown in the form for the current system type + plant load */
export function getPanelCompaniesForSelection(systemType, plantLoadKw) {
  const companies = [...STANDARD_PANEL_COMPANIES];
  if (isTataEligible(systemType, plantLoadKw)) {
    companies.push(TATA_BRAND);
  }
  return companies;
}

/** Wattage options available for a company + system type combination */
export function getWattOptionsForCompany(company, systemType) {
  const systemOpts = getWattOptionsForSystem(systemType);
  if (!company || !systemType) return [];

  const restriction = COMPANY_WATT_IDS[company];
  if (!restriction) return systemOpts;

  const tier = useDcrPanels(systemType) ? "dcr" : "nonDcr";
  const allowedIds = restriction[tier] ?? [];
  return systemOpts.filter((o) => allowedIds.includes(o.id));
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

  const companyOpts = getWattOptionsForCompany(company, systemType);
  if (!companyOpts.some((o) => o.id === opt.id)) return null;

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
