import { useEffect } from "react";
import { Link } from "react-router-dom";
import QuotationGenerator from "../components/QuotationGenerator";

export default function QuotePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="hero-bg relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 grid-pattern opacity-40" />
        <div className="relative container-main pt-24 pb-10 lg:pt-28 lg:pb-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-orange-400 text-sm font-semibold mb-6 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 text-orange-400 font-bold text-xs uppercase tracking-[0.15em] mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                Solar Quote Calculator
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-white tracking-tight leading-tight">
                Build Your System, See Your Price
              </h1>
              <p className="text-slate-400 mt-3 text-base leading-relaxed">
                Configure your system on the right — your estimated final price updates instantly on the left. Download a PDF when ready.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {["GST Inclusive", "No Hidden Charges", "Free Site Survey", "PDF Download"].map((tag) => (
                <span
                  key={tag}
                  className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-semibold backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <QuotationGenerator />
    </main>
  );
}
