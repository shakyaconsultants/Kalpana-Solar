/**
 * Apply GST from SKU price metadata — no brand-specific logic.
 */

export function applyPriceTax(priceMeta) {
  if (!priceMeta || priceMeta.amount == null) {
    throw new Error("Catalog price.amount is required");
  }
  if (priceMeta.gstRate == null) {
    throw new Error("Catalog price.gstRate is required");
  }

  const amount = Math.round(priceMeta.amount);
  const rate = priceMeta.gstRate;

  if (priceMeta.gstIncluded) {
    const exGst = Math.round(amount / (1 + rate));
    const gstAmount = amount - exGst;
    return { exGst, gstAmount, cost: amount, gstRate: rate, gstIncluded: true };
  }

  const exGst = amount;
  const gstAmount = Math.round(exGst * rate);
  return { exGst, gstAmount, cost: exGst + gstAmount, gstRate: rate, gstIncluded: false };
}

export function withTaxFields(sku, priceMeta) {
  return { ...sku, ...applyPriceTax(priceMeta) };
}
