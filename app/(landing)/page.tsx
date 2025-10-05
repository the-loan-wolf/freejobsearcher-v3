import { HeroSection } from "@/components/landingpage-components/hero-section";
import { FeaturesSection } from "@/components/landingpage-components/features-section";
import { ReviewsSection } from "@/components/landingpage-components/reviews-section";
import { CTASection } from "@/components/landingpage-components/cta-section";
import { Navigation } from "@/components/landingpage-components/navigation";
import { Footer } from "@/components/app-components/footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-100">
      <Navigation />
      <main>
        <HeroSection />
        <FeaturesSection />
        <ReviewsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
