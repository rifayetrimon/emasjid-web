import Image from "@/components/ui/FallbackImage";
import Link from "next/link";
import BannerSlideshow from "@/components/main/BannerSlideshow";
import DemoSwitcher from "@/components/demos/DemoSwitcher";
import Demo9Sidebar from "@/components/demos/demo9/Sidebar";
import Demo9Faq from "@/components/demos/demo9/Faq";
import Demo9Contact from "@/components/demos/demo9/Contact";
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
import { ArrowRight, Bookmark } from "lucide-react";

export const dynamic = "force-dynamic";

interface NewsItem {
  contentId: number;
  title: string;
  message: string;
  date: string;
  file1: string | null;
  altImg1: string;
}

export default async function Demo9Page() {
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
    "--primary": general.primaryColor || "#111827",
    "--secondary": general.secondaryColor || "#374151",
    "--text": general.textColor || "#111827",
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
    <div style={cssVars} className="bg-white min-h-screen">
      <Demo9Sidebar
        menuItems={nav.menuItems}
        logo={nav.logo}
        socialLinks={nav.socialLinks}
        email={footerCfg.email || ""}
        phone={footerCfg.phonenum || ""}
      />

      <main className="lg:ml-72">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 py-10 lg:py-14">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-gray-400 mb-8 font-mono">
            <Link href="/demo9" className="hover:text-gray-700">
              ~
            </Link>
            <span>/</span>
            <span className="text-gray-700">utama</span>
          </nav>

          {/* Hero — minimal reading-focused */}
          {banner && (
            <section className="mb-14">
              <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400 font-bold mb-3">
                §01 / Pengenalan
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.1] tracking-tight mb-5">
                {banner.title?.general}{" "}
                {banner.title?.focus?.text && (
                  <span className="text-gray-400 font-normal italic">
                    — {banner.title.focus.text}
                  </span>
                )}
              </h1>
              {banner.supporting_text && (
                <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mb-8">
                  {banner.supporting_text}
                </p>
              )}
              <div className="flex items-center gap-3 flex-wrap">
                <Link
                  href="/news"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-gray-900 hover:bg-black text-white text-sm font-semibold transition"
                >
                  Mula Membaca
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#faq"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-gray-200 hover:border-gray-400 text-gray-900 text-sm font-semibold transition"
                >
                  Soalan Lazim
                </a>
              </div>

              {banner.background_images?.length > 0 && (
                <div className="mt-10 relative h-[280px] md:h-[400px] rounded-xl overflow-hidden border border-gray-100">
                  <BannerSlideshow
                    media={banner.background_images}
                    interval={7000}
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
              )}
            </section>
          )}

          {/* Highlighted - clean list */}
          {highlighted.length > 0 && (
            <section className="mb-14 pt-14 border-t border-gray-100">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400 font-bold mb-2">
                    §02 / Sorotan
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                    Pilihan Editor
                  </h2>
                </div>
                <Link
                  href="/news"
                  className="text-sm text-gray-500 hover:text-gray-900 inline-flex items-center gap-1"
                >
                  Semua
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                {highlighted.slice(0, 4).map((item) => (
                  <Link
                    key={item.contentId}
                    href={`/news/${item.contentId}`}
                    className="group flex gap-4 p-4 -mx-4 rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className="relative w-24 h-24 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.altImg1 || item.title}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gray-200" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] uppercase tracking-wider text-gray-400 font-mono mb-1.5">
                        {item.date}
                      </p>
                      <h3 className="text-base font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-gray-700">
                        {item.title}
                      </h3>
                      <span className="inline-flex items-center gap-1 text-xs text-gray-500 mt-2 group-hover:text-gray-900">
                        Baca
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Latest news */}
          {allNews.length > 0 && (
            <section className="pt-14 border-t border-gray-100" id="news">
              <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400 font-bold mb-2">
                §03 / Berita
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-3">
                Berita Terkini
              </h2>
              <p className="text-gray-500 mb-8">
                Kemas kini terkini daripada pasukan kami.
              </p>

              <div className="divide-y divide-gray-100 border-y border-gray-100">
                {allNews.slice(0, 8).map((item) => (
                  <Link
                    key={item.contentId}
                    href={`/news/${item.contentId}`}
                    className="group flex items-start gap-5 py-5"
                  >
                    <Bookmark className="w-4 h-4 text-gray-300 flex-shrink-0 mt-1.5 group-hover:text-gray-900 transition" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] uppercase tracking-wider text-gray-400 font-mono mb-1">
                        {item.date}
                      </p>
                      <h3 className="text-base md:text-lg font-semibold text-gray-900 leading-snug group-hover:text-gray-700 mb-1">
                        {item.title}
                      </h3>
                      <div
                        className="text-sm text-gray-500 leading-relaxed line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: item.message }}
                      />
                    </div>
                    {item.file1 && (
                      <div className="hidden md:block relative w-32 h-20 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                        <Image
                          src={item.file1}
                          alt={item.altImg1 || item.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                          sizes="128px"
                        />
                      </div>
                    )}
                  </Link>
                ))}
              </div>

              {sideBanners.length > 0 && (
                <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {sideBanners.slice(0, 3).map((b, i) => (
                    <a
                      key={i}
                      href={b.url || "#"}
                      target={b.url ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="block relative h-28 rounded-md overflow-hidden border border-gray-100"
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

              <Link
                href="/news"
                className="inline-flex items-center gap-2 mt-8 text-sm font-semibold text-gray-900 hover:text-gray-600"
              >
                Lihat semua berita
                <ArrowRight className="w-4 h-4" />
              </Link>
            </section>
          )}

          {faq && faq.items.length > 0 && (
            <div id="faq">
              <Demo9Faq title={faq.title} items={faq.items} />
            </div>
          )}

          <Demo9Contact
            email={footerCfg.email || ""}
            phone={footerCfg.phonenum || ""}
            address={address}
            state={footerCfg.state || ""}
          />

          {/* Footer inline */}
          {footer && (
            <footer className="pt-10 mt-14 border-t border-gray-100">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
                <div className="flex items-center gap-3">
                  {footer.image.image && (
                    <Image
                      src={footer.image.image}
                      alt="Logo"
                      width={36}
                      height={36}
                    />
                  )}
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      {footer.footer_title}
                    </p>
                    <p className="text-xs text-gray-500">{footer.email}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  {footer.social_links.map((s, i) => (
                    <a
                      key={i}
                      href={s.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-md hover:bg-gray-100 flex items-center justify-center transition"
                    >
                      <Image
                        src={s.platform}
                        alt="Social"
                        width={14}
                        height={14}
                      />
                    </a>
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-400 font-mono">
                {footer.copyright}
              </p>
            </footer>
          )}
        </div>
      </main>

      <DemoSwitcher />
    </div>
  );
}
