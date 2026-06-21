/**
 * Normalize legacy UI selections into engine requirements.
 */

export function phaseToCatalog(phaseType) {
  if (phaseType === "threePhase" || phaseType === "3P") return "3P";
  return "1P";
}

export function selectionsToRequirements(selections) {
  const {
    plantLoadKw,
    systemType,
    installationType,
    floors,
    wantsBattery,
    panelCompany,
    panelWatt,
    inverterBrand,
    inverterPhase,
  } = selections;

  const batteryRequired = systemType === "on-grid" ? false : wantsBattery === true;
  const batteryAnswered = systemType === "on-grid" || wantsBattery != null;

  return {
    plantLoadKw,
    systemType,
    installationType,
    phaseType: phaseToCatalog(inverterPhase ?? "singlePhase"),
    batteryRequired,
    batteryAnswered,
    floors: floors ?? null,
    filters: {
      panelCompany: panelCompany || null,
      panelWattId: panelWatt != null ? Number(panelWatt) : null,
      inverterBrand: inverterBrand || null,
      kitBrand: panelCompany === "Tata" ? "Tata" : null,
    },
  };
}

export function validateRequirements(req, config) {
  const min = config.businessRules.plantLoadMinKw ?? 2;
  const max = config.businessRules.plantLoadMaxKw ?? 11;

  if (!req.plantLoadKw || req.plantLoadKw < min || req.plantLoadKw > max) return false;
  if (!req.systemType || !req.installationType) return false;

  const needsWiring = config.businessRules.systemsRequiringWiring?.includes(req.systemType);
  if (needsWiring && !req.floors) return false;

  if ((req.systemType === "hybrid" || req.systemType === "off-grid") && !req.batteryAnswered) {
    return false;
  }

  if (req.filters.kitBrand === "Tata") {
    return req.systemType === "on-grid" && [3, 4].includes(req.plantLoadKw);
  }

  if (!req.filters.panelCompany) return false;
  if (req.filters.panelWattId == null && req.filters.kitBrand !== "Tata") return false;

  if (req.filters.kitBrand !== "Tata" && !req.filters.inverterBrand) {
    return false;
  }

  const phaseThreshold = config.businessRules.phaseThresholdKw ?? 5;
  if (
    req.plantLoadKw >= phaseThreshold &&
    (req.systemType === "on-grid" || req.systemType === "hybrid") &&
    req.filters.kitBrand !== "Tata" &&
    !req.phaseType
  ) {
    return false;
  }

  return true;
}
