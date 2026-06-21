import { test } from "node:test";
import assert from "node:assert/strict";
import {
  quote,
  INVERTER_UNAVAILABLE_ERROR,
  BATTERY_UNAVAILABLE_WARNING,
} from "../../src/engine/index.js";
import { baseSelections } from "./helpers.js";

function assertNoCrossBrand(selected, allowedBrand) {
  if (selected.inverter) {
    assert.equal(selected.inverter.brand, allowedBrand);
  }
  if (selected.battery) {
    assert.equal(selected.battery.brand, allowedBrand);
  }
}

test("Microtek Hybrid 5kW battery yes — Microtek inverter and battery only", () => {
  const sel = {
    ...baseSelections(5, "hybrid", true, "singlePhase"),
    inverterBrand: "Microtek",
  };
  const result = quote(sel);
  assert.ok(result?.selected, result?.error ?? "expected quote");
  assert.equal(result.selected.inverter.brand, "Microtek");
  assert.ok(result.selected.inverter.catalogGroup.startsWith("hybrid"));
  assert.ok(result.selected.battery);
  assert.equal(result.selected.battery.brand, "Microtek");
  assertNoCrossBrand(result.selected, "Microtek");
});

test("Microtek Off-grid 8kW battery yes — quotes with battery unavailable", () => {
  const sel = {
    ...baseSelections(8, "off-grid", true, "singlePhase"),
    inverterBrand: "Microtek",
  };
  const result = quote(sel);
  assert.ok(result?.selected, result?.error ?? "expected quote");
  assert.equal(result.selected.inverter.brand, "Microtek");
  assert.ok(result.selected.inverter.catalogGroup.startsWith("off-grid"));
  assert.equal(result.batteryStatus, "unavailable");
});

test("Invergy Hybrid 5kW — Invergy inverter and battery only", () => {
  const sel = baseSelections(5, "hybrid", true, "threePhase");
  const result = quote(sel);
  assert.ok(result?.selected);
  assert.equal(result.selected.inverter.brand, "Invergy");
  assert.equal(result.selected.battery.brand, "Invergy");
  assert.ok(result.selected.inverter.catalogGroup.startsWith("hybrid"));
});

test("cross-brand leakage — Microtek selection excludes Invergy", () => {
  const sel = {
    ...baseSelections(3, "hybrid", true, "singlePhase"),
    inverterBrand: "Microtek",
  };
  const result = quote(sel);
  assert.ok(result?.selected);
  assertNoCrossBrand(result.selected, "Microtek");
  assert.notEqual(result.selected.inverter.brand, "Invergy");
});

test("cross-brand leakage — Invergy selection excludes Microtek", () => {
  const sel = baseSelections(3, "hybrid", true, "singlePhase");
  const result = quote(sel);
  assert.ok(result?.selected);
  assertNoCrossBrand(result.selected, "Invergy");
  assert.notEqual(result.selected.inverter.brand, "Microtek");
});

test("unknown brand returns inverter unavailable", () => {
  const sel = { ...baseSelections(3, "on-grid", false), inverterBrand: "NonExistentBrand" };
  const result = quote(sel);
  assert.equal(result.error, INVERTER_UNAVAILABLE_ERROR);
});

test("missing inverter brand fails validation", () => {
  const sel = { ...baseSelections(3, "on-grid", false), inverterBrand: null };
  const result = quote(sel);
  assert.equal(result.error, "Invalid quotation selections");
});
