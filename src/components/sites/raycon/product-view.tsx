"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Check,
  ChevronRight,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";

import { formatReviewCount, formatUsd, type Product } from "@/data/products";
import { useCartStore } from "@/store/use-cart-store";

import { StarIcon } from "./icons";
import { ProductCard } from "./product-card";

interface ProductViewProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductView({ product, relatedProducts }: ProductViewProps) {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [customActiveImage, setCustomActiveImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "shipping">(
    "description",
  );
  const [added, setAdded] = useState(false);

  const addItem = useCartStore((state) => state.addItem);

  const selectedColor =
    product.colors[selectedColorIndex] ?? product.colors[0];

  // Gallery images: combine color image with product gallery
  const allImages = [
    selectedColor?.image || product.image,
    ...product.galleryImages.filter((img) => img !== selectedColor?.image),
  ];

  const activeImage =
    customActiveImage || selectedColor?.image || product.image;

  function handleSelectColor(index: number) {
    setSelectedColorIndex(index);
    setCustomActiveImage(null);
  }

  function handleAddToCart() {
    if (selectedColor) {
      addItem(product, selectedColor, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 1200);
    }
  }

  const savings =
    product.compareAtPrice > product.price
      ? product.compareAtPrice - product.price
      : 0;

  return (
    <div className="bg-[#fafbfc] pb-16">
      {/* Breadcrumb Navigation */}
      <div className="border-b border-navy/5 bg-white">
        <div className="raycon-container py-3">
          <nav className="flex items-center gap-1.5 text-xs text-navy/60 font-medium">
            <Link href="/" className="hover:text-royal transition-colors">
              Home
            </Link>
            <ChevronRight className="size-3.5 text-navy/40" />
            <Link
              href={`/collections/${product.collectionSlug}`}
              className="hover:text-royal transition-colors capitalize"
            >
              {product.collectionSlug.replace(/-/g, " ")}
            </Link>
            <ChevronRight className="size-3.5 text-navy/40" />
            <span className="text-navy font-semibold line-clamp-1">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* Main PDP Section */}
      <div className="raycon-container pt-8 md:pt-12">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14 items-start">
          {/* Left Column: Image Gallery */}
          <div className="flex flex-col gap-4">
            {/* Main Featured Image Display */}
            <div className="relative overflow-hidden rounded-[28px] border border-navy/5 bg-[#e8f7ff] p-8 md:p-12 shadow-sm">
              {product.badge ? (
                <span className="absolute top-4 left-4 z-10 inline-flex items-center rounded-full bg-[#f05c56] px-3.5 py-1 text-xs font-bold tracking-wider text-white uppercase shadow-xs">
                  {product.badge}
                </span>
              ) : null}

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeImage}
                alt={`${product.name} in ${selectedColor?.name}`}
                className="aspect-square w-full object-contain transition-all duration-300 drop-shadow-md hover:scale-[1.03]"
              />
            </div>

            {/* Thumbnail Row */}
            <div className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {allImages.map((img, i) => (
                <button
                  key={`${img}-${i}`}
                  type="button"
                  onClick={() => setCustomActiveImage(img)}
                  className={`size-20 shrink-0 overflow-hidden rounded-2xl border-2 bg-[#e8f7ff] p-2 transition-all cursor-pointer ${
                    activeImage === img
                      ? "border-royal ring-2 ring-royal/30"
                      : "border-black/5 hover:border-navy/30"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="" className="size-full object-contain" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Product Info & Purchase Actions */}
          <div className="flex flex-col">
            {/* Rating & Reviews */}
            <div className="flex items-center gap-2">
              <div className="flex text-[#f05c56]">
                {Array.from({ length: 5 }).map((_, index) => (
                  <StarIcon key={index} className="size-4 fill-current" />
                ))}
              </div>
              <span className="text-sm font-bold text-navy">
                {product.rating.toFixed(1)}
              </span>
              <span className="text-sm font-medium text-navy/60">
                ({formatReviewCount(product.reviewCount)} reviews)
              </span>
              <span className="text-navy/30">·</span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                <Check className="size-3" /> In Stock
              </span>
            </div>

            {/* Title & Tagline */}
            <h1 className="mt-3 text-[28px] font-bold leading-tight text-navy md:text-[38px]">
              {product.name}
            </h1>
            <p className="mt-2 text-base text-navy/70">{product.tagline}</p>

            {/* Pricing Section */}
            <div className="mt-5 flex items-baseline gap-3 border-y border-navy/10 py-4">
              <span className="text-3xl font-bold text-royal">
                {formatUsd(product.price)}
              </span>
              {product.compareAtPrice > product.price ? (
                <>
                  <span className="text-lg text-navy/40 line-through font-medium">
                    {formatUsd(product.compareAtPrice)}
                  </span>
                  <span className="rounded-full bg-[#fde8e4] px-2.5 py-0.5 text-xs font-bold text-[#f05c56]">
                    Save {formatUsd(savings)}
                  </span>
                </>
              ) : null}
            </div>

            {/* Color Swatch Selection */}
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-navy uppercase tracking-wider">
                  Color: <strong className="text-royal">{selectedColor?.name}</strong>
                </span>
                <span className="text-xs text-navy/50 font-medium">
                  {product.colors.length} choices available
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2.5">
                {product.colors.map((color, index) => (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => handleSelectColor(index)}
                    aria-label={color.name}
                    className={`group relative flex items-center gap-2 rounded-full border-2 p-1 pr-3 transition-all cursor-pointer ${
                      selectedColorIndex === index
                        ? "border-royal bg-royal/5 shadow-xs"
                        : "border-black/10 hover:border-black/25 bg-white"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={color.swatch}
                      alt=""
                      className="size-6 rounded-full object-cover"
                    />
                    <span
                      className={`text-xs font-bold ${
                        selectedColorIndex === index ? "text-royal" : "text-navy/70"
                      }`}
                    >
                      {color.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & Add to Cart Controls */}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              {/* Quantity Stepper */}
              <div className="flex h-13 w-32 shrink-0 items-center justify-between rounded-full border-2 border-navy/15 bg-white px-2">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="flex size-9 items-center justify-center rounded-full text-navy/70 hover:bg-navy/5 hover:text-navy transition cursor-pointer"
                >
                  <Minus className="size-4" />
                </button>
                <span className="text-base font-bold text-navy">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                  className="flex size-9 items-center justify-center rounded-full text-navy/70 hover:bg-navy/5 hover:text-navy transition cursor-pointer"
                >
                  <Plus className="size-4" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                className={`flex h-13 flex-1 items-center justify-center gap-2 rounded-full px-8 text-sm font-bold tracking-wider uppercase transition-all cursor-pointer shadow-md ${
                  added
                    ? "bg-emerald-600 text-white scale-[1.02]"
                    : "bg-royal text-white hover:bg-[#2827cd] hover:shadow-lg"
                }`}
              >
                <ShoppingBag className="size-4" />
                <span>{added ? "Added to Cart!" : "Add to Cart"}</span>
              </button>
            </div>

            {/* Direct Buy / Checkout Link */}
            <div className="mt-3">
              <Link
                href="/checkout"
                onClick={() => {
                  if (selectedColor) addItem(product, selectedColor, quantity);
                }}
                className="flex h-12 w-full items-center justify-center rounded-full border border-navy/20 bg-white text-sm font-bold text-navy hover:border-royal hover:text-royal transition"
              >
                Buy Now with 1-Click
              </Link>
            </div>

            {/* Value Props & Assurance Badges */}
            <div className="mt-8 grid grid-cols-3 gap-2 rounded-2xl border border-navy/10 bg-white p-4 text-center">
              <div className="flex flex-col items-center gap-1.5 p-1">
                <Truck className="size-5 text-royal" />
                <span className="text-xs font-bold text-navy">Free Shipping</span>
                <span className="text-[11px] text-navy/50">On orders over $50</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 p-1 border-x border-navy/10">
                <RotateCcw className="size-5 text-royal" />
                <span className="text-xs font-bold text-navy">30-Day Trial</span>
                <span className="text-[11px] text-navy/50">100% Risk-Free</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 p-1">
                <ShieldCheck className="size-5 text-royal" />
                <span className="text-xs font-bold text-navy">1-Year Warranty</span>
                <span className="text-[11px] text-navy/50">Full Replacement</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Product Details Area */}
        <div className="mt-16 md:mt-20">
          <div className="flex border-b border-navy/10">
            <button
              type="button"
              onClick={() => setActiveTab("description")}
              className={`pb-4 px-6 text-sm font-bold uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${
                activeTab === "description"
                  ? "border-royal text-royal"
                  : "border-transparent text-navy/60 hover:text-navy"
              }`}
            >
              Overview & Features
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("specs")}
              className={`pb-4 px-6 text-sm font-bold uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${
                activeTab === "specs"
                  ? "border-royal text-royal"
                  : "border-transparent text-navy/60 hover:text-navy"
              }`}
            >
              Tech Specs
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("shipping")}
              className={`pb-4 px-6 text-sm font-bold uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${
                activeTab === "shipping"
                  ? "border-royal text-royal"
                  : "border-transparent text-navy/60 hover:text-navy"
              }`}
            >
              Shipping & Returns
            </button>
          </div>

          <div className="bg-white rounded-b-3xl p-6 md:p-10 shadow-xs border border-t-0 border-navy/5">
            {activeTab === "description" ? (
              <div className="max-w-3xl space-y-4">
                <h3 className="text-xl font-bold text-navy">Engineered for Daily Life</h3>
                <p className="text-base text-navy/80 leading-relaxed">
                  {product.description}
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="flex items-start gap-2.5 rounded-2xl bg-[#e8f7ff] p-4">
                    <Check className="size-5 text-royal shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-navy">Instant Bluetooth Pairing</p>
                      <p className="text-xs text-navy/70">Connects seamlessly the moment you open the case.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 rounded-2xl bg-[#e8f7ff] p-4">
                    <Check className="size-5 text-royal shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-navy">Signature Sound Profile</p>
                      <p className="text-xs text-navy/70">Warm bass and crystal-clear vocals tuned by audio experts.</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {activeTab === "specs" ? (
              <div className="max-w-2xl">
                <h3 className="text-xl font-bold text-navy mb-4">Technical Specifications</h3>
                <dl className="divide-y divide-navy/10 rounded-2xl border border-navy/10 bg-[#fafbfc] overflow-hidden">
                  {product.specs.map((spec) => (
                    <div
                      key={spec.label}
                      className="grid grid-cols-2 px-5 py-3.5 text-sm"
                    >
                      <dt className="font-semibold text-navy/70">{spec.label}</dt>
                      <dd className="font-bold text-navy text-right">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : null}

            {activeTab === "shipping" ? (
              <div className="max-w-3xl space-y-4 text-sm text-navy/80 leading-relaxed">
                <h3 className="text-xl font-bold text-navy">Hassle-Free Shipping & Warranty</h3>
                <p>
                  All domestic US & Vietnam express orders placed before 2:00 PM are processed same-day. We offer free standard tracked shipping on all orders over $50.
                </p>
                <ul className="list-disc pl-5 space-y-2 text-navy/70">
                  <li>Standard Delivery: 2–4 business days with tracking number.</li>
                  <li>30-Day Money-Back Guarantee: If you aren&apos;t completely satisfied, return them for a full refund.</li>
                  <li>1-Year Limited Manufacturer Warranty: Covers defects in materials and craftsmanship.</li>
                </ul>
              </div>
            ) : null}
          </div>
        </div>

        {/* Related Products Carousel / Grid */}
        {relatedProducts.length > 0 ? (
          <div className="mt-16 md:mt-24">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <p className="text-xs font-bold tracking-widest text-royal uppercase">
                  Complete Your Setup
                </p>
                <h2 className="mt-1 text-2xl font-bold text-navy md:text-3xl">
                  You May Also Like
                </h2>
              </div>
              <Link
                href="/collections/all"
                className="text-sm font-bold text-royal hover:underline"
              >
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
