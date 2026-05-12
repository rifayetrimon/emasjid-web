import Image from "@/components/ui/FallbackImage";
import Link from "next/link";
import TemplateLayout from "@/components/TemplateLayout";
import BannerSlideshow from "@/components/main/BannerSlideshow";
import Blog2Faq from "@/components/demos/blog2/Faq";
import Blog2Contact from "@/components/demos/blog2/Contact";
import DontMissSection from "@/components/demos/blog2/DontMissSection";
import { categoryFor } from "@/lib/blog2Categories";
import { getBannerData } from "@/services/bannerService";
import { getNewsData } from "@/services/newsService";
import { getFaqData } from "@/services/faqService";
import { getFooterData } from "@/services/footerService";
import {
  getCachedConfig,
  getCachedNews,
  getCachedSideBanner,
  getCachedPromotagBanner,
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

// Categories + resolver live in lib/blog2Categories.ts so they can be shared
// between server and client components.
const cat = categoryFor;

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

function CategoryBadge({ contentId }: { contentId: number }) {
  const c = cat(contentId);
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
    promotagRaw,
    faq,
    config,
    footer,
  ] = await Promise.all([
    getBannerData(),
    getNewsData(),
    getCachedNews(),
    getCachedSideBanner(),
    getCachedPromotagBanner(),
    getFaqData(),
    getCachedConfig(),
    getFooterData(),
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

  // Promotion banner (Promotag) — separate API: banner?type=Promotag
  const promotag = (() => {
    const dataset =
      promotagRaw?.dataset || (Array.isArray(promotagRaw) ? promotagRaw : []);
    const first = dataset?.[0];
    if (!first) return null;
    const file = first.files?.find(
      (f: { file?: string }) => f.file && f.file.trim()
    );
    if (!file?.file) return null;
    return {
      src: file.file as string,
      url: first.url || "",
    };
  })();

  // Hero
  const heroFeatured = highlighted[0] || allNews[0];
  // Right-column cards beside the banner: news with contentId 1 and 2 (admin-pinned),
  // falling back to the next two newest if those IDs don't exist.
  const findById = (id: number) => allNews.find((n) => n.contentId === id);
  const pinnedHeroItems = [findById(1), findById(2)].filter(
    (n): n is NewsItem => Boolean(n)
  );
  const heroSideItems =
    pinnedHeroItems.length > 0 ? pinnedHeroItems : allNews.slice(1, 3);

  // Don't Miss — exclude the items shown beside the banner so the user
  // doesn't see the same articles repeated at the top of the "Semua" tab.
  const heroExcludeIds = [
    heroFeatured?.contentId,
    ...heroSideItems.map((i) => i.contentId),
  ].filter((id): id is number => typeof id === "number");
  const dontMissTabs = ["Semua", "Akademik", "Pengumuman", "Aktiviti"];

  // Lifestyle News
  const lifestyleGrid = allNews.slice(0, 2);
  const lifestyleList = allNews.slice(0, 4);

  // Latest Articles
  const latestArticles = allNews.slice(0, 8);

  // Image Gallery (news photos as visual grid)
  const galleryItems = allNews
    .filter((n) => n.file1)
    .slice(0, 8);

  // Sidebar widgets data
  const mostPopular = allNews.slice(0, 3);

  // Static content (admin-controlled intro text from banner config)
  const staticTitle = banner?.title?.general || "";
  const staticFocus = banner?.title?.focus?.text || "";
  const staticBody = banner?.supporting_text || "";

  return (
    <TemplateLayout templateId="7">
      {/* ━━━━━━ TRENDING NOW STRIP ━━━━━━ */}
      {heroFeatured && (
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-center gap-4">
            <span className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1 bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Trending
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Featured Big — spans 2 columns on desktop */}
            {banner?.background_images?.length ? (
              <div className="lg:col-span-2 relative block aspect-[16/9] overflow-hidden bg-gray-900">
                <BannerSlideshow
                  media={banner.background_images}
                  interval={6500}
                  fit="contain"
                />
                {banner?.overlayColor && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      backgroundColor: banner.overlayColor,
                      opacity: (banner.overlayOpacity || 0) / 100,
                    }}
                  />
                )}
              </div>
            ) : (
              <Link
                href={`/news/${heroFeatured.contentId}`}
                className="lg:col-span-2 group relative block aspect-[16/9] overflow-hidden bg-gray-900"
              >
                {getImg(heroFeatured) && (
                  <Image
                    src={getImg(heroFeatured)}
                    alt={heroFeatured.altImg1 || heroFeatured.title}
                    fill
                    className="object-cover group-hover:scale-[1.02] transition-transform duration-700"
                    sizes="(max-width:1024px) 100vw, 66vw"
                    priority
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <CategoryBadge contentId={heroFeatured.contentId} />
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
            )}

            {/* Right column — pinned news (IDs 1 & 2) stacked beside the banner */}
            <div className="grid grid-cols-1 gap-4">
              {heroSideItems.slice(0, 2).map((item) => {
                const img = getImg(item);
                return (
                  <Link
                    key={item.contentId}
                    href={`/news/${item.contentId}`}
                    className="group relative block aspect-[16/9] overflow-hidden bg-gray-100"
                  >
                    {img && (
                      <Image
                        src={img}
                        alt={item.altImg1 || item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width:1024px) 100vw, 33vw"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                      <CategoryBadge contentId={item.contentId} />
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

      {/* ━━━━━━ DON'T MISS + BERITA SEKOLAH (shared sidebar) ━━━━━━ */}
      <section className="max-w-7xl mx-auto px-6 pb-12 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* MAIN COLUMN — Don't Miss + Berita Sekolah stacked */}
        <div className="lg:col-span-3 space-y-12">
          <div>
            <BlockTitle label="Jangan Lepaskan" />
            <DontMissSection
              items={allNews}
              excludeIds={heroExcludeIds}
              tabs={dontMissTabs}
            />
          </div>

          <div>
            <BlockTitle label="Berita Sekolah" accent="green" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {lifestyleGrid.map((item) => (
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
                      <CategoryBadge contentId={item.contentId} />
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-[var(--primary)] transition">
                    {item.title}
                  </h3>
                  <Meta date={item.date} />
                  <div
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
        </div>

        {/* SHARED SIDEBAR — Stay Connected on top, all side banners stacked below.
            Stays pinned in view while scrolling, scrolls internally if content
            exceeds viewport, and releases when the Berita Sekolah section ends. */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pr-1">
          <div>
            <div className="mb-5">
              <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider">
                Stay Connected
              </h2>
              <div className="mt-2 relative h-[1px] bg-gray-200">
                <span className="absolute left-0 -top-px h-[2px] w-1/3 bg-blue-600" />
              </div>
            </div>
            <div className="space-y-3">
              {(() => {
                const findLink = (key: string) =>
                  footer?.social_links.find((s) =>
                    s.platform.toLowerCase().includes(key)
                  )?.link;
                const cards = [
                  {
                    Icon: Users,
                    bg: "bg-blue-600",
                    count: "24,856",
                    label: "FANS",
                    action: "LIKE",
                    href: findLink("fb") || findLink("facebook") || "#",
                  },
                  {
                    Icon: UserPlus,
                    bg: "bg-sky-400",
                    count: "3,915",
                    label: "FOLLOWERS",
                    action: "FOLLOW",
                    href: findLink("x.svg") || findLink("twitter") || "#",
                  },
                  {
                    Icon: Bell,
                    bg: "bg-red-600",
                    count: "22,800",
                    label: "SUBSCRIBERS",
                    action: "SUBSCRIBE",
                    href: findLink("youtube") || "#",
                  },
                ];
                return cards.map((c, i) => (
                  <a
                    key={i}
                    href={c.href}
                    target={c.href === "#" ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-3 py-3 bg-white border border-gray-200 hover:shadow-sm transition group"
                  >
                    <div
                      className={`w-11 h-11 ${c.bg} flex items-center justify-center flex-shrink-0 rounded-sm`}
                    >
                      <c.Icon className="w-5 h-5 text-white" strokeWidth={2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-bold text-gray-900 leading-none tabular-nums">
                        {c.count}
                      </p>
                      <p className="text-[10px] uppercase tracking-wider text-gray-500 mt-1">
                        {c.label}
                      </p>
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 group-hover:text-gray-900 transition">
                      {c.action}
                    </span>
                  </a>
                ));
              })()}
            </div>
          </div>

          {/* All side banners stacked below Stay Connected */}
          {sideBanners.map((b, i) => (
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
                className="object-cover"
                sizes="300px"
              />
              <p className="absolute bottom-2 right-2 text-[9px] uppercase tracking-wider text-white bg-black/50 px-2 py-0.5">
                Iklan
              </p>
            </a>
          ))}
        </aside>
      </section>

      {/* ━━━━━━ PROMOTION BANNER (Promotag API) — above gallery ━━━━━━ */}
      {promotag && (
        <section className="max-w-7xl mx-auto px-6 pb-12">
          <a
            href={promotag.url || "#"}
            target={promotag.url ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="block relative h-40 md:h-52 overflow-hidden bg-gray-100 group"
          >
            <Image
              src={promotag.src}
              alt="Promosi"
              fill
              className="object-cover group-hover:scale-[1.01] transition-transform duration-500"
              sizes="100vw"
            />
            <span className="absolute top-3 right-3 text-[9px] uppercase tracking-wider text-white bg-black/60 px-2 py-0.5">
              Promosi
            </span>
          </a>
        </section>
      )}

      {/* ━━━━━━ IMAGE GALLERY ━━━━━━ */}
      {galleryItems.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 pb-12">
          <BlockTitle label="Galeri" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {galleryItems.map((item) => (
              <Link
                key={item.contentId}
                href={`/news/${item.contentId}`}
                className="group relative block aspect-square overflow-hidden bg-gray-100"
              >
                {item.file1 && (
                  <Image
                    src={item.file1}
                    alt={item.altImg1 || item.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width:768px) 50vw, 25vw"
                  />
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-end p-3">
                  <span className="text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition line-clamp-2">
                    {item.title}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ━━━━━━ LATEST + MOST POPULAR + RECENT COMMENTS ━━━━━━ */}
      <section className="max-w-7xl mx-auto px-6 pb-12 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <BlockTitle label="Berita Terkini" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {latestArticles.map((item) => (
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
                    <CategoryBadge contentId={item.contentId} />
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
              Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
          {/* MOST POPULAR */}
          <div>
            <BlockTitle label="Paling Popular" />
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

        </aside>
      </section>

      {/* ━━━━━━ STATIC CONTENT — admin-controlled intro ━━━━━━ */}
      {(staticTitle || staticBody) && (
        <section className="bg-gray-50 border-y border-gray-200 py-14 px-6">
          <div className="max-w-4xl mx-auto text-center">
            {(staticTitle || staticFocus) && (
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight mb-4">
                {staticTitle}
                {staticFocus && (
                  <>
                    {staticTitle && " "}
                    <span className="text-[var(--primary)]">{staticFocus}</span>
                  </>
                )}
              </h2>
            )}
            {staticBody && (
              <p className="text-sm md:text-base text-gray-600 leading-relaxed max-w-2xl mx-auto">
                {staticBody}
              </p>
            )}
          </div>
        </section>
      )}

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

