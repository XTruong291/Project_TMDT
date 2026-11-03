import { categories } from "@/data/products";

export function CategoryGrid() {
  return (
    <section className="bg-white py-12 md:py-16">
      <div className="raycon-container">
        <p className="text-center text-xs font-bold tracking-[0.16em] text-royal uppercase">
          Discover Your Sound
        </p>
        <h2 className="mt-2 text-center text-[32px] leading-tight font-bold md:text-[44px]">
          Shop by Category
        </h2>
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {categories.map((category) => (
            <a
              key={category.name}
              href={category.href}
              className="group block overflow-hidden rounded-[24px] bg-[#eef3f8] transition duration-200 hover:shadow-md"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={category.image}
                alt={category.name}
                className="aspect-square w-full bg-[#e8f7ff] object-cover transition duration-300 group-hover:scale-[1.04]"
              />
              <h3 className="px-3 py-4 text-center text-base font-bold text-navy md:text-lg">
                {category.name}
              </h3>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
