/**
 * Full quotation calculation — minimum compatible equipment + margin.
 */

import {
  calculateWiringCost,
  calculatePerWattServiceCost,
  INSTALLATION,
  CIVIL_WORK,
  INSTALLATION_MATERIAL,
  MISCELLANEOUS,
  EQUIPMENT,
  getMarginRate,
  getMarginRateLabel,
  needsWiring,
} from "../data/prices/services.js";
import {
  selectBestPanel,
  selectInverterAndBattery,
  needsBattery,
} from "./matching.js";
import { resolveInverterBrand } from "../data/prices/inverterRules.js";
import { showInverterPhaseOption } from "../data/quotationOptions.js";
import { GST } from "../data/prices/taxes.js";
import { TATA_BRAND, isTataBrand, isTataEligible, getTataKit } from "../data/prices/tata.js";

function resolvePreferSinglePhase(plantLoadKw, systemType, panelCompany, inverterPhase) {
  if (isTataBrand(panelCompany)) return true;
  if (!showInverterPhaseOption(plantLoadKw, systemType, false)) return true;
  return inverterPhase !== "threePhase";
}

export function isValidSelections(selections) {
  const {
    plantLoadKw,
    installationType,
    systemType,
    floors,
    wantsBattery,
    panelCompany,
    panelWatt,
    inverterBrand,
    inverterPhase,
  } = selections;

  if (!plantLoadKw || !installationType || !systemType || !panelCompany) {
    return false;
  }

  if (isTataBrand(panelCompany)) {
    if (!isTataEligible(systemType, plantLoadKw)) return false;
    if (needsWiring(systemType) && !floors) return false;
    return true;
  }

  if (!panelWatt) return false;

  if (needsWiring(systemType) && !floors) return false;

  if (!resolveInverterBrand(systemType, plantLoadKw, inverterBrand)) return false;

  if (showInverterPhaseOption(plantLoadKw, systemType, false) && !inverterPhase) {
    return false;
  }

  if (systemType === "hybrid" || systemType === "off-grid") {
    if (wantsBattery == null) return false;
  }

  return true;
}

function calculateInstallationCost(totalWatts) {
  return calculatePerWattServiceCost(INSTALLATION.pricePerWatt, totalWatts);
}

function calculateInstallationMaterialCost(totalWatts) {
  return calculatePerWattServiceCost(INSTALLATION_MATERIAL.pricePerWatt, totalWatts);
}

function calculateCivilCost(totalWatts) {
  return calculatePerWattServiceCost(CIVIL_WORK.pricePerWatt, totalWatts);
}

function buildServiceComponents(totalWatts, systemType, floors) {
  return {
    wiring: calculateWiringCost(systemType, floors),
    installation: calculateInstallationCost(totalWatts),
    installationMaterial: calculateInstallationMaterialCost(totalWatts),
    civil: calculateCivilCost(totalWatts),
    miscellaneous: MISCELLANEOUS.amount,
    equipment: EQUIPMENT.amount,
  };
}

/**
 * @returns {object|null} Full quote with finalPrice, matched equipment, and components
 */
export function calculateQuoteBreakdown(selections) {
  if (!isValidSelections(selections)) return null;

  const {
    plantLoadKw,
    systemType,
    floors,
    wantsBattery,
    panelCompany,
    panelWatt,
    inverterBrand,
    inverterPhase,
  } = selections;

  if (isTataBrand(panelCompany)) {
    return buildTataKitBreakdown(selections);
  }

  const panel = selectBestPanel(panelCompany, panelWatt, plantLoadKw, systemType);
  if (!panel) return null;

  const panelKwp = Math.round((panel.totalWatts / 1000) * 100) / 100;
  const resolvedInverterBrand = resolveInverterBrand(systemType, plantLoadKw, inverterBrand);
  const preferSinglePhase = resolvePreferSinglePhase(
    plantLoadKw,
    systemType,
    panelCompany,
    inverterPhase
  );

  const { inverter, battery, error } = selectInverterAndBattery(
    systemType,
    plantLoadKw,
    panelKwp,
    resolvedInverterBrand,
    wantsBattery,
    resolvedInverterBrand,
    preferSinglePhase
  );

  if (!inverter || error) return null;
  if (needsBattery(systemType, wantsBattery) && !battery) return null;

  const serviceComponents = buildServiceComponents(panel.totalWatts, systemType, floors);
  const marginRate = getMarginRate(plantLoadKw);

  const components = {
    panels: panel.cost,
    inverter: inverter.cost,
    battery: battery?.cost ?? 0,
    ...serviceComponents,
  };

  const subtotal = Object.values(components).reduce((s, v) => s + (v ?? 0), 0);
  const margin = Math.round(subtotal * marginRate);
  const finalPrice = subtotal + margin;

  const taxes = {
    inverter: {
      rate: GST.INVERTER_RATE,
      rateLabel: "5%",
      amount: inverter.gstAmount ?? 0,
    },
    battery: battery
      ? {
          rate: GST.BATTERY_RATE,
          rateLabel: "18%",
          amount: battery.gstAmount ?? 0,
        }
      : null,
  };

  const phaseLabel =
    preferSinglePhase || !showInverterPhaseOption(plantLoadKw, systemType, false)
      ? "Single phase"
      : "Three phase";

  return {
    finalPrice,
    subtotal,
    margin,
    marginRate,
    marginRateLabel: getMarginRateLabel(plantLoadKw),
    components,
    taxes,
    matched: {
      system: {
        plantLoadKw,
        systemType,
        floors: needsWiring(systemType) ? floors : null,
        inverterPhase: phaseLabel,
        panelTier: panel.dcrLabel,
        panelTierRule:
          systemType === "off-grid"
            ? "Off-grid systems use Non-DCR panels"
            : "On-grid & hybrid systems use DCR panels",
      },
      panel: {
        company: panelCompany,
        category: panel.category,
        dcr: panel.dcr,
        dcrLabel: panel.dcrLabel,
        wattPerPanel: panel.wattPerPanel,
        wattRangeLabel: panel.wattRangeLabel,
        panelCount: panel.panelCount,
        totalWatts: panel.totalWatts,
        totalKwp: Math.round((panel.totalWatts / 1000) * 100) / 100,
        summary: `${panel.panelCount} × ${panel.wattPerPanel}W ${panelCompany} (${panel.dcrLabel})`,
      },
      inverter: {
        brand: inverter.brand,
        model: inverter.modelNo,
        capacityKw: inverter.capacityKw,
        dcBusVoltage: inverter.dcBusVoltage,
        phase: phaseLabel,
        voltageLabel: inverter.dcBusVoltage
          ? `${inverter.dcBusVoltage}V DC bus`
          : "Grid-tied (no battery bus)",
        summary: `${inverter.brand} · ${inverter.capacityKw} kW · ${phaseLabel}`,
      },
      battery: battery
        ? {
            brand: battery.brand,
            model: battery.size,
            id: battery.id,
            voltage: battery.voltage,
            ah: battery.ah,
            voltageLabel: `${battery.voltage}V / ${battery.ah}Ah`,
            summary: `${battery.brand} ${battery.size}`,
            compatibilityNote: inverter.dcBusVoltage
              ? `Voltage matched to ${inverter.dcBusVoltage}V inverter bus`
              : null,
          }
        : null,
      compatibility: {
        panelToLoad: `${panel.panelCount} panels (${panelKwp} kWp) sized for ${plantLoadKw} kW load`,
        inverterToLoad: `${inverter.capacityKw} kW inverter sized for ${plantLoadKw} kW plant load (${panelKwp} kWp panel array)`,
        batteryToInverter:
          battery && inverter.dcBusVoltage
            ? `${battery.voltage}V battery ↔ ${inverter.dcBusVoltage}V inverter — compatible`
            : battery
            ? "Battery selected for backup storage"
            : null,
      },
    },
    plantLoadKw,
    systemType,
  };
}

/** Tata kit — base kit price + standard service lines + conditional profit margin */
function buildTataKitBreakdown(selections) {
  const { plantLoadKw, systemType, floors } = selections;
  const kit = getTataKit(systemType, plantLoadKw);
  if (!kit) return null;

  const kitWatts = plantLoadKw * 1000;
  const serviceComponents = buildServiceComponents(kitWatts, systemType, floors);
  const marginRate = getMarginRate(plantLoadKw);

  const components = {
    kit: kit.price,
    ...serviceComponents,
  };

  const subtotal = Object.values(components).reduce((s, v) => s + (v ?? 0), 0);
  const margin = Math.round(subtotal * marginRate);
  const finalPrice = subtotal + margin;

  return {
    finalPrice,
    subtotal,
    margin,
    marginRate,
    marginRateLabel: getMarginRateLabel(plantLoadKw),
    isKit: true,
    kitLabel: kit.label,
    components,
    taxes: { inverter: null, battery: null },
    matched: {
      isKit: true,
      kitLabel: kit.label,
      system: {
        plantLoadKw,
        systemType,
        floors: needsWiring(systemType) ? floors : null,
        panelTier: null,
        panelTierRule: "Tata complete on-grid kit (factory bundled)",
      },
      panel: {
        company: TATA_BRAND,
        isKit: true,
        totalKwp: plantLoadKw,
        panelCount: null,
        wattPerPanel: null,
        summary: kit.label,
      },
      inverter: null,
      battery: null,
      compatibility: {},
    },
    plantLoadKw,
    systemType,
  };
}

/** Final customer price (equipment + services + conditional profit margin) */
export function calculateQuote(selections) {
  return calculateQuoteBreakdown(selections)?.finalPrice ?? null;
}

export { needsBattery };
