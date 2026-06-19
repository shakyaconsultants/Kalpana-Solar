/**
 * Generic battery matcher — voltage compatibility from catalog metadata.
 */

import { applyPriceTax } from "../catalog/pricing.js";

export function isVoltageCompatible(inverterVoltage, compatibleDcVoltages, tolerance) {
  if (inverterVoltage == null) return false;
  return compatibleDcVoltages.some((v) => Math.abs(v - inverterVoltage) <= tolerance);
}

export function isBatteryCompatible(battery, inverter, requirements, rules, config) {
  const { systemType, batteryRequired } = requirements;

  if (!batteryRequired) return { ok: true, reason: "Battery not required" };
  if (!battery.approved) return { ok: false, reason: "Battery not business-approved" };

  const tolerance = rules.battery.voltageMatchToleranceV ?? 1.5;

  if (inverter.dcBusVoltage == null) {
    return { ok: false, reason: "Inverter has no DC bus for battery pairing" };
  }

  if (!battery.systemTypes.includes(systemType)) {
    return { ok: false, reason: "Battery not approved for system type" };
  }

  if (config.businessRules.batteryBrandFollowsInverter && battery.brand !== inverter.brand) {
    return { ok: false, reason: "Battery brand must follow inverter brand" };
  }

  if (!isVoltageCompatible(inverter.dcBusVoltage, battery.compatibleDcVoltages, tolerance)) {
    return {
      ok: false,
      reason: `Voltage mismatch: inverter ${inverter.dcBusVoltage} V, battery supports [${battery.compatibleDcVoltages.join(", ")}] V`,
    };
  }

  return { ok: true, reason: "Battery voltage compatible with inverter DC bus" };
}

export function generateBatteryCandidates(inverter, requirements, catalog) {
  const { batteries, compatibilityRules, pricingConfig } = catalog;
  const { batteryRequired } = requirements;

  if (!batteryRequired) return [null];

  const results = [];

  for (const bat of batteries) {
    const check = isBatteryCompatible(bat, inverter, requirements, compatibilityRules, pricingConfig);
    if (!check.ok) continue;

    const tax = applyPriceTax(bat.price);
    results.push({
      ...bat,
      exGst: tax.exGst,
      gstAmount: tax.gstAmount,
      cost: tax.cost,
      compatibilityNote: check.reason,
    });
  }

  return results;
}

/** Among compatible batteries, prefer smallest capacity then lowest cost. */
export function rankBatteries(batteries) {
  return [...batteries].sort(
    (a, b) => a.capacityKwh - b.capacityKwh || a.cost - b.cost
  );
}
