"use client";

import { useState } from "react";

import {
  formatReviewCount,
  formatUsd,
  type Product,
} from "@/data/products";

import { StarIcon } from "./icons";

export function ProductCard({ product }: { product: Product }) {
  const [colorIndex, setColorIndex] = useState(0);
  const color = product.colors[colorIndex] ?? product.colors[0];
  const image = color?.image ?? product.image;

  return (
    <article className="flex h-full min-w-[280px] flex-1 flex-col rounded-[28px] bg-white p-3 shadow-[0_0_0_1px_rgba(31,40,58,0.04)] md:min-w-[320px] lg:min-w-[280px]">
      <div className="relative block overflow-hidden rounded-[22px] bg-[#e8f7ff]">
        {product.badge ? (
          <span className="absolute top-3 left-3 z-10 inline-flex items-center rounded-full bg-[#f05c56] px-2.5 py-1 text-[11px] font-bold tracking-wider text-white uppercase">
            {product.badge}
          </span>
        ) : null}

        <a href={product.href} className="block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={`${product.name}${color ? ` in ${color.name}` : ""}`}
            className="aspect-square w-full object-contain p-6 transition duration-300 hover:scale-[1.03]"
          />
        </a>
      </div>

      <div className="flex flex-1 flex-col px-2 pt-4 pb-2">
        <div className="mb-2 flex items-center gap-1.5 text-[13px] font-bold">
          <span className="flex text-[#f05c56]">
            {Array.from({ length: 5 }).map((_, index) => (
              <StarIcon key={index} className="size-3.5 fill-current" />
            ))}
          </span>
          <span>{product.rating.toFixed(1)}</span>
          <span className="font-medium text-navy/60">
            ({formatReviewCount(product.reviewCount)})
          </span>
        </div>

        <h3 className="text-[18px] leading-snug font-bold md:text-[19px]">
          <a href={product.href} className="hover:text-royal transition-colors">
            {product.name}
          </a>
        </h3>

        <div className="mt-3 flex flex-wrap gap-2 min-h-[30px] items-center" role="listbox" aria-label="Color">
          {product.colors.map((option, index) => (
            <button
              key={option.name}
              type="button"
              role="option"
              aria-selected={index === colorIndex}
              aria-label={option.name}
              onClick={() => setColorIndex(index)}
              className={`size-6 overflow-hidden rounded-full border-2 transition-transform hover:scale-110 ${
                index === colorIndex
                  ? "border-royal ring-2 ring-royal/30 ring-offset-1"
                  : "border-black/10"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={option.swatch} alt="" className="size-full object-cover" />
            </button>
          ))}
        </div>

        <div className="mt-auto flex items-end justify-between pt-5">
          <div className="flex items-baseline gap-2">
            <span className="text-[19px] font-bold text-royal">
              {formatUsd(product.price)}
            </span>
            {product.compareAtPrice > product.price ? (
              <span className="text-sm font-medium text-navy/40 line-through">
                {formatUsd(product.compareAtPrice)}
              </span>
            ) : null}
          </div>

          <a
            href={product.href}
            aria-label={`Quick add ${product.name} to cart`}
            className="inline-flex h-10 items-center justify-center rounded-full bg-royal px-6 text-sm font-bold text-white transition hover:bg-[#2827cd]"
          >
            Add
          </a>
        </div>
      </div>
    </article>
  );
}
