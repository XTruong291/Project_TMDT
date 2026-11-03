import Link from "next/link";

export function AnnouncementBar() {
  return (
    <div className="bg-royal text-white">
      <Link
        href="/collections/special"
        className="flex h-9 items-center justify-center px-4 text-[13px] font-bold tracking-[0.04em] uppercase transition hover:opacity-90 md:h-10 md:text-sm"
      >
        EARLY BLACK FRIDAY: UP TO 50% OFF
      </Link>
    </div>
  );
}
