/**
 * Full quotation calculation — minimum compatible equipment + margin.
 */

import {
  calculateWiringCost,
  INSTALLATION,
  CIVIL_WORK,
  INSTALLATION_MATERIAL,
  MISCELLANEOUS,
  EQUIPMENT,
  MARGIN_RATE,
  needsWiring,
} from "../data/prices/services.js";
import {
  selectBestPanel,
  selectInverterAndBattery,
  needsBattery,
} from "./matching.js";
import { resolveInverterBrand } from "../data/prices/inverterRules.js";

export function isValidSelections(selections) {
  const {
    plantLoadKw,
    installationType,
    systemType,
    floors,
    wantsBattery,
    panelCompany,
    panelCategory,
    inverterBrand,
    batteryBrand,
  } = selections;

  if (!plantLoadKw || !installationType || !systemType || !panelCompany || !panelCategory) {
    return false;
  }

  if (needsWiring(systemType) && !floors) return false;

  if (!resolveInverterBrand(systemType, plantLoadKw, inverterBrand)) return false;

  if (systemType === "hybrid" || systemType === "off-grid") {
    if (wantsBattery == null) return false;
    if (wantsBattery && !batteryBrand) return false;
  }

  return true;
}

function calculateInstallationCost(totalWatts) {
  return Math.round(totalWatts * INSTALLATION.pricePerWatt);
}

function calculateCivilCost(plantKw) {
  return Math.round(plantKw * CIVIL_WORK.pricePerKw);
}

/**
 * @returns {object|null} Full quote with finalPrice, matched equipment, and components
 */
export function calculateQuoteBreakdown(selections) {
  if (!isValidSelections(selections)) return null;

  const { plantLoadKw, systemType, floors, wantsBattery, panelCompany, panelCategory, batteryBrand, inverterBrand } =
    selections;

  const panel = selectBestPanel(panelCompany, panelCategory, plantLoadKw, systemType);
  if (!panel) return null;

  const resolvedInverterBrand = resolveInverterBrand(systemType, plantLoadKw, inverterBrand);

  const { inverter, battery, error } = selectInverterAndBattery(
    systemType,
    plantLoadKw,
    batteryBrand,
    wantsBattery,
    resolvedInverterBrand
  );

  if (!inverter || error) return null;
  if (needsBattery(systemType, wantsBattery) && !battery) return null;

  const wiring = calculateWiringCost(systemType, floors);
  const installation = calculateInstallationCost(panel.totalWatts);
  const civil = calculateCivilCost(plantLoadKw);

  const components = {
    panels: panel.cost,
    inverter: inverter.cost,
    battery: battery?.cost ?? 0,
    wiring,
    installation,
    installationMaterial: INSTALLATION_MATERIAL.amount,
    civil,
    miscellaneous: MISCELLANEOUS.amount,
    equipment: EQUIPMENT.amount,
  };

  const subtotal = Object.values(components).reduce((s, v) => s + (v ?? 0), 0);
  const margin = Math.round(subtotal * MARGIN_RATE);
  const finalPrice = subtotal + margin;

  return {
    finalPrice,
    subtotal,
    margin,
    marginRate: MARGIN_RATE,
    components,
    matched: {
      system: {
        plantLoadKw,
        systemType,
        floors: needsWiring(systemType) ? floors : null,
        panelTier: panel.dcrLabel,
        panelTierRule:
          systemType === "off-grid"
            ? "Off-grid systems use Non-DCR panels"
            : "On-grid & hybrid systems use DCR panels",
      },
      panel: {
        company: panelCompany,
        category: panelCategory,
        categoryLabel:
          panelCategory === "topcon" ? "Topcon" : panelCategory === "bifacial" ? "Bifacial" : panelCategory,
        dcr: panel.dcr,
        dcrLabel: panel.dcrLabel,
        wattPerPanel: panel.wattPerPanel,
        panelCount: panel.panelCount,
        totalWatts: panel.totalWatts,
        totalKwp: Math.round((panel.totalWatts / 1000) * 100) / 100,
        summary: `${panel.panelCount} × ${panel.wattPerPanel}W ${panelCompany} ${panelCategory === "topcon" ? "Topcon" : "Bifacial"} (${panel.dcrLabel})`,
      },
      inverter: {
        brand: inverter.brand,
        model: inverter.modelNo,
        capacityKw: inverter.capacityKw,
        dcBusVoltage: inverter.dcBusVoltage,
        voltageLabel: inverter.dcBusVoltage
          ? `${inverter.dcBusVoltage}V DC bus`
          : "Grid-tied (no battery bus)",
        summary: `${inverter.brand} · ${inverter.capacityKw} kW`,
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
        panelToLoad: `${panel.panelCount} panels (${panel.totalKwp} kWp) sized for ${plantLoadKw} kW load`,
        inverterToLoad: `${inverter.capacityKw} kW inverter covers ${plantLoadKw} kW required`,
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

/** Final customer price (with 25% margin) */
export function calculateQuote(selections) {
  return calculateQuoteBreakdown(selections)?.finalPrice ?? null;
}

export { needsBattery };
