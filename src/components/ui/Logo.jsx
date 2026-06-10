import { Link } from "react-router-dom";
import logo from "../../assets/kalpanalogo.PNG";

/**
 * Logo variants:
 * - on-dark: white badge on dark hero/footer (PNG has white bg baked in)
 * - on-light: blends into white navbar
 * - footer: compact badge for dark footer
 */
export default function Logo({ variant = "on-light", className = "" }) {
  const isDarkSurface = variant === "on-dark" || variant === "footer";

  const wrapCls =
    variant === "footer"
      ? "inline-flex items-center bg-white rounded-xl px-3 py-1.5 shadow-sm"
      : isDarkSurface
      ? "inline-flex items-center bg-white rounded-xl px-3 py-1.5 shadow-lg shadow-black/25"
      : "inline-flex items-center";

  const imgCls =
    variant === "footer"
      ? "h-8 w-auto max-h-8 object-contain"
      : "h-8 sm:h-9 w-auto max-w-[130px] sm:max-w-[148px] object-contain object-left";

  return (
    <Link to="/" className={`shrink-0 ${className}`} aria-label="Kalpana Solar Traders — Home">
      <span className={wrapCls}>
        <img src={logo} alt="Kalpana Solar Traders" className={imgCls} />
      </span>
    </Link>
  );
}
