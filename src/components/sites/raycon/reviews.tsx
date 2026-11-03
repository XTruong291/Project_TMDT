import { reviews } from "@/data/products";
import { cn } from "@/lib/utils";

import { StarIcon } from "./icons";

const TINT = {
  cyan: "bg-[#e4f6ff]",
  peach: "bg-[#fde8e4]",
  lilac: "bg-[#eee6ff]",
};

export function Reviews() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="raycon-container">
        <p className="text-xs font-bold tracking-[0.16em] text-royal uppercase">
          Loved Out Loud
        </p>
        <h2 className="mt-2 text-[30px] font-bold tracking-[-0.02em] text-navy md:text-[44px]">
          5 Million+ and Counting
        </h2>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {reviews.map((review) => (
            <blockquote
              key={review.name}
              className={cn(
                "flex min-h-[300px] flex-col rounded-[28px] p-7 md:p-8",
                TINT[review.tint],
              )}
            >
              <div className="text-[52px] leading-none font-bold text-[#f05c56] select-none">
                “
              </div>

              <div className="my-2 flex gap-1 text-[#f05c56]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} className="size-4 fill-current" />
                ))}
              </div>

              <p className="mt-2 text-[16px] leading-relaxed font-medium text-navy/90 md:text-[17px]">
                {review.quote}
              </p>

              <footer className="mt-auto flex items-center gap-3 pt-6">
                <span className="flex size-10 items-center justify-center rounded-full bg-royal text-sm font-bold text-white shadow-xs">
                  {review.initial}
                </span>
                <div>
                  <cite className="not-italic font-bold text-sm text-navy">
                    {review.name}
                  </cite>
                  {review.verified ? (
                    <p className="text-xs text-navy/60">Verified Buyer</p>
                  ) : null}
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
