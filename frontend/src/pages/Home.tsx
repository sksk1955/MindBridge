import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import FocusAreasSection from "@/components/FocusAreasSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import TrustSection from "@/components/TrustSection";
import ChatPreview from "@/components/ChatPreview";
import FaqSection from "@/components/FaqSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/layout/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <FocusAreasSection />
        <HowItWorksSection />
        <TrustSection />
        <ChatPreview />
        <FaqSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
