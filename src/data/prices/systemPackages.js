/**
 * Kalpana bundled system packages — reference rate sheet (Sheet2).
 * Total rates include full system; used for calculation cross-check / decomposition later.
 * NOT mixed into panel/inverter/battery price files.
 */

export const SYSTEM_PACKAGES = [
  // ── 2 KW ──
  {
    id: "2kw-bifacial-adani-waaree-invergy",
    plantKw: 2,
    panelCategory: "bifacial",
    panelModel: "540-545",
    panelCompanies: ["adani", "waaree"],
    inverterBrand: "invergy",
    panelCount: 4,
    bundledRate: 95000,
  },
  {
    id: "2kw-topcon-adani-waaree-invergy",
    plantKw: 2,
    panelCategory: "topcon",
    panelModel: "600-620",
    panelCompanies: ["adani", "waaree"],
    inverterBrand: "invergy",
    panelCount: 4,
    bundledRate: 105000,
  },

  // ── 3 KW ──
  {
    id: "3kw-bifacial-adani-waaree-invergy",
    plantKw: 3,
    panelCategory: "bifacial",
    panelModel: "540-545",
    panelCompanies: ["adani", "waaree"],
    inverterBrand: "invergy",
    panelCount: 5,
    bundledRate: 170000,
  },
  {
    id: "3kw-bifacial-585-adani-waaree-invergy",
    plantKw: 3,
    panelCategory: "bifacial",
    panelModel: "585",
    panelCompanies: ["adani", "waaree"],
    inverterBrand: "invergy",
    panelCount: 5,
    bundledRate: 175000,
  },
  {
    id: "3kw-topcon-adani-waaree-invergy",
    plantKw: 3,
    panelCategory: "topcon",
    panelModel: "600-620",
    panelCompanies: ["adani", "waaree"],
    inverterBrand: "invergy",
    panelCount: 5,
    bundledRate: 180000,
  },

  // ── 4 KW ──
  {
    id: "4kw-bifacial-adani-waaree-invergy",
    plantKw: 4,
    panelCategory: "bifacial",
    panelModel: "540-550W",
    panelCompanies: ["adani", "waaree"],
    inverterBrand: "invergy",
    panelCount: 7,
    bundledRate: 215000,
  },
  {
    id: "4kw-topcon-adani-waaree-invergy",
    plantKw: 4,
    panelCategory: "topcon",
    panelModel: "600-620",
    panelCompanies: ["adani", "waaree"],
    inverterBrand: "invergy",
    panelCount: 7,
    bundledRate: 175000,
  },

  // ── 5 KW (updated from latest rate sheet image) ──
  {
    id: "5kw-bifacial-540-545-adani-waaree-invergy",
    plantKw: 5,
    panelCategory: "bifacial",
    panelModel: "540-545",
    panelCompanies: ["adani", "waaree"],
    inverterBrand: "invergy",
    panelCount: 9,
    bundledRate: 330000,
  },
  {
    id: "5kw-topcon-600-620-adani-waaree-invergy",
    plantKw: 5,
    panelCategory: "topcon",
    panelModel: "600-620",
    panelCompanies: ["adani", "waaree"],
    inverterBrand: "invergy",
    panelCount: 9,
    bundledRate: 330000,
  },
  {
    id: "5kw-topcon-560-580-adani-waaree-invergy",
    plantKw: 5,
    panelCategory: "topcon",
    panelModel: "560-580",
    panelCompanies: ["adani", "waaree"],
    inverterBrand: "invergy",
    panelCount: 9,
    bundledRate: 320000,
  },
  {
    id: "5kw-bifacial-555-vikram-invergy",
    plantKw: 5,
    panelCategory: "bifacial",
    panelModel: "555W",
    panelCompanies: ["vikram"],
    inverterBrand: "invergy",
    panelCount: 10,
    bundledRate: 300000,
  },
];

export function findSystemPackage({ plantKw, panelCompany, panelCategory, inverterBrand = "invergy" }) {
  const companyId = panelCompany?.toLowerCase();
  return SYSTEM_PACKAGES.find(
    (p) =>
      p.plantKw === plantKw &&
      p.panelCategory === panelCategory &&
      p.panelCompanies.includes(companyId) &&
      p.inverterBrand === inverterBrand.toLowerCase()
  );
}
