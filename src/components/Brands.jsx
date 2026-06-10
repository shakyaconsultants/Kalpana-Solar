import SectionHeader from "./ui/SectionHeader";

const brands = [
  { name: "Adani Solar", cat: "Panels & Inverters" },
  { name: "Waaree", cat: "Solar Panels" },
  { name: "Vikram Solar", cat: "Solar Panels" },
  { name: "Invergy", cat: "Inverters & LFP" },
  { name: "Microtek", cat: "Inverters & Batteries" },
  { name: "Tata Power Solar", cat: "Panels & EPC" },
  { name: "Growatt", cat: "Inverters" },
  { name: "Delta", cat: "Inverters" },
  { name: "Havells", cat: "Inverters" },
  { name: "Luminous", cat: "Inverters" },
  { name: "Exide", cat: "Batteries" },
  { name: "UTL Solar", cat: "Panels & Inverters" },
];

export default function Brands() {
  return (
    <section id="brands" className="section-padding bg-slate-50">
      <div className="container-main">
        <SectionHeader
          eyebrow="Our Partners"
          title="Brands We Carry"
          description="Authorised dealer and wholesale distributor for India's leading solar equipment manufacturers."
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {brands.map((b) => (
            <div
              key={b.name}
              className="card card-hover p-5 flex flex-col items-center text-center group"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl flex items-center justify-center mb-3 group-hover:from-kalpana-50 group-hover:to-kalpana-100 transition-colors">
                <span className="text-lg font-extrabold text-kalpana-500">{b.name.charAt(0)}</span>
              </div>
              <p className="font-bold text-slate-900 text-sm">{b.name}</p>
              <p className="text-slate-500 text-xs mt-1">{b.cat}</p>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-slate-600 text-sm">
          Don&apos;t see your preferred brand?{" "}
          <a href="#contact" className="text-kalpana-600 font-bold hover:underline">
            Get in touch
          </a>{" "}
          — we source from any manufacturer on request.
        </p>
      </div>
    </section>
  );
}
