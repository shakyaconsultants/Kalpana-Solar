export default function CustomerStep({ customer, onChange, onNext }) {
  const valid = customer.name.trim().length >= 2 && customer.phone.trim().length >= 10;

  function set(field, value) {
    onChange({ ...customer, [field]: value });
  }

  return (
    <div className="quote-wizard-card">
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-2xl bg-kalpana-50 ring-1 ring-kalpana-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-kalpana-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="4" />
            <path strokeLinecap="round" d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2" />
          </svg>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Customer Details</h2>
        <p className="text-slate-500 text-sm mt-2">Start with your customer&apos;s basic information</p>
      </div>

      <div className="space-y-5">
        <Field label="Customer Name" required>
          <input
            type="text"
            className="input-field"
            placeholder="Full name"
            value={customer.name}
            onChange={(e) => set("name", e.target.value)}
          />
        </Field>
        <Field label="Phone Number" required>
          <input
            type="tel"
            className="input-field"
            placeholder="+91 XXXXX XXXXX"
            value={customer.phone}
            onChange={(e) => set("phone", e.target.value)}
          />
        </Field>
        <Field label="Installation Address">
          <textarea
            rows={3}
            className="input-field resize-none"
            placeholder="Street, area, landmark"
            value={customer.address}
            onChange={(e) => set("address", e.target.value)}
          />
        </Field>
        <Field label="City">
          <input
            type="text"
            className="input-field"
            placeholder="City"
            value={customer.city}
            onChange={(e) => set("city", e.target.value)}
          />
        </Field>
      </div>

      <button
        type="button"
        disabled={!valid}
        onClick={onNext}
        className="quote-wizard-btn-primary mt-8 w-full disabled:opacity-45 disabled:cursor-not-allowed disabled:hover:translate-y-0"
      >
        Next: System Selection
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <label className="block">
      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </span>
      <div className="mt-2">{children}</div>
    </label>
  );
}
