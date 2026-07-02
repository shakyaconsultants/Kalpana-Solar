/**
 * Maps engine result → legacy breakdown shape for PDF/preview (unchanged UI).
 */

function phaseLabel(phaseType) {
  return phaseType === "3P" ? "Three phase" : "Single phase";
}

function marginRateLabel(plantLoadKw, margin, config) {
  const mode = config.margins.mode;
  if (mode === "flatByKw") {
    return `Flat ${margin.toLocaleString("en-IN")}`;
  }
  return `${margin}`;
}

export function engineResultToLegacyBreakdown(result, selections) {
  if (!result?.selected) return null;

  const combo = result.selected;
  const { requirements } = combo;
  const config = result.catalog.pricingConfig;
  const explain = result.explainability;

  if (combo.kit) {
    return {
      finalPrice: combo.finalPrice,
      subtotal: combo.finalPrice ?? 0,
      equipmentSubtotal: combo.equipmentSubtotal,
      servicesSubtotal: 0,
      margin: 0,
      marginRate: 0,
      marginRateLabel: "Included in kit",
      isKit: true,
      isFullyInclusiveKit: combo.isFullyInclusiveKit ?? true,
      kitLabel: combo.kit.label,
      components: combo.components,
      taxes: { inverter: null, battery: null },
      matched: {
        isKit: true,
        kitLabel: combo.kit.label,
        system: {
          plantLoadKw: requirements.plantLoadKw,
          systemType: requirements.systemType,
          floors: requirements.floors,
          panelTier: null,
          panelTierRule: "Tata complete on-grid kit — fully inclusive price",
        },
        panel: {
          company: "Tata",
          isKit: true,
          totalKwp: requirements.plantLoadKw,
          panelCount: null,
          wattPerPanel: null,
          summary: combo.kit.label,
        },
        inverter: null,
        battery: null,
        compatibility: {},
      },
      plantLoadKw: requirements.plantLoadKw,
      systemType: requirements.systemType,
      engine: result.engineMeta,
    };
  }

  const { panel, inverter, battery } = combo;
  const phase = phaseLabel(requirements.phaseType);

  return {
    finalPrice: combo.finalPrice,
    subtotal:
      (combo.equipmentSubtotal ?? 0) +
      (combo.servicesSubtotal ?? 0),
    equipmentSubtotal: combo.equipmentSubtotal ?? 0,
    servicesSubtotal: combo.servicesSubtotal ?? 0,
    margin: combo.margin ?? 0,
    marginRate: 0,
    marginRateLabel: marginRateLabel(requirements.plantLoadKw, combo.margin, config),
    components: combo.components,
    taxes: {
      inverter: {
        rate: inverter.gstRate,
        rateLabel: `${Math.round(inverter.gstRate * 100)}%`,
        amount: inverter.gstAmount ?? 0,
      },
      battery: battery
        ? {
          rate: battery.gstRate,
          rateLabel: `${Math.round(battery.gstRate * 100)}%`,
          amount: battery.gstAmount ?? 0,
        }
        : null,
    },
    matched: {
      system: {
        plantLoadKw: requirements.plantLoadKw,
        systemType: requirements.systemType,
        floors: requirements.floors,
        inverterPhase: phase,
        panelTier: panel.dcrLabel,
        panelTierRule:
          requirements.systemType === "off-grid"
            ? "Off-grid systems use Non-DCR panels"
            : "On-grid & hybrid systems use DCR panels",
      },
      panel: {
        company: panel.company,
        category: panel.category,
        dcr: panel.dcr,
        dcrLabel: panel.dcrLabel,
        wattPerPanel: panel.wattPerPanel,
        wattRangeLabel: panel.wattRangeLabel,
        panelCount: panel.panelCount,
        totalWatts: panel.totalWatts,
        totalKwp: panel.installedCapacityKwp,
        summary: `${panel.panelCount} × ${panel.wattPerPanel}W ${panel.company} (${panel.dcrLabel})`,
      },
      inverter: {
        brand: inverter.brand,
        model: inverter.modelNo,
        capacityKw: inverter.capacityAcKw,
        dcBusVoltage: inverter.dcBusVoltage,
        phase,
        voltageLabel: inverter.dcBusVoltage
          ? `${inverter.dcBusVoltage}V DC bus`
          : "Grid-tied (no battery bus)",
        summary: `${inverter.brand} · ${inverter.capacityAcKw} kW · ${phase}`,
      },
      battery: battery
        ? {
          brand: battery.brand,
          model: battery.size,
          id: battery.id,
          voltage: battery.voltage,
          ah: battery.ah,
          voltageLabel: `${battery.voltage}V / ${battery.ah}Ah`,
          summary: `${battery.brand} ${battery.size}`,
          status: "available",
          compatibilityNote: explain?.selectionReasons?.battery ?? battery.compatibilityNote,
        }
        : requirements.batteryRequired && combo.batteryStatus === "unavailable"
          ? {
            brand: null,
            model: null,
            status: "unavailable",
            summary: combo.batteryWarning,
          }
          : null,
      compatibility: {
        panelToLoad: explain?.selectionReasons?.panel ?? `${panel.panelCount} panels (${panel.installedCapacityKwp} kWp) sized for ${requirements.plantLoadKw} kW load`,
        inverterToLoad:
          explain?.selectionReasons?.inverter ??
          `${inverter.capacityAcKw} kW inverter sized for ${requirements.plantLoadKw} kW plant load (${panel.installedCapacityKwp} kWp panel array)`,
        batteryToInverter: battery
          ? explain?.selectionReasons?.battery ??
          `${battery.voltage}V battery ↔ ${inverter.dcBusVoltage}V inverter — compatible`
          : null,
      },
    },
    plantLoadKw: requirements.plantLoadKw,
    systemType: requirements.systemType,
    warnings: combo.batteryWarning ? [combo.batteryWarning] : [],
    batteryStatus: combo.batteryStatus ?? null,
    engine: result.engineMeta,
  };
}
