import SectionHeader from "./ui/SectionHeader";

const reasons = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    title: "Competitive Wholesale Pricing",
    desc: "Direct manufacturer procurement ensures the best rates for dealers, contractors, and homeowners. Volume discounts available.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    title: "All Brands, One Source",
    desc: "Adani, Waaree, Vikram, Invergy, Microtek and more — simplify procurement with a single trusted distributor.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
    title: "Turnkey Installation",
    desc: "Site survey, structural design, panel mounting, inverter commissioning, and net metering — handled by our certified team.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 0 0 1.946-.806 3.42 3.42 0 0 1 4.438 0 3.42 3.42 0 0 0 1.946.806 3.42 3.42 0 0 1 3.138 3.138 3.42 3.42 0 0 0 .806 1.946 3.42 3.42 0 0 1 0 4.438 3.42 3.42 0 0 0-.806 1.946 3.42 3.42 0 0 1-3.138 3.138 3.42 3.42 0 0 0-1.946.806 3.42 3.42 0 0 1-4.438 0 3.42 3.42 0 0 0-1.946-.806 3.42 3.42 0 0 1-3.138-3.138 3.42 3.42 0 0 0-.806-1.946 3.42 3.42 0 0 1 0-4.438 3.42 3.42 0 0 0 .806-1.946 3.42 3.42 0 0 1 3.138-3.138z" />
      </svg>
    ),
    title: "Subsidy & Net Metering",
    desc: "Full assistance with PM Surya Ghar subsidy claims, state MNRE benefits, and DISCOM net metering documentation.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "After-Sales & AMC",
    desc: "Annual maintenance, panel cleaning, inverter servicing, and performance monitoring long after installation.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <rect x="1" y="3" width="15" height="13" rx="2" />
        <path strokeLinecap="round" d="M16 8h4l3 3v5h-7V8z" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
    title: "Fast Delivery & Logistics",
    desc: "Well-stocked inventory with quick dispatch. Bulk orders packed securely for damage-free site delivery.",
  },
];

export default function WhyUs() {
  return (
    <section id="why-us" className="section-padding hero-bg relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-40" />
      <div className="relative container-main">
        <SectionHeader
          eyebrow="Our Advantage"
          title="Why Choose Kalpana Solar Traders"
          description="A reputation built on reliability, quality products, and exceptional service across hundreds of installations."
          light
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {reasons.map((r) => (
            <div
              key={r.title}
              className="bg-white/[0.04] backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/[0.07] hover:border-orange-500/30 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center mb-4">
                {r.icon}
              </div>
              <h3 className="text-white font-bold mb-2">{r.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
