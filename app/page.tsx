import ContactForm from "@/components/pages/contact-form";
import CTABottom from "@/components/pages/cta-section-bottom";
import Hero from "@/components/pages/hero";
import Partners from "@/components/pages/partners";
import Products from "@/components/pages/products";
import Reviews from "@/components/pages/reviews";
import Services from "@/components/pages/services";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center">
      <Hero />
      <Partners/>
      <Services />
      <Products />
      <Reviews />
      <CTABottom />
      <ContactForm />
    </main>
  );
}
