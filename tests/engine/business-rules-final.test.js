import { test } from "node:test";
import assert from "node:assert/strict";
import {
  quote,
  INVERTER_UNAVAILABLE_ERROR,
  BATTERY_UNAVAILABLE_WARNING,
} from "../../src/engine/index.js";
import { baseSelections } from "./helpers.js";
import { matchesInvergyOffGridFamily } from "../../src/engine/matchers/inverterMatcher.js";
import { loadCatalog } from "../../src/engine/catalog/loader.js";

const catalog = loadCatalog();
const pricingConfig = catalog.pricingConfig;

test("5kW Invergy off-grid selects OG family", () => {
  const result = quote(baseSelections(5, "off-grid", true));
  assert.ok(result?.selected);
  assert.equal(result.selected.inverter.catalogGroup, "off-grid-og");
});

test("6kW Invergy off-grid selects OG family", () => {
  const result = quote(baseSelections(6, "off-grid", true));
  assert.ok(result?.selected);
  assert.equal(result.selected.inverter.catalogGroup, "off-grid-og");
});

test("7kW Invergy off-grid selects OGH family", () => {
  const result = quote(baseSelections(7, "off-grid", false));
  assert.ok(result?.selected);
  assert.equal(result.selected.inverter.catalogGroup, "off-grid-ogh");
  assert.equal(result.selected.inverter.capacityAcKw, 8);
});

test("8kW Invergy off-grid selects OGH family at 8kW capacity", () => {
  const result = quote(baseSelections(8, "off-grid", false));
  assert.ok(result?.selected);
  assert.equal(result.selected.inverter.catalogGroup, "off-grid-ogh");
  assert.equal(result.selected.inverter.capacityAcKw, 8);
});

test("7kW requirement selects 8kW not 10kW when 8kW is cheaper path exists", () => {
  const result = quote(baseSelections(7, "off-grid", false));
  assert.ok(result?.selected);
  assert.ok(result.selected.inverter.capacityAcKw < 10);
  assert.equal(result.selected.inverter.capacityAcKw, 8);
});

test("battery unavailable still generates quotation", () => {
  const sel = {
    ...baseSelections(8, "off-grid", true),
    inverterBrand: "Microtek",
    inverterPhase: "singlePhase",
  };
  const result = quote(sel);
  assert.ok(result?.selected, result?.error ?? "expected quote");
  assert.equal(result.selected.battery, null);
  assert.equal(result.batteryStatus, "unavailable");
  assert.ok(result.warnings.includes(BATTERY_UNAVAILABLE_WARNING));
  assert.equal(result.selected.components.battery, 0);
});

test("wrong brand blocked — unknown brand returns inverter unavailable", () => {
  const sel = { ...baseSelections(3, "on-grid", false), inverterBrand: "NonExistentBrand" };
  const result = quote(sel);
  assert.equal(result.error, INVERTER_UNAVAILABLE_ERROR);
});

test("cross-category blocked — hybrid never selects off-grid group", () => {
  const result = quote(baseSelections(3, "hybrid", true, "singlePhase"));
  assert.ok(result?.selected);
  assert.ok(result.selected.inverter.catalogGroup.startsWith("hybrid"));
  assert.ok(!result.selected.inverter.catalogGroup.startsWith("off-grid"));
});

test("Invergy off-grid family rule helper", () => {
  const og = { brand: "Invergy", catalogGroup: "off-grid-og" };
  const ogh = { brand: "Invergy", catalogGroup: "off-grid-ogh" };
  assert.equal(matchesInvergyOffGridFamily(og, 5, pricingConfig), true);
  assert.equal(matchesInvergyOffGridFamily(ogh, 5, pricingConfig), false);
  assert.equal(matchesInvergyOffGridFamily(og, 7, pricingConfig), false);
  assert.equal(matchesInvergyOffGridFamily(ogh, 7, pricingConfig), true);
});
