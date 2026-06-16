/**
 * Equipment matching — minimum-cost compatible panel / inverter / battery selection.
 */

import { getPanelConfig, PANEL_GST_RATE } from "../data/prices/panels.js";
import { BATTERY_PRICES, BATTERY_BRAND_IDS, BATTERY_TYPES } from "../data/prices/batteries.js";
import {
  INVERGY_ONGRID,
  INVERGY_HYBRID_LV,
  INVERGY_HYBRID_QUOTE_PRICES,
  INVERGY_OFFGRID_OG,
} from "../data/prices/invergy.js";
import {
  MICROTEK_OFFGRID_PWM,
  MICROTEK_OFFGRID_MPPT,
  MICROTEK_ONGRID_GTI,
  MICROTEK_HYBRID,
} from "../data/prices/microtek.js";
import {
  GST,
  withInverterGst,
  withBatteryGst,
  splitInclusiveGst,
} from "../data/prices/taxes.js";

/** Map battery / inverter nominal V → compatible bus bucket (12 / 24 / 48). Returns null above 48 V. */
export function getVoltageBucket(voltage) {
  if (voltage == null || voltage > 55) return null;
  if (voltage <= 13) return 12;
  if (voltage <= 26) return 24;
  return 48;
}

export function parseInverterDcVoltage(modelNo = "", voltageHint = "") {
  const s = `${modelNo} ${voltageHint}`;
  if (/120\s*V|\b120\b/i.test(s)) return 120;
  if (/96\s*V|\b96\b/i.test(s)) return 96;
  if (/51\.2|48\s*-?\s*51|48\s*V|\b48\b/i.test(s)) return 48;
  if (/25\.6|\b24\s*V?\b/i.test(s)) return 24;
  if (/12\.8|\b12\s*V?\b/i.test(s)) return 12;
  const m = s.match(/(\d+(?:\.\d+)?)\s*V/i);
  if (m) {
    const v = Number(m[1]);
    if (v > 55) return v;
    return getVoltageBucket(v);
  }
  return null;
}

function withPanelGst(exGst) {
  return Math.round(exGst * (1 + PANEL_GST_RATE));
}

function attachInverterTax(fields, exGst, gstIncluded = false) {
  const tax = gstIncluded ? splitInclusiveGst(exGst, GST.INVERTER_RATE) : withInverterGst(exGst);
  return { ...fields, ...tax };
}

function attachBatteryTax(fields, listPrice, gstIncluded = false) {
  const tax = gstIncluded
    ? splitInclusiveGst(listPrice, GST.BATTERY_RATE)
    : withBatteryGst(listPrice);
  return { ...fields, ...tax };
}

/** Inverter rated kW/kVA must meet panel kWp (small tolerance for rounding). */
function inverterMeetsRequired(ratedKw, requiredKw) {
  return ratedKw >= requiredKw - 0.05;
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

function pickMicrotekOnGrid(requiredKw, preferSinglePhase = true) {
  const phaseOrder = preferSinglePhase
    ? ["singlePhase", "threePhase"]
    : ["threePhase", "singlePhase"];

  for (const phase of phaseOrder) {
    const list = MICROTEK_ONGRID_GTI[phase] ?? [];
    const candidates = list
      .filter((i) => inverterMeetsRequired(i.capacityKw, requiredKw))
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

function pickMicrotekHybrid(requiredKw, preferSinglePhase = true) {
  const phaseOrder = preferSinglePhase
    ? ["singlePhase", "threePhase"]
    : ["threePhase", "singlePhase"];

  for (const phase of phaseOrder) {
    const list = MICROTEK_HYBRID[phase === "singlePhase" ? "singlePhase" : "threePhase"] ?? [];
    const candidates = list
      .filter((i) => inverterMeetsRequired(i.capacityKw, requiredKw))
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

function pickSmallestInvergyOnGrid(requiredKw, preferSinglePhase = true) {
  const phaseOrder = preferSinglePhase ? ["1P", "3P"] : ["3P", "1P"];

  for (const phase of phaseOrder) {
    const candidates = INVERGY_ONGRID.filter(
      (i) => inverterMeetsRequired(i.capacityKw, requiredKw) && i.phase === phase
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

function pickInvergyHybrid(requiredKw) {
  const quote = INVERGY_HYBRID_QUOTE_PRICES.filter((q) => inverterMeetsRequired(q.capacityKw, requiredKw)).sort(
    (a, b) => a.msp - b.msp
  );

  if (quote.length) {
    const q = quote[0];
    return attachInverterTax(
      {
        brand: "Invergy",
        modelNo: q.modelNo,
        capacityKw: q.capacityKw,
        dcBusVoltage:
          q.dcBusVoltage ?? parseInverterDcVoltage(q.modelNo) ?? (q.capacityKw <= 5 ? 24 : 48),
      },
      q.msp,
      true
    );
  }

  const lv = INVERGY_HYBRID_LV.filter((i) => inverterMeetsRequired(i.capacityKw, requiredKw) && i.phase === "1P").sort(
    (a, b) => a.msp - b.msp
  );

  if (!lv.length) return null;

  const inv = lv[0];
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

function pickMicrotekOffGrid(requiredKw) {
  const candidates = [...MICROTEK_OFFGRID_PWM, ...MICROTEK_OFFGRID_MPPT]
    .filter((i) => inverterMeetsRequired(i.capacityKva, requiredKw))
    .sort(
      (a, b) => withInverterGst(a.priceExGst).cost - withInverterGst(b.priceExGst).cost
    );

  if (!candidates.length) return null;

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

function pickInvergyOffGrid(requiredKw) {
  const candidates = INVERGY_OFFGRID_OG.filter((i) => inverterMeetsRequired(i.capacityKw, requiredKw)).sort(
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

export function selectBestInverter(systemType, plantKw, panelKwp, { withBattery = false, inverterBrand = "Invergy" } = {}) {
  const requiredKw = Math.max(plantKw, panelKwp ?? plantKw);
  const brand = inverterBrand === "Microtek" ? "Microtek" : "Invergy";

  if (
    (systemType === "on-grid" || (systemType === "hybrid" && !withBattery)) &&
    !withBattery
  ) {
    return brand === "Microtek"
      ? pickMicrotekOnGrid(requiredKw)
      : pickSmallestInvergyOnGrid(requiredKw);
  }

  if (systemType === "hybrid" && withBattery) {
    return brand === "Microtek" ? pickMicrotekHybrid(requiredKw) : pickInvergyHybrid(requiredKw);
  }

  if (systemType === "off-grid") {
    return brand === "Microtek" ? pickMicrotekOffGrid(requiredKw) : pickInvergyOffGrid(requiredKw);
  }

  return null;
}

/** Parse battery label energy (kWh) from size field e.g. "1.28KW" → 1.28 */
function parseBatteryEnergyKwh(model) {
  const fromSize = parseFloat(String(model.size).replace(/KW/i, ""));
  if (!Number.isNaN(fromSize) && fromSize > 0) return fromSize;
  return (model.ah * model.voltage) / 1000;
}

/**
 * Smallest lithium battery from brand that matches inverter DC bus voltage and
 * meets backup sizing for the plant load (not the largest/cheapest 5 kW unit).
 */
export function selectBestBattery(brand, dcBusVoltage, plantKw) {
  const bucket = getVoltageBucket(dcBusVoltage);
  if (!bucket) return null;

  const brandId = BATTERY_BRAND_IDS[brand];
  if (!brandId) return null;

  const catalog = BATTERY_PRICES[brandId];
  if (!catalog || catalog.chemistry !== BATTERY_TYPES.LITHIUM) return null;

  const models = catalog.models ?? [];
  const gstIncluded = brand === "Invergy";
  const compatible = models
    .filter((m) => getVoltageBucket(m.voltage) === bucket)
    .map((m) => {
      const tax = gstIncluded
        ? splitInclusiveGst(m.price, GST.BATTERY_RATE)
        : withBatteryGst(m.price);
      return {
        ...m,
        brand,
        energyKwh: parseBatteryEnergyKwh(m),
        ...tax,
      };
    })
    .sort((a, b) => a.energyKwh - b.energyKwh);

  if (!compatible.length) return null;

  // Target ~40% of plant kW for backup; pick smallest battery that meets it
  const targetKwh = Math.max(1.0, plantKw * 0.4);
  const adequate = compatible.find((m) => m.energyKwh >= targetKwh);
  return adequate ?? compatible[0];
}

/** Off-grid: pick smallest compatible battery across both brands */
export function selectCheapestCompatibleBattery(dcBusVoltage, plantKw) {
  let best = null;

  for (const brand of ["Microtek", "Invergy"]) {
    const bat = selectBestBattery(brand, dcBusVoltage, plantKw);
    if (bat && (!best || bat.energyKwh < best.energyKwh)) best = bat;
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

export function selectInverterAndBattery(
  systemType,
  plantKw,
  panelKwp,
  batteryBrand,
  wantsBattery,
  inverterBrand
) {
  const withBattery = needsBattery(systemType, wantsBattery);
  const inverter = selectBestInverter(systemType, plantKw, panelKwp, {
    withBattery,
    inverterBrand,
  });
  if (!inverter) return { inverter: null, battery: null };

  if (!withBattery) {
    return { inverter, battery: null };
  }

  const brand = batteryBrand || inverterBrand;
  const battery = brand ? selectBestBattery(brand, inverter.dcBusVoltage, plantKw) : null;

  if (!battery) {
    return { inverter, battery: null, error: "No compatible battery for selected inverter voltage" };
  }

  return { inverter, battery };
}
