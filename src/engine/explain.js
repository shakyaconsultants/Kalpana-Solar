/**
 * Explainability for every quotation.
 */

export function buildExplanation(combination) {
  if (!combination) return null;

  const { panel, inverter, battery, kit, requirements, serviceComponents, margin, finalPrice } =
    combination;

  const compatibilityChecks = [];

  if (kit) {
    compatibilityChecks.push(
      `Tata kit fully inclusive for ${requirements.plantLoadKw} kW ${requirements.systemType} — no add-on services or margin`
    );
    return {
      selectedComponents: { kit },
      compatibilityChecks,
      pricingBreakdown: {
        equipment: combination.equipmentSubtotal,
        services: 0,
        margin: 0,
        final: finalPrice,
        components: combination.components,
      },
      selectionReasons: {
        panel: kit.label,
        inverter: "Included in kit",
        battery: "Not applicable",
        overall: `Tata kit price is final — fully inclusive (₹${finalPrice.toLocaleString("en-IN")})`,
      },
    };
  }

  compatibilityChecks.push(
    `${panel.company} ${panel.wattPerPanel}W × ${panel.panelCount} = ${panel.installedCapacityKwp} kWp`,
    `${inverter.brand} ${inverter.modelNo} — ${inverter.capacityAcKw} kW AC, DC bus ${inverter.dcBusVoltage ?? "N/A"} V`,
    inverter.compatibilityNote
  );

  if (requirements.batteryRequired && battery) {
    compatibilityChecks.push(
      `${battery.brand} ${battery.modelNo} — ${battery.capacityKwh} kWh`,
      battery.compatibilityNote
    );
  } else if (!requirements.batteryRequired) {
    compatibilityChecks.push("No battery required for this system configuration");
  }

  return {
    selectedComponents: { panel, inverter, battery },
    compatibilityChecks,
    pricingBreakdown: {
      equipment: combination.equipmentSubtotal,
      services: combination.servicesSubtotal,
      serviceLineItems: serviceComponents,
      margin,
      final: finalPrice,
      components: combination.components,
    },
    selectionReasons: {
      panel: `${panel.company} ${panel.wattPerPanel}W — ${panel.panelCount} panels (${panel.installedCapacityKwp} kWp), ${panel.dcrLabel}`,
      inverter: `${inverter.brand} ${inverter.modelNo} — meets ${requirements.plantLoadKw} kW load with ${inverter.maxDcOversizingRatio ?? 1.5}× DC oversizing (group: ${inverter.catalogGroup})`,
      battery: battery
        ? `${battery.brand} ${battery.size} — ${battery.capacityKwh} kWh matched to ${inverter.dcBusVoltage} V bus`
        : "No battery",
      overall: `Lowest final price among compatible combinations (₹${finalPrice.toLocaleString("en-IN")}; tiebreaker score ${combination.businessScore})`,
    },
  };
}
