/**
 * Build all valid panel + inverter + battery combinations.
 */

import { generatePanelCandidates } from "./matchers/panelMatcher.js";
import { generateInverterCandidates } from "./matchers/inverterMatcher.js";
import { generateBatteryCandidates, rankBatteries } from "./matchers/batteryMatcher.js";
import { calculateCombinationCost } from "./costCalculator.js";
import { BATTERY_UNAVAILABLE_WARNING } from "./errors.js";

export function findKit(requirements, catalog) {
  const { plantLoadKw, systemType, filters } = requirements;
  if (filters.kitBrand !== catalog.kitBrand) return null;

  return (
    catalog.kits.find(
      (k) =>
        k.approved &&
        k.systemTypes.includes(systemType) &&
        k.plantLoadKw.includes(plantLoadKw)
    ) ?? null
  );
}

export function buildCombinations(requirements, catalog) {
  const kit = findKit(requirements, catalog);
  if (kit) {
    const priced = calculateCombinationCost({
      requirements,
      panel: null,
      inverter: null,
      battery: null,
      kit,
      catalog,
    });
    return [priced];
  }

  const panels = generatePanelCandidates(requirements, catalog);
  const combinations = [];

  for (const panel of panels) {
    const inverters = generateInverterCandidates(requirements, panel, catalog);

    for (const inverter of inverters) {
      const batteries = generateBatteryCandidates(inverter, requirements, catalog);

      let batteryOptions;
      if (!requirements.batteryRequired) {
        batteryOptions = [{ battery: null, batteryStatus: null, batteryWarning: null }];
      } else if (batteries.length === 0) {
        batteryOptions = [
          {
            battery: null,
            batteryStatus: "unavailable",
            batteryWarning: BATTERY_UNAVAILABLE_WARNING,
          },
        ];
      } else {
        batteryOptions = rankBatteries(batteries).map((battery) => ({
          battery,
          batteryStatus: "available",
          batteryWarning: null,
        }));
      }

      for (const { battery, batteryStatus, batteryWarning } of batteryOptions) {
        combinations.push(
          calculateCombinationCost({
            requirements,
            panel,
            inverter,
            battery,
            kit: null,
            catalog,
            batteryStatus,
            batteryWarning,
          })
        );
      }
    }
  }

  return combinations;
}
