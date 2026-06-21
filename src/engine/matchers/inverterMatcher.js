/**
 * Generic inverter matcher — strict system-category isolation.
 * On-grid, hybrid, and off-grid catalog groups never cross.
 */

import { applyPriceTax } from "../catalog/pricing.js";

/** Catalog group must match system category prefix (on-grid*, hybrid*, off-grid*). */
export function isCatalogGroupInSystemCategory(catalogGroup, systemType, rules) {
  if (!catalogGroup || !systemType) return false;

  const prefixes = rules.inverter.systemCategoryPrefixes ?? {
    "on-grid": "on-grid",
    hybrid: "hybrid",
    "off-grid": "off-grid",
  };

  const prefix = prefixes[systemType];
  if (!prefix) return false;

  return catalogGroup === prefix || catalogGroup.startsWith(`${prefix}-`);
}

function inverterSupportsSystem(inverter, systemType, batteryRequired, config, rules) {
  if (!isCatalogGroupInSystemCategory(inverter.catalogGroup, systemType, rules)) {
    return false;
  }

  if (!inverter.systemTypes.includes(systemType)) {
    return false;
  }

  if (batteryRequired && systemType === "hybrid") {
    return inverter.dcBusVoltage != null;
  }

  if (batteryRequired && systemType === "off-grid") {
    return inverter.dcBusVoltage != null;
  }

  return true;
}

/** Invergy off-grid: OG for plant load ≤6 kW, OGH for plant load >6 kW. */
export function matchesInvergyOffGridFamily(inverter, plantLoadKw, config) {
  if (inverter.brand !== "Invergy") return true;

  const maxOgKw = config.businessRules?.invergyOffGridOgMaxKw ?? 6;
  if (plantLoadKw <= maxOgKw) {
    return inverter.catalogGroup === "off-grid-og";
  }
  return inverter.catalogGroup === "off-grid-ogh";
}

export function isInverterCompatible(inverter, requirements, panel, rules, config) {
  const { systemType, plantLoadKw, phaseType, batteryRequired, filters } = requirements;
  const tolerance = rules.inverter.plantLoadToleranceKw ?? 0.05;
  const maxRatio = inverter.maxDcOversizingRatio ?? rules.inverter.defaultMaxDcOversizingRatio ?? 1.5;

  if (!inverter.approved) return { ok: false, reason: "Inverter not business-approved" };

  if (!filters.inverterBrand) {
    return { ok: false, reason: "Inverter brand is required" };
  }
  if (inverter.brand !== filters.inverterBrand) {
    return { ok: false, reason: "Inverter brand filter mismatch" };
  }
  if (inverter.phase !== phaseType) return { ok: false, reason: "Phase mismatch" };

  if (!isCatalogGroupInSystemCategory(inverter.catalogGroup, systemType, rules)) {
    return {
      ok: false,
      reason: `Catalog group "${inverter.catalogGroup}" not allowed for ${systemType} system category`,
    };
  }

  if (
    systemType === "off-grid" &&
    filters.inverterBrand === "Invergy" &&
    !matchesInvergyOffGridFamily(inverter, plantLoadKw, config)
  ) {
    return {
      ok: false,
      reason: "Invergy off-grid family rule: OG for load ≤6 kW, OGH for load >6 kW",
    };
  }

  if (!inverterSupportsSystem(inverter, systemType, batteryRequired, config, rules)) {
    return { ok: false, reason: "System type / battery configuration not supported" };
  }

  if (inverter.capacityAcKw < plantLoadKw - tolerance) {
    return { ok: false, reason: `AC capacity ${inverter.capacityAcKw} kW below plant load ${plantLoadKw} kW` };
  }
  if (panel.installedCapacityKwp > inverter.capacityAcKw * maxRatio + 0.001) {
    return {
      ok: false,
      reason: `Panel ${panel.installedCapacityKwp} kWp exceeds DC oversizing limit (${maxRatio}× ${inverter.capacityAcKw} kW)`,
    };
  }

  return { ok: true, reason: "All inverter compatibility checks passed" };
}

export function generateInverterCandidates(requirements, panel, catalog) {
  const { inverters, compatibilityRules, pricingConfig } = catalog;
  const selectedBrand = requirements.filters.inverterBrand;
  if (!selectedBrand) return [];

  const results = [];

  for (const inv of inverters) {
    if (inv.brand !== selectedBrand) continue;

    const check = isInverterCompatible(inv, requirements, panel, compatibilityRules, pricingConfig);
    if (!check.ok) continue;

    const tax = applyPriceTax(inv.price);
    results.push({
      ...inv,
      exGst: tax.exGst,
      gstAmount: tax.gstAmount,
      cost: tax.cost,
      compatibilityNote: check.reason,
    });
  }

  return results;
}

export function validateSystemCategorySelection(systemType, catalogGroup, rules) {
  const ok = isCatalogGroupInSystemCategory(catalogGroup, systemType, rules);
  return {
    ok,
    systemRequested: systemType,
    catalogGroup,
    expectedPrefix: rules.inverter.systemCategoryPrefixes?.[systemType] ?? systemType,
    result: ok ? "PASS" : "FAIL",
  };
}
