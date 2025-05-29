import BlogSection from "@/components/pages/BlogSection";
import ContactForm from "@/components/pages/contact-form";
import CTABottom from "@/components/pages/cta-section-bottom";
// import Hero from "@/components/pages/hero";
import Hero2025 from "@/components/pages/hero-2025";
// import Hero2025Exp from "@/components/pages/hero-2025-exp";
import Partners from "@/components/pages/partners";
import Products from "@/components/pages/products";
import Reviews from "@/components/pages/reviews";
import Services from "@/components/pages/services";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center">
      {/* <Hero /> */}
      <Hero2025 />
      {/* <Hero2025Exp /> */}
      <Partners/>
      <Services />
      <Products />
      <Reviews />
      <BlogSection />
      <CTABottom />
      <ContactForm />
    </main>
  );
}
