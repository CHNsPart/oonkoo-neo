import BlogSection from "@/components/pages/BlogSection";
import ContactForm from "@/components/pages/contact-form";
import CTABottom from "@/components/pages/cta-section-bottom";
import Ecosystem from "@/components/pages/ecosystem";
import Hero2026 from "@/components/pages/hero-2026";
import Partners from "@/components/pages/partners";
import Products from "@/components/pages/products";
import Reviews from "@/components/pages/reviews";
import Services from "@/components/pages/services";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center">
      <Hero2026 />
      <Services />
      <Partners/>
      <Ecosystem />
      <Products />
      <Reviews />
      <BlogSection />
      <CTABottom />
      <ContactForm />
    </main>
  );
}
