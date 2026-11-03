"use client";

import { useEffect, useRef, useState } from "react";
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

  useEffect(() => {
    // If not provided from SSR or to keep in real-time sync with MySQL
    let isMounted = true;
    getProducts({ featured: true }).then((products) => {
      if (isMounted && products && products.length > 0) {
        setItems(products);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  function scrollByCard(direction: -1 | 1) {
    const node = scroller.current;
    if (!node) return;
    const amount = Math.min(node.clientWidth * 0.8, 380);
    node.scrollBy({ left: amount * direction, behavior: "smooth" });
  }

  return (
    <section className="bg-white py-14 md:py-20">
      <div className="raycon-container">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="text-[32px] font-bold md:text-[36px]">Fan Favorites</h2>
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
          className="flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
