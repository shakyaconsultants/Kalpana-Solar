import { useEffect } from "react";
import { Link } from "react-router-dom";
import QuotationGenerator from "../components/QuotationGenerator";

export default function QuotePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-screen bg-slate-100/80">
      {/* Page header */}
      <div
        className="pt-20 pb-8 sm:pb-10 border-b border-white/5"
        style={{
          background: "linear-gradient(135deg, #0f1623 0%, #1a2744 50%, #0f2010 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-orange-400 text-sm font-medium mb-5 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-2 text-orange-400 font-semibold text-xs uppercase tracking-widest mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                Solar Quote Calculator
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">
                Build Your System, See Your Price
              </h1>
              <p className="text-slate-400 mt-2 max-w-xl text-sm sm:text-base">
                Configure on the right — your estimated final price appears instantly on the left.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 text-xs">
              {["GST Inclusive", "No Hidden Charges", "Free Site Survey"].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-8 sm:pt-10">
        <QuotationGenerator />
      </div>
    </main>
  );
}
