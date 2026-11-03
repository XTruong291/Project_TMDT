import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { CartItem } from "@/types/cart";
import type { Product, ProductColor } from "@/types/product";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  hasHydrated: boolean;
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
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      hasHydrated: false,

      setHasHydrated: (status: boolean) => set({ hasHydrated: status }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: (product, selectedColor, quantity = 1) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) =>
              item.product.id === product.id &&
              item.selectedColor.name === selectedColor.name,
          );

          if (existingIndex > -1) {
            const nextItems = [...state.items];
            const existing = nextItems[existingIndex];
            if (existing) {
              nextItems[existingIndex] = {
                ...existing,
                quantity: existing.quantity + quantity,
              };
            }
            return { items: nextItems, isOpen: true };
          }

          return {
            items: [...state.items, { product, selectedColor, quantity }],
            isOpen: true,
          };
        });
      },

      removeItem: (productId, colorName) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(
                item.product.id === productId &&
                item.selectedColor.name === colorName
              ),
          ),
        }));
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
                return newQty > 0 ? { ...item, quantity: newQty } : null;
              }
              return item;
            })
            .filter((item): item is CartItem => item !== null);

          return { items: nextItems };
        });
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (acc, item) => acc + item.product.price * item.quantity,
          0,
        );
      },
    }),
    {
      name: "raycon-cart-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

