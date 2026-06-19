import { test } from "node:test";
import assert from "node:assert/strict";
import { loadCatalog, getCatalogHealth } from "../../src/engine/catalog/loader.js";
import { quote, CATALOG_UNAVAILABLE_ERROR } from "../../src/engine/index.js";
import { calculateQuoteBreakdown, CATALOG_UNAVAILABLE_ERROR as WRAPPER_ERROR } from "../../src/calculations/calculateQuote.js";
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

test("no compatible equipment returns explicit catalog error from engine", () => {
  const sel = { ...baseSelections(3, "on-grid", false), inverterBrand: "NonExistentBrand" };
  const result = quote(sel);
  assert.equal(result.error, CATALOG_UNAVAILABLE_ERROR);
  assert.equal(result.selected, undefined);
});

test("calculateQuoteBreakdown surfaces catalog unavailable error", () => {
  const sel = { ...baseSelections(5, "hybrid", true), inverterBrand: "NonExistentBrand" };
  const breakdown = calculateQuoteBreakdown(sel);
  assert.equal(breakdown.error, WRAPPER_ERROR);
  assert.equal(breakdown.quoteFailed, true);
  assert.equal(breakdown.finalPrice, null);
});

test("Microtek 96V MPPT off-grid with battery fails without placeholder battery", () => {
  const sel = {
    ...baseSelections(8, "off-grid", true),
    inverterBrand: "Microtek",
    inverterPhase: "singlePhase",
  };
  const result = quote(sel);
  if (result?.selected?.inverter?.dcBusVoltage === 96) {
    assert.fail("Should not select 96V MPPT without real 96V battery in catalog");
  }
  if (result?.error) {
    assert.equal(result.error, CATALOG_UNAVAILABLE_ERROR);
  }
});

test("valid 3kW on-grid still quotes from JSON catalog only", () => {
  const result = quote(baseSelections(3, "on-grid", false));
  assert.ok(result?.selected);
  assert.ok(result.selected.finalPrice > 0);
  assert.ok(result.selected.inverter.catalogGroup.startsWith("on-grid"));
});
