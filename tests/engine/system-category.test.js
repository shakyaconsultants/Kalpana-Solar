import { test } from "node:test";
import assert from "node:assert/strict";
import { quote } from "../../src/engine/index.js";
import { baseSelections } from "./helpers.js";
import { validateSystemCategorySelection } from "../../src/engine/matchers/inverterMatcher.js";
import { loadCatalog } from "../../src/engine/catalog/loader.js";

const catalog = loadCatalog();
const rules = catalog.compatibilityRules;

function assertHybridCategory(kw, wantsBattery, phase = null) {
  const sel = baseSelections(kw, "hybrid", wantsBattery, phase);
  const result = quote(sel);
  assert.ok(result?.selected?.inverter, `Expected quote for ${kw}kW hybrid battery=${wantsBattery}`);

  const group = result.selected.inverter.catalogGroup;
  assert.ok(
    group.startsWith("hybrid"),
    `Expected hybrid catalog group, got "${group}" for ${kw}kW hybrid battery=${wantsBattery}`
  );

  const validation = validateSystemCategorySelection("hybrid", group, rules);
  assert.equal(validation.result, "PASS");

  return result;
}

test("2kW Hybrid Battery — hybrid catalog only", () => {
  const r = assertHybridCategory(2, true);
  assert.ok(r.selected.battery);
});

test("3kW Hybrid Battery — hybrid catalog only", () => {
  const r = assertHybridCategory(3, true);
  assert.ok(r.selected.battery);
});

test("4kW Hybrid Battery — hybrid catalog only", () => {
  const r = assertHybridCategory(4, true);
  assert.ok(r.selected.battery);
});

test("5kW Hybrid Battery — hybrid catalog only", () => {
  const r = assertHybridCategory(5, true, "threePhase");
  assert.ok(r.selected.battery);
  assert.equal(r.selected.inverter.phase, "3P");
});

test("3kW Hybrid No Battery — hybrid catalog only", () => {
  const r = assertHybridCategory(3, false, "singlePhase");
  assert.equal(r.selected.battery, null);
});

test("5kW Hybrid No Battery — hybrid catalog only", () => {
  const r = assertHybridCategory(5, false, "threePhase");
  assert.equal(r.selected.battery, null);
});

test("on-grid never selects hybrid or off-grid catalog group", () => {
  for (const kw of [2, 3, 5, 8]) {
    const phase = kw >= 5 ? "threePhase" : "singlePhase";
    const result = quote(baseSelections(kw, "on-grid", false, phase));
    const group = result.selected.inverter.catalogGroup;
    assert.ok(group.startsWith("on-grid"), `${kw}kW on-grid got ${group}`);
    assert.equal(validateSystemCategorySelection("on-grid", group, rules).result, "PASS");
  }
});

test("off-grid never selects hybrid or on-grid catalog group", () => {
  for (const kw of [2, 3, 5, 8]) {
    for (const bat of [false, true]) {
      const result = quote(baseSelections(kw, "off-grid", bat));
      const group = result.selected.inverter.catalogGroup;
      assert.ok(group.startsWith("off-grid"), `${kw}kW off-grid bat=${bat} got ${group}`);
      assert.equal(validateSystemCategorySelection("off-grid", group, rules).result, "PASS");
    }
  }
});

test("hybrid with battery never selects off-grid-ogh", () => {
  for (const kw of [2, 3, 4, 5]) {
    const phase = kw >= 5 ? "threePhase" : "singlePhase";
    const result = quote(baseSelections(kw, "hybrid", true, phase));
    assert.ok(!result.selected.inverter.catalogGroup.startsWith("off-grid"));
  }
});

test("hybrid with battery never selects on-grid-string", () => {
  for (const kw of [2, 3, 4, 5]) {
    const phase = kw >= 5 ? "threePhase" : "singlePhase";
    const result = quote(baseSelections(kw, "hybrid", true, phase));
    assert.ok(!result.selected.inverter.catalogGroup.startsWith("on-grid"));
  }
});
