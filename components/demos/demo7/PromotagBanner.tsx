import Image from "@/components/ui/FallbackImage";
import type { BannerRecord } from "@/types/cms";

interface Props {
  banners: BannerRecord[];
}

/**
 * Demo7-styled promotag block. Each banner becomes a rounded, soft-shadow
 * card. Hidden by parent when no banners exist.
 */
export default function Demo7PromotagBanner({ banners }: Props) {
  if (banners.length === 0) return null;
  return (
    <section className="relative py-12 px-6">
      <div className="max-w-6xl mx-auto space-y-4">
        {banners.map((banner) => {
          const slide = banner.slides[0];
          if (!slide) return null;
          return (
            <a
              key={banner.bannerId}
              href={slide.url || "#"}
              target={slide.url ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="block relative h-44 md:h-56 rounded-[32px] overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all bg-gradient-to-br from-rose-100 to-amber-100"
            >
              <Image
                src={slide.src}
                alt="Promosi"
                fill
                className="object-cover hover:scale-[1.02] transition-transform duration-700"
                sizes="100vw"
              />
              <span className="absolute top-4 right-4 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/85 backdrop-blur text-[10px] uppercase tracking-[0.18em] font-bold text-[var(--primary)] shadow-sm">
                Promosi
              </span>
            </a>
          );
        })}
      </div>
    </section>
  );
}
