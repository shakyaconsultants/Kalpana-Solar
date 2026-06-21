import { test } from "node:test";
import assert from "node:assert/strict";
import { optimizeCombinations } from "../../src/engine/optimizer.js";

function combo(finalPrice, capacityKw, plantLoadKw = 7) {
  return {
    finalPrice,
    requirements: { plantLoadKw },
    inverter: { capacityAcKw: capacityKw },
    panel: {},
    battery: null,
  };
}

test("optimizer picks smallest sufficient capacity then lowest price", () => {
  const { selected } = optimizeCombinations([
    combo(400000, 10),
    combo(350000, 8),
    combo(360000, 8),
  ]);
  assert.equal(selected.inverter.capacityAcKw, 8);
  assert.equal(selected.finalPrice, 350000);
});

test("optimizer ignores cheaper oversized inverter", () => {
  const { selected } = optimizeCombinations([
    combo(300000, 10),
    combo(400000, 8),
  ]);
  assert.equal(selected.inverter.capacityAcKw, 8);
  assert.equal(selected.finalPrice, 400000);
});

test("optimizer returns null selected for empty input", () => {
  const { selected, alternatives } = optimizeCombinations([]);
  assert.equal(selected, null);
  assert.deepEqual(alternatives, []);
});

test("optimizer limits alternatives", () => {
  const combos = Array.from({ length: 10 }, (_, i) => combo(100000 + i * 1000, 8));
  const { alternatives } = optimizeCombinations(combos, 3);
  assert.equal(alternatives.length, 3);
});
