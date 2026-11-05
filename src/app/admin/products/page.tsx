"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  X,
  Star,
  Package,
  Loader2,
  AlertCircle,
  Tag,
  Palette,
  Sliders,
} from "lucide-react";
import {
  getProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
} from "@/lib/api";
import { formatUsd } from "@/data/products";
import { useAuthStore } from "@/store/use-auth-store";
import type { Product, ProductColor, ProductSpec } from "@/types/product";

const DEFAULT_IMAGE = "/sites/raycon/images/E25_BLA_IMG1.png";
const DEFAULT_SWATCH = "/sites/raycon/images/swatch-black_200x.png";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function AdminProductsPage() {
  const token = useAuthStore((state) => state.token);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Delete Confirm State
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Form Fields State
  const [formData, setFormData] = useState<{
    id: string;
    handle: string;
    sku: string;
    name: string;
    tagline: string;
    category: string;
    subCategory: string;
    collectionSlug: string;
    image: string;
    price: number;
    compareAtPrice: number | null;
    badge: string;
    inStock: boolean;
    isActive: boolean;
    featured: boolean;
    description: string;
    colors: ProductColor[];
    specs: ProductSpec[];
  }>({
    id: "",
    handle: "",
    sku: "",
    name: "",
    tagline: "",
    category: "earbuds",
    subCategory: "",
    collectionSlug: "earbuds",
    image: DEFAULT_IMAGE,
    price: 69.99,
    compareAtPrice: 89.99,
    badge: "",
    inStock: true,
    isActive: true,
    featured: false,
    description: "",
    colors: [
      {
        name: "Carbon Black",
        swatch: DEFAULT_SWATCH,
        image: DEFAULT_IMAGE,
      },
    ],
    specs: [
      { label: "Battery Life", value: "32 hours total with case" },
      { label: "Bluetooth", value: "Version 5.2" },
    ],
  });

  async function loadProducts() {
    setLoading(true);
    try {
      const data = await getProducts({ includeInactive: true });
      setProducts(data);
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.handle.toLowerCase().includes(search.toLowerCase()) ||
        p.id.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, categoryFilter]);

  function handleOpenCreate() {
    setEditingProduct(null);
    setFormData({
      id: "",
      handle: "",
      sku: "",
      name: "",
      tagline: "",
      category: "earbuds",
      subCategory: "",
      collectionSlug: "earbuds",
      image: DEFAULT_IMAGE,
      price: 69.99,
      compareAtPrice: 89.99,
      badge: "20% OFF",
      inStock: true,
      isActive: true,
      featured: false,
      description: "Sản phẩm âm thanh cao cấp với công nghệ tiên tiến nhất từ RYVO.",
      colors: [
        {
          name: "Carbon Black",
          swatch: DEFAULT_SWATCH,
          image: DEFAULT_IMAGE,
        },
      ],
      specs: [
        { label: "Battery Life", value: "32 hours total with case" },
        { label: "Bluetooth", value: "Version 5.2" },
      ],
    });
    setFormError(null);
    setIsModalOpen(true);
  }

  function handleOpenEdit(product: Product) {
    setEditingProduct(product);
    setFormData({
      id: product.id,
      handle: product.handle,
      sku: product.sku || "",
      name: product.name,
      tagline: product.tagline || "",
      category: product.category,
      subCategory: product.subCategory || "",
      collectionSlug: product.collectionSlug,
      image: product.image,
      price: product.price,
      compareAtPrice: product.compareAtPrice ?? null,
      badge: product.badge || "",
      inStock: product.inStock,
      isActive: product.isActive ?? true,
      featured: product.featured ?? false,
      description: product.description || "",
      colors: product.colors.length > 0 ? [...product.colors] : [
        { name: "Default", swatch: DEFAULT_SWATCH, image: product.image || DEFAULT_IMAGE },
      ],
      specs: product.specs.length > 0 ? [...product.specs] : [
        { label: "Feature", value: "Standard Spec" },
      ],
    });
    setFormError(null);
    setIsModalOpen(true);
  }

  // Name change handler with auto-slug generation when creating
  function handleNameChange(name: string) {
    if (!editingProduct) {
      const generatedSlug = slugify(name);
      setFormData((prev) => ({
        ...prev,
        name,
        handle: `the-${generatedSlug}`,
        id: generatedSlug,
      }));
    } else {
      setFormData((prev) => ({ ...prev, name }));
    }
  }

  // Add / remove colors
  function handleAddColor() {
    setFormData((prev) => ({
      ...prev,
      colors: [
        ...prev.colors,
        {
          name: "New Color",
          swatch: DEFAULT_SWATCH,
          image: formData.image || DEFAULT_IMAGE,
        },
      ],
    }));
  }

  function handleRemoveColor(index: number) {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index),
    }));
  }

  function handleColorChange(index: number, field: keyof ProductColor, value: string) {
    setFormData((prev) => {
      const updated = [...prev.colors];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, colors: updated };
    });
  }

  // Add / remove specs
  function handleAddSpec() {
    setFormData((prev) => ({
      ...prev,
      specs: [...prev.specs, { label: "Thông số mới", value: "Giá trị" }],
    }));
  }

  function handleRemoveSpec(index: number) {
    setFormData((prev) => ({
      ...prev,
      specs: prev.specs.filter((_, i) => i !== index),
    }));
  }

  function handleSpecChange(index: number, field: keyof ProductSpec, value: string) {
    setFormData((prev) => {
      const updated = [...prev.specs];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, specs: updated };
    });
  }

  async function handleSubmitForm(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;

    if (!formData.name.trim() || !formData.id.trim() || !formData.handle.trim()) {
      setFormError("Vui lòng điền đầy đủ Tên, ID và Handle (Slug).");
      return;
    }

    setSaving(true);
    setFormError(null);

    const payload: Partial<Product> = {
      id: formData.id.trim(),
      handle: formData.handle.trim(),
      sku: formData.sku.trim() || null,
      name: formData.name.trim(),
      tagline: formData.tagline.trim(),
      category: formData.category,
      subCategory: formData.subCategory.trim() || null,
      collectionSlug: formData.collectionSlug,
      image: formData.image.trim() || DEFAULT_IMAGE,
      price: Number(formData.price),
      compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : null,
      badge: formData.badge.trim() || null,
      inStock: formData.inStock,
      isActive: formData.isActive,
      featured: formData.featured,
      description: formData.description,
      colors: formData.colors,
      specs: formData.specs,
      galleryImages: [formData.image.trim() || DEFAULT_IMAGE],
    };

    try {
      if (editingProduct) {
        await adminUpdateProduct(editingProduct.id, payload, token);
      } else {
        await adminCreateProduct(payload, token);
      }
      setIsModalOpen(false);
      await loadProducts();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFormError(err.message);
      } else {
        setFormError("Không thể lưu sản phẩm. Vui lòng kiểm tra lại dữ liệu.");
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleActive(product: Product) {
    if (!token) return;
    const nextStatus = !(product.isActive ?? true);
    try {
      await adminUpdateProduct(product.id, { isActive: nextStatus }, token);
      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id ? { ...p, isActive: nextStatus } : p,
        ),
      );
    } catch (err) {
      console.error("Failed to toggle isActive:", err);
    }
  }

  async function handleDeleteProduct() {
    if (!deleteId || !token) return;
    setDeleting(true);
    try {
      await adminDeleteProduct(deleteId, token);
      setDeleteId(null);
      await loadProducts();
    } catch (err) {
      console.error("Delete product error:", err);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-navy tracking-tight">
            Quản lý Sản phẩm
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Tổng cộng: <strong className="text-royal font-bold">{products.length}</strong> sản phẩm trong cơ sở dữ liệu MySQL
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-navy px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-navy/90 transition-all cursor-pointer"
        >
          <Plus className="size-4" />
          <span>Thêm Sản phẩm Mới</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm sản phẩm theo tên, mã ID hoặc slug..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2 pl-10 pr-4 text-xs text-navy outline-none focus:border-navy focus:bg-white transition-all"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2 text-xs font-semibold text-navy outline-none focus:border-navy cursor-pointer"
        >
          <option value="all">Tất cả Danh mục</option>
          <option value="earbuds">Earbuds</option>
          <option value="open-audio">Open Audio</option>
          <option value="headphones">Headphones</option>
          <option value="power-tech">Power Tech</option>
        </select>
      </div>

      {/* Products Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="size-8 animate-spin text-royal" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <Package className="size-12 text-gray-300 mb-3" />
            <p className="text-sm font-bold text-navy">Không tìm thấy sản phẩm nào</p>
            <p className="text-xs text-gray-400 mt-1">Hãy thử tìm từ khóa khác hoặc tạo sản phẩm mới.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/75 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  <th className="py-3 px-4">Sản phẩm</th>
                  <th className="py-3 px-4">Danh mục</th>
                  <th className="py-3 px-4">Giá bán</th>
                  <th className="py-3 px-4">Khuyến mãi</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs font-medium text-navy">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                    {/* Product Cell */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="size-12 rounded-xl bg-[#e8f7ff] p-1.5 shrink-0 overflow-hidden border border-gray-100">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={p.image}
                            alt=""
                            className="size-full object-contain"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-navy truncate">{p.name}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[11px] text-gray-400 font-mono truncate">
                              /{p.handle}
                            </span>
                            {p.sku && (
                              <span className="rounded bg-gray-100 px-1.5 py-0.2 font-mono text-[10px] font-bold text-gray-600">
                                {p.sku}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category Cell */}
                    <td className="py-3 px-4">
                      <span className="inline-block rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-700 capitalize">
                        {p.category}
                      </span>
                      {p.subCategory && (
                        <span className="block text-[10px] text-royal font-medium mt-0.5">
                          ↳ {p.subCategory}
                        </span>
                      )}
                    </td>

                    {/* Price Cell */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-royal">
                        {formatUsd(p.price)}
                      </div>
                      {p.compareAtPrice && p.compareAtPrice > p.price && (
                        <div className="text-[11px] text-gray-400 line-through">
                          {formatUsd(p.compareAtPrice)}
                        </div>
                      )}
                    </td>

                    {/* Badge Cell */}
                    <td className="py-3 px-4">
                      {p.badge ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 border border-red-200 px-2 py-0.5 text-[10px] font-bold text-red-600">
                          <Tag className="size-3" />
                          {p.badge}
                        </span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>

                    {/* Status Cell */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1 items-start">
                        {/* Active / Inactive Toggle Button */}
                        <button
                          type="button"
                          onClick={() => handleToggleActive(p)}
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold cursor-pointer transition ${
                            p.isActive !== false
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                              : "bg-gray-100 text-gray-500 border border-gray-200 hover:bg-gray-200"
                          }`}
                          title="Nhấn để Bật/Tắt hiển thị ngoài Storefront"
                        >
                          <span
                            className={`size-1.5 rounded-full ${
                              p.isActive !== false ? "bg-emerald-500" : "bg-gray-400"
                            }`}
                          />
                          <span>{p.isActive !== false ? "Hiển thị" : "Đang ẩn"}</span>
                        </button>

                        {p.inStock ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                            <Check className="size-3" /> Còn hàng
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-500">
                            <X className="size-3" /> Hết hàng
                          </span>
                        )}
                        {p.featured && (
                          <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold text-amber-600">
                            <Star className="size-2.5 fill-amber-500" /> Nổi bật
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions Cell */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(p)}
                          title="Chỉnh sửa sản phẩm"
                          className="flex size-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-navy transition-colors cursor-pointer"
                        >
                          <Edit2 className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteId(p.id)}
                          title="Xóa sản phẩm"
                          className="flex size-8 items-center justify-center rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Create & Edit Product */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl border border-gray-100 p-6 md:p-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
              <div>
                <h3 className="text-xl font-bold text-navy">
                  {editingProduct ? "Chỉnh sửa Sản phẩm" : "Thêm Sản phẩm Mới"}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Dữ liệu sẽ được lưu trực tiếp vào cơ sở dữ liệu MySQL
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex size-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-navy"
              >
                <X className="size-4" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-600 flex items-center gap-2">
                <AlertCircle className="size-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitForm} className="space-y-5">
              {/* Name & Slug */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1">
                    Tên sản phẩm *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Everyday Earbuds"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 px-3.5 text-xs text-navy outline-none focus:border-navy focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1">
                    Handle (URL Slug) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.handle}
                    onChange={(e) =>
                      setFormData({ ...formData, handle: e.target.value })
                    }
                    placeholder="the-everyday-earbuds"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 px-3.5 text-xs text-navy outline-none focus:border-navy focus:bg-white font-mono"
                  />
                </div>
              </div>

              {/* ID & Tagline */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1">
                    ID Mã sản phẩm *
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!!editingProduct}
                    value={formData.id}
                    onChange={(e) =>
                      setFormData({ ...formData, id: e.target.value })
                    }
                    placeholder="everyday-earbuds"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 px-3.5 text-xs text-navy outline-none focus:border-navy focus:bg-white font-mono disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1">
                    Tagline ngắn
                  </label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) =>
                      setFormData({ ...formData, tagline: e.target.value })
                    }
                    placeholder="Pocket-size sound for active days."
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 px-3.5 text-xs text-navy outline-none focus:border-navy focus:bg-white"
                  />
                </div>
              </div>

              {/* SKU & SubCategory */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1">
                    Mã SKU Sản Phẩm
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) =>
                      setFormData({ ...formData, sku: e.target.value })
                    }
                    placeholder="RYVO-E25-BLK"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 px-3.5 text-xs text-navy outline-none focus:border-navy focus:bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1">
                    Danh mục Phụ Cấp 2 (Sub-category)
                  </label>
                  <input
                    type="text"
                    value={formData.subCategory}
                    onChange={(e) =>
                      setFormData({ ...formData, subCategory: e.target.value })
                    }
                    placeholder="true-wireless, sport-fitness, over-ear-anc..."
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 px-3.5 text-xs text-navy outline-none focus:border-navy focus:bg-white"
                  />
                </div>
              </div>

              {/* Category & Collection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1">
                    Danh mục (Category)
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value,
                        collectionSlug: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 px-3.5 text-xs text-navy outline-none focus:border-navy cursor-pointer"
                  >
                    <option value="earbuds">Earbuds</option>
                    <option value="open-audio">Open Audio</option>
                    <option value="headphones">Headphones</option>
                    <option value="power-tech">Power Tech</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1">
                    Collection Slug
                  </label>
                  <input
                    type="text"
                    value={formData.collectionSlug}
                    onChange={(e) =>
                      setFormData({ ...formData, collectionSlug: e.target.value })
                    }
                    placeholder="earbuds"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 px-3.5 text-xs text-navy outline-none focus:border-navy focus:bg-white font-mono"
                  />
                </div>
              </div>

              {/* Price, CompareAtPrice, Badge */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1">
                    Giá bán (VNĐ) *
                  </label>
                  <input
                    type="number"
                    step="1000"
                    required
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
                    }
                    placeholder="1590000"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 px-3.5 text-xs text-navy outline-none focus:border-navy focus:bg-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1">
                    Giá gốc (VNĐ)
                  </label>
                  <input
                    type="number"
                    step="1000"
                    value={formData.compareAtPrice ?? ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        compareAtPrice: e.target.value ? parseFloat(e.target.value) : null,
                      })
                    }
                    placeholder="1990000"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 px-3.5 text-xs text-navy outline-none focus:border-navy focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1">
                    Huy hiệu (Badge)
                  </label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) =>
                      setFormData({ ...formData, badge: e.target.value })
                    }
                    placeholder="20% OFF / NEW"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 px-3.5 text-xs text-navy outline-none focus:border-navy focus:bg-white"
                  />
                </div>
              </div>

              {/* Main Image URL */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1">
                  Đường dẫn Ảnh chính (mặc định nếu để trống)
                </label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  placeholder={DEFAULT_IMAGE}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 px-3.5 text-xs text-navy outline-none focus:border-navy focus:bg-white font-mono"
                />
              </div>

              {/* Switches: InStock, Featured & IsActive */}
              <div className="flex flex-wrap items-center gap-6 py-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-navy">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="size-4 rounded text-navy focus:ring-navy cursor-pointer"
                  />
                  <span>Hiển thị Storefront (is_active)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-navy">
                  <input
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={(e) =>
                      setFormData({ ...formData, inStock: e.target.checked })
                    }
                    className="size-4 rounded text-navy focus:ring-navy cursor-pointer"
                  />
                  <span>Còn hàng trong kho (In Stock)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-navy">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) =>
                      setFormData({ ...formData, featured: e.target.checked })
                    }
                    className="size-4 rounded text-navy focus:ring-navy cursor-pointer"
                  />
                  <span>Sản phẩm Nổi bật (Fan Favorites trên Home)</span>
                </label>
              </div>

              {/* Color Variants Manager */}
              <div className="border border-gray-200 rounded-2xl p-4 bg-gray-50/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-navy">
                    <Palette className="size-4 text-royal" />
                    <span>Biến thể Màu sắc ({formData.colors.length})</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddColor}
                    className="text-xs font-bold text-royal hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="size-3" /> Thêm màu
                  </button>
                </div>

                <div className="space-y-2">
                  {formData.colors.map((c, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-gray-200"
                    >
                      <input
                        type="text"
                        value={c.name}
                        onChange={(e) =>
                          handleColorChange(idx, "name", e.target.value)
                        }
                        placeholder="Tên màu (e.g. Carbon Black)"
                        className="flex-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs outline-none"
                      />
                      <input
                        type="text"
                        value={c.swatch}
                        onChange={(e) =>
                          handleColorChange(idx, "swatch", e.target.value)
                        }
                        placeholder="Swatch URL"
                        className="flex-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs outline-none font-mono"
                      />
                      <input
                        type="text"
                        value={c.image}
                        onChange={(e) =>
                          handleColorChange(idx, "image", e.target.value)
                        }
                        placeholder="Ảnh màu URL"
                        className="flex-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs outline-none font-mono"
                      />
                      {formData.colors.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveColor(idx)}
                          className="flex size-7 items-center justify-center rounded text-red-500 hover:bg-red-50 shrink-0"
                        >
                          <X className="size-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Specs Manager */}
              <div className="border border-gray-200 rounded-2xl p-4 bg-gray-50/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-navy">
                    <Sliders className="size-4 text-royal" />
                    <span>Thông số Kỹ thuật ({formData.specs.length})</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddSpec}
                    className="text-xs font-bold text-royal hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="size-3" /> Thêm thông số
                  </button>
                </div>

                <div className="space-y-2">
                  {formData.specs.map((s, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-gray-200"
                    >
                      <input
                        type="text"
                        value={s.label}
                        onChange={(e) =>
                          handleSpecChange(idx, "label", e.target.value)
                        }
                        placeholder="Nhãn (e.g. Battery Life)"
                        className="w-1/3 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs outline-none"
                      />
                      <input
                        type="text"
                        value={s.value}
                        onChange={(e) =>
                          handleSpecChange(idx, "value", e.target.value)
                        }
                        placeholder="Giá trị (e.g. 32 hours total)"
                        className="flex-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs outline-none"
                      />
                      {formData.specs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSpec(idx)}
                          className="flex size-7 items-center justify-center rounded text-red-500 hover:bg-red-50 shrink-0"
                        >
                          <X className="size-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1">
                  Mô tả sản phẩm
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Mô tả chi tiết tính năng, âm bass, chống nước..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 px-3.5 text-xs text-navy outline-none focus:border-navy focus:bg-white"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-gray-200 px-5 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-navy px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-navy/90 transition-all disabled:opacity-50"
                >
                  {saving ? "Đang lưu..." : editingProduct ? "Cập nhật Sản phẩm" : "Tạo Sản phẩm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-gray-100 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-red-100 text-red-600 mb-4">
              <Trash2 className="size-6" />
            </div>
            <h3 className="text-lg font-bold text-navy">Xác nhận Xóa sản phẩm</h3>
            <p className="mt-1 text-xs text-gray-500">
              Bạn có chắc chắn muốn xóa sản phẩm mã <strong className="font-mono text-red-600">{deleteId}</strong> khỏi cơ sở dữ liệu MySQL? Hành động này không thể hoàn tác.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleDeleteProduct}
                disabled={deleting}
                className="rounded-xl bg-red-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? "Đang xóa..." : "Xác nhận Xóa"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

