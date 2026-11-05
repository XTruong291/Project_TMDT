import type {
  BrandStoryItem,
  CategoryCard,
  CoreTechCallout,
  Product,
  ProductColor,
  ProductSpec,
  Review,
} from "@/types/product";

export type {
  BrandStoryItem,
  CategoryCard,
  CoreTechCallout,
  Product,
  ProductColor,
  ProductSpec,
  Review,
};

const IMG = "/sites/raycon/images";

export const products: Product[] = [
  {
    id: "everyday-earbuds",
    handle: "the-everyday-earbuds",
    name: "Everyday Earbuds",
    tagline: "Pocket-size sound for active days.",
    category: "earbuds",
    collectionSlug: "earbuds",
    href: "/products/the-everyday-earbuds",
    image: `${IMG}/E25_BLA_IMG1.png`,
    price: 1590000,
    compareAtPrice: 1990000,
    badge: "20% OFF",
    rating: 4.4,
    reviewCount: 232893,
    featured: true,
    inStock: true,
    description:
      "Engineered for daily life, the Everyday Earbuds pack custom-tuned 6mm drivers into an ultra-compact, ergonomic body. Featuring seamless Bluetooth 5.2 pairing, crystal-clear microphone audio, and up to 40 hours of playtime with the pocket charging case.",
    galleryImages: [
      `${IMG}/E25_BLA_IMG1.png`,
      `${IMG}/E25_BLU_IMG1.png`,
      `${IMG}/earbuds-detail-trim.png`,
      `${IMG}/raycon-case.png`,
    ],
    specs: [
      { label: "Battery Life", value: "8 hours per charge (40 hrs total)" },
      { label: "Bluetooth", value: "Version 5.2 (10m range)" },
      { label: "Water Resistance", value: "IPX4 Water & Sweat Proof" },
      { label: "Drivers", value: "6mm Neodymium Dynamic Drivers" },
      { label: "Charging", value: "USB-C & Wireless Charging" },
      { label: "Weight", value: "4.2g per earbud" },
    ],
    colors: [
      {
        name: "Carbon Black",
        swatch: `${IMG}/swatch-black_200x.png`,
        image: `${IMG}/E25_BLA_IMG1.png`,
      },
      {
        name: "Electric Blue",
        swatch: `${IMG}/swatch-electric-blue_200x.png`,
        image: `${IMG}/E25_BLU_IMG1.png`,
      },
      {
        name: "Rose Gold",
        swatch: `${IMG}/swatch-black_180x.png`,
        image: `${IMG}/E25_ROS_IMG1.png`,
      },
      {
        name: "Cool Mint",
        swatch: `${IMG}/swatch-mint_200x.png`,
        image: `${IMG}/E25_MIN_IMG1.png`,
      },
      {
        name: "Blush Violet",
        swatch: `${IMG}/swatch_purple-violet_200x.jpg`,
        image: `${IMG}/E25_PUR_IMG1.png`,
      },
    ],
  },
  {
    id: "bone-conduction-gen-1",
    handle: "bone-conduction-headphones",
    name: "Everyday Bone Conduction Headphones (Gen 1)",
    tagline: "Total awareness for bud-free listening.",
    category: "headphones",
    collectionSlug: "headphones",
    href: "/products/bone-conduction-headphones",
    image: `${IMG}/bc-blue.png`,
    price: 1750000,
    compareAtPrice: 2490000,
    badge: "30% OFF",
    rating: 4.2,
    reviewCount: 3617,
    featured: true,
    inStock: true,
    description:
      "Deliver sound through your cheekbones directly to your inner ears, leaving your ears completely open to ambient sound. Perfect for outdoor runners, cyclists, and professionals needing all-day environmental awareness.",
    galleryImages: [
      `${IMG}/bc-blue.png`,
      `${IMG}/RBB842_CAROUSEL_IMG2_720x.png`,
      `${IMG}/RBB842_PUR_CAROUSEL_IMG2.png`,
    ],
    specs: [
      { label: "Battery Life", value: "10 hours continuous playtime" },
      { label: "Bluetooth", value: "Bluetooth 5.3 Multipoint" },
      { label: "Design", value: "Open-Ear Titanium Wrap-around" },
      { label: "Water Resistance", value: "IP55 Water Resistant" },
      { label: "Microphone", value: "Dual Dual-Mic Noise Reduction" },
      { label: "Charging", value: "Magnetic Quick Charge" },
    ],
    colors: [
      {
        name: "Royal Blue",
        swatch: `${IMG}/swatch-royal-blue_200x.png`,
        image: `${IMG}/bc-blue.png`,
      },
      {
        name: "Gray",
        swatch: `${IMG}/swatch-carbon-black_200x.png`,
        image: `${IMG}/RBB842_CAROUSEL_IMG2_720x.png`,
      },
    ],
  },
  {
    id: "essential-open-earbuds",
    handle: "essential-open-earbuds",
    name: "Essential Open Earbuds",
    tagline: "Minimalist design for all day comfort.",
    category: "open-audio",
    collectionSlug: "open-audio",
    href: "/products/essential-open-earbuds",
    image: `${IMG}/515.2514_6e551754-ab11-46e0-9eca-d9cb9a6e0ea6.png`,
    price: 1190000,
    compareAtPrice: 1990000,
    badge: "40% OFF",
    rating: 4.5,
    reviewCount: 4777,
    featured: true,
    inStock: true,
    description:
      "Ultralight hook-style open-ear buds designed for featherlight fit with zero ear pressure. Stream music, take conference calls, and stay tuned into your surroundings simultaneously.",
    galleryImages: [
      `${IMG}/515.2514_6e551754-ab11-46e0-9eca-d9cb9a6e0ea6.png`,
      `${IMG}/511.2510_45f8dead-6bfa-4a78-bba8-3a7045131a05.png`,
      `${IMG}/O15_BLA_IMG2_1ddc0f96-909d-44eb-b15d-70bf2b496d24_720x.png`,
    ],
    specs: [
      { label: "Battery Life", value: "32 hours total with charging case" },
      { label: "Audio Profile", value: "Directional Acoustic Bass" },
      { label: "Form Factor", value: "Flexible Memory Wire Earhooks" },
      { label: "Weight", value: "5.1g per earbud" },
      { label: "Water Resistance", value: "IPX5 Splash-proof" },
    ],
    colors: [
      {
        name: "Carbon Black",
        swatch: `${IMG}/swatch-carbonblack_200x.png`,
        image: `${IMG}/515.2514_6e551754-ab11-46e0-9eca-d9cb9a6e0ea6.png`,
      },
      {
        name: "Midnight Blue",
        swatch: `${IMG}/swatch-royal-blue_180x.png`,
        image: `${IMG}/511.2510_45f8dead-6bfa-4a78-bba8-3a7045131a05.png`,
      },
      {
        name: "Cool Mint",
        swatch: `${IMG}/swatch-mint_180x.png`,
        image: `${IMG}/O15_BLA_IMG2_1ddc0f96-909d-44eb-b15d-70bf2b496d24_720x.png`,
      },
    ],
  },
  {
    id: "everyday-clip-earbuds",
    handle: "everyday-clip-earbuds",
    name: "Everyday Clip Earbuds",
    tagline: "Lightweight, clip-on sound that never gets in the way.",
    category: "open-audio",
    collectionSlug: "open-audio",
    href: "/products/everyday-clip-earbuds",
    image: `${IMG}/O55_bla_002_V1.png`,
    price: 1750000,
    compareAtPrice: 2490000,
    badge: "30% OFF",
    rating: 4.5,
    reviewCount: 685,
    featured: true,
    inStock: true,
    description:
      "A revolutionary clip-on jewelry-style audio accessory that clamps gently around the outer ear cartilage. Delivers spatial sound directly to your ear canal without blocking outside voices.",
    galleryImages: [
      `${IMG}/O55_bla_002_V1.png`,
      `${IMG}/O55_blu_002_V1.png`,
      `${IMG}/O55_pur_002_V1.png`,
    ],
    specs: [
      { label: "Battery Life", value: "36 hours with pebble charging case" },
      { label: "Fit Style", value: "Ear-cuff Clip design" },
      { label: "Sound Leakage", value: "Reverse sound wave cancellation" },
      { label: "Water Resistance", value: "IPX4 Weather Resistant" },
    ],
    colors: [
      {
        name: "Carbon Black",
        swatch: `${IMG}/swatch-carbonblack_180x.png`,
        image: `${IMG}/O55_bla_002_V1.png`,
      },
      {
        name: "Midnight Blue",
        swatch: `${IMG}/swatch-royal-blue_200x.png`,
        image: `${IMG}/O55_blu_002_V1.png`,
      },
      {
        name: "Blush Violet",
        swatch: `${IMG}/swatch-blush_200x.png`,
        image: `${IMG}/O55_pur_002_V1.png`,
      },
    ],
  },
  {
    id: "fitness-earbuds",
    handle: "the-fitness-earbuds",
    name: "Fitness Earbuds",
    tagline: "A perfect fit to keep you in the zone.",
    category: "earbuds",
    collectionSlug: "earbuds",
    href: "/products/the-fitness-earbuds",
    image: `${IMG}/E45_BLU_IMG1_d64b334f-cb84-48a3-b8fb-9c0a8e264cee.png`,
    price: 2090000,
    compareAtPrice: 2990000,
    badge: "NEW - 30% OFF",
    rating: 4.6,
    reviewCount: 91738,
    inStock: true,
    description:
      "Designed specifically for intense workouts, HIIT, and running. Includes interchangeable sport gel stabilizers that lock the earbuds in place no matter how hard you train. IPX7 waterproof rating withstands full sweat saturation.",
    galleryImages: [
      `${IMG}/E45_BLU_IMG1_d64b334f-cb84-48a3-b8fb-9c0a8e264cee.png`,
      `${IMG}/E45_BLA_IMG1_38763fde-0fa4-4df2-9058-ac46da7a1924.png`,
      `${IMG}/E45_Carousel_BLA_IMG2_720x.png`,
    ],
    specs: [
      { label: "Battery Life", value: "54 hours playtime with case" },
      { label: "Waterproof", value: "IPX7 Submersible Waterproof" },
      { label: "Stabilizers", value: "4 sets of sport wings included" },
      { label: "Sound Modes", value: "Pure Sound, Balanced Sound, Bass Boost" },
    ],
    colors: [
      {
        name: "Carbon Black",
        swatch: `${IMG}/swatch-black_200x.png`,
        image: `${IMG}/E45_BLA_IMG1_38763fde-0fa4-4df2-9058-ac46da7a1924.png`,
      },
      {
        name: "Midnight Blue",
        swatch: `${IMG}/swatch-royal-blue_200x.png`,
        image: `${IMG}/E45_BLU_IMG1_d64b334f-cb84-48a3-b8fb-9c0a8e264cee.png`,
      },
    ],
  },
  {
    id: "everyday-headphones",
    handle: "the-everyday-h20-headphones",
    name: "Everyday Headphones",
    tagline: "Built for long days, tuned for every sound.",
    category: "headphones",
    collectionSlug: "headphones",
    href: "/products/the-everyday-h20-headphones",
    image: `${IMG}/H20_BLA_IMG1_720x.png`,
    price: 1750000,
    compareAtPrice: 2490000,
    badge: "30% OFF",
    rating: 4.5,
    reviewCount: 18400,
    inStock: true,
    description:
      "Over-ear comfort with memory foam ear cushions and an ultra-flexible lightweight headband. Features active noise cancellation (ANC) and an impressive 38-hour battery for cross-country flights and deep work sessions.",
    galleryImages: [`${IMG}/H20_BLA_IMG1_720x.png`],
    specs: [
      { label: "Battery Life", value: "38 hours battery runtime" },
      { label: "Noise Cancellation", value: "Active Noise Cancellation (ANC)" },
      { label: "Driver Size", value: "40mm High-Definition Drivers" },
      { label: "Connectivity", value: "Bluetooth 5.0 + 3.5mm AUX jack" },
    ],
    colors: [
      {
        name: "Carbon Black",
        swatch: `${IMG}/swatch-black_200x.png`,
        image: `${IMG}/H20_BLA_IMG1_720x.png`,
      },
    ],
  },
  {
    id: "magic-spin-cable",
    handle: "magic-spin-cable",
    name: "Magic Spin Cable",
    tagline: "Ends rotate 180 degrees for frayproof charging.",
    category: "power-tech",
    collectionSlug: "power-tech",
    href: "/products/magic-spin-cable",
    image: `${IMG}/SPN61C_BLA_CAROUSEL_IMG1_720x.png`,
    price: 490000,
    compareAtPrice: 590000,
    badge: null,
    rating: 4.7,
    reviewCount: 2100,
    inStock: true,
    description:
      "Tangle-free, heavy-duty braided charging cable featuring a 180-degree rotating pivot head. Eliminates cable strain while gaming or using your device in bed.",
    galleryImages: [
      `${IMG}/SPN61C_BLA_CAROUSEL_IMG1_720x.png`,
      `${IMG}/SPN61C_MINT_CAROUSEL_IMG1_360x.png`,
    ],
    specs: [
      { label: "Length", value: "6 ft / 1.8m braided nylon" },
      { label: "Rotation", value: "180° swivel connector" },
      { label: "Power Output", value: "Up to 60W Fast Charging" },
      { label: "Durability", value: "20,000+ bend lifespan test" },
    ],
    colors: [
      {
        name: "Carbon Black",
        swatch: `${IMG}/swatch-black_200x.png`,
        image: `${IMG}/SPN61C_BLA_CAROUSEL_IMG1_720x.png`,
      },
      {
        name: "Cool Mint",
        swatch: `${IMG}/swatch-mint_200x.png`,
        image: `${IMG}/SPN61C_MINT_CAROUSEL_IMG1_360x.png`,
      },
    ],
  },
];

export const bestSellers = products.filter((product) => product.featured);

export type CollectionInfo = {
  slug: string;
  title: string;
  tagline: string;
  bannerImage: string;
};

export const collectionsMeta: Record<string, CollectionInfo> = {
  earbuds: {
    slug: "earbuds",
    title: "Wireless Earbuds",
    tagline: "Pocket-sized audio tuned for active movement, all-day comfort, and punchy bass.",
    bannerImage: `${IMG}/E25_DESKTOP_48e0dc56-5fe6-4d9b-80e7-216f9fe86594.png`,
  },
  "open-audio": {
    slug: "open-audio",
    title: "Open Audio Collection",
    tagline: "Total situational awareness. High-clarity sound that rests outside your ear canal.",
    bannerImage: `${IMG}/OPENAUDIO_V1_365ca4c1-e37b-4f34-aea4-74ed4346d7ac.png`,
  },
  headphones: {
    slug: "headphones",
    title: "Over-Ear Headphones",
    tagline: "Immersive soundstage, active noise cancellation, and marathon battery life.",
    bannerImage: `${IMG}/HEADPHONES_V1.png`,
  },
  "power-tech": {
    slug: "power-tech",
    title: "Power Tech & Fast Charge",
    tagline: "Heavy-duty 180° rotating cables and fast charging gear built to never fray.",
    bannerImage: `${IMG}/FASTCHARGE_V1.png`,
  },
  special: {
    slug: "special",
    title: "Special Offers & Limited Deals",
    tagline: "Limited-time deals, up to 50% off select RYVO favorites and bundles.",
    bannerImage: `${IMG}/HP_EVRGRN-BANNER_DESKTOP_A.png`,
  },
  all: {
    slug: "all",
    title: "All Products",
    tagline: "Explore the complete lineup of everyday tech and audio gear.",
    bannerImage: `${IMG}/HOMEPAGE_BOTTOMBANNER_DESKTOP_V3-compressed.png`,
  },
  accessories: {
    slug: "accessories",
    title: "Accessories & Cables",
    tagline: "Essential companion accessories, cables, and replacement gear.",
    bannerImage: `${IMG}/FASTCHARGE_V1.png`,
  },
};

export function getCollectionInfo(slug: string): CollectionInfo {
  return (
    collectionsMeta[slug] || {
      slug,
      title: `${slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ")} Collection`,
      tagline: "Premium everyday audio and tech essentials.",
      bannerImage: `${IMG}/HOMEPAGE_BOTTOMBANNER_DESKTOP_V3-compressed.png`,
    }
  );
}

export function getProductByHandle(handle: string): Product | undefined {
  return products.find((product) => product.handle === handle);
}

export function getProductsByCollection(collectionSlug: string): Product[] {
  if (collectionSlug === "all") {
    return products;
  }
  if (collectionSlug === "special") {
    return products.filter((product) => product.badge !== null);
  }
  if (collectionSlug === "accessories") {
    return products.filter((product) => product.collectionSlug === "power-tech");
  }
  return products.filter(
    (product) =>
      product.collectionSlug === collectionSlug || product.category === collectionSlug,
  );
}

export const categories: CategoryCard[] = [
  {
    name: "Open Audio",
    slug: "open-audio",
    href: "/collections/open-audio",
    image: `${IMG}/OPENAUDIO_V1_365ca4c1-e37b-4f34-aea4-74ed4346d7ac.png`,
  },
  {
    name: "Earbuds",
    slug: "earbuds",
    href: "/collections/earbuds",
    image: `${IMG}/EARBUDS_V1.png`,
  },
  {
    name: "Headphones",
    slug: "headphones",
    href: "/collections/headphones",
    image: `${IMG}/HEADPHONES_V1.png`,
  },
  {
    name: "Power Tech",
    slug: "power-tech",
    href: "/collections/power-tech",
    image: `${IMG}/FASTCHARGE_V1.png`,
  },
];

export const brandStories: BrandStoryItem[] = [
  {
    title: "Effortless Tech.",
    copy: "No app downloads or 8-step pairing. Just take it out, pair, press play, and go.",
    image: `${IMG}/Group_9.png`,
  },
  {
    title: "Fits your Style.",
    copy: "Big color. Smooth curves. Serious compliments.",
    image: `${IMG}/Group_9_1.png`,
  },
  {
    title: "Built to Last.",
    copy: "Long-lasting charge and durable builds keep up from morning to night.",
    image: `${IMG}/Group_9_2.png`,
  },
];

export const coreTechFeatures: CoreTechCallout[] = [
  {
    label: "Featherlight Fit",
    body: "Ergonomic gel tips that disappear in your ears.",
    position: "top-left",
  },
  {
    label: "Tuned 6MM Drivers",
    body: "Balanced, bass-forward sound tuned in-house.",
    position: "middle-right",
  },
  {
    label: "IPX4 Waterproof",
    body: "Built for rain, sweat and quick rinse-offs.",
    position: "bottom-left",
  },
];

export const reviews: Review[] = [
  {
    quote:
      "I’ve washed my son’s in the washing machine three times — case and all — and they still work!! He loves them.",
    initial: "S",
    name: "Sierra B.",
    verified: true,
    tint: "cyan",
  },
  {
    quote:
      "Absolutely LOVE these! Superb sound quality and the battery life is amazing.",
    initial: "P",
    name: "Paul N.",
    verified: true,
    tint: "peach",
  },
  {
    quote:
      "Comfortable fit, they cut background noise, and they happen to match my new lilac bag. Couldn’t ask for more!!",
    initial: "J",
    name: "Jennifer M.",
    verified: true,
    tint: "lilac",
  },
];

export function formatVnd(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Math.round(value));
}

// Backward compatibility alias so all existing components work automatically
export const formatUsd = formatVnd;

export function formatReviewCount(count: number) {
  return new Intl.NumberFormat("en-US").format(count);
}
