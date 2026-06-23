"use client";

import { useCmsData } from "@/lib/useCmsData";
import Link from "next/link";
import BannerSlideshow from "@/components/main/BannerSlideshow";
import TemplateLayout from "@/components/TemplateLayout";
import Demo8Carousel from "@/components/demos/demo8/Carousel";
import Demo8Faq from "@/components/demos/demo8/Faq";
import Demo8Contact from "@/components/demos/demo8/Contact";
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
import Demo7Subheader from "@/components/demos/demo7/Subheader";
import Demo7DonationBlock from "@/components/demos/demo7/DonationBlock";
import Demo7GallerySection from "@/components/demos/demo7/GallerySection";
import Demo7SidebarPlugins from "@/components/demos/demo7/SidebarPlugins";
import { getNewsData } from "@/services/newsService";
import { getFaqData } from "@/services/faqService";
import { getSiteTheme, getDonationConfig } from "@/services/themeService";
import { getGalleryPage } from "@/services/galleryService";
import { getPluginsByCate } from "@/services/pluginService";
import {
  getCachedConfig,
  getCachedNews,
} from "@/services/apiCache";
import { Play, Info } from "lucide-react";

interface NewsItem {
  contentId: string;
  title: string;
  message: string;
  date: string;
  file1: string | null;
  altImg1: string;
}

export default function Template3Marketplace() {
  const { data, loading } = useCmsData(async () => {
    const [
      banner,
      highlighted,
      newsRaw,
      sideBanners,
      faq,
      config,
      promotagBanners,
      theme,
      galleryPage,
      sidebarPlugins,
      donation,
    ] = await Promise.all([
      getBannerData(),
      getNewsData(),
      getCachedNews(),
      getSideBanners(),
      getFaqData(),
      getCachedConfig(),
      getPromotagBanners(),
      getSiteTheme(),
      getGalleryPage(1, 10),
      getPluginsByCate("sidebar"),
      getDonationConfig(),
    ]);
    return {
      banner,
      highlighted,
      newsRaw,
      sideBanners,
      faq,
      config,
      promotagBanners,
      theme,
      galleryPage,
      sidebarPlugins,
      donation,
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
    promotagBanners,
    theme,
    galleryPage,
    sidebarPlugins,
    donation,
  } = data;

  const footerCfg = config.footerConfig || {};
  const complaintEnabled =
    String(config?.generalSettings?.complaint ?? "").toLowerCase() === "on";

  const allNews: NewsItem[] = (newsRaw?.dataset ||
    (Array.isArray(newsRaw) ? newsRaw : [])) as unknown as NewsItem[];

  const sideBannerSlides = flattenSideBanners(sideBanners);
  // Show the side banners in a clean light sidebar beside the About card.
  const hasSide = sideBannerSlides.length > 0;

  const address = [
    footerCfg.address1,
    footerCfg.address2,
    footerCfg.city,
    footerCfg.state,
    footerCfg.postcode,
  ]
    .filter(Boolean)
    .join(", ");

  const carouselHighlight = highlighted.map((h) => ({
    contentId: h.contentId,
    title: h.title,
    message: h.message,
    date: h.date,
    image: h.image,
    altImg1: h.altImg1,
  }));

  const carouselLatest = allNews.map((n) => ({
    contentId: n.contentId,
    title: n.title,
    message: n.message,
    date: n.date,
    image: n.file1,
    altImg1: n.altImg1,
  }));

  return (
    <TemplateLayout templateId="3">
      {banner && banner.background_images?.length > 0 && (
        <section className="relative h-screen min-h-[700px] overflow-hidden -mt-[88px]">
          <BannerSlideshow media={banner.background_images} links={banner.background_links} interval={8000} />
          {banner.overlayColor && (banner.overlayOpacity || 0) > 0 && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `linear-gradient(to top, ${banner.overlayColor}, transparent)`,
                opacity: (banner.overlayOpacity || 0) / 100,
              }}
            />
          )}

          <div className="relative h-full flex flex-col justify-end">
            <div className="max-w-[1400px] mx-auto px-6 md:px-8 pb-20 md:pb-28 w-full">
              <div className="max-w-2xl">
                <p className="text-xs md:text-sm uppercase tracking-[0.4em] text-[var(--primary)] font-semibold mb-5">
                  Edisi Pilihan
                </p>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tight mb-5">
                  {banner.title?.general}{" "}
                  {banner.title?.focus?.text && (
                    <span className="block text-[var(--primary)] italic font-bold mt-2">
                      {banner.title.focus.text}
                    </span>
                  )}
                </h1>
                {banner.supporting_text && (
                  <p className="text-base md:text-lg text-white/75 leading-relaxed max-w-xl mb-8">
                    {banner.supporting_text}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href="/news"
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded bg-white text-black text-sm font-bold hover:bg-[var(--primary)] transition"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    Mula Tonton
                  </Link>
                  <a
                    href="#about"
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded bg-white/10 backdrop-blur text-white text-sm font-bold border border-white/20 hover:bg-white/20 transition"
                  >
                    <Info className="w-4 h-4" />
                    Maklumat Lanjut
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
        </section>
      )}

      <div className="-mt-20 relative z-10">
        {highlighted.length > 0 && (
          <Demo8Carousel
            title="Pilihan Editor"
            items={carouselHighlight}
            large
          />
        )}
      </div>

      {allNews.length > 0 && (
        <Demo8Carousel title="Berita Terkini" items={carouselLatest} />
      )}

      {theme.subheader && <Demo7Subheader text={theme.subheader} />}

      <section id="about" className="py-20 px-6">
        <div className="max-w-[1400px] mx-auto">
          <div
            className={
              hasSide ? "grid lg:grid-cols-3 gap-8 items-start" : ""
            }
          >
            {/* About card */}
            <div className={hasSide ? "lg:col-span-2" : ""}>
              <div className="relative h-full rounded-2xl overflow-hidden bg-gradient-to-br from-zinc-900 to-zinc-950 border border-white/5 p-10 md:p-16">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_50%)] pointer-events-none" />
                <div className="relative">
                  <p className="text-xs uppercase tracking-[0.3em] text-[var(--primary)] font-semibold mb-4">
                    Tentang Kami
                  </p>
                  <h2 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight mb-5">
                    {banner?.title?.general || "Selamat Datang"}{" "}
                    {banner?.title?.focus?.text && (
                      <span className="text-[var(--primary)] italic">
                        {banner.title.focus.text}.
                      </span>
                    )}
                  </h2>
                  <p className="text-white/70 leading-relaxed mb-8 max-w-md">
                    {banner?.supporting_text ||
                      "Terokai koleksi pilihan kami dan dapatkan tawaran terbaik."}
                  </p>
                  <div className="grid grid-cols-3 gap-5 mb-8">
                    <Stat label="Artikel" value={allNews.length || 0} />
                    <Stat label="Sorotan" value={highlighted.length || 0} />
                    <Stat label="Sokongan" value="24/7" />
                  </div>
                  <Link
                    href="/news"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded bg-[var(--primary)] hover:bg-[var(--primary)]/85 text-black text-sm font-bold transition"
                  >
                    Mula Sekarang
                  </Link>
                </div>
              </div>
            </div>

            {/* Right sidebar — side banners (clean light column) */}
            {hasSide && (
              <aside className="lg:col-span-1 lg:sticky lg:top-24 lg:self-start">
                <SideBannerColumn slides={sideBannerSlides} />
              </aside>
            )}
          </div>
        </div>
      </section>

      <Demo7PromotagBanner banners={promotagBanners} />

      <Demo7DonationBlock donation={donation} />

      <Demo7GallerySection initial={galleryPage} />

      <Demo7SidebarPlugins plugins={sidebarPlugins} />

      {complaintEnabled && (
        <Demo7ComplaintBanner
          email={footerCfg.email}
          phone={footerCfg.phonenum}
        />
      )}

      {faq && faq.items.length > 0 && (
        <Demo8Faq title={faq.title} items={faq.items} />
      )}

      <Demo8Contact
        email={footerCfg.email || ""}
        phone={footerCfg.phonenum || ""}
        address={address}
        state={footerCfg.state || ""}
      />
    </TemplateLayout>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-2xl md:text-3xl font-bold text-[var(--primary)] leading-none">
        {value}
      </p>
      <p className="text-xs text-white/50 mt-1.5 uppercase tracking-wider">
        {label}
      </p>
    </div>
  );
}
