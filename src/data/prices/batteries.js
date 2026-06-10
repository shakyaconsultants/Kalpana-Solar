/**
 * Battery prices — Kalpana Solar rate sheet (Sheet2).
 * Stored separately from panels and inverters.
 * Prices are as listed on sheet (INR).
 */

export const BATTERY_BRAND_IDS = {
  Microtek: "microtek",
  Invergy: "invergy",
};

export const BATTERY_TYPES = {
  LITHIUM: "lithium",
};

/** Kalpana quote list — primary source for the quotation form */
export const BATTERY_PRICES = {
  microtek: {
    label: "Microtek",
    chemistry: BATTERY_TYPES.LITHIUM,
    models: [
      {
        id: "1.28kw",
        size: "1.28KW",
        voltage: 12.8,
        ah: 100,
        price: 19000,
      },
      {
        id: "2.56kw",
        size: "2.56KW",
        voltage: 25.6,
        ah: 100,
        price: 38000,
      },
      {
        id: "5.12kw",
        size: "5.12KW",
        voltage: 51.2,
        ah: 100,
        price: 76000,
      },
    ],
  },

  invergy: {
    label: "Invergy",
    chemistry: BATTERY_TYPES.LITHIUM,
    models: [
      { id: "0.96kw", size: "0.96KW", voltage: 12, ah: 80, price: 12000 },
      { id: "1.2kw", size: "1.2KW", voltage: 12, ah: 100, price: 16000 },
      { id: "1.8kw", size: "1.8KW", voltage: 12, ah: 150, price: 23000 },
      { id: "2.4kw-12", size: "2.4KW", voltage: 12, ah: 200, price: 29000 },
      { id: "2.4kw-24", size: "2.4KW", voltage: 24, ah: 100, price: 30000 },
      { id: "4.8kw", size: "4.8KW", voltage: 24, ah: 200, price: 53000 },
      {
        id: "5.12kw-wall",
        size: "5.12KW-WALL MOUNT",
        voltage: 51.2,
        ah: 100,
        price: 82000,
      },
      {
        id: "5.12kw-floor",
        size: "5.12KW-FLOOR MOUNT",
        voltage: 51.2,
        ah: 100,
        price: 84500,
      },
      {
        id: "5.12kw-stack",
        size: "5.12KW-STACKABLE",
        voltage: 51.2,
        ah: 100,
        price: 85000,
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

/** Default model (first listed) when form only selects brand */
export function getBatteryPrice(brand, modelId) {
  const brandId = BATTERY_BRAND_IDS[brand];
  if (!brandId) return null;

  const entry = BATTERY_PRICES[brandId];
  if (!entry?.models.length) return null;

  const model = modelId
    ? entry.models.find((m) => m.id === modelId)
    : entry.models[Math.floor(entry.models.length / 2)]; // mid-range default for estimate

  if (!model) return null;

  return {
    ...model,
    company: brand,
    brand: entry.label,
  };
}
