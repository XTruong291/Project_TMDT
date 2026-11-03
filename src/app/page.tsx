import { BestSellersCarousel } from "@/components/sites/raycon/best-sellers";
import { BrandStory } from "@/components/sites/raycon/brand-story";
import { CategoryGrid } from "@/components/sites/raycon/category-grid";
import { ClosingCta } from "@/components/sites/raycon/closing-cta";
import { CoreTech } from "@/components/sites/raycon/core-tech";
import { HeroBanner } from "@/components/sites/raycon/hero-banner";
import { PressPlayBanner } from "@/components/sites/raycon/press-play-banner";
import { Reviews } from "@/components/sites/raycon/reviews";

export default function Home() {
  return (
    <main>
      <HeroBanner />
      <BestSellersCarousel />
      <PressPlayBanner />
      <CategoryGrid />
      <CoreTech />
      <BrandStory />
      <Reviews />
      <ClosingCta />
    </main>
  );
}
