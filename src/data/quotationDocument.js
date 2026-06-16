/**
 * Authentic Kalpana Solar quotation content — sourced from official quotation template.
 */

export const KALPANA_COMPANY = {
  name: "KALPANA SOLAR TRADERS",
  addressLine1: "31, Naubasta Hamirpur Road, Metro Pillar No.111",
  addressLine2: "(Opp. Basant Vihar Police Chowki), Kanpur Nagar — 208021",
  contacts: "Shyam Singh: 9899084349 · Rishi: 8736992133 · Krishna: 8400195212",
  mobile: "9839908349, 8736992133, 8400195212",
  email: "kalpanasolartraders@gmail.com",
  msme: "UDYAM-UP-43-017950",
  gstin: "09BBDPY7262HIZ3",
  hours: "Mon–Sat: 9:00 AM – 7:00 PM",
};

export const KALPANA_BANK = {
  beneficiary: "KALPANA SOLAR TRADERS",
  bankName: "CANRA BANK",
  accountNo: "120038425487",
  ifsc: "CNRB0018744",
};

export const COVER_LETTER = `Dear Sir,

Thank you for choosing KALPANA SOLAR TRADERS to provide the solution for your solar energy system. We have helped numerous home and business owners harness solar energy to power their premises.

As the cost per watt of energy from municipal power grids continues to rise each year, many owners are seeking long-term alternatives to reduce their energy bills. Solar energy is a great alternative to drawing power from the electric grid, and saves substantially in the long run while also benefiting the environment.

In this proposal, we have included details regarding your selected system configuration, bill of materials, commercial offer, and standard terms for supply, installation, testing and commissioning.`;

export const PAYMENT_TERMS = [
  "70% advance with work order.",
  "20% on dispatch of Module, Inverter and Structure.",
  "10% after installation of Structure, Module and Inverter — after successful installation and commissioning.",
  "Implementation will start after receiving the advance payment.",
];

export const PRODUCT_WARRANTY = [
  { product: "Solar Module", period: "25 Years" },
  { product: "Inverter (On System)", period: "10 Years" },
  { product: "Structure", period: "30 Years" },
  { product: "Others", period: "5 Years" },
];

export const STANDARD_TERMS = [
  "Transportation and materials loading and unloading charges are included.",
  "Goods are sent to site in extra quantities so that material does not fall short on site. Balance material will be taken back when work on site is over.",
  "Wi-Fi to be provided by Client for Remote Monitoring System.",
  "Module cleaning will be on Client's scope.",
  "Use of lift would be provided for specific period for moving panels and other equipment on top of the building (if available).",
  "Please note that Grid Tie System works only in case grid power is available.",
  "Smart Meter / Net Meter as per prevailing policy of KESCO Electricity Board would be installed for which we will file the application. Time taken for installation depends on Electricity Board.",
  "The wiring of the solar output will be routed down the side of the wall as discussed with the customer.",
  "Electricity load extension will be client scope.",
  "As per government instructions, the meter can be installed outside the house and the wire from the electric pole to the meter will have to be provided by the customer.",
  "The meter load should be adequate for the plant capacity; if less, the customer will have to increase the load.",
];

/**
 * Standard BOM items always listed (text only — no product images).
 * Key client-specified components (clearly stated):
 *   • Havells / Polycab DC Wire — 4 mm
 *   • Armoured AC Cable — 10 mm
 *   • Earthing Alu-Green Wire — 16 mm (qty 3)
 *   • Earthing Rod — 1 mtr (qty 3)
 */
export const STANDARD_BOM_ITEMS = [
  // ── Mounting structure ──
  { description: "Apollo Structure C-Channel", rating: "140×50", qty: "As per need" },
  { description: "Apollo Base Plate", rating: "140×140", qty: "As per need" },
  { description: "Fastener GI", rating: "—", qty: "As per need" },
  { description: "SS Z Clamp + Spring", rating: "—", qty: "As per need" },
  { description: "SS Mid Clamp + Spring", rating: "—", qty: "As per need" },
  { description: "SS Nut Bolt (Small & Large)", rating: "—", qty: "As per need" },
  { description: "SS Washer", rating: "—", qty: "As per need" },
  { description: "Perlin Safety Cap", rating: "—", qty: "4" },

  // ── Electrical / cabling ──
  { description: "Havells / Polycab DC Wire", rating: "4 mm", qty: "As per need" },
  { description: "Armoured AC Cable", rating: "10 mm", qty: "As per need" },
  { description: "MC4 Connector", rating: "Pair", qty: "As per need" },
  { description: "Havells ACDB", rating: "1 Phase · 1 In 1 Out", qty: "1" },
  { description: "Havells DCDB", rating: "—", qty: "1" },
  { description: "Pin Type Lug", rating: "Copper", qty: "As per need" },
  { description: "Ring Type Lug", rating: "Copper", qty: "As per need" },
  { description: "AKG / Cap PVC Pipe", rating: "25 mm", qty: "As per need" },
  { description: "Flexible Rigid Armoured Pipe", rating: "25 mm", qty: "As per need" },
  { description: "PVC Channel", rating: "45×45", qty: "1" },
  { description: "PVC Saddle", rating: "16 mm", qty: "As per need" },
  { description: "Tie Cable UV", rating: "300 mm", qty: "As per need" },
  { description: "Tape", rating: "—", qty: "As per need" },

  // ── Earthing & safety ──
  { description: "Earthing Alu-Green Wire", rating: "16 mm", qty: "3" },
  { description: "Earthing Rod", rating: "1 mtr", qty: "3" },
  { description: "LA-CB-Heavy with GI Pole", rating: "2 mtr", qty: "1" },
];

export function systemOfferLabel(systemType) {
  if (systemType === "on-grid") return "ON GRID";
  if (systemType === "hybrid") return "HYBRID";
  return "OFF GRID";
}

export function offerSubject(plantLoadKw, systemType) {
  return `${plantLoadKw}-KW PROPOSAL FOR ROOF TOP ${systemOfferLabel(systemType)} POWER PLANT`;
}

export function commercialLineDescription(systemType) {
  const grid = systemOfferLabel(systemType);
  const metering =
    systemType === "off-grid"
      ? "Standalone SPV based Solar Power Plant."
      : "Grid Interactive SPV based Solar Power Plant with net metering.";
  return `Design, Supply, Installation, Testing and Commissioning of ${grid} ${metering}`;
}

export function buildBillOfMaterials(matched, selections) {
  const items = [];
  let sno = 1;

  if (matched?.panel?.isKit) {
    // Tata complete kit — bundled supply line.
    items.push({
      sno: sno++,
      description: matched.kitLabel ?? matched.panel.summary ?? "Tata Solar Kit",
      rating: `${matched.system?.plantLoadKw ?? selections.plantLoadKw} kW`,
      qty: "1",
    });
  } else if (matched?.panel) {
    const tier = matched.panel.dcrLabel ?? "DCR";
    items.push({
      sno: sno++,
      description: `${selections.panelCompany} Solar Module (${tier})`,
      rating: matched.panel.wattRangeLabel
        ? `${matched.panel.wattRangeLabel}`
        : `${matched.panel.wattPerPanel} Wp`,
      qty: String(matched.panel.panelCount),
    });
  }

  if (matched?.inverter) {
    items.push({
      sno: sno++,
      description: `${matched.inverter.brand} Inverter`,
      rating: `${matched.inverter.capacityKw} kW · ${matched.inverter.model}`,
      qty: "1",
    });
  }

  if (matched?.battery) {
    items.push({
      sno: sno++,
      description: `${matched.battery.brand} Lithium Battery`,
      rating: matched.battery.voltageLabel,
      qty: "1",
    });
  }

  for (const row of STANDARD_BOM_ITEMS) {
    items.push({
      sno: sno++,
      description: row.description,
      rating: row.rating,
      qty: row.qty,
    });
  }

  return items;
}

export function formatQuoteDate(date = new Date()) {
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = date.getFullYear();
  return `${d}-${m}-${y}`;
}

export function customerLocation(city) {
  if (!city?.trim()) return "KANPUR (UTTAR PRADESH)";
  return `${city.trim().toUpperCase()} (UTTAR PRADESH)`;
}

export function salutationName(name) {
  if (!name?.trim()) return "Sir/Madam";
  const n = name.trim();
  return n.match(/^(mr|mrs|ms|dr)\./i) ? n.toUpperCase() : `MR/MRS.${n.toUpperCase()}`;
}
