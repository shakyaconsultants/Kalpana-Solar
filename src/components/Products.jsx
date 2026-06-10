import { useState } from "react";
import SectionHeader from "./ui/SectionHeader";

const tabs = ["Solar Panels", "Inverters", "Batteries"];

const panels = [
  { type: "Topcon (N-Type)", grade: "High Efficiency", brands: "Adani, Waaree, Vikram", range: "590W – 620W", supply: "Wholesale" },
  { type: "Bifacial Panels", grade: "Premium", brands: "Adani, Waaree, Vikram", range: "550W", supply: "Wholesale" },
  { type: "DCR Panels", grade: "Subsidy Eligible", brands: "Adani, Waaree", range: "On-grid & Hybrid", supply: "Wholesale" },
  { type: "Non-DCR Panels", grade: "Off-Grid", brands: "Vikram, Waaree", range: "Off-grid systems", supply: "Wholesale" },
];

const inverters = [
  { type: "String Inverter (On-Grid)", application: "Grid-Tied", brands: "Invergy, Microtek", range: "3kW – 100kW", supply: "Wholesale" },
  { type: "Hybrid Inverter", application: "Grid + Battery", brands: "Invergy, Microtek", range: "3kW – 10kW", supply: "Wholesale" },
  { type: "Off-Grid Inverter", application: "Standalone", brands: "Invergy, Microtek", range: "2kW – 10kW", supply: "Wholesale" },
];

const batteries = [
  { type: "LFP Lithium (Microtek)", chem: "LiFePO₄", brands: "Microtek", range: "1.28 – 5.12 kWh", supply: "Wholesale" },
  { type: "LFP Lithium (Invergy)", chem: "LiFePO₄", brands: "Invergy", range: "0.96 – 5.12 kWh", supply: "Wholesale" },
];

const dataMap = {
  "Solar Panels": { rows: panels, cols: ["Panel Type", "Grade", "Brands", "Wattage", "Supply"] },
  Inverters: { rows: inverters, cols: ["Inverter Type", "Application", "Brands", "Capacity", "Supply"] },
  Batteries: { rows: batteries, cols: ["Battery Type", "Chemistry", "Brands", "Capacity", "Supply"] },
};

function SupplyBadge({ val }) {
  return (
    <span className="inline-flex bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ring-1 ring-emerald-600/20">
      {val}
    </span>
  );
}

export default function Products() {
  const [active, setActive] = useState("Solar Panels");
  const { rows, cols } = dataMap[active];

  return (
    <section id="products" className="section-padding bg-white">
      <div className="container-main">
        <SectionHeader
          eyebrow="Wholesale Supply"
          title="Products We Distribute"
          description="All major brands at competitive wholesale rates. Bulk orders, dealer pricing, and project procurement under one roof."
        />

        <div className="flex flex-wrap justify-center gap-2 mb-8 p-1.5 bg-slate-100 rounded-2xl max-w-md mx-auto">
          {tabs.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setActive(t)}
              className={`flex-1 min-w-[100px] px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                active === t
                  ? "bg-white text-orange-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Desktop table */}
        <div className="hidden md:block card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-900 text-white">
                {cols.map((c) => (
                  <th key={c} className="text-left px-5 py-4 font-bold text-[11px] uppercase tracking-wider">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => {
                const vals = Object.values(row);
                return (
                  <tr
                    key={i}
                    className={`border-t border-slate-100 hover:bg-orange-50/40 transition-colors ${
                      i % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                    }`}
                  >
                    {vals.map((v, j) => (
                      <td key={j} className={`px-5 py-4 ${j === 0 ? "font-bold text-slate-900" : "text-slate-600"}`}>
                        {j === vals.length - 1 ? <SupplyBadge val={v} /> : v}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-3">
          {rows.map((row, i) => {
            const vals = Object.values(row);
            return (
              <div key={i} className="card p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-bold text-slate-900">{vals[0]}</p>
                  <SupplyBadge val={vals[vals.length - 1]} />
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><span className="text-slate-400">{cols[1]}:</span> <span className="text-slate-700 font-medium">{vals[1]}</span></div>
                  <div><span className="text-slate-400">{cols[3]}:</span> <span className="text-slate-700 font-medium">{vals[3]}</span></div>
                  <div className="col-span-2"><span className="text-slate-400">{cols[2]}:</span> <span className="text-slate-700 font-medium">{vals[2]}</span></div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200/60 rounded-2xl p-5 sm:p-6 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
            </svg>
          </div>
          <div>
            <p className="text-slate-900 font-bold">Custom orders welcome</p>
            <p className="text-slate-600 text-sm mt-1 leading-relaxed">
              Need a specific brand, wattage, or bulk quantity? We source directly from manufacturers.{" "}
              <a href="#contact" className="text-orange-600 font-semibold hover:underline">
                Contact us
              </a>{" "}
              for competitive pricing.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
