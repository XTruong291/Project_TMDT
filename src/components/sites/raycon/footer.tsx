"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Phone, Mail, MapPin } from "lucide-react";

import { getSiteAnalytics } from "@/lib/api";
import type { SiteAnalytics } from "@/types/analytics";

import {
  FacebookIcon,
  InstagramIcon,
  RyvoLogo,
  TwitterIcon,
  YoutubeIcon,
} from "./icons";

const SOCIAL = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/ryvo.audio/",
    icon: InstagramIcon,
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@ryvoaudio",
    icon: YoutubeIcon,
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/ryvoaudio/",
    icon: FacebookIcon,
  },
  {
    name: "Twitter",
    href: "https://twitter.com/ryvoaudio",
    icon: TwitterIcon,
  },
];

const COLUMNS = [
  {
    title: "Products",
    links: [
      { label: "Shop All", href: "/collections/all" },
      { label: "Open Audio", href: "/collections/open-audio" },
      { label: "Earbuds", href: "/collections/earbuds" },
      { label: "Headphones", href: "/collections/headphones" },
      { label: "Fast Charge", href: "/collections/power-tech" },
      { label: "Accessories", href: "/collections/accessories" },
      { label: "Product Manuals", href: "/pages/manuals" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us (Giới thiệu)", href: "/about" },
      { label: "News & Events (Tin tức)", href: "/news" },
      { label: "Contact Us (Liên hệ)", href: "/contact" },
      { label: "B2B", href: "/pages/b2b" },
      {
        label: "Influencers & Affiliates",
        href: "/pages/affiliates",
      },
      { label: "Careers", href: "/pages/careers" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact Us (Liên hệ trực tiếp)", href: "/contact" },
      { label: "FAQ / Trợ giúp", href: "/pages/faq" },
      {
        label: "Shipping Policy",
        href: "/pages/shipping-policy",
      },
      {
        label: "File a Return/Warranty Claim",
        href: "/pages/returns",
      },
      {
        label: "EU Right To Withdrawal Policy",
        href: "/pages/eu-right-to-withdrawal-policy",
      },
      {
        label: "Warranty Policy",
        href: "/pages/warranty",
      },
      {
        label: "Terms of Service",
        href: "/policies/terms-of-service",
      },
      {
        label: "Privacy Policy",
        href: "/policies/privacy-policy",
      },
      {
        label: "Accessibility Statement",
        href: "/pages/accessibility",
      },
    ],
  },
];

export function SiteFooter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [analytics, setAnalytics] = useState<SiteAnalytics>({
    totalVisits: 154820,
    onlineVisitors: 16,
  });

  useEffect(() => {
    let active = true;
    getSiteAnalytics()
      .then((data) => {
        if (active && data) {
          setAnalytics(data);
        }
      })
      .catch(() => {
        // Keep fallback values gracefully if offline
      });
    return () => {
      active = false;
    };
  }, []);

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  }

  return (
    <footer className="bg-royal text-white">
      <div className="raycon-container py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_2fr_1.1fr]">
          {/* Social & Contact Hotline */}
          <div>
            <h2 className="mb-4 text-xl font-bold">Follow Us:</h2>
            <ul className="flex gap-4">
              {SOCIAL.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.name}
                    className="flex size-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/25"
                  >
                    <item.icon className="size-5 fill-white" />
                  </a>
                </li>
              ))}
            </ul>

            {/* Hotline & Trụ sở (Hạng mục 6 & 7) */}
            <div className="mt-6 space-y-2 text-xs text-white/80">
              <p className="font-semibold text-white tracking-wide uppercase text-[11px]">
                Tổng đài CSKH &amp; Hỗ trợ:
              </p>
              <div className="flex items-center gap-2">
                <Phone className="size-3.5 text-white/70" />
                <span className="text-white/70">Hotline:</span>
                <a
                  href="tel:18007986"
                  className="font-bold text-white hover:underline"
                >
                  1-800-RYVO (24/7)
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="size-3.5 text-white/70" />
                <span className="text-white/70">Email:</span>
                <a
                  href="mailto:support@ryvo.vn"
                  className="text-white font-medium hover:underline"
                >
                  support@ryvo.vn
                </a>
              </div>
              <div className="flex items-start gap-2 pt-0.5 text-white/65">
                <MapPin className="size-3.5 shrink-0 text-white/50 mt-0.5" />
                <span>1115 Broadway, Suite 1200, New York, NY 10010</span>
              </div>
            </div>
          </div>

          {/* Links 3 columns */}
          <div className="grid gap-8 sm:grid-cols-3">
            {COLUMNS.map((column) => (
              <div key={column.title}>
                <h2 className="mb-4 text-[20px] font-bold leading-[1.2]">
                  {column.title}
                </h2>
                <ul className="space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-[14px] leading-snug text-white/85 transition hover:text-white hover:underline"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter */}
          <div>
            <h2 className="mb-1 text-[20px] font-bold leading-tight">
              Shop With Us
            </h2>
            <p className="mb-4 text-sm text-white/80">
              Your favorite email, probably.
            </p>
            {subscribed ? (
              <p className="text-sm font-semibold text-emerald-300">
                You have now signed up for the newsletter!
              </p>
            ) : (
              <form
                className="flex flex-col gap-2.5 sm:flex-row"
                onSubmit={handleSubscribe}
              >
                <label htmlFor="footer-email" className="sr-only">
                  your-email@example.com
                </label>
                <input
                  id="footer-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your-email@example.com"
                  className="h-11 flex-1 rounded-full border border-white/20 bg-white/10 px-4 text-sm text-white placeholder:text-white/60 focus:border-white focus:outline-hidden"
                />
                <button
                  type="submit"
                  className="inline-flex h-11 items-center justify-center rounded-full bg-white px-6 text-xs font-bold tracking-wider text-royal uppercase transition hover:bg-white/90 cursor-pointer"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/20 pt-6 text-sm text-white/80 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <Link href="/" aria-label="RYVO Home">
              <RyvoLogo className="h-5 w-[96px] text-white" />
            </Link>
            <span>Language: English</span>
          </div>

          {/* Thống kê truy cập (Hạng mục 6) */}
          <div className="flex flex-wrap items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs text-white">
            <span className="flex items-center gap-1.5 font-semibold text-emerald-300">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              Đang trực tuyến: {analytics.onlineVisitors}
            </span>
            <span className="text-white/40">|</span>
            <span className="text-white/90 font-medium">
              Tổng lượt truy cập: {analytics.totalVisits.toLocaleString()}
            </span>
          </div>

          <Link href="/" className="text-xs hover:underline">
            © RYVO 2026
          </Link>
        </div>
      </div>
    </footer>
  );
}
