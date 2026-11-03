"use client";

import Link from "next/link";
import { useState } from "react";

import { products } from "@/data/products";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/use-cart-store";

import {
  CartIcon,
  CloseIcon,
  MenuIcon,
  RayconLogo,
  SearchIcon,
} from "./icons";

const NAV = [
  {
    label: "Deals",
    href: "/collections/special",
    accent: true,
  },
  {
    label: "Open Audio",
    href: "/collections/open-audio",
  },
  {
    label: "Earbuds",
    href: "/collections/earbuds",
  },
  {
    label: "Headphones",
    href: "/collections/headphones",
  },
  {
    label: "Fast Charge",
    href: "/collections/power-tech",
  },
];

const MOBILE_LINKS = [
  ...NAV,
  { label: "Our Story", href: "/pages/about" },
  { label: "FAQs", href: "/pages/faq" },
  { label: "Login", href: "/account/login" },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const openCart = useCartStore((state) => state.openCart);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const hasHydrated = useCartStore((state) => state.hasHydrated);

  const displayCount = hasHydrated ? totalItems : 0;

  const results = query.trim()
    ? products.filter((product) =>
        product.name.toLowerCase().includes(query.trim().toLowerCase()),
      )
    : products.slice(0, 4);

  return (
    <header className="sticky top-0 z-50 border-b border-transparent bg-white">
      <div className="raycon-container flex h-[66px] items-center gap-4">
        <button
          type="button"
          className="flex size-10 items-center justify-center lg:hidden"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? (
            <CloseIcon className="size-6" />
          ) : (
            <MenuIcon className="size-6" />
          )}
        </button>

        <Link
          href="/"
          aria-label="Raycon Home"
          className="mx-auto shrink-0 text-navy lg:mx-0"
        >
          <RayconLogo className="h-[22px] w-[104px]" />
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-8 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "text-[15.4px] font-bold tracking-[-0.01em] transition-colors",
                item.accent
                  ? "text-orange hover:opacity-85"
                  : "text-[#121619] hover:text-royal",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1 lg:ml-0">
          <button
            type="button"
            className="flex size-10 items-center justify-center text-navy transition-colors hover:text-royal"
            aria-label="Search"
            onClick={() => setSearchOpen((open) => !open)}
          >
            <SearchIcon className="size-5" />
          </button>

          <button
            type="button"
            className="hidden h-10 items-center px-2 text-sm font-bold text-navy lg:flex"
            aria-label="Currency USD $"
          >
            USD $
          </button>

          {/* Cart Drawer Trigger Button */}
          <button
            type="button"
            onClick={openCart}
            className="relative flex size-10 items-center justify-center text-navy transition-colors hover:text-royal cursor-pointer"
            aria-label={`Open shopping cart (${displayCount} items)`}
          >
            <CartIcon className="h-[22px] w-[17px]" />
            {displayCount > 0 ? (
              <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-royal text-[10px] font-bold text-white animate-in zoom-in-50">
                {displayCount}
              </span>
            ) : null}
          </button>
        </div>
      </div>

      {searchOpen ? (
        <div className="border-t border-border bg-white shadow-md">
          <div className="raycon-container py-5">
            <label className="mb-3 block text-sm font-bold text-navy" htmlFor="site-search">
              Search Products
            </label>
            <input
              id="site-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by product name..."
              className="h-12 w-full rounded-none border-b border-navy bg-transparent text-lg outline-none"
              autoFocus
            />
            <ul className="mt-4 grid gap-2">
              {results.map((product) => (
                <li key={product.id}>
                  <Link
                    href={product.href}
                    onClick={() => setSearchOpen(false)}
                    className="flex items-center justify-between text-sm font-medium hover:text-royal py-1.5"
                  >
                    <span>{product.name}</span>
                    <span className="text-navy/60 font-semibold">{product.price.toFixed(2)}$</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}

      {menuOpen ? (
        <div className="border-t border-border bg-white lg:hidden">
          <nav className="flex flex-col px-4 py-3">
            {MOBILE_LINKS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "border-b border-border py-3 text-base font-bold",
                  item.label === "Deals" ? "text-orange" : "text-navy",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
