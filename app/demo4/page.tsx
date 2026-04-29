import Image from "@/components/ui/FallbackImage";
import Link from "next/link";
import BannerSlideshow from "@/components/main/BannerSlideshow";
import DemoSwitcher from "@/components/demos/DemoSwitcher";
import Demo4Nav from "@/components/demos/demo4/Nav";
import Demo4Faq from "@/components/demos/demo4/Faq";
import Demo4Contact from "@/components/demos/demo4/Contact";
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
import { TrendingUp, Newspaper, Users, Calendar, ArrowUpRight } from "lucide-react";

export const dynamic = "force-dynamic";

interface NewsItem {
  contentId: number;
  title: string;
  message: string;
  date: string;
  file1: string | null;
  altImg1: string;
}

export default async function Demo4Page() {
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

  const stats = [
    { icon: Newspaper, label: "Artikel", value: allNews.length || "0", color: "text-blue-600", bg: "bg-blue-50" },
    { icon: Users, label: "Pengguna", value: "12K+", color: "text-emerald-600", bg: "bg-emerald-50" },
    { icon: TrendingUp, label: "Trend", value: highlighted.length || "0", color: "text-amber-600", bg: "bg-amber-50" },
    { icon: Calendar, label: "Aktiviti", value: "Aktif", color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div style={cssVars} className="bg-gray-50 min-h-screen">
      <Demo4Nav
        menuItems={nav.menuItems}
        logo={nav.logo}
        socialLinks={nav.socialLinks}
      />

      <main className="max-w-[1400px] mx-auto px-6 py-6">
        {/* Bento Hero — banner card + stats */}
        {banner && banner.background_images?.length > 0 && (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4">
            <div className="lg:col-span-8 relative rounded-3xl overflow-hidden h-[420px] lg:h-[480px]">
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
              <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 text-white">
                <span className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold mb-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse" />
                  Live Sekarang
                </span>
                <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 max-w-2xl">
                  {banner.title?.general}{" "}
                  {banner.title?.focus?.text && (
                    <span className="text-[var(--primary)]">
                      {banner.title.focus.text}
                    </span>
                  )}
                </h1>
                {banner.supporting_text && (
                  <p className="text-sm md:text-base text-white/80 leading-relaxed max-w-xl mb-6">
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

            <div className="lg:col-span-4 grid grid-cols-2 gap-4">
              {stats.map((s, i) => (
                <div
                  key={i}
                  className="rounded-3xl bg-white p-5 border border-gray-100 flex flex-col justify-between"
                >
                  <div
                    className={`w-10 h-10 rounded-xl ${s.bg} ${s.color} flex items-center justify-center`}
                  >
                    <s.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 leading-none">
                      {s.value}
                    </p>
                    <p className="text-xs text-gray-500 mt-1.5">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Bento news grid */}
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
              {highlighted.slice(0, 5).map((item, i) => {
                const span =
                  i === 0
                    ? "md:col-span-2 md:row-span-2"
                    : i === 1
                    ? "md:col-span-2"
                    : "md:col-span-1";
                return (
                  <Link
                    key={item.contentId}
                    href={`/news/${item.contentId}`}
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

        {/* Latest news + side banner panel */}
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
                {allNews.slice(0, 6).map((item) => (
                  <Link
                    key={item.contentId}
                    href={`/news/${item.contentId}`}
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

              {sideBanners.slice(0, 2).map((b, i) => (
                <a
                  key={i}
                  href={b.url || "#"}
                  target={b.url ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="block relative rounded-3xl overflow-hidden h-44 bg-gray-100 hover:scale-[1.02] transition"
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
          </section>
        )}
      </main>

      {faq && faq.items.length > 0 && (
        <Demo4Faq title={faq.title} items={faq.items} />
      )}

      <Demo4Contact
        email={footerCfg.email || ""}
        phone={footerCfg.phonenum || ""}
        address={address}
        state={footerCfg.state || ""}
      />

      {/* Footer */}
      {footer && (
        <footer className="bg-gray-900 text-white">
          <div className="max-w-[1400px] mx-auto px-6 py-14">
            <div className="grid md:grid-cols-12 gap-10">
              <div className="md:col-span-5">
                {footer.image.image && (
                  <Image
                    src={footer.image.image}
                    alt="Logo"
                    width={56}
                    height={56}
                    className="mb-5 brightness-0 invert"
                  />
                )}
                <h3 className="text-xl font-bold mb-3">{footer.footer_title}</h3>
                <p className="text-sm text-white/60 leading-relaxed max-w-md">
                  {footer.text}
                </p>
              </div>
              <div className="md:col-span-3">
                <h4 className="text-xs uppercase tracking-wider font-bold text-white/40 mb-4">
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
                <h4 className="text-xs uppercase tracking-wider font-bold text-white/40 mb-4">
                  Sosial Media
                </h4>
                <div className="flex flex-wrap gap-2">
                  {footer.social_links.map((s, i) => (
                    <a
                      key={i}
                      href={s.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/15 flex items-center justify-center transition"
                    >
                      <Image
                        src={s.platform}
                        alt="Social"
                        width={16}
                        height={16}
                        className="brightness-0 invert"
                      />
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-xs text-white/40 text-center pt-10 border-t border-white/10 mt-10">
              {footer.copyright}
            </p>
          </div>
        </footer>
      )}

      <DemoSwitcher />
    </div>
  );
}
