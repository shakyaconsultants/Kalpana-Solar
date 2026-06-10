import SectionHeader from "./ui/SectionHeader";

const services = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <circle cx="12" cy="12" r="4" />
        <path strokeLinecap="round" d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2" />
      </svg>
    ),
    title: "Rooftop On-Grid Solar",
    tag: "Grid-Tied",
    tagColor: "bg-kalpana-50 text-kalpana-700 ring-kalpana-600/20",
    desc: "Connect to the utility grid, export surplus power, and slash electricity bills — no batteries required.",
    detail: "Ideal for homes & offices with reliable grid supply.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path strokeLinecap="round" d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      </svg>
    ),
    title: "Off-Grid Solar",
    tag: "Standalone",
    tagColor: "bg-blue-50 text-blue-700 ring-blue-600/20",
    desc: "Fully independent power for remote sites, farms, and areas with frequent outages — with optional lithium storage.",
    detail: "Ideal for rural & off-grid locations.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path strokeLinecap="round" d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    title: "Hybrid Solar",
    tag: "Smart Backup",
    tagColor: "bg-accent-50 text-accent-700 ring-accent-600/20",
    desc: "Stay grid-connected with optional battery backup — power through outages while exporting excess energy.",
    detail: "Ideal for urban homes with power cuts.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path strokeLinecap="round" d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline strokeLinecap="round" points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    title: "Residential Solar",
    tag: "Home",
    tagColor: "bg-violet-50 text-violet-700 ring-violet-600/20",
    desc: "Turnkey rooftop systems from 2–10 kW with subsidy assistance, net metering support, and end-to-end installation.",
    detail: "PM Surya Ghar subsidy eligible.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path strokeLinecap="round" d="M8 21h8M12 17v4" />
      </svg>
    ),
    title: "Commercial Solar",
    tag: "Industrial",
    tagColor: "bg-kalpana-50 text-kalpana-700 ring-kalpana-600/20",
    desc: "Large-scale systems for factories, warehouses, and institutions — typically 3–4 year ROI on energy savings.",
    detail: "20 kW to 1 MW+ capacity.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path strokeLinecap="round" d="M12 22V12M12 12C12 7 8 4 3 4M12 12C12 7 16 4 21 4" />
      </svg>
    ),
    title: "Solar Water Pump",
    tag: "Agriculture",
    tagColor: "bg-teal-50 text-teal-700 ring-teal-600/20",
    desc: "DC & AC solar pumps for irrigation — PM-KUSUM eligible. Replace diesel and run daytime pumping at zero fuel cost.",
    detail: "Ideal for farmers & rural projects.",
  },
];

export default function Services() {
  return (
    <section id="services" className="section-padding bg-slate-50">
      <div className="container-main">
        <SectionHeader
          eyebrow="What We Offer"
          title="Complete Solar Solutions"
          description="From site survey and design to installation, commissioning, and after-sales support — we handle everything end-to-end."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {services.map((s) => (
            <article
              key={s.title}
              className="card card-hover p-6 lg:p-7 group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-kalpana-50 to-kalpana-100 text-kalpana-600 rounded-2xl flex items-center justify-center mb-5 group-hover:from-kalpana-500 group-hover:to-kalpana-600 group-hover:text-white transition-all duration-300 shadow-sm">
                {s.icon}
              </div>
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <h3 className="font-bold text-slate-900">{s.title}</h3>
                <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ring-1 ring-inset ${s.tagColor}`}>
                  {s.tag}
                </span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">{s.desc}</p>
              <p className="text-kalpana-600 text-xs font-semibold mt-4 flex items-center gap-1">
                {s.detail}
                <svg className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
