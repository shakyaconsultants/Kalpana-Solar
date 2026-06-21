/**
 * UI catalog helpers — reads canonical engine JSON only.
 */

import panelsCatalog from "../engine/data/panels.json" with { type: "json" };
import kitsCatalog from "../engine/data/kits.json" with { type: "json" };

const panels = panelsCatalog;

export const ALLOWED_INVERTER_BRANDS = ["Invergy", "Microtek"];

export const TATA_BRAND = kitsCatalog.brand;
export const PANEL_GST_RATE = panels.gstRate ?? 0.05;

export const PANEL_WATT_OPTIONS = panels.wattOptions;
export const OFFGRID_WATT_ID = panels.systemRules.nonDcr.allowedWattOptionIds?.[0] ?? 630;

export const STANDARD_PANEL_COMPANIES = panels.companies.map((c) => c.label);

export const COMPANY_WATT_IDS = Object.fromEntries(
  panels.companies.map((c) => [c.label, c.wattRestrictions])
);

export const PANEL_PRICE_GROUP = Object.fromEntries(
  panels.companies.map((c) => [c.label, c.priceGroup])
);

export function useDcrPanels(systemType) {
  return panels.systemRules.dcr.systemTypes.includes(systemType);
}

export function getWattOption(wattId) {
  return PANEL_WATT_OPTIONS.find((o) => o.id === Number(wattId)) ?? null;
}

export function getWattOptionsForSystem(systemType) {
  if (!systemType) return [];
  if (systemType === "off-grid") {
    return PANEL_WATT_OPTIONS.filter((o) => o.id === OFFGRID_WATT_ID);
  }
  return PANEL_WATT_OPTIONS;
}

export function isTataBrand(panelCompany) {
  return panelCompany === TATA_BRAND;
}

export function isTataEligible(systemType, plantKw) {
  if (systemType !== "on-grid") return false;
  return kitsCatalog.kits.some(
    (k) => k.approved && k.systemTypes.includes(systemType) && k.plantLoadKw.includes(plantKw)
  );
}

export function getPanelCompaniesForSelection(systemType, plantLoadKw) {
  const companies = [...STANDARD_PANEL_COMPANIES];
  if (isTataEligible(systemType, plantLoadKw)) {
    companies.push(TATA_BRAND);
  }
  return companies;
}

export function getWattOptionsForCompany(company, systemType) {
  const systemOpts = getWattOptionsForSystem(systemType);
  if (!company || !systemType) return [];

  const restriction = COMPANY_WATT_IDS[company];
  if (!restriction) return systemOpts;

  const tier = useDcrPanels(systemType) ? "dcr" : "nonDcr";
  const allowedIds = restriction[tier] ?? [];
  return systemOpts.filter((o) => allowedIds.includes(o.id));
}

/** Brands the user may select — no default or recommendation applied. */
export function getAllowedInverterBrands(_systemType) {
  return ALLOWED_INVERTER_BRANDS;
}
