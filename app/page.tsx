import HeroSection from "@/components/hero/HeroSection";
import TrendingGrid from "@/components/cards/TrendingGrid";
import AdvisorSection from "@/components/advisor/AdvisorSection";
import DecisionEngineSection from "@/components/decision-engine/DecisionEngineSection";
import SectionDivider from "@/components/layout/SectionDivider";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <SectionDivider />
      <TrendingGrid />
      <SectionDivider />
      <AdvisorSection />
      <SectionDivider />
      <DecisionEngineSection />
    </>
  );
}
