import { BestSellersCarousel } from "@/components/sites/raycon/best-sellers";
import { BrandStory } from "@/components/sites/raycon/brand-story";
import { CategoryGrid } from "@/components/sites/raycon/category-grid";
import { ClosingCta } from "@/components/sites/raycon/closing-cta";
import { CoreTech } from "@/components/sites/raycon/core-tech";
import { HeroBanner } from "@/components/sites/raycon/hero-banner";
import { HomeNews } from "@/components/sites/raycon/home-news";
import { PressPlayBanner } from "@/components/sites/raycon/press-play-banner";
import { Reviews } from "@/components/sites/raycon/reviews";
import { getProducts } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function Home() {
  const initialProducts = await getProducts();

  return (
    <main>
      <HeroBanner />
      <BestSellersCarousel initialProducts={initialProducts} />
      <PressPlayBanner />
      <CategoryGrid />
      <CoreTech />
      <HomeNews />
      <BrandStory />
      <Reviews />
      <ClosingCta />
    </main>
  );
}
