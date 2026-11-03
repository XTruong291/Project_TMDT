"use client";

import Link from "next/link";
import { useState } from "react";

import { products } from "@/data/products";
import { cn } from "@/lib/utils";

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
    href: "https://rayconglobal.com/collections/special",
    accent: true,
  },
  {
    label: "Open Audio",
    href: "https://rayconglobal.com/collections/open-audio",
  },
  {
    label: "Earbuds",
    href: "https://rayconglobal.com/collections/earbuds",
  },
  {
    label: "Headphones",
    href: "https://rayconglobal.com/collections/headphones",
  },
  {
    label: "Fast Charge",
    href: "https://rayconglobal.com/collections/power-tech",
  },
];

const MOBILE_LINKS = [
  ...NAV,
  { label: "Our Story", href: "https://rayconglobal.com/pages/about" },
  { label: "FAQs", href: "https://rayconglobal.com/pages/faq" },
  { label: "Login", href: "https://rayconglobal.com/account/login" },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

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
            <a
              key={item.label}
              href={item.href}
              className={cn(
                "text-[15.4px] font-bold tracking-[-0.01em]",
                item.accent
                  ? "text-orange"
                  : "text-[#121619] hover:text-royal",
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1 lg:ml-0">
          <button
            type="button"
            className="flex size-10 items-center justify-center"
            aria-label="Search"
            onClick={() => setSearchOpen((open) => !open)}
          >
            <SearchIcon className="size-5" />
          </button>
          <button
            type="button"
            className="hidden h-10 items-center px-2 text-sm font-bold lg:flex"
            aria-label="USD $"
          >
            USD $
          </button>
          <a
            href="https://rayconglobal.com/cart"
            className="flex size-10 items-center justify-center"
            aria-label="Cart Cart items: 0"
          >
            <CartIcon className="h-[22px] w-[17px]" />
          </a>
        </div>
      </div>

      {searchOpen ? (
        <div className="border-t border-border bg-white">
          <div className="raycon-container py-5">
            <label className="mb-3 block text-sm font-bold" htmlFor="site-search">
              Search
            </label>
            <input
              id="site-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search"
              className="h-12 w-full rounded-none border-b border-navy bg-transparent text-lg outline-none"
            />
            <ul className="mt-4 grid gap-2">
              {results.map((product) => (
                <li key={product.id}>
                  <a href={product.href} className="text-sm font-medium hover:text-royal">
                    {product.name}
                  </a>
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
              <a
                key={item.label}
                href={item.href}
                className={cn(
                  "border-b border-border py-3 text-base font-bold",
                  item.label === "Deals" ? "text-orange" : "text-navy",
                )}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
