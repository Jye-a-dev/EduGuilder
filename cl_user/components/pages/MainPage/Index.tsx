import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import EcosystemSection from "./EcosystemSection";
import GamificationSection from "./GamificationSection";
import PricingSection from "./PricingSection";

export default function MainPage() {
  return (
    <div className="relative w-full">
      <HeroSection />
      <FeaturesSection />
      <EcosystemSection />
      <GamificationSection />
      <PricingSection />
    </div>
  );
}
