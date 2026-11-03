export type ProductColor = {
  name: string;
  swatch: string;
  image: string;
};

export type Product = {
  id: string;
  handle: string;
  name: string;
  tagline: string;
  href: string;
  image: string;
  price: number;
  compareAtPrice: number;
  badge: string | null;
  rating: number;
  reviewCount: number;
  colors: ProductColor[];
  featured?: boolean;
};

const IMG = "/sites/raycon/images";

export const products: Product[] = [
  {
    id: "everyday-earbuds",
    handle: "the-everyday-earbuds",
    name: "Everyday Earbuds",
    tagline: "Pocket-size sound for active days.",
    href: "https://rayconglobal.com/products/the-everyday-earbuds",
    image: `${IMG}/E25_BLA_IMG1.png`,
    price: 63.99,
    compareAtPrice: 79.98,
    badge: "20% OFF",
    rating: 4.4,
    reviewCount: 232893,
    featured: true,
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
    href: "https://rayconglobal.com/products/bone-conduction-headphones",
    image: `${IMG}/bc-blue.png`,
    price: 69.99,
    compareAtPrice: 99.98,
    badge: "30% OFF",
    rating: 4.2,
    reviewCount: 3617,
    featured: true,
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
    href: "https://rayconglobal.com/products/essential-open-earbuds",
    image: `${IMG}/515.2514_6e551754-ab11-46e0-9eca-d9cb9a6e0ea6.png`,
    price: 47.99,
    compareAtPrice: 79.98,
    badge: "40% OFF",
    rating: 4.5,
    reviewCount: 4777,
    featured: true,
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
    href: "https://rayconglobal.com/products/everyday-clip-earbuds",
    image: `${IMG}/O55_bla_002_V1.png`,
    price: 69.99,
    compareAtPrice: 99.98,
    badge: "30% OFF",
    rating: 4.5,
    reviewCount: 685,
    featured: true,
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
    href: "https://rayconglobal.com/products/the-fitness-earbuds",
    image: `${IMG}/E45_BLU_IMG1_d64b334f-cb84-48a3-b8fb-9c0a8e264cee.png`,
    price: 83.99,
    compareAtPrice: 119.98,
    badge: "NEW - 30% OFF",
    rating: 4.6,
    reviewCount: 91738,
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
    href: "https://rayconglobal.com/products/the-everyday-h20-headphones",
    image: `${IMG}/H20_BLA_IMG1_720x.png`,
    price: 69.99,
    compareAtPrice: 99.98,
    badge: "30% OFF",
    rating: 4.5,
    reviewCount: 18400,
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
    href: "https://rayconglobal.com/products/magic-spin-cable",
    image: `${IMG}/SPN61C_BLA_CAROUSEL_IMG1_720x.png`,
    price: 19.99,
    compareAtPrice: 24.98,
    badge: null,
    rating: 4.7,
    reviewCount: 2100,
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

export type CategoryCard = {
  name: string;
  href: string;
  image: string;
};

export const categories: CategoryCard[] = [
  {
    name: "Open Audio",
    href: "https://rayconglobal.com/collections/open-audio",
    image: `${IMG}/OPENAUDIO_V1_365ca4c1-e37b-4f34-aea4-74ed4346d7ac.png`,
  },
  {
    name: "Earbuds",
    href: "https://rayconglobal.com/collections/earbuds",
    image: `${IMG}/EARBUDS_V1.png`,
  },
  {
    name: "Headphones",
    href: "https://rayconglobal.com/collections/headphones",
    image: `${IMG}/HEADPHONES_V1.png`,
  },
  {
    name: "Power Tech",
    href: "https://rayconglobal.com/collections/power-tech",
    image: `${IMG}/FASTCHARGE_V1.png`,
  },
];

export type BrandStoryItem = {
  title: string;
  copy: string;
  image: string;
};

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

export type CoreTechCallout = {
  label: string;
  body: string;
  position: "top-left" | "middle-right" | "bottom-left";
};

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

export type Review = {
  quote: string;
  initial: string;
  name: string;
  verified: boolean;
  tint: "cyan" | "peach" | "lilac";
};

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

export function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export function formatReviewCount(count: number) {
  return new Intl.NumberFormat("en-US").format(count);
}
