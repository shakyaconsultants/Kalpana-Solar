import { useMemo, useState, useRef, useEffect } from "react";
import {
  INSTALLATION_TYPES,
  SYSTEM_TYPES,
  PLANT_LOAD_OPTIONS,
  FLOOR_OPTIONS,
  formatINR,
  systemNeedsWiring,
  calculateQuoteBreakdown,
  isValidSelections,
  getWattOptionsForCompany,
  getPanelCompaniesForSelection,
  getAllowedInverterBrands,
  getPreferredInverterBrand,
  getPreferredInverterDescription,
  resolveInverterBrand,
  isTataBrand,
  isTataEligible,
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
      : columns === 4
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
        const preferred = typeof opt === "string" ? false : !!opt.preferred;
        const selected = value === id;

        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={`text-left rounded-xl border transition-all relative ${
              compact ? "p-3" : "p-3.5"
            } ${
              selected
                ? preferred
                  ? "border-kalpana-500 bg-kalpana-50 ring-2 ring-kalpana-500/30"
                  : "border-kalpana-500 bg-kalpana-50 ring-1 ring-kalpana-500/20"
                : preferred
                ? "border-amber-400 bg-amber-50/60 ring-1 ring-amber-400/40 hover:border-amber-500"
                : "border-slate-200 bg-white hover:border-kalpana-300 hover:bg-kalpana-50/30"
            }`}
          >
            {preferred && (
              <span className="absolute -top-2 left-3 inline-flex items-center rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                Preferred
              </span>
            )}
            <div className={`flex items-center justify-between gap-2 ${preferred ? "mt-1" : ""}`}>
              <span className={`font-semibold text-sm ${selected ? "text-kalpana-600" : preferred ? "text-amber-900" : "text-slate-800"}`}>
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
            {desc && (
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

function InfoNote({ tone = "info", children }) {
  const cls =
    tone === "warn"
      ? "text-amber-700 bg-amber-50 border-amber-200"
      : "text-slate-600 bg-kalpana-50 border-kalpana-200";
  return (
    <p className={`text-sm rounded-xl border px-4 py-3 ${cls}`}>{children}</p>
  );
}

function computeProgress(selections, flags) {
  const { isTata, tataEligible, showFloorQuestion, showBatteryQuestion, showInverter } = flags;

  const steps = [
    !!selections.plantLoadKw,
    !!selections.installationType,
    !!selections.systemType,
    !!selections.panelCompany,
  ];

  if (isTata) {
    steps.push(tataEligible);
  } else {
    if (showFloorQuestion) steps.push(!!selections.floors);
    if (showBatteryQuestion) steps.push(selections.wantsBattery != null);
    steps.push(!!selections.panelWatt);
    if (showInverter) steps.push(!!selections.inverterBrand);
  }

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
  const [panelWatt, setPanelWatt] = useState(null);
  const [inverterBrand, setInverterBrand] = useState("");
  const pdfCacheRef = useRef(null);
  const [pdfSaving, setPdfSaving] = useState(false);
  const [pdfError, setPdfError] = useState(null);

  const isTata = isTataBrand(panelCompany);
  const tataEligible = isTataEligible(systemType, plantLoadKw);

  const panelCompanyOptions = useMemo(
    () => getPanelCompaniesForSelection(systemType, plantLoadKw),
    [systemType, plantLoadKw]
  );

  const wattOptions = useMemo(
    () =>
      systemType && panelCompany && !isTata
        ? getWattOptionsForCompany(panelCompany, systemType)
        : [],
    [systemType, panelCompany, isTata]
  );

  const allowedInverterBrands = useMemo(
    () => (systemType && plantLoadKw && !isTata ? getAllowedInverterBrands(systemType, plantLoadKw) : []),
    [systemType, plantLoadKw, isTata]
  );

  const preferredInverterBrand = useMemo(
    () => (systemType && plantLoadKw ? getPreferredInverterBrand(systemType, plantLoadKw) : null),
    [systemType, plantLoadKw]
  );

  const resolvedInverterBrand = useMemo(
    () => (isTata ? null : resolveInverterBrand(systemType, plantLoadKw, inverterBrand)),
    [systemType, plantLoadKw, inverterBrand, isTata]
  );

  const showBatteryQuestion = !isTata && (systemType === "hybrid" || systemType === "off-grid");
  const showFloorQuestion = !isTata && (systemType === "on-grid" || systemType === "hybrid");
  const showWattSelector = !isTata && !!systemType && !!panelCompany;
  const showInverter = !isTata && !!systemType && plantLoadKw != null;

  // Drop panel company when it is no longer offered (e.g. Tata outside on-grid 3/4 kW).
  useEffect(() => {
    if (!systemType && plantLoadKw == null) return;
    const allowed = getPanelCompaniesForSelection(systemType, plantLoadKw);
    setPanelCompany((prev) => (prev && allowed.includes(prev) ? prev : ""));
  }, [systemType, plantLoadKw]);

  // Auto-resolve wattage when company or system type changes.
  useEffect(() => {
    if (!systemType || !panelCompany || isTataBrand(panelCompany)) return;
    const opts = getWattOptionsForCompany(panelCompany, systemType);
    if (opts.length === 1) {
      setPanelWatt(opts[0].id);
    } else {
      setPanelWatt((prev) => (opts.some((o) => o.id === prev) ? prev : null));
    }
  }, [systemType, panelCompany]);

  // Drop the chosen inverter brand if it is no longer allowed for the configuration.
  useEffect(() => {
    if (!systemType || plantLoadKw == null || isTata) return;
    const allowed = getAllowedInverterBrands(systemType, plantLoadKw);
    setInverterBrand((prev) => (allowed.includes(prev) ? prev : ""));
  }, [systemType, plantLoadKw, isTata]);

  const resolvedWantsBattery =
    !isTata && (systemType === "hybrid" || systemType === "off-grid") ? wantsBattery : null;

  const selections = useMemo(
    () => ({
      plantLoadKw,
      installationType,
      systemType,
      floors: showFloorQuestion ? floors : null,
      wantsBattery: resolvedWantsBattery,
      panelCompany,
      panelWatt: isTata ? null : panelWatt,
      inverterBrand: resolvedInverterBrand,
    }),
    [
      plantLoadKw,
      installationType,
      systemType,
      floors,
      resolvedWantsBattery,
      panelCompany,
      panelWatt,
      resolvedInverterBrand,
      isTata,
      showFloorQuestion,
    ]
  );

  const formValid = isValidSelections(selections);
  const breakdown = formValid ? calculateQuoteBreakdown(selections) : null;

  useEffect(() => {
    pdfCacheRef.current = null;
    setPdfError(null);
  }, [wizardStep, quoteRef, breakdown?.finalPrice, customer, selections]);

  const flags = { isTata, tataEligible, showFloorQuestion, showBatteryQuestion, showInverter };
  const progress = computeProgress(selections, flags);

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
    setFloors(null);
    setInverterBrand("");
  }

  function handlePlantLoadChange(kw) {
    setPlantLoadKw(kw);
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
    setPanelWatt(null);
    setInverterBrand("");
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

  const inverterOptions = allowedInverterBrands.map((b) => ({
    id: b,
    label: b,
    preferred: b === preferredInverterBrand,
    desc:
      b === preferredInverterBrand
        ? getPreferredInverterDescription(systemType, plantLoadKw)
        : "Alternative — you may still select this brand",
  }));

  const wattCardOptions = wattOptions.map((o) => ({
    id: o.id,
    label: `${o.watt} Wp`,
    desc: o.rangeLabel,
  }));

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
              <p className="text-slate-400 text-xs mt-1">Progress: {progress}%</p>
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
                  subtitle="Required system capacity (1 – 10 kW)"
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
                    onChange={setWantsBattery}
                  />
                  {wantsBattery === true && (
                    <div className="mt-3">
                      <InfoNote>
                        A lithium battery is included automatically — matched to your inverter brand
                        {resolvedInverterBrand ? ` (${resolvedInverterBrand})` : ""} and DC bus voltage.
                      </InfoNote>
                    </div>
                  )}
                </div>
              )}

              <div className="border-t border-slate-100 pt-8">
                <SectionTitle
                  step={nextStep()}
                  title="Solar Panels"
                  subtitle="Choose the brand and module wattage"
                />
                <div className="space-y-5">
                  <div>
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                      Panel Company
                    </p>
                    {panelCompanyOptions.length === 0 ? (
                      <InfoNote>Select plant load and system type first.</InfoNote>
                    ) : (
                      <OptionCards
                        options={panelCompanyOptions}
                        value={panelCompany}
                        onChange={setPanelCompany}
                        columns={3}
                        compact
                      />
                    )}
                  </div>

                  {isTata && tataEligible && (
                    <InfoNote>
                      Complete pre-engineered <strong>Tata on-grid kit</strong> — panels, inverter and accessories are
                      bundled at a fixed price (₹2,00,000 for 3 kW · ₹2,50,000 for 4 kW). No further configuration
                      needed.
                    </InfoNote>
                  )}

                  {showWattSelector && (
                    <div>
                      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                        Module Wattage
                      </p>
                      {wattCardOptions.length === 0 ? (
                        <InfoNote tone="warn">No module wattage available for this company and system type.</InfoNote>
                      ) : wattCardOptions.length === 1 ? (
                        <InfoNote>
                          <span className="font-semibold text-kalpana-700">{wattCardOptions[0].label}</span>{" "}
                          ({wattCardOptions[0].desc}) — only option for {panelCompany}
                          {systemType === "off-grid" ? " off-grid (Topcon, Non-DCR)" : ""}.
                        </InfoNote>
                      ) : (
                        <OptionCards
                          options={wattCardOptions}
                          value={panelWatt}
                          onChange={setPanelWatt}
                          columns={3}
                          compact
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>

              {showInverter && (
                <div className="border-t border-slate-100 pt-8">
                  <SectionTitle
                    step={nextStep()}
                    title="Inverter Brand"
                    subtitle="Both brands available — preferred option is highlighted; you may choose either"
                  />
                  {inverterOptions.length === 0 ? (
                    <InfoNote>Select plant load and system type first.</InfoNote>
                  ) : inverterOptions.length === 1 ? (
                    <InfoNote>
                      <span className="font-semibold text-kalpana-700">{inverterOptions[0].id}</span> — only option for
                      this configuration (auto-applied).
                    </InfoNote>
                  ) : (
                    <OptionCards
                      options={inverterOptions}
                      value={resolvedInverterBrand}
                      onChange={setInverterBrand}
                      columns={2}
                      compact
                    />
                  )}
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
