/**
 * Equipment matching — minimum-cost compatible panel / inverter / battery selection.
 */

import { getPanelConfigOptions, PANEL_GST_RATE } from "../data/prices/panels.js";
import { BATTERY_PRICES, BATTERY_BRAND_IDS } from "../data/prices/batteries.js";
import {
  INVERGY_ONGRID,
  INVERGY_HYBRID_LV,
  INVERGY_HYBRID_QUOTE_PRICES,
  INVERGY_OFFGRID_OG,
} from "../data/prices/invergy.js";
import { MICROTEK_OFFGRID_PWM, MICROTEK_OFFGRID_MAX_KW, MICROTEK_ONGRID_GTI, MICROTEK_HYBRID } from "../data/prices/microtek.js";
import { GST } from "../data/prices/taxes.js";

/** Map battery nominal V → inverter DC bus bucket (12 / 24 / 48) */
export function getVoltageBucket(voltage) {
  if (voltage <= 13) return 12;
  if (voltage <= 26) return 24;
  return 48;
}

export function parseInverterDcVoltage(modelNo = "") {
  const m = modelNo.match(/(\d+)V/i);
  if (m) return getVoltageBucket(Number(m[1]));
  if (/48V|51\.2/i.test(modelNo)) return 48;
  if (/24V/i.test(modelNo)) return 24;
  if (/12V/i.test(modelNo)) return 12;
  return null;
}

function withPanelGst(exGst) {
  return Math.round(exGst * (1 + PANEL_GST_RATE));
}

function withMicrotekGst(exGst) {
  return Math.round(exGst * (1 + GST.MICROTEK_INVERTER_RATE));
}

function withOghGst(exGst) {
  return Math.round(exGst * (1 + GST.INVERGY_OGH_QUOTE_GST_RATE));
}

/** Cheapest panel layout for plant kW (DCR tier set by system type; best wattage among options) */
export function selectBestPanel(company, category, plantKw, systemType) {
  const options = getPanelConfigOptions(company, category, systemType);
  if (!options.length) return null;

  let best = null;
  const targetW = plantKw * 1000;

  for (const opt of options) {
    const panelCount = Math.ceil(targetW / opt.wattPerPanel);
    const totalWatts = panelCount * opt.wattPerPanel;
    const exGst = totalWatts * opt.pricePerWattExGst;
    const cost = withPanelGst(exGst);

    if (!best || cost < best.cost) {
      best = {
        ...opt,
        panelCount,
        totalWatts,
        exGst: Math.round(exGst),
        cost,
      };
    }
  }

  return best;
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
      return {
        brand: "Microtek",
        modelNo: `Microtek GTI ${inv.capacityKw}kW`,
        capacityKw: inv.capacityKw,
        cost: withMicrotekGst(inv.priceExGst),
        dcBusVoltage: null,
        gstIncluded: false,
      };
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
      return {
        brand: "Microtek",
        modelNo: `Microtek Hybrid ${inv.capacityKw}kW`,
        capacityKw: inv.capacityKw,
        cost: withMicrotekGst(inv.priceExGst),
        dcBusVoltage: parseInverterDcVoltage(inv.voltage),
        gstIncluded: false,
      };
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
      return {
        brand: "Invergy",
        modelNo: inv.modelNo,
        capacityKw: inv.capacityKw,
        cost: inv.msp,
        dcBusVoltage: null,
        gstIncluded: true,
      };
    }
  }
  return null;
}

function pickInvergyHybrid(plantKw) {
  const ogh = INVERGY_HYBRID_QUOTE_PRICES.filter((q) => q.capacityKw >= plantKw).sort(
    (a, b) => a.priceExGst - b.priceExGst
  );

  if (ogh.length) {
    const q = ogh[0];
    return {
      brand: "Invergy",
      modelNo: q.modelNo,
      capacityKw: q.capacityKw,
      cost: withOghGst(q.priceExGst),
      dcBusVoltage: q.capacityKw <= 3 ? 24 : 24,
      gstIncluded: false,
      note: "OGH hybrid quote + GST",
    };
  }

  const lv = INVERGY_HYBRID_LV.filter((i) => i.capacityKw >= plantKw && i.phase === "1P").sort(
    (a, b) => a.msp - b.msp
  );

  if (!lv.length) return null;

  const inv = lv[0];
  return {
    brand: "Invergy",
    modelNo: inv.modelNo,
    capacityKw: inv.capacityKw,
    cost: inv.msp,
    dcBusVoltage: parseInverterDcVoltage(inv.modelNo),
    gstIncluded: true,
  };
}

function pickMicrotekOffGrid(plantKw) {
  const candidates = MICROTEK_OFFGRID_PWM.filter((i) => i.capacityKva >= plantKw).sort(
    (a, b) => withMicrotekGst(a.priceExGst) - withMicrotekGst(b.priceExGst)
  );

  if (!candidates.length) {
    const fallback = MICROTEK_OFFGRID_PWM[MICROTEK_OFFGRID_PWM.length - 1];
    return {
      brand: "Microtek",
      modelNo: fallback.model,
      capacityKw: fallback.capacityKva,
      cost: withMicrotekGst(fallback.priceExGst),
      dcBusVoltage: parseInverterDcVoltage(fallback.voltage),
      gstIncluded: false,
    };
  }

  const inv = candidates[0];
  return {
    brand: "Microtek",
    modelNo: inv.model,
    capacityKw: inv.capacityKva,
    cost: withMicrotekGst(inv.priceExGst),
    dcBusVoltage: parseInverterDcVoltage(inv.voltage),
    gstIncluded: false,
  };
}

function pickInvergyOffGrid(plantKw) {
  const candidates = INVERGY_OFFGRID_OG.filter((i) => i.capacityKw >= plantKw).sort(
    (a, b) => a.msp - b.msp
  );

  if (!candidates.length) return null;

  const inv = candidates[0];
  return {
    brand: "Invergy",
    modelNo: inv.modelNo,
    capacityKw: inv.capacityKw,
    cost: inv.msp,
    dcBusVoltage: parseInverterDcVoltage(inv.modelNo),
    gstIncluded: true,
  };
}

export function selectBestInverter(systemType, plantKw, { withBattery = false, inverterBrand = "Invergy" } = {}) {
  const brand = inverterBrand === "Microtek" ? "Microtek" : "Invergy";

  if (systemType === "on-grid" && !withBattery) {
    return brand === "Microtek"
      ? pickMicrotekOnGrid(plantKw)
      : pickSmallestInvergyOnGrid(plantKw);
  }

  if (systemType === "hybrid" || (systemType === "on-grid" && withBattery)) {
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

/** Cheapest battery from brand that matches inverter DC bus voltage */
export function selectBestBattery(brand, dcBusVoltage, minEnergyKwh = 0) {
  if (!dcBusVoltage) return null;

  const brandId = BATTERY_BRAND_IDS[brand];
  if (!brandId) return null;

  const models = BATTERY_PRICES[brandId]?.models ?? [];
  const bucket = dcBusVoltage;

  const compatible = models.filter((m) => getVoltageBucket(m.voltage) === bucket);

  if (!compatible.length) return null;

  const sorted = compatible
    .map((m) => ({
      ...m,
      brand,
      energyKwh: parseFloat(m.size) || m.ah * m.voltage / 1000,
      cost: m.price,
    }))
    .filter((m) => m.energyKwh >= minEnergyKwh || minEnergyKwh === 0)
    .sort((a, b) => a.cost - b.cost);

  if (!sorted.length) {
    return compatible
      .map((m) => ({
        ...m,
        brand,
        energyKwh: parseFloat(String(m.size).replace(/KW/i, "")) || 1,
        cost: m.price,
      }))
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
  if (systemType === "off-grid" || systemType === "on-grid") return true;
  if (systemType === "hybrid") return wantsBattery === true;
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

  if (!needsBattery(systemType, wantsBattery)) {
    return { inverter, battery: null };
  }

  let battery = null;

  if (systemType === "off-grid") {
    battery = batteryBrand
      ? selectBestBattery(batteryBrand, inverter.dcBusVoltage, plantKw * 0.3)
      : selectCheapestCompatibleBattery(inverter.dcBusVoltage, plantKw);
  } else if (batteryBrand && inverter.dcBusVoltage) {
    battery = selectBestBattery(batteryBrand, inverter.dcBusVoltage, plantKw * 0.25);
  }

  if (needsBattery(systemType, wantsBattery) && !battery) {
    return { inverter, battery: null, error: "No compatible battery for selected inverter voltage" };
  }

  return { inverter, battery };
}
