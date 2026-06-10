import { Link } from "react-router-dom";
import Logo from "../ui/Logo";

const STEPS = [
  { id: 1, label: "Customer" },
  { id: 2, label: "System" },
  { id: 3, label: "Preview" },
];

export default function QuoteWizardHeader({ step, onNew, onPrint, showActions = false, pdfBusy = false }) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-slate-600 hover:text-kalpana-600 text-sm font-semibold shrink-0 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Home
          </Link>
          <span className="hidden sm:block w-px h-5 bg-slate-200" />
          <Logo variant="on-light" className="hidden sm:block" />
          <span className="font-bold text-slate-900 text-sm sm:text-base truncate">Quotation Generator</span>
        </div>

        <nav className="flex items-center gap-1 sm:gap-2" aria-label="Quotation steps">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center gap-1 sm:gap-2">
              {i > 0 && <span className="hidden sm:block w-6 h-px bg-slate-200" />}
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-colors ${
                  step === s.id
                    ? "brand-gradient-bg text-white shadow-md shadow-kalpana-500/30"
                    : step > s.id
                    ? "text-kalpana-600 bg-kalpana-50"
                    : "text-slate-400 bg-slate-50"
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  step === s.id ? "bg-white/20" : step > s.id ? "bg-kalpana-100 text-kalpana-600" : "bg-slate-100"
                }`}>
                  {s.id}
                </span>
                <span className="hidden xs:inline">{s.label}</span>
              </span>
            </div>
          ))}
        </nav>

        {showActions && (
          <div className="hidden md:flex items-center gap-2 shrink-0">
            {onNew && (
              <button
                type="button"
                onClick={onNew}
                className="inline-flex items-center gap-1.5 text-slate-600 hover:text-kalpana-600 text-sm font-semibold"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" d="M4 4v5h.582M20 20v-5h-.581M5 9a7 7 0 0 1 12.452-4.391M19 15a7 7 0 0 1-12.452 4.391" />
                </svg>
                New
              </button>
            )}
            {onPrint && (
              <button
                type="button"
                onClick={onPrint}
                disabled={pdfBusy}
                className="quote-wizard-btn-primary !py-2 !px-4 !text-sm !rounded-lg disabled:opacity-60 disabled:cursor-wait"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z" />
                </svg>
                {pdfBusy ? "Generating…" : "Print / PDF"}
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
