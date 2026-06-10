import { useMemo, useState } from "react";
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
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center">
          {step}
        </span>
        <h3 className="font-bold text-slate-800">{title}</h3>
      </div>
      {subtitle && <p className="text-slate-500 text-sm ml-8">{subtitle}</p>}
    </div>
  );
}

function OptionCards({ options, value, onChange, columns = 2 }) {
  const gridCls =
    columns === 3
      ? "grid sm:grid-cols-3 gap-3"
      : columns === 4
      ? "grid grid-cols-2 sm:grid-cols-4 gap-3"
      : "grid sm:grid-cols-2 gap-3";

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
            className={`text-left p-4 rounded-xl border-2 transition-all ${
              selected
                ? "border-orange-500 bg-orange-50 shadow-sm shadow-orange-500/10"
                : "border-gray-200 bg-white hover:border-orange-300 hover:bg-orange-50/40"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <span className={`font-semibold text-sm ${selected ? "text-orange-600" : "text-slate-800"}`}>
                {label}
              </span>
              <span
                className={`w-4 h-4 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center ${
                  selected ? "border-orange-500" : "border-gray-300"
                }`}
              >
                {selected && <span className="w-2 h-2 rounded-full bg-orange-500" />}
              </span>
            </div>
            {desc && <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{desc}</p>}
          </button>
        );
      })}
    </div>
  );
}

function YesNoToggle({ value, onChange }) {
  return (
    <div className="flex gap-3">
      {[
        { id: true, label: "Yes" },
        { id: false, label: "No" },
      ].map((opt) => (
        <button
          key={String(opt.id)}
          type="button"
          onClick={() => onChange(opt.id)}
          className={`flex-1 py-3 rounded-xl text-sm font-semibold border-2 transition-all ${
            value === opt.id
              ? "border-orange-500 bg-orange-50 text-orange-600"
              : "border-gray-200 text-slate-600 hover:border-orange-300"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default function QuotationGenerator() {
  const [installationType, setInstallationType] = useState("");
  const [systemType, setSystemType] = useState("");
  const [wantsBattery, setWantsBattery] = useState(null);
  const [panelCompany, setPanelCompany] = useState("");
  const [panelCategory, setPanelCategory] = useState("");
  const [inverterBrand, setInverterBrand] = useState("");
  const [batteryBrand, setBatteryBrand] = useState("");
  const [showPrice, setShowPrice] = useState(false);

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

  const finalPrice = showPrice ? calculateQuote(selections) : null;

  function handleSystemTypeChange(type) {
    setSystemType(type);
    setWantsBattery(null);
    setBatteryBrand("");
    setShowPrice(false);
  }

  function handleGetPrice() {
    if (isFormValid(selections)) setShowPrice(true);
  }

  function handleReset() {
    setInstallationType("");
    setSystemType("");
    setWantsBattery(null);
    setPanelCompany("");
    setPanelCategory("");
    setInverterBrand("");
    setBatteryBrand("");
    setShowPrice(false);
  }

  return (
    <section id="quotation" className="py-20 bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-orange-500 font-semibold text-sm uppercase tracking-widest">
            Instant Quote
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
            Configure Your Solar System
          </h2>
          <p className="text-slate-500 mt-3 max-w-lg mx-auto">
            Select your preferences below and get an estimated final price — no itemised breakdown, just your number.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500" />

          <div className="p-6 sm:p-8 space-y-10">
            {/* Step 1 */}
            <div>
              <SectionTitle step={1} title="Installation Type" subtitle="Where will the system be installed?" />
              <OptionCards
                options={INSTALLATION_TYPES}
                value={installationType}
                onChange={(v) => {
                  setInstallationType(v);
                  setShowPrice(false);
                }}
                columns={2}
              />
            </div>

            {/* Step 2 */}
            <div>
              <SectionTitle step={2} title="System Type" subtitle="Choose your solar system configuration" />
              <OptionCards
                options={SYSTEM_TYPES}
                value={systemType}
                onChange={handleSystemTypeChange}
                columns={3}
              />
            </div>

            {/* Battery — Hybrid only */}
            {showBatteryQuestion && (
              <div>
                <SectionTitle step={3} title="Battery Backup" subtitle="Do you want battery storage with your hybrid system?" />
                <YesNoToggle
                  value={wantsBattery}
                  onChange={(v) => {
                    setWantsBattery(v);
                    if (!v) setBatteryBrand("");
                    setShowPrice(false);
                  }}
                />
              </div>
            )}

            {/* Step 3/4 — Panels */}
            <div>
              <SectionTitle
                step={showBatteryQuestion ? 4 : 3}
                title="Solar Panels"
                subtitle="Select panel brand and technology"
              />
              <div className="space-y-5">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Panel Company</p>
                  <OptionCards
                    options={PANEL_COMPANIES}
                    value={panelCompany}
                    onChange={(v) => {
                      setPanelCompany(v);
                      setShowPrice(false);
                    }}
                    columns={3}
                  />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Panel Category</p>
                  <OptionCards
                    options={PANEL_CATEGORIES}
                    value={panelCategory}
                    onChange={(v) => {
                      setPanelCategory(v);
                      setShowPrice(false);
                    }}
                    columns={2}
                  />
                </div>
              </div>
            </div>

            {/* Inverter */}
            <div>
              <SectionTitle
                step={showBatteryQuestion ? 5 : 4}
                title="Inverter"
                subtitle="Choose your inverter brand"
              />
              <OptionCards
                options={INVERTER_BRANDS}
                value={inverterBrand}
                onChange={(v) => {
                  setInverterBrand(v);
                  setShowPrice(false);
                }}
                columns={2}
              />
            </div>

            {/* Battery brand */}
            {showBatteryBrand && (
              <div>
                <SectionTitle step={6} title="Battery Brand" subtitle="Select your preferred battery manufacturer" />
                <OptionCards
                  options={BATTERY_BRANDS}
                  value={batteryBrand}
                  onChange={(v) => {
                    setBatteryBrand(v);
                    setShowPrice(false);
                  }}
                  columns={2}
                />
              </div>
            )}
          </div>

          {/* Price & actions */}
          <div className="border-t border-gray-100 bg-slate-50/80 p-6 sm:p-8">
            {showPrice && isFormValid(selections) ? (
              <div className="text-center mb-6">
                <p className="text-sm font-medium text-slate-500 mb-2">Your Estimated Final Price</p>
                {finalPrice != null ? (
                  <p className="text-4xl sm:text-5xl font-extrabold text-slate-900">{formatINR(finalPrice)}</p>
                ) : (
                  <div className="py-2">
                    <p className="text-2xl font-bold text-slate-400">Pricing coming soon</p>
                    <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
                      Your configuration has been saved. Final rates for this combination will be added shortly.
                    </p>
                  </div>
                )}
                <p className="text-xs text-slate-400 mt-3">GST inclusive · Subject to site survey confirmation</p>
              </div>
            ) : (
              <p className="text-center text-sm text-slate-500 mb-6">
                Complete all selections above to reveal your estimated price.
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={handleGetPrice}
                disabled={!isFormValid(selections)}
                className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed text-white font-bold px-8 py-3 rounded-full transition-colors text-sm shadow-md shadow-orange-500/20"
              >
                Get Final Price
              </button>
              {(installationType || systemType || panelCompany) && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="border border-gray-200 text-slate-600 hover:bg-white font-semibold px-8 py-3 rounded-full transition-colors text-sm"
                >
                  Reset
                </button>
              )}
            </div>

            <p className="text-center text-xs text-slate-400 mt-5">
              Need a detailed proposal?{" "}
              <a href="#contact" className="text-orange-500 hover:underline font-medium">
                Contact our team
              </a>
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
