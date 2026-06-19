/**
 * Generic panel candidate generator — all rules from catalog JSON.
 */

import { applyPriceTax } from "../catalog/pricing.js";

function getDcrTier(systemType, systemRules) {
  if (systemRules.dcr.systemTypes.includes(systemType)) return "dcr";
  if (systemRules.nonDcr.systemTypes.includes(systemType)) return "nonDcr";
  return null;
}

function isWattAllowed(company, wattId, tier, catalog) {
  const restrictions = company.wattRestrictions;
  if (!restrictions) return true;
  const allowed = restrictions[tier] ?? [];
  return allowed.includes(wattId);
}

function getRatePerWatt(company, wattOption, tier, priceGroups) {
  const group = priceGroups[company.priceGroup];
  if (!group) return null;
  const rate = group[tier]?.[wattOption.category];
  return rate ?? null;
}

export function generatePanelCandidates(requirements, catalog) {
  const { plantLoadKw, systemType, filters } = requirements;
  const { panels, compatibilityRules } = catalog;
  const tier = getDcrTier(systemType, panels.systemRules);
  if (!tier) return [];

  const targetWatts = plantLoadKw * 1000;
  const candidates = [];

  for (const company of panels.companies) {
    if (filters.panelCompany && company.label !== filters.panelCompany) continue;

    for (const wattOption of panels.wattOptions) {
      if (filters.panelWattId != null && wattOption.id !== filters.panelWattId) continue;

      if (tier === "nonDcr") {
        const allowed = panels.systemRules.nonDcr.allowedWattOptionIds;
        if (allowed && !allowed.includes(wattOption.id)) continue;
      }

      if (!isWattAllowed(company, wattOption.id, tier, company)) continue;

      const rate = getRatePerWatt(company, wattOption, tier, panels.priceGroups);
      if (rate == null) continue;

      const panelCount = Math.ceil(targetWatts / wattOption.watt);
      const totalWatts = panelCount * wattOption.watt;
      const installedCapacityKwp = Math.round((totalWatts / 1000) * 100) / 100;
      const exGst = Math.round(totalWatts * rate);
      const tax = applyPriceTax({
        amount: exGst,
        gstIncluded: false,
        gstRate: panels.gstRate,
      });

      candidates.push({
        id: `${company.id}-${wattOption.id}`,
        company: company.label,
        companyId: company.id,
        category: wattOption.category,
        dcr: tier === "dcr",
        dcrLabel: tier === "dcr" ? "DCR" : "Non-DCR",
        wattPerPanel: wattOption.watt,
        wattRangeLabel: wattOption.rangeLabel,
        wattOptionId: wattOption.id,
        panelCount,
        totalWatts,
        installedCapacityKwp,
        pricePerWattExGst: rate,
        exGst: tax.exGst,
        gstAmount: tax.gstAmount,
        cost: tax.cost,
        gstRate: tax.gstRate,
      });
    }
  }

  return candidates;
}

export function panelSizingCheck(panel, rules) {
  return panel.panelCount >= 1 && panel.installedCapacityKwp > 0;
}
