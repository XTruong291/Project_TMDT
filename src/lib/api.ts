import {
  products as fallbackProducts,
  getProductByHandle as fallbackGetProductByHandle,
  getProductsByCollection as fallbackGetProductsByCollection,
} from "@/data/products";
import type { AuthResponse, User } from "@/types/auth";
import type {
  Order,
  OrderCancelPayload,
  OrderCreatePayload,
  OrderStatus,
} from "@/types/order";
import type { Product } from "@/types/product";

export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

interface FetchProductFilters {
  category?: string;
  collection?: string;
  featured?: boolean;
  search?: string;
  sort?: "default" | "price_asc" | "price_desc" | "rating_desc" | "newest";
}

/**
 * Fetch all products from FastAPI with real-time MySQL synchronization ({ cache: 'no-store' }).
 * Falls back safely to mock data if the backend is unreachable.
 */
export async function getProducts(
  filters?: FetchProductFilters,
): Promise<Product[]> {
  try {
    const params = new URLSearchParams();
    if (filters?.category) params.append("category", filters.category);
    if (filters?.collection) params.append("collection", filters.collection);
    if (filters?.featured !== undefined)
      params.append("featured", String(filters.featured));
    if (filters?.search) params.append("search", filters.search);
    if (filters?.sort) params.append("sort", filters.sort);

    const queryString = params.toString() ? `?${params.toString()}` : "";
    const res = await fetch(`${API_BASE}/products${queryString}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch products: ${res.statusText}`);
    }

    const data: Product[] = await res.json();
    return data;
  } catch (error) {
    console.warn("FastAPI backend unreachable, using fallback products data:", error);
    let result = [...fallbackProducts];

    if (filters?.collection) {
      result = fallbackGetProductsByCollection(filters.collection);
    }
    if (filters?.featured !== undefined) {
      result = result.filter((p) => p.featured === filters.featured);
    }
    if (filters?.category) {
      result = result.filter((p) => p.category === filters.category);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      );
    }
    return result;
  }
}

/**
 * Fetch single product by handle/slug with fallback.
 */
export async function getProductByHandle(
  handle: string,
): Promise<Product | undefined> {
  try {
    const res = await fetch(`${API_BASE}/products/${handle}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      if (res.status === 404) return undefined;
      throw new Error(`Failed to fetch product ${handle}: ${res.statusText}`);
    }

    const data: Product = await res.json();
    return data;
  } catch (error) {
    console.warn(
      `FastAPI backend unreachable for handle '${handle}', using fallback:`,
      error,
    );
    return fallbackGetProductByHandle(handle);
  }
}

/**
 * Admin: Create product in MySQL
 */
export async function adminCreateProduct(
  productData: Partial<Product>,
  token: string,
): Promise<Product> {
  const res = await fetch(`${API_BASE}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to create product");
  }

  return res.json();
}

/**
 * Admin: Update product in MySQL
 */
export async function adminUpdateProduct(
  productId: string,
  productData: Partial<Product>,
  token: string,
): Promise<Product> {
  const res = await fetch(`${API_BASE}/products/${productId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to update product");
  }

  return res.json();
}

/**
 * Admin: Delete product from MySQL
 */
export async function adminDeleteProduct(
  productId: string,
  token: string,
): Promise<{ message: string; id: string }> {
  const res = await fetch(`${API_BASE}/products/${productId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to delete product");
  }

  return res.json();
}

/**
 * Auth: User/Admin login
 */
export async function loginUser(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Invalid email or password");
  }

  return res.json();
}

/**
 * Auth: User registration
 */
export async function registerUser(
  email: string,
  password: string,
  fullName: string,
  phone?: string,
): Promise<User> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, fullName, phone }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Registration failed");
  }

  return res.json();
}

/**
 * Auth: Fetch authenticated profile
 */
export async function getProfile(token: string): Promise<User> {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch user profile");
  }

  return res.json();
}

/**
 * Orders: Submit new customer order
 */
export async function createOrder(
  orderPayload: OrderCreatePayload,
  token?: string,
): Promise<Order> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}/orders`, {
    method: "POST",
    headers,
    body: JSON.stringify(orderPayload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to place order");
  }

  return res.json();
}

/**
 * Orders: Track order by order number
 */
export async function trackOrder(orderNumber: string): Promise<Order> {
  const res = await fetch(`${API_BASE}/orders/track/${orderNumber}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Không tìm thấy đơn hàng");
  }
  return res.json();
}

/**
 * Customer: Get current user's orders
 */
export async function getMyOrders(token: string): Promise<Order[]> {
  const res = await fetch(`${API_BASE}/orders/my-orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Không thể tải danh sách đơn hàng");
  }

  return res.json();
}

/**
 * Customer/Guest: Cancel an order by ID or Order Number
 */
export async function cancelOrder(
  orderIdentifier: string | number,
  payload?: OrderCancelPayload,
  token?: string,
): Promise<Order> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}/orders/${orderIdentifier}/cancel`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload || {}),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Không thể hủy đơn hàng");
  }

  return res.json();
}

/**
 * Admin: Get all orders
 */
export async function adminGetOrders(
  status?: OrderStatus,
  token?: string,
): Promise<Order[]> {
  const params = status ? `?status=${status}` : "";
  const res = await fetch(`${API_BASE}/orders${params}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch orders");
  }

  return res.json();
}

/**
 * Admin: Update order status
 */
export async function adminUpdateOrderStatus(
  orderId: number,
  newStatus: OrderStatus,
  token: string,
): Promise<Order> {
  const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status: newStatus }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to update order status");
  }

  return res.json();
}

/**
 * Admin: Delete order
 */
export async function adminDeleteOrder(
  orderId: number,
  token: string,
): Promise<{ message: string; id: number }> {
  const res = await fetch(`${API_BASE}/orders/${orderId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to delete order");
  }

  return res.json();
}
export async function adminGetUsers(
  filters?: { role?: string; isActive?: boolean; search?: string },
  token?: string,
): Promise<User[]> {
  const params = new URLSearchParams();
  if (filters?.role && filters.role !== "all") params.append("role", filters.role);
  if (filters?.isActive !== undefined) params.append("is_active", String(filters.isActive));
  if (filters?.search) params.append("search", filters.search);

  const query = params.toString() ? `?${params.toString()}` : "";
  const res = await fetch(`${API_BASE}/users${query}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to fetch users");
  }

  return res.json();
}

/**
 * Admin: Create user
 */
export async function adminCreateUser(
  userData: {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
    role?: string;
    isActive?: boolean;
  },
  token: string,
): Promise<User> {
  const res = await fetch(`${API_BASE}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to create user");
  }

  return res.json();
}

/**
 * Admin: Update user
 */
export async function adminUpdateUser(
  userId: number,
  userData: {
    email?: string;
    fullName?: string;
    phone?: string;
    role?: string;
    isActive?: boolean;
    password?: string;
  },
  token: string,
): Promise<User> {
  const res = await fetch(`${API_BASE}/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to update user");
  }

  return res.json();
}

/**
 * Admin: Toggle user active status
 */
export async function adminToggleUserStatus(
  userId: number,
  isActive: boolean,
  token: string,
): Promise<User> {
  const res = await fetch(`${API_BASE}/users/${userId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ isActive }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to change user status");
  }

  return res.json();
}

/**
 * Admin: Delete user
 */
export async function adminDeleteUser(
  userId: number,
  token: string,
): Promise<{ message: string; id: number }> {
  const res = await fetch(`${API_BASE}/users/${userId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to delete user");
  }

  return res.json();
}
