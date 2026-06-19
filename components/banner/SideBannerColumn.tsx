import Image from "@/components/ui/FallbackImage";
import type { BannerRecord } from "@/types/cms";

export interface SideBannerSlide {
  src: string;
  url: string;
}

// Flatten every LIVE side-banner record into a single list of slides. Each
// record can now ship up to 3 images, each with its own urllink — so we expand
// them all rather than picking only the first image per record.
export function flattenSideBanners(records: BannerRecord[]): SideBannerSlide[] {
  return records.flatMap((b) => b.slides.map((s) => ({ src: s.src, url: s.url })));
}

/**
 * The shared side-banner column. Rendered IDENTICALLY across every template
 * (matches the Blog template): a scrollable stack of all live side-banner
 * slides, each a fixed-height card with an "Iklan" label and a loading
 * skeleton. Returns null when there are no slides so callers can drop it in
 * unconditionally.
 */
export default function SideBannerColumn({
  slides,
}: {
  slides: SideBannerSlide[];
}) {
  if (slides.length === 0) return null;
  return (
    <div className="max-h-[840px] overflow-y-auto space-y-4 pr-1">
      {slides.map((b, i) => (
        <a
          key={i}
          href={b.url || "#"}
          target={b.url ? "_blank" : undefined}
          rel="noopener noreferrer"
          className="block relative h-64 overflow-hidden bg-gray-100 hover:opacity-95 transition"
        >
          <Image
            src={b.src}
            alt={`Iklan ${i + 1}`}
            fill
            showSkeleton
            className="object-cover"
            sizes="300px"
          />
          <p className="absolute bottom-2 right-2 text-[9px] uppercase tracking-wider text-white bg-black/50 px-2 py-0.5">
            Iklan
          </p>
        </a>
      ))}
    </div>
  );
}
