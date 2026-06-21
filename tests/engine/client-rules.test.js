import { test } from "node:test";
import assert from "node:assert/strict";
import { quote } from "../../src/engine/index.js";
import { calculateQuoteBreakdown } from "../../src/calculations/calculateQuote.js";
import { baseSelections } from "./helpers.js";

test("5kW off-grid with battery selects OG family per Invergy rule", () => {
  const sel = baseSelections(5, "off-grid", true);
  const result = quote(sel);
  assert.ok(result?.selected);
  assert.equal(result.selected.inverter.catalogGroup, "off-grid-og");
  assert.match(result.selected.inverter.modelNo, /INV-OG-/);
});

test("three-phase on-grid uses hybrid wiring rate (5000 not 3000)", () => {
  const sel = baseSelections(5, "on-grid", false, "threePhase");
  const result = quote(sel);
  assert.equal(result.selected.serviceComponents.wiring, 5000);
});

test("three-phase hybrid with battery uses hybrid wiring", () => {
  const sel = baseSelections(5, "hybrid", true, "threePhase");
  const result = quote(sel);
  assert.equal(result.selected.serviceComponents.wiring, 5000);
});

test("single-phase on-grid uses on-grid wiring rate", () => {
  const sel = baseSelections(3, "on-grid", false, "singlePhase");
  const result = quote(sel);
  assert.equal(result.selected.serviceComponents.wiring, 3000);
});

test("3kW hybrid no battery uses hybrid catalog only", () => {
  const sel = baseSelections(3, "hybrid", false, "singlePhase");
  const result = quote(sel);
  assert.ok(result?.selected?.inverter);
  assert.ok(result.selected.inverter.catalogGroup.startsWith("hybrid"));
});

test("5kW hybrid no battery uses hybrid-lv three-phase inverter", () => {
  const sel = baseSelections(5, "hybrid", false, "threePhase");
  const result = quote(sel);
  assert.ok(result?.selected?.inverter);
  assert.ok(result.selected.inverter.catalogGroup.startsWith("hybrid"));
  assert.equal(result.selected.inverter.phase, "3P");
  assert.equal(result.selected.battery, null);
});

test("3kW hybrid no battery before/after catalog group check", () => {
  const sel = baseSelections(3, "hybrid", false, "singlePhase");
  const b = calculateQuoteBreakdown(sel);
  assert.ok(b?.matched?.inverter);
  assert.ok(!b.matched.inverter.model.includes("GT-01") || b.matched.inverter.model.includes("EU"));
});

test("5kW hybrid no battery inverter is not on-grid GT model", () => {
  const sel = baseSelections(5, "hybrid", false, "threePhase");
  const b = calculateQuoteBreakdown(sel);
  assert.ok(b?.matched?.inverter);
  assert.ok(b.matched.inverter.model.includes("3P") || b.matched.inverter.model.includes("LV"));
});
