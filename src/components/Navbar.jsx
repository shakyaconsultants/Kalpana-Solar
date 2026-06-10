import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "./ui/Logo";

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
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isQuotePage = location.pathname === "/quote";
  const navSolid = !isHome || scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function sectionHref(hash) {
    return isHome ? hash : `/${hash}`;
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          navSolid
            ? "bg-white/95 backdrop-blur-md shadow-sm shadow-slate-900/5 border-b border-slate-100"
            : "bg-transparent"
        }`}
      >
        <div className="container-main">
          <div className="flex items-center justify-between h-16 lg:h-[4.25rem]">
            <Logo imgClass={navSolid ? "h-9 sm:h-10" : "h-9 sm:h-11 brightness-0 invert"} />

            <nav className="hidden lg:flex items-center gap-1">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={sectionHref(l.href)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    navSolid
                      ? "text-slate-600 hover:text-orange-600 hover:bg-orange-50"
                      : "text-white/90 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {l.label}
                </a>
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-3">
              <a
                href={sectionHref("#contact")}
                className={`text-sm font-semibold px-4 py-2 rounded-full transition-colors ${
                  navSolid
                    ? "text-slate-600 hover:text-orange-600"
                    : "text-white/90 hover:text-white"
                }`}
              >
                Contact
              </a>
              <Link
                to="/quote"
                className={`text-sm font-bold px-5 py-2.5 rounded-full transition-all shadow-lg ${
                  isQuotePage
                    ? "bg-orange-600 text-white shadow-orange-600/30"
                    : "bg-orange-500 text-white hover:bg-orange-600 shadow-orange-500/30 hover:shadow-orange-500/40"
                }`}
              >
                Get Quote
              </Link>
            </div>

            <button
              type="button"
              className={`lg:hidden p-2.5 rounded-xl transition-colors ${
                navSolid ? "hover:bg-slate-100" : "hover:bg-white/10"
              }`}
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              <svg
                className={`w-6 h-6 ${navSolid ? "text-slate-800" : "text-white"}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                {open ? (
                  <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute top-16 left-0 right-0 bg-white border-b border-slate-100 shadow-xl max-h-[calc(100vh-4rem)] overflow-y-auto">
            {links.map((l) => (
              <a
                key={l.href}
                href={sectionHref(l.href)}
                onClick={() => setOpen(false)}
                className="block px-6 py-4 text-sm font-semibold text-slate-700 hover:bg-orange-50 hover:text-orange-600 border-b border-slate-50"
              >
                {l.label}
              </a>
            ))}
            <div className="p-4 space-y-3">
              <Link
                to="/quote"
                onClick={() => setOpen(false)}
                className="block text-center btn-primary w-full py-3 text-sm"
              >
                Get Instant Quote
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
