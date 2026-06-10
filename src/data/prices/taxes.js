/**
 * GST & tax rules — used during calculation (not stored inside product prices).
 */

export const GST = {
  /** Applied on top of panel cost (ex-GST base) */
  PANEL_RATE: 0.05,

  /** Applied on inverter cost (ex-GST base or extracted from GST-inclusive list price) */
  INVERTER_RATE: 0.05,

  /** @deprecated use INVERTER_RATE */
  MICROTEK_INVERTER_RATE: 0.05,

  /** Applied on top of battery list price (ex-GST base) */
  BATTERY_RATE: 0.18,

  /** Invergy MSP / list prices are GST-inclusive per supplier sheet */
  INVERGY_LIST_GST_INCLUDED: true,

  /**
   * Kalpana quote prices for INV-OGH hybrid models are ex-GST;
   * 5% GST is added on top of these amounts.
   */
  INVERGY_OGH_QUOTE_EX_GST: true,
  INVERGY_OGH_QUOTE_GST_RATE: 0.05,
};

export function addGstToBase(exGst, rate) {
  const base = Math.round(exGst);
  const gstAmount = Math.round(base * rate);
  return {
    exGst: base,
    gstAmount,
    cost: base + gstAmount,
    gstRate: rate,
    gstIncluded: false,
  };
}

export function splitInclusiveGst(inclusiveTotal, rate) {
  const total = Math.round(inclusiveTotal);
  const exGst = Math.round(total / (1 + rate));
  const gstAmount = total - exGst;
  return {
    exGst,
    gstAmount,
    cost: total,
    gstRate: rate,
    gstIncluded: true,
  };
}

export function withInverterGst(exGst) {
  return addGstToBase(exGst, GST.INVERTER_RATE);
}

export function withBatteryGst(exGst) {
  return addGstToBase(exGst, GST.BATTERY_RATE);
}
