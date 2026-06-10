import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
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
    <div className="rounded-xl border border-orange-500/25 bg-orange-950/20 mb-4 overflow-hidden">
      <div className="px-3 py-2.5 bg-orange-500/10 border-b border-orange-500/20">
        <p className="text-orange-400 font-semibold text-xs">Recommended system mapping</p>
        <p className="text-[10px] text-slate-400 mt-0.5">Lowest-cost compatible configuration</p>
      </div>

      <div className="px-3 py-2 space-y-3">
        {/* Wiring / floors */}
        {system?.wiring && (
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="w-5 h-5 rounded-md bg-purple-500/20 flex items-center justify-center text-purple-400 text-[10px] font-bold">
                W
              </span>
              <span className="text-xs font-semibold text-slate-200">Wiring</span>
            </div>
            <div className="pl-6 space-y-0">
              <ConfigMapRow
                label="Building floors"
                value={`${system.floors} floor${system.floors > 1 ? "s" : ""}`}
              />
              <ConfigMapRow
                label="Rate"
                value={
                  system.systemType === "hybrid"
                    ? "₹5,000 per floor (hybrid)"
                    : "₹3,000 per floor (on-grid)"
                }
              />
              <ConfigMapRow label="Wiring cost" value={system.wiring.summary} />
            </div>
          </div>
        )}

        {/* Panels */}
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="w-5 h-5 rounded-md bg-amber-500/20 flex items-center justify-center text-amber-400 text-[10px] font-bold">
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
              <ConfigMapRow label="Status" value="Not included in this configuration" hint="Hybrid without backup storage" />
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

  const systemLabel = SYSTEM_TYPES.find((s) => s.id === selections.systemType)?.label;
  const panelCategoryLabel = PANEL_CATEGORIES.find((c) => c.id === selections.panelCategory)?.label;

  const batterySummary =
    selections.systemType === "hybrid"
      ? selections.wantsBattery == null
        ? null
        : selections.wantsBattery
        ? selections.batteryBrand || "Yes — select brand"
        : "Not included"
      : selections.batteryBrand || "Not selected";

  const batteryDone =
    selections.systemType === "hybrid"
      ? selections.wantsBattery != null &&
        (!selections.wantsBattery || !!selections.batteryBrand)
      : !!selections.batteryBrand;

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
          <p className="text-slate-500 text-[10px] mt-3 uppercase tracking-wide">
            inclusive of GST where applicable
          </p>
        </div>

        {matched && <MatchedConfiguration matched={matched} />}

        {/* Your selections */}
        <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-2 px-0.5">Your selections</p>
        <div className="rounded-xl bg-black/20 border border-white/5 px-3 py-0.5 mb-4">
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
          {(selections.systemType === "hybrid" ||
            selections.systemType === "on-grid" ||
            selections.systemType === "off-grid") && (
            <SummaryRow
              label="Battery"
              value={batterySummary || "Not selected"}
              done={batteryDone}
            />
          )}
          {systemNeedsWiring(selections.systemType) && (
            <SummaryRow
              label="Floors (wiring)"
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
  const [plantLoadKw, setPlantLoadKw] = useState(null);
  const [installationType, setInstallationType] = useState("");
  const [systemType, setSystemType] = useState("");
  const [floors, setFloors] = useState(null);
  const [wantsBattery, setWantsBattery] = useState(null);
  const [panelCompany, setPanelCompany] = useState("");
  const [panelCategory, setPanelCategory] = useState("");
  const [inverterBrand, setInverterBrand] = useState("");
  const [batteryBrand, setBatteryBrand] = useState("");

  const allowedInverterBrands = useMemo(
    () => (systemType && plantLoadKw ? getAllowedInverterBrands(systemType, plantLoadKw) : []),
    [systemType, plantLoadKw]
  );

  const resolvedInverterBrand = useMemo(
    () => resolveInverterBrand(systemType, plantLoadKw, inverterBrand),
    [systemType, plantLoadKw, inverterBrand]
  );

  const showBatteryQuestion = systemType === "hybrid";
  const showBatteryBrand =
    systemType === "on-grid" ||
    systemType === "off-grid" ||
    (systemType === "hybrid" && wantsBattery === true);
  const showFloorQuestion = systemType === "on-grid" || systemType === "hybrid";

  const resolvedWantsBattery =
    systemType === "hybrid"
      ? wantsBattery
      : systemType === "on-grid" || systemType === "off-grid"
      ? true
      : null;

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
  const progress = computeProgress(selections, showBatteryQuestion, showBatteryBrand, showFloorQuestion);
  const hasAnySelection = !!(plantLoadKw || installationType || systemType || panelCompany);

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
                    title="Plant Load"
                    subtitle="Required system capacity"
                  />
                  <OptionCards
                    options={PLANT_LOAD_OPTIONS}
                    value={plantLoadKw}
                    onChange={handlePlantLoadChange}
                    columns={4}
                    compact
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
                      subtitle={
                        systemType === "hybrid"
                          ? "Wiring: ₹5,000 per floor"
                          : "Wiring: ₹3,000 per floor"
                      }
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
                    <p className="text-sm text-slate-600 bg-orange-50 border border-orange-200 rounded-xl px-4 py-3">
                      <span className="font-semibold text-orange-700">{allowedInverterBrands[0]}</span>
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

  if (systemType === "hybrid") {
    if (wantsBattery == null) return false;
    if (wantsBattery && !batteryBrand) return false;
  } else if (systemType === "on-grid" || systemType === "off-grid") {
    if (!batteryBrand) return false;
  }

  return true;
}
