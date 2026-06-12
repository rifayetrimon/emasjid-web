"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "@/components/ui/FallbackImage";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselItem {
  contentId: string;
  title: string;
  message?: string;
  date: string;
  image: string | null;
  altImg1: string;
}

interface Props {
  title: string;
  items: CarouselItem[];
  large?: boolean;
}

export default function Demo8Carousel({ title, items, large = false }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const update = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [items]);

  const scroll = (dir: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    const w = el.clientWidth * 0.8;
    el.scrollBy({ left: dir * w, behavior: "smooth" });
  };

  if (items.length === 0) return null;

  return (
    <section className="py-10 md:py-14 relative">
      <div className="max-w-[1400px] mx-auto px-6 md:px-8 flex items-center justify-between mb-5">
        <h2 className="text-xl md:text-3xl font-bold text-white tracking-tight">
          {title}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll(-1)}
            disabled={!canLeft}
            className="w-10 h-10 rounded-full border border-white/20 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white flex items-center justify-center transition"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll(1)}
            disabled={!canRight}
            className="w-10 h-10 rounded-full border border-white/20 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white flex items-center justify-center transition"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="relative group">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide px-6 md:px-8 pb-4"
          style={{
            scrollbarWidth: "none",
          }}
        >
          {items.map((item, i) => (
            <Link
              key={item.contentId}
              href={`/news/detail/?id=${item.contentId}`}
              className={`group/card relative flex-shrink-0 ${
                large
                  ? "w-[300px] md:w-[420px] h-[200px] md:h-[260px]"
                  : "w-[260px] md:w-[320px] h-[160px] md:h-[200px]"
              } rounded-xl overflow-hidden bg-zinc-900 transition-all hover:scale-[1.04] hover:z-10`}
            >
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.altImg1 || item.title}
                  fill
                  className="object-cover group-hover/card:brightness-110 transition-all duration-500"
                  sizes={large ? "420px" : "320px"}
                  priority={i < 3}
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-700 to-zinc-900" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90" />
              <div className="absolute inset-0 ring-0 group-hover/card:ring-2 group-hover/card:ring-[var(--primary)]/60 rounded-xl transition-all" />

              {large && (
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[var(--primary)] text-black text-[10px] font-bold uppercase tracking-wider">
                  Pilihan
                </div>
              )}

              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                <p className="text-[10px] md:text-xs uppercase tracking-wider text-[var(--primary)] font-semibold mb-1.5">
                  {item.date}
                </p>
                <h3
                  className={`text-white font-bold leading-tight line-clamp-2 ${
                    large ? "text-lg md:text-xl" : "text-sm md:text-base"
                  }`}
                >
                  {item.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
}
