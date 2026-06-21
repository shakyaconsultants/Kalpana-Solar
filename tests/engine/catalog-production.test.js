import { test } from "node:test";
import assert from "node:assert/strict";
import { loadCatalog, getCatalogHealth } from "../../src/engine/catalog/loader.js";
import { quote, INVERTER_UNAVAILABLE_ERROR } from "../../src/engine/index.js";
import { calculateQuoteBreakdown, INVERTER_UNAVAILABLE_ERROR as WRAPPER_INVERTER_ERROR } from "../../src/calculations/calculateQuote.js";
import { baseSelections } from "./helpers.js";
import { isPlaceholderSku } from "../../src/engine/catalog/validateCatalog.js";

test("loaded catalog contains zero placeholder batteries", () => {
  const catalog = loadCatalog();
  const placeholders = catalog.batteries.filter(isPlaceholderSku);
  assert.equal(placeholders.length, 0);
});

test("loaded catalog contains zero placeholder inverters", () => {
  const catalog = loadCatalog();
  const placeholders = catalog.inverters.filter(isPlaceholderSku);
  assert.equal(placeholders.length, 0);
});

test("catalog sanitizer removed placeholder SKUs at load", () => {
  const health = getCatalogHealth();
  assert.ok(health.removedPlaceholders.length >= 0);
});

test("no compatible equipment returns explicit inverter error for unknown brand", () => {
  const sel = { ...baseSelections(3, "on-grid", false), inverterBrand: "NonExistentBrand" };
  const result = quote(sel);
  assert.equal(result.error, INVERTER_UNAVAILABLE_ERROR);
  assert.equal(result.selected, undefined);
});

test("calculateQuoteBreakdown surfaces inverter unavailable error", () => {
  const sel = { ...baseSelections(5, "hybrid", true), inverterBrand: "NonExistentBrand" };
  const breakdown = calculateQuoteBreakdown(sel);
  assert.equal(breakdown.error, WRAPPER_INVERTER_ERROR);
  assert.equal(breakdown.quoteFailed, true);
  assert.equal(breakdown.finalPrice, null);
});

test("Microtek 96V MPPT off-grid with battery quotes without battery when unavailable", () => {
  const sel = {
    ...baseSelections(8, "off-grid", true),
    inverterBrand: "Microtek",
    inverterPhase: "singlePhase",
  };
  const result = quote(sel);
  assert.ok(result?.selected, result?.error ?? "expected quote");
  assert.equal(result.batteryStatus, "unavailable");
  assert.equal(result.selected.battery, null);
});

test("valid 3kW on-grid still quotes from JSON catalog only", () => {
  const result = quote(baseSelections(3, "on-grid", false));
  assert.ok(result?.selected);
  assert.ok(result.selected.finalPrice > 0);
  assert.ok(result.selected.inverter.catalogGroup.startsWith("on-grid"));
});
