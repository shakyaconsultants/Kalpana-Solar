import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout() {
  const { pathname } = useLocation();
  const isQuoteWizard = pathname === "/quote";

  return (
    <>
      {!isQuoteWizard && <Navbar />}
      <Outlet />
      {!isQuoteWizard && <Footer />}
    </>
  );
}
