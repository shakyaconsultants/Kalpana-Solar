/**
 * Equipment matching — minimum-cost compatible panel / inverter / battery selection.
 */

import { getPanelConfig, PANEL_GST_RATE } from "../data/prices/panels.js";
import { BATTERY_PRICES, BATTERY_BRAND_IDS, BATTERY_TYPES } from "../data/prices/batteries.js";
import {
  INVERGY_ONGRID,
  INVERGY_OFFGRID_OGH,
  INVERGY_OFFGRID_OG,
} from "../data/prices/invergy.js";
import { MICROTEK_OFFGRID_PWM, MICROTEK_OFFGRID_MAX_KW, MICROTEK_ONGRID_GTI, MICROTEK_HYBRID } from "../data/prices/microtek.js";
import {
  GST,
  withInverterGst,
  withBatteryGst,
  splitInclusiveGst,
} from "../data/prices/taxes.js";

/** Map battery nominal V → inverter DC bus bucket (12 / 24 / 48) */
export function getVoltageBucket(voltage) {
  if (voltage <= 13) return 12;
  if (voltage <= 26) return 24;
  return 48;
}

export function parseInverterDcVoltage(modelNo = "") {
  const s = String(modelNo);
  // Match the highest stated voltage first so ranges like "48-51.2V" resolve to 48.
  if (/51\.2|48\s*-?\s*51|48\s*V|\b48\b/i.test(s)) return 48;
  if (/25\.6|\b24\s*V?\b/i.test(s)) return 24;
  if (/12\.8|\b12\s*V?\b/i.test(s)) return 12;
  const m = s.match(/(\d+(?:\.\d+)?)\s*V/i);
  if (m) return getVoltageBucket(Number(m[1]));
  return null;
}

function withPanelGst(exGst) {
  return Math.round(exGst * (1 + PANEL_GST_RATE));
}

function attachInverterTax(fields, exGst, gstIncluded = false) {
  const tax = gstIncluded ? splitInclusiveGst(exGst, GST.INVERTER_RATE) : withInverterGst(exGst);
  return { ...fields, ...tax };
}

function attachBatteryTax(fields, exGst) {
  return { ...fields, ...withBatteryGst(exGst) };
}

/**
 * Panel layout for plant kW using the customer-selected wattage option.
 * Category (Topcon/Bifacial) and ₹/W rate are derived from the wattage; panel
 * count is sized on the max watt of the range.
 */
export function selectBestPanel(company, wattId, plantKw, systemType) {
  const cfg = getPanelConfig(company, wattId, systemType);
  if (!cfg) return null;

  const targetW = plantKw * 1000;
  const panelCount = Math.ceil(targetW / cfg.wattPerPanel);
  const totalWatts = panelCount * cfg.wattPerPanel;
  const exGst = totalWatts * cfg.pricePerWattExGst;
  const cost = withPanelGst(exGst);

  return {
    ...cfg,
    panelCount,
    totalWatts,
    exGst: Math.round(exGst),
    cost,
  };
}

function pickMicrotekOnGrid(plantKw, preferSinglePhase = true) {
  const phaseOrder = preferSinglePhase
    ? ["singlePhase", "threePhase"]
    : ["threePhase", "singlePhase"];

  for (const phase of phaseOrder) {
    const list = MICROTEK_ONGRID_GTI[phase] ?? [];
    const candidates = list
      .filter((i) => i.capacityKw >= plantKw)
      .sort((a, b) => a.priceExGst - b.priceExGst);

    if (candidates.length) {
      const inv = candidates[0];
      return attachInverterTax(
        {
          brand: "Microtek",
          modelNo: `Microtek GTI ${inv.capacityKw}kW`,
          capacityKw: inv.capacityKw,
          dcBusVoltage: null,
        },
        inv.priceExGst
      );
    }
  }

  return null;
}

function pickMicrotekHybrid(plantKw, preferSinglePhase = true) {
  const phaseOrder = preferSinglePhase
    ? ["singlePhase", "threePhase"]
    : ["threePhase", "singlePhase"];

  for (const phase of phaseOrder) {
    const list = MICROTEK_HYBRID[phase === "singlePhase" ? "singlePhase" : "threePhase"] ?? [];
    const candidates = list
      .filter((i) => i.capacityKw >= plantKw)
      .sort((a, b) => a.priceExGst - b.priceExGst);

    if (candidates.length) {
      const inv = candidates[0];
      return attachInverterTax(
        {
          brand: "Microtek",
          modelNo: `Microtek Hybrid ${inv.capacityKw}kW`,
          capacityKw: inv.capacityKw,
          dcBusVoltage: parseInverterDcVoltage(inv.voltage),
        },
        inv.priceExGst
      );
    }
  }

  return null;
}

function pickSmallestInvergyOnGrid(plantKw, preferSinglePhase = true) {
  const phaseOrder = preferSinglePhase ? ["1P", "3P"] : ["3P", "1P"];

  for (const phase of phaseOrder) {
    const candidates = INVERGY_ONGRID.filter(
      (i) => i.capacityKw >= plantKw && i.phase === phase
    ).sort((a, b) => a.msp - b.msp);

    if (candidates.length) {
      const inv = candidates[0];
      return attachInverterTax(
        {
          brand: "Invergy",
          modelNo: inv.modelNo,
          capacityKw: inv.capacityKw,
          dcBusVoltage: null,
        },
        inv.msp,
        true
      );
    }
  }
  return null;
}

function pickInvergyHybrid(plantKw) {
  // Off-Grid Hybrid (OGH) series from the official Invergy MSP list (GST-inclusive).
  const candidates = INVERGY_OFFGRID_OGH.filter((i) => i.capacityKw >= plantKw).sort(
    (a, b) => a.msp - b.msp
  );

  if (!candidates.length) return null;

  const inv = candidates[0];
  return attachInverterTax(
    {
      brand: "Invergy",
      modelNo: inv.modelNo,
      capacityKw: inv.capacityKw,
      dcBusVoltage: parseInverterDcVoltage(inv.modelNo),
    },
    inv.msp,
    true
  );
}

function pickMicrotekOffGrid(plantKw) {
  const candidates = MICROTEK_OFFGRID_PWM.filter((i) => i.capacityKva >= plantKw).sort(
    (a, b) => withInverterGst(a.priceExGst).cost - withInverterGst(b.priceExGst).cost
  );

  if (!candidates.length) {
    const fallback = MICROTEK_OFFGRID_PWM[MICROTEK_OFFGRID_PWM.length - 1];
    return attachInverterTax(
      {
        brand: "Microtek",
        modelNo: fallback.model,
        capacityKw: fallback.capacityKva,
        dcBusVoltage: parseInverterDcVoltage(fallback.voltage),
      },
      fallback.priceExGst
    );
  }

  const inv = candidates[0];
  return attachInverterTax(
    {
      brand: "Microtek",
      modelNo: inv.model,
      capacityKw: inv.capacityKva,
      dcBusVoltage: parseInverterDcVoltage(inv.voltage),
    },
    inv.priceExGst
  );
}

function pickInvergyOffGrid(plantKw) {
  const candidates = INVERGY_OFFGRID_OG.filter((i) => i.capacityKw >= plantKw).sort(
    (a, b) => a.msp - b.msp
  );

  if (!candidates.length) return null;

  const inv = candidates[0];
  return attachInverterTax(
    {
      brand: "Invergy",
      modelNo: inv.modelNo,
      capacityKw: inv.capacityKw,
      dcBusVoltage: parseInverterDcVoltage(inv.modelNo),
    },
    inv.msp,
    true
  );
}

export function selectBestInverter(systemType, plantKw, { withBattery = false, inverterBrand = "Invergy" } = {}) {
  const brand = inverterBrand === "Microtek" ? "Microtek" : "Invergy";

  if (
    (systemType === "on-grid" || (systemType === "hybrid" && !withBattery)) &&
    !withBattery
  ) {
    return brand === "Microtek"
      ? pickMicrotekOnGrid(plantKw)
      : pickSmallestInvergyOnGrid(plantKw);
  }

  if (systemType === "hybrid" && withBattery) {
    return brand === "Microtek" ? pickMicrotekHybrid(plantKw) : pickInvergyHybrid(plantKw);
  }

  if (systemType === "off-grid") {
    if (brand === "Microtek" && plantKw <= MICROTEK_OFFGRID_MAX_KW) {
      return pickMicrotekOffGrid(plantKw);
    }
    return pickInvergyOffGrid(plantKw);
  }

  return null;
}

/** Cheapest lithium battery from brand that matches inverter DC bus voltage */
export function selectBestBattery(brand, dcBusVoltage, minEnergyKwh = 0) {
  if (!dcBusVoltage) return null;

  const brandId = BATTERY_BRAND_IDS[brand];
  if (!brandId) return null;

  const catalog = BATTERY_PRICES[brandId];
  if (!catalog || catalog.chemistry !== BATTERY_TYPES.LITHIUM) return null;

  const models = catalog.models ?? [];
  const bucket = dcBusVoltage;

  const compatible = models.filter((m) => getVoltageBucket(m.voltage) === bucket);

  if (!compatible.length) return null;

  const sorted = compatible
    .map((m) => {
      const tax = withBatteryGst(m.price);
      return {
        ...m,
        brand,
        energyKwh: parseFloat(m.size) || (m.ah * m.voltage) / 1000,
        ...tax,
      };
    })
    .filter((m) => m.energyKwh >= minEnergyKwh || minEnergyKwh === 0)
    .sort((a, b) => a.cost - b.cost);

  if (!sorted.length) {
    return compatible
      .map((m) => {
        const tax = withBatteryGst(m.price);
        return {
          ...m,
          brand,
          energyKwh: parseFloat(String(m.size).replace(/KW/i, "")) || 1,
          ...tax,
        };
      })
      .sort((a, b) => a.cost - b.cost)[0];
  }

  return sorted[0];
}

/** Off-grid: pick cheapest compatible battery across both brands */
export function selectCheapestCompatibleBattery(dcBusVoltage, plantKw) {
  const minKwh = Math.max(0.96, plantKw * 0.4);
  let best = null;

  for (const brand of ["Microtek", "Invergy"]) {
    const bat = selectBestBattery(brand, dcBusVoltage, minKwh * 0.5);
    if (bat && (!best || bat.cost < best.cost)) best = bat;
  }

  return best;
}

export function needsBattery(systemType, wantsBattery) {
  if (systemType === "on-grid") return false;
  if (systemType === "hybrid" || systemType === "off-grid") return wantsBattery === true;
  return false;
}

/** Whether the form must collect a battery brand */
export function requiresBatteryBrand(systemType, wantsBattery) {
  return needsBattery(systemType, wantsBattery);
}

export function selectInverterAndBattery(systemType, plantKw, batteryBrand, wantsBattery, inverterBrand) {
  const withBattery = needsBattery(systemType, wantsBattery);
  const inverter = selectBestInverter(systemType, plantKw, { withBattery, inverterBrand });
  if (!inverter) return { inverter: null, battery: null };

  if (!withBattery) {
    return { inverter, battery: null };
  }

  // Battery brand automatically follows the inverter brand.
  const brand = batteryBrand || inverterBrand;
  const minKwh = systemType === "off-grid" ? plantKw * 0.3 : plantKw * 0.25;
  const battery = brand ? selectBestBattery(brand, inverter.dcBusVoltage, minKwh) : null;

  if (!battery) {
    return { inverter, battery: null, error: "No compatible battery for selected inverter voltage" };
  }

  return { inverter, battery };
}
