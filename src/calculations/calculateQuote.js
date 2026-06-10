/**
 * Full quotation calculation — minimum compatible equipment + margin.
 */

import {
  calculatePlantLoadCost,
  calculateWiringCost,
  WIRING,
  INSTALLATION,
  CIVIL_WORK,
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

  if (systemType !== "off-grid" && !inverterBrand) return false;

  if (systemType === "hybrid") {
    if (wantsBattery == null) return false;
    if (wantsBattery && !batteryBrand) return false;
  } else if (systemType === "on-grid" || systemType === "off-grid") {
    if (!batteryBrand) return false;
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

  const { plantLoadKw, systemType, floors, wantsBattery, panelCompany, panelCategory, batteryBrand } =
    selections;

  const panel = selectBestPanel(panelCompany, panelCategory, plantLoadKw, systemType);
  if (!panel) return null;

  const { inverter, battery, error } = selectInverterAndBattery(
    systemType,
    plantLoadKw,
    batteryBrand,
    wantsBattery
  );

  if (!inverter || error) return null;
  if (needsBattery(systemType, wantsBattery) && !battery) return null;

  const plantLoad = calculatePlantLoadCost(plantLoadKw);
  const wiring = calculateWiringCost(systemType, floors);
  const wiringRate = WIRING[systemType]?.pricePerFloor;
  const installation = calculateInstallationCost(panel.totalWatts);
  const civil = calculateCivilCost(plantLoadKw);

  const components = {
    plantLoad,
    panels: panel.cost,
    inverter: inverter.cost,
    battery: battery?.cost ?? 0,
    wiring,
    installation,
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
        wiring:
          needsWiring(systemType) && wiringRate
            ? {
                floors,
                ratePerFloor: wiringRate,
                total: wiring,
                summary: `${floors} floor${floors > 1 ? "s" : ""} × ₹${wiringRate.toLocaleString("en-IN")} = ₹${wiring.toLocaleString("en-IN")}`,
              }
            : null,
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
        wiring:
          needsWiring(systemType) && wiringRate
            ? `On-grid ₹3,000/floor · Hybrid ₹5,000/floor — ${floors} floor(s) applied`
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
