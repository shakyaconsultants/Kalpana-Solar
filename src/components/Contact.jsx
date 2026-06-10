import { Link } from "react-router-dom";
import SectionHeader from "./ui/SectionHeader";

export default function Contact() {
  return (
    <section id="contact" className="section-padding bg-white">
      <div className="container-main">
        <SectionHeader
          eyebrow="Get In Touch"
          title="Let's Power Your Space"
          description="Request a free site survey, wholesale quote, or general enquiry. Our team responds within 24 hours."
        />

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Info */}
          <div className="lg:col-span-2 space-y-5">
            <div className="card p-6 lg:p-7 space-y-6">
              <h3 className="font-bold text-slate-900 text-lg">Kalpana Solar Traders</h3>

              {[
                {
                  label: "Location",
                  value: "View on Google Maps",
                  href: "https://maps.app.goo.gl/DAMxtmT5VuBBoshi7",
                  icon: (
                    <path strokeLinecap="round" d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                  ),
                },
                {
                  label: "Email",
                  value: "kalpanasolartradersinfo@gmail.com",
                  href: "mailto:kalpanasolartradersinfo@gmail.com",
                  icon: (
                    <>
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path strokeLinecap="round" d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </>
                  ),
                },
                {
                  label: "Phone",
                  value: "8736992133",
                  href: "tel:8736992133",
                  icon: (
                    <path strokeLinecap="round" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6.29 6.29l1.08-1.08a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  ),
                },
                {
                  label: "Business Hours",
                  value: "Mon–Sat: 9 AM – 7 PM · Sun: 10 AM – 2 PM",
                  icon: (
                    <>
                      <circle cx="12" cy="12" r="10" />
                      <polyline strokeLinecap="round" points="12 6 12 12 16 14" />
                    </>
                  ),
                },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-kalpana-50 rounded-xl flex items-center justify-center shrink-0">
                    <svg className="w-4.5 h-4.5 text-kalpana-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      {item.icon}
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="text-slate-600 hover:text-kalpana-600 text-sm transition-colors">
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-slate-600 text-sm">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <Link
              to="/quote"
              className="block card p-5 brand-gradient-bg border-0 text-white hover:brightness-105 transition-all group shadow-lg shadow-kalpana-500/20"
            >
              <p className="font-bold text-lg">Need a quick estimate?</p>
              <p className="text-kalpana-100 text-sm mt-1">Use our instant quote calculator →</p>
            </Link>
          </div>

          {/* Form */}
          <div className="lg:col-span-3 card p-6 sm:p-8 lg:p-10">
            <h3 className="font-bold text-slate-900 text-xl mb-6">Send an Enquiry</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Thank you! We will get back to you shortly.");
              }}
              className="space-y-5"
            >
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">Name</label>
                  <input type="text" required placeholder="Your full name" className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">Phone</label>
                  <input type="tel" required placeholder="Your phone number" className="input-field" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">Email</label>
                <input type="email" placeholder="Your email (optional)" className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">Enquiry Type</label>
                <select className="input-field">
                  <option>Residential Rooftop Solar</option>
                  <option>Commercial / Industrial Solar</option>
                  <option>Off-Grid or Hybrid System</option>
                  <option>Wholesale / Dealer Pricing</option>
                  <option>Solar Water Pump</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">Message</label>
                <textarea rows={4} placeholder="Tell us about your requirement..." className="input-field resize-none" />
              </div>
              <button type="submit" className="btn-primary w-full py-3.5 text-sm">
                Send Enquiry
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
