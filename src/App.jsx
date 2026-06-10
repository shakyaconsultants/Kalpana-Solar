import "./index.css";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Products from "./components/Products";
import Brands from "./components/Brands";
import WhyUs from "./components/WhyUs";
import Contact from "./components/Contact";
import QuotationGenerator from "./components/QuotationGenerator";
import Footer from "./components/Footer";

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Products />
        <Brands />
        <WhyUs />
        <QuotationGenerator />
        <Contact />
      </main>
      <Footer />
    </>
  );
}