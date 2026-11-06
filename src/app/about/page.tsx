import Link from "next/link";
import { Metadata } from "next";
import {
  Award,
  ChevronRight,
  Headphones,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { getAboutSections } from "@/lib/api";
import type { AboutSection } from "@/types/about";
import { SafeImage } from "@/components/ui/safe-image";

export const metadata: Metadata = {
  title: "Về RYVO | Âm Thanh Thông Minh Cho Cuộc Sống Hàng Ngày",
  description:
    "Tìm hiểu về câu chuyện thương hiệu RYVO, sứ mệnh phổ cập âm thanh không dây cao cấp và các giá trị cốt lõi mang lại trải nghiệm âm nhạc đỉnh cao.",
};

export const dynamic = "force-dynamic";

const DEFAULT_SECTIONS: AboutSection[] = [
  {
    id: 1,
    title: "RYVO Audio - Kỷ nguyên Âm thanh Không dây Thông minh",
    category: "company_overview",
    content:
      "Được sáng lập với niềm đam mê âm học hiện đại cùng các chuyên gia hàng đầu ngành âm thanh, RYVO ra đời với sứ mệnh xóa bỏ rào cản giá cả đối với các thiết bị âm thanh không dây cao cấp. Chúng tôi tin rằng âm thanh tuyệt hảo không nhất thiết phải đi kèm mức giá xa xỉ, mà phải đồng hành cùng nhịp sống hàng ngày của tất cả mọi người.",
    imageUrl: "/sites/raycon/images/earbuds-lifestyle.png",
    isVisible: true,
    sortOrder: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Hệ sinh thái Sản phẩm & Dịch vụ Âm thanh RYVO",
    category: "products_services",
    content:
      "RYVO cung cấp dải sản phẩm hoàn chỉnh phục vụ cuộc sống năng động: từ dòng tai nghe nhét tai True Wireless siêu nhỏ gọn (Everyday Earbuds), tai nghe truyền âm qua xương (Bone Conduction), tai nghe chụp tai chống ồn chủ động (Everyday Headphones ANC) cho tới cáp sạc nhanh đa năng Magic Spin. Mọi sản phẩm đều đi kèm chính sách đổi trả 30 ngày và bảo hành chính hãng 1 năm.",
    imageUrl: "/sites/raycon/images/E25_BLA_IMG1.png",
    isVisible: true,
    sortOrder: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: "Tầm nhìn & Sứ mệnh Thương hiệu",
    category: "mission_vision",
    content:
      "Sứ mệnh của chúng tôi là truyền cảm hứng cho những con người bận rộn, người sáng tạo và thế hệ trẻ vươn tới mục tiêu mỗi ngày bằng âm thanh giàu năng lượng. Tầm nhìn 2030: Trở thành thương hiệu âm thanh cá nhân số 1 về trải nghiệm người dùng thực tế và độ bền bỉ trong phân khúc dưới 3.500.000₫.",
    imageUrl: "/sites/raycon/images/open-audio-lifestyle.png",
    isVisible: true,
    sortOrder: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default async function AboutPage() {
  let sections: AboutSection[] = [];
  try {
    sections = await getAboutSections();
  } catch {
    sections = [];
  }

  if (!sections || sections.length === 0) {
    sections = DEFAULT_SECTIONS;
  }

  // Filter only visible sections
  const visibleSections = sections.filter((s) => s.isVisible !== false);

  const overviewSections = visibleSections.filter(
    (s) => s.category === "company_overview",
  );
  const productServiceSections = visibleSections.filter(
    (s) => s.category === "products_services",
  );
  const missionVisionSections = visibleSections.filter(
    (s) => s.category === "mission_vision",
  );

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
            <span className="text-navy font-semibold">Giới thiệu</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[linear-gradient(115deg,#0d1163_0%,#1a1db6_50%,#2d50ed_100%)] text-white py-16 md:py-24">
        <div className="raycon-container relative z-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold tracking-wider uppercase backdrop-blur-xs mb-5">
            <Sparkles className="size-3.5 text-[#ffb13b]" />
            <span>Câu chuyện Thương hiệu</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Âm Thanh Đích Thực Cho Cuộc Sống Hàng Ngày
          </h1>
          <p className="mt-4 text-base md:text-lg text-white/85 leading-relaxed">
            Chúng tôi tin rằng âm thanh cao cấp không nên là đặc quyền xa xỉ. RYVO được sinh ra để tiếp sức cho mọi khoảnh khắc: khi làm việc, tập luyện, hay thư giãn.
          </p>
        </div>
      </section>

      {/* Metric Highlights Strip */}
      <section className="border-y border-navy/10 bg-white py-8">
        <div className="raycon-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <p className="text-3xl md:text-4xl font-extrabold text-royal">2.000.000+</p>
              <p className="text-xs font-semibold text-navy/60 uppercase">Khách hàng tin dùng</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl md:text-4xl font-extrabold text-royal">40+ Giờ</p>
              <p className="text-xs font-semibold text-navy/60 uppercase">Thời lượng pin bền bỉ</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl md:text-4xl font-extrabold text-royal">10.000+</p>
              <p className="text-xs font-semibold text-navy/60 uppercase">Giờ thử nghiệm âm học</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl md:text-4xl font-extrabold text-royal">30 Ngày</p>
              <p className="text-xs font-semibold text-navy/60 uppercase">Dùng thử 100% rủi ro bằng 0</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Sections (Grouped by Category) */}
      <div className="raycon-container py-12 md:py-20 space-y-16 md:space-y-24">
        {/* 1. Tổng quan công ty */}
        {overviewSections.length > 0 && (
          <div className="space-y-10">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold tracking-widest text-royal uppercase">
                Khởi nguồn thương hiệu
              </span>
              <h2 className="mt-1 text-2xl md:text-3xl font-extrabold text-navy">
                Tổng Quan Về RYVO
              </h2>
            </div>

            <div className="grid gap-8">
              {overviewSections.map((sec, idx) => (
                <div
                  key={sec.id}
                  className={`flex flex-col md:flex-row items-center gap-8 md:gap-12 rounded-3xl bg-white p-6 md:p-10 border border-navy/5 shadow-xs ${
                    idx % 2 === 1 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {sec.imageUrl && (
                    <div className="w-full md:w-1/2 aspect-video md:aspect-4/3 overflow-hidden rounded-2xl bg-[#e8f7ff] p-4 flex items-center justify-center shrink-0">
                      <SafeImage
                        src={sec.imageUrl}
                        alt={sec.title}
                        fallbackSrc="/sites/raycon/images/earbuds-lifestyle.png"
                        className="size-full object-contain hover:scale-105 transition-transform duration-300 drop-shadow-md"
                      />
                    </div>
                  )}
                  <div className="w-full md:w-1/2 space-y-4">
                    <span className="inline-block rounded-md bg-royal/10 text-royal px-2.5 py-1 text-xs font-bold uppercase">
                      Lịch sử phát triển
                    </span>
                    <h3 className="text-xl md:text-2xl font-bold text-navy leading-snug">
                      {sec.title}
                    </h3>
                    <p className="text-sm md:text-base text-navy/75 leading-relaxed whitespace-pre-line">
                      {sec.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. Sản phẩm & Dịch vụ */}
        {productServiceSections.length > 0 && (
          <div className="space-y-10">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold tracking-widest text-royal uppercase">
                Giải pháp công nghệ
              </span>
              <h2 className="mt-1 text-2xl md:text-3xl font-extrabold text-navy">
                Sản Phẩm & Dịch Vụ Của Chúng Tôi
              </h2>
            </div>

            <div className="grid gap-8">
              {productServiceSections.map((sec, idx) => (
                <div
                  key={sec.id}
                  className={`flex flex-col md:flex-row items-center gap-8 md:gap-12 rounded-3xl bg-white p-6 md:p-10 border border-navy/5 shadow-xs ${
                    idx % 2 === 1 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {sec.imageUrl && (
                    <div className="w-full md:w-1/2 aspect-video md:aspect-4/3 overflow-hidden rounded-2xl bg-[#e8f7ff] p-4 flex items-center justify-center shrink-0">
                      <SafeImage
                        src={sec.imageUrl}
                        alt={sec.title}
                        fallbackSrc="/sites/raycon/images/earbuds-lifestyle.png"
                        className="size-full object-contain hover:scale-105 transition-transform duration-300 drop-shadow-md"
                      />
                    </div>
                  )}
                  <div className="w-full md:w-1/2 space-y-4">
                    <span className="inline-block rounded-md bg-emerald-50 text-emerald-700 px-2.5 py-1 text-xs font-bold uppercase">
                      Sản phẩm & Dịch vụ
                    </span>
                    <h3 className="text-xl md:text-2xl font-bold text-navy leading-snug">
                      {sec.title}
                    </h3>
                    <p className="text-sm md:text-base text-navy/75 leading-relaxed whitespace-pre-line">
                      {sec.content}
                    </p>
                    <div className="pt-2">
                      <Link
                        href="/collections/all"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-royal hover:underline"
                      >
                        Khám phá tất cả sản phẩm →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Sứ mệnh & Tầm nhìn */}
        {missionVisionSections.length > 0 && (
          <div className="space-y-10">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold tracking-widest text-royal uppercase">
                Định hướng tương lai
              </span>
              <h2 className="mt-1 text-2xl md:text-3xl font-extrabold text-navy">
                Sứ Mệnh & Tầm Nhìn Chiến Lược
              </h2>
            </div>

            <div className="grid gap-8">
              {missionVisionSections.map((sec, idx) => (
                <div
                  key={sec.id}
                  className={`flex flex-col md:flex-row items-center gap-8 md:gap-12 rounded-3xl bg-white p-6 md:p-10 border border-navy/5 shadow-xs ${
                    idx % 2 === 1 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {sec.imageUrl && (
                    <div className="w-full md:w-1/2 aspect-video md:aspect-4/3 overflow-hidden rounded-2xl bg-[#e8f7ff] p-4 flex items-center justify-center shrink-0">
                      <SafeImage
                        src={sec.imageUrl}
                        alt={sec.title}
                        fallbackSrc="/sites/raycon/images/earbuds-lifestyle.png"
                        className="size-full object-contain hover:scale-105 transition-transform duration-300 drop-shadow-md"
                      />
                    </div>
                  )}
                  <div className="w-full md:w-1/2 space-y-4">
                    <span className="inline-block rounded-md bg-purple-50 text-purple-700 px-2.5 py-1 text-xs font-bold uppercase">
                      Tầm nhìn 2030
                    </span>
                    <h3 className="text-xl md:text-2xl font-bold text-navy leading-snug">
                      {sec.title}
                    </h3>
                    <p className="text-sm md:text-base text-navy/75 leading-relaxed whitespace-pre-line">
                      {sec.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Core Values 4-Grid */}
        <div className="rounded-3xl bg-white border border-navy/10 p-8 md:p-12">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-navy">
              Giá Trị Cốt Lõi RYVO
            </h2>
            <p className="mt-2 text-xs md:text-sm text-navy/60">
              4 nguyên tắc vàng định hình từng sản phẩm chúng tôi tạo ra
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-navy/5 bg-[#fafbfc] p-6 space-y-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-royal/10 text-royal">
                <Headphones className="size-6" />
              </div>
              <h4 className="text-base font-bold text-navy">Chất Âm Signature</h4>
              <p className="text-xs text-navy/70 leading-relaxed">
                Tinh chỉnh bởi các nghệ sĩ và kỹ sư hàng đầu, mang lại âm bass đầm ấm và giọng hát sắc nét.
              </p>
            </div>

            <div className="rounded-2xl border border-navy/5 bg-[#fafbfc] p-6 space-y-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Zap className="size-6" />
              </div>
              <h4 className="text-base font-bold text-navy">Thiết Kế Công Thái Học</h4>
              <p className="text-xs text-navy/70 leading-relaxed">
                Kích thước siêu nhỏ gọn, vừa khít vòm tai, không đau nhức ngay cả khi đeo liên tục nhiều giờ.
              </p>
            </div>

            <div className="rounded-2xl border border-navy/5 bg-[#fafbfc] p-6 space-y-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <Award className="size-6" />
              </div>
              <h4 className="text-base font-bold text-navy">Giá Trị Thực Dụng</h4>
              <p className="text-xs text-navy/70 leading-relaxed">
                Đem đến chất lượng vượt trội so với tầm giá, loại bỏ mọi chi phí tiếp thị trung gian thừa thãi.
              </p>
            </div>

            <div className="rounded-2xl border border-navy/5 bg-[#fafbfc] p-6 space-y-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <HeartHandshake className="size-6" />
              </div>
              <h4 className="text-base font-bold text-navy">Tận Tâm Phục Vụ</h4>
              <p className="text-xs text-navy/70 leading-relaxed">
                Đổi trả trong 30 ngày không lý do, bảo hành chính hãng 1 đổi 1 và hỗ trợ kỹ thuật tận tâm.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="rounded-3xl bg-[linear-gradient(135deg,#121886_0%,#2827cd_100%)] p-8 md:p-12 text-center text-white space-y-5">
          <ShieldCheck className="size-12 mx-auto text-[#ffb13b]" />
          <h3 className="text-2xl md:text-3xl font-extrabold">
            Sẵn Sàng Nâng Tầm Trải Nghiệm Âm Nhạc?
          </h3>
          <p className="text-sm md:text-base text-white/80 max-w-xl mx-auto">
            Gia nhập cộng đồng hơn 2 triệu người dùng RYVO trên toàn cầu. Mua ngay hôm nay với chính sách miễn phí vận chuyển cho đơn hàng từ 500.000₫.
          </p>
          <div className="pt-2">
            <Link
              href="/collections/all"
              className="inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-xs font-bold uppercase tracking-wider text-navy shadow-md hover:bg-gray-100 transition-all cursor-pointer"
            >
              Khám Phá Các Bộ Sưu Tập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

