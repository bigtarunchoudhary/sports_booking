import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/home/HeroSection";
import Footer from "@/components/layout/Footer";
import AntigravityCursor from "@/components/ui/AntigravityCursor";

export default function Home() {
  return (
    <>
      <AntigravityCursor />
      <Navbar />
      <HeroSection />
      <Footer />
    </>
  );
}