import {
  products as fallbackProducts,
  getProductByHandle as fallbackGetProductByHandle,
  getProductsByCollection as fallbackGetProductsByCollection,
} from "@/data/products";
import type {
  AboutSection,
  AboutSectionCreatePayload,
  AboutSectionUpdatePayload,
} from "@/types/about";
import type {
  Article,
  ArticleCreatePayload,
  ArticleUpdatePayload,
} from "@/types/article";
import type { SiteAnalytics } from "@/types/analytics";
import type { AuthResponse, User } from "@/types/auth";
import type { Contact, ContactCreatePayload } from "@/types/contact";
import type { CouponVerifyResponse } from "@/types/coupon";
import type {
  Order,
  OrderCancelPayload,
  OrderCreatePayload,
  OrderStatus,
} from "@/types/order";
import type { Product } from "@/types/product";
import type { ProductReview, ReviewCreatePayload } from "@/types/review";

export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

interface FetchProductFilters {
  category?: string;
  subCategory?: string;
  collection?: string;
  featured?: boolean;
  search?: string;
  includeInactive?: boolean;
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
    if (filters?.subCategory) params.append("sub_category", filters.subCategory);
    if (filters?.collection) params.append("collection", filters.collection);
    if (filters?.featured !== undefined)
      params.append("featured", String(filters.featured));
    if (filters?.search) params.append("search", filters.search);
    if (filters?.includeInactive !== undefined)
      params.append("include_inactive", String(filters.includeInactive));
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
 * Reviews: Get reviews for a product
 */
export async function getProductReviews(
  handle: string,
): Promise<ProductReview[]> {
  try {
    const res = await fetch(`${API_BASE}/products/${handle}/reviews`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

/**
 * Reviews: Submit customer review (Authenticated customers only)
 */
export async function submitProductReview(
  handle: string,
  payload: ReviewCreatePayload,
  token: string,
): Promise<ProductReview> {
  const res = await fetch(`${API_BASE}/products/${handle}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Không thể gửi đánh giá. Vui lòng đăng nhập.");
  }

  return res.json();
}

/**
 * Coupons: Verify discount code with current cart subtotal
 */
export async function verifyCoupon(
  code: string,
  subtotal: number,
): Promise<CouponVerifyResponse> {
  const res = await fetch(`${API_BASE}/coupons/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code, subtotal }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Mã giảm giá không hợp lệ");
  }

  return res.json();
}

/**
 * Auth: User/Admin login (Strict MySQL validation, no fallback)
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
    body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Email hoặc mật khẩu không chính xác.");
  }

  return res.json();
}

/**
 * Auth: User registration (Strict MySQL registration, no mock)
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
    body: JSON.stringify({
      email: email.trim().toLowerCase(),
      password,
      fullName: fullName.trim(),
      phone: phone ? phone.trim() : undefined,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Đăng ký tài khoản không thành công.");
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
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Phiên đăng nhập đã hết hạn hoặc không hợp lệ.");
  }

  return res.json();
}

/**
 * Orders: Submit new customer order (Authenticated customers only)
 */
export async function createOrder(
  orderPayload: OrderCreatePayload,
  token: string,
): Promise<Order> {
  const res = await fetch(`${API_BASE}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderPayload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Không thể tạo đơn hàng. Vui lòng kiểm tra lại giỏ hàng.");
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
 * Orders: Get order by numeric ID (Authenticated user or Admin only)
 */
export async function getOrderById(orderId: number, token: string): Promise<Order> {
  const res = await fetch(`${API_BASE}/orders/${orderId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Không tìm thấy hoặc không có quyền truy cập đơn hàng.");
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

/**
 * About Sections: Get all sections (Storefront or Admin)
 */
export async function getAboutSections(options?: {
  includeHidden?: boolean;
  category?: string;
}): Promise<AboutSection[]> {
  try {
    const params = new URLSearchParams();
    if (options?.includeHidden) params.append("include_hidden", "true");
    if (options?.category) params.append("category", options.category);

    const queryString = params.toString() ? `?${params.toString()}` : "";
    const res = await fetch(`${API_BASE}/about-sections${queryString}`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

/**
 * About Sections: Admin create
 */
export async function adminCreateAboutSection(
  payload: AboutSectionCreatePayload,
  token: string,
): Promise<AboutSection> {
  const res = await fetch(`${API_BASE}/admin/about-sections`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Không thể tạo mục giới thiệu mới");
  }

  return res.json();
}

/**
 * About Sections: Admin update
 */
export async function adminUpdateAboutSection(
  id: number,
  payload: AboutSectionUpdatePayload,
  token: string,
): Promise<AboutSection> {
  const res = await fetch(`${API_BASE}/admin/about-sections/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Không thể cập nhật mục giới thiệu");
  }

  return res.json();
}

/**
 * About Sections: Admin delete
 */
export async function adminDeleteAboutSection(
  id: number,
  token: string,
): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE}/admin/about-sections/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Không thể xóa mục giới thiệu");
  }

  return res.json();
}

/**
 * Articles: Get list of articles
 */
export async function getArticles(options?: {
  category?: string;
  search?: string;
  includeUnpublished?: boolean;
  limit?: number;
  offset?: number;
}): Promise<Article[]> {
  try {
    const params = new URLSearchParams();
    if (options?.category) params.append("category", options.category);
    if (options?.search) params.append("search", options.search);
    if (options?.includeUnpublished) params.append("include_unpublished", "true");
    if (options?.limit) params.append("limit", options.limit.toString());
    if (options?.offset) params.append("offset", options.offset.toString());

    const queryString = params.toString() ? `?${params.toString()}` : "";
    const res = await fetch(`${API_BASE}/articles${queryString}`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

/**
 * Articles: Get article detail by slug or ID
 */
export async function getArticleDetail(slugOrId: string): Promise<Article> {
  const res = await fetch(`${API_BASE}/articles/${slugOrId}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Không tìm thấy bài viết");
  }

  return res.json();
}

/**
 * Articles: Create article (User or Admin)
 */
export async function createArticle(
  payload: ArticleCreatePayload,
  token: string,
): Promise<Article> {
  const res = await fetch(`${API_BASE}/articles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Không thể tạo bài viết");
  }

  return res.json();
}

/**
 * Articles: Update article (Author or Admin)
 */
export async function updateArticle(
  id: number,
  payload: ArticleUpdatePayload,
  token: string,
): Promise<Article> {
  const res = await fetch(`${API_BASE}/articles/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Không thể cập nhật bài viết");
  }

  return res.json();
}

/**
 * Articles: Delete article (Author or Admin)
 */
export async function deleteArticle(
  id: number,
  token: string,
): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE}/articles/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Không thể xóa bài viết");
  }

  return res.json();
}

/**
 * Contacts: Submit contact form (Storefront)
 */
export async function submitContactForm(
  payload: ContactCreatePayload,
): Promise<Contact> {
  const res = await fetch(`${API_BASE}/contacts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Không thể gửi thư liên hệ");
  }

  return res.json();
}

/**
 * Contacts: Admin get contacts list
 */
export async function adminGetContacts(
  token: string,
  status?: string,
): Promise<Contact[]> {
  try {
    const url = status && status !== "all"
      ? `${API_BASE}/admin/contacts?status=${encodeURIComponent(status)}`
      : `${API_BASE}/admin/contacts`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

/**
 * Contacts: Admin update contact status
 */
export async function adminUpdateContactStatus(
  id: number,
  status: string,
  token: string,
): Promise<Contact> {
  const res = await fetch(`${API_BASE}/admin/contacts/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Không thể cập nhật trạng thái");
  }

  return res.json();
}

/**
 * Contacts: Admin delete contact
 */
export async function adminDeleteContact(
  id: number,
  token: string,
): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE}/admin/contacts/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Không thể xóa thư liên hệ");
  }

  return res.json();
}

/**
 * Analytics: Get live site analytics
 */
export async function getSiteAnalytics(): Promise<SiteAnalytics> {
  try {
    const res = await fetch(`${API_BASE}/analytics/stats`, {
      cache: "no-store",
    });
    if (!res.ok) {
      return {
        onlineVisitors: 18,
        totalVisits: 154820,
        totalOrders: 0,
        totalProducts: 7,
        totalUsers: 2,
        totalRevenue: 0,
      };
    }
    return res.json();
  } catch {
    return {
      onlineVisitors: 18,
      totalVisits: 154820,
      totalOrders: 0,
      totalProducts: 7,
      totalUsers: 2,
      totalRevenue: 0,
    };
  }
}
