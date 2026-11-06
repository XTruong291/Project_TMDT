"use client";

import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import {
  Calendar,
  ChevronRight,
  Eye,
  Loader2,
  Newspaper,
  PenSquare,
  Search,
  Sparkles,
  Tag,
  X,
  AlertCircle,
  Check,
} from "lucide-react";
import { getArticles, createArticle } from "@/lib/api";
import { useAuthStore } from "@/store/use-auth-store";
import type { Article } from "@/types/article";
import { SafeImage } from "@/components/ui/safe-image";

const CATEGORY_MAP: Record<string, { label: string; badgeClass: string }> = {
  "tin-tuc": { label: "Tin Tức", badgeClass: "bg-blue-50 text-blue-700 border-blue-200" },
  "su-kien": { label: "Sự Kiện", badgeClass: "bg-purple-50 text-purple-700 border-purple-200" },
  "cong-nghe-am-thanh": {
    label: "Công Nghệ Âm Thanh",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  "khuyen-mai": {
    label: "Khuyến Mãi",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
  },
};

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
    // If not standard URL, return trimmed as is
  }
  return trimmed;
}

const SAMPLE_THUMBNAILS = [
  { label: "Tai nghe Earbuds", url: "/sites/raycon/images/earbuds-lifestyle.png" },
  { label: "Tai nghe Headphones", url: "/sites/raycon/images/headphones-lifestyle.png" },
  { label: "Loa & Open Audio", url: "/sites/raycon/images/open-audio-lifestyle.png" },
  { label: "Sạc & Phụ kiện", url: "/sites/raycon/images/magic-spin-cable-lifestyle.png" },
];

const DEFAULT_ARTICLES: Article[] = [
  {
    id: 1,
    slug: "ryvo-ra-mat-dong-tai-nghe-chong-on-anc-everyday-pro",
    title: "RYVO chính thức ra mắt tai nghe chống ồn ANC Everyday Pro thế hệ mới",
    summary:
      "Dòng tai nghe chụp tai hàng đầu của RYVO nâng cấp công nghệ chống ồn chủ động Hybrid ANC 35dB, thời lượng pin 45 giờ cùng chất âm cân bằng chuyên nghiệp.",
    content:
      "Hôm nay, RYVO chính thức công bố thế hệ tai nghe không dây Everyday Pro Headphones với nhiều cải tiến mang tính đột phá dành cho giới làm việc văn phòng và người thường xuyên di chuyển...",
    thumbnail: "/sites/raycon/images/headphones-lifestyle.png",
    category: "su-kien",
    author: "Ban Biên Tập RYVO",
    views: 128,
    isPublished: true,
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    slug: "cong-nghe-truyen-am-qua-xuong-bone-conduction-hoat-dong-the-nao",
    title: "Công nghệ truyền âm qua xương (Bone Conduction) hoạt động như thế nào?",
    summary:
      "Khám phá nguyên lý khoa học đằng sau dòng tai nghe Open Ear - nghe nhạc rõ nét mà vẫn cảm nhận trọn vẹn âm thanh xung quanh khi chạy bộ và tập gym.",
    content:
      "Khác với tai nghe truyền thống truyền sóng âm qua màng nhĩ, công nghệ Bone Conduction truyền rung động âm thanh thẳng qua xương gò má vào ốc tai...",
    thumbnail: "/sites/raycon/images/open-audio-lifestyle.png",
    category: "cong-nghe-am-thanh",
    author: "Kỹ Sư Âm Học RYVO",
    views: 245,
    isPublished: true,
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 3,
    slug: "huong-dan-chon-profile-am-thanh-pure-balanced-bass",
    title: "Hướng dẫn chọn 3 chế độ âm thanh: Pure Sound, Balanced Sound & Bass Boost",
    summary:
      "Làm chủ 3 profile âm thanh độc quyền tích hợp sẵn trên tai nghe RYVO chỉ với một chạm để tối ưu cho từng thể loại nhạc và podcast.",
    content:
      "Tai nghe RYVO được lập trình sẵn 3 chế độ EQ vật lý mà bạn không cần phải cài thêm bất kỳ ứng dụng nặng nề nào vào điện thoại...",
    thumbnail: "/sites/raycon/images/earbuds-lifestyle.png",
    category: "tin-tuc",
    author: "Ban Biên Tập RYVO",
    views: 310,
    isPublished: true,
    publishedAt: new Date(Date.now() - 172800000).toISOString(),
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 4,
    slug: "chuong-trinh-doi-cu-lay-moi-va-bao-ve-moi-truong-2026",
    title: "RYVO phát động chương trình Thu cũ đổi mới & Tái chế xanh 2026",
    summary:
      "Hỗ trợ khách hàng nâng cấp tai nghe cũ lên các dòng sản phẩm RYVO mới nhất với voucher trợ giá lên tới 25%, chung tay giảm thiểu rác thải điện tử.",
    content:
      "Nhằm lan tỏa thông điệp sống xanh và phát triển bền vững, RYVO khởi động chiến dịch 'Green Beats 2026' trên toàn hệ thống từ tháng 11/2026...",
    thumbnail: "/sites/raycon/images/E25_BLU_IMG1.png",
    category: "khuyen-mai",
    author: "Phòng Trách Nhiệm Xã Hội RYVO",
    views: 89,
    isPublished: true,
    publishedAt: new Date(Date.now() - 259200000).toISOString(),
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date(Date.now() - 259200000).toISOString(),
  },
];

export default function NewsPage() {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Post modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);
  const [postSuccess, setPostSuccess] = useState<string | null>(null);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "tin-tuc",
    summary: "",
    content: "",
    thumbnail: "/sites/raycon/images/earbuds-lifestyle.png",
  });

  async function loadArticles() {
    setLoading(true);
    try {
      const data = await getArticles();
      setArticles(data && data.length > 0 ? data : DEFAULT_ARTICLES);
    } catch {
      setArticles(DEFAULT_ARTICLES);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadArticles();
  }, []);

  // Filter and sort articles (Newest to oldest - ORDER BY created_at DESC)
  const filteredArticles = useMemo(() => {
    let list = [...articles];

    // Category filter
    if (activeCategory !== "all") {
      list = list.filter((a) => a.category === activeCategory);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.summary.toLowerCase().includes(q),
      );
    }

    // Đề bài bắt buộc: sắp xếp theo thứ tự từ mới nhất đến cũ nhất
    list.sort(
      (a, b) =>
        new Date(b.createdAt || b.publishedAt).getTime() -
        new Date(a.createdAt || a.publishedAt).getTime(),
    );

    return list;
  }, [articles, activeCategory, searchQuery]);

  async function handleCreateArticle(e: React.FormEvent) {
    e.preventDefault();
    if (!token) {
      setPostError("Vui lòng đăng nhập để đăng bài viết.");
      return;
    }

    if (!formData.title.trim() || !formData.summary.trim() || !formData.content.trim()) {
      setPostError("Vui lòng nhập đầy đủ tiêu đề, tóm tắt và nội dung bài viết.");
      return;
    }

    setPosting(true);
    setPostError(null);

    try {
      const created = await createArticle(
        {
          title: formData.title.trim(),
          category: formData.category,
          summary: formData.summary.trim(),
          content: formData.content.trim(),
          thumbnail: formData.thumbnail.trim() || "/sites/raycon/images/earbuds-lifestyle.png",
          isPublished: true,
        },
        token,
      );

      setArticles((prev) => [created, ...prev]);
      setPostSuccess("🎉 Đăng bài viết mới thành công!");
      setTimeout(() => {
        setIsModalOpen(false);
        setPostSuccess(null);
        setFormData({
          title: "",
          category: "tin-tuc",
          summary: "",
          content: "",
          thumbnail: "/sites/raycon/images/earbuds-lifestyle.png",
        });
      }, 1000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setPostError(err.message);
      } else {
        setPostError("Không thể đăng bài viết. Vui lòng thử lại sau.");
      }
    } finally {
      setPosting(false);
    }
  }

  const categoryTabs = [
    { id: "all", label: "Tất Cả Bài Viết" },
    { id: "tin-tuc", label: "Tin Tức" },
    { id: "su-kien", label: "Sự Kiện" },
    { id: "cong-nghe-am-thanh", label: "Công Nghệ Âm Thanh" },
    { id: "khuyen-mai", label: "Khuyến Mãi" },
  ];

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      {/* Breadcrumb Navigation */}
      <div className="border-b border-navy/5 bg-white">
        <div className="raycon-container py-3">
          <nav className="flex items-center gap-1.5 text-xs text-navy/60 font-medium">
            <Link href="/" className="hover:text-royal transition-colors">
              Trang chủ
            </Link>
            <ChevronRight className="size-3.5 text-navy/40" />
            <span className="text-navy font-semibold">Tin tức & Sự kiện</span>
          </nav>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-[linear-gradient(115deg,#0d1163_0%,#1a1db6_50%,#2d50ed_100%)] text-white py-12 md:py-16">
        <div className="raycon-container relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold tracking-wider uppercase backdrop-blur-xs mb-3">
                <Sparkles className="size-3.5 text-[#ffb13b]" />
                <span>RYVO Newsroom</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
                Tin Tức, Sự Kiện & Công Nghệ
              </h1>
              <p className="mt-3 text-sm md:text-base text-white/80">
                Cập nhật xu hướng âm thanh mới nhất, các sự kiện ra mắt sản phẩm và mẹo tối ưu trải nghiệm âm nhạc từ RYVO.
              </p>
            </div>

            {user?.role === "admin" && (
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-xs font-bold text-navy uppercase tracking-wider shadow-lg hover:bg-gray-100 transition-all cursor-pointer shrink-0 self-start md:self-auto"
              >
                <PenSquare className="size-4 text-royal" />
                <span>Viết Bài Viết Mới</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="sticky top-[66px] z-30 border-b border-navy/10 bg-white/95 backdrop-blur-md shadow-xs py-3.5">
        <div className="raycon-container flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categoryTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCategory(tab.id)}
                className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === tab.id
                    ? "bg-royal text-white shadow-xs"
                    : "border border-navy/15 bg-white text-navy/70 hover:border-royal hover:text-royal"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-navy/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm bài viết..."
              className="w-full rounded-full border border-navy/15 bg-gray-50/50 py-1.5 pl-9 pr-4 text-xs text-navy outline-none focus:border-royal focus:bg-white transition"
            />
          </div>
        </div>
      </div>

      {/* Main Articles List (Bố cục HÀNG DỌC - Vertical List) */}
      <div className="raycon-container py-10 md:py-16">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="size-8 animate-spin text-royal" />
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-navy/20 bg-white p-12 text-center">
              <Newspaper className="size-12 text-navy/30 mb-3" />
              <h3 className="text-lg font-bold text-navy">Không tìm thấy bài viết nào</h3>
              <p className="text-xs text-navy/60 mt-1 max-w-sm">
                Hãy thử chọn chuyên mục khác hoặc tìm kiếm với từ khóa khác.
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveCategory("all");
                  setSearchQuery("");
                }}
                className="mt-4 rounded-full bg-royal px-5 py-2 text-xs font-bold text-white hover:bg-[#2827cd]"
              >
                Xem tất cả bài viết
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {filteredArticles.map((article) => {
                const catInfo = CATEGORY_MAP[article.category] || {
                  label: article.category,
                  badgeClass: "bg-gray-100 text-gray-700 border-gray-200",
                };
                const formattedDate = new Date(
                  article.createdAt || article.publishedAt,
                ).toLocaleDateString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                });

                return (
                  <article
                    key={article.id}
                    className="group flex flex-col md:flex-row items-stretch gap-6 rounded-3xl border border-navy/10 bg-white p-5 md:p-6 shadow-xs hover:shadow-md hover:border-royal/30 transition-all duration-300"
                  >
                    {/* Thumbnail Bên Trái */}
                    <div className="w-full md:w-72 aspect-16/10 md:aspect-4/3 shrink-0 overflow-hidden rounded-2xl bg-[#e8f7ff] p-3 flex items-center justify-center border border-navy/5">
                      {article.thumbnail ? (
                        <SafeImage
                          src={article.thumbnail}
                          alt={article.title}
                          fallbackSrc="/sites/raycon/images/earbuds-lifestyle.png"
                          className="size-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-sm"
                        />
                      ) : (
                        <Newspaper className="size-12 text-navy/20" />
                      )}
                    </div>

                    {/* Nội Dung Bên Phải */}
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="space-y-2.5">
                        {/* Meta info: Category & Date */}
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span
                            className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${catInfo.badgeClass}`}
                          >
                            <Tag className="size-2.5 mr-1" />
                            {catInfo.label}
                          </span>
                          <span className="flex items-center gap-1 text-[11px] text-navy/50 font-medium">
                            <Calendar className="size-3" />
                            {formattedDate}
                          </span>
                          <span className="flex items-center gap-1 text-[11px] text-navy/50 font-medium">
                            <Eye className="size-3" />
                            {article.views || 0} lượt đọc
                          </span>
                        </div>

                        {/* Title */}
                        <h2 className="text-lg md:text-xl font-bold text-navy leading-snug group-hover:text-royal transition-colors">
                          <Link href={`/news/${article.slug}`}>
                            {article.title}
                          </Link>
                        </h2>

                        {/* Summary */}
                        <p className="text-xs md:text-sm text-navy/70 line-clamp-3 leading-relaxed">
                          {article.summary}
                        </p>
                      </div>

                      {/* Footer Link */}
                      <div className="mt-4 pt-3 border-t border-navy/5 flex items-center justify-between">
                        <span className="text-[11px] text-navy/50 font-medium">
                          Tác giả: <strong className="text-navy">{article.author}</strong>
                        </span>
                        <Link
                          href={`/news/${article.slug}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-royal hover:underline"
                        >
                          <span>Đọc chi tiết</span>
                          <ChevronRight className="size-3.5" />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal Đăng Bài Viết Mới */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl border border-gray-100 p-6 md:p-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
              <div>
                <h3 className="text-xl font-bold text-navy">
                  Đăng Bài Viết Mới
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Chia sẻ tin tức, sự kiện hoặc góc nhìn công nghệ âm thanh
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

            {postError && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-600 flex items-center gap-2">
                <AlertCircle className="size-4 shrink-0" />
                <span>{postError}</span>
              </div>
            )}

            {postSuccess && (
              <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-700 flex items-center gap-2">
                <Check className="size-4 shrink-0" />
                <span>{postSuccess}</span>
              </div>
            )}

            <form onSubmit={handleCreateArticle} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1">
                  Tiêu đề bài viết *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Ví dụ: Trải nghiệm tai nghe chống ồn mới nhất từ RYVO"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 px-3.5 text-xs text-navy outline-none focus:border-navy focus:bg-white"
                />
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
                      Hỗ trợ URL Google hoặc link ảnh bên ngoài
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
                  placeholder="Mô tả ngắn gọn hiển thị ở danh sách bài viết..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-3.5 text-xs text-navy outline-none focus:border-navy focus:bg-white resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1">
                  Nội dung chi tiết *
                </label>
                <textarea
                  rows={6}
                  required
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="Viết toàn bộ nội dung bài viết tại đây..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-3.5 text-xs text-navy outline-none focus:border-navy focus:bg-white resize-none leading-relaxed"
                />
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
                  disabled={posting}
                  className="rounded-xl bg-navy px-5 py-2 text-xs font-bold text-white hover:bg-navy/90 transition-all cursor-pointer disabled:opacity-50"
                >
                  {posting ? "Đang đăng bài..." : "Xuất Bản Bài Viết"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
