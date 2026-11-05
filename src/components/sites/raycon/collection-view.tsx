"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpDown, ChevronRight, Filter, SlidersHorizontal, Sparkles } from "lucide-react";

import type { CollectionInfo, Product } from "@/data/products";
import { SUB_CATEGORIES_BY_COLLECTION } from "@/types/product";

import { ProductCard } from "./product-card";

interface CollectionViewProps {
  initialProducts: Product[];
  collection: CollectionInfo;
}

type FilterType = "all" | "under-50" | "over-50" | "top-rated" | "on-sale";
type SortType = "featured" | "price-asc" | "price-desc" | "rating" | "reviews";

export function CollectionView({
  initialProducts,
  collection,
}: CollectionViewProps) {
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("all");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [activeSort, setActiveSort] = useState<SortType>("featured");

  const subCategories = SUB_CATEGORIES_BY_COLLECTION[collection.slug] || [];

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...initialProducts];

    // Subcategory filter (Level 2)
    if (selectedSubCategory !== "all") {
      result = result.filter((p) => p.subCategory === selectedSubCategory);
    }

    // Quick filter
    if (activeFilter === "under-50") {
      result = result.filter((p) => p.price < 50);
    } else if (activeFilter === "over-50") {
      result = result.filter((p) => p.price >= 50);
    } else if (activeFilter === "top-rated") {
      result = result.filter((p) => p.rating >= 4.5);
    } else if (activeFilter === "on-sale") {
      result = result.filter(
        (p) =>
          p.badge !== null || (p.compareAtPrice != null && p.compareAtPrice > p.price),
      );
    }

    // Sort
    if (activeSort === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (activeSort === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (activeSort === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (activeSort === "reviews") {
      result.sort((a, b) => b.reviewCount - a.reviewCount);
    }

    return result;
  }, [initialProducts, selectedSubCategory, activeFilter, activeSort]);

  const filterOptions: { id: FilterType; label: string }[] = [
    { id: "all", label: "All Items" },
    { id: "on-sale", label: "On Sale / Deals" },
    { id: "under-50", label: "Under $50" },
    { id: "over-50", label: "$50 & Above" },
    { id: "top-rated", label: "Top Rated (4.5★+)" },
  ];

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      {/* Breadcrumb Navigation */}
      <div className="border-b border-navy/5 bg-white">
        <div className="raycon-container py-3">
          <nav className="flex items-center gap-1.5 text-xs text-navy/60 font-medium">
            <Link href="/" className="hover:text-royal transition-colors">
              Home
            </Link>
            <ChevronRight className="size-3.5 text-navy/40" />
            <Link href="/collections/all" className="hover:text-royal transition-colors">
              Collections
            </Link>
            <ChevronRight className="size-3.5 text-navy/40" />
            <span className="text-navy font-semibold">{collection.title}</span>
          </nav>
        </div>
      </div>

      {/* Collection Hero Banner */}
      <div className="relative overflow-hidden bg-[linear-gradient(115deg,#0d1163_0%,#1a1db6_50%,#2d50ed_100%)] text-white">
        {/* Subtle decorative background */}
        {collection.bannerImage ? (
          <div className="pointer-events-none absolute inset-0 opacity-15 mix-blend-overlay">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={collection.bannerImage}
              alt=""
              className="size-full object-cover object-center"
            />
          </div>
        ) : null}

        <div className="raycon-container relative z-10 py-12 md:py-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold tracking-wider text-white uppercase backdrop-blur-xs">
              <Sparkles className="size-3.5 text-[#ffb13b]" />
              <span>Raycon Collection</span>
            </div>
            <h1 className="mt-4 text-[32px] leading-tight font-bold md:text-[48px] md:leading-[54px]">
              {collection.title}
            </h1>
            <p className="mt-3 text-base text-white/85 md:text-lg">
              {collection.tagline}
            </p>
            <div className="mt-5 text-xs font-semibold text-white/70">
              Showing {filteredAndSortedProducts.length} of {initialProducts.length} products
            </div>
          </div>
        </div>
      </div>

      {/* Subcategory Level 2 Tabs */}
      {subCategories.length > 0 && (
        <div className="border-b border-navy/5 bg-white py-2.5">
          <div className="raycon-container flex items-center gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <span className="text-xs font-bold text-navy/50 uppercase mr-1 shrink-0">
              Phân loại:
            </span>
            <button
              type="button"
              onClick={() => setSelectedSubCategory("all")}
              className={`rounded-full px-3.5 py-1 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedSubCategory === "all"
                  ? "bg-navy text-white shadow-xs"
                  : "bg-gray-100 text-navy/70 hover:bg-gray-200"
              }`}
            >
              Tất cả ({initialProducts.length})
            </button>
            {subCategories.map((sub) => {
              const count = initialProducts.filter(
                (p) => p.subCategory === sub.slug,
              ).length;
              return (
                <button
                  key={sub.slug}
                  type="button"
                  onClick={() => setSelectedSubCategory(sub.slug)}
                  className={`rounded-full px-3.5 py-1 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    selectedSubCategory === sub.slug
                      ? "bg-royal text-white shadow-xs"
                      : "bg-gray-100 text-navy/70 hover:bg-gray-200"
                  }`}
                >
                  {sub.label} {count > 0 ? `(${count})` : ""}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Filter & Sort Controls Toolbar */}
      <div className="sticky top-[66px] z-30 border-b border-navy/10 bg-white/95 backdrop-blur-md shadow-xs">
        <div className="raycon-container flex flex-wrap items-center justify-between gap-4 py-3.5">
          {/* Quick Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <span className="hidden items-center gap-1.5 text-xs font-bold text-navy/70 uppercase lg:flex mr-1">
              <Filter className="size-3.5 text-royal" />
              Filter:
            </span>
            {filterOptions.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveFilter(f.id)}
                className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === f.id
                    ? "bg-royal text-white shadow-xs"
                    : "border border-navy/15 bg-white text-navy/70 hover:border-royal hover:text-royal"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="ml-auto flex items-center gap-2">
            <label
              htmlFor="collection-sort"
              className="flex items-center gap-1 text-xs font-bold text-navy/70 uppercase shrink-0"
            >
              <ArrowUpDown className="size-3.5 text-royal" />
              <span className="hidden sm:inline">Sort:</span>
            </label>
            <select
              id="collection-sort"
              value={activeSort}
              onChange={(e) => setActiveSort(e.target.value as SortType)}
              className="h-9 rounded-full border border-navy/15 bg-white px-3.5 text-xs font-semibold text-navy outline-none focus:border-royal cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="reviews">Most Reviews</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid Area */}
      <div className="raycon-container py-10 md:py-14">
        {filteredAndSortedProducts.length === 0 ? (
          <div className="flex min-h-[340px] flex-col items-center justify-center rounded-3xl border border-dashed border-navy/20 bg-white p-8 text-center">
            <SlidersHorizontal className="size-12 text-navy/30 mb-3" />
            <h3 className="text-xl font-bold text-navy">No products match your filter</h3>
            <p className="mt-1 text-sm text-navy/60 max-w-sm">
              Try adjusting your filter criteria or switch back to view all products in this collection.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveFilter("all");
                setActiveSort("featured");
                setSelectedSubCategory("all");
              }}
              className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-royal px-6 text-xs font-bold text-white transition hover:bg-[#2827cd]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredAndSortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

