/**
 * Normalize legacy brand-split inverter catalogs into unified SKU list.
 * Runs at load time — no brand names in matchers.
 */

function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Extract DC bus voltage from model metadata (normalization only). */
export function extractDcBusVoltage(modelNo = "", voltageHint = "") {
  const s = `${modelNo} ${voltageHint}`;
  if (/120\s*V|\b120\b/i.test(s)) return 120;
  if (/96\s*V|\b96\b/i.test(s)) return 96;
  if (/51\.2|48\s*-?\s*51|48\s*V|\b48\b/i.test(s)) return 48;
  if (/3P\s*\(LV\)|-3P\(LV\)/i.test(s)) return 48;
  if (/25\.6|\b24\s*V?\b/i.test(s)) return 24;
  if (/12\.8|\b12\s*V?\b/i.test(s)) return 12;
  const m = s.match(/(\d+(?:\.\d+)?)\s*V/i);
  if (m) {
    const v = Number(m[1]);
    if (v <= 13) return 12;
    if (v <= 26) return 24;
    if (v <= 55) return 48;
    return v;
  }
  return null;
}

function makeInverter({
  brand,
  modelNo,
  systemTypes,
  catalogGroup,
  phase,
  capacityAcKw,
  dcBusVoltage,
  maxDcOversizingRatio = 1.5,
  priceAmount,
  gstIncluded,
  gstRate = null,
  approved = true,
  businessPriority = 10,
}) {
  if (gstRate == null) {
    throw new Error(`gstRate required for ${brand} ${modelNo}`);
  }
  return {
    id: `${slugify(brand)}-${slugify(modelNo)}`,
    brand,
    modelNo,
    systemTypes,
    catalogGroup,
    phase,
    capacityAcKw,
    dcBusVoltage,
    minPlantLoadKw: 2,
    maxDcOversizingRatio,
    price: { amount: priceAmount, gstIncluded, gstRate },
    approved,
    businessPriority,
  };
}

export function normalizeInvergyCatalog(catalog) {
  const brand = catalog.meta.brand;
  const gstIncluded = catalog.meta.listGstIncluded;
  const gstRate = catalog.meta.gstRate;
  if (gstRate == null) {
    throw new Error("Invergy catalog meta.gstRate is required");
  }
  const list = [];

  for (const item of catalog.onGrid ?? []) {
    list.push(
      makeInverter({
        brand,
        modelNo: item.modelNo,
        systemTypes: ["on-grid"],
        catalogGroup: "on-grid-string",
        phase: item.phase,
        capacityAcKw: item.capacityKw,
        dcBusVoltage: null,
        priceAmount: item.msp,
        gstIncluded,
        gstRate,
        approved: true,
        businessPriority: 10,
      })
    );
  }

  for (const item of catalog.hybridQuoteOverrides ?? []) {
    const ogh = catalog.offGridOgh?.find((o) => o.capacityKw === item.capacityKw);
    list.push(
      makeInverter({
        brand,
        modelNo: ogh?.modelNo ?? item.modelNo,
        systemTypes: ["hybrid"],
        catalogGroup: "hybrid-quote-override",
        phase: "1P",
        capacityAcKw: item.capacityKw,
        dcBusVoltage: extractDcBusVoltage(ogh?.modelNo ?? item.modelNo),
        priceAmount: item.msp,
        gstIncluded,
        gstRate,
        approved: true,
        businessPriority: 1,
      })
    );
  }

  for (const item of catalog.offGridOgh ?? []) {
    if (catalog.hybridQuoteOverrides?.some((q) => q.capacityKw === item.capacityKw)) continue;
    list.push(
      makeInverter({
        brand,
        modelNo: item.modelNo,
        systemTypes: ["off-grid"],
        catalogGroup: "off-grid-ogh",
        phase: "1P",
        capacityAcKw: item.capacityKw,
        dcBusVoltage: extractDcBusVoltage(item.modelNo),
        priceAmount: item.msp,
        gstIncluded,
        gstRate,
        approved: true,
        businessPriority: 5,
      })
    );
  }

  for (const item of catalog.hybridLv ?? []) {
    list.push(
      makeInverter({
        brand,
        modelNo: item.modelNo,
        systemTypes: ["hybrid"],
        catalogGroup: "hybrid-lv",
        phase: item.phase,
        capacityAcKw: item.capacityKw,
        dcBusVoltage: extractDcBusVoltage(item.modelNo),
        priceAmount: item.msp,
        gstIncluded,
        gstRate,
        approved: true,
        businessPriority: 15,
      })
    );
  }

  for (const item of catalog.offGridOg ?? []) {
    list.push(
      makeInverter({
        brand,
        modelNo: item.modelNo,
        systemTypes: ["off-grid"],
        catalogGroup: "off-grid-og",
        phase: "1P",
        capacityAcKw: item.capacityKw,
        dcBusVoltage: extractDcBusVoltage(item.modelNo),
        priceAmount: item.msp,
        gstIncluded,
        gstRate,
        approved: true,
        businessPriority: 8,
      })
    );
  }

  return list;
}

export function normalizeMicrotekCatalog(catalog) {
  const brand = catalog.meta.brand;
  const gstIncluded = catalog.meta.gstIncluded ?? false;
  const gstRate = catalog.meta.gstRate;
  if (gstRate == null) {
    throw new Error("Microtek catalog meta.gstRate is required");
  }

  const list = [];

  for (const [phaseKey, items] of Object.entries(catalog.onGridGti ?? {})) {
    const phase = phaseKey === "threePhase" ? "3P" : "1P";
    for (const item of items) {
      list.push(
        makeInverter({
          brand,
          modelNo: `Microtek GTI ${item.capacityKw}kW ${phase}`,
          systemTypes: ["on-grid"],
          catalogGroup: "on-grid-gti",
          phase,
          capacityAcKw: item.capacityKw,
          dcBusVoltage: null,
          priceAmount: item.priceExGst,
          gstIncluded,
          gstRate,
          approved: true,
          businessPriority: 10,
        })
      );
    }
  }

  for (const [phaseKey, items] of Object.entries(catalog.hybrid ?? {})) {
    const phase = phaseKey === "threePhase" ? "3P" : "1P";
    for (const item of items) {
      list.push(
        makeInverter({
          brand,
          modelNo: `Microtek Hybrid ${item.capacityKw}kW ${phase}`,
          systemTypes: ["hybrid"],
          catalogGroup: "hybrid",
          phase,
          capacityAcKw: item.capacityKw,
          dcBusVoltage: extractDcBusVoltage(item.voltage),
          priceAmount: item.priceExGst,
          gstIncluded,
          gstRate,
          approved: true,
          businessPriority: 10,
        })
      );
    }
  }

  for (const item of catalog.offGridPwm ?? []) {
    list.push(
      makeInverter({
        brand,
        modelNo: item.model,
        systemTypes: ["off-grid"],
        catalogGroup: "off-grid-pwm",
        phase: "1P",
        capacityAcKw: item.capacityKva,
        dcBusVoltage: extractDcBusVoltage(item.voltage),
        priceAmount: item.priceExGst,
        gstIncluded,
        gstRate,
        approved: true,
        businessPriority: 10,
      })
    );
  }

  for (const item of catalog.offGridMppt ?? []) {
    list.push(
      makeInverter({
        brand,
        modelNo: item.model,
        systemTypes: ["off-grid"],
        catalogGroup: "off-grid-mppt",
        phase: "1P",
        capacityAcKw: item.capacityKva,
        dcBusVoltage: extractDcBusVoltage(item.voltage),
        priceAmount: item.priceExGst,
        gstIncluded,
        gstRate,
        approved: true,
        businessPriority: 12,
      })
    );
  }

  return list;
}

export function buildUnifiedInverters(invergyCatalog, microtekCatalog) {
  return [
    ...normalizeInvergyCatalog(invergyCatalog),
    ...normalizeMicrotekCatalog(microtekCatalog),
  ];
}
