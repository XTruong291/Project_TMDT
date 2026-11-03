"use client";

import { useState } from "react";

import {
  FacebookIcon,
  InstagramIcon,
  RayconLogo,
  TwitterIcon,
  YoutubeIcon,
} from "./icons";

const SOCIAL = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/raycon/",
    icon: InstagramIcon,
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/c/Raycon",
    icon: YoutubeIcon,
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/RayconGlobal/",
    icon: FacebookIcon,
  },
  {
    name: "Twitter",
    href: "https://twitter.com/raycon",
    icon: TwitterIcon,
  },
];

const COLUMNS = [
  {
    title: "Products",
    links: [
      { label: "Shop All", href: "https://rayconglobal.com/collections/all" },
      { label: "Open Audio", href: "https://rayconglobal.com/collections/open-audio" },
      { label: "Earbuds", href: "https://rayconglobal.com/collections/earbuds" },
      { label: "Headphones", href: "https://rayconglobal.com/collections/headphones" },
      { label: "Fast Charge", href: "https://rayconglobal.com/collections/power-tech" },
      { label: "Accessories", href: "https://rayconglobal.com/collections/accessories" },
      { label: "Product Manuals", href: "https://rayconglobal.com/pages/manuals" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "https://rayconglobal.com/pages/about" },
      { label: "B2B", href: "https://rayconglobal.com/pages/b2b" },
      {
        label: "Influencers & Affiliates",
        href: "https://rayconglobal.com/pages/affiliates",
      },
      { label: "Careers", href: "https://rayconglobal.com/pages/careers" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "FAQ / Contact Us", href: "https://rayconglobal.com/pages/faq" },
      {
        label: "Shipping Policy",
        href: "https://rayconglobal.com/pages/shipping-policy",
      },
      {
        label: "File a Return/Warranty Claim",
        href: "https://rayconglobal.com/pages/returns",
      },
      {
        label: "EU Right To Withdrawal Policy",
        href: "https://rayconglobal.com/pages/eu-right-to-withdrawal-policy",
      },
      {
        label: "Warranty Policy",
        href: "https://rayconglobal.com/pages/warranty",
      },
      {
        label: "Terms of Service",
        href: "https://rayconglobal.com/policies/terms-of-service",
      },
      {
        label: "Privacy Policy",
        href: "https://rayconglobal.com/policies/privacy-policy",
      },
      {
        label: "Accessibility Statement",
        href: "https://rayconglobal.com/pages/accessibility",
      },
    ],
  },
];

export function SiteFooter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

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
          {/* Social */}
          <div>
            <h2 className="mb-4 text-xl font-bold">Follow Us:</h2>
            <ul className="flex gap-4">
              {SOCIAL.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    aria-label={item.name}
                    className="flex size-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/25"
                  >
                    <item.icon className="size-5 fill-white" />
                  </a>
                </li>
              ))}
            </ul>
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
                      <a
                        href={link.href}
                        className="text-[14px] leading-snug text-white/85 transition hover:text-white hover:underline"
                      >
                        {link.label}
                      </a>
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
                  className="inline-flex h-11 items-center justify-center rounded-full bg-white px-6 text-xs font-bold tracking-wider text-royal uppercase transition hover:bg-white/90"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/20 pt-6 text-sm text-white/80 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <RayconLogo className="h-5 w-[96px] text-white" />
            <span>Language: English</span>
          </div>
          <a href="https://rayconglobal.com/" className="text-xs hover:underline">
            © RAYCON 2026
          </a>
        </div>
      </div>
    </footer>
  );
}
