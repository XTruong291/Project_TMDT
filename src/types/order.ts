export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type OrderItemPayload = {
  productId?: string | null;
  productName: string;
  colorName: string;
  colorImage?: string | null;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
};

export type OrderItem = OrderItemPayload & {
  id: number;
  orderId: number;
};

export type OrderCreatePayload = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  shippingCity?: string;
  shippingDistrict?: string;
  paymentMethod?: string;
  notes?: string;
  items: OrderItemPayload[];
};

export type OrderCancelPayload = {
  guestEmail?: string;
  reason?: string;
};

export type Order = {
  id: number;
  orderNumber: string;
  userId?: number | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingDistrict: string;
  paymentMethod: string;
  shippingFee: number;
  subtotal: number;
  totalAmount: number;
  status: OrderStatus;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
};

