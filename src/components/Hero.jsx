export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center"
      style={{
        background: "linear-gradient(135deg, #0f1623 0%, #1a2744 50%, #0f2010 100%)",
      }}
    >
      {/* Sun rays SVG background */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <svg viewBox="0 0 800 800" className="absolute -top-40 -right-40 w-3/4" fill="none">
          {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg) => (
            <line
              key={deg}
              x1="400" y1="400"
              x2={400 + 600 * Math.cos((deg * Math.PI) / 180)}
              y2={400 + 600 * Math.sin((deg * Math.PI) / 180)}
              stroke="#f97316" strokeWidth="1"
            />
          ))}
          <circle cx="400" cy="400" r="80" fill="#f97316" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
              Authorised Wholesale Distributor
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4">
              Powering India With
              <span className="block text-orange-400"> Clean Solar Energy</span>
            </h1>
            <p className="text-slate-300 text-lg mb-8 leading-relaxed max-w-lg">
              Kalpana Solar Traders — your one-stop source for rooftop solar installations,
              wholesale panels, inverters, and batteries from all leading brands.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#contact"
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-full transition-all hover:scale-105"
              >
                Get Free Site Survey
              </a>
              <a
                href="#services"
                className="border border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-3 rounded-full transition-all"
              >
                Our Services
              </a>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/10">
              {[
                { value: "500+", label: "Projects Done" },
                { value: "12+", label: "Top Brands" },
                { value: "1MW+", label: "Capacity Installed" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-2xl font-extrabold text-orange-400">{s.value}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex justify-center items-center">
            <div className="relative w-80 h-80">
              {/* Animated sun */}
              <div className="absolute inset-0 rounded-full border-2 border-orange-500/20 animate-spin" style={{ animationDuration: "20s" }} />
              <div className="absolute inset-4 rounded-full border border-orange-400/20 animate-spin" style={{ animationDuration: "15s", animationDirection: "reverse" }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-40 h-40 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <svg viewBox="0 0 80 80" className="w-24 h-24" fill="none">
                    <circle cx="40" cy="40" r="18" fill="#f97316" />
                    {[0,45,90,135,180,225,270,315].map((deg) => (
                      <line
                        key={deg}
                        x1={40 + 20 * Math.cos((deg * Math.PI) / 180)}
                        y1={40 + 20 * Math.sin((deg * Math.PI) / 180)}
                        x2={40 + 32 * Math.cos((deg * Math.PI) / 180)}
                        y2={40 + 32 * Math.sin((deg * Math.PI) / 180)}
                        stroke="#f97316" strokeWidth="2.5" strokeLinecap="round"
                      />
                    ))}
                  </svg>
                </div>
              </div>
              {/* Floating tags */}
              {[
                { label: "On-Grid", x: "-translate-x-32", y: "-translate-y-16" },
                { label: "Off-Grid", x: "translate-x-32", y: "-translate-y-16" },
                { label: "Hybrid", x: "-translate-x-32", y: "translate-y-16" },
                { label: "Commercial", x: "translate-x-24", y: "translate-y-20" },
              ].map((tag) => (
                <div
                  key={tag.label}
                  className={`absolute left-1/2 top-1/2 transform ${tag.x} ${tag.y} bg-slate-800/80 border border-orange-500/30 text-orange-300 text-xs px-3 py-1 rounded-full`}
                >
                  {tag.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="white" preserveAspectRatio="none">
          <path d="M0,60 C360,0 1080,0 1440,60 L1440,60 L0,60 Z" />
        </svg>
      </div>
    </section>
  );
}