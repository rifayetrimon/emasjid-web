import Link from "next/link";
import { Flame } from "lucide-react";

interface Props {
  /** The currently trending news item (typically the most recent). */
  title: string;
  href: string;
  /** Admin-controlled background color (theme.backgroundColorTrending). */
  backgroundColor?: string;
}

/**
 * Demo7-styled trending strip. Soft pastel banner with rounded badge and
 * a single-line headline link. Hidden by parent when no news exists.
 */
export default function Demo7TrendingStrip({
  title,
  href,
  backgroundColor,
}: Props) {
  return (
    <div
      className="border-b border-gray-100"
      style={{ backgroundColor: backgroundColor || "#fff7ed" }}
    >
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-3">
        <span className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white text-[10px] font-bold uppercase tracking-[0.18em] shadow-sm">
          <Flame className="w-3 h-3" />
          Trending
        </span>
        <Link
          href={href}
          className="text-sm text-gray-700 truncate hover:text-[var(--primary)] transition font-medium"
        >
          {title}
        </Link>
      </div>
    </div>
  );
}
