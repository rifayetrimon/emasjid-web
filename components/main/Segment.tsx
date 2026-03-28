import Image from "next/image";
import { getNewsData, HighlightNewsItem } from "@/services/newsService";
import { getCachedConfig } from "@/services/apiCache";
import InlineError from "@/components/ui/InlineError";

/**
 * Adaptive grid: first item is large (hero), rest fill a grid.
 * - 1 item: full width hero
 * - 2 items: hero left, 1 right
 * - 3 items: hero left, 2 stacked right
 * - 4 items: hero left, 3 stacked right (or 2+1)
 * - 5+ items: hero left, rest in right grid
 */

function NewsCard({
  item,
  className = "",
  priority = false,
}: {
  item: HighlightNewsItem;
  className?: string;
  priority?: boolean;
}) {
  return (
    <a
      href={`/news/${item.contentId}`}
      className={`group relative block overflow-hidden rounded-lg ${className}`}
    >
      {item.image ? (
        <Image
          src={item.image}
          alt={item.altImg1 || item.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority={priority}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900" />
      )}
      {/* Gradient overlay at bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      {/* Title */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-white font-bold text-sm md:text-base leading-snug line-clamp-3 drop-shadow-lg">
          {item.title}
        </h3>
      </div>
    </a>
  );
}

function HeroCard({ item }: { item: HighlightNewsItem }) {
  return (
    <a
      href={`/news/${item.contentId}`}
      className="group relative block overflow-hidden rounded-lg h-full min-h-[300px] md:min-h-[400px]"
    >
      {item.image ? (
        <Image
          src={item.image}
          alt={item.altImg1 || item.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority
          sizes="(max-width: 768px) 100vw, 60vw"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8">
        <h3 className="text-white font-bold text-xl md:text-2xl leading-snug line-clamp-3 drop-shadow-lg">
          {item.title}
        </h3>
      </div>
    </a>
  );
}

export default async function Segment() {
  let newsItems: HighlightNewsItem[];
  let trendingBg = "";
  try {
    const [items, configData] = await Promise.all([
      getNewsData(),
      getCachedConfig(),
    ]);
    newsItems = items;
    trendingBg = configData?.newsTrendingConfig?.backgroundColorTrending || "";
  } catch (error) {
    console.error("❌ Segment component error:", error);
    return <InlineError componentName="Makluman/Segmen" />;
  }

  if (!newsItems || newsItems.length === 0) {
    console.warn("⚠️ SEGMENT: No highlighted news items");
    return null;
  }

  const sectionStyle = { backgroundColor: trendingBg || "#f9fafb" };

  // 1 item: single full-width hero
  if (newsItems.length === 1) {
    return (
      <section className="py-10 px-6" style={sectionStyle}>
        <div className="max-w-7xl mx-auto">
          <HeroCard item={newsItems[0]} />
        </div>
      </section>
    );
  }

  const [hero, ...rest] = newsItems;

  // Layout varies by total count:
  // 2: hero left + 1 right
  // 3: hero left + 2 stacked right
  // 4: hero left + right has 1 top row, 2 bottom row
  // 5+: hero left + right grid 2 cols

  const renderRightGrid = () => {
    // 4 items: 1 on top full width, 2 on bottom row
    if (rest.length === 3) {
      return (
        <div className="grid grid-rows-2 gap-3 h-full">
          {/* Top: 1 item full width */}
          <NewsCard
            item={rest[0]}
            className="h-full"
            priority
          />
          {/* Bottom: 2 items side by side */}
          <div className="grid grid-cols-2 gap-3">
            <NewsCard item={rest[1]} className="h-full" />
            <NewsCard item={rest[2]} className="h-full" />
          </div>
        </div>
      );
    }

    // 2 rest items (3 total): stacked vertically
    if (rest.length === 2) {
      return (
        <div className="grid grid-rows-2 gap-3 h-full">
          <NewsCard item={rest[0]} className="h-full" priority />
          <NewsCard item={rest[1]} className="h-full" />
        </div>
      );
    }

    // 1 rest item (2 total): single card
    if (rest.length === 1) {
      return (
        <NewsCard item={rest[0]} className="h-full" priority />
      );
    }

    // 5+ items: 2-col grid
    return (
      <div className="grid grid-cols-2 gap-3">
        {rest.map((item, index) => (
          <NewsCard
            key={item.contentId}
            item={item}
            className="h-[180px] md:h-[200px]"
            priority={index === 0}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="py-10 px-6" style={sectionStyle}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Left: Hero */}
          <HeroCard item={hero} />

          {/* Right: Adaptive layout */}
          {renderRightGrid()}
        </div>
      </div>
    </section>
  );
}
