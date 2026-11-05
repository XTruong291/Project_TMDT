import Link from "next/link";

import { coreTechFeatures } from "@/data/products";

export function CoreTech() {
  const [f1, f2, f3] = coreTechFeatures;

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,#ffffff_0%,#b3e6ff_100%)] py-16 md:py-24">
      {/* Decorative background wave */}
      <div className="pointer-events-none absolute -right-[4%] -bottom-[35%] w-[48%] opacity-15 text-royal select-none">
        <svg
          viewBox="0 0 900 220"
          fill="none"
          className="w-full rotate-[-7deg]"
          aria-hidden="true"
        >
          <path
            d="M-40 160 C 80 40, 200 40, 320 160 S 560 280, 680 160 S 880 40, 980 120"
            stroke="currentColor"
            strokeWidth="46"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="raycon-container relative z-10 grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        {/* Left Column: Info & Metrics */}
        <div>
          <div className="inline-flex items-center gap-2">
            <span className="size-2 rounded-full bg-[#f05c56]" />
            <span className="text-xs font-bold tracking-[0.12em] text-royal uppercase">
              RYVO Core Tech
            </span>
          </div>

          <h2 className="mt-4 max-w-[480px] text-[32px] leading-[1.12] font-bold tracking-[-0.015em] text-royal md:text-[40px]">
            Most earbuds quit by lunch. Everyday Earbuds don’t.
          </h2>

          <Link
            href="/products/the-everyday-earbuds"
            className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-royal px-8 text-sm font-bold tracking-[0.06em] text-white uppercase transition hover:bg-[#2827cd]"
          >
            Shop Now
          </Link>

          {/* Battery Chip */}
          <div className="mt-8 inline-flex items-center gap-4 rounded-2xl border border-royal/15 bg-white/70 p-4 backdrop-blur-xs">
            <div className="max-w-[130px] text-xs leading-snug font-medium text-navy/80">
              Total playtime,
              <br />
              with the case°
            </div>
            <div className="flex items-center gap-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/sites/raycon/images/icon-battery.png"
                alt=""
                className="size-8 object-contain"
              />
              <span className="text-3xl font-bold tracking-tight text-navy">
                40 hrs
              </span>
            </div>
          </div>

          <p className="mt-3 text-xs text-navy/60">
            °Single charge lasts 8 hrs · the case adds 3 full recharges.
          </p>
        </div>

        {/* Right Column: Visual with Callouts */}
        <div className="relative flex min-h-[360px] items-center justify-center md:min-h-[460px]">
          {/* Main Earbuds Render */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/sites/raycon/images/earbuds-detail-trim.png"
            alt="Everyday Earbuds in Carbon Black"
            className="w-full max-w-[400px] object-contain drop-shadow-md"
          />

          {/* Callout 1 (Top Left) */}
          {f1 ? (
            <div className="hidden md:flex absolute top-[16%] left-[4%] max-w-[180px] flex-row-reverse items-center gap-2 text-right">
              <div className="w-12 border-t-2 border-dashed border-royal/60" />
              <div>
                <p className="text-[11px] font-bold tracking-wider text-royal uppercase">
                  {f1.label}
                </p>
                <p className="text-xs text-navy/70 leading-snug">{f1.body}</p>
              </div>
            </div>
          ) : null}

          {/* Callout 2 (Middle Right) */}
          {f2 ? (
            <div className="hidden md:flex absolute top-[40%] right-[2%] max-w-[180px] items-center gap-2 text-left">
              <div className="w-12 border-t-2 border-dashed border-royal/60" />
              <div>
                <p className="text-[11px] font-bold tracking-wider text-royal uppercase">
                  {f2.label}
                </p>
                <p className="text-xs text-navy/70 leading-snug">{f2.body}</p>
              </div>
            </div>
          ) : null}

          {/* Callout 3 (Bottom Left) */}
          {f3 ? (
            <div className="hidden md:flex absolute bottom-[18%] left-[8%] max-w-[180px] flex-row-reverse items-center gap-2 text-right">
              <div className="w-12 border-t-2 border-dashed border-royal/60" />
              <div>
                <p className="text-[11px] font-bold tracking-wider text-royal uppercase">
                  {f3.label}
                </p>
                <p className="text-xs text-navy/70 leading-snug">{f3.body}</p>
              </div>
            </div>
          ) : null}
        </div>

        {/* Mobile callouts list */}
        <div className="grid gap-3 md:hidden">
          {coreTechFeatures.map((f) => (
            <div
              key={f.label}
              className="rounded-xl border border-royal/10 bg-white/60 p-3.5"
            >
              <p className="text-xs font-bold tracking-wider text-royal uppercase">
                {f.label}
              </p>
              <p className="mt-1 text-xs text-navy/70">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
