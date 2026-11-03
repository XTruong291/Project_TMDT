import { brandStories } from "@/data/products";

export function BrandStory() {
  return (
    <section className="bg-[#e4f6ff] py-16 md:py-24">
      <div className="raycon-container">
        <h2 className="mx-auto max-w-[760px] text-center text-[32px] leading-[1.1] font-bold tracking-[-0.015em] text-royal md:text-[48px]">
          We design tech that just makes sense.
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {brandStories.map((story) => (
            <article
              key={story.title}
              className="flex flex-col overflow-hidden rounded-[28px] bg-royal p-3.5 pb-8 text-white shadow-sm"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={story.image}
                alt={story.title}
                className="aspect-square w-full rounded-[20px] bg-[#0e1488] object-cover"
              />
              <div className="px-4 pt-6 text-center">
                <h3 className="text-[22px] font-bold tracking-tight">
                  {story.title}
                </h3>
                <p className="mx-auto mt-2.5 max-w-[280px] text-sm leading-relaxed text-white/85 md:text-[15px]">
                  {story.copy}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
