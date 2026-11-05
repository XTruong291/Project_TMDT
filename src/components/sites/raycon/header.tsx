"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Shield,
  User as UserIcon,
  LogOut,
  Settings,
  PackageCheck,
  Truck,
  Loader2,
} from "lucide-react";

import { products } from "@/data/products";
import { getProducts, getProfile } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/use-auth-store";
import { useCartStore } from "@/store/use-cart-store";
import type { Product } from "@/types/product";
import { AuthModal } from "./auth-modal";

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
  {
    label: "Giới thiệu",
    href: "/about",
  },
  {
    label: "Tin tức",
    href: "/news",
  },
  {
    label: "Liên hệ",
    href: "/contact",
  },
];

const MOBILE_LINKS = [
  ...NAV,
  { label: "FAQs", href: "/pages/faq" },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>(products.slice(0, 4));
  const [searching, setSearching] = useState(false);

  const openCart = useCartStore((state) => state.openCart);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const cartHydrated = useCartStore((state) => state.hasHydrated);

  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const authHydrated = useAuthStore((state) => state.hasHydrated);
  const logout = useAuthStore((state) => state.logout);
  const setAuth = useAuthStore((state) => state.setAuth);

  const displayCount = cartHydrated ? totalItems : 0;
  const currentUser = authHydrated ? user : null;
  const isAdmin = currentUser?.role === "admin";

  // Session verification: Verify token & sync latest profile/role from MySQL on mount
  useEffect(() => {
    if (authHydrated && token) {
      getProfile(token)
        .then((freshUser) => {
          setAuth(freshUser, token);
        })
        .catch(() => {
          logout();
        });
    }
  }, [authHydrated, token, setAuth, logout]);

  useEffect(() => {
    if (!query.trim()) {
      setSearchResults(products.slice(0, 4));
      setSearching(false);
      return;
    }

    setSearching(true);
    const timer = setTimeout(async () => {
      try {
        const data = await getProducts({ search: query.trim() });
        setSearchResults(data);
      } catch (err) {
        console.error("Search API failed:", err);
        setSearchResults(
          products.filter(
            (p) =>
              p.name.toLowerCase().includes(query.trim().toLowerCase()) ||
              (p.sku && p.sku.toLowerCase().includes(query.trim().toLowerCase())),
          ),
        );
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-transparent bg-white">
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
            {/* Search Trigger */}
            <button
              type="button"
              className="flex size-10 items-center justify-center text-navy transition-colors hover:text-royal"
              aria-label="Search"
              onClick={() => setSearchOpen((open) => !open)}
            >
              <SearchIcon className="size-5" />
            </button>

            {/* Account / Auth Button */}
            <div className="relative">
              {currentUser ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex size-10 items-center justify-center rounded-full text-navy hover:text-royal hover:bg-gray-100 transition-colors"
                    aria-label="User Account Menu"
                  >
                    {isAdmin ? (
                      <span className="flex size-7 items-center justify-center rounded-full bg-purple-100 text-purple-700">
                        <Shield className="size-4" />
                      </span>
                    ) : (
                      <span className="flex size-7 items-center justify-center rounded-full bg-blue-100 text-royal">
                        <UserIcon className="size-4" />
                      </span>
                    )}
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-gray-100 bg-white p-2 shadow-xl z-50 animate-in fade-in zoom-in-95">
                      <div className="border-b border-gray-100 px-3 py-2">
                        <p className="text-xs font-bold text-navy truncate">
                          {currentUser.fullName}
                        </p>
                        <p className="text-[11px] text-gray-500 truncate">
                          {currentUser.email}
                        </p>
                        {isAdmin && (
                          <span className="mt-1 inline-flex items-center gap-1 rounded bg-purple-100 px-1.5 py-0.5 text-[10px] font-bold text-purple-700">
                            <Shield className="size-3" />
                            Admin Store
                          </span>
                        )}
                      </div>

                      <div className="py-1">
                        <Link
                          href="/orders"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold text-navy hover:bg-gray-50 transition-colors"
                        >
                          <PackageCheck className="size-4 text-royal" />
                          <span>Đơn hàng của tôi</span>
                        </Link>
                        {isAdmin && (
                          <Link
                            href="/admin/products"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold text-purple-700 hover:bg-purple-50 transition-colors"
                          >
                            <Settings className="size-4" />
                            <span>Trang Quản trị (Admin)</span>
                          </Link>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            logout();
                            setUserDropdownOpen(false);
                          }}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="size-4" />
                          <span>Đăng xuất</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setAuthModalOpen(true)}
                  className="flex size-10 items-center justify-center text-navy transition-colors hover:text-royal"
                  aria-label="Login or Register"
                >
                  <UserIcon className="size-5" />
                </button>
              )}
            </div>

            {/* Order Tracking Quick Link */}
            <Link
              href="/orders"
              className="flex size-10 items-center justify-center text-navy transition-colors hover:text-royal"
              aria-label="Theo dõi đơn hàng"
              title="Theo dõi đơn hàng"
            >
              <Truck className="size-5" />
            </Link>

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
          <div className="border-t border-border bg-white shadow-md animate-in fade-in duration-150">
            <div className="raycon-container py-5">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-bold text-navy" htmlFor="site-search">
                  Tìm Kiếm Sản Phẩm
                </label>
                {searching && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-royal font-semibold">
                    <Loader2 className="size-3.5 animate-spin" /> Đang tìm kiếm...
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  id="site-search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Nhập tên sản phẩm hoặc mã SKU (vd: Everyday, Bone, RAY-E25)..."
                  className="h-12 w-full rounded-none border-b border-navy bg-transparent text-base md:text-lg outline-none pr-8"
                  autoFocus
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-navy/40 hover:text-navy text-xs font-bold"
                  >
                    Xóa
                  </button>
                )}
              </div>

              <div className="mt-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-navy/50 mb-2">
                  {query.trim()
                    ? `Kết quả tìm kiếm (${searchResults.length})`
                    : "Sản phẩm gợi ý"}
                </p>

                {searchResults.length === 0 && !searching ? (
                  <div className="py-6 text-center text-xs text-navy/60">
                    Không tìm thấy sản phẩm nào khớp với &quot;<strong>{query}</strong>&quot;.
                  </div>
                ) : (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {searchResults.map((product) => (
                      <Link
                        key={product.id}
                        href={product.href}
                        onClick={() => setSearchOpen(false)}
                        className="flex items-center justify-between gap-3 rounded-xl border border-navy/5 p-2.5 hover:bg-navy/5 hover:border-navy/15 transition-all group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="size-10 rounded-lg bg-[#e8f7ff] p-1 shrink-0 overflow-hidden border border-navy/5">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={product.image}
                              alt=""
                              className="size-full object-contain"
                            />
                          </div>
                          <div className="min-w-0">
                            <span className="block text-xs font-bold text-navy truncate group-hover:text-royal transition-colors">
                              {product.name}
                            </span>
                            <div className="flex items-center gap-2 mt-0.5">
                              {product.sku && (
                                <span className="text-[10px] text-navy/40 font-mono">
                                  {product.sku}
                                </span>
                              )}
                              {product.badge && (
                                <span className="text-[9px] font-bold text-[#f05c56] bg-red-50 px-1.5 py-0.2 rounded">
                                  {product.badge}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-royal shrink-0">
                          ${product.price.toFixed(2)}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
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
              <Link
                href="/orders"
                onClick={() => setMenuOpen(false)}
                className="border-b border-border py-3 text-base font-bold text-navy flex items-center gap-2"
              >
                <Truck className="size-5 text-royal" />
                <span>Theo dõi đơn hàng</span>
              </Link>
              {currentUser ? (
                <div className="border-b border-border py-3">
                  <div className="text-sm font-bold text-navy">{currentUser.fullName}</div>
                  <Link
                    href="/orders"
                    onClick={() => setMenuOpen(false)}
                    className="mt-2 block text-sm font-bold text-royal"
                  >
                    📦 Đơn hàng của tôi
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin/products"
                      onClick={() => setMenuOpen(false)}
                      className="mt-2 block text-sm font-bold text-purple-700"
                    >
                      ⚙️ Trang Quản trị (Admin)
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    className="mt-2 block text-sm font-semibold text-red-600"
                  >
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    setAuthModalOpen(true);
                  }}
                  className="py-3 text-left text-base font-bold text-royal"
                >
                  Đăng nhập / Đăng ký
                </button>
              )}
            </nav>
          </div>
        ) : null}
      </header>

      {/* Global Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
}
