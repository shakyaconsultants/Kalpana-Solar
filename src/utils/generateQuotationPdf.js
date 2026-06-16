import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import {
  BRAND_LOGO_ASPECT,
  getBrandLogoDataUrl,
} from "../assets/brandLogo.js";

/** A4 at 96 CSS dpi — matches 210mm × 297mm */
export const A4_PX_WIDTH = 794;
export const A4_PX_HEIGHT = 1123;
export const PDF_CAPTURE_VERSION = 5;

export function createQuoteReference() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const r = String(Math.floor(Math.random() * 9000) + 1000);
  return `KS-${y}${m}${day}-${r}`;
}

async function waitForPreviewReady() {
  if (document.fonts?.ready) {
    await document.fonts.ready;
  }
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
}

function withTimeout(promise, ms, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`${label} timed out after ${Math.round(ms / 1000)}s`)), ms);
    }),
  ]);
}

async function waitForImages(root) {
  const images = [...root.querySelectorAll("img")];
  await Promise.all(
    images.map(
      (img) =>
        new Promise((resolve) => {
          if (img.complete && img.naturalWidth > 0) {
            resolve();
            return;
          }
          img.addEventListener("load", resolve, { once: true });
          img.addEventListener("error", resolve, { once: true });
        })
    )
  );
}

function logoBox(heightMm) {
  const h = heightMm;
  const w = h * BRAND_LOGO_ASPECT;
  return { w, h };
}

/** Draw logos with jsPDF — bypasses html2canvas image bugs entirely. */
function stampPdfLogos(doc, pageIndex, logoDataUrl, pageW, pageH) {
  if (!logoDataUrl) return;

  if (pageIndex === 0) {
    const cover = logoBox(14);
    doc.addImage(
      logoDataUrl,
      "PNG",
      (pageW - cover.w) / 2,
      14,
      cover.w,
      cover.h,
      undefined,
      "FAST"
    );
  } else {
    const header = logoBox(9);
    doc.addImage(
      logoDataUrl,
      "PNG",
      pageW - header.w - 10,
      8,
      header.w,
      header.h,
      undefined,
      "FAST"
    );
  }

  const footer = logoBox(5.5);
  doc.addImage(
    logoDataUrl,
    "PNG",
    8,
    pageH - footer.h - 5,
    footer.w,
    footer.h,
    undefined,
    "FAST"
  );
}

/**
 * Snapshot resolved computed styles (rgb only) onto the clone.
 * Skips logo nodes — they are hidden and stamped separately.
 */
function inlineElementStyles(source, target) {
  if (source.closest?.("[data-quote-logo]") || source.hasAttribute?.("data-quote-logo")) {
    return;
  }

  const computed = window.getComputedStyle(source);
  let css = "";
  for (let i = 0; i < computed.length; i++) {
    const prop = computed[i];
    const value = computed.getPropertyValue(prop);
    if (!value) continue;
    if (value.includes("oklch") || value.includes("oklab")) continue;
    css += `${prop}:${value};`;
  }
  target.style.cssText = css;
}

function inlineTreeStyles(sourceRoot, cloneRoot) {
  inlineElementStyles(sourceRoot, cloneRoot);
  const sourceNodes = sourceRoot.querySelectorAll("*");
  const cloneNodes = cloneRoot.querySelectorAll("*");
  const len = Math.min(sourceNodes.length, cloneNodes.length);
  for (let i = 0; i < len; i++) {
    inlineElementStyles(sourceNodes[i], cloneNodes[i]);
  }
}

function stripClassNames(root) {
  root.removeAttribute("class");
  root.querySelectorAll("*").forEach((el) => {
    if (el.hasAttribute("data-quote-logo")) return;
    el.removeAttribute("class");
  });
}

function injectCaptureFonts(doc) {
  const link = doc.createElement("link");
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700&display=swap";
  doc.head.appendChild(link);
}

/** Plain CSS injected into capture iframe — no Tailwind / oklch. */
function injectCaptureFixStyles(doc) {
  const style = doc.createElement("style");
  style.textContent = `
    [data-quote-logo] { visibility: hidden !important; opacity: 0 !important; }
    .quote-cover-logo-wrap { box-shadow: none !important; border: 1px solid #e5e7eb !important; }
    .quote-exec-card {
      column-count: 1 !important;
      -webkit-column-count: 1 !important;
    }
    .quote-page-balanced {
      justify-content: flex-start !important;
      gap: 8px !important;
    }
    .quote-page-balanced .quote-section { margin-bottom: 6px !important; }
    .quote-page-balanced .quote-exec-card {
      font-size: 8px !important;
      line-height: 1.45 !important;
      padding: 8px 10px !important;
    }
    .quote-page-balanced .quote-pricing-amount { font-size: 28px !important; }
    .quote-page-balanced .quote-kpi-card { padding: 8px 6px !important; }
    .quote-page-header-logo {
      width: 100px !important;
      height: 32px !important;
      flex-shrink: 0 !important;
      overflow: hidden !important;
    }
    .quote-preview-page-body { overflow: hidden !important; }
    .quote-cover-inner { justify-content: flex-start !important; gap: 12px !important; }
  `;
  doc.head.appendChild(style);
}

function patchCloneLayout(clone, pageIndex) {
  clone.querySelectorAll("[data-quote-logo]").forEach((el) => {
    el.style.setProperty("visibility", "hidden", "important");
    el.style.setProperty("opacity", "0", "important");
  });

  clone.querySelectorAll(".quote-exec-card").forEach((el) => {
    el.style.setProperty("column-count", "1", "important");
    el.style.setProperty("-webkit-column-count", "1", "important");
  });

  if (pageIndex === 1) {
    clone.querySelectorAll(".quote-page-balanced .quote-kpi-grid").forEach((el) => {
      el.style.setProperty("gap", "6px", "important");
    });
    clone.querySelectorAll(".quote-page2-split").forEach((el) => {
      el.style.setProperty("gap", "6px", "important");
    });
  }
}

async function capturePageToCanvas(pageEl, pageIndex) {
  const iframe = document.createElement("iframe");
  iframe.setAttribute("aria-hidden", "true");
  iframe.style.cssText = `position:fixed;left:-15000px;top:0;width:${A4_PX_WIDTH}px;height:${A4_PX_HEIGHT}px;border:0;opacity:0;pointer-events:none;`;
  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentDocument;
  const iframeWin = iframe.contentWindow;
  if (!iframeDoc || !iframeWin) {
    iframe.remove();
    throw new Error("Unable to create PDF capture frame.");
  }

  iframeDoc.open();
  iframeDoc.write(
    `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;background:#fff;"></body></html>`
  );
  iframeDoc.close();
  injectCaptureFonts(iframeDoc);
  injectCaptureFixStyles(iframeDoc);

  const clone = pageEl.cloneNode(true);

  inlineTreeStyles(pageEl, clone);
  stripClassNames(clone);
  patchCloneLayout(clone, pageIndex);

  clone.style.setProperty("width", `${A4_PX_WIDTH}px`, "important");
  clone.style.setProperty("height", `${A4_PX_HEIGHT}px`, "important");
  clone.style.setProperty("min-height", `${A4_PX_HEIGHT}px`, "important");
  clone.style.setProperty("max-height", `${A4_PX_HEIGHT}px`, "important");
  clone.style.setProperty("overflow", "hidden", "important");
  clone.style.setProperty("margin", "0", "important");
  clone.style.setProperty("box-shadow", "none", "important");
  clone.style.setProperty("border-radius", "0", "important");
  clone.style.setProperty("display", "flex", "important");
  clone.style.setProperty("flex-direction", "column", "important");

  iframeDoc.body.appendChild(clone);
  await waitForPreviewReady();

  try {
    return await withTimeout(
      html2canvas(clone, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        logging: false,
        backgroundColor: "#ffffff",
        width: A4_PX_WIDTH,
        height: A4_PX_HEIGHT,
        windowWidth: A4_PX_WIDTH,
        windowHeight: A4_PX_HEIGHT,
        scrollX: 0,
        scrollY: 0,
        foreignObjectRendering: false,
        ...(iframeWin ? { window: iframeWin } : {}),
      }),
      90000,
      `Page ${pageIndex + 1} capture`
    );
  } finally {
    iframe.remove();
  }
}

async function capturePreviewToPdf(filename) {
  const root = document.getElementById("quote-preview-document");
  if (!root) {
    throw new Error("Quote preview is not visible. Open the preview step before saving PDF.");
  }

  const pages = root.querySelectorAll(".quote-preview-page");
  if (!pages.length) {
    throw new Error("No quotation pages found in preview.");
  }

  const logoDataUrl = await getBrandLogoDataUrl();

  root.classList.add("quote-pdf-capture-mode");
  await waitForPreviewReady();
  await waitForImages(root);
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  try {
    for (let i = 0; i < pages.length; i++) {
      if (i > 0) doc.addPage();

      const canvas = await capturePageToCanvas(pages[i], i);
      if (!canvas.width || !canvas.height) {
        throw new Error(`Failed to capture page ${i + 1}.`);
      }

      const imgData = canvas.toDataURL("image/png");
      doc.addImage(imgData, "PNG", 0, 0, pageW, pageH);
      stampPdfLogos(doc, i, logoDataUrl, pageW, pageH);
    }
  } finally {
    root.classList.remove("quote-pdf-capture-mode");
  }

  return { doc, filename };
}

export function downloadPdfBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

export async function prepareQuotationPdfBlob(params) {
  const { doc, filename, quoteRef } = await buildQuotationPdf(params);
  return { blob: doc.output("blob"), filename, quoteRef, captureVersion: PDF_CAPTURE_VERSION };
}

export async function buildQuotationPdf({
  selections,
  breakdown,
  quoteRef = createQuoteReference(),
}) {
  if (!breakdown?.finalPrice || !selections) {
    throw new Error("Invalid quote data");
  }

  const ref = quoteRef ?? createQuoteReference();
  const filename = `Kalpana-Solar-Quote-${selections.plantLoadKw}kW-${ref}.pdf`;
  const { doc } = await capturePreviewToPdf(filename);
  return { doc, filename, quoteRef: ref };
}

export async function getQuotationPdfUrl(params) {
  const { doc, filename, quoteRef } = await buildQuotationPdf(params);
  const blob = doc.output("blob");
  return { url: URL.createObjectURL(blob), filename, quoteRef };
}

export async function previewQuotationPdf(params) {
  const { url, filename, quoteRef } = await getQuotationPdfUrl(params);
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
    /* noop */
  }
  setTimeout(() => URL.revokeObjectURL(url), 120_000);
  return { quoteRef };
}

export async function downloadQuotationPdf(params) {
  const { blob, filename } = await prepareQuotationPdfBlob(params);
  downloadPdfBlob(blob, filename);
}

export async function openQuotationPdfPrint(params) {
  const { url } = await getQuotationPdfUrl(params);
  const win = window.open(url, "_blank", "noopener,noreferrer");
  if (!win) {
    URL.revokeObjectURL(url);
    throw new Error("Unable to open PDF.");
  }
  setTimeout(() => URL.revokeObjectURL(url), 120_000);
}
