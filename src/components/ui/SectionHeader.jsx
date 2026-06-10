export default function SectionHeader({ eyebrow, title, description, light = false, align = "center" }) {
  const alignCls = align === "left" ? "text-left mx-0" : "text-center mx-auto";

  return (
    <div className={`mb-12 lg:mb-14 max-w-2xl ${alignCls}`}>
      {eyebrow && (
        <span
          className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] mb-3 ${
            light ? "text-orange-400" : "text-orange-600"
          }`}
        >
          <span className={`w-8 h-px ${light ? "bg-orange-400/60" : "bg-orange-300"}`} />
          {eyebrow}
          {align === "center" && (
            <span className={`w-8 h-px ${light ? "bg-orange-400/60" : "bg-orange-300"}`} />
          )}
        </span>
      )}
      <h2
        className={`text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold tracking-tight leading-tight ${
          light ? "text-white" : "text-slate-900"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p className={`mt-4 text-base sm:text-lg leading-relaxed ${light ? "text-slate-400" : "text-slate-600"}`}>
          {description}
        </p>
      )}
    </div>
  );
}
