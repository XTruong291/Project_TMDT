"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { ArrowRight, Minus, Plus, ShoppingBag, Tag, Trash2, Truck, X } from "lucide-react";

import { formatUsd } from "@/data/products";
import { verifyCoupon } from "@/lib/api";
import { useCartStore } from "@/store/use-cart-store";

const FREE_SHIPPING_THRESHOLD = 50;
const emptySubscribe = () => () => {};

export function CartDrawer() {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const items = useCartStore((state) => state.items);
  const isOpen = useCartStore((state) => state.isOpen);
  const closeCart = useCartStore((state) => state.closeCart);
  const toggleCart = useCartStore((state) => state.toggleCart);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const appliedCoupon = useCartStore((state) => state.appliedCoupon);
  const couponMessage = useCartStore((state) => state.couponMessage);
  const applyCoupon = useCartStore((state) => state.applyCoupon);
  const removeCoupon = useCartStore((state) => state.removeCoupon);
  const getDiscountAmount = useCartStore((state) => state.getDiscountAmount);

  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    function handleToggleEvent() {
      toggleCart();
    }

    function handleAddToCartEvent(e: Event) {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.product && customEvent.detail?.selectedColor) {
        addItem(customEvent.detail.product, customEvent.detail.selectedColor, 1);
      }
    }

    window.addEventListener("toggle-cart-drawer", handleToggleEvent);
    window.addEventListener("add-to-cart", handleAddToCartEvent);

    return () => {
      window.removeEventListener("toggle-cart-drawer", handleToggleEvent);
      window.removeEventListener("add-to-cart", handleAddToCartEvent);
    };
  }, [toggleCart, addItem]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        closeCart();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeCart]);

  if (!isClient) return null;

  const subtotal = getSubtotal();
  const discountAmount = getDiscountAmount();
  const finalTotal = Math.max(0, subtotal - discountAmount);
  const totalItems = getTotalItems();
  const freeShippingProgress = Math.min(
    100,
    (subtotal / FREE_SHIPPING_THRESHOLD) * 100,
  );
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  async function handleApplyCoupon(e: React.FormEvent) {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setIsVerifying(true);
    setCouponError("");

    try {
      const res = await verifyCoupon(couponInput.trim(), subtotal);
      applyCoupon({
        code: res.code,
        discountType: res.discountType,
        discountValue: res.discountValue,
        minOrderAmount: res.minOrderAmount,
        description: res.description,
      });
      setCouponInput("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Mã không hợp lệ";
      setCouponError(msg);
    } finally {
      setIsVerifying(false);
    }
  }

  return (
    <div
      className={`fixed inset-0 z-50 transition-visibility duration-300 ${
        isOpen ? "visible" : "invisible pointer-events-none"
      }`}
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <aside
        className={`fixed inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ease-out sm:max-w-lg ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex h-16 items-center justify-between border-b border-navy/10 px-6">
          <div className="flex items-center gap-2">
            <ShoppingBag className="size-5 text-royal" />
            <h2 className="text-lg font-bold text-navy">
              Your Cart
              <span className="ml-1 text-sm font-medium text-navy/60">
                ({totalItems})
              </span>
            </h2>
          </div>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart drawer"
            className="flex size-9 items-center justify-center rounded-full text-navy/70 transition hover:bg-navy/5 hover:text-navy"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Free Shipping Meter */}
        <div className="border-b border-navy/10 bg-[#f8fbfe] px-6 py-3.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-navy">
            <Truck className="size-4 text-royal shrink-0" />
            {amountToFreeShipping === 0 ? (
              <span className="text-emerald-700">
                🎉 Congratulations! You unlocked <strong>FREE Standard Shipping</strong>!
              </span>
            ) : (
              <span>
                Add <strong>{formatUsd(amountToFreeShipping)}</strong> more to get{" "}
                <strong className="text-royal">FREE Shipping</strong>!
              </span>
            )}
          </div>
          <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-navy/10">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                amountToFreeShipping === 0 ? "bg-emerald-500" : "bg-royal"
              }`}
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Drawer Content */}
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <div className="flex size-20 items-center justify-center rounded-full bg-[#e8f7ff] text-royal mb-4">
              <ShoppingBag className="size-10" />
            </div>
            <h3 className="text-xl font-bold text-navy">Your cart is empty</h3>
            <p className="mt-2 max-w-xs text-sm text-navy/60">
              Looks like you haven&apos;t added any Raycon audio gear to your cart yet.
            </p>
            <Link
              href="/collections/all"
              onClick={closeCart}
              className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-royal px-8 text-sm font-bold text-white transition hover:bg-[#2827cd]"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-navy/10">
            {items.map((item) => (
              <div
                key={`${item.product.id}-${item.selectedColor.name}`}
                className="flex gap-4 py-4 first:pt-0 last:pb-0"
              >
                {/* Product Image */}
                <div className="size-20 shrink-0 overflow-hidden rounded-xl bg-[#e8f7ff] p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.selectedColor.image || item.product.image}
                    alt={item.product.name}
                    className="size-full object-contain"
                  />
                </div>

                {/* Details */}
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <Link
                        href={item.product.href}
                        onClick={closeCart}
                        className="text-sm font-bold text-navy hover:text-royal transition-colors line-clamp-1"
                      >
                        {item.product.name}
                      </Link>
                      <div className="mt-1 flex items-center gap-1.5 text-xs text-navy/70">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.selectedColor.swatch}
                          alt=""
                          className="size-3.5 rounded-full border border-black/10 object-cover"
                        />
                        <span>{item.selectedColor.name}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        removeItem(item.product.id, item.selectedColor.name)
                      }
                      aria-label={`Remove ${item.product.name}`}
                      className="text-navy/40 hover:text-[#f05c56] transition-colors p-1"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>

                  {/* Quantity & Price */}
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center rounded-full border border-navy/15 bg-white">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.product.id, item.selectedColor.name, -1)
                        }
                        aria-label="Decrease quantity"
                        className="flex size-7 items-center justify-center text-navy/70 hover:text-navy"
                      >
                        <Minus className="size-3.5" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-navy">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.product.id, item.selectedColor.name, 1)
                        }
                        aria-label="Increase quantity"
                        className="flex size-7 items-center justify-center text-navy/70 hover:text-navy"
                      >
                        <Plus className="size-3.5" />
                      </button>
                    </div>

                    <span className="text-sm font-bold text-royal">
                      {formatUsd(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Drawer Footer */}
        {items.length > 0 ? (
          <div className="border-t border-navy/10 bg-white p-6 shadow-inner">
            {/* Coupon Code Section */}
            <div className="mb-4 pb-4 border-b border-gray-100">
              {appliedCoupon ? (
                <div className="flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-200 px-3.5 py-2.5">
                  <div className="flex items-center gap-2">
                    <Tag className="size-4 text-emerald-600" />
                    <div>
                      <p className="text-xs font-bold text-emerald-800">
                        {appliedCoupon.code}
                      </p>
                      <p className="text-[10px] text-emerald-600">
                        {appliedCoupon.description || "Đã áp dụng mã"}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    aria-label="Remove coupon"
                    className="text-xs font-semibold text-emerald-700 hover:text-red-600 transition-colors p-1"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value);
                        setCouponError("");
                      }}
                      placeholder="Mã giảm giá (ví dụ: RAYCON10)"
                      className="h-9 flex-1 rounded-xl border border-navy/15 px-3 text-xs uppercase outline-none focus:border-royal"
                    />
                    <button
                      type="submit"
                      disabled={isVerifying || !couponInput.trim()}
                      className="h-9 rounded-xl bg-navy px-4 text-xs font-bold text-white transition hover:bg-royal disabled:opacity-50 cursor-pointer"
                    >
                      {isVerifying ? "..." : "Áp dụng"}
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-[11px] text-red-500 font-medium">
                      {couponError}
                    </p>
                  )}
                  {couponMessage && (
                    <p className="text-[11px] text-amber-600 font-medium">
                      {couponMessage}
                    </p>
                  )}
                </form>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-navy/70">
                <span>Tạm tính</span>
                <span className="font-semibold text-navy">{formatUsd(subtotal)}</span>
              </div>
              {appliedCoupon && discountAmount > 0 && (
                <div className="flex items-center justify-between text-sm text-emerald-700 font-medium">
                  <span>Giảm giá ({appliedCoupon.code})</span>
                  <span>-{formatUsd(discountAmount)}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-base font-bold text-navy pt-1 border-t border-gray-100">
                <span>Tổng cộng</span>
                <span className="text-royal font-bold text-lg">{formatUsd(finalTotal)}</span>
              </div>
              <p className="text-[11px] text-navy/50">
                Thuế và phí giao hàng sẽ được tính khi thanh toán.
              </p>
            </div>

            <div className="mt-5 grid gap-2.5">
              <Link
                href="/checkout"
                onClick={closeCart}
                className="group flex h-13 w-full items-center justify-center gap-2 rounded-full bg-royal px-8 text-sm font-bold text-white transition hover:bg-[#2827cd]"
              >
                <span>Tiến hành Thanh toán</span>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <button
                type="button"
                onClick={closeCart}
                className="h-10 text-xs font-semibold text-navy/70 hover:text-navy cursor-pointer"
              >
                Tiếp tục mua sắm
              </button>
            </div>
          </div>
        ) : null}
      </aside>
    </div>
  );
}
