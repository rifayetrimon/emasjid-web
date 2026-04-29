import Image from "@/components/ui/FallbackImage";
import Link from "next/link";
import BannerSlideshow from "@/components/main/BannerSlideshow";
import DemoSwitcher from "@/components/demos/DemoSwitcher";
import Demo7Nav from "@/components/demos/demo7/Nav";
import Demo7Faq from "@/components/demos/demo7/Faq";
import Demo7Contact from "@/components/demos/demo7/Contact";
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
import { ArrowRight, Sparkles, Heart, Star } from "lucide-react";

export const dynamic = "force-dynamic";

interface NewsItem {
  contentId: number;
  title: string;
  message: string;
  date: string;
  file1: string | null;
  altImg1: string;
}

export default async function Demo7Page() {
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
    "--primary": general.primaryColor || "#f43f5e",
    "--secondary": general.secondaryColor || "#fb7185",
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
    <div style={cssVars} className="bg-gradient-to-b from-rose-50/40 via-white to-amber-50/30 min-h-screen overflow-hidden">
      <Demo7Nav
        menuItems={nav.menuItems}
        logo={nav.logo}
        socialLinks={nav.socialLinks}
      />

      {/* Soft Hero with floating blobs */}
      {banner && banner.background_images?.length > 0 && (
        <section className="relative pt-8 pb-20 px-6 overflow-hidden">
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-rose-200/50 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/3 -left-32 w-[400px] h-[400px] bg-amber-200/50 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-[350px] h-[350px] bg-sky-200/40 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-6xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-rose-100 text-xs uppercase tracking-wider font-semibold text-rose-500 mb-7 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                Selamat Datang
              </span>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 leading-[1.05] tracking-tight mb-7">
                {banner.title?.general}{" "}
                {banner.title?.focus?.text && (
                  <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
                    {banner.title.focus.text}
                  </span>
                )}
              </h1>
              {banner.supporting_text && (
                <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto mb-10">
                  {banner.supporting_text}
                </p>
              )}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/news"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 text-white text-sm font-bold shadow-lg shadow-rose-200/60 hover:shadow-xl hover:shadow-rose-300/70 hover:-translate-y-0.5 transition-all"
                >
                  Mula Terokai
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#faq"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-gray-900 text-sm font-bold border border-gray-200 hover:border-gray-400 hover:-translate-y-0.5 transition-all"
                >
                  Ketahui Lebih
                </a>
              </div>
            </div>

            {/* Hero image as floating rounded card */}
            <div className="relative max-w-5xl mx-auto">
              <div className="relative h-[400px] md:h-[500px] rounded-[40px] overflow-hidden shadow-2xl shadow-rose-200/50 border-4 border-white">
                <BannerSlideshow
                  media={banner.background_images}
                  interval={6500}
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
              </div>
              {/* Floating badges */}
              <div className="absolute -top-5 -left-5 hidden md:flex items-center gap-2 bg-white rounded-full px-4 py-2.5 shadow-xl border border-gray-100">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-bold text-gray-900">5.0</span>
                <span className="text-xs text-gray-500">Rated</span>
              </div>
              <div className="absolute -bottom-5 -right-5 hidden md:flex items-center gap-2 bg-white rounded-full px-4 py-2.5 shadow-xl border border-gray-100">
                <Heart className="w-4 h-4 fill-rose-400 text-rose-400" />
                <span className="text-sm font-bold text-gray-900">12K+</span>
                <span className="text-xs text-gray-500">Pengguna</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Highlighted - soft pastel cards */}
      {highlighted.length > 0 && (
        <section className="relative py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <span className="inline-block px-4 py-1.5 rounded-full bg-amber-100 text-xs uppercase tracking-wider font-semibold text-amber-700 mb-4">
                Sorotan
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
                Berita Pilihan
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {highlighted.slice(0, 6).map((item, i) => {
                const tones = [
                  "from-rose-100 to-pink-200",
                  "from-amber-100 to-orange-200",
                  "from-sky-100 to-indigo-200",
                  "from-emerald-100 to-teal-200",
                  "from-violet-100 to-purple-200",
                  "from-yellow-100 to-amber-200",
                ];
                return (
                  <Link
                    key={item.contentId}
                    href={`/news/${item.contentId}`}
                    className="group block"
                  >
                    <div
                      className={`relative h-56 rounded-[32px] overflow-hidden mb-4 bg-gradient-to-br ${tones[i % tones.length]} p-3 transition-all group-hover:-translate-y-1 group-hover:shadow-xl shadow-md`}
                    >
                      <div className="relative w-full h-full rounded-3xl overflow-hidden bg-white">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.altImg1 || item.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                            sizes="(max-width:1024px) 50vw, 33vw"
                            priority={i === 0}
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300" />
                        )}
                      </div>
                    </div>
                    <div className="px-2">
                      <p className="text-xs font-semibold text-rose-500 mb-2">
                        {item.date}
                      </p>
                      <h3 className="text-lg font-bold text-gray-900 leading-snug line-clamp-2 mb-2 group-hover:text-rose-500 transition-colors">
                        {item.title}
                      </h3>
                      <span className="inline-flex items-center gap-1 text-sm text-gray-500 font-medium">
                        Baca lagi
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Latest news - clean rounded cards */}
      {allNews.length > 0 && (
        <section className="relative py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div>
                <span className="inline-block px-4 py-1.5 rounded-full bg-sky-100 text-xs uppercase tracking-wider font-semibold text-sky-700 mb-3">
                  Akhbar
                </span>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
                  Berita Terkini
                </h2>
              </div>
              <Link
                href="/news"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-white border border-gray-200 text-sm font-semibold text-gray-700 hover:border-rose-300 hover:text-rose-500 transition self-start md:self-auto"
              >
                Semua Berita
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allNews.slice(0, 6).map((item) => (
                <Link
                  key={item.contentId}
                  href={`/news/${item.contentId}`}
                  className="group block bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all"
                >
                  <div className="relative h-44 overflow-hidden bg-gray-100">
                    <Image
                      src={item.file1}
                      alt={item.altImg1 || item.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width:1024px) 50vw, 33vw"
                    />
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur text-[10px] uppercase tracking-wider font-bold text-gray-700">
                      {item.date}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-base font-bold text-gray-900 leading-snug line-clamp-2 mb-2 group-hover:text-rose-500 transition-colors">
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
              <div className="mt-10 grid md:grid-cols-3 gap-4">
                {sideBanners.slice(0, 3).map((b, i) => (
                  <a
                    key={i}
                    href={b.url || "#"}
                    target={b.url ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="block relative h-32 rounded-3xl overflow-hidden hover:scale-[1.02] transition-transform shadow-sm border border-gray-100"
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
          </div>
        </section>
      )}

      <div id="faq">
        {faq && faq.items.length > 0 && (
          <Demo7Faq title={faq.title} items={faq.items} />
        )}
      </div>

      <Demo7Contact
        email={footerCfg.email || ""}
        phone={footerCfg.phonenum || ""}
        address={address}
        state={footerCfg.state || ""}
      />

      {/* Footer - light pastel */}
      {footer && (
        <footer className="relative pt-16 pb-8 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-50 to-amber-50 -z-10" />
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-12 gap-8 pb-10 border-b border-rose-100">
              <div className="md:col-span-5">
                {footer.image.image && (
                  <Image
                    src={footer.image.image}
                    alt="Logo"
                    width={56}
                    height={56}
                    className="mb-4"
                  />
                )}
                <h3 className="text-2xl font-bold tracking-tight text-gray-900 mb-3">
                  {footer.footer_title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed max-w-md">
                  {footer.text}
                </p>
              </div>
              <div className="md:col-span-3">
                <h4 className="text-xs uppercase tracking-wider font-bold text-gray-500 mb-4">
                  Hubungi
                </h4>
                <div className="space-y-2 text-sm text-gray-700">
                  {footer.address && <p>{footer.address}</p>}
                  {footer.phone && (
                    <a href={`tel:${footer.phone}`} className="block hover:text-rose-500">
                      {footer.phone}
                    </a>
                  )}
                  {footer.email && (
                    <a
                      href={`mailto:${footer.email}`}
                      className="block hover:text-rose-500 break-all"
                    >
                      {footer.email}
                    </a>
                  )}
                </div>
              </div>
              <div className="md:col-span-4">
                <h4 className="text-xs uppercase tracking-wider font-bold text-gray-500 mb-4">
                  Sosial
                </h4>
                <div className="flex flex-wrap gap-2">
                  {footer.social_links.map((s, i) => (
                    <a
                      key={i}
                      href={s.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-white shadow-sm border border-rose-100 hover:bg-rose-50 hover:border-rose-300 flex items-center justify-center transition-all"
                    >
                      <Image
                        src={s.platform}
                        alt="Social"
                        width={16}
                        height={16}
                      />
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 text-center pt-6">
              {footer.copyright}
            </p>
          </div>
        </footer>
      )}

      <DemoSwitcher />
    </div>
  );
}
