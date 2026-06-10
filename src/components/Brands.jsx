const brands = [
  { name: "Adani Solar", cat: "Panels & Inverters", color: "border-blue-200 bg-blue-50" },
  { name: "Tata Power Solar", cat: "Panels & EPC", color: "border-teal-200 bg-teal-50" },
  { name: "Waaree", cat: "Solar Panels", color: "border-orange-200 bg-orange-50" },
  { name: "Microtech", cat: "Inverters & Panels", color: "border-purple-200 bg-purple-50" },
  { name: "Luminous", cat: "Inverters & Batteries", color: "border-yellow-200 bg-yellow-50" },
  { name: "Growatt", cat: "Inverters", color: "border-green-200 bg-green-50" },
  { name: "Delta", cat: "Inverters", color: "border-red-200 bg-red-50" },
  { name: "Havells", cat: "Inverters", color: "border-indigo-200 bg-indigo-50" },
  { name: "Exide", cat: "Batteries", color: "border-slate-200 bg-slate-50" },
  { name: "Okaya", cat: "Batteries", color: "border-pink-200 bg-pink-50" },
  { name: "UTL Solar", cat: "Panels & Inverters", color: "border-cyan-200 bg-cyan-50" },
  { name: "Su-Kam", cat: "Inverters", color: "border-lime-200 bg-lime-50" },
];

export default function Brands() {
  return (
    <section id="brands" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-orange-500 font-semibold text-sm uppercase tracking-widest">Our Partners</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
            Brands We Carry
          </h2>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto">
            Authorised dealer and wholesale distributor for all leading solar brands in India.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {brands.map((b) => (
            <div
              key={b.name}
              className={`border-2 ${b.color} rounded-2xl p-5 flex flex-col items-center text-center hover:scale-105 transition-transform`}
            >
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-orange-500">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" strokeLinecap="round" />
                </svg>
              </div>
              <p className="font-bold text-slate-800 text-sm">{b.name}</p>
              <p className="text-slate-500 text-xs mt-0.5">{b.cat}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-slate-500 text-sm">
            Do not see your preferred brand?{" "}
            <a href="#contact" className="text-orange-500 font-semibold hover:underline">
              Get in touch
            </a>{" "}
            — we source from any manufacturer on request.
          </p>
        </div>
      </div>
    </section>
  );
}