import Link from "next/link";
import { ArrowRight, Calendar, Newspaper, Sparkles, Tag } from "lucide-react";
import { getArticles } from "@/lib/api";
import type { Article } from "@/types/article";
import { SafeImage } from "@/components/ui/safe-image";

const CATEGORY_MAP: Record<string, { label: string; badgeClass: string }> = {
  "tin-tuc": { label: "Tin Tức", badgeClass: "bg-blue-50 text-blue-700 border-blue-200" },
  "su-kien": { label: "Sự Kiện", badgeClass: "bg-purple-50 text-purple-700 border-purple-200" },
  "cong-nghe-am-thanh": {
    label: "Công Nghệ",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  "khuyen-mai": {
    label: "Khuyến Mãi",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
  },
};

const FALLBACK_NEWS: Article[] = [
  {
    id: 1,
    slug: "ryvo-ra-mat-dong-tai-nghe-chong-on-anc-everyday-pro",
    title: "RYVO chính thức ra mắt tai nghe chống ồn ANC Everyday Pro thế hệ mới",
    summary:
      "Dòng tai nghe chụp tai hàng đầu của RYVO nâng cấp công nghệ chống ồn chủ động Hybrid ANC 35dB, thời lượng pin 45 giờ cùng chất âm cân bằng chuyên nghiệp.",
    content: "Chi tiết...",
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
    content: "Chi tiết...",
    thumbnail: "/sites/raycon/images/open-audio-lifestyle.png",
    category: "cong-nghe-am-thanh",
    author: "Kỹ Sư Âm Học RYVO",
    views: 245,
    isPublished: true,
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    slug: "huong-dan-chon-profile-am-thanh-pure-balanced-bass",
    title: "Hướng dẫn chọn 3 chế độ âm thanh: Pure Sound, Balanced Sound & Bass Boost",
    summary:
      "Làm chủ 3 profile âm thanh độc quyền tích hợp sẵn trên tai nghe RYVO chỉ với một chạm để tối ưu cho từng thể loại nhạc và podcast.",
    content: "Chi tiết...",
    thumbnail: "/sites/raycon/images/earbuds-lifestyle.png",
    category: "tin-tuc",
    author: "Ban Biên Tập RYVO",
    views: 310,
    isPublished: true,
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function HomeNews() {
  let articles: Article[] = [];
  try {
    const data = await getArticles({ limit: 3 });
    articles = data && data.length > 0 ? data.slice(0, 3) : FALLBACK_NEWS;
  } catch {
    articles = FALLBACK_NEWS;
  }

  return (
    <section className="bg-[#fafbfc] py-16 md:py-24 border-t border-navy/5">
      <div className="raycon-container">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-royal uppercase">
              <Sparkles className="size-3.5 text-[#ffb13b]" />
              <span>RYVO Stories</span>
            </div>
            <h2 className="mt-1 text-2xl md:text-4xl font-extrabold text-navy tracking-tight">
              Tin Tức & Sự Kiện Mới Nhất
            </h2>
            <p className="mt-2 text-xs md:text-sm text-navy/60 max-w-xl">
              Cập nhật các bước tiến công nghệ âm thanh, sự kiện ra mắt độc quyền và mẹo sử dụng thiết bị hiệu quả từ RYVO.
            </p>
          </div>

          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-xs font-bold text-royal hover:underline self-start md:self-auto cursor-pointer"
          >
            <span>Xem tất cả tin tức</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>

        {/* 3 Articles Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {articles.map((article) => {
            const catInfo = CATEGORY_MAP[article.category] || {
              label: article.category,
              badgeClass: "bg-gray-100 text-gray-700 border-gray-200",
            };
            const formattedDate = new Date(
              article.createdAt || article.publishedAt,
            ).toLocaleDateString("vi-VN");

            return (
              <article
                key={article.id}
                className="group flex flex-col overflow-hidden rounded-3xl border border-navy/10 bg-white shadow-xs hover:shadow-lg hover:border-royal/30 transition-all duration-300"
              >
                {/* Thumbnail */}
                <Link
                  href={`/news/${article.slug}`}
                  className="aspect-16/10 w-full overflow-hidden bg-[#e8f7ff] p-4 flex items-center justify-center shrink-0 border-b border-navy/5"
                >
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
                </Link>

                {/* Content */}
                <div className="flex flex-1 flex-col p-5 md:p-6 justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase ${catInfo.badgeClass}`}
                      >
                        <Tag className="size-2.5 mr-1" />
                        {catInfo.label}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-navy/40">
                        <Calendar className="size-3" />
                        {formattedDate}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-navy leading-snug line-clamp-2 group-hover:text-royal transition-colors">
                      <Link href={`/news/${article.slug}`}>
                        {article.title}
                      </Link>
                    </h3>

                    <p className="text-xs text-navy/70 line-clamp-2 leading-relaxed">
                      {article.summary}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-navy/5">
                    <Link
                      href={`/news/${article.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-royal hover:underline"
                    >
                      <span>Đọc tiếp</span>
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

