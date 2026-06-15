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
import { GST } from "../data/prices/taxes.js";
import { TATA_BRAND, isTataBrand, isTataEligible, getTataKit } from "../data/prices/tata.js";

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
  } = selections;

  if (!plantLoadKw || !installationType || !systemType || !panelCompany) {
    return false;
  }

  // Tata kit: complete On-Grid 3/4 kW package — no further configuration needed.
  if (isTataBrand(panelCompany)) {
    return isTataEligible(systemType, plantLoadKw);
  }

  if (!panelWatt) return false;

  if (needsWiring(systemType) && !floors) return false;

  if (!resolveInverterBrand(systemType, plantLoadKw, inverterBrand)) return false;

  if (systemType === "hybrid" || systemType === "off-grid") {
    // Battery brand auto-follows the inverter; only the yes/no choice is required.
    if (wantsBattery == null) return false;
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

  const { plantLoadKw, systemType, floors, wantsBattery, panelCompany, panelWatt, inverterBrand } =
    selections;

  // Tata kit — flat, all-inclusive price (no margin/GST/components added).
  if (isTataBrand(panelCompany)) {
    return buildTataKitBreakdown(selections);
  }

  const panel = selectBestPanel(panelCompany, panelWatt, plantLoadKw, systemType);
  if (!panel) return null;

  const resolvedInverterBrand = resolveInverterBrand(systemType, plantLoadKw, inverterBrand);

  // Battery brand automatically follows the inverter brand.
  const { inverter, battery, error } = selectInverterAndBattery(
    systemType,
    plantLoadKw,
    resolvedInverterBrand,
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

  return {
    finalPrice,
    subtotal,
    margin,
    marginRate: MARGIN_RATE,
    components,
    taxes,
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

/**
 * Tata kit breakdown — flat all-inclusive price, no margin/GST/component math.
 */
function buildTataKitBreakdown(selections) {
  const { plantLoadKw, systemType } = selections;
  const kit = getTataKit(systemType, plantLoadKw);
  if (!kit) return null;

  const finalPrice = kit.price;

  return {
    finalPrice,
    subtotal: finalPrice,
    margin: 0,
    marginRate: 0,
    isKit: true,
    kitLabel: kit.label,
    components: null,
    taxes: { inverter: null, battery: null },
    matched: {
      isKit: true,
      kitLabel: kit.label,
      system: {
        plantLoadKw,
        systemType,
        floors: null,
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

/** Final customer price (with 25% margin, or flat kit price for Tata) */
export function calculateQuote(selections) {
  return calculateQuoteBreakdown(selections)?.finalPrice ?? null;
}

export { needsBattery };
