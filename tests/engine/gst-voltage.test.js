import { test } from "node:test";
import assert from "node:assert/strict";
import { quote } from "../../src/engine/index.js";
import { baseSelections } from "./helpers.js";

test("panel GST: cost >= exGst", () => {
  const result = quote(baseSelections(3, "on-grid", false));
  const p = result.selected.panel;
  assert.ok(p.cost >= p.exGst);
  assert.ok(p.gstAmount >= 0);
});

test("inverter GST inclusive list price splits correctly", () => {
  const result = quote(baseSelections(3, "on-grid", false));
  const inv = result.selected.inverter;
  assert.ok(inv.cost >= inv.exGst);
});

test("battery GST when present", () => {
  const result = quote(baseSelections(3, "hybrid", true));
  const bat = result.selected.battery;
  assert.ok(bat.cost >= bat.exGst);
});

test("24V battery pairs with 24V hybrid inverter", () => {
  const result = quote(baseSelections(3, "hybrid", true));
  if (result.selected.inverter.dcBusVoltage === 24) {
    assert.ok(result.selected.battery.compatibleDcVoltages.some((v) => Math.abs(v - 24) <= 1.5));
  }
});

test("48V battery pairs with 48V off-grid inverter", () => {
  const result = quote(baseSelections(5, "off-grid", true));
  const invV = result.selected.inverter.dcBusVoltage;
  const bat = result.selected.battery;
  assert.ok(bat.compatibleDcVoltages.some((v) => Math.abs(v - invV) <= 1.5));
});

test("5kW three-phase hybrid battery uses 48V wall mount", () => {
  const result = quote(baseSelections(5, "hybrid", true, "threePhase"));
  assert.equal(result.selected.inverter.dcBusVoltage, 48);
  assert.ok(result.selected.battery.capacityKwh >= 5);
});

test("DC oversizing cap enforced at 1.5x", () => {
  const result = quote(baseSelections(3, "on-grid", false));
  const panelKwp = result.selected.panel.installedCapacityKwp;
  const invKw = result.selected.inverter.capacityAcKw;
  assert.ok(panelKwp <= invKw * 1.5 + 0.01);
});

test("off-grid uses non-DCR 630W panels", () => {
  const result = quote(baseSelections(5, "off-grid", true));
  assert.equal(result.selected.panel.dcr, false);
  assert.equal(result.selected.panel.wattPerPanel, 630);
});

test("on-grid uses DCR panels", () => {
  const result = quote(baseSelections(3, "on-grid", false));
  assert.equal(result.selected.panel.dcr, true);
});
