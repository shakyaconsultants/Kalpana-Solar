import { Link } from "react-router-dom";
import { BRAND_LOGO_SRC, BRAND_LOGO_WIDTH, BRAND_LOGO_HEIGHT } from "../../assets/brandLogo.js";

/**
 * Logo variants:
 * - on-dark: subtle frame on dark hero/footer
 * - on-light: no frame — logo PNG includes its own background
 * - footer: compact for dark footer
 */
export default function Logo({ variant = "on-light", className = "" }) {
  const isDarkSurface = variant === "on-dark" || variant === "footer";

  const wrapCls =
    variant === "footer"
      ? "inline-flex items-center justify-center rounded-2xl bg-white px-3 py-2 shadow-lg shadow-black/20 ring-1 ring-white/10"
      : isDarkSurface
      ? "inline-flex items-center justify-center rounded-2xl bg-white/95 px-2.5 py-1.5 shadow-lg shadow-kalpana-950/25 ring-1 ring-white/20 backdrop-blur-sm"
      : "inline-flex items-center";

  const imgCls =
    variant === "footer"
      ? "h-12 w-auto max-w-[132px] object-contain"
      : isDarkSurface
      ? "h-9 sm:h-10 w-auto max-w-[118px] object-contain"
      : "h-9 sm:h-10 w-auto max-w-[148px] object-contain object-left";

  return (
    <Link to="/" className={`shrink-0 ${className}`} aria-label="Kalpana Solar Traders — Home">
      <span className={wrapCls}>
        <img
          src={BRAND_LOGO_SRC}
          alt="Kalpana Solar Traders"
          width={BRAND_LOGO_WIDTH}
          height={BRAND_LOGO_HEIGHT}
          className={imgCls}
          decoding="async"
        />
      </span>
    </Link>
  );
}
