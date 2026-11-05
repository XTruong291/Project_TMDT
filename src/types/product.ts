export type ProductColor = {
  name: string;
  swatch: string;
  image: string;
};

export type ProductSpec = {
  label: string;
  value: string;
};

export type ProductCategory =
  | "earbuds"
  | "open-audio"
  | "headphones"
  | "power-tech"
  | string;

export type Product = {
  id: string;
  handle: string;
  name: string;
  sku?: string | null;
  tagline: string;
  category: ProductCategory;
  subCategory?: string | null;
  collectionSlug: string;
  href: string;
  image: string;
  price: number;
  compareAtPrice?: number | null;
  badge?: string | null;
  rating: number;
  reviewCount: number;
  colors: ProductColor[];
  galleryImages: string[];
  specs: ProductSpec[];
  description: string;
  inStock: boolean;
  isActive?: boolean;
  featured?: boolean;
};

export const SUB_CATEGORIES_BY_COLLECTION: Record<
  string,
  { label: string; slug: string }[]
> = {
  earbuds: [
    { label: "True Wireless", slug: "true-wireless" },
    { label: "Sport & Fitness", slug: "sport-fitness" },
  ],
  "open-audio": [
    { label: "Open-Ear Clips", slug: "open-clip" },
    { label: "Bone Conduction", slug: "bone-conduction" },
  ],
  headphones: [
    { label: "Over-Ear ANC", slug: "over-ear-anc" },
    { label: "Everyday Wireless", slug: "everyday-wireless" },
  ],
  "power-tech": [
    { label: "Magnetic & Fast Cables", slug: "fast-cables" },
    { label: "Wireless Chargers", slug: "wireless-chargers" },
  ],
};

export type CategoryCard = {
  name: string;
  slug: string;
  href: string;
  image: string;
};

export type BrandStoryItem = {
  title: string;
  copy: string;
  image: string;
};

export type CoreTechCallout = {
  label: string;
  body: string;
  position: "top-left" | "middle-right" | "bottom-left";
};

export type Review = {
  quote: string;
  initial: string;
  name: string;
  verified: boolean;
  tint: "cyan" | "peach" | "lilac";
};
