import { useState, useEffect } from "react";

const links = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Products", href: "#products" },
  { label: "Brands", href: "#brands" },
  { label: "Why Us", href: "#why-us" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="#home" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" strokeWidth="2" stroke="white" strokeLinecap="round" />
              </svg>
            </div>
            <span className={`font-bold text-lg leading-tight ${scrolled ? "text-slate-900" : "text-white"}`}>
              Kalpana<br />
              <span className="text-orange-500 text-sm font-semibold">Solar Traders</span>
            </span>
          </a>

          <div className="hidden md:flex items-center gap-6">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={`text-sm font-medium transition-colors hover:text-orange-500 ${
                  scrolled ? "text-slate-700" : "text-white"
                }`}
              >
                {l.label}
              </a>
            ))}
            <a
              href="#quotation"
              className="bg-orange-500 text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-orange-600 transition-colors"
            >
              Get Quote
            </a>
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <div className={`w-5 h-0.5 mb-1 transition-all ${scrolled ? "bg-slate-800" : "bg-white"}`} />
            <div className={`w-5 h-0.5 mb-1 transition-all ${scrolled ? "bg-slate-800" : "bg-white"}`} />
            <div className={`w-5 h-0.5 transition-all ${scrolled ? "bg-slate-800" : "bg-white"}`} />
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block px-6 py-3 text-sm text-slate-700 hover:bg-orange-50 hover:text-orange-600 border-b border-gray-50"
            >
              {l.label}
            </a>
          ))}
          <div className="px-6 py-4">
            <a
              href="#quotation"
              onClick={() => setOpen(false)}
              className="block text-center bg-orange-500 text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-orange-600"
            >
              Get Quote
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
