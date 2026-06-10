export default function Contact() {
  return (
    <section id="contact" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-orange-500 font-semibold text-sm uppercase tracking-widest">Get In Touch</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
            Let Us Power Your Space
          </h2>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto">
            Request a free site survey, wholesale quote, or just say hello.
            Our team responds within 24 hours.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
              <h3 className="font-bold text-slate-800 text-lg">Kalpana Solar Traders</h3>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-orange-50 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-4.5 h-4.5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-slate-700 text-sm">Location</p>
                  <a
                    href="https://maps.app.goo.gl/DAMxtmT5VuBBoshi7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-500 hover:underline text-sm"
                  >
                    View on Google Maps
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-orange-50 rounded-lg flex items-center justify-center shrink-0">
                  <svg className="w-4.5 h-4.5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-slate-700 text-sm">Email</p>
                  <p className="text-slate-500 text-sm">kalpanasolartradersinfo@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-orange-50 rounded-lg flex items-center justify-center shrink-0">
                  <svg className="w-4.5 h-4.5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6.29 6.29l.91-.85a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-slate-700 text-sm">Phone</p>
                  <p className="text-slate-500 text-sm">8736992133</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-orange-50 rounded-lg flex items-center justify-center shrink-0">
                  <svg className="w-4.5 h-4.5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-slate-700 text-sm">Business Hours</p>
                  <p className="text-slate-500 text-sm">Mon - Sat: 9:00 AM to 7:00 PM</p>
                  <p className="text-slate-500 text-sm">Sunday: 10:00 AM to 2:00 PM (by appt.)</p>
                </div>
              </div>
            </div>

            <a
              href="https://maps.app.goo.gl/DAMxtmT5VuBBoshi7"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-2xl overflow-hidden border border-gray-200 hover:opacity-90 transition-opacity"
            >
              <div
                className="w-full h-44 flex items-center justify-center text-white font-semibold text-sm gap-2"
                style={{ background: "linear-gradient(135deg, #1a2744, #0f2010)" }}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Open in Google Maps
              </div>
            </a>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl border border-gray-100 p-8">
            <h3 className="font-bold text-slate-800 text-lg mb-6">Request a Free Quote</h3>
            <form
              onSubmit={(e) => { e.preventDefault(); alert("Thank you! We will get back to you shortly."); }}
              className="space-y-4"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Name</label>
                  <input type="text" required placeholder="Your full name" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Phone</label>
                  <input type="tel" required placeholder="Your phone number" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Email</label>
                <input type="email" placeholder="Your email (optional)" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Enquiry Type</label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 bg-white focus:ring-1 focus:ring-orange-400">
                  <option>Residential Rooftop Solar</option>
                  <option>Commercial / Industrial Solar</option>
                  <option>Off-Grid or Hybrid System</option>
                  <option>Wholesale / Dealer Pricing</option>
                  <option>Solar Water Pump</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Message</label>
                <textarea rows={4} placeholder="Tell us about your requirement..." className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 resize-none" />
              </div>
              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-full transition-colors text-sm"
              >
                Send Enquiry
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}