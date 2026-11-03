import type { Product, ProductColor } from "./product";

export type CartItem = {
  product: Product;
  selectedColor: ProductColor;
  quantity: number;
};

