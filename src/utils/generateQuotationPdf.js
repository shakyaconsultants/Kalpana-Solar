import { jsPDF } from "jspdf";
import logoUrl from "../assets/kalpanalogo.PNG";
import { formatINRForPdf } from "../data/formatCurrency.js";
import {
  SYSTEM_TYPES,
  PANEL_CATEGORIES,
  formatPlantLoad,
  formatFloors,
  systemNeedsWiring,
} from "../data/quotationOptions.js";

const COMPANY = {
  name: "Kalpana Solar Traders",
  tagline: "Complete Rooftop Solar Solutions",
  email: "kalpanasolartradersinfo@gmail.com",
  phone: "8736992133",
  hours: "Mon–Sat: 9:00 AM – 7:00 PM",
};

const BRAND = {
  orange: [234, 88, 12],
  orangeLight: [255, 247, 237],
  dark: [12, 18, 34],
  slate: [100, 116, 139],
  text: [15, 23, 42],
  border: [226, 232, 240],
  white: [255, 255, 255],
};

const FOOTER_HEIGHT = 18;

async function loadLogoDataUrl() {
  const response = await fetch(logoUrl);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export function createQuoteReference() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const r = String(Math.floor(Math.random() * 9000) + 1000);
  return `KS-${y}${m}${day}-${r}`;
}

function formatDate() {
  return new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function systemLabel(systemType) {
  return SYSTEM_TYPES.find((s) => s.id === systemType)?.label ?? systemType;
}

function panelCategoryLabel(category) {
  return PANEL_CATEGORIES.find((c) => c.id === category)?.label ?? category;
}

function batteryLabel(selections) {
  if (selections.systemType === "on-grid") return "Not included";
  if (selections.wantsBattery == null) return "—";
  if (!selections.wantsBattery) return "Not included";
  return selections.batteryBrand ?? "Included";
}

function footerTop(doc) {
  return doc.internal.pageSize.getHeight() - FOOTER_HEIGHT;
}

function drawSectionHeader(doc, x, y, width, title, accent = false) {
  const h = 10;
  const fill = accent ? BRAND.orangeLight : [248, 250, 252];
  doc.setFillColor(...fill);
  doc.roundedRect(x, y, width, h, 2, 2, "F");
  doc.setFillColor(...BRAND.orange);
  doc.rect(x, y + 2, 2.5, 6, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...BRAND.orange);
  doc.text(title, x + 6, y + 6.5);
  return y + h + 2;
}

function drawDetailRow(doc, x, y, width, label, value, rowMinH, shaded = false) {
  if (shaded) {
    doc.setFillColor(252, 252, 253);
    doc.rect(x, y - 5, width, rowMinH, "F");
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...BRAND.slate);
  doc.text(label, x + 3, y);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...BRAND.text);
  const valueWidth = width * 0.52;
  const lines = doc.splitTextToSize(String(value), valueWidth);
  doc.text(lines, x + width - valueWidth, y);

  return y + Math.max(rowMinH, lines.length * 4.2);
}

function drawColumnBlock(doc, x, y, width, height, title, rows, rowMinH, accent = false) {
  doc.setDrawColor(...BRAND.border);
  doc.setLineWidth(0.35);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(x, y, width, height, 2.5, 2.5, "FD");

  const headerEnd = drawSectionHeader(doc, x + 3, y + 4, width - 6, title, accent);
  const bodyHeight = y + height - headerEnd - 4;
  const rowSlot = rows.length > 0 ? bodyHeight / rows.length : rowMinH;

  let cy = headerEnd;
  rows.forEach(([label, value], i) => {
    cy = drawDetailRow(doc, x + 3, cy, width - 6, label, value, Math.max(rowMinH, rowSlot - 1), i % 2 === 0);
  });

  return y + height;
}

function drawFooter(doc, margin, pageWidth) {
  const top = footerTop(doc);

  doc.setFillColor(...BRAND.dark);
  doc.rect(0, top, pageWidth, FOOTER_HEIGHT, "F");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(180, 190, 210);
  doc.text(`${COMPANY.name}  |  ${COMPANY.phone}  |  ${COMPANY.email}`, margin, top + 6);
  doc.text(COMPANY.hours, margin, top + 12);
  doc.text("Quotation valid subject to site survey", pageWidth - margin, top + 9, { align: "right" });
}

export async function buildQuotationPdf({ selections, breakdown, quoteRef = createQuoteReference() }) {
  if (!breakdown?.finalPrice || !selections) {
    throw new Error("Invalid quote data");
  }

  const { matched, finalPrice, taxes } = breakdown;
  const hasBattery = !!taxes?.battery;
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const margin = 14;
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - margin * 2;
  const gap = 8;
  const colWidth = (contentWidth - gap) / 2;
  const leftX = margin;
  const rightX = margin + colWidth + gap;

  doc.setFillColor(...BRAND.orange);
  doc.rect(0, 0, pageWidth, 3, "F");

  const logoData = await loadLogoDataUrl();
  const headerY = 10;
  const logoH = 22;

  doc.setFillColor(...BRAND.white);
  doc.roundedRect(margin, headerY, 48, logoH, 2, 2, "F");
  doc.addImage(logoData, "PNG", margin + 2, headerY + 1, 44, logoH - 2);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...BRAND.orange);
  doc.text(COMPANY.name, pageWidth - margin, headerY + 7, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...BRAND.slate);
  doc.text(COMPANY.tagline, pageWidth - margin, headerY + 12, { align: "right" });
  doc.text(`${COMPANY.phone}  ·  ${COMPANY.email}`, pageWidth - margin, headerY + 17, { align: "right" });

  let y = headerY + logoH + 10;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(...BRAND.text);
  doc.text("Solar System Quotation", margin, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...BRAND.slate);
  doc.text("Indicative estimate based on your selected configuration", margin, y + 6);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(formatDate(), margin, y + 12);
  doc.text(`Ref: ${quoteRef}`, pageWidth - margin, y + 12, { align: "right" });

  y += 18;
  doc.setDrawColor(...BRAND.border);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  const PRICE_HEIGHT = hasBattery ? 50 : 44;
  const TERMS_HEIGHT = 48;
  const SECTION_GAP = 10;

  const configRows = [
    ["Plant load", formatPlantLoad(selections.plantLoadKw)],
    ["Installation type", selections.installationType],
    ["System type", systemLabel(selections.systemType)],
  ];

  if (systemNeedsWiring(selections.systemType) && selections.floors) {
    configRows.push(["Building floors", formatFloors(selections.floors)]);
  }

  configRows.push(
    ["Panel brand", selections.panelCompany],
    ["Panel type", panelCategoryLabel(selections.panelCategory)],
    ["Inverter brand", selections.inverterBrand],
    ["Battery", batteryLabel(selections)]
  );

  const specRows = matched
    ? [
        ["Solar panels", matched.panel?.summary ?? "—"],
        ["Total DC capacity", matched.panel ? `${matched.panel.totalKwp} kWp` : "—"],
        ["Panel tier", matched.panel?.dcrLabel ?? "—"],
        ["Inverter", matched.inverter?.summary ?? "—"],
        ["Inverter model", matched.inverter?.model ?? "—"],
        ...(matched.battery
          ? [
              ["Battery", matched.battery.summary],
              ["Battery specification", matched.battery.voltageLabel],
            ]
          : []),
      ]
    : [["Specification", "—"]];

  const maxRows = Math.max(configRows.length, specRows.length);
  const rowMinH = 8;
  const colHeight =
    footerTop(doc) - 10 - TERMS_HEIGHT - PRICE_HEIGHT - SECTION_GAP * 2 - y;
  const minColHeight = 14 + maxRows * (rowMinH + 1) + 6;
  const finalColHeight = Math.max(colHeight, minColHeight);

  drawColumnBlock(doc, leftX, y, colWidth, finalColHeight, "Your configuration", configRows, rowMinH);
  drawColumnBlock(
    doc,
    rightX,
    y,
    colWidth,
    finalColHeight,
    "Recommended specification",
    specRows,
    rowMinH,
    true
  );

  y += finalColHeight + SECTION_GAP;

  const priceH = PRICE_HEIGHT;
  doc.setFillColor(...BRAND.dark);
  doc.roundedRect(margin, y, contentWidth, priceH, 3, 3, "F");
  doc.setFillColor(...BRAND.orange);
  doc.rect(margin, y + 4, contentWidth, 1.2, "F");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(180, 190, 210);
  doc.text("Estimated final price", margin + 8, y + 13);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(...BRAND.white);
  doc.text(formatINRForPdf(finalPrice), margin + 8, y + 26, { charSpace: 0 });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(160, 170, 190);
  const invGstText = `Inverter GST (${taxes?.inverter?.rateLabel ?? "5%"}): ${formatINRForPdf(taxes?.inverter?.amount ?? 0)}`;
  if (hasBattery) {
    doc.text(invGstText, margin + 8, y + priceH - 8);
    doc.text(
      `Battery GST (${taxes.battery.rateLabel}): ${formatINRForPdf(taxes.battery.amount)}`,
      margin + contentWidth / 2,
      y + priceH - 8
    );
  } else {
    doc.text(invGstText, margin + 8, y + priceH - 8);
  }

  doc.setFontSize(8.5);
  doc.text("All taxes included in final price", pageWidth - margin - 8, y + 26, { align: "right" });

  y += priceH + SECTION_GAP;

  const termsBottom = footerTop(doc) - 10;
  y = drawSectionHeader(doc, margin, y, contentWidth, "Terms & notes");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...BRAND.slate);
  const notes = [
    "This quotation is indicative and based on the configuration selected above.",
    "Final pricing is confirmed after a free site survey (structure, shading, and net metering).",
    "Inverter is taxed at 5% GST; battery at 18% GST — both included in the estimated final price.",
    "Subsidy eligibility, if applicable, is subject to current government scheme rules.",
  ];

  const notesArea = termsBottom - y;
  const lineGap = notesArea / notes.length;
  for (const note of notes) {
    const lines = doc.splitTextToSize(`•  ${note}`, contentWidth - 6);
    doc.text(lines, margin + 3, y);
    y += Math.max(lineGap, lines.length * 4.5 + 2);
  }

  drawFooter(doc, margin, pageWidth);

  const filename = `Kalpana-Solar-Quote-${selections.plantLoadKw}kW-${quoteRef}.pdf`;
  return { doc, filename, quoteRef };
}

export async function previewQuotationPdf({ selections, breakdown }) {
  const { doc, filename, quoteRef } = await buildQuotationPdf({ selections, breakdown });
  const blob = doc.output("blob");
  const url = URL.createObjectURL(blob);

  const previewWindow = window.open(url, "_blank", "noopener,noreferrer");

  if (!previewWindow) {
    URL.revokeObjectURL(url);
    const err = new Error("Unable to generate PDF.");
    err.code = "POPUP_BLOCKED";
    throw err;
  }

  try {
    previewWindow.document.title = filename;
  } catch {
    /* viewer may block title access */
  }

  setTimeout(() => URL.revokeObjectURL(url), 120_000);

  return { quoteRef };
}

export async function downloadQuotationPdf(params) {
  const { doc, filename } = await buildQuotationPdf(params);
  doc.save(filename);
}
