/**
 * Battery prices — LITHIUM ONLY.
 * Pricing strictly from the two official supplier lists:
 *   • Microtek (Jaganlite) price list — lithium battery, ex-GST.
 *   • Invergy LFP price list (W.E.F Oct 25) — MSP, ex-GST.
 * 18% GST is applied at calculation time (see taxes.js).
 *
 * The battery brand is NOT chosen by the customer — it automatically follows
 * the selected inverter brand.
 */

export const BATTERY_BRAND_IDS = {
  Microtek: "microtek",
  Invergy: "invergy",
};

export const BATTERY_TYPES = {
  LITHIUM: "lithium",
};

/**
 * One lithium model per voltage bucket (12 / 24 / 48-51.2 V) per brand, so the
 * battery can be matched automatically to the inverter DC bus voltage.
 */
export const BATTERY_PRICES = {
  microtek: {
    label: "Microtek",
    chemistry: BATTERY_TYPES.LITHIUM,
    models: [
      { id: "1.28kw", size: "1.28KW", modelNo: "1280 WH", voltage: 12.8, ah: 100, price: 16000 },
      { id: "2.56kw", size: "2.56KW", modelNo: "2560 WH", voltage: 25.6, ah: 100, price: 32000 },
      { id: "5.12kw", size: "5.12KW", modelNo: "5120 WH", voltage: 51.2, ah: 100, price: 64000 },
    ],
  },

  invergy: {
    label: "Invergy",
    chemistry: BATTERY_TYPES.LITHIUM,
    models: [
      { id: "1.2kw", size: "1.2KW", modelNo: "INV LFP 12100-TB", voltage: 12, ah: 100, price: 15349 },
      { id: "2.4kw", size: "2.4KW", modelNo: "INV LFP 24100-TB", voltage: 24, ah: 100, price: 29463 },
      {
        id: "5.12kw-wall",
        size: "5.12KW-WALL MOUNT",
        modelNo: "INV (EU)-5.0 W01-51.2",
        voltage: 51.2,
        ah: 100,
        price: 70000,
      },
    ],
  },
};

export function getBatteryModels(brand) {
  const brandId = BATTERY_BRAND_IDS[brand];
  if (!brandId) return [];
  return BATTERY_PRICES[brandId]?.models ?? [];
}

export function getBatteryById(brand, modelId) {
  const brandId = BATTERY_BRAND_IDS[brand];
  if (!brandId) return null;
  return BATTERY_PRICES[brandId]?.models.find((m) => m.id === modelId) ?? null;
}

/** Default model (mid-range) when only the brand is known */
export function getBatteryPrice(brand, modelId) {
  const brandId = BATTERY_BRAND_IDS[brand];
  if (!brandId) return null;

  const entry = BATTERY_PRICES[brandId];
  if (!entry?.models.length) return null;

  const model = modelId
    ? entry.models.find((m) => m.id === modelId)
    : entry.models[Math.floor(entry.models.length / 2)];

  if (!model) return null;

  return {
    ...model,
    company: brand,
    brand: entry.label,
  };
}
