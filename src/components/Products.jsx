import { useState } from "react";

const tabs = ["Solar Panels", "Inverters", "Batteries"];

const panels = [
  { type: "Mono PERC Half-Cut", grade: "High Efficiency", brands: "Adani, Waaree, Tata", range: "400W - 600W", supply: "Wholesale" },
  { type: "Monocrystalline", grade: "Standard Grade", brands: "Waaree, UTL Solar", range: "330W - 450W", supply: "Wholesale" },
  { type: "Polycrystalline", grade: "Budget Grade", brands: "Microtech, UTL", range: "250W - 380W", supply: "Wholesale" },
  { type: "Bifacial Panels", grade: "Premium", brands: "Adani, Tata", range: "440W - 620W", supply: "Wholesale" },
  { type: "Flexible Panels", grade: "Specialty", brands: "Multiple", range: "100W - 300W", supply: "On Order" },
];

const inverters = [
  { type: "String Inverter (On-Grid)", application: "Grid-Tied", brands: "Adani, Growatt, Delta", range: "1kW - 100kW", supply: "Wholesale" },
  { type: "Hybrid Inverter", application: "On-Grid + Battery", brands: "Luminous, Growatt", range: "3kW - 30kW", supply: "Wholesale" },
  { type: "Off-Grid Inverter", application: "Standalone", brands: "Microtech, UTL, Su-Kam", range: "500W - 20kW", supply: "Wholesale" },
  { type: "Solar PCU", application: "Integrated Unit", brands: "Luminous, Havells", range: "1kW - 10kW", supply: "Wholesale" },
  { type: "Micro Inverter", application: "Module-Level", brands: "Multiple", range: "250W - 400W", supply: "On Order" },
];

const batteries = [
  { type: "Lithium Iron Phosphate (LFP)", chem: "Long-cycle Life", brands: "Adani, Multiple", range: "5kWh - 50kWh", supply: "Wholesale" },
  { type: "VRLA / AGM Battery", chem: "Low Maintenance", brands: "Exide, Okaya", range: "100Ah - 200Ah", supply: "Wholesale" },
  { type: "Tall Tubular Battery", chem: "Deep Cycle", brands: "Exide, Luminous", range: "100Ah - 220Ah", supply: "Wholesale" },
];

const dataMap = {
  "Solar Panels": { rows: panels, cols: ["Panel Type", "Grade", "Brands", "Wattage", "Supply"] },
  "Inverters": { rows: inverters, cols: ["Inverter Type", "Application", "Brands", "Capacity", "Supply"] },
  "Batteries": { rows: batteries, cols: ["Battery Type", "Chemistry", "Brands", "Capacity", "Supply"] },
};

function SupplyBadge({ val }) {
  return val === "Wholesale" ? (
    <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">{val}</span>
  ) : (
    <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">{val}</span>
  );
}

export default function Products() {
  const [active, setActive] = useState("Solar Panels");
  const { rows, cols } = dataMap[active];

  return (
    <section id="products" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-orange-500 font-semibold text-sm uppercase tracking-widest">Wholesale Supply</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
            Products We Distribute
          </h2>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto">
            All major brands at wholesale prices. Bulk orders, dealer pricing, and project procurement —
            handled under one roof.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-8">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setActive(t)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                active === t
                  ? "bg-orange-500 text-white shadow"
                  : "bg-white border border-gray-200 text-slate-600 hover:border-orange-300 hover:text-orange-600"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-800 text-white">
                {cols.map((c) => (
                  <th key={c} className="text-left px-5 py-3.5 font-semibold text-xs uppercase tracking-wider">
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
                    className={`border-t border-gray-50 hover:bg-orange-50/50 transition-colors ${
                      i % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                    }`}
                  >
                    {vals.map((v, j) => (
                      <td key={j} className={`px-5 py-3.5 ${j === 0 ? "font-semibold text-slate-800" : "text-slate-600"}`}>
                        {j === vals.length - 1 ? <SupplyBadge val={v} /> : v}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-6 bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start gap-3">
          <div className="text-orange-500 mt-0.5 shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <p className="text-orange-700 font-semibold text-sm">Custom Orders Welcome</p>
            <p className="text-orange-600 text-sm mt-0.5">
              Need a specific brand, wattage, or bulk quantity not listed? We source directly from manufacturers.
              <a href="#contact" className="underline ml-1 font-semibold">Contact us</a> for competitive pricing.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}