"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Loader2,
  AlertCircle,
  X,
  Newspaper,
  Check,
} from "lucide-react";
import {
  getArticles,
  createArticle,
  updateArticle,
  deleteArticle,
} from "@/lib/api";
import { useAuthStore } from "@/store/use-auth-store";
import type { Article } from "@/types/article";

const CATEGORY_MAP: Record<string, string> = {
  "tin-tuc": "Tin Tức",
  "su-kien": "Sự Kiện",
  "cong-nghe-am-thanh": "Công Nghệ Âm Thanh",
  "khuyen-mai": "Khuyến Mãi",
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function cleanImageUrl(url: string): string {
  if (!url) return "";
  const trimmed = url.trim();
  try {
    if (trimmed.includes("google.") && (trimmed.includes("/imgres") || trimmed.includes("/url"))) {
      const parsed = new URL(trimmed);
      const imgurl = parsed.searchParams.get("imgurl") || parsed.searchParams.get("url");
      if (imgurl) return decodeURIComponent(imgurl).trim();
    }
  } catch {
    // If not a standard URL, return trimmed as is
  }
  return trimmed;
}

const SAMPLE_THUMBNAILS = [
  { label: "Tai nghe Earbuds", url: "/sites/raycon/images/earbuds-lifestyle.png" },
  { label: "Tai nghe Headphones", url: "/sites/raycon/images/headphones-lifestyle.png" },
  { label: "Loa & Open Audio", url: "/sites/raycon/images/open-audio-lifestyle.png" },
  { label: "Sạc & Phụ kiện", url: "/sites/raycon/images/magic-spin-cable-lifestyle.png" },
];

export default function AdminNewsPage() {
  const token = useAuthStore((state) => state.token);

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Delete State
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "tin-tuc",
    summary: "",
    content: "",
    thumbnail: "/sites/raycon/images/earbuds-lifestyle.png",
    isPublished: true,
  });

  async function loadArticles() {
    setLoading(true);
    try {
      const data = await getArticles({ includeUnpublished: true });
      setArticles(data);
    } catch (err) {
      console.error("Failed to load articles:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadArticles();
  }, []);

  const filteredArticles = articles.filter((a) => {
    const matchesCat = categoryFilter === "all" || a.category === categoryFilter;
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.slug.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  function handleOpenCreate() {
    setEditingArticle(null);
    setFormData({
      title: "",
      slug: "",
      category: "tin-tuc",
      summary: "",
      content: "",
      thumbnail: "/sites/raycon/images/earbuds-lifestyle.png",
      isPublished: true,
    });
    setFormError(null);
    setImageLoadError(false);
    setIsModalOpen(true);
  }

  function handleOpenEdit(article: Article) {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      slug: article.slug,
      category: article.category,
      summary: article.summary,
      content: article.content,
      thumbnail: article.thumbnail || "",
      isPublished: article.isPublished,
    });
    setFormError(null);
    setImageLoadError(false);
    setIsModalOpen(true);
  }

  function handleTitleChange(title: string) {
    if (!editingArticle) {
      setFormData((prev) => ({
        ...prev,
        title,
        slug: slugify(title),
      }));
    } else {
      setFormData((prev) => ({ ...prev, title }));
    }
  }

  async function handleTogglePublished(article: Article) {
    if (!token) return;
    const nextStatus = !article.isPublished;
    try {
      await updateArticle(article.id, { isPublished: nextStatus }, token);
      setArticles((prev) =>
        prev.map((a) => (a.id === article.id ? { ...a, isPublished: nextStatus } : a)),
      );
    } catch (err) {
      console.error("Failed to toggle published status:", err);
    }
  }

  async function handleSubmitForm(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;

    if (!formData.title.trim() || !formData.summary.trim() || !formData.content.trim()) {
      setFormError("Vui lòng điền đầy đủ tiêu đề, tóm tắt và nội dung.");
      return;
    }

    setSaving(true);
    setFormError(null);

    const payload = {
      title: formData.title.trim(),
      slug: formData.slug.trim() || slugify(formData.title),
      category: formData.category,
      summary: formData.summary.trim(),
      content: formData.content.trim(),
      thumbnail: formData.thumbnail.trim() || null,
      isPublished: formData.isPublished,
    };

    try {
      if (editingArticle) {
        await updateArticle(editingArticle.id, payload, token);
      } else {
        await createArticle(payload, token);
      }
      setIsModalOpen(false);
      await loadArticles();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFormError(err.message);
      } else {
        setFormError("Không thể lưu bài viết. Vui lòng thử lại.");
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteId || !token) return;
    setDeleting(true);
    try {
      await deleteArticle(deleteId, token);
      setDeleteId(null);
      await loadArticles();
    } catch (err) {
      console.error("Failed to delete article:", err);
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
            Quản lý Tin tức & Sự kiện
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Tổng cộng: <strong className="text-royal font-bold">{articles.length}</strong> bài viết trong cơ sở dữ liệu
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-navy px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-navy/90 transition-all cursor-pointer"
        >
          <Plus className="size-4" />
          <span>Thêm Bài Viết Mới</span>
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
            placeholder="Tìm kiếm bài viết theo tiêu đề hoặc slug..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2 pl-10 pr-4 text-xs text-navy outline-none focus:border-navy focus:bg-white transition-all"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2 text-xs font-semibold text-navy outline-none focus:border-navy cursor-pointer"
        >
          <option value="all">Tất cả Chuyên mục</option>
          <option value="tin-tuc">Tin Tức</option>
          <option value="su-kien">Sự Kiện</option>
          <option value="cong-nghe-am-thanh">Công Nghệ Âm Thanh</option>
          <option value="khuyen-mai">Khuyến Mãi</option>
        </select>
      </div>

      {/* Articles Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="size-8 animate-spin text-royal" />
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <Newspaper className="size-12 text-gray-300 mb-3" />
            <p className="text-sm font-bold text-navy">Không tìm thấy bài viết nào</p>
            <p className="text-xs text-gray-400 mt-1">Hãy bấm nút trên để tạo bài viết đầu tiên.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/75 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  <th className="py-3 px-4">Bài viết</th>
                  <th className="py-3 px-4">Chuyên mục</th>
                  <th className="py-3 px-4">Tác giả</th>
                  <th className="py-3 px-4">Lượt xem</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs font-medium text-navy">
                {filteredArticles.map((art) => (
                  <tr key={art.id} className="hover:bg-gray-50/50 transition-colors">
                    {/* Article Cell */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="size-14 rounded-xl bg-[#e8f7ff] p-1 shrink-0 overflow-hidden border border-gray-100">
                          {art.thumbnail ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={art.thumbnail}
                              alt=""
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                e.currentTarget.src = "/sites/raycon/images/earbuds-lifestyle.png";
                              }}
                              className="size-full object-contain"
                            />
                          ) : (
                            <div className="flex size-full items-center justify-center text-[10px] text-gray-400">
                              No img
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 max-w-xs">
                          <p className="font-bold text-navy truncate">{art.title}</p>
                          <p className="text-[11px] text-gray-400 font-mono truncate">
                            /news/{art.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category Cell */}
                    <td className="py-3 px-4">
                      <span className="inline-block rounded-md bg-royal/10 text-royal px-2 py-0.5 text-[10px] font-bold">
                        {CATEGORY_MAP[art.category] || art.category}
                      </span>
                    </td>

                    {/* Author Cell */}
                    <td className="py-3 px-4 text-gray-600">
                      {art.author}
                    </td>

                    {/* Views Cell */}
                    <td className="py-3 px-4 font-bold text-navy/70">
                      {art.views || 0}
                    </td>

                    {/* Status Cell */}
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => handleTogglePublished(art)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold cursor-pointer transition ${
                          art.isPublished
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                            : "bg-gray-100 text-gray-500 border border-gray-200 hover:bg-gray-200"
                        }`}
                        title="Bấm để Ẩn / Xuất bản bài viết"
                      >
                        {art.isPublished ? (
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

                    {/* Actions Cell */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(art)}
                          title="Chỉnh sửa bài viết"
                          className="flex size-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-navy transition-colors cursor-pointer"
                        >
                          <Edit2 className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteId(art.id)}
                          title="Xóa bài viết"
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
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl border border-gray-100 p-6 md:p-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
              <div>
                <h3 className="text-xl font-bold text-navy">
                  {editingArticle ? "Chỉnh sửa Bài Viết" : "Thêm Bài Viết Mới"}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Quản lý nội dung bài viết tin tức ngoài Storefront
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1">
                    Tiêu đề bài viết *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="RYVO ra mắt tai nghe mới"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 px-3.5 text-xs text-navy outline-none focus:border-navy focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1">
                    Slug URL *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    placeholder="ryvo-ra-mat-tai-nghe-moi"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 px-3.5 text-xs text-navy outline-none focus:border-navy focus:bg-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1">
                    Chuyên mục *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 px-3.5 text-xs text-navy outline-none focus:border-navy cursor-pointer"
                  >
                    <option value="tin-tuc">Tin Tức</option>
                    <option value="su-kien">Sự Kiện</option>
                    <option value="cong-nghe-am-thanh">Công Nghệ Âm Thanh</option>
                    <option value="khuyen-mai">Khuyến Mãi</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-navy/70">
                      Ảnh đại diện (Thumbnail URL)
                    </label>
                    <span className="text-[10px] text-gray-400 font-medium">
                      Hỗ trợ URL Google, web bên ngoài hoặc ảnh nội bộ
                    </span>
                  </div>
                  <input
                    type="text"
                    value={formData.thumbnail}
                    onChange={(e) => {
                      const cleaned = cleanImageUrl(e.target.value);
                      setFormData({ ...formData, thumbnail: cleaned });
                      setImageLoadError(false);
                    }}
                    onPaste={(e) => {
                      const pasted = e.clipboardData.getData("text");
                      const cleaned = cleanImageUrl(pasted);
                      if (cleaned !== pasted) {
                        e.preventDefault();
                        setFormData({ ...formData, thumbnail: cleaned });
                        setImageLoadError(false);
                      }
                    }}
                    placeholder="Dán link ảnh từ Google (ví dụ: https://... hoặc địa chỉ ảnh)"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 px-3.5 text-xs text-navy outline-none focus:border-navy focus:bg-white font-mono"
                  />

                  {/* Sample Chips */}
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] text-gray-400 font-medium">Ảnh mẫu:</span>
                    {SAMPLE_THUMBNAILS.map((sample) => (
                      <button
                        key={sample.label}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, thumbnail: sample.url });
                          setImageLoadError(false);
                        }}
                        className="rounded-md bg-gray-100 hover:bg-royal/10 hover:text-royal px-2 py-0.5 text-[10px] font-semibold text-gray-600 transition cursor-pointer"
                      >
                        {sample.label}
                      </button>
                    ))}
                  </div>

                  {/* Live Thumbnail Preview */}
                  {formData.thumbnail && (
                    <div className="mt-3 flex items-center gap-3 rounded-xl border border-gray-200/80 bg-gray-50/70 p-2.5">
                      <div className="relative size-16 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-white flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={formData.thumbnail}
                          alt="Thumbnail Preview"
                          referrerPolicy="no-referrer"
                          onLoad={() => setImageLoadError(false)}
                          onError={() => setImageLoadError(true)}
                          className="size-full object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0 text-xs">
                        {imageLoadError ? (
                          <div className="text-amber-700 font-semibold flex items-center gap-1 text-[11px]">
                            <AlertCircle className="size-3.5 shrink-0 text-amber-500" />
                            <span>Không tải được ảnh từ URL này. Vui lòng kiểm tra lại liên kết.</span>
                          </div>
                        ) : (
                          <div className="text-emerald-700 font-semibold flex items-center gap-1 text-[11px]">
                            <Check className="size-3.5 shrink-0 text-emerald-500" />
                            <span>Hình ảnh hiển thị hợp lệ</span>
                          </div>
                        )}
                        <p className="text-[10px] text-gray-500 truncate mt-0.5 font-mono">
                          {formData.thumbnail}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1">
                  Tóm tắt ngắn (Summary) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.summary}
                  onChange={(e) =>
                    setFormData({ ...formData, summary: e.target.value })
                  }
                  placeholder="Mô tả ngắn gọn về bài viết..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-3.5 text-xs text-navy outline-none focus:border-navy focus:bg-white resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1">
                  Nội dung chi tiết *
                </label>
                <textarea
                  rows={7}
                  required
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="Viết toàn bộ nội dung bài viết..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-3.5 text-xs text-navy outline-none focus:border-navy focus:bg-white resize-none leading-relaxed"
                />
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-navy">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) =>
                      setFormData({ ...formData, isPublished: e.target.checked })
                    }
                    className="size-4 rounded text-navy focus:ring-navy cursor-pointer"
                  />
                  <span>Xuất bản ngay (Hiển thị ngoài Storefront)</span>
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
                  {saving ? "Đang lưu..." : "Lưu Bài Viết"}
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
              Xác nhận xóa bài viết?
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Bài viết sẽ bị xóa vĩnh viễn khỏi hệ thống.
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
                {deleting ? "Đang xóa..." : "Xóa Bài"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
