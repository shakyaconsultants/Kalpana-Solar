/**
 * GST & tax rules — used during calculation (not stored inside product prices).
 */

export const GST = {
  /** Applied on top of panel cost (ex-GST base) */
  PANEL_RATE: 0.05,

  /** Applied on top of Microtek inverter cost (ex-GST base) */
  MICROTEK_INVERTER_RATE: 0.05,

  /** Invergy MSP / list prices are GST-inclusive per supplier sheet */
  INVERGY_LIST_GST_INCLUDED: true,

  /**
   * Kalpana quote prices for INV-OGH hybrid models are ex-GST;
   * 5% GST is added on top of these amounts.
   */
  INVERGY_OGH_QUOTE_EX_GST: true,
  INVERGY_OGH_QUOTE_GST_RATE: 0.05,
};
