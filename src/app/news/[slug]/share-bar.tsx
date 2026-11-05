"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";
import { FacebookIcon, TwitterIcon } from "@/components/sites/raycon/icons";

interface ArticleShareBarProps {
  title: string;
}

export function ArticleShareBar({ title }: ArticleShareBarProps) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => {
          const url = typeof window !== "undefined" ? window.location.href : "";
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            "_blank",
          );
        }}
        className="inline-flex items-center gap-1.5 rounded-full border border-navy/15 bg-white px-3.5 py-1.5 text-xs font-semibold text-navy/80 hover:border-royal hover:text-royal transition cursor-pointer"
        title="Chia sẻ lên Facebook"
      >
        <FacebookIcon className="size-3.5 fill-current" />
        <span>Facebook</span>
      </button>

      <button
        type="button"
        onClick={() => {
          const url = typeof window !== "undefined" ? window.location.href : "";
          window.open(
            `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
            "_blank",
          );
        }}
        className="inline-flex items-center gap-1.5 rounded-full border border-navy/15 bg-white px-3.5 py-1.5 text-xs font-semibold text-navy/80 hover:border-royal hover:text-royal transition cursor-pointer"
        title="Chia sẻ lên X (Twitter)"
      >
        <TwitterIcon className="size-3.5 fill-current" />
        <span>X / Twitter</span>
      </button>

      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center gap-1.5 rounded-full border border-navy/15 bg-white px-3.5 py-1.5 text-xs font-semibold text-navy/80 hover:border-royal hover:text-royal transition cursor-pointer"
        title="Sao chép liên kết bài viết"
      >
        {copied ? (
          <>
            <Check className="size-3.5 text-emerald-600" />
            <span className="text-emerald-600 font-bold">Đã chép link!</span>
          </>
        ) : (
          <>
            <Share2 className="size-3.5" />
            <span>Sao chép link</span>
          </>
        )}
      </button>
    </div>
  );
}

