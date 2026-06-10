import Hero from "../components/Hero";
import Services from "../components/Services";
import Products from "../components/Products";
import Brands from "../components/Brands";
import WhyUs from "../components/WhyUs";
import Contact from "../components/Contact";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Services />
      <Products />
      <Brands />
      <WhyUs />
      <Contact />
    </main>
  );
}
