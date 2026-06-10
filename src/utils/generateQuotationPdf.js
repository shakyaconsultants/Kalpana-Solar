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

function quoteRef() {
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

function drawRow(doc, y, label, value, margin, contentWidth) {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(label, margin, y);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 41, 59);
  const lines = doc.splitTextToSize(String(value), contentWidth * 0.55);
  doc.text(lines, margin + contentWidth * 0.42, y);
  return y + Math.max(7, lines.length * 5);
}

/**
 * Generate and download a customer-facing quotation PDF (final price only).
 */
export async function downloadQuotationPdf({ selections, breakdown }) {
  if (!breakdown?.finalPrice || !selections) return;

  const { matched, finalPrice } = breakdown;
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const margin = 18;
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const logoData = await loadLogoDataUrl();
  doc.addImage(logoData, "PNG", margin, y, 42, 18);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(234, 88, 12);
  doc.text(COMPANY.name, pageWidth - margin, y + 5, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(COMPANY.tagline, pageWidth - margin, y + 11, { align: "right" });
  doc.text(COMPANY.phone, pageWidth - margin, y + 16, { align: "right" });
  doc.text(COMPANY.email, pageWidth - margin, y + 21, { align: "right" });

  y += 28;

  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42);
  doc.text("Solar System Quotation", margin, y);

  y += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(`Date: ${formatDate()}`, margin, y);
  doc.text(`Reference: ${quoteRef()}`, pageWidth - margin, y, { align: "right" });

  y += 12;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, y, contentWidth, 8, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(234, 88, 12);
  doc.text("Your configuration", margin + 4, y + 5.5);
  y += 14;

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

  for (const [label, value] of configRows) {
    y = drawRow(doc, y, label, value, margin, contentWidth);
    y += 2;
  }

  if (matched) {
    y += 6;
    doc.setFillColor(255, 247, 237);
    doc.roundedRect(margin, y, contentWidth, 8, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(234, 88, 12);
    doc.text("Recommended system specification", margin + 4, y + 5.5);
    y += 14;

    const specRows = [
      ["Solar panels", matched.panel?.summary ?? "—"],
      ["Total DC capacity", matched.panel ? `${matched.panel.totalKwp} kWp` : "—"],
      ["Panel tier", matched.panel?.dcrLabel ?? "—"],
      ["Inverter", matched.inverter?.summary ?? "—"],
      ["Inverter model", matched.inverter?.model ?? "—"],
    ];

    if (matched.battery) {
      specRows.push(["Battery", matched.battery.summary]);
      specRows.push(["Battery spec", matched.battery.voltageLabel]);
    }

    for (const [label, value] of specRows) {
      y = drawRow(doc, y, label, value, margin, contentWidth);
      y += 2;
      if (y > 240) {
        doc.addPage();
        y = margin;
      }
    }
  }

  y += 8;
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(margin, y, contentWidth, 28, 3, 3, "F");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184);
  doc.text("Estimated final price", margin + 6, y + 10);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  const priceLabel = formatINRForPdf(finalPrice);
  doc.text(priceLabel, margin + 6, y + 22, { charSpace: 0 });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text("Inclusive of applicable taxes", pageWidth - margin - 6, y + 22, { align: "right" });

  y += 36;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text("Terms & notes", margin, y);
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  const notes = [
    "This quotation is indicative and based on the configuration selected above.",
    "Final pricing is confirmed after a free site survey (structure, shading, and net metering).",
    "Equipment models are matched for compatibility; exact SKUs may vary per stock availability.",
    "Subsidy eligibility, if applicable, is subject to current government scheme rules.",
  ];
  for (const note of notes) {
    const lines = doc.splitTextToSize(`• ${note}`, contentWidth);
    doc.text(lines, margin, y);
    y += lines.length * 4 + 2;
  }

  y += 4;
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;
  doc.setFontSize(8);
  doc.text(`${COMPANY.name}  ·  ${COMPANY.phone}  ·  ${COMPANY.email}`, margin, y);
  doc.text(COMPANY.hours, margin, y + 4);

  const filename = `Kalpana-Solar-Quote-${selections.plantLoadKw}kW-${Date.now()}.pdf`;
  doc.save(filename);
}
