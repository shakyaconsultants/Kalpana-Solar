import { test } from "node:test";
import assert from "node:assert/strict";
import { calculateQuoteBreakdown, isValidSelections } from "../../src/calculations/calculateQuote.js";
import { quote } from "../../src/engine/index.js";
import { baseSelections } from "./helpers.js";

test("engine returns explainability for 3kW hybrid + battery", () => {
  const result = quote(baseSelections(3, "hybrid", true));
  assert.ok(result?.selected);
  assert.ok(result.explainability?.compatibilityChecks?.length > 0);
  assert.equal(result.selected.battery.brand, "Invergy");
});

test("3kW on-grid produces quote with no battery", () => {
  const b = calculateQuoteBreakdown(baseSelections(3, "on-grid", false));
  assert.ok(b?.finalPrice > 0);
  assert.equal(b.matched.battery, null);
});

test("selected quote is cheapest among candidates", () => {
  const sel = baseSelections(5, "off-grid", true);
  const result = quote(sel);
  const prices = [result.selected.finalPrice, ...result.alternatives.map((a) => a.finalPrice)];
  const min = Math.min(...prices);
  assert.equal(result.selected.finalPrice, min);
});

test("explainability cites lowest price selection", () => {
  const result = quote(baseSelections(5, "off-grid", true));
  assert.match(result.explainability.selectionReasons.overall, /lowest final price/i);
});

test("Microtek on-grid 2kW quote succeeds", () => {
  const sel = { ...baseSelections(2, "on-grid", false), inverterBrand: "Microtek" };
  const result = quote(sel);
  assert.ok(result?.selected);
  assert.equal(result.selected.inverter.brand, "Microtek");
});

test("isValidSelections rejects incomplete hybrid battery answer", () => {
  assert.equal(
    isValidSelections({ ...baseSelections(3, "hybrid", false), wantsBattery: null }),
    false
  );
});
