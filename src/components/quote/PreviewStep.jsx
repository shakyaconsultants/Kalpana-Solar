import { formatINR } from "../../data/formatCurrency.js";
import QuotationPreviewDocument from "./QuotationPreviewDocument";

export default function PreviewStep({
  customer,
  selections,
  breakdown,
  quoteRef,
  summaryLine,
  onEdit,
  onNew,
  onPrint,
  pdfError = null,
  pdfBusy = false,
}) {
  return (
    <div className="space-y-5">
      <div className="quote-wizard-card !p-5 sm:!p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="font-extrabold text-slate-900 text-lg">
              Quotation Ready — <span className="text-kalpana-600">{quoteRef}</span>
            </p>
            <p className="text-slate-500 text-sm mt-1">{summaryLine}</p>
            {breakdown?.finalPrice != null && (
              <p className="text-slate-800 font-bold text-base mt-2">{formatINR(breakdown.finalPrice)}</p>
            )}
            {pdfError && (
              <p className="text-red-600 text-xs font-medium mt-2">{pdfError}</p>
            )}
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <button type="button" onClick={onEdit} className="quote-wizard-btn-outline" disabled={pdfBusy}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Edit
            </button>
            <button
              type="button"
              onClick={onPrint}
              disabled={pdfBusy}
              className="quote-wizard-btn-primary !py-2.5 !px-5 !rounded-xl disabled:opacity-60 disabled:cursor-wait"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z" />
              </svg>
              {pdfBusy ? "Generating PDF…" : "Print / Save PDF"}
            </button>
          </div>
        </div>
      </div>

      <QuotationPreviewDocument
        customer={customer}
        selections={selections}
        breakdown={breakdown}
        quoteRef={quoteRef}
      />

      <div className="text-center">
        <button
          type="button"
          onClick={onNew}
          className="text-slate-500 hover:text-kalpana-600 text-sm font-semibold transition-colors"
        >
          Start a new quotation
        </button>
      </div>
    </div>
  );
}
