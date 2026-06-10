export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" strokeWidth="2" stroke="white" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <p className="text-white font-bold leading-tight">Kalpana Solar</p>
                <p className="text-orange-400 text-xs">Traders</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed">
              Your trusted wholesale partner for solar panels, inverters, and complete rooftop solar solutions.
            </p>
          </div>

          <div>
            <p className="text-white font-semibold text-sm mb-3">Services</p>
            <ul className="space-y-2 text-sm">
              {["Rooftop On-Grid Solar", "Off-Grid Solar", "Hybrid Solar", "Residential Solar", "Commercial Solar", "Solar Water Pump"].map(s => (
                <li key={s}><a href="#services" className="hover:text-orange-400 transition-colors">{s}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-white font-semibold text-sm mb-3">Products</p>
            <ul className="space-y-2 text-sm">
              {["Solar Panels (Mono PERC)", "Bifacial Panels", "String Inverters", "Hybrid Inverters", "LFP Batteries", "Tall Tubular Batteries"].map(p => (
                <li key={p}><a href="#products" className="hover:text-orange-400 transition-colors">{p}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-white font-semibold text-sm mb-3">Top Brands</p>
            <div className="flex flex-wrap gap-2">
              {["Adani", "Tata", "Waaree", "Microtech", "Luminous", "Growatt", "Delta", "Havells", "Exide"].map(b => (
                <span key={b} className="bg-slate-800 text-slate-300 text-xs px-2 py-1 rounded">{b}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p>2024 Kalpana Solar Traders. All rights reserved.</p>
          <a
            href="https://maps.app.goo.gl/DAMxtmT5VuBBoshi7"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-orange-400 hover:text-orange-300"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            Find us on Google Maps
          </a>
        </div>
      </div>
    </footer>
  );
}