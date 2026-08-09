"use client";

import { CtaSection } from "./components/CtaSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { HeroSection } from "./components/HeroSection";
import { HowItWorksSection } from "./components/HowItWorksSection";
import { LandingFooter } from "./components/LandingFooter";
import { UseCasesSection } from "./components/UseCasesSection";

export function LandingPage() {
  const handleScrollToFeatures = () => {
    const el = document.getElementById("features");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="w-(--page-width) max-w-full flex flex-col items-center px-4 sm:px-6 md:px-0">
      <HeroSection onExploreClick={handleScrollToFeatures} />
      <FeaturesSection />
      <HowItWorksSection />
      <UseCasesSection />
      <CtaSection />
      <LandingFooter />
    </div>
  );
}
