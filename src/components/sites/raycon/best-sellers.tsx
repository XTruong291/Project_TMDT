"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { bestSellers as fallbackBestSellers } from "@/data/products";
import { getProducts } from "@/lib/api";
import type { Product } from "@/types/product";
import { ChevronIcon } from "./icons";
import { ProductCard } from "./product-card";

interface BestSellersCarouselProps {
  initialProducts?: Product[];
}

export function BestSellersCarousel({
  initialProducts,
}: BestSellersCarouselProps) {
  const scroller = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<Product[]>(
    initialProducts && initialProducts.length > 0
      ? initialProducts
      : fallbackBestSellers,
  );
  const [activeTab, setActiveTab] = useState<"all" | "featured" | "newest">("all");

  useEffect(() => {
    // Keep in real-time sync with MySQL
    let isMounted = true;
    getProducts().then((products) => {
      if (isMounted && products && products.length > 0) {
        setItems(products);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const displayedItems = useMemo(() => {
    if (activeTab === "featured") {
      const featured = items.filter((p) => p.featured);
      return featured.length > 0 ? featured : items;
    }
    if (activeTab === "newest") {
      return [...items].sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      });
    }
    return items;
  }, [items, activeTab]);

  function scrollByCard(direction: -1 | 1) {
    const node = scroller.current;
    if (!node) return;
    const amount = Math.min(node.clientWidth * 0.8, 380);
    node.scrollBy({ left: amount * direction, behavior: "smooth" });
  }

  const featuredCount = useMemo(() => items.filter((p) => p.featured).length, [items]);

  return (
    <section className="bg-white py-14 md:py-20">
      <div className="raycon-container">
        <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h2 className="text-[32px] font-bold md:text-[36px]">Fan Favorites</h2>
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "all"
                    ? "bg-navy text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Tất cả sản phẩm ({items.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("featured")}
                className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "featured"
                    ? "bg-navy text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Nổi bật ({featuredCount})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("newest")}
                className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "newest"
                    ? "bg-navy text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Mới nhất
              </button>
            </div>
          </div>

          <div className="hidden gap-2 md:flex">
            <button
              type="button"
              aria-label="Previous products"
              className="flex size-11 items-center justify-center rounded-full border border-navy/15 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => scrollByCard(-1)}
            >
              <ChevronIcon className="size-5 rotate-180" />
            </button>
            <button
              type="button"
              aria-label="Next products"
              className="flex size-11 items-center justify-center rounded-full border border-navy/15 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => scrollByCard(1)}
            >
              <ChevronIcon className="size-5" />
            </button>
          </div>
        </div>

        <div
          ref={scroller}
          className="flex items-stretch gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {displayedItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
