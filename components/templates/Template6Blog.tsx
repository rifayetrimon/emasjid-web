"use client";

import { useCmsData } from "@/lib/useCmsData";
import Image from "@/components/ui/FallbackImage";
import Link from "next/link";
import TemplateLayout from "@/components/TemplateLayout";
import BannerSlideshow from "@/components/main/BannerSlideshow";
import Blog2Faq from "@/components/demos/blog2/Faq";
import Blog2Contact from "@/components/demos/blog2/Contact";
import DontMissSection from "@/components/demos/blog2/DontMissSection";
import Blog2GallerySection from "@/components/demos/blog2/GallerySection";
import Blog2DonationBlock from "@/components/demos/blog2/DonationBlock";
import Blog2ComplaintBanner from "@/components/demos/blog2/ComplaintBanner";
import NewsCardCarousel from "@/components/news/NewsCardCarousel";
import PromotagBannerItem from "@/components/banner/PromotagBannerItem";
import { categoryFor, colorForCategoryName } from "@/lib/blog2Categories";
import { getBannerData, getSideBanners, getPromotagBanners } from "@/services/bannerService";
import { getAllNews } from "@/services/newsService";
import { getFaqData } from "@/services/faqService";
import { getFooterData } from "@/services/footerService";
import { getCachedConfig } from "@/services/apiCache";
import { getGalleryPage } from "@/services/galleryService";
import { getPluginsByCate } from "@/services/pluginService";
import { getSiteTheme, getDonationConfig } from "@/services/themeService";
import { ArrowRight, Users, UserPlus, Bell } from "lucide-react";
import type { NewsItem, BannerRecord } from "@/types/cms";

const AUTHOR = "Pentadbir";

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

function categoryLabelFor(item: NewsItem): string {
  if (item.category && item.category.trim()) return item.category;
  return categoryFor(item.contentId).label;
}

function categoryColorFor(item: NewsItem): string {
  // Admin-supplied category → stable color across all cards.
  if (item.category && item.category.trim()) {
    return colorForCategoryName(item.category);
  }
  // No category from admin → deterministic per contentId.
  return categoryFor(item.contentId).color;
}

function applyMaxDisplay<T>(list: T[], cap: number): T[] {
  return cap > 0 ? list.slice(0, cap) : list;
}

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

function CategoryBadge({ item }: { item: NewsItem }) {
  const label = categoryLabelFor(item);
  const color = categoryColorFor(item);
  return (
    <span
      className={`inline-block px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white ${color}`}
    >
      {label}
    </span>
  );
}

function NewsCardImage({
  item,
  sizes = "(max-width:1024px) 100vw, 50vw",
  priority = false,
}: {
  item: NewsItem;
  sizes?: string;
  priority?: boolean;
}) {
  if (item.urlIframe) {
    return (
      <iframe
        src={item.urlIframe}
        title={item.title}
        className="absolute inset-0 w-full h-full"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    );
  }
  // Multi-image: auto-cycle through file1/file2/file3
  if (item.images.length > 1) {
    return (
      <NewsCardCarousel
        images={item.images}
        sizes={sizes}
        priority={priority}
      />
    );
  }
  if (!item.file1) return null;
  return (
    <Image
      src={item.file1}
      alt={item.altImg1 || item.title}
      fill
      className="object-cover group-hover:scale-105 transition-transform duration-500"
      sizes={sizes}
      priority={priority}
    />
  );
}

function PromotagSlide({ banner }: { banner: BannerRecord }) {
  // Blog template uses the square-cornered "sharp" treatment; the shared
  // component handles the admin's image mode / colours / message placement.
  return <PromotagBannerItem banner={banner} variant="sharp" />;
}

export default function Template6Blog() {
  const { data, loading } = useCmsData(async () => {
    const [
      banner,
      allNews,
      sideBanners,
      promotagBanners,
      faq,
      config,
      footer,
      galleryPage,
      sidebarPlugins,
      theme,
      donation,
    ] = await Promise.all([
      getBannerData(),
      getAllNews(),
      getSideBanners(),
      getPromotagBanners(),
      getFaqData(),
      getCachedConfig(),
      getFooterData(),
      getGalleryPage(1, 10),
      getPluginsByCate("sidebar"),
      getSiteTheme(),
      getDonationConfig(),
    ]);
    return {
      banner,
      allNews,
      sideBanners,
      promotagBanners,
      faq,
      config,
      footer,
      galleryPage,
      sidebarPlugins,
      theme,
      donation,
    };
  }, []);

  if (loading || !data) return <div className="min-h-screen bg-white" />;

  const {
    banner,
    allNews,
    sideBanners,
    promotagBanners,
    faq,
    config,
    footer,
    galleryPage,
    sidebarPlugins,
    theme,
    donation,
  } = data;

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

  // Home page shows ONLY featured posts: admin highlight (`highlightPost`)
  // AND front-page (`frontPage`). Everything else lives on the "Lihat Semua"
  // archive (/news). `theme.maxDisplay` is admin's pagination cap — don't apply
  // it to this master list (that starves smaller sections like "Jangan
  // Lepaskan"); sections below apply it per-section instead.
  const newsList = allNews.filter((n) => n.isHighlight && n.isFrontPage);

  // Sort by date + time descending so "most recent" works on real data.
  const recencyKey = (n: NewsItem) =>
    new Date(`${n.date}T${n.time || "00:00:00"}`).getTime();
  const newsByRecency = [...newsList].sort(
    (a, b) => recencyKey(b) - recencyKey(a)
  );

  // Recency-driven slots. newsByRecency is sorted most-recent-first.
  // The admin banner (if any) renders as a separate full-width strip above
  // the hero grid, so it no longer consumes a news slot. Layout:
  //   - Hero LEFT: most recent news (recency 0)
  //   - Hero RIGHT: items 1 & 2 (recency 1–2)
  //   - Jangan Lepaskan: item 3 featured + items 4–7 list (recency 3–7)
  //   - Berita Sekolah: items 8 & 9 grid + items 10–13 list (recency 8–13)
  const hasAdminBanner = !!banner?.background_images?.length;

  const heroFeatured: NewsItem | undefined = newsByRecency[0];

  // 2 cards on the right of the hero grid, immediately after the featured one.
  const heroSideItems = newsByRecency.slice(1, 3);

  // How many recency slots are consumed before the body sections start.
  const heroOffset = 3;

  // Jangan Lepaskan — items 3..7 (5 items). DontMissSection internally
  // renders items[0] as featured and items[1..4] as the right list.
  const dontMissItems = newsByRecency.slice(heroOffset, heroOffset + 5);

  // Berita Sekolah — items 8..9 grid (2) + items 10..13 list (4).
  const lifestyleGrid = newsByRecency.slice(heroOffset + 5, heroOffset + 7);
  const lifestyleList = newsByRecency.slice(heroOffset + 7, heroOffset + 11);

  // Sidebar news (posDisplay === "sidebar") still drives the small
  // "Pilihan Editor" widget on the right column.
  const sidebarNews = newsList.filter((n) => n.posDisplay === "sidebar");

  // Berita Terkini — fixed at 6 news then "Lihat Semua" button below.
  // We intentionally ignore admin's maxDisplay here so the section's
  // layout (3 rows × 2 cols) stays consistent regardless of config.
  const latestArticles = newsList.slice(0, 6);

  // Most Popular
  const mostPopular = applyMaxDisplay(
    newsList.filter((n) => n.isHighlight),
    3
  );
  const popularList = mostPopular.length > 0 ? mostPopular : newsList.slice(0, 3);

  // Sidebar plugins (admin-placed widgets)
  const sidebarPluginList = sidebarPlugins;

  // Side banner shaping (multi-image, per-slide urls — admin can ship 3 slides
  // per banner record now).
  type SideBannerSlide = { src: string; url: string };
  const sideBannerSlides: SideBannerSlide[] = sideBanners.flatMap((b) =>
    b.slides.map((s) => ({ src: s.src, url: s.url }))
  );

  return (
    <TemplateLayout templateId="6">
      {/* ━━━━━━ TRENDING NOW STRIP ━━━━━━ */}
      {heroFeatured && (
        <div
          className="border-b border-gray-200"
          style={{
            backgroundColor: theme.backgroundColorTrending || undefined,
          }}
        >
          <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-center gap-4">
            <span className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1 bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Trending
            </span>
            <Link
              href={`/news/detail/?id=${heroFeatured.contentId}`}
              className="text-sm text-gray-700 truncate hover:text-[var(--primary)] transition"
            >
              {heroFeatured.title}
            </Link>
          </div>
        </div>
      )}

      {/* ━━━━━━ SUBHEADER (admin-driven) ━━━━━━ */}
      {theme.subheader && (
        <div className="bg-gray-100 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-2 text-center text-xs text-gray-700">
            {theme.subheader}
          </div>
        </div>
      )}

      {/* ━━━━━━ TOP BANNER (admin-driven, full-bleed) ━━━━━━ */}
      {/*
        The banner sizes itself to the uploaded image's natural aspect ratio
        (`naturalAspect`), so the WHOLE image shows full-width with no cropping
        and no letterbox bars — whatever shape the admin uploads.
      */}
      {hasAdminBanner && banner && (
        <section className="w-full pt-6">
          <div className="relative w-full overflow-hidden bg-gray-100">
            <BannerSlideshow
              media={banner.background_images}
              interval={6500}
              fit="cover"
              naturalAspect
            />
            {banner.overlayColor && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundColor: banner.overlayColor,
                  opacity: (banner.overlayOpacity || 0) / 100,
                }}
              />
            )}
            {(banner.title?.general ||
              banner.title?.focus?.text ||
              banner.supporting_text) && (
              <div className="absolute inset-0 flex flex-col justify-end pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="relative w-full px-6 md:px-10 pb-8 md:pb-12 text-white pointer-events-auto">
                  {(banner.title?.general || banner.title?.focus?.text) && (
                    <h1 className="text-2xl md:text-4xl font-extrabold leading-tight drop-shadow-lg">
                      {banner.title?.general}
                      {banner.title?.focus?.text && (
                        <>
                          {banner.title?.general ? " " : ""}
                          <span className="text-[var(--primary)]">
                            {banner.title.focus.text}
                          </span>
                        </>
                      )}
                    </h1>
                  )}
                  {banner.supporting_text && (
                    <p className="mt-3 max-w-2xl text-sm md:text-base text-white/85 leading-relaxed drop-shadow">
                      {banner.supporting_text}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ━━━━━━ HERO GRID ━━━━━━ */}
      {heroFeatured && (
        <section className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Featured Big — most recent news, spans 2 columns on desktop */}
            <Link
              href={`/news/detail/?id=${heroFeatured.contentId}`}
              className="lg:col-span-2 group relative block aspect-[16/9] overflow-hidden bg-gray-900"
            >
              <NewsCardImage item={heroFeatured} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <CategoryBadge item={heroFeatured} />
                <h1 className="mt-3 text-2xl md:text-3xl font-bold leading-tight line-clamp-3 group-hover:text-[var(--primary)] transition">
                  {heroFeatured.title}
                </h1>
                <div className="flex items-center gap-2 text-xs text-white/80 mt-2">
                  <span>{AUTHOR}</span>
                  <span>·</span>
                  <span>{formatDate(heroFeatured.date)}</span>
                </div>
                {heroFeatured.mobileDes && (
                  <p className="md:hidden text-xs text-white/80 mt-2 line-clamp-2">
                    {heroFeatured.mobileDes}
                  </p>
                )}
              </div>
            </Link>

            {/* Right column — pinned/front-page news */}
            <div className="grid grid-cols-1 gap-4">
              {heroSideItems.slice(0, 2).map((item) => (
                <Link
                  key={item.contentId}
                  href={`/news/detail/?id=${item.contentId}`}
                  className="group relative block aspect-[16/9] overflow-hidden bg-gray-100"
                >
                  <NewsCardImage item={item} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                    <CategoryBadge item={item} />
                    <h3 className="mt-2 text-sm font-bold leading-snug line-clamp-2 group-hover:text-[var(--primary)] transition">
                      {item.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ━━━━━━ MID BANNER HEADING (admin-driven) ━━━━━━ */}
      {theme.midBannerMainTitle && (
        <section className="max-w-7xl mx-auto px-6 pb-6">
          <h2 className="text-center text-xl md:text-2xl font-bold text-gray-900">
            {theme.midBannerMainTitle}
          </h2>
        </section>
      )}

      {/* ━━━━━━ DON'T MISS + BERITA SEKOLAH ━━━━━━ */}
      <section
        className="max-w-7xl mx-auto px-6 pb-12 grid grid-cols-1 lg:grid-cols-4 gap-8"
        style={{ backgroundColor: theme.backgroundColorNews || undefined }}
      >
        <div className="lg:col-span-3 space-y-12">
          <div>
            <BlockTitle label="Jangan Lepaskan" />
            <DontMissSection
              items={dontMissItems.map((n) => ({
                contentId: n.contentId,
                title: n.title,
                message: n.message,
                date: n.date,
                file1: n.file1,
                altImg1: n.altImg1,
                category: n.category,
              }))}
              excludeIds={[]}
              tabs={["Semua"]}
            />
          </div>

          <div>
            <BlockTitle label="Berita Sekolah" accent="green" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 items-stretch">
              {lifestyleGrid.map((item) => (
                <Link
                  key={item.contentId}
                  href={`/news/detail/?id=${item.contentId}`}
                  className="group flex flex-col h-full"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 mb-3 shrink-0">
                    <NewsCardImage item={item} />
                    <span className="absolute top-3 left-3">
                      <CategoryBadge item={item} />
                    </span>
                  </div>
                  {/* Title locked to 2 lines (`min-h` reserves space when the
                      title is a single line) so both grid cards align. */}
                  <h3 className="text-base font-bold text-gray-900 leading-snug line-clamp-2 min-h-[2.75rem] group-hover:text-[var(--primary)] transition">
                    {item.title}
                  </h3>
                  <Meta date={item.date} />
                  {/* Body row reserves space for ~2 lines even when admin's
                      mobileDes / message body is empty. */}
                  <div
                    className="text-xs text-gray-600 leading-relaxed line-clamp-2 min-h-[2.5rem] mt-2"
                    dangerouslySetInnerHTML={{
                      __html: item.mobileDes || item.message || "",
                    }}
                  />
                </Link>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 pt-6 border-t border-gray-200">
              {lifestyleList.map((item) => (
                <Link
                  key={item.contentId}
                  href={`/news/detail/?id=${item.contentId}`}
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

        {/* SHARED SIDEBAR */}
        <aside className="space-y-6 lg:self-start">
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
                // Real follower / subscriber counts aren't wired into the
                // CMS yet, so the count slot stays "N/A" until a backend
                // source exists. The action labels and social links are
                // still admin-driven.
                const cards = [
                  {
                    Icon: Users,
                    bg: "bg-blue-600",
                    count: "N/A",
                    label: "FANS",
                    action: "LIKE",
                    href: findLink("fb") || findLink("facebook") || "#",
                  },
                  {
                    Icon: UserPlus,
                    bg: "bg-sky-400",
                    count: "N/A",
                    label: "FOLLOWERS",
                    action: "FOLLOW",
                    href: findLink("x.svg") || findLink("twitter") || "#",
                  },
                  {
                    Icon: Bell,
                    bg: "bg-red-600",
                    count: "N/A",
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

          {/* Sidebar news (posDisplay === "sidebar") */}
          {sidebarNews.length > 0 && (
            <div>
              <BlockTitle label="Pilihan Editor" />
              <ul className="space-y-3">
                {sidebarNews.slice(0, 4).map((n) => (
                  <li key={n.contentId} className="flex gap-3">
                    <div className="relative w-16 h-16 flex-shrink-0 overflow-hidden bg-gray-100">
                      {n.file1 && (
                        <Image
                          src={n.file1}
                          alt={n.altImg1 || n.title}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      )}
                    </div>
                    <Link
                      href={`/news/detail/?id=${n.contentId}`}
                      className="flex-1 text-xs font-bold text-gray-900 leading-snug line-clamp-3 hover:text-[var(--primary)]"
                    >
                      {n.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Sidebar plugins (admin-placed widgets via /plugin?cate=sidebar) */}
          {sidebarPluginList.length > 0 && (
            <div className="space-y-4">
              {sidebarPluginList.map((p) => (
                <a
                  key={p.pluginId}
                  href={p.urlLink || "#"}
                  target={p.urlLink ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="block p-4 border border-gray-200 hover:border-[var(--primary)] hover:shadow-sm transition"
                >
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    {p.title}
                  </p>
                  <div
                    className="text-xs text-gray-600 leading-relaxed line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: p.message }}
                  />
                </a>
              ))}
            </div>
          )}

          {/* Side banners (sta===1 enforced; per-slide urllinks honored) */}
          {sideBannerSlides.length > 0 && (
            <div className="max-h-[840px] overflow-y-auto space-y-4 pr-1">
              {sideBannerSlides.map((b, i) => (
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
            </div>
          )}
        </aside>
      </section>

      {/* ━━━━━━ PROMOTAG (live + multiple records supported) ━━━━━━ */}
      {promotagBanners.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 pb-12 space-y-4">
          {promotagBanners.map((b) => (
            <PromotagSlide key={b.bannerId} banner={b} />
          ))}
        </section>
      )}

      {/* ━━━━━━ DONATION (Config-driven, admin toggle) ━━━━━━ */}
      <Blog2DonationBlock donation={donation} />

      {/* ━━━━━━ GALLERY (10 items / page, 5×2 grid + pagination) ━━━━━━ */}
      <Blog2GallerySection initial={galleryPage} />

      {/* ━━━━━━ LATEST + MOST POPULAR ━━━━━━ */}
      <section className="max-w-7xl mx-auto px-6 pb-12 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <BlockTitle label="Berita Terkini" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {latestArticles.map((item) => (
              <Link
                key={item.contentId}
                href={`/news/detail/?id=${item.contentId}`}
                className="group block"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 mb-3">
                  <NewsCardImage item={item} />
                  <span className="absolute top-3 left-3">
                    <CategoryBadge item={item} />
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
          <div>
            <BlockTitle label="Paling Popular" />
            <ol className="space-y-4">
              {popularList.map((item, i) => (
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
                      href={`/news/detail/?id=${item.contentId}`}
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

      {/* ━━━━━━ COMPLAINT (toggle via Config.complaint) ━━━━━━ */}
      {theme.complaintEnabled && (
        <Blog2ComplaintBanner
          email={footerCfg.email}
          phone={footerCfg.phonenum}
        />
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
