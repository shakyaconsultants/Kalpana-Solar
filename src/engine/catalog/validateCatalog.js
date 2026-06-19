/**
 * Production catalog validation — no placeholders, mock SKUs, or missing prices.
 */

export function isPlaceholderSku(item) {
  const id = String(item.id ?? "").toLowerCase();
  const model = String(item.modelNo ?? item.label ?? "").toLowerCase();
  const note = String(item.note ?? "").toLowerCase();

  if (id.includes("placeholder") || id.includes("mock") || id.includes("temp-")) return true;
  if (model.includes("placeholder") || model.includes("mock sku")) return true;
  if (note.includes("placeholder") || note.includes("update price from rate sheet")) return true;
  return false;
}

export function validatePriceMeta(price, skuId) {
  const issues = [];
  if (!price || typeof price.amount !== "number" || !Number.isFinite(price.amount) || price.amount <= 0) {
    issues.push(`missing or invalid price.amount on ${skuId}`);
  }
  if (price?.gstRate == null || !Number.isFinite(price.gstRate)) {
    issues.push(`missing price.gstRate on ${skuId}`);
  }
  if (price?.gstIncluded == null) {
    issues.push(`missing price.gstIncluded on ${skuId}`);
  }
  return issues;
}

export function validateInverterSku(inv) {
  const issues = [];
  if (isPlaceholderSku(inv)) issues.push(`placeholder inverter: ${inv.id}`);
  issues.push(...validatePriceMeta(inv.price, inv.id));
  if (!inv.catalogGroup) issues.push(`missing catalogGroup: ${inv.id}`);
  if (!inv.phase) issues.push(`missing phase: ${inv.id}`);
  if (inv.capacityAcKw == null) issues.push(`missing capacityAcKw: ${inv.id}`);
  if (!inv.systemTypes?.length) issues.push(`missing systemTypes: ${inv.id}`);
  return issues;
}

export function validateBatterySku(bat) {
  const issues = [];
  if (isPlaceholderSku(bat)) issues.push(`placeholder battery: ${bat.id}`);
  issues.push(...validatePriceMeta(bat.price, bat.id));
  if (!bat.compatibleDcVoltages?.length) issues.push(`missing compatibleDcVoltages: ${bat.id}`);
  if (bat.voltage == null) issues.push(`missing voltage: ${bat.id}`);
  if (bat.capacityKwh == null) issues.push(`missing capacityKwh: ${bat.id}`);
  return issues;
}

export function validateKitSku(kit) {
  const issues = [];
  if (isPlaceholderSku(kit)) issues.push(`placeholder kit: ${kit.id}`);
  issues.push(...validatePriceMeta(kit.price, kit.id));
  if (!kit.plantLoadKw?.length) issues.push(`missing plantLoadKw: ${kit.id}`);
  return issues;
}

/** Remove placeholder / invalid SKUs; collect health issues for reporting. */
export function sanitizeProductionCatalog(raw) {
  const health = {
    removedPlaceholders: [],
    missingPrices: [],
    missingMetadata: [],
    duplicateSkus: [],
    rejectedInverters: [],
    rejectedBatteries: [],
    rejectedKits: [],
  };

  function reject(item, issues, bucket, list) {
    bucket.push({ id: item.id, issues });
    if (isPlaceholderSku(item)) health.removedPlaceholders.push(item.id);
    for (const issue of issues) {
      if (issue.includes("price")) health.missingPrices.push({ id: item.id, issue });
      else health.missingMetadata.push({ id: item.id, issue });
    }
    return false;
  }

  const inverters = [];
  const seenInv = new Set();
  for (const inv of raw.inverters ?? []) {
    if (seenInv.has(inv.id)) {
      health.duplicateSkus.push({ type: "inverter", id: inv.id });
      continue;
    }
    seenInv.add(inv.id);
    const issues = validateInverterSku(inv);
    if (issues.length) {
      reject(inv, issues, health.rejectedInverters, inverters);
      continue;
    }
    inverters.push(inv);
  }

  const batteries = [];
  const seenBat = new Set();
  for (const bat of raw.batteries ?? []) {
    if (seenBat.has(bat.id)) {
      health.duplicateSkus.push({ type: "battery", id: bat.id });
      continue;
    }
    seenBat.add(bat.id);
    const issues = validateBatterySku(bat);
    if (issues.length) {
      reject(bat, issues, health.rejectedBatteries, batteries);
      continue;
    }
    batteries.push(bat);
  }

  const kits = [];
  const seenKit = new Set();
  for (const kit of raw.kits ?? []) {
    if (seenKit.has(kit.id)) {
      health.duplicateSkus.push({ type: "kit", id: kit.id });
      continue;
    }
    seenKit.add(kit.id);
    const issues = validateKitSku(kit);
    if (issues.length) {
      reject(kit, issues, health.rejectedKits, kits);
      continue;
    }
    kits.push(kit);
  }

  return {
    catalog: { ...raw, inverters, batteries, kits },
    health,
  };
}
