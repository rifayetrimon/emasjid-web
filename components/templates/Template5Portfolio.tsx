"use client";

import { useCmsData } from "@/lib/useCmsData";
import Image from "@/components/ui/FallbackImage";
import Link from "next/link";
import BannerSlideshow from "@/components/main/BannerSlideshow";
import TemplateLayout from "@/components/TemplateLayout";
import Demo5Faq from "@/components/demos/demo5/Faq";
import Demo5Contact from "@/components/demos/demo5/Contact";
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

interface NewsItem {
  contentId: number;
  title: string;
  message: string;
  date: string;
  file1: string | null;
  altImg1: string;
}

function StarOrnament({ className = "" }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 20 20"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 1 L13 7 L19 8 L14.5 12.5 L16 19 L10 16 L4 19 L5.5 12.5 L1 8 L7 7 Z"
        fill="currentColor"
      />
    </svg>
  );
}

function Divider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-4 ${className}`}>
      <div className="h-[1px] w-20 bg-[var(--primary)]" />
      <StarOrnament className="text-[var(--primary)] w-5 h-5" />
      <div className="h-[1px] w-20 bg-[var(--primary)]" />
    </div>
  );
}

export default function Template5Portfolio() {
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
    <TemplateLayout templateId="5">
      {banner && banner.background_images?.length > 0 && (
        <section className="relative bg-[#fdfaf3] py-10 md:py-16 px-6 overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath d='M50 10 L60 35 L85 40 L65 60 L70 85 L50 70 L30 85 L35 60 L15 40 L40 35 Z' fill='none' stroke='%23a47133' stroke-width='1'/%3E%3C/svg%3E")`,
              backgroundSize: "100px 100px",
            }}
          />
          <div className="relative max-w-6xl mx-auto">
            <div className="border-[6px] border-double border-[var(--primary)] p-2 bg-[#fdfaf3]">
              <div className="border border-[var(--primary)]/40 relative">
                <div className="relative h-[420px] md:h-[560px] overflow-hidden">
                  <BannerSlideshow
                    media={banner.background_images}
                    interval={7000}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-[var(--secondary)]/30 via-[var(--secondary)]/50 to-[var(--secondary)]/85" />
                  {banner.overlayColor && (
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        backgroundColor: banner.overlayColor,
                        opacity: (banner.overlayOpacity || 0) / 100,
                      }}
                    />
                  )}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                    <Divider className="mb-6 [&>div]:bg-[#e8d5a8]/70 [&>svg]:text-[#e8d5a8]" />
                    <p className="text-xs md:text-sm uppercase tracking-[0.4em] text-[#e8d5a8] mb-5 font-semibold">
                      Selamat Datang
                    </p>
                    <h1
                      className="text-4xl md:text-6xl lg:text-7xl font-bold text-[#fdfaf3] leading-tight max-w-4xl mb-6"
                      style={{ fontFamily: "'Times New Roman', serif" }}
                    >
                      {banner.title?.general}{" "}
                      {banner.title?.focus?.text && (
                        <span className="italic text-[#e8d5a8]">
                          {banner.title.focus.text}
                        </span>
                      )}
                    </h1>
                    {banner.supporting_text && (
                      <p className="text-sm md:text-base text-[#fdfaf3]/85 leading-relaxed max-w-2xl mb-8">
                        {banner.supporting_text}
                      </p>
                    )}
                    <Link
                      href="/news"
                      className="inline-flex items-center gap-3 px-8 py-3 bg-[var(--primary)] hover:bg-[#e8d5a8] hover:text-[var(--secondary)] text-[#fdfaf3] text-xs uppercase tracking-[0.2em] font-bold transition-colors border-2 border-[#e8d5a8]/30"
                      style={{ fontFamily: "'Times New Roman', serif" }}
                    >
                      Mula Membaca
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {highlighted.length > 0 && (
        <section className="py-20 px-6 bg-[#fdfaf3]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <Divider className="mb-5" />
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--primary)] mb-3 font-bold">
                Pilihan Pintar
              </p>
              <h2
                className="text-4xl md:text-5xl font-bold text-[var(--secondary)]"
                style={{ fontFamily: "'Times New Roman', serif" }}
              >
                Sorotan Berita
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {highlighted.slice(0, cap).map((item, i) => (
                <Link
                  key={item.contentId}
                  href={`/news/detail/?id=${item.contentId}`}
                  className="group block"
                >
                  <div
                    className="border-[3px] border-double border-[var(--primary)] p-1.5 bg-[#fdfaf3] hover:border-[var(--secondary)] transition-colors"
                    style={{
                      clipPath:
                        "polygon(14px 0, calc(100% - 14px) 0, 100% 14px, 100% calc(100% - 14px), calc(100% - 14px) 100%, 14px 100%, 0 calc(100% - 14px), 0 14px)",
                    }}
                  >
                    <div className="relative h-56 overflow-hidden bg-[#f5e9d0]">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.altImg1 || item.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                          sizes="(max-width:1024px) 50vw, 33vw"
                          priority={i === 0}
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-[var(--secondary)] to-[var(--secondary)]/60" />
                      )}
                      <div className="absolute top-3 left-3 px-3 py-1 bg-[var(--primary)] text-[#fdfaf3] text-[10px] font-bold uppercase tracking-wider">
                        {item.date}
                      </div>
                    </div>
                  </div>
                  <div className="px-2 pt-5 text-center">
                    <h3
                      className="text-lg font-bold text-[var(--secondary)] leading-snug line-clamp-2 group-hover:text-[var(--primary)] transition-colors mb-2"
                      style={{ fontFamily: "'Times New Roman', serif" }}
                    >
                      {item.title}
                    </h3>
                    <div
                      className="text-sm text-[var(--secondary)]/70 leading-relaxed line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: item.message }}
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {allNews.length > 0 && (
        <section className="py-20 px-6 bg-[#f5e9d0]/40 border-y-2 border-[#d4b88a]/40">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <Divider className="mb-5" />
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--primary)] mb-3 font-bold">
                Akhbar
              </p>
              <h2
                className="text-4xl md:text-5xl font-bold text-[var(--secondary)]"
                style={{ fontFamily: "'Times New Roman', serif" }}
              >
                Berita Terkini
              </h2>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {allNews.slice(0, cap).map((item) => (
                  <Link
                    key={item.contentId}
                    href={`/news/detail/?id=${item.contentId}`}
                    className="group flex flex-col sm:flex-row gap-5 bg-[#fdfaf3] border-2 border-[#d4b88a]/50 hover:border-[var(--primary)] transition-colors p-4"
                  >
                    <div className="relative w-full sm:w-48 h-40 flex-shrink-0 overflow-hidden bg-[#f5e9d0] border border-[#d4b88a]/40">
                      <Image
                        src={item.file1}
                        alt={item.altImg1 || item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                        sizes="(max-width:640px) 100vw, 192px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs uppercase tracking-wider text-[var(--primary)] mb-2 font-bold">
                        {item.date}
                      </p>
                      <h3
                        className="text-lg font-bold text-[var(--secondary)] leading-snug line-clamp-2 group-hover:text-[var(--primary)] transition mb-2"
                        style={{ fontFamily: "'Times New Roman', serif" }}
                      >
                        {item.title}
                      </h3>
                      <div
                        className="text-sm text-[var(--secondary)]/70 leading-relaxed line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: item.message }}
                      />
                      <span className="inline-block mt-3 text-xs font-bold uppercase tracking-wider text-[var(--primary)] hover:text-[var(--secondary)] transition">
                        Baca &rarr;
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              <aside className="space-y-5">
                <div
                  className="bg-[var(--secondary)] text-[#fdfaf3] p-6 text-center"
                  style={{
                    clipPath:
                      "polygon(15px 0, calc(100% - 15px) 0, 100% 15px, 100% calc(100% - 15px), calc(100% - 15px) 100%, 15px 100%, 0 calc(100% - 15px), 0 15px)",
                  }}
                >
                  <StarOrnament className="text-[#e8d5a8] mx-auto mb-3 w-6 h-6" />
                  <h3
                    className="text-xl font-bold mb-3"
                    style={{ fontFamily: "'Times New Roman', serif" }}
                  >
                    Sertai Kami
                  </h3>
                  <p className="text-sm text-[#fdfaf3]/85 leading-relaxed mb-4">
                    Kekal dimaklumkan dengan berita dan pengumuman terkini
                    dari kami.
                  </p>
                  <Link
                    href="/news"
                    className="inline-flex items-center gap-2 px-4 py-2 border border-[#e8d5a8]/40 text-[#fdfaf3] text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-[#e8d5a8] hover:text-[var(--secondary)] transition"
                  >
                    Lihat Berita
                  </Link>
                </div>

                <SideBannerColumn slides={sideBannerSlides} />
              </aside>
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/news"
                className="inline-flex items-center gap-3 px-10 py-3 border-2 border-[var(--primary)] text-[var(--secondary)] text-xs uppercase tracking-[0.2em] font-bold hover:bg-[var(--primary)] hover:text-[#fdfaf3] transition-colors"
                style={{ fontFamily: "'Times New Roman', serif" }}
              >
                Semua Berita
              </Link>
            </div>
          </div>
        </section>
      )}

      <Demo7PromotagBanner banners={promotagBanners} />

      {theme.complaintEnabled && (
        <Demo7ComplaintBanner
          email={footerCfg.email}
          phone={footerCfg.phonenum}
        />
      )}

      {faq && faq.items.length > 0 && (
        <Demo5Faq title={faq.title} items={faq.items} />
      )}

      <Demo5Contact
        email={footerCfg.email || ""}
        phone={footerCfg.phonenum || ""}
        address={address}
        state={footerCfg.state || ""}
      />
    </TemplateLayout>
  );
}
