import SearchHero from "@/components/home/SearchHero";
import PropiedadesSection from "@/components/sections/PropiedadesSection";
import ServiciosSection from "@/components/sections/ServiciosSection";
import ContactoSection from "@/components/sections/ContactoSection";
import WhatsAppButton from "@/components/layout/WhatsAppButton";

export default function Home() {
  return (
    <main className="min-h-screen">
      <section id="inicio">
        <SearchHero />
      </section>
      
      <PropiedadesSection />
      <ServiciosSection />
      <ContactoSection />
      
      <WhatsAppButton />
    </main>
  );
}
