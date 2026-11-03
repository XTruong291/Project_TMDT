# Raycon Homepage Brief & Progress

## Route Map
- Source `https://rayconglobal.com/` → local `/`
- Shared chrome: Announcement Bar + Header + Footer
- Assets: `public/sites/raycon/images/`
- Components: `src/components/sites/raycon/`
- Product & Mock Data: `src/data/products.ts`

## Design Tokens (Live Extraction)
- **Royal Blue**: `#1A1DB6` → `oklch(0.378 0.225 268.2)`
- **Orange / Coral Accent**: `#F05C56` → `oklch(0.667 0.184 25.7)`
- **Soft Cyan / Light Blue**: `#E4F6FF` / `#B3E6FF`
- **Dark Navy**: `#1F283A` → `oklch(0.277 0.036 263.7)`
- **Typography**: Adobe Polymath (Typekit `uei0psq`), Outfit font fallback

## Section Order & Implementation Status
1. **Announcement Bar**: Sticky royal blue, text `EARLY BLACK FRIDAY: UP TO 50% OFF` (`announcement-bar.tsx`) - ✅ Complete
2. **Site Header**: 66px sticky white, Raycon wordmark, navigation links (Deals with coral accent, Open Audio, Earbuds, Headphones, Fast Charge), interactive search modal, cart icon, responsive mobile hamburger drawer (`header.tsx`) - ✅ Complete
3. **Hero Banner**: Full-width split banner featuring `E25_DESKTOP_48e0dc56-5fe6-4d9b-80e7-216f9fe86594.png`, heading `"Before the rush starts."`, copy `"Get ahead on the easiest decision of the season."`, white rounded pill CTA `"Shop The Sale"` (`hero-banner.tsx`) - ✅ Complete
4. **Fan Favorites (Best Sellers)**: Carousel / grid of 4 flagship products (`Everyday Earbuds`, `Bone Conduction Gen 1`, `Essential Open Earbuds`, `Everyday Clip Earbuds`) with coral discount badges (`20% OFF`, `30% OFF`, `40% OFF`), interactive color swatches, rating stars, strikethrough compare-at price, and quick "Add" action (`best-sellers.tsx`, `product-card.tsx`) - ✅ Complete
5. **Mid-page Banner**: Split banner featuring `HP_EVRGRN-BANNER_DESKTOP_A.png`, heading `"Press play on your day."`, bold subtext, royal blue CTA button `"Shop Now"` (`press-play-banner.tsx`) - ✅ Complete
6. **Shop by Category**: 4 cards (`Open Audio`, `Earbuds`, `Headphones`, `Power Tech`) with square imagery and smooth hover zoom effects (`category-grid.tsx`) - ✅ Complete
7. **Raycon Core Tech**: Detailed feature breakdown with background wave SVG, battery chip (`Total playtime with the case: 40 hrs` with `icon-battery.png`), earbuds render `earbuds-detail-trim.png`, and 3 annotated feature callouts with dashed connector lines (`Featherlight Fit`, `Tuned 6MM Drivers`, `IPX4 Waterproof`) (`core-tech.tsx`) - ✅ Complete
8. **Brand Story**: Soft blue `#e4f6ff` background, heading `"We design tech that just makes sense."`, 3 royal blue cards (`Effortless Tech.`, `Fits your Style.`, `Built to Last.`) with authentic photography (`brand-story.tsx`) - ✅ Complete
9. **Loved Out Loud (Reviews)**: 3 testimonial cards in soft pastel tints (cyan, peach, lilac) with large coral quotes, 5-star ratings, buyer initials avatar, and "Verified Buyer" tag (`reviews.tsx`) - ✅ Complete
10. **Closing CTA Banner**: Split banner featuring `HOMEPAGE_BOTTOMBANNER_DESKTOP_V3-compressed.png`, heading `"Ready for Whatever's Next."`, copy, and coral CTA button `"Shop Now"` (`closing-cta.tsx`) - ✅ Complete
11. **Site Footer**: Royal blue background with integrated newsletter subscription form (`"Shop With Us"`, `"Your favorite email, probably."`), social icons (Instagram, YouTube, Facebook, Twitter), 3-column navigation directory (`Products`, `Company`, `Support`), language indicator, and copyright notice (`footer.tsx`) - ✅ Complete

## Verification
- Browser viewport 1440x900 full page comparison screenshot captured to `docs/design-references/raycon/local-1440x900-full.png`.
- Automated check `npm run check` (ESLint + TypeScript + Next.js build) passes with 0 errors and 0 warnings.
- All product data, swatches, categories, and review mock data cleanly decoupled into `src/data/products.ts`.
