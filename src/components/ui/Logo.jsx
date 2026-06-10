import { Link } from "react-router-dom";
import logo from "../../assets/kalpanalogo.PNG";

export default function Logo({ className = "", imgClass = "h-9 sm:h-10" }) {
  return (
    <Link to="/" className={`flex items-center shrink-0 ${className}`}>
      <img
        src={logo}
        alt="Kalpana Solar Traders"
        className={`${imgClass} w-auto object-contain`}
      />
    </Link>
  );
}
