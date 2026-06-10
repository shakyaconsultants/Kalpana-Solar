import { Link } from "react-router-dom";
import Logo from "./ui/Logo";

const serviceLinks = [
  "Rooftop On-Grid Solar",
  "Off-Grid Solar",
  "Hybrid Solar",
  "Residential Solar",
  "Commercial Solar",
  "Solar Water Pump",
];

const productLinks = [
  "Solar Panels (Topcon & Bifacial)",
  "String Inverters",
  "Hybrid Inverters",
  "LFP Lithium Batteries",
  "Off-Grid Inverters",
  "Installation & EPC",
];

const brands = ["Adani", "Waaree", "Vikram", "Invergy", "Microtek", "Tata", "Growatt", "Delta"];

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400">
      {/* CTA band */}
      <div className="border-b border-white/5">
        <div className="container-main py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-white font-bold text-lg sm:text-xl">Ready to go solar?</p>
            <p className="text-slate-400 text-sm mt-1">Get an instant estimate or book a free site survey today.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/quote" className="btn-primary text-sm py-3 px-6">
              Get Quote
            </Link>
            <a href="/#contact" className="btn-outline border-slate-700 text-slate-300 hover:border-orange-500 hover:text-orange-400 text-sm py-3 px-6">
              Contact Us
            </a>
          </div>
        </div>
      </div>

      <div className="container-main py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          <div className="lg:col-span-4">
            <Logo variant="footer" />
            <p className="text-sm leading-relaxed mt-4 max-w-xs">
              Authorised wholesale distributor and installation partner for complete rooftop solar solutions across India.
            </p>
            <div className="mt-5 space-y-2 text-sm">
              <a href="tel:8736992133" className="flex items-center gap-2 hover:text-orange-400 transition-colors">
                <svg className="w-4 h-4 text-orange-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6.29 6.29l1.08-1.08a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                8736992133
              </a>
              <a href="mailto:kalpanasolartradersinfo@gmail.com" className="flex items-center gap-2 hover:text-orange-400 transition-colors break-all">
                <svg className="w-4 h-4 text-orange-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path strokeLinecap="round" d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                kalpanasolartradersinfo@gmail.com
              </a>
            </div>
          </div>

          <div className="lg:col-span-2 lg:col-start-6">
            <p className="text-white font-bold text-sm mb-4">Services</p>
            <ul className="space-y-2.5 text-sm">
              {serviceLinks.map((s) => (
                <li key={s}>
                  <a href="/#services" className="hover:text-orange-400 transition-colors">
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className="text-white font-bold text-sm mb-4">Products</p>
            <ul className="space-y-2.5 text-sm">
              {productLinks.map((p) => (
                <li key={p}>
                  <a href="/#products" className="hover:text-orange-400 transition-colors">
                    {p}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className="text-white font-bold text-sm mb-4">Brands</p>
            <div className="flex flex-wrap gap-2">
              {brands.map((b) => (
                <span key={b} className="bg-white/5 border border-white/10 text-slate-300 text-xs font-medium px-2.5 py-1 rounded-lg">
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} Kalpana Solar Traders. All rights reserved.</p>
          <a
            href="https://maps.app.goo.gl/DAMxtmT5VuBBoshi7"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-orange-400 hover:text-orange-300 font-medium transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            Find us on Google Maps
          </a>
        </div>
      </div>
    </footer>
  );
}
