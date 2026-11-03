import Link from "next/link";

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-[#1a1db6]">
      {/* Background Image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/sites/raycon/images/E25_DESKTOP_48e0dc56-5fe6-4d9b-80e7-216f9fe86594.png"
        alt="Before the rush starts."
        className="pointer-events-none absolute inset-0 size-full object-cover object-center"
      />

      <div className="raycon-container relative z-10 flex min-h-[500px] flex-col justify-center py-16 md:min-h-[600px] md:py-24">
        <div className="max-w-[580px] text-white">
          <h1 className="text-[36px] leading-[1.12] font-bold tracking-[-0.015em] md:text-[48px] md:leading-[55px]">
            Before the rush starts.
          </h1>
          <p className="mt-4 max-w-[460px] text-base leading-snug text-white/90 md:text-[18px]">
            Get ahead on the easiest decision of the season.
          </p>
          <Link
            href="/collections/special"
            className="mt-8 inline-flex h-[48px] items-center justify-center rounded-full bg-white px-8 text-sm font-bold tracking-[0.06em] text-royal uppercase transition duration-200 hover:bg-[#f9f9f9] hover:shadow-md"
          >
            Shop The Sale
          </Link>
        </div>
      </div>
    </section>
  );
}
