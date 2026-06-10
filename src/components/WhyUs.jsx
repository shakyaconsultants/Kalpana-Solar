const reasons = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    title: "Competitive Wholesale Pricing",
    desc: "Direct procurement from manufacturers ensures the best market rates for dealers, contractors, and project developers. Volume discounts available.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
    title: "All Brands, One Source",
    desc: "Adani, Tata, Waaree, Microtech, Luminous, Growatt, Delta and more — simplify your procurement by sourcing everything from a single trusted distributor.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
    title: "Turnkey Installation",
    desc: "Rooftop survey, structural design, panel installation, inverter commissioning, and net metering application — all handled by our certified teams.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M9 14l-4-4 4-4" />
        <path d="M5 10h11a4 4 0 0 1 0 8h-1" />
      </svg>
    ),
    title: "Subsidy and Net Metering",
    desc: "We assist with PM Surya Ghar subsidy claims, state-level MNRE benefits, and complete DISCOM net metering documentation — making solar hassle-free.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "After-Sales and AMC",
    desc: "Annual maintenance contracts, panel cleaning, inverter servicing, and yield performance monitoring — we support your system long after installation.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <rect x="1" y="3" width="15" height="13" rx="2" />
        <path d="M16 8h4l3 3v5h-7V8z" />
        <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
    title: "Fast Delivery and Logistics",
    desc: "Well-stocked inventory with quick dispatch. Bulk orders managed with proper packaging to ensure panels and inverters arrive damage-free at your site.",
  },
];

export default function WhyUs() {
  return (
    <section id="why-us" className="py-20" style={{ background: "linear-gradient(135deg, #0f1623 0%, #1a2744 100%)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-orange-400 font-semibold text-sm uppercase tracking-widest">Our Advantage</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
            Why Choose Kalpana Solar Traders
          </h2>
          <p className="text-slate-400 mt-3 max-w-xl mx-auto">
            Over the years we have built a reputation for reliability, quality products, and exceptional service.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((r, i) => (
            <div
              key={r.title}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
            >
              <div className="w-11 h-11 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center mb-4">
                {r.icon}
              </div>
              <h3 className="text-white font-bold text-base mb-2">{r.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}