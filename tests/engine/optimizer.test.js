import { test } from "node:test";
import assert from "node:assert/strict";
import { optimizeCombinations } from "../../src/engine/optimizer.js";

function combo(finalPrice, businessScore) {
  return { finalPrice, businessScore, panel: {}, inverter: {}, battery: null };
}

test("optimizer picks lowest price regardless of business score", () => {
  const { selected } = optimizeCombinations([
    combo(297209, 5),
    combo(281564, 108),
    combo(290199, 108),
  ]);
  assert.equal(selected.finalPrice, 281564);
});

test("optimizer uses business score only as tiebreaker", () => {
  const { selected } = optimizeCombinations([
    combo(100000, 50),
    combo(100000, 10),
    combo(120000, 1),
  ]);
  assert.equal(selected.finalPrice, 100000);
  assert.equal(selected.businessScore, 10);
});

test("optimizer returns null selected for empty input", () => {
  const { selected, alternatives } = optimizeCombinations([]);
  assert.equal(selected, null);
  assert.deepEqual(alternatives, []);
});

test("optimizer limits alternatives", () => {
  const combos = Array.from({ length: 10 }, (_, i) => combo(100000 + i * 1000, i));
  const { alternatives } = optimizeCombinations(combos, 3);
  assert.equal(alternatives.length, 3);
});
