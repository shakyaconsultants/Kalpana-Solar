import { Link } from "react-router-dom";

const stats = [
  { value: "500+", label: "Installations" },
  { value: "12+", label: "Brand Partners" },
  { value: "1 MW+", label: "Capacity Deployed" },
];

const badges = ["MNRE Compliant", "PM Surya Ghar", "Free Site Survey"];

export default function Hero() {
  return (
    <section id="home" className="relative min-h-[92vh] lg:min-h-screen flex items-center hero-bg overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-60" />
      <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative container-main pt-28 pb-24 lg:pt-32 lg:pb-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <div className="flex flex-wrap gap-2 mb-6">
              {badges.map((b) => (
                <span
                  key={b}
                  className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 text-orange-300 text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full backdrop-blur-sm"
                >
                  <span className="w-1 h-1 rounded-full bg-orange-400" />
                  {b}
                </span>
              ))}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-white leading-[1.1] tracking-tight mb-5">
              Trusted Solar Partner for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
                Homes & Businesses
              </span>
            </h1>

            <p className="text-slate-300 text-lg sm:text-xl leading-relaxed max-w-xl mb-8">
              Kalpana Solar Traders — wholesale distributor and EPC partner for rooftop solar.
              Panels, inverters, lithium batteries, and complete on-grid, hybrid & off-grid systems.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <Link to="/quote" className="btn-primary">
                Get Instant Quote
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <a href="#contact" className="btn-secondary">
                Free Site Survey
              </a>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="text-2xl sm:text-3xl font-extrabold text-white">{s.value}</p>
                  <p className="text-slate-400 text-xs sm:text-sm mt-1 font-medium">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:block relative">
            <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 shadow-2xl shadow-black/20">
              <div className="absolute -top-3 -right-3 bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                Live Quote Tool
              </div>

              <p className="text-orange-400 text-xs font-bold uppercase tracking-widest mb-2">System types</p>
              <h3 className="text-white text-xl font-bold mb-6">Configure & download your quote in minutes</h3>

              <div className="space-y-3 mb-6">
                {[
                  { name: "On-Grid", desc: "Grid-tied · Net metering", color: "bg-emerald-500" },
                  { name: "Hybrid", desc: "Grid + battery backup", color: "bg-orange-500" },
                  { name: "Off-Grid", desc: "Fully standalone power", color: "bg-blue-500" },
                ].map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center gap-4 bg-white/5 rounded-xl px-4 py-3 border border-white/5"
                  >
                    <div className={`w-2 h-10 rounded-full ${item.color}`} />
                    <div>
                      <p className="text-white font-bold text-sm">{item.name}</p>
                      <p className="text-slate-400 text-xs">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                to="/quote"
                className="flex items-center justify-center gap-2 w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl transition-colors text-sm"
              >
                Start Configuration
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Decorative solar panel grid */}
            <div className="absolute -bottom-6 -left-6 grid grid-cols-4 gap-1 opacity-20 pointer-events-none">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="w-8 h-12 bg-slate-400 rounded-sm border border-slate-500/50" />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 1440 80" fill="#f8fafc" preserveAspectRatio="none" className="w-full h-12 sm:h-16 lg:h-20">
          <path d="M0,80 C480,20 960,20 1440,80 L1440,80 L0,80 Z" />
        </svg>
      </div>
    </section>
  );
}
