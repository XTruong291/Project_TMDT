"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

interface Slide {
  id: number;
  badge: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
  secondaryText?: string;
  secondaryHref?: string;
  bgGradient: string;
  image: string;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    badge: "Holiday Special · Giảm 20%",
    title: "Before the rush starts.",
    subtitle: "Sở hữu ngay chất âm đỉnh cao trước mùa lễ hội với các dòng sản phẩm RYVO bán chạy nhất.",
    ctaText: "Khám Phá Ưu Đãi",
    ctaHref: "/collections/special",
    secondaryText: "Tất cả sản phẩm",
    secondaryHref: "/collections/all",
    bgGradient: "from-[#0d1163] via-[#1a1db6] to-[#2d50ed]",
    image: "/sites/raycon/images/E25_DESKTOP_48e0dc56-5fe6-4d9b-80e7-216f9fe86594.png",
  },
  {
    id: 2,
    badge: "Công Nghệ Chống Ồn Hybrid ANC 35dB",
    title: "Tập Trung Tuyệt Đối. Nhẹ Êm Cả Ngày.",
    subtitle: "Everyday Headphones ANC — Thời lượng pin 45 giờ, đệm tai công thái học thoáng khí cho giới văn phòng và di chuyển.",
    ctaText: "Mua Dòng Headphones",
    ctaHref: "/collections/headphones",
    secondaryText: "Xem chi tiết",
    secondaryHref: "/products/the-everyday-headphones",
    bgGradient: "from-[#0b1736] via-[#152347] to-[#1e3a8a]",
    image: "/sites/raycon/images/headphones-lifestyle.png",
  },
  {
    id: 3,
    badge: "Đột Phá Open Ear & Truyền Âm Qua Xương",
    title: "Cảm Nhận Nhịp Điệu. Làm Chủ Không Gian.",
    subtitle: "Bone Conduction & Open Audio — Giữ ống tai thông thoáng, an toàn tuyệt đối khi chạy bộ và tập luyện thể thao.",
    ctaText: "Khám Phá Open Audio",
    ctaHref: "/collections/open-audio",
    secondaryText: "Tìm hiểu công nghệ",
    secondaryHref: "/news/cong-nghe-truyen-am-qua-xuong-bone-conduction-hoat-dong-the-nao",
    bgGradient: "from-[#111827] via-[#1e293b] to-[#0f172a]",
    image: "/sites/raycon/images/open-audio-lifestyle.png",
  },
];

export function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  function prevSlide() {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }

  function nextSlide() {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  }

  const slide = SLIDES[currentSlide];

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative overflow-hidden bg-[#1a1db6] select-none"
    >
      {/* Background Image with Fade Effect */}
      {SLIDES.map((s, idx) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={s.image}
            alt={s.title}
            className="size-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/60 to-transparent md:via-navy/40" />
        </div>
      ))}

      {/* Slide Content */}
      <div className="raycon-container relative z-10 flex min-h-[520px] flex-col justify-center py-16 md:min-h-[620px] md:py-24">
        <div className="max-w-[620px] text-white space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1 text-xs font-bold tracking-wider uppercase text-white backdrop-blur-md">
            <Sparkles className="size-3.5 text-[#ffb13b]" />
            <span>{slide.badge}</span>
          </div>

          <h1 className="text-[34px] leading-[1.15] font-black tracking-tight md:text-[52px] md:leading-[58px] drop-shadow-sm">
            {slide.title}
          </h1>

          <p className="max-w-[500px] text-sm leading-relaxed text-white/90 md:text-base drop-shadow-xs">
            {slide.subtitle}
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-3">
            <Link
              href={slide.ctaHref}
              className="inline-flex h-[48px] items-center justify-center rounded-full bg-white px-8 text-xs font-bold tracking-wider text-royal uppercase transition duration-200 hover:bg-[#f3f4f6] hover:shadow-lg cursor-pointer"
            >
              {slide.ctaText}
            </Link>

            {slide.secondaryText && slide.secondaryHref && (
              <Link
                href={slide.secondaryHref}
                className="inline-flex h-[48px] items-center justify-center rounded-full border-2 border-white/40 bg-white/10 px-6 text-xs font-bold tracking-wider text-white uppercase backdrop-blur-sm transition duration-200 hover:bg-white/20 hover:border-white cursor-pointer"
              >
                {slide.secondaryText}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Slider Controls: Arrows */}
      <button
        type="button"
        onClick={prevSlide}
        aria-label="Slide trước"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex size-11 items-center justify-center rounded-full bg-navy/40 text-white backdrop-blur-md hover:bg-navy/70 transition-all cursor-pointer hidden sm:flex border border-white/10"
      >
        <ChevronLeft className="size-6" />
      </button>

      <button
        type="button"
        onClick={nextSlide}
        aria-label="Slide tiếp theo"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex size-11 items-center justify-center rounded-full bg-navy/40 text-white backdrop-blur-md hover:bg-navy/70 transition-all cursor-pointer hidden sm:flex border border-white/10"
      >
        <ChevronRight className="size-6" />
      </button>

      {/* Dots Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5 bg-navy/40 px-3.5 py-1.5 rounded-full backdrop-blur-md border border-white/10">
        {SLIDES.map((s, idx) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setCurrentSlide(idx)}
            aria-label={`Chuyển tới slide ${idx + 1}`}
            className={`transition-all cursor-pointer rounded-full ${
              idx === currentSlide
                ? "w-7 h-2 bg-white"
                : "size-2 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
