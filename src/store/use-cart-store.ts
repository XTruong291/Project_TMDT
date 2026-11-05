import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { formatVnd } from "@/data/products";
import type { CartItem } from "@/types/cart";
import type { AppliedCoupon } from "@/types/coupon";
import type { Product, ProductColor } from "@/types/product";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  hasHydrated: boolean;
  appliedCoupon: AppliedCoupon | null;
  couponMessage: string | null;
  setHasHydrated: (status: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (product: Product, selectedColor: ProductColor, quantity?: number) => void;
  removeItem: (productId: string, colorName: string) => void;
  updateQuantity: (productId: string, colorName: string, delta: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
  getDiscountAmount: () => number;
  applyCoupon: (coupon: AppliedCoupon) => void;
  removeCoupon: () => void;
}

function checkCouponValidity(
  items: CartItem[],
  coupon: AppliedCoupon | null,
): { validCoupon: AppliedCoupon | null; message: string | null } {
  if (!coupon) return { validCoupon: null, message: null };
  const subtotal = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0,
  );
  if (subtotal < coupon.minOrderAmount) {
    return {
      validCoupon: null,
      message: `Mã ${coupon.code} đã tự động gỡ do đơn hàng chưa đạt mức tối thiểu ${formatVnd(coupon.minOrderAmount)}.`,
    };
  }
  return { validCoupon: coupon, message: null };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      hasHydrated: false,
      appliedCoupon: null,
      couponMessage: null,

      setHasHydrated: (status: boolean) => set({ hasHydrated: status }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: (product, selectedColor, quantity = 1) => {
        // Enforce in_stock check: do not add out-of-stock items
        if (product.inStock === false) {
          return;
        }

        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) =>
              item.product.id === product.id &&
              item.selectedColor.name === selectedColor.name,
          );

          let nextItems: CartItem[];
          if (existingIndex > -1) {
            nextItems = [...state.items];
            const existing = nextItems[existingIndex];
            if (existing) {
              nextItems[existingIndex] = {
                ...existing,
                quantity: Math.min(10, existing.quantity + quantity),
              };
            }
          } else {
            nextItems = [
              ...state.items,
              { product, selectedColor, quantity: Math.min(10, Math.max(1, quantity)) },
            ];
          }

          const { validCoupon, message } = checkCouponValidity(
            nextItems,
            state.appliedCoupon,
          );

          return {
            items: nextItems,
            appliedCoupon: validCoupon,
            couponMessage: message,
            isOpen: true,
          };
        });
      },

      removeItem: (productId, colorName) => {
        set((state) => {
          const nextItems = state.items.filter(
            (item) =>
              !(
                item.product.id === productId &&
                item.selectedColor.name === colorName
              ),
          );

          const { validCoupon, message } = checkCouponValidity(
            nextItems,
            state.appliedCoupon,
          );

          return {
            items: nextItems,
            appliedCoupon: validCoupon,
            couponMessage: message,
          };
        });
      },

      updateQuantity: (productId, colorName, delta) => {
        set((state) => {
          const nextItems = state.items
            .map((item) => {
              if (
                item.product.id === productId &&
                item.selectedColor.name === colorName
              ) {
                const newQty = item.quantity + delta;
                if (newQty <= 0) return null;
                return { ...item, quantity: Math.min(10, newQty) };
              }
              return item;
            })
            .filter((item): item is CartItem => item !== null);

          const { validCoupon, message } = checkCouponValidity(
            nextItems,
            state.appliedCoupon,
          );

          return {
            items: nextItems,
            appliedCoupon: validCoupon,
            couponMessage: message,
          };
        });
      },

      clearCart: () => set({ items: [], appliedCoupon: null, couponMessage: null }),

      getTotalItems: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (acc, item) => acc + item.product.price * item.quantity,
          0,
        );
      },

      getDiscountAmount: () => {
        const subtotal = get().getSubtotal();
        const coupon = get().appliedCoupon;
        if (!coupon || subtotal < coupon.minOrderAmount) return 0;

        if (coupon.discountType === "percent") {
          return Math.round((subtotal * coupon.discountValue) / 100);
        }
        return Math.min(Math.round(coupon.discountValue), subtotal);
      },

      applyCoupon: (coupon) =>
        set({
          appliedCoupon: coupon,
          couponMessage: null,
        }),

      removeCoupon: () =>
        set({
          appliedCoupon: null,
          couponMessage: null,
        }),
    }),
    {
      name: "raycon-cart-storage",
      version: 2,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        appliedCoupon: state.appliedCoupon,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // If cached items have old USD prices (< 1000), clear cart to avoid displaying "64 ₫"
          const hasStaleUsdPrices = state.items.some(
            (item) => item.product.price < 1000,
          );
          if (hasStaleUsdPrices) {
            state.items = [];
            state.appliedCoupon = null;
            state.couponMessage = null;
          }
          state.setHasHydrated(true);
        }
      },
    },
  ),
);
