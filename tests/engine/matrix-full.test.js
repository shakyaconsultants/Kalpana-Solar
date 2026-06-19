import { test } from "node:test";
import assert from "node:assert/strict";
import { quote } from "../../src/engine/index.js";
import { buildCombinations } from "../../src/engine/combinationBuilder.js";
import { loadCatalog } from "../../src/engine/catalog/loader.js";
import { selectionsToRequirements } from "../../src/engine/requirements.js";
import { PLANT_LOADS, SYSTEM_TYPES, BATTERY_OPTIONS, baseSelections } from "./helpers.js";

const catalog = loadCatalog();

for (const kw of PLANT_LOADS) {
  for (const sys of SYSTEM_TYPES) {
    for (const bat of BATTERY_OPTIONS) {
      if (sys === "on-grid" && bat) continue;

      test(`${kw}kW ${sys} battery=${bat} produces valid quote`, () => {
        const sel = baseSelections(kw, sys, bat);
        const result = quote(sel);
        assert.ok(result?.selected, `No quote for ${kw}kW ${sys} bat=${bat}`);
        assert.ok(result.selected.finalPrice > 0);
      });
    }
  }
}

test("every matrix cell has at least one combination candidate", () => {
  let empty = 0;
  for (const kw of PLANT_LOADS) {
    for (const sys of SYSTEM_TYPES) {
      for (const bat of BATTERY_OPTIONS) {
        if (sys === "on-grid" && bat) continue;
        const req = selectionsToRequirements(baseSelections(kw, sys, bat));
        const combos = buildCombinations(req, catalog);
        if (!combos.length) empty++;
      }
    }
  }
  assert.equal(empty, 0);
});

test("2kW off-grid with battery succeeds (old engine failed)", () => {
  const result = quote(baseSelections(2, "off-grid", true));
  assert.ok(result?.selected);
});

test("11kW on-grid three-phase succeeds", () => {
  const result = quote(baseSelections(11, "on-grid", false, "threePhase"));
  assert.ok(result?.selected);
});

test("11kW hybrid with battery succeeds", () => {
  const result = quote(baseSelections(11, "hybrid", true, "threePhase"));
  assert.ok(result?.selected);
});
