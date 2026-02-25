import LandingHero from "@/components/landing/LandingHero";
import TrustSection from "@/components/landing/TrustSection";
import LuxuryServices from "@/components/landing/LuxuryServices";
import PropertiesSection from "@/components/landing/PropertiesSection";
import ExclusiveOffer from "@/components/landing/ExclusiveOffer";
import ContactSection from "@/components/ContactSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import InvestorFAQ from "@/components/landing/InvestorFAQ";
import WhatsAppCTA from "@/components/ui/WhatsAppCTA";

export default function LandingPage() {
  return (
    <div className="bg-white overflow-hidden relative">
      <LandingHero />
      <TrustSection />
      <LuxuryServices />
      <PropertiesSection />
      <TestimonialsSection />
      <InvestorFAQ />
      <ContactSection />
      <ExclusiveOffer />
      <WhatsAppCTA />
    </div>
  );
}
