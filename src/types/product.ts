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
  | "power-tech";

export type Product = {
  id: string;
  handle: string;
  name: string;
  tagline: string;
  category: ProductCategory;
  collectionSlug: string;
  href: string;
  image: string;
  price: number;
  compareAtPrice: number;
  badge: string | null;
  rating: number;
  reviewCount: number;
  colors: ProductColor[];
  galleryImages: string[];
  specs: ProductSpec[];
  description: string;
  inStock: boolean;
  featured?: boolean;
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

