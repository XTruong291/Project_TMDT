"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
  Layers,
} from "lucide-react";
import {
  getAboutSections,
  adminCreateAboutSection,
  adminUpdateAboutSection,
  adminDeleteAboutSection,
} from "@/lib/api";
import { useAuthStore } from "@/store/use-auth-store";
import type { AboutSection } from "@/types/about";
import { SafeImage } from "@/components/ui/safe-image";
import { cleanImageUrl } from "@/lib/image-utils";

const CATEGORY_LABELS: Record<string, string> = {
  company_overview: "Tổng quan công ty",
  products_services: "Sản phẩm & Dịch vụ",
  mission_vision: "Sứ mệnh & Tầm nhìn",
};

const SAMPLE_ABOUT_IMAGES = [
  { label: "Tai nghe Earbuds", url: "/sites/raycon/images/earbuds-lifestyle.png" },
  { label: "Tai nghe Headphones", url: "/sites/raycon/images/headphones-lifestyle.png" },
  { label: "Open Audio", url: "/sites/raycon/images/open-audio-lifestyle.png" },
  { label: "Sạc & Phụ kiện", url: "/sites/raycon/images/magic-spin-cable-lifestyle.png" },
];

export default function AdminAboutPage() {
  const token = useAuthStore((state) => state.token);

  const [sections, setSections] = useState<AboutSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<AboutSection | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Delete State
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    title: "",
    category: "company_overview",
    content: "",
    imageUrl: "",
    sortOrder: 1,
    isVisible: true,
  });

  async function loadSections() {
    setLoading(true);
    try {
      const data = await getAboutSections({ includeHidden: true });
      setSections(data);
    } catch (err) {
      console.error("Failed to load about sections:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSections();
  }, []);

  const filteredSections = sections.filter((s) => {
    if (categoryFilter === "all") return true;
    return s.category === categoryFilter;
  });

  function handleOpenCreate() {
    setEditingSection(null);
    setFormData({
      title: "",
      category: "company_overview",
      content: "",
      imageUrl: "/sites/raycon/images/earbuds-lifestyle.png",
      sortOrder: sections.length + 1,
      isVisible: true,
    });
    setFormError(null);
    setIsModalOpen(true);
  }

  function handleOpenEdit(section: AboutSection) {
    setEditingSection(section);
    setFormData({
      title: section.title,
      category: section.category,
      content: section.content,
      imageUrl: section.imageUrl || "",
      sortOrder: section.sortOrder,
      isVisible: section.isVisible,
    });
    setFormError(null);
    setIsModalOpen(true);
  }

  async function handleToggleVisible(section: AboutSection) {
    if (!token) return;
    const nextStatus = !section.isVisible;
    try {
      await adminUpdateAboutSection(
        section.id,
        { isVisible: nextStatus },
        token,
      );
      setSections((prev) =>
        prev.map((s) => (s.id === section.id ? { ...s, isVisible: nextStatus } : s)),
      );
    } catch (err) {
      console.error("Failed to toggle visibility:", err);
    }
  }

  async function handleSubmitForm(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;

    if (!formData.title.trim() || !formData.content.trim()) {
      setFormError("Vui lòng điền tiêu đề và nội dung mục giới thiệu.");
      return;
    }

    setSaving(true);
    setFormError(null);

    const payload = {
      title: formData.title.trim(),
      category: formData.category,
      content: formData.content.trim(),
      imageUrl: formData.imageUrl.trim() || null,
      sortOrder: Number(formData.sortOrder) || 0,
      isVisible: formData.isVisible,
    };

    try {
      if (editingSection) {
        await adminUpdateAboutSection(editingSection.id, payload, token);
      } else {
        await adminCreateAboutSection(payload, token);
      }
      setIsModalOpen(false);
      await loadSections();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFormError(err.message);
      } else {
        setFormError("Không thể lưu mục giới thiệu. Vui lòng kiểm tra lại dữ liệu.");
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteId || !token) return;
    setDeleting(true);
    try {
      await adminDeleteAboutSection(deleteId, token);
      setDeleteId(null);
      await loadSections();
    } catch (err) {
      console.error("Failed to delete about section:", err);
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
            Quản lý Trang Giới thiệu (CMS)
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Tổng cộng: <strong className="text-royal font-bold">{sections.length}</strong> mục nội dung trong trang Giới thiệu (/about)
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-navy px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-navy/90 transition-all cursor-pointer"
        >
          <Plus className="size-4" />
          <span>Thêm Mục Giới Thiệu Mới</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <label className="text-xs font-bold text-navy uppercase tracking-wider">
          Phân loại nhóm:
        </label>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2 text-xs font-semibold text-navy outline-none focus:border-navy cursor-pointer"
        >
          <option value="all">Tất cả Nhóm Nội Dung</option>
          <option value="company_overview">Tổng quan công ty</option>
          <option value="products_services">Sản phẩm & Dịch vụ</option>
          <option value="mission_vision">Sứ mệnh & Tầm nhìn</option>
        </select>
      </div>

      {/* Sections Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="size-8 animate-spin text-royal" />
          </div>
        ) : filteredSections.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <Layers className="size-12 text-gray-300 mb-3" />
            <p className="text-sm font-bold text-navy">Chưa có mục nội dung nào</p>
            <p className="text-xs text-gray-400 mt-1">Hãy bấm nút trên để tạo mục giới thiệu đầu tiên.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/75 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  <th className="py-3 px-4">Thứ tự</th>
                  <th className="py-3 px-4">Hình ảnh</th>
                  <th className="py-3 px-4">Tiêu đề & Nhóm</th>
                  <th className="py-3 px-4">Tóm tắt nội dung</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs font-medium text-navy">
                {filteredSections.map((sec) => (
                  <tr key={sec.id} className="hover:bg-gray-50/50 transition-colors">
                    {/* Sort Order */}
                    <td className="py-3 px-4 font-bold text-navy/70">
                      #{sec.sortOrder}
                    </td>

                    {/* Image */}
                    <td className="py-3 px-4">
                      <div className="size-14 rounded-xl bg-[#e8f7ff] p-1 shrink-0 overflow-hidden border border-gray-100">
                        {sec.imageUrl ? (
                          <SafeImage
                            src={sec.imageUrl}
                            alt=""
                            fallbackSrc="/sites/raycon/images/earbuds-lifestyle.png"
                            className="size-full object-contain"
                          />
                        ) : (
                          <div className="flex size-full items-center justify-center text-[10px] text-gray-400">
                            No img
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Title & Category */}
                    <td className="py-3 px-4">
                      <p className="font-bold text-navy max-w-xs">{sec.title}</p>
                      <span className="inline-block mt-1 rounded-md bg-royal/10 text-royal px-2 py-0.5 text-[10px] font-bold">
                        {CATEGORY_LABELS[sec.category] || sec.category}
                      </span>
                    </td>

                    {/* Content snippet */}
                    <td className="py-3 px-4">
                      <p className="text-gray-600 line-clamp-2 max-w-sm text-[11px] leading-relaxed">
                        {sec.content}
                      </p>
                    </td>

                    {/* Status & Toggle */}
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => handleToggleVisible(sec)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold cursor-pointer transition ${
                          sec.isVisible
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                            : "bg-gray-100 text-gray-500 border border-gray-200 hover:bg-gray-200"
                        }`}
                        title="Bấm để Ẩn / Hiện mục này trên trang /about"
                      >
                        {sec.isVisible ? (
                          <>
                            <Eye className="size-3 text-emerald-600" />
                            <span>Hiển thị</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="size-3 text-gray-400" />
                            <span>Đang ẩn</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(sec)}
                          title="Chỉnh sửa mục này"
                          className="flex size-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-navy transition-colors cursor-pointer"
                        >
                          <Edit2 className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteId(sec.id)}
                          title="Xóa mục này"
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

      {/* Modal Create & Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl border border-gray-100 p-6 md:p-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
              <div>
                <h3 className="text-xl font-bold text-navy">
                  {editingSection ? "Chỉnh sửa Mục Giới Thiệu" : "Thêm Mục Giới Thiệu Mới"}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Nội dung sẽ hiển thị trực tiếp trên trang Giới thiệu (/about)
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex size-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-navy cursor-pointer"
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

            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1">
                  Tiêu đề mục *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Ví dụ: RYVO Audio - Kỷ nguyên Âm thanh Không dây"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 px-3.5 text-xs text-navy outline-none focus:border-navy focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1">
                    Nhóm nội dung *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 px-3.5 text-xs text-navy outline-none focus:border-navy cursor-pointer"
                  >
                    <option value="company_overview">Tổng quan công ty</option>
                    <option value="products_services">Sản phẩm & Dịch vụ</option>
                    <option value="mission_vision">Sứ mệnh & Tầm nhìn</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1">
                    Thứ tự hiển thị
                  </label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sortOrder: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 px-3.5 text-xs text-navy outline-none focus:border-navy focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-navy/70">
                    Đường dẫn Hình ảnh (Image URL)
                  </label>
                  <span className="text-[10px] text-gray-400 font-medium">
                    Hỗ trợ URL Google hoặc link ảnh bên ngoài
                  </span>
                </div>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => {
                    const cleaned = cleanImageUrl(e.target.value);
                    setFormData({ ...formData, imageUrl: cleaned });
                  }}
                  onPaste={(e) => {
                    const pasted = e.clipboardData.getData("text");
                    const cleaned = cleanImageUrl(pasted);
                    if (cleaned !== pasted) {
                      e.preventDefault();
                      setFormData({ ...formData, imageUrl: cleaned });
                    }
                  }}
                  placeholder="/sites/raycon/images/earbuds-lifestyle.png hoặc dán link Google"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 px-3.5 text-xs text-navy outline-none focus:border-navy focus:bg-white font-mono"
                />

                {/* Sample Chips */}
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] text-gray-400 font-medium">Ảnh mẫu:</span>
                  {SAMPLE_ABOUT_IMAGES.map((sample) => (
                    <button
                      key={sample.label}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, imageUrl: sample.url })
                      }
                      className="rounded-md bg-gray-100 hover:bg-royal/10 hover:text-royal px-2 py-0.5 text-[10px] font-semibold text-gray-600 transition cursor-pointer"
                    >
                      {sample.label}
                    </button>
                  ))}
                </div>

                {/* Live Preview */}
                {formData.imageUrl && (
                  <div className="mt-3 flex items-center gap-3 rounded-xl border border-gray-200/80 bg-gray-50/70 p-2.5">
                    <div className="relative size-16 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-white flex items-center justify-center">
                      <SafeImage
                        src={formData.imageUrl}
                        alt="Preview"
                        className="size-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0 text-xs">
                      <p className="font-semibold text-navy truncate">
                        Xem trước hình ảnh
                      </p>
                      <p className="text-[10px] text-gray-400 truncate mt-0.5 font-mono">
                        {formData.imageUrl}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1">
                  Nội dung chi tiết *
                </label>
                <textarea
                  rows={5}
                  required
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="Nhập nội dung bài viết giới thiệu..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-3.5 text-xs text-navy outline-none focus:border-navy focus:bg-white resize-none leading-relaxed"
                />
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-navy">
                  <input
                    type="checkbox"
                    checked={formData.isVisible}
                    onChange={(e) =>
                      setFormData({ ...formData, isVisible: e.target.checked })
                    }
                    className="size-4 rounded text-navy focus:ring-navy cursor-pointer"
                  />
                  <span>Hiển thị trên trang /about (is_visible)</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-navy px-5 py-2 text-xs font-bold text-white hover:bg-navy/90 transition-all cursor-pointer disabled:opacity-50"
                >
                  {saving ? "Đang lưu..." : "Lưu Thay Đổi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-gray-100 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-red-100 text-red-600 mb-4">
              <Trash2 className="size-6" />
            </div>
            <h3 className="text-base font-bold text-navy">
              Xác nhận xóa mục giới thiệu?
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Thao tác này không thể hoàn tác và mục này sẽ bị xóa vĩnh viễn khỏi trang giới thiệu.
            </p>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 cursor-pointer disabled:opacity-50"
              >
                {deleting ? "Đang xóa..." : "Xóa Ngay"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
