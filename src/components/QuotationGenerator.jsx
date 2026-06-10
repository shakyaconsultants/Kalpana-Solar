import { useMemo, useState, useRef, useEffect } from "react";
import {
  INSTALLATION_TYPES,
  SYSTEM_TYPES,
  PANEL_COMPANIES,
  PANEL_CATEGORIES,
  BATTERY_BRANDS,
  PLANT_LOAD_OPTIONS,
  FLOOR_OPTIONS,
  formatPlantLoad,
  formatFloors,
  systemNeedsWiring,
  calculateQuoteBreakdown,
  formatINR,
  getAllowedInverterBrands,
  resolveInverterBrand,
} from "../data/quotationData";
import QuoteWizardHeader from "./quote/QuoteWizardHeader";
import CustomerStep from "./quote/CustomerStep";
import PreviewStep from "./quote/PreviewStep";
import {
  PDF_CAPTURE_VERSION,
  createQuoteReference,
  downloadPdfBlob,
  prepareQuotationPdfBlob,
} from "../utils/generateQuotationPdf";

function FormDropdown({ value, onChange, options, placeholder = "Select an option" }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = options.find((opt) => opt.id === value);
  const displayLabel = selected?.label ?? placeholder;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className={`w-full text-left rounded-xl border px-4 py-3.5 text-sm font-semibold transition-all flex items-center justify-between gap-3 ${
          value != null
            ? "border-kalpana-500 bg-kalpana-50 ring-1 ring-kalpana-500/20 text-kalpana-600"
            : open
            ? "border-kalpana-400 bg-white ring-1 ring-kalpana-400/20 text-slate-800"
            : "border-slate-200 bg-white text-slate-500 hover:border-kalpana-300 hover:bg-kalpana-50/30"
        }`}
      >
        <span>{displayLabel}</span>
        <span className="flex items-center gap-2 shrink-0">
          {value != null && (
            <span className="w-3.5 h-3.5 rounded-full border-2 border-kalpana-500 bg-kalpana-500 flex items-center justify-center">
              <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          )}
          <svg
            className={`w-4 h-4 text-slate-400 transition-transform ${open ? "rotate-180 text-kalpana-500" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute z-30 mt-2 w-full max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10 py-1.5"
        >
          {options.map((opt) => {
            const isSelected = value === opt.id;
            return (
              <li key={opt.id} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(opt.id);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors flex items-center justify-between gap-2 ${
                    isSelected
                      ? "bg-kalpana-50 text-kalpana-600"
                      : "text-slate-800 hover:bg-kalpana-50/40 hover:text-kalpana-600"
                  }`}
                >
                  <span>{opt.label}</span>
                  {isSelected && (
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-kalpana-500 bg-kalpana-500 flex items-center justify-center shrink-0">
                      <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function SectionTitle({ step, title, subtitle }) {
  return (
    <div className="mb-5">
      <div className="flex items-start gap-3">
        <span className="w-8 h-8 rounded-xl brand-gradient-bg text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-sm shadow-kalpana-500/30">
          {step}
        </span>
        <div className="pt-0.5">
          <h3 className="font-bold text-slate-900 text-base tracking-tight">{title}</h3>
          {subtitle && <p className="text-slate-500 text-sm mt-1 leading-snug">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}

function OptionCards({ options, value, onChange, columns = 2, compact = false }) {
  const gridCls =
    columns === 1
      ? "grid grid-cols-1 gap-2.5"
      :     columns === 4
      ? "grid grid-cols-2 sm:grid-cols-4 gap-2.5"
      : columns === 5
      ? "grid grid-cols-2 sm:grid-cols-5 gap-2.5"
      : columns === 3
      ? "grid grid-cols-1 xs:grid-cols-3 gap-2.5"
      : columns === 2
      ? "grid grid-cols-2 gap-2.5"
      : "grid grid-cols-2 gap-2.5";

  return (
    <div className={gridCls}>
      {options.map((opt) => {
        const id = typeof opt === "string" ? opt : opt.id;
        const label = typeof opt === "string" ? opt : opt.label;
        const desc = typeof opt === "string" ? null : opt.desc;
        const selected = value === id;

        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={`text-left rounded-xl border transition-all ${
              compact ? "p-3" : "p-3.5"
            } ${
              selected
                ? "border-kalpana-500 bg-kalpana-50 ring-1 ring-kalpana-500/20"
                : "border-slate-200 bg-white hover:border-kalpana-300 hover:bg-kalpana-50/30"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className={`font-semibold text-sm ${selected ? "text-kalpana-600" : "text-slate-800"}`}>
                {label}
              </span>
              <span
                className={`w-3.5 h-3.5 rounded-full border-2 shrink-0 flex items-center justify-center ${
                  selected ? "border-kalpana-500 bg-kalpana-500" : "border-slate-300"
                }`}
              >
                {selected && (
                  <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
            </div>
            {desc && !compact && (
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">{desc}</p>
            )}
          </button>
        );
      })}
    </div>
  );
}

function YesNoToggle({ value, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {[
        { id: true, label: "Yes, include battery" },
        { id: false, label: "No battery" },
      ].map((opt) => (
        <button
          key={String(opt.id)}
          type="button"
          onClick={() => onChange(opt.id)}
          className={`py-3 px-3 rounded-xl text-sm font-semibold border transition-all ${
            value === opt.id
              ? "border-kalpana-500 bg-kalpana-50 text-kalpana-600"
              : "border-slate-200 text-slate-600 hover:border-kalpana-300 bg-white"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function SummaryRow({ label, value, done }) {
  return (
    <div className="flex items-start justify-between gap-3 py-2 border-b border-white/10 last:border-0">
      <span className="text-slate-400 text-xs shrink-0">{label}</span>
      <span className={`text-xs font-medium text-right ${done ? "text-white" : "text-slate-500 italic"}`}>
        {value}
      </span>
    </div>
  );
}

function ConfigMapRow({ label, value, hint }) {
  return (
    <div className="py-2 border-b border-white/5 last:border-0">
      <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-0.5">{label}</p>
      <p className="text-xs font-medium text-white leading-snug">{value}</p>
      {hint && <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">{hint}</p>}
    </div>
  );
}

function MatchedConfiguration({ matched }) {
  if (!matched) return null;

  const { system, panel, inverter, battery, compatibility } = matched;

  return (
    <div className="rounded-2xl border border-kalpana-500/20 bg-white/[0.03] mb-4 overflow-hidden backdrop-blur-sm">
      <div className="px-4 py-3 bg-gradient-to-r from-kalpana-500/15 to-transparent border-b border-kalpana-500/15">
        <p className="text-kalpana-300 font-bold text-xs uppercase tracking-wider">Recommended system</p>
        <p className="text-slate-400 text-[11px] mt-0.5">Lowest-cost compatible configuration</p>
      </div>

      <div className="px-3 py-2 space-y-3">
        {/* Panels */}
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="w-5 h-5 rounded-md bg-accent-500/20 flex items-center justify-center text-accent-400 text-[10px] font-bold">
              P
            </span>
            <span className="text-xs font-semibold text-slate-200">Solar panels</span>
          </div>
          <div className="pl-6 space-y-0">
            <ConfigMapRow label="Brand & type" value={`${panel.company} ${panel.categoryLabel}`} />
            <ConfigMapRow label="Module" value={`${panel.wattPerPanel}W · ${panel.dcrLabel}`} hint={system.panelTierRule} />
            <ConfigMapRow
              label="Array size"
              value={panel.summary}
              hint={compatibility.panelToLoad}
            />
            <ConfigMapRow label="Total DC capacity" value={`${panel.totalKwp} kWp (${panel.totalWatts} W)`} />
          </div>
        </div>

        {/* Inverter */}
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="w-5 h-5 rounded-md bg-blue-500/20 flex items-center justify-center text-blue-400 text-[10px] font-bold">
              I
            </span>
            <span className="text-xs font-semibold text-slate-200">Inverter</span>
          </div>
          <div className="pl-6 space-y-0">
            <ConfigMapRow label="Brand & rating" value={inverter.summary} hint={compatibility.inverterToLoad} />
            <ConfigMapRow label="Model" value={inverter.model} />
            <ConfigMapRow label="DC side" value={inverter.voltageLabel} />
          </div>
        </div>

        {/* Battery */}
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="w-5 h-5 rounded-md bg-green-500/20 flex items-center justify-center text-green-400 text-[10px] font-bold">
              B
            </span>
            <span className="text-xs font-semibold text-slate-200">Battery</span>
          </div>
          <div className="pl-6 space-y-0">
            {battery ? (
              <>
                <ConfigMapRow label="Brand & model" value={battery.summary} />
                <ConfigMapRow label="Specification" value={battery.voltageLabel} />
                {battery.compatibilityNote && (
                  <ConfigMapRow label="Compatibility" value={battery.compatibilityNote} hint={compatibility.batteryToInverter} />
                )}
              </>
            ) : (
              <ConfigMapRow label="Status" value="Not included in this configuration" hint="Hybrid or off-grid without backup storage" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PricePanel({ selections, formValid, progress, onReset, hasAnySelection }) {
  const breakdown = formValid ? calculateQuoteBreakdown(selections) : null;
  const finalPrice = breakdown?.finalPrice ?? null;
  const matched = breakdown?.matched;
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState(false);

  async function handlePreviewPdf() {
    if (!breakdown?.finalPrice) return;
    setPdfLoading(true);
    setPdfError(false);
    try {
      const { previewQuotationPdf } = await import("../utils/generateQuotationPdf");
      await previewQuotationPdf({ selections, breakdown });
    } catch {
      setPdfError(true);
    } finally {
      setPdfLoading(false);
    }
  }

  const systemLabel = SYSTEM_TYPES.find((s) => s.id === selections.systemType)?.label;
  const panelCategoryLabel = PANEL_CATEGORIES.find((c) => c.id === selections.panelCategory)?.label;

  const showBatteryConfig = selections.systemType === "hybrid" || selections.systemType === "off-grid";

  const batterySummary = !showBatteryConfig
    ? null
    : selections.wantsBattery == null
    ? null
    : selections.wantsBattery
    ? selections.batteryBrand || "Yes — select brand"
    : "Not included";

  const batteryDone = !showBatteryConfig
    ? true
    : selections.wantsBattery != null &&
      (!selections.wantsBattery || !!selections.batteryBrand);

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-slate-900/20 ring-1 ring-white/10">
      <div className="absolute inset-0 hero-bg" />
      <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />

      <div className="relative p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3 mb-5">
          <div>
            <p className="text-white font-extrabold text-base tracking-tight">Quote Summary</p>
            <p className="text-slate-400 text-xs mt-0.5">Live estimate as you configure</p>
          </div>
          <span className="text-xs font-bold text-kalpana-400 bg-kalpana-500/10 border border-kalpana-500/20 px-2.5 py-1 rounded-full">
            {progress}%
          </span>
        </div>

        <div className="mb-5">
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full brand-gradient-bg rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="rounded-2xl bg-white/[0.06] border border-white/10 p-5 mb-5 text-center backdrop-blur-sm">
          <p className="text-slate-400 text-[11px] uppercase tracking-[0.15em] font-semibold mb-2">
            Estimated Final Price
          </p>
          {formValid ? (
            finalPrice != null ? (
              <p className="text-4xl sm:text-[2.75rem] font-extrabold text-white tracking-tight leading-none">
                {formatINR(finalPrice)}
              </p>
            ) : (
              <div>
                <p className="text-2xl font-bold text-slate-300">—</p>
                <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                  Unable to match compatible equipment for this configuration.
                </p>
              </div>
            )
          ) : (
            <div>
              <p className="text-3xl font-bold text-slate-600">—</p>
              <p className="text-slate-400 text-xs mt-2">Complete the form to see your price</p>
            </div>
          )}
          <p className="text-slate-500 text-[10px] mt-3 uppercase tracking-wide font-medium">
            Inclusive of GST where applicable
          </p>
        </div>

        {matched && <MatchedConfiguration matched={matched} />}

        {/* Your selections */}
        <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-2 px-0.5 font-semibold">Your selections</p>
        <div className="rounded-xl bg-black/25 border border-white/5 px-3 py-0.5 mb-4 backdrop-blur-sm">
          <SummaryRow
            label="Plant load"
            value={selections.plantLoadKw ? formatPlantLoad(selections.plantLoadKw) : "Not selected"}
            done={!!selections.plantLoadKw}
          />
          <SummaryRow
            label="Installation"
            value={selections.installationType || "Not selected"}
            done={!!selections.installationType}
          />
          <SummaryRow
            label="System type"
            value={systemLabel || "Not selected"}
            done={!!selections.systemType}
          />
          {showBatteryConfig && (
            <SummaryRow
              label="Battery"
              value={batterySummary || "Not selected"}
              done={batteryDone}
            />
          )}
          {systemNeedsWiring(selections.systemType) && (
            <SummaryRow
              label="Building floors"
              value={selections.floors ? formatFloors(selections.floors) : "Not selected"}
              done={!!selections.floors}
            />
          )}
          <SummaryRow
            label="Panel brand"
            value={selections.panelCompany || "Not selected"}
            done={!!selections.panelCompany}
          />
          <SummaryRow
            label="Panel type"
            value={panelCategoryLabel || "Not selected"}
            done={!!selections.panelCategory}
          />
          <SummaryRow
            label="Inverter"
            value={selections.inverterBrand || "Not selected"}
            done={!!selections.inverterBrand}
          />
        </div>

        {formValid && finalPrice != null && (
          <div className="mb-3">
            <button
              type="button"
              onClick={handlePreviewPdf}
              disabled={pdfLoading}
              className="flex items-center justify-center gap-2 w-full bg-white text-slate-900 hover:bg-kalpana-50 text-sm font-bold py-3.5 rounded-xl transition-all disabled:opacity-60 shadow-lg shadow-black/10"
            >
              <svg className="w-4 h-4 text-kalpana-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M14 3h7v7M10 14L21 3M5 12v7a2 2 0 0 0 2 2h7" />
              </svg>
              {pdfLoading ? "Generating…" : "Get PDF"}
            </button>
            {pdfError && (
              <p className="text-red-400/90 text-[10px] text-center mt-2">Unable to generate PDF.</p>
            )}
          </div>
        )}

        <Link
          to="/#contact"
          className="flex items-center justify-center gap-2 w-full bg-kalpana-500 hover:bg-kalpana-600 text-white text-sm font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-kalpana-500/25"
        >
          Request Detailed Proposal
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>

        {hasAnySelection && (
          <button
            type="button"
            onClick={onReset}
            className="w-full mt-3 text-slate-500 hover:text-white text-xs font-semibold py-2 transition-colors"
          >
            Reset configuration
          </button>
        )}

        <div className="flex items-start gap-3 mt-5 pt-4 border-t border-white/10">
          <div className="w-8 h-8 rounded-lg bg-kalpana-500/15 border border-kalpana-500/20 flex items-center justify-center shrink-0">
            <svg className="w-3.5 h-3.5 text-kalpana-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            All prices are indicative. A free site survey confirms final sizing, structure, and subsidy eligibility.
          </p>
        </div>
      </div>
    </div>
  );
}

function computeProgress(selections, showBatteryQuestion, showBatteryBrand, showFloorQuestion) {
  const steps = [
    !!selections.plantLoadKw,
    !!selections.installationType,
    !!selections.systemType,
  ];

  if (showFloorQuestion) {
    steps.push(!!selections.floors);
  }

  if (showBatteryQuestion) {
    steps.push(
      selections.wantsBattery != null &&
        (!selections.wantsBattery || !!selections.batteryBrand)
    );
  } else if (showBatteryBrand) {
    steps.push(!!selections.batteryBrand);
  }

  steps.push(
    !!selections.panelCompany,
    !!selections.panelCategory,
    !!selections.inverterBrand
  );

  const done = steps.filter(Boolean).length;
  if (done === 0) return 0;

  return Math.round((done / steps.length) * 100);
}

export default function QuotationGenerator() {
  const [wizardStep, setWizardStep] = useState(1);
  const [customer, setCustomer] = useState({ name: "", phone: "", address: "", city: "" });
  const [quoteRef, setQuoteRef] = useState(null);

  const [plantLoadKw, setPlantLoadKw] = useState(null);
  const [installationType, setInstallationType] = useState("");
  const [systemType, setSystemType] = useState("");
  const [floors, setFloors] = useState(null);
  const [wantsBattery, setWantsBattery] = useState(null);
  const [panelCompany, setPanelCompany] = useState("");
  const [panelCategory, setPanelCategory] = useState("");
  const [inverterBrand, setInverterBrand] = useState("");
  const [batteryBrand, setBatteryBrand] = useState("");
  const pdfCacheRef = useRef(null);
  const [pdfSaving, setPdfSaving] = useState(false);
  const [pdfError, setPdfError] = useState(null);

  const allowedInverterBrands = useMemo(
    () => (systemType && plantLoadKw ? getAllowedInverterBrands(systemType, plantLoadKw) : []),
    [systemType, plantLoadKw]
  );

  const resolvedInverterBrand = useMemo(
    () => resolveInverterBrand(systemType, plantLoadKw, inverterBrand),
    [systemType, plantLoadKw, inverterBrand]
  );

  const showBatteryQuestion = systemType === "hybrid" || systemType === "off-grid";
  const showBatteryBrand =
    (systemType === "hybrid" || systemType === "off-grid") && wantsBattery === true;
  const showFloorQuestion = systemType === "on-grid" || systemType === "hybrid";

  const resolvedWantsBattery =
    systemType === "hybrid" || systemType === "off-grid" ? wantsBattery : null;

  const selections = useMemo(
    () => ({
      plantLoadKw,
      installationType,
      systemType,
      floors: showFloorQuestion ? floors : null,
      wantsBattery: resolvedWantsBattery,
      panelCompany,
      panelCategory,
      inverterBrand: resolvedInverterBrand,
      batteryBrand: showBatteryBrand ? batteryBrand : null,
    }),
    [
      plantLoadKw,
      installationType,
      systemType,
      floors,
      resolvedWantsBattery,
      panelCompany,
      panelCategory,
      resolvedInverterBrand,
      batteryBrand,
      showBatteryBrand,
      showFloorQuestion,
    ]
  );

  const formValid = isFormValid(selections);
  const breakdown = formValid ? calculateQuoteBreakdown(selections) : null;

  useEffect(() => {
    pdfCacheRef.current = null;
    setPdfError(null);
  }, [wizardStep, quoteRef, breakdown?.finalPrice, customer, selections]);

  const systemTypeLabel = SYSTEM_TYPES.find((s) => s.id === systemType)?.label ?? "";
  const summaryLine = [
    breakdown?.matched?.panel ? `${breakdown.matched.panel.totalKwp} kWp` : plantLoadKw ? `${plantLoadKw} kW` : "",
    systemTypeLabel,
    installationType,
    customer.name.trim(),
  ]
    .filter(Boolean)
    .join(" · ");

  function handleSystemTypeChange(type) {
    setSystemType(type);
    setWantsBattery(null);
    setBatteryBrand("");
    setFloors(null);
    setInverterBrand("");
  }

  function handlePlantLoadChange(kw) {
    setPlantLoadKw(kw);
    if (systemType === "off-grid" && kw > 4 && inverterBrand === "Microtek") {
      setInverterBrand("");
    }
  }

  function handleReset() {
    setWizardStep(1);
    setCustomer({ name: "", phone: "", address: "", city: "" });
    setQuoteRef(null);
    setPlantLoadKw(null);
    setInstallationType("");
    setSystemType("");
    setFloors(null);
    setWantsBattery(null);
    setPanelCompany("");
    setPanelCategory("");
    setInverterBrand("");
    setBatteryBrand("");
  }

  function handleGenerate() {
    if (!formValid || !breakdown?.finalPrice) return;
    setQuoteRef((prev) => prev ?? createQuoteReference());
    setWizardStep(3);
    window.scrollTo(0, 0);
  }

  async function handlePrintSavePdf() {
    if (!breakdown?.finalPrice || pdfSaving) return;

    const cached = pdfCacheRef.current;
    if (cached?.captureVersion === PDF_CAPTURE_VERSION) {
      downloadPdfBlob(cached.blob, cached.filename);
      return;
    }

    setPdfSaving(true);
    setPdfError(null);
    try {
      const result = await prepareQuotationPdfBlob({
        selections,
        breakdown,
        customer,
        quoteRef: quoteRef ?? createQuoteReference(),
      });
      pdfCacheRef.current = result;
      downloadPdfBlob(result.blob, result.filename);
    } catch (err) {
      console.error("PDF save failed:", err);
      setPdfError(err?.message || "Could not create PDF. Try Print → Save as PDF in the dialog.");
      window.print();
    } finally {
      setPdfSaving(false);
    }
  }

  let stepCounter = 0;
  const nextStep = () => ++stepCounter;

  return (
    <div className="quote-wizard-page">
      <QuoteWizardHeader
        step={wizardStep}
        showActions={wizardStep === 3}
        onNew={handleReset}
        onPrint={wizardStep === 3 ? handlePrintSavePdf : undefined}
        pdfBusy={pdfSaving}
      />

      <div className={`mx-auto px-4 sm:px-6 py-8 sm:py-10 ${wizardStep === 3 ? "max-w-5xl" : "max-w-3xl"}`}>
        {wizardStep === 1 && (
          <CustomerStep
            customer={customer}
            onChange={setCustomer}
            onNext={() => {
              setWizardStep(2);
              window.scrollTo(0, 0);
            }}
          />
        )}

        {wizardStep === 2 && (
          <div className="quote-wizard-card">
            <div className="text-center mb-6 sm:mb-8">
              <div className="w-12 h-12 rounded-2xl bg-kalpana-50 ring-1 ring-kalpana-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-kalpana-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">System Configuration</h2>
              <p className="text-slate-500 text-sm mt-2">Choose system type, capacity, panels and inverter</p>
              {formValid && breakdown?.finalPrice != null && (
                <p className="mt-4 inline-flex items-center gap-2 bg-kalpana-50 border border-kalpana-200 text-kalpana-700 font-bold text-sm px-4 py-2 rounded-full">
                  Estimated: {formatINR(breakdown.finalPrice)}
                </p>
              )}
            </div>

            <div className="space-y-8 sm:space-y-10">
                <div>
                  <SectionTitle
                    step={nextStep()}
                    title="Plant Load"
                    subtitle="Required system capacity (2 – 10 kW)"
                  />
                  <FormDropdown
                    value={plantLoadKw}
                    onChange={handlePlantLoadChange}
                    options={PLANT_LOAD_OPTIONS}
                    placeholder="Select plant load (kW)"
                  />
                </div>

                <div className="border-t border-slate-100 pt-8">
                  <SectionTitle
                    step={nextStep()}
                    title="Installation Type"
                    subtitle="Residential or commercial property"
                  />
                  <OptionCards
                    options={INSTALLATION_TYPES}
                    value={installationType}
                    onChange={setInstallationType}
                    columns={2}
                    compact
                  />
                </div>

                <div className="border-t border-slate-100 pt-8">
                  <SectionTitle
                    step={nextStep()}
                    title="System Type"
                    subtitle="On-grid, hybrid, or fully off-grid"
                  />
                  <OptionCards
                    options={SYSTEM_TYPES}
                    value={systemType}
                    onChange={handleSystemTypeChange}
                    columns={3}
                  />
                </div>

                {showFloorQuestion && (
                  <div className="border-t border-slate-100 pt-8">
                    <SectionTitle
                      step={nextStep()}
                      title="Building Floors"
                      subtitle="Number of floors at the installation site"
                    />
                    <OptionCards
                      options={FLOOR_OPTIONS}
                      value={floors}
                      onChange={setFloors}
                      columns={5}
                      compact
                    />
                  </div>
                )}

                {showBatteryQuestion && (
                  <div className="border-t border-slate-100 pt-8">
                    <SectionTitle
                      step={nextStep()}
                      title="Battery Backup"
                      subtitle={
                        systemType === "off-grid"
                          ? "Optional storage for standalone systems"
                          : "Add storage for power cuts"
                      }
                    />
                    <YesNoToggle
                      value={wantsBattery}
                      onChange={(v) => {
                        setWantsBattery(v);
                        if (!v) setBatteryBrand("");
                      }}
                    />
                  </div>
                )}

                <div className="border-t border-slate-100 pt-8">
                  <SectionTitle
                    step={nextStep()}
                    title="Solar Panels"
                    subtitle="Brand and cell technology"
                  />
                  <div className="space-y-5">
                    <div>
                      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                        Panel Company
                      </p>
                      <OptionCards
                        options={PANEL_COMPANIES}
                        value={panelCompany}
                        onChange={setPanelCompany}
                        columns={3}
                        compact
                      />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                        Panel Category
                      </p>
                      <OptionCards
                        options={PANEL_CATEGORIES}
                        value={panelCategory}
                        onChange={setPanelCategory}
                        columns={2}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-8">
                  <SectionTitle
                    step={nextStep()}
                    title="Inverter Brand"
                    subtitle={
                      systemType === "off-grid" && plantLoadKw > 4
                        ? "Invergy only above 4 kW off-grid"
                        : systemType === "off-grid"
                        ? "Microtek or Invergy — matched to your load"
                        : "Invergy or Microtek — matched to your load"
                    }
                  />
                  {allowedInverterBrands.length === 0 ? (
                    <p className="text-sm text-slate-500 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                      Select plant load and system type first.
                    </p>
                  ) : allowedInverterBrands.length === 1 ? (
                    <p className="text-sm text-slate-600 bg-kalpana-50 border border-kalpana-200 rounded-xl px-4 py-3">
                      <span className="font-semibold text-kalpana-700">{allowedInverterBrands[0]}</span>
                      {" — "}only option for this configuration (auto-applied).
                    </p>
                  ) : (
                    <OptionCards
                      options={allowedInverterBrands}
                      value={inverterBrand}
                      onChange={setInverterBrand}
                      columns={2}
                      compact
                    />
                  )}
                </div>

                {showBatteryBrand && (
                  <div className="border-t border-slate-100 pt-8">
                    <SectionTitle
                      step={nextStep()}
                      title="Battery Brand"
                      subtitle={
                        systemType === "off-grid"
                          ? "Required for standalone power"
                          : systemType === "on-grid"
                          ? "Select battery manufacturer"
                          : "Select battery manufacturer"
                      }
                    />
                    <OptionCards
                      options={BATTERY_BRANDS}
                      value={batteryBrand}
                      onChange={setBatteryBrand}
                      columns={2}
                      compact
                    />
                  </div>
                )}
            </div>

            <div className="flex gap-3 mt-8 pt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setWizardStep(1)}
                className="quote-wizard-btn-back"
                aria-label="Back"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                disabled={!formValid || breakdown?.finalPrice == null}
                onClick={handleGenerate}
                className="quote-wizard-btn-primary flex-1 disabled:opacity-45 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                Generate Quotation
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {wizardStep === 3 && breakdown?.finalPrice != null && (
          <PreviewStep
            customer={customer}
            selections={selections}
            breakdown={breakdown}
            quoteRef={quoteRef}
            summaryLine={summaryLine}
            onEdit={() => setWizardStep(2)}
            onNew={handleReset}
            onPrint={handlePrintSavePdf}
            pdfError={pdfError}
            pdfBusy={pdfSaving}
          />
        )}
      </div>
    </div>
  );
}

function isFormValid(selections) {
  const {
    plantLoadKw,
    installationType,
    systemType,
    floors,
    wantsBattery,
    panelCompany,
    panelCategory,
    inverterBrand,
    batteryBrand,
  } = selections;

  if (!plantLoadKw || !installationType || !systemType || !panelCompany || !panelCategory) {
    return false;
  }

  if (systemNeedsWiring(systemType) && !floors) return false;

  if (!inverterBrand) return false;

  if (systemType === "hybrid" || systemType === "off-grid") {
    if (wantsBattery == null) return false;
    if (wantsBattery && !batteryBrand) return false;
  }

  return true;
}
