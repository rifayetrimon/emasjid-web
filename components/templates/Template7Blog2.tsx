import Image from "@/components/ui/FallbackImage";
import Link from "next/link";
import TemplateLayout from "@/components/TemplateLayout";
import BannerSlideshow from "@/components/main/BannerSlideshow";
import Blog2Faq from "@/components/demos/blog2/Faq";
import Blog2Newsletter from "@/components/demos/blog2/Newsletter";
import Blog2Contact from "@/components/demos/blog2/Contact";
import { getBannerData } from "@/services/bannerService";
import { getNewsData } from "@/services/newsService";
import { getFaqData } from "@/services/faqService";
import {
  getCachedConfig,
  getCachedNews,
  getCachedSideBanner,
} from "@/services/apiCache";
import { ArrowRight, Users, UserPlus, Bell } from "lucide-react";

interface NewsItem {
  contentId: number;
  title: string;
  message: string;
  date: string;
  file1: string | null;
  altImg1: string;
}

interface HasImage {
  image?: string | null;
  file1?: string | null;
}

function getImg(item: HasImage): string | null {
  return item?.image ?? item?.file1 ?? null;
}

function formatDate(d: string): string {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return d;
  }
}

const CATEGORIES = [
  { label: "Fashion", color: "bg-pink-500" },
  { label: "Gadgets", color: "bg-blue-500" },
  { label: "Reviews", color: "bg-emerald-500" },
  { label: "Lifestyle", color: "bg-orange-500" },
  { label: "Travel", color: "bg-purple-500" },
  { label: "Music", color: "bg-rose-500" },
  { label: "Architecture", color: "bg-amber-500" },
  { label: "Design", color: "bg-cyan-500" },
];
function cat(i: number) {
  return CATEGORIES[i % CATEGORIES.length];
}

const AUTHOR = "Pentadbir";

/* ============================================================ */
/*  Section title with yellow underline                        */
/* ============================================================ */
function BlockTitle({
  label,
  accent = "primary",
}: {
  label: string;
  accent?: "primary" | "secondary" | "red" | "green";
}) {
  const accentClass =
    accent === "secondary"
      ? "border-emerald-500"
      : accent === "red"
      ? "border-red-500"
      : accent === "green"
      ? "border-emerald-500"
      : "border-[var(--primary)]";
  return (
    <div className="mb-5 pb-2 border-b border-gray-200">
      <h2
        className={`inline-block text-sm md:text-base font-extrabold text-gray-900 uppercase tracking-wider border-b-4 ${accentClass} pb-2 -mb-[10px]`}
      >
        {label}
      </h2>
    </div>
  );
}

function Meta({ date, author = AUTHOR }: { date: string; author?: string }) {
  return (
    <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-1">
      <span className="text-gray-700 font-bold">{author}</span>
      <span>·</span>
      <span>{formatDate(date)}</span>
    </div>
  );
}

function CategoryBadge({ index }: { index: number }) {
  const c = cat(index);
  return (
    <span
      className={`inline-block px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white ${c.color}`}
    >
      {c.label}
    </span>
  );
}

/* ============================================================ */

export default async function Template7Blog2() {
  const [
    banner,
    highlighted,
    newsRaw,
    sideBannerRaw,
    faq,
    config,
  ] = await Promise.all([
    getBannerData(),
    getNewsData(),
    getCachedNews(),
    getCachedSideBanner(),
    getFaqData(),
    getCachedConfig(),
  ]);

  const footerCfg = config.footerConfig || {};
  const address = [
    footerCfg.address1,
    footerCfg.address2,
    footerCfg.city,
    footerCfg.state,
    footerCfg.postcode,
  ]
    .filter(Boolean)
    .join(", ");

  const allNews: NewsItem[] =
    newsRaw?.dataset || (Array.isArray(newsRaw) ? newsRaw : []);

  const sideBanners = (
    sideBannerRaw?.dataset || (Array.isArray(sideBannerRaw) ? sideBannerRaw : [])
  )
    .map((b: { files?: { file?: string }[]; url?: string }) => {
      const file = b.files?.find((f) => f.file && f.file.trim());
      return file ? { src: file.file as string, url: b.url || "" } : null;
    })
    .filter(Boolean) as { src: string; url: string }[];

  // Hero
  const heroFeatured = highlighted[0] || allNews[0];
  const heroSecondary = (highlighted.length > 1 ? highlighted.slice(1, 3) : allNews.slice(1, 3));
  const heroTertiary = allNews.slice(2, 4);

  // Don't Miss
  const dontMissFeatured = highlighted[0] || allNews[0];
  const dontMissList = allNews.slice(0, 4);

  // Lifestyle News
  const lifestyleGrid = allNews.slice(0, 2);
  const lifestyleList = allNews.slice(0, 4);

  // House Design
  const houseDesign = allNews.slice(0, 3);

  // Performance Training
  const performance = allNews.slice(0, 4);

  // Latest Articles
  const latestArticles = allNews.slice(0, 8);

  // Sidebar widgets data
  const makeItModern = allNews.slice(0, 4);
  const mostPopular = allNews.slice(0, 3);
  const recentComments = allNews.slice(0, 3);

  return (
    <TemplateLayout templateId="7">
      {/* ━━━━━━ TRENDING NOW STRIP ━━━━━━ */}
      {heroFeatured && (
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-center gap-4">
            <span className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1 bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Trending Now
            </span>
            <Link
              href={`/news/${heroFeatured.contentId}`}
              className="text-sm text-gray-700 truncate hover:text-[var(--primary)] transition"
            >
              {heroFeatured.title}
            </Link>
          </div>
        </div>
      )}

      {/* ━━━━━━ HERO GRID ━━━━━━ */}
      {heroFeatured && (
        <section className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Featured Big */}
            <Link
              href={`/news/${heroFeatured.contentId}`}
              className="group relative block aspect-[4/3] lg:aspect-auto overflow-hidden bg-gray-100"
            >
              {banner?.background_images?.length ? (
                <BannerSlideshow
                  media={banner.background_images}
                  interval={6500}
                />
              ) : (
                getImg(heroFeatured) && (
                  <Image
                    src={getImg(heroFeatured)}
                    alt={heroFeatured.altImg1 || heroFeatured.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width:1024px) 100vw, 50vw"
                    priority
                  />
                )
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              {banner?.overlayColor && (
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundColor: banner.overlayColor,
                    opacity: (banner.overlayOpacity || 0) / 100,
                  }}
                />
              )}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <CategoryBadge index={0} />
                <h1 className="mt-3 text-2xl md:text-3xl font-bold leading-tight line-clamp-3 group-hover:text-[var(--primary)] transition">
                  {heroFeatured.title}
                </h1>
                <div className="flex items-center gap-2 text-xs text-white/80 mt-2">
                  <span>{AUTHOR}</span>
                  <span>·</span>
                  <span>{formatDate(heroFeatured.date)}</span>
                </div>
              </div>
            </Link>

            {/* Right grid */}
            <div className="grid grid-cols-2 gap-4">
              {[...heroSecondary, ...heroTertiary].slice(0, 4).map((item, i) => {
                const img = getImg(item);
                return (
                  <Link
                    key={item.contentId}
                    href={`/news/${item.contentId}`}
                    className="group relative block aspect-[4/3] overflow-hidden bg-gray-100"
                  >
                    {img && (
                      <Image
                        src={img}
                        alt={item.altImg1 || item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width:1024px) 50vw, 25vw"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                      <CategoryBadge index={i + 1} />
                      <h3 className="mt-2 text-sm font-bold leading-snug line-clamp-2 group-hover:text-[var(--primary)] transition">
                        {item.title}
                      </h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ━━━━━━ DON'T MISS + STAY CONNECTED ━━━━━━ */}
      <section className="max-w-7xl mx-auto px-6 pb-12 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <BlockTitle label="Don't Miss" />
          {/* Decorative tabs */}
          <div className="flex flex-wrap gap-2 mb-6 -mt-2">
            {["All", "Lifestyle", "Travel", "Health & Fitness"].map((t, i) => (
              <button
                key={t}
                className={`text-[11px] uppercase tracking-wider font-bold px-3 py-1 transition ${
                  i === 0
                    ? "bg-[var(--primary)] text-gray-900"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Featured card */}
            {dontMissFeatured && (
              <Link
                href={`/news/${dontMissFeatured.contentId}`}
                className="group block"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 mb-3">
                  {getImg(dontMissFeatured) && (
                    <Image
                      src={getImg(dontMissFeatured)}
                      alt={dontMissFeatured.altImg1 || dontMissFeatured.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width:768px) 100vw, 50vw"
                    />
                  )}
                  <span className="absolute top-3 left-3">
                    <CategoryBadge index={0} />
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-[var(--primary)] transition">
                  {dontMissFeatured.title}
                </h3>
                <Meta date={dontMissFeatured.date} />
              </Link>
            )}
            {/* Right list */}
            <div className="space-y-4">
              {dontMissList.map((item) => (
                <Link
                  key={item.contentId}
                  href={`/news/${item.contentId}`}
                  className="group flex gap-3"
                >
                  <div className="relative w-24 h-20 flex-shrink-0 overflow-hidden bg-gray-100">
                    {item.file1 && (
                      <Image
                        src={item.file1}
                        alt={item.altImg1 || item.title}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-[var(--primary)] transition">
                      {item.title}
                    </h4>
                    <p className="text-[10px] text-gray-500 mt-1">
                      {formatDate(item.date)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* STAY CONNECTED */}
        <aside>
          <BlockTitle label="Stay Connected" />
          <ul className="space-y-2">
            <SocialStat
              icon={Users}
              colorClass="bg-[#1877f2]"
              count="24,856"
              label="Fans"
              cta="LIKE"
            />
            <SocialStat
              icon={UserPlus}
              colorClass="bg-sky-500"
              count="3,915"
              label="Followers"
              cta="FOLLOW"
            />
            <SocialStat
              icon={Bell}
              colorClass="bg-red-600"
              count="22,800"
              label="Subscribers"
              cta="SUBSCRIBE"
            />
          </ul>
          {sideBanners[0] && (
            <a
              href={sideBanners[0].url || "#"}
              target={sideBanners[0].url ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="mt-6 block relative h-64 overflow-hidden bg-gray-100"
            >
              <Image
                src={sideBanners[0].src}
                alt="Ad"
                fill
                className="object-cover"
                sizes="300px"
              />
              <p className="absolute bottom-2 right-2 text-[9px] uppercase tracking-wider text-white bg-black/50 px-2 py-0.5">
                Iklan
              </p>
            </a>
          )}
        </aside>
      </section>

      {/* ━━━━━━ LIFESTYLE NEWS + MAKE IT MODERN ━━━━━━ */}
      <section className="max-w-7xl mx-auto px-6 pb-12 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <BlockTitle label="Lifestyle News" accent="green" />
          <div className="flex flex-wrap gap-2 mb-6 -mt-2">
            {["All", "Travel", "Recipes", "Health & Fitness", "Music"].map(
              (t, i) => (
                <button
                  key={t}
                  className={`text-[11px] uppercase tracking-wider font-bold px-3 py-1 transition ${
                    i === 0
                      ? "bg-emerald-500 text-white"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {t}
                </button>
              )
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {lifestyleGrid.map((item, i) => (
              <Link
                key={item.contentId}
                href={`/news/${item.contentId}`}
                className="group block"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 mb-3">
                  {item.file1 && (
                    <Image
                      src={item.file1}
                      alt={item.altImg1 || item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width:1024px) 50vw, 33vw"
                    />
                  )}
                  <span className="absolute top-3 left-3">
                    <CategoryBadge index={i + 2} />
                  </span>
                </div>
                <h3 className="text-base font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-[var(--primary)] transition">
                  {item.title}
                </h3>
                <Meta date={item.date} />
                <p
                  className="text-xs text-gray-600 leading-relaxed line-clamp-2 mt-2"
                  dangerouslySetInnerHTML={{ __html: item.message }}
                />
              </Link>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 pt-6 border-t border-gray-200">
            {lifestyleList.map((item) => (
              <Link
                key={item.contentId}
                href={`/news/${item.contentId}`}
                className="group flex gap-3"
              >
                <div className="relative w-20 h-16 flex-shrink-0 overflow-hidden bg-gray-100">
                  {item.file1 && (
                    <Image
                      src={item.file1}
                      alt={item.altImg1 || item.title}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-[var(--primary)] transition">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-gray-500 mt-1">
                    {formatDate(item.date)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* MAKE IT MODERN sidebar */}
        <aside>
          <BlockTitle label="Make It Modern" />
          <ul className="space-y-3">
            {makeItModern.map((item) => (
              <li key={item.contentId}>
                <Link href={`/news/${item.contentId}`} className="group flex gap-3">
                  <div className="relative w-20 h-16 flex-shrink-0 overflow-hidden bg-gray-100">
                    {item.file1 && (
                      <Image
                        src={item.file1}
                        alt={item.altImg1 || item.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] uppercase tracking-wider text-[var(--primary)] font-bold">
                      Make It Modern
                    </span>
                    <h4 className="text-xs font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-[var(--primary)] transition">
                      {item.title}
                    </h4>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </section>

      {/* ━━━━━━ HOUSE DESIGN GRID ━━━━━━ */}
      {houseDesign.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 pb-12">
          <BlockTitle label="House Design" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {houseDesign.map((item, i) => (
              <Link
                key={item.contentId}
                href={`/news/${item.contentId}`}
                className="group block"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 mb-3">
                  {item.file1 && (
                    <Image
                      src={item.file1}
                      alt={item.altImg1 || item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width:768px) 100vw, 33vw"
                    />
                  )}
                  <span className="absolute top-3 left-3">
                    <CategoryBadge index={i + 6} />
                  </span>
                </div>
                <h3 className="text-base font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-[var(--primary)] transition">
                  {item.title}
                </h3>
                <Meta date={item.date} />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ━━━━━━ PERFORMANCE TRAINING — list with side image ━━━━━━ */}
      {performance.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 pb-12 grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <BlockTitle label="Performance Training" />
            <div className="space-y-5">
              {performance.map((item) => (
                <Link
                  key={item.contentId}
                  href={`/news/${item.contentId}`}
                  className="group flex gap-5 items-start pb-5 border-b border-gray-100 last:border-0"
                >
                  <div className="relative w-44 h-28 flex-shrink-0 overflow-hidden bg-gray-100">
                    {item.file1 && (
                      <Image
                        src={item.file1}
                        alt={item.altImg1 || item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="176px"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base md:text-lg font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-[var(--primary)] transition">
                      {item.title}
                    </h3>
                    <Meta date={item.date} />
                    <p
                      className="text-xs text-gray-600 leading-relaxed line-clamp-2 mt-2"
                      dangerouslySetInnerHTML={{ __html: item.message }}
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
          {sideBanners[1] && (
            <aside>
              <a
                href={sideBanners[1].url || "#"}
                target={sideBanners[1].url ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="block relative h-64 overflow-hidden bg-gray-100"
              >
                <Image
                  src={sideBanners[1].src}
                  alt="Ad"
                  fill
                  className="object-cover"
                  sizes="300px"
                />
                <p className="absolute bottom-2 right-2 text-[9px] uppercase tracking-wider text-white bg-black/50 px-2 py-0.5">
                  Iklan
                </p>
              </a>
            </aside>
          )}
        </section>
      )}

      {/* ━━━━━━ LATEST + MOST POPULAR + RECENT COMMENTS ━━━━━━ */}
      <section className="max-w-7xl mx-auto px-6 pb-12 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <BlockTitle label="Latest Articles" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {latestArticles.map((item, i) => (
              <Link
                key={item.contentId}
                href={`/news/${item.contentId}`}
                className="group block"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 mb-3">
                  {item.file1 && (
                    <Image
                      src={item.file1}
                      alt={item.altImg1 || item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width:768px) 100vw, 33vw"
                    />
                  )}
                  <span className="absolute top-3 left-3">
                    <CategoryBadge index={i} />
                  </span>
                </div>
                <h3 className="text-base font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-[var(--primary)] transition">
                  {item.title}
                </h3>
                <p className="text-[10px] text-gray-500 mt-1">
                  {formatDate(item.date)}
                </p>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/news"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-900 hover:bg-[var(--primary)] hover:text-gray-900 text-white text-xs font-bold uppercase tracking-wider transition"
            >
              Load More <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <aside className="space-y-8">
          {/* MOST POPULAR */}
          <div>
            <BlockTitle label="Most Popular" />
            <ol className="space-y-4">
              {mostPopular.map((item, i) => (
                <li key={item.contentId} className="flex gap-3 group">
                  <span
                    className="flex-shrink-0 text-3xl font-extrabold text-gray-200 leading-none w-8"
                  >
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] uppercase tracking-wider text-[var(--primary)] font-bold">
                      Trending
                    </span>
                    <Link
                      href={`/news/${item.contentId}`}
                      className="block mt-1"
                    >
                      <h4 className="text-xs font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-[var(--primary)] transition">
                        {item.title}
                      </h4>
                    </Link>
                    <p className="text-[10px] text-gray-500 mt-1">
                      {formatDate(item.date)}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* RECENT COMMENTS */}
          <div>
            <BlockTitle label="Recent Comments" />
            <ul className="space-y-3">
              {recentComments.map((item) => (
                <li key={item.contentId}>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    <span className="font-bold text-gray-900">{AUTHOR}</span> on{" "}
                    <Link
                      href={`/news/${item.contentId}`}
                      className="text-[var(--primary)] hover:underline italic"
                    >
                      {item.title}
                    </Link>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>

      <Blog2Newsletter email={footerCfg.email || ""} />

      {faq && faq.items.length > 0 && (
        <Blog2Faq title={faq.title} items={faq.items} />
      )}

      <Blog2Contact
        email={footerCfg.email || ""}
        phone={footerCfg.phonenum || ""}
        address={address}
        state={footerCfg.state || ""}
      />
    </TemplateLayout>
  );
}

/* ===== Social stat row ===== */
function SocialStat({
  icon: Icon,
  colorClass,
  count,
  label,
  cta,
}: {
  icon: React.ComponentType<{ className?: string }>;
  colorClass: string;
  count: string;
  label: string;
  cta: string;
}) {
  return (
    <li className="flex items-center justify-between p-2.5 border border-gray-200 hover:shadow-sm transition">
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 flex items-center justify-center text-white ${colorClass}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <p className="text-base font-extrabold text-gray-900 leading-none tabular-nums">
            {count}
          </p>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">
            {label}
          </p>
        </div>
      </div>
      <button className="text-[10px] font-bold uppercase tracking-wider text-gray-500 hover:text-[var(--primary)] transition">
        {cta}
      </button>
    </li>
  );
}
