import { test } from "node:test";
import assert from "node:assert/strict";
import { calculateQuoteBreakdown } from "../../src/calculations/calculateQuote.js";
import { quote } from "../../src/engine/index.js";
import { tataSelections } from "./helpers.js";

test("Tata 3kW kit final price equals kit price only", () => {
  const b = calculateQuoteBreakdown(tataSelections(3));
  assert.ok(b?.isKit);
  assert.equal(b.finalPrice, 200000);
  assert.equal(b.servicesSubtotal, 0);
  assert.equal(b.margin, 0);
});

test("Tata 4kW kit final price equals kit price only", () => {
  const b = calculateQuoteBreakdown(tataSelections(4));
  assert.equal(b.finalPrice, 250000);
  assert.equal(b.servicesSubtotal, 0);
  assert.equal(b.margin, 0);
});

test("Tata kit has no service line items", () => {
  const result = quote(tataSelections(3));
  const sc = result.selected.serviceComponents;
  assert.equal(sc.wiring, 0);
  assert.equal(sc.installation, 0);
  assert.equal(sc.installationMaterial, 0);
  assert.equal(sc.civil, 0);
  assert.equal(sc.miscellaneous, 0);
  assert.equal(sc.equipment, 0);
});

test("Tata kit explainability marks fully inclusive", () => {
  const result = quote(tataSelections(3));
  assert.match(result.explainability.selectionReasons.overall, /fully inclusive/i);
});

test("Tata kit legacy breakdown isFullyInclusiveKit flag", () => {
  const b = calculateQuoteBreakdown(tataSelections(3));
  assert.equal(b.isFullyInclusiveKit, true);
  assert.equal(b.marginRateLabel, "Included in kit");
});

test("Tata 2kW is not eligible", () => {
  const b = calculateQuoteBreakdown(tataSelections(2));
  assert.equal(b, null);
});

test("Tata hybrid is not eligible", () => {
  const sel = { ...tataSelections(3), systemType: "hybrid", wantsBattery: true };
  assert.equal(calculateQuoteBreakdown(sel), null);
});
