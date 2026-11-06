import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  Calendar,
  ChevronRight,
  Eye,
  Tag,
  User,
  ArrowLeft,
} from "lucide-react";
import { getArticleDetail, getArticles } from "@/lib/api";
import type { Article } from "@/types/article";
import { ArticleShareBar } from "./share-bar";
import { SafeImage } from "@/components/ui/safe-image";

interface ArticleDetailPageProps {
  params: Promise<{ slug: string }>;
}

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

export async function generateMetadata({
  params,
}: ArticleDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const article = await getArticleDetail(slug);
    return {
      title: `${article.title} | Raycon News`,
      description: article.summary,
    };
  } catch {
    return {
      title: "Tin Tức Raycon",
    };
  }
}

export default async function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const { slug } = await params;

  let article;
  try {
    article = await getArticleDetail(slug);
  } catch {
    notFound();
  }

  // Fetch related articles
  let relatedArticles: Article[] = [];
  try {
    const all = await getArticles({ limit: 4 });
    relatedArticles = all.filter((a) => a.id !== article.id).slice(0, 3);
  } catch {
    relatedArticles = [];
  }

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
    <div className="min-h-screen bg-[#fafbfc] pb-16">
      {/* Breadcrumb Navigation */}
      <div className="border-b border-navy/5 bg-white">
        <div className="raycon-container py-3">
          <nav className="flex items-center gap-1.5 text-xs text-navy/60 font-medium">
            <Link href="/" className="hover:text-royal transition-colors">
              Trang chủ
            </Link>
            <ChevronRight className="size-3.5 text-navy/40" />
            <Link href="/news" className="hover:text-royal transition-colors">
              Tin tức & Sự kiện
            </Link>
            <ChevronRight className="size-3.5 text-navy/40" />
            <span className="text-navy font-semibold line-clamp-1 max-w-xs sm:max-w-md">
              {article.title}
            </span>
          </nav>
        </div>
      </div>

      {/* Main Article Container */}
      <div className="raycon-container pt-8 md:pt-12">
        <article className="max-w-3xl mx-auto bg-white rounded-3xl border border-navy/10 p-6 md:p-12 shadow-xs">
          {/* Back link */}
          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-navy/60 hover:text-royal transition mb-6"
          >
            <ArrowLeft className="size-3.5" />
            <span>Quay lại danh sách tin tức</span>
          </Link>

          {/* Category Badge & Meta */}
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex items-center rounded-md border px-3 py-1 text-xs font-bold uppercase tracking-wider ${catInfo.badgeClass}`}
            >
              <Tag className="size-3 mr-1" />
              {catInfo.label}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-navy/50 font-medium">
              <Calendar className="size-3.5" />
              {formattedDate}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-navy/50 font-medium">
              <Eye className="size-3.5" />
              {article.views || 0} lượt đọc
            </span>
          </div>

          {/* Title */}
          <h1 className="mt-4 text-2xl md:text-4xl font-black text-navy leading-tight">
            {article.title}
          </h1>

          {/* Author snippet */}
          <div className="mt-4 flex items-center gap-2.5 pb-6 border-b border-navy/10">
            <div className="flex size-9 items-center justify-center rounded-full bg-royal/10 text-royal font-bold text-xs">
              <User className="size-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-navy">{article.author}</p>
              <p className="text-[10px] text-navy/50">Ban Biên Tập Raycon Official</p>
            </div>
          </div>

          {/* Summary Lead Box */}
          <div className="mt-6 rounded-2xl bg-royal/5 border border-royal/15 p-4 md:p-5">
            <p className="text-sm md:text-base font-semibold text-navy/90 leading-relaxed italic">
              &ldquo;{article.summary}&rdquo;
            </p>
          </div>

          {/* Featured Image */}
          {article.thumbnail && (
            <div className="mt-8 aspect-video w-full overflow-hidden rounded-2xl bg-[#e8f7ff] p-6 flex items-center justify-center border border-navy/5">
              <SafeImage
                src={article.thumbnail}
                alt={article.title}
                fallbackSrc="/sites/raycon/images/earbuds-lifestyle.png"
                className="size-full object-contain drop-shadow-md"
              />
            </div>
          )}

          {/* Full Content */}
          <div className="mt-8 space-y-5 text-sm md:text-base text-navy/80 leading-relaxed whitespace-pre-line border-b border-navy/10 pb-8">
            {article.content}
          </div>

          {/* Social Share Bar */}
          <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <span className="text-xs font-bold uppercase tracking-wider text-navy/60">
              Chia sẻ bài viết này:
            </span>
            <ArticleShareBar title={article.title} />
          </div>
        </article>

        {/* Related Articles (Tin liên quan) */}
        {relatedArticles.length > 0 && (
          <div className="max-w-3xl mx-auto mt-16">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-navy">
                Tin Liên Quan
              </h3>
              <Link
                href="/news"
                className="text-xs font-bold text-royal hover:underline"
              >
                Xem tất cả →
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {relatedArticles.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/news/${rel.slug}`}
                  className="group flex flex-col rounded-2xl border border-navy/10 bg-white p-4 transition-all hover:border-royal/30 hover:shadow-xs"
                >
                  <div className="aspect-16/10 w-full overflow-hidden rounded-xl bg-[#e8f7ff] p-2 flex items-center justify-center mb-3">
                    {rel.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={rel.thumbnail}
                        alt=""
                        className="size-full object-contain group-hover:scale-105 transition-transform drop-shadow-xs"
                      />
                    ) : null}
                  </div>
                  <h4 className="text-xs font-bold text-navy line-clamp-2 group-hover:text-royal transition-colors leading-snug">
                    {rel.title}
                  </h4>
                  <span className="mt-auto pt-2 text-[10px] text-navy/40">
                    {new Date(rel.createdAt || rel.publishedAt).toLocaleDateString("vi-VN")}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
