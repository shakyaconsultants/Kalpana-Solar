import { BRAND_LOGO_SRC, BRAND_LOGO_ASPECT } from "../../assets/brandLogo.js";

/** Layout boxes for each quotation logo placement (PDF overlays match these). */
const SIZES = {
  cover: { height: 56, maxWidth: 140 },
  header: { height: 32, maxWidth: 100 },
  footer: { height: 20, maxWidth: 80 },
};

/**
 * Quotation document logo — fixed display size + data attribute for PDF capture.
 * Logos are composited with jsPDF during export (html2canvas often skips <img>).
 */
export default function QuoteDocLogo({ variant = "header", alt = "", className = "" }) {
  const { height, maxWidth } = SIZES[variant] ?? SIZES.header;
  const width = Math.min(maxWidth, Math.round(height * BRAND_LOGO_ASPECT));

  return (
    <span
      data-quote-logo={variant}
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width,
        height,
        flexShrink: 0,
        overflow: "hidden",
      }}
    >
      <img
        src={BRAND_LOGO_SRC}
        alt={alt}
        decoding="sync"
        loading="eager"
        style={{
          display: "block",
          width,
          height,
          objectFit: "contain",
        }}
      />
    </span>
  );
}
