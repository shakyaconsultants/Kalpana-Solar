const services = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-7 h-7">
        <path d="M12 3v1m0 16v1M4.22 4.22l.71.71m13.94 13.94.71.71M3 12H4m16 0h1M4.93 19.07l.71-.71M18.36 5.64l.71-.71" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    ),
    title: "Rooftop On-Grid Solar",
    tag: "Grid-Tied",
    tagColor: "bg-green-100 text-green-700",
    desc: "Connect your rooftop system directly to the utility grid. Export surplus power, earn credits, and eliminate your electricity bill — no batteries needed.",
    detail: "Ideal for homes and offices with a reliable grid supply.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-7 h-7">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
        <line x1="12" y1="12" x2="12" y2="16" />
        <line x1="10" y1="14" x2="14" y2="14" />
      </svg>
    ),
    title: "Off-Grid Solar",
    tag: "Standalone",
    tagColor: "bg-blue-100 text-blue-700",
    desc: "Fully independent systems with battery backup — perfect for remote locations, farms, telecom towers, and areas with frequent power cuts.",
    detail: "Ideal for rural areas and locations with no grid access.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-7 h-7">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
    title: "Hybrid Solar",
    tag: "Hybrid",
    tagColor: "bg-amber-100 text-amber-700",
    desc: "Stay grid-connected with battery backup. Power your home during outages while exporting excess energy — the smartest solar investment.",
    detail: "Ideal for urban homes concerned about power cuts.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-7 h-7">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    title: "Residential Solar",
    tag: "Home",
    tagColor: "bg-purple-100 text-purple-700",
    desc: "Turnkey rooftop installations for homes from 1kW to 20kW. Includes government subsidy assistance, net metering application, and end-to-end support.",
    detail: "Systems: 1kW to 20kW | PM Surya Ghar subsidy eligible.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-7 h-7">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    title: "Commercial Solar",
    tag: "Commercial",
    tagColor: "bg-orange-100 text-orange-700",
    desc: "Large-scale installations for factories, warehouses, hotels, and hospitals. Reduce OPEX significantly — ROI typically within 3 to 4 years.",
    detail: "Systems: 20kW to 1MW+ | Industrial grade components.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-7 h-7">
        <path d="M12 22V12M12 12C12 7 8 4 3 4M12 12C12 7 16 4 21 4" />
        <path d="M3 4C3 9 7 12 12 12" />
        <path d="M21 4C21 9 17 12 12 12" />
      </svg>
    ),
    title: "Solar Water Pump",
    tag: "Agriculture",
    tagColor: "bg-teal-100 text-teal-700",
    desc: "DC and AC solar pumps for irrigation and water supply. PM-KUSUM scheme eligible. Replace diesel pumps and run irrigation for free through the day.",
    detail: "Ideal for farmers and rural water supply projects.",
  },
];

export default function Services() {
  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-orange-500 font-semibold text-sm uppercase tracking-widest">What We Offer</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
            Complete Solar Solutions
          </h2>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto">
            From site survey and design to installation, commissioning, and after-sales support —
            we handle everything end-to-end.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <div
              key={s.title}
              className="border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all group"
            >
              <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                {s.icon}
              </div>
              <div className="flex items-center gap-2 mb-3">
                <h3 className="font-bold text-slate-900 text-base">{s.title}</h3>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${s.tagColor}`}>{s.tag}</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
              <p className="text-orange-600 text-xs font-medium mt-3">{s.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}