/**
 * Service costs and margin — all rates from pricing-config.json.
 */

import { applyPriceTax } from "./catalog/pricing.js";

function resolveWiringRateKey(requirements, config) {
  const { systemType, phaseType } = requirements;
  const rules = config.businessRules ?? {};

  if (rules.threePhaseUsesHybridWiring && phaseType === "3P") {
    return "hybrid";
  }

  return systemType;
}

export function calculateServices(requirements, totalWatts, config) {
  const sc = config.serviceCosts;
  const { floors } = requirements;
  const wiringKey = resolveWiringRateKey(requirements, config);

  const wiringRate = sc.wiring[wiringKey]?.pricePerFloor ?? sc.wiring[requirements.systemType]?.pricePerFloor;
  const wiring =
    wiringRate != null &&
      floors != null &&
      config.businessRules.systemsRequiringWiring?.includes(requirements.systemType)
      ? wiringRate * floors
      : 0;

  const w = totalWatts ?? 0;

  return {
    wiring,
    installation: w * sc.installation.pricePerWatt,
    installationMaterial: w * sc.installationMaterial.pricePerWatt,
    civil: w * sc.civil.pricePerWatt,
    miscellaneous: sc.miscellaneous.amount,
    equipment: sc.equipment.amount,
  };
}

export function sumServices(services) {
  return Object.values(services).reduce((s, v) => s + (v ?? 0), 0);
}

export function calculateMargin(plantLoadKw, config) {
  const m = config.margins;
  if (m.mode === "flatByKw") {
    const kw = Math.round(plantLoadKw);
    const table = m.flatByKw;
    if (table[String(kw)] != null) return Number(table[String(kw)]);
    if (table[kw] != null) return Number(table[kw]);

    const above = m.marginAboveTable;
    if (above && kw >= (m.minPlantLoadKw ?? 2)) {
      return kw * above.kwMultiplier + above.constant;
    }

    return null;
  }

  if (m.mode === "percentage") {
    return null;
  }

  return null;
}

export function calculateCombinationCost({
  requirements,
  panel,
  inverter,
  battery,
  kit,
  catalog,
  batteryStatus = null,
  batteryWarning = null,
}) {
  const config = catalog.pricingConfig;
  const totalWatts = kit ? requirements.plantLoadKw * 1000 : panel.totalWatts;

  let equipmentSubtotal = 0;
  let components = {};

  if (kit) {
    const tax = applyPriceTax(kit.price);
    equipmentSubtotal = tax.cost;
    components = { kit: tax.cost };

    const fullyInclusive = config.businessRules.tataKitFullyInclusive !== false;

    if (fullyInclusive) {
      const emptyServices = {
        wiring: 0,
        installation: 0,
        installationMaterial: 0,
        civil: 0,
        miscellaneous: 0,
        equipment: 0,
      };

      return {
        requirements,
        panel: null,
        inverter: null,
        battery: null,
        kit,
        equipmentSubtotal,
        servicesSubtotal: 0,
        serviceComponents: emptyServices,
        margin: 0,
        subtotal: equipmentSubtotal,
        finalPrice: equipmentSubtotal,
        components: { kit: tax.cost },
        isFullyInclusiveKit: true,
      };
    }
  } else {
    equipmentSubtotal = panel.cost + inverter.cost + (battery?.cost ?? 0);
    components = {
      panels: panel.cost,
      inverter: inverter.cost,
      battery: battery?.cost ?? 0,
    };
  }

  const serviceComponents = calculateServices(requirements, totalWatts, config);

  const servicesSubtotalRaw = sumServices(serviceComponents);
  const servicesSubtotal = Number.isFinite(servicesSubtotalRaw)
    ? Math.round(servicesSubtotalRaw)
    : 0;

  const rawMargin = calculateMargin(requirements.plantLoadKw, config);
  const margin = Number.isFinite(rawMargin) ? Number(rawMargin) : 0;

  const equipment = Number.isFinite(equipmentSubtotal)
  ? equipmentSubtotal
  : 0;
  const subtotal = equipment + servicesSubtotal;

  const finalPrice = Number(subtotal) + margin;

  console.groupEnd();

  return {
    requirements,
    panel,
    inverter,
    battery,
    kit,
    batteryStatus,
    batteryWarning,
    equipmentSubtotal,
    servicesSubtotal,
    serviceComponents,
    margin,
    subtotal,
    finalPrice,
    components: { ...components, ...serviceComponents, margin },
  };
}
