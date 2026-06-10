import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  INSTALLATION_TYPES,
  SYSTEM_TYPES,
  PANEL_COMPANIES,
  PANEL_CATEGORIES,
  INVERTER_BRANDS,
  BATTERY_BRANDS,
  calculateQuote,
  formatINR,
} from "../data/quotationData";

function SectionTitle({ step, title, subtitle }) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2.5">
        <span className="w-7 h-7 rounded-lg bg-orange-500 text-white text-xs font-bold flex items-center justify-center shrink-0">
          {step}
        </span>
        <div>
          <h3 className="font-bold text-slate-800 text-sm">{title}</h3>
          {subtitle && <p className="text-slate-500 text-xs mt-0.5">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}

function OptionCards({ options, value, onChange, columns = 2, compact = false }) {
  const gridCls =
    columns === 3
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
                ? "border-orange-500 bg-orange-50 ring-1 ring-orange-500/20"
                : "border-slate-200 bg-white hover:border-orange-300 hover:bg-orange-50/30"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className={`font-semibold text-sm ${selected ? "text-orange-600" : "text-slate-800"}`}>
                {label}
              </span>
              <span
                className={`w-3.5 h-3.5 rounded-full border-2 shrink-0 flex items-center justify-center ${
                  selected ? "border-orange-500 bg-orange-500" : "border-slate-300"
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
              ? "border-orange-500 bg-orange-50 text-orange-600"
              : "border-slate-200 text-slate-600 hover:border-orange-300 bg-white"
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

function PricePanel({ selections, formValid, progress, onReset, hasAnySelection }) {
  const finalPrice = formValid ? calculateQuote(selections) : null;

  const systemLabel = SYSTEM_TYPES.find((s) => s.id === selections.systemType)?.label;
  const panelCategoryLabel = PANEL_CATEGORIES.find((c) => c.id === selections.panelCategory)?.label;

  const batterySummary =
    selections.systemType === "hybrid"
      ? selections.wantsBattery == null
        ? null
        : selections.wantsBattery
        ? selections.batteryBrand || "Yes — select brand"
        : "Not included"
      : selections.systemType === "off-grid"
      ? "Included (off-grid)"
      : "Not required";

  return (
    <div className="rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-800/50">
      <div
        className="p-5 rounded-2xl"
        style={{ background: "linear-gradient(160deg, #0f1623 0%, #1a2744 55%, #142010 100%)" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2" strokeWidth="2" stroke="white" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <p className="text-white font-bold text-sm">Your Quote Summary</p>
            <p className="text-slate-400 text-xs">Updates as you configure</p>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-slate-400">Configuration progress</span>
            <span className="text-orange-400 font-semibold">{progress}%</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Price hero */}
        <div className="bg-white/5 rounded-xl border border-white/10 p-4 mb-4 text-center">
          <p className="text-slate-400 text-xs uppercase tracking-widest font-medium mb-2">
            Estimated Final Price
          </p>
          {formValid ? (
            finalPrice != null ? (
              <p className="text-4xl font-extrabold text-white tracking-tight">{formatINR(finalPrice)}</p>
            ) : (
              <div>
                <p className="text-2xl font-bold text-slate-300">—</p>
                <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                  Rates for this combination will be added soon.
                </p>
              </div>
            )
          ) : (
            <div>
              <p className="text-3xl font-bold text-slate-600">—</p>
              <p className="text-slate-400 text-xs mt-2">Complete the form to see your price</p>
            </div>
          )}
          <p className="text-slate-500 text-[10px] mt-3 uppercase tracking-wide">
            GST inclusive · Site survey required
          </p>
        </div>

        {/* Selection summary */}
        <div className="rounded-xl bg-black/20 border border-white/5 px-3 py-0.5 mb-4">
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
          {selections.systemType === "hybrid" && (
            <SummaryRow
              label="Battery"
              value={batterySummary || "Not selected"}
              done={selections.wantsBattery != null && (!selections.wantsBattery || !!selections.batteryBrand)}
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

        <Link
          to="/#contact"
          className="flex items-center justify-center gap-2 w-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold py-3 rounded-xl transition-colors"
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
            className="w-full mt-3 text-slate-400 hover:text-white text-xs font-medium py-2 transition-colors"
          >
            Reset configuration
          </button>
        )}
      </div>
    </div>
  );
}

function computeProgress(selections, showBatteryQuestion) {
  const steps = [
    !!selections.installationType,
    !!selections.systemType,
  ];

  if (showBatteryQuestion) {
    steps.push(
      selections.wantsBattery != null &&
        (!selections.wantsBattery || !!selections.batteryBrand)
    );
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
  const [installationType, setInstallationType] = useState("");
  const [systemType, setSystemType] = useState("");
  const [wantsBattery, setWantsBattery] = useState(null);
  const [panelCompany, setPanelCompany] = useState("");
  const [panelCategory, setPanelCategory] = useState("");
  const [inverterBrand, setInverterBrand] = useState("");
  const [batteryBrand, setBatteryBrand] = useState("");

  const showBatteryQuestion = systemType === "hybrid";
  const showBatteryBrand = systemType === "hybrid" && wantsBattery === true;

  const selections = useMemo(
    () => ({
      installationType,
      systemType,
      wantsBattery: showBatteryQuestion ? wantsBattery : null,
      panelCompany,
      panelCategory,
      inverterBrand,
      batteryBrand: showBatteryBrand ? batteryBrand : null,
    }),
    [
      installationType,
      systemType,
      wantsBattery,
      panelCompany,
      panelCategory,
      inverterBrand,
      batteryBrand,
      showBatteryQuestion,
      showBatteryBrand,
    ]
  );

  const formValid = isFormValid(selections);
  const progress = computeProgress(selections, showBatteryQuestion);
  const hasAnySelection = !!(installationType || systemType || panelCompany);

  function handleSystemTypeChange(type) {
    setSystemType(type);
    setWantsBattery(null);
    setBatteryBrand("");
  }

  function handleReset() {
    setInstallationType("");
    setSystemType("");
    setWantsBattery(null);
    setPanelCompany("");
    setPanelCategory("");
    setInverterBrand("");
    setBatteryBrand("");
  }

  let stepCounter = 0;
  const nextStep = () => ++stepCounter;

  const pricePanel = (
    <PricePanel
      selections={selections}
      formValid={formValid}
      progress={progress}
      onReset={handleReset}
      hasAnySelection={hasAnySelection}
    />
  );

  const trustNote = (
    <div className="flex items-start gap-3 mt-4 px-1">
      <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
        <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      </div>
      <p className="text-slate-500 text-xs leading-relaxed">
        All prices are indicative. A free site survey confirms final sizing, structure, and subsidy eligibility.
      </p>
    </div>
  );

  return (
    <section className="pb-16 lg:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile — price summary on top */}
        <aside className="lg:hidden mb-8">
          {pricePanel}
          {trustNote}
        </aside>

        <div className="lg:flex lg:gap-10 lg:items-stretch">
          <aside className="hidden lg:block lg:w-[360px] xl:w-[400px] shrink-0">
            <div className="sticky top-24">
              {pricePanel}
            </div>
            {trustNote}
          </aside>

          {/* Configuration form */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="px-6 sm:px-8 py-5 border-b border-slate-100 bg-slate-50/50">
                <h2 className="font-bold text-slate-900">Configure Your System</h2>
                <p className="text-slate-500 text-sm mt-0.5">
                  Select each option — your price updates live on the left.
                </p>
              </div>

              <div className="p-6 sm:p-8 space-y-8">
                <div>
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

                {showBatteryQuestion && (
                  <div className="border-t border-slate-100 pt-8">
                    <SectionTitle
                      step={nextStep()}
                      title="Battery Backup"
                      subtitle="Add storage for power cuts"
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
                    title="Inverter"
                    subtitle="Choose your inverter brand"
                  />
                  <OptionCards
                    options={INVERTER_BRANDS}
                    value={inverterBrand}
                    onChange={setInverterBrand}
                    columns={2}
                    compact
                  />
                </div>

                {showBatteryBrand && (
                  <div className="border-t border-slate-100 pt-8">
                    <SectionTitle
                      step={nextStep()}
                      title="Battery Brand"
                      subtitle="Select battery manufacturer"
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
            </div>

            <p className="lg:hidden text-center text-xs text-slate-400 mt-5 px-4 leading-relaxed">
              All prices are indicative. A free site survey confirms final sizing and subsidy eligibility.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function isFormValid(selections) {
  const {
    installationType,
    systemType,
    wantsBattery,
    panelCompany,
    panelCategory,
    inverterBrand,
    batteryBrand,
  } = selections;

  if (!installationType || !systemType || !panelCompany || !panelCategory || !inverterBrand) {
    return false;
  }

  if (systemType === "hybrid") {
    if (wantsBattery == null) return false;
    if (wantsBattery && !batteryBrand) return false;
  }

  return true;
}
