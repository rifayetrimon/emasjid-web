"use client";

import { useCmsData } from "@/lib/useCmsData";
import Image from "@/components/ui/FallbackImage";
import Link from "next/link";
import BannerSlideshow from "@/components/main/BannerSlideshow";
import TemplateLayout from "@/components/TemplateLayout";
import Demo4Faq from "@/components/demos/demo4/Faq";
import Demo4Contact from "@/components/demos/demo4/Contact";
import {
  getBannerData,
  getPromotagBanners,
  getSideBanners,
} from "@/services/bannerService";
import SideBannerColumn, {
  flattenSideBanners,
} from "@/components/banner/SideBannerColumn";
import Demo7PromotagBanner from "@/components/demos/demo7/PromotagBanner";
import Demo7ComplaintBanner from "@/components/demos/demo7/ComplaintBanner";
import { getNewsData } from "@/services/newsService";
import { getFaqData } from "@/services/faqService";
import { getSiteTheme } from "@/services/themeService";
import {
  getCachedConfig,
  getCachedNews,
} from "@/services/apiCache";
import { ArrowUpRight } from "lucide-react";

interface NewsItem {
  contentId: number;
  title: string;
  message: string;
  date: string;
  file1: string | null;
  altImg1: string;
}

export default function Template2Donation() {
  const { data, loading } = useCmsData(async () => {
    const [
      banner,
      highlighted,
      newsRaw,
      sideBanners,
      faq,
      config,
      theme,
      promotagBanners,
    ] = await Promise.all([
      getBannerData(),
      getNewsData(),
      getCachedNews(),
      getSideBanners(),
      getFaqData(),
      getCachedConfig(),
      getSiteTheme(),
      getPromotagBanners(),
    ]);
    return {
      banner,
      highlighted,
      newsRaw,
      sideBanners,
      faq,
      config,
      theme,
      promotagBanners,
    };
  }, []);

  if (loading || !data) return <div className="min-h-screen bg-white" />;

  const {
    banner,
    highlighted,
    newsRaw,
    sideBanners,
    faq,
    config,
    theme,
    promotagBanners,
  } = data;

  // Honor admin's maxDisplay; fall back to 6 only when unset.
  const cap = theme.maxDisplay > 0 ? theme.maxDisplay : 6;

  const footerCfg = config.footerConfig || {};

  const allNews: NewsItem[] = (newsRaw?.dataset ||
    (Array.isArray(newsRaw) ? newsRaw : [])) as unknown as NewsItem[];

  const sideBannerSlides = flattenSideBanners(sideBanners);

  const address = [
    footerCfg.address1,
    footerCfg.address2,
    footerCfg.city,
    footerCfg.state,
    footerCfg.postcode,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <TemplateLayout templateId="2">
      <main className="max-w-[1400px] mx-auto px-6 py-6">
        {banner && banner.background_images?.length > 0 && (
          <section className="mb-4">
            <div className="relative rounded-3xl overflow-hidden h-[420px] lg:h-[520px]">
              <BannerSlideshow media={banner.background_images} interval={6500} />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/40 to-transparent" />
              {banner.overlayColor && (
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundColor: banner.overlayColor,
                    opacity: (banner.overlayOpacity || 0) / 100,
                  }}
                />
              )}
              <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-14 text-white">
                <span className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold mb-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse" />
                  Live Sekarang
                </span>
                <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4 max-w-3xl">
                  {banner.title?.general}{" "}
                  {banner.title?.focus?.text && (
                    <span className="text-[var(--primary)]">
                      {banner.title.focus.text}
                    </span>
                  )}
                </h1>
                {banner.supporting_text && (
                  <p className="text-sm md:text-lg text-white/80 leading-relaxed max-w-2xl mb-6">
                    {banner.supporting_text}
                  </p>
                )}
                <Link
                  href="/news"
                  className="inline-flex items-center gap-2 self-start px-6 py-3 rounded-xl bg-white text-gray-900 text-sm font-semibold hover:bg-[var(--primary)] hover:text-white transition-colors"
                >
                  Mula Terokai
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </section>
        )}

        {highlighted.length > 0 && (
          <section className="mb-4">
            <div className="flex items-end justify-between mb-4 px-1">
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-1">
                  Sorotan
                </p>
                <h2 className="text-2xl font-bold text-gray-900">
                  Trending Sekarang
                </h2>
              </div>
              <Link
                href="/news"
                className="text-sm font-semibold text-gray-700 hover:text-[var(--primary)] transition inline-flex items-center gap-1"
              >
                Semua
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[200px]">
              {highlighted.slice(0, cap).map((item, i) => {
                const span =
                  i === 0
                    ? "md:col-span-2 md:row-span-2"
                    : i === 1
                    ? "md:col-span-2"
                    : "md:col-span-1";
                return (
                  <Link
                    key={item.contentId}
                    href={`/news/detail/?id=${item.contentId}`}
                    className={`group relative rounded-3xl overflow-hidden bg-gray-100 ${span}`}
                  >
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.altImg1 || item.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        sizes={
                          i === 0
                            ? "(max-width:768px) 100vw, 50vw"
                            : "(max-width:768px) 100vw, 25vw"
                        }
                        priority={i === 0}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                    <div className="absolute inset-0 flex flex-col justify-between p-5">
                      <span className="self-start px-2.5 py-1 rounded-md bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-bold uppercase tracking-wider">
                        {item.date}
                      </span>
                      <div>
                        <h3
                          className={`text-white font-bold leading-tight line-clamp-3 ${
                            i === 0 ? "text-xl md:text-2xl" : "text-sm md:text-base"
                          }`}
                        >
                          {item.title}
                        </h3>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {allNews.length > 0 && (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4">
            <div className="lg:col-span-8 rounded-3xl bg-white border border-gray-100 p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Berita Terkini
                </h2>
                <Link
                  href="/news"
                  className="text-xs font-semibold text-gray-500 hover:text-[var(--primary)]"
                >
                  Lihat Semua &rarr;
                </Link>
              </div>
              <div className="space-y-4">
                {allNews.slice(0, cap).map((item) => (
                  <Link
                    key={item.contentId}
                    href={`/news/detail/?id=${item.contentId}`}
                    className="group flex gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="relative w-28 h-20 md:w-36 md:h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                      <Image
                        src={item.file1}
                        alt={item.altImg1 || item.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform"
                        sizes="144px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] uppercase tracking-wider text-[var(--primary)] font-bold mb-1">
                        {item.date}
                      </p>
                      <h3 className="text-sm md:text-base font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-[var(--primary)] transition">
                        {item.title}
                      </h3>
                      <div
                        className="text-xs text-gray-500 line-clamp-2 mt-1"
                        dangerouslySetInnerHTML={{ __html: item.message }}
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 space-y-4">
              <div className="rounded-3xl bg-gradient-to-br from-gray-900 to-gray-700 p-6 text-white">
                <p className="text-xs uppercase tracking-wider text-white/60 font-bold mb-2">
                  Tentang Kami
                </p>
                <h3 className="text-xl font-bold mb-3 leading-tight">
                  Platform Pengurusan Masjid Terpadu
                </h3>
                <p className="text-sm text-white/70 leading-relaxed mb-5">
                  Sistem yang membantu masjid menjalankan urusan dengan lebih
                  efisien.
                </p>
                <Link
                  href="/news"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-gray-900 text-xs font-bold hover:bg-[var(--primary)] hover:text-white transition"
                >
                  Ketahui Lebih
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <SideBannerColumn slides={sideBannerSlides} />
            </div>
          </section>
        )}
      </main>

      <Demo7PromotagBanner banners={promotagBanners} />

      {theme.complaintEnabled && (
        <Demo7ComplaintBanner
          email={footerCfg.email}
          phone={footerCfg.phonenum}
        />
      )}

      {faq && faq.items.length > 0 && (
        <Demo4Faq title={faq.title} items={faq.items} />
      )}

      <Demo4Contact
        email={footerCfg.email || ""}
        phone={footerCfg.phonenum || ""}
        address={address}
        state={footerCfg.state || ""}
      />
    </TemplateLayout>
  );
}
