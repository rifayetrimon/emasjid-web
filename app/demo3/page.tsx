import Image from "@/components/ui/FallbackImage";
import Link from "next/link";
import BannerSlideshow from "@/components/main/BannerSlideshow";
import DemoSwitcher from "@/components/demos/DemoSwitcher";
import Demo3Nav from "@/components/demos/demo3/Nav";
import Demo3Faq from "@/components/demos/demo3/Faq";
import Demo3Contact from "@/components/demos/demo3/Contact";
import { getNavData } from "@/services/navService";
import { getBannerData } from "@/services/bannerService";
import { getNewsData } from "@/services/newsService";
import { getFaqData } from "@/services/faqService";
import { getFooterData } from "@/services/footerService";
import {
  getCachedConfig,
  getCachedNews,
  getCachedSideBanner,
} from "@/services/apiCache";
import { ArrowRight, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

interface NewsItem {
  contentId: number;
  title: string;
  message: string;
  date: string;
  file1: string | null;
  altImg1: string;
}

export default async function Demo3Page() {
  const [
    nav,
    banner,
    highlighted,
    newsRaw,
    sideBannerRaw,
    faq,
    footer,
    config,
  ] = await Promise.all([
    getNavData(),
    getBannerData(),
    getNewsData(),
    getCachedNews(),
    getCachedSideBanner(),
    getFaqData(),
    getFooterData(),
    getCachedConfig(),
  ]);

  const general = config.generalSettings || {};
  const footerCfg = config.footerConfig || {};
  const cssVars = {
    "--primary": general.primaryColor || "#78C841",
    "--secondary": general.secondaryColor || "#154D71",
    "--text": general.textColor || "#1a1a1a",
  } as React.CSSProperties;

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
    <div style={cssVars} className="bg-white overflow-hidden">
      <Demo3Nav
        menuItems={nav.menuItems}
        logo={nav.logo}
        socialLinks={nav.socialLinks}
      />

      {/* Hero with glass card */}
      {banner && banner.background_images?.length > 0 && (
        <section className="relative h-screen min-h-[700px] flex items-center justify-center text-center overflow-hidden">
          <BannerSlideshow media={banner.background_images} interval={7000} />
          <div
            className="absolute inset-0 z-[1]"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.65) 100%)",
            }}
          />
          {banner.overlayColor && (
            <div
              className="absolute inset-0 z-[1] pointer-events-none"
              style={{
                backgroundColor: banner.overlayColor,
                opacity: (banner.overlayOpacity || 0) / 100,
              }}
            />
          )}

          <div className="relative z-10 px-6 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-medium mb-8">
              <Sparkles className="w-3.5 h-3.5 text-[var(--primary)]" />
              Platform Pengurusan Masjid Moden
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.05] tracking-tight mb-8">
              {banner.title?.general}{" "}
              {banner.title?.focus?.text && (
                <span className="bg-gradient-to-r from-[var(--primary)] via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                  {banner.title.focus.text}
                </span>
              )}
            </h1>
            {banner.supporting_text && (
              <p className="text-base md:text-lg text-white/80 leading-relaxed max-w-2xl mx-auto mb-10">
                {banner.supporting_text}
              </p>
            )}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/news"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-gray-900 font-semibold text-sm hover:bg-white/90 transition-all shadow-2xl"
              >
                Terokai Sekarang
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#faq"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold text-sm hover:bg-white/20 transition-all"
              >
                Ketahui Lebih
              </a>
            </div>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/60 animate-pulse">
            <span className="text-xs uppercase tracking-widest">Skrol</span>
            <div className="w-[1px] h-10 bg-white/40" />
          </div>
        </section>
      )}

      {/* Highlighted news - cards with hover lift */}
      {highlighted.length > 0 && (
        <section className="relative py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[var(--primary)] font-bold mb-3">
                  Sorotan Terkini
                </p>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
                  Berita Penting
                </h2>
              </div>
              <Link
                href="/news"
                className="text-sm font-semibold text-gray-700 hover:text-[var(--primary)] transition-colors inline-flex items-center gap-1"
              >
                Lihat Semua <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {highlighted.slice(0, 6).map((item, i) => (
                <Link
                  key={item.contentId}
                  href={`/news/${item.contentId}`}
                  className={`group relative rounded-3xl overflow-hidden bg-gray-100 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl ${
                    i === 0 ? "md:col-span-2 lg:col-span-2 md:row-span-2" : ""
                  }`}
                >
                  <div
                    className={`relative ${
                      i === 0 ? "h-[280px] md:h-[640px]" : "h-72"
                    } overflow-hidden`}
                  >
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.altImg1 || item.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        sizes={i === 0 ? "(max-width:1024px) 100vw, 66vw" : "33vw"}
                        priority={i === 0}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                    <div className="absolute top-5 left-5">
                      <span className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-[11px] font-semibold uppercase tracking-wider">
                        {item.date}
                      </span>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                      <h3
                        className={`font-bold leading-tight mb-3 ${
                          i === 0
                            ? "text-2xl md:text-4xl line-clamp-3"
                            : "text-lg line-clamp-2"
                        }`}
                      >
                        {item.title}
                      </h3>
                      <span className="inline-flex items-center gap-1 text-sm text-white/80 group-hover:text-[var(--primary)] transition-colors">
                        Baca Selanjutnya
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* News list - card grid */}
      {allNews.length > 0 && (
        <section className="relative py-24 px-6 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-xs uppercase tracking-[0.25em] text-[var(--primary)] font-bold mb-3">
                Akhbar
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-3">
                Berita Terkini
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                Kekal dimaklumkan dengan perkembangan terkini.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allNews.slice(0, 9).map((item) => (
                <Link
                  key={item.contentId}
                  href={`/news/${item.contentId}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-transparent hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <Image
                      src={item.file1}
                      alt={item.altImg1 || item.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width:1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-6">
                    <p className="text-xs uppercase tracking-wider text-[var(--primary)] font-bold mb-2">
                      {item.date}
                    </p>
                    <h3 className="text-base font-bold text-gray-900 leading-snug line-clamp-2 mb-3 group-hover:text-[var(--primary)] transition-colors">
                      {item.title}
                    </h3>
                    <div
                      className="text-sm text-gray-500 leading-relaxed line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: item.message }}
                    />
                  </div>
                </Link>
              ))}
            </div>

            {sideBanners.length > 0 && (
              <div className="mt-14 grid md:grid-cols-3 gap-4">
                {sideBanners.slice(0, 3).map((b, i) => (
                  <a
                    key={i}
                    href={b.url || "#"}
                    target={b.url ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="block relative h-32 rounded-2xl overflow-hidden bg-gray-100 hover:scale-[1.02] transition-transform"
                  >
                    <Image
                      src={b.src}
                      alt={`Iklan ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                  </a>
                ))}
              </div>
            )}

            <div className="mt-14 text-center">
              <Link
                href="/news"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gray-900 text-white text-sm font-semibold hover:bg-[var(--primary)] transition-colors shadow-xl"
              >
                Semua Berita
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      <div id="faq">
        {faq && faq.items.length > 0 && (
          <Demo3Faq title={faq.title} items={faq.items} />
        )}
      </div>

      <Demo3Contact
        email={footerCfg.email || ""}
        phone={footerCfg.phonenum || ""}
        address={address}
        state={footerCfg.state || ""}
      />

      {/* Footer */}
      {footer && (
        <footer className="relative bg-gradient-to-b from-black via-gray-950 to-black text-white py-16 px-6 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-[var(--primary)]/20 blur-3xl" />
          <div className="relative max-w-7xl mx-auto">
            <div className="grid md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
              <div className="md:col-span-5">
                {footer.image.image && (
                  <Image
                    src={footer.image.image}
                    alt="Logo"
                    width={60}
                    height={60}
                    className="mb-5 brightness-0 invert"
                  />
                )}
                <h3 className="text-2xl font-bold tracking-tight mb-4">
                  {footer.footer_title}
                </h3>
                <p className="text-sm text-white/60 leading-relaxed max-w-md">
                  {footer.text}
                </p>
              </div>
              <div className="md:col-span-3">
                <h4 className="text-xs uppercase tracking-[0.2em] font-bold mb-4 text-white/40">
                  Hubungi
                </h4>
                <div className="space-y-2 text-sm text-white/70">
                  {footer.address && <p>{footer.address}</p>}
                  {footer.phone && (
                    <a href={`tel:${footer.phone}`} className="block hover:text-white">
                      {footer.phone}
                    </a>
                  )}
                  {footer.email && (
                    <a
                      href={`mailto:${footer.email}`}
                      className="block hover:text-white break-all"
                    >
                      {footer.email}
                    </a>
                  )}
                </div>
              </div>
              <div className="md:col-span-4">
                <h4 className="text-xs uppercase tracking-[0.2em] font-bold mb-4 text-white/40">
                  Sosial
                </h4>
                <div className="flex flex-wrap gap-3">
                  {footer.social_links.map((s, i) => (
                    <a
                      key={i}
                      href={s.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-11 h-11 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 flex items-center justify-center transition-all"
                    >
                      <Image
                        src={s.platform}
                        alt="Social"
                        width={18}
                        height={18}
                        className="brightness-0 invert"
                      />
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-xs text-white/40 text-center pt-8">
              {footer.copyright}
            </p>
          </div>
        </footer>
      )}

      <DemoSwitcher />
    </div>
  );
}
