import Link from "next/link";

export function ClosingCta() {
  return (
    <section className="bg-white py-4 md:py-6">
      <div className="raycon-container">
        <div className="relative overflow-hidden rounded-[20px] bg-black text-white">
          {/* Background image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/sites/raycon/images/HOMEPAGE_BOTTOMBANNER_DESKTOP_V3-compressed.png"
            alt="Ready for Whatever's Next."
            className="pointer-events-none absolute inset-0 size-full object-cover object-center"
          />

          <div className="relative z-10 flex min-h-[380px] flex-col justify-center px-8 py-12 md:min-h-[460px] md:px-16 md:py-16">
            <div className="max-w-[560px]">
              <h2 className="text-[34px] leading-[1.12] font-bold md:text-[44px] md:leading-[50px]">
                Ready for Whatever&apos;s Next.
              </h2>
              <p className="mt-4 text-base font-medium text-white/90 md:text-[20px]">
                Uncomplicated, stylish, and made to play.
              </p>
              <Link
                href="/products/bone-conduction-headphones"
                className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-[#f05c56] px-8 text-sm font-bold tracking-[0.06em] text-white uppercase transition hover:bg-[#e0524c]"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
