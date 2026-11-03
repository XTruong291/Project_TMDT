export function PressPlayBanner() {
  return (
    <section className="bg-white py-4 md:py-6">
      <div className="raycon-container">
        <div className="relative overflow-hidden rounded-[20px] bg-black text-white">
          {/* Background banner image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/sites/raycon/images/HP_EVRGRN-BANNER_DESKTOP_A.png"
            alt="Press play on your day."
            className="pointer-events-none absolute inset-0 size-full object-cover object-center"
          />

          <div className="relative z-10 flex min-h-[380px] flex-col justify-center px-8 py-12 md:min-h-[480px] md:px-16 md:py-16">
            <div className="max-w-[560px]">
              <h2 className="text-[36px] leading-[1.12] font-bold md:text-[56px] md:leading-[64px]">
                Press play on
                <br />
                your day.
              </h2>
              <p className="mt-4 text-base font-medium text-white/90 md:text-[22px] md:leading-snug">
                Tech for everyday. Long battery life, easy setup, and colors that
                feel like you.
              </p>
              <a
                href="https://rayconglobal.com/collections/special"
                className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-[#4040ff] px-8 text-sm font-bold tracking-[0.06em] text-white uppercase transition hover:bg-[#3030cc]"
              >
                Shop Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
