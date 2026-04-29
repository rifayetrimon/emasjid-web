import Image from "@/components/ui/FallbackImage";
import Link from "next/link";
import BannerSlideshow from "@/components/main/BannerSlideshow";
import DemoSwitcher from "@/components/demos/DemoSwitcher";
import Demo6Nav from "@/components/demos/demo6/Nav";
import Demo6Faq from "@/components/demos/demo6/Faq";
import Demo6Contact from "@/components/demos/demo6/Contact";
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

export const dynamic = "force-dynamic";

interface NewsItem {
  contentId: number;
  title: string;
  message: string;
  date: string;
  file1: string | null;
  altImg1: string;
}

export default async function Demo6Page() {
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
    "--primary": general.primaryColor || "#facc15",
    "--secondary": general.secondaryColor || "#000000",
    "--text": general.textColor || "#000000",
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
      <Demo6Nav
        menuItems={nav.menuItems}
        logo={nav.logo}
        socialLinks={nav.socialLinks}
      />

      {/* Brutalist hero */}
      {banner && banner.background_images?.length > 0 && (
        <section className="border-b-[3px] border-black">
          <div className="grid lg:grid-cols-12 min-h-[600px]">
            <div className="lg:col-span-7 border-r-0 lg:border-r-[3px] border-black px-6 md:px-12 py-14 lg:py-20 flex flex-col justify-between">
              <div>
                <p className="text-[11px] font-mono uppercase tracking-[0.25em] mb-6 font-bold">
                  Edisi {String(allNews.length).padStart(3, "0")} / {new Date().getFullYear()}
                </p>
                <h1 className="text-6xl md:text-8xl lg:text-[8rem] font-black uppercase tracking-tighter leading-[0.85] text-black">
                  {banner.title?.general}
                </h1>
                {banner.title?.focus?.text && (
                  <h1 className="text-6xl md:text-8xl lg:text-[8rem] font-black uppercase tracking-tighter leading-[0.85] mt-1">
                    <span className="bg-yellow-400 px-4 -mx-1 inline-block">
                      {banner.title.focus.text}.
                    </span>
                  </h1>
                )}
              </div>
              <div className="mt-10 lg:mt-0 max-w-md">
                {banner.supporting_text && (
                  <p className="text-base leading-relaxed text-gray-700 mb-6">
                    {banner.supporting_text}
                  </p>
                )}
                <div className="flex items-center gap-4">
                  <Link
                    href="/news"
                    className="inline-flex items-center gap-3 px-6 py-3 bg-black text-white font-bold uppercase text-xs tracking-[0.2em] hover:bg-yellow-400 hover:text-black border-[3px] border-black transition-colors"
                  >
                    Baca Berita
                    <span className="text-lg">→</span>
                  </Link>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-gray-500">
                    {allNews.length} Artikel
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative min-h-[400px] lg:min-h-full bg-black">
              <BannerSlideshow
                media={banner.background_images}
                interval={6000}
              />
              {banner.overlayColor && (
                <div
                  className="absolute inset-0 pointer-events-none mix-blend-multiply"
                  style={{
                    backgroundColor: banner.overlayColor,
                    opacity: (banner.overlayOpacity || 0) / 100,
                  }}
                />
              )}
              <div className="absolute top-4 left-4 px-3 py-1 bg-yellow-400 border-2 border-black text-[10px] font-mono font-bold uppercase tracking-wider z-10">
                ● Live
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Highlighted - oversized numbered list */}
      {highlighted.length > 0 && (
        <section className="border-b-[3px] border-black">
          <div className="grid lg:grid-cols-12 items-center px-6 md:px-12 py-6 border-b-[3px] border-black bg-yellow-400">
            <div className="lg:col-span-8">
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none">
                Sorotan / Pilihan Editor
              </h2>
            </div>
            <div className="lg:col-span-4 lg:text-right mt-3 lg:mt-0">
              <Link
                href="/news"
                className="text-[11px] font-mono uppercase tracking-[0.25em] font-bold border-b-2 border-black hover:bg-black hover:text-yellow-400 px-2 py-1"
              >
                Lihat Semua →
              </Link>
            </div>
          </div>

          <div className="divide-y-[3px] divide-black">
            {highlighted.slice(0, 5).map((item, i) => (
              <Link
                key={item.contentId}
                href={`/news/${item.contentId}`}
                className="group grid grid-cols-12 gap-4 md:gap-8 items-center px-6 md:px-12 py-6 md:py-10 hover:bg-black hover:text-white transition-colors"
              >
                <span className="col-span-2 md:col-span-1 text-3xl md:text-5xl font-black tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="col-span-10 md:col-span-7">
                  <p className="text-[10px] font-mono uppercase tracking-[0.25em] font-bold mb-2 text-gray-500 group-hover:text-yellow-400">
                    {item.date}
                  </p>
                  <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tight leading-[0.95]">
                    {item.title}
                  </h3>
                </div>
                <div className="hidden md:block col-span-4 relative h-32 bg-gray-100 group-hover:opacity-90 transition-opacity overflow-hidden">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.altImg1 || item.title}
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      sizes="33vw"
                    />
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Latest news grid */}
      {allNews.length > 0 && (
        <section className="border-b-[3px] border-black">
          <div className="px-6 md:px-12 py-6 border-b-[3px] border-black flex items-center justify-between">
            <p className="text-[11px] font-mono uppercase tracking-[0.25em] font-bold">
              §04 / Berita Terkini
            </p>
            <p className="text-[11px] font-mono uppercase tracking-[0.25em] font-bold text-gray-500">
              {allNews.length.toString().padStart(3, "0")} Item
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y-[3px] md:divide-y-0 md:divide-x-[3px] lg:divide-x-[3px] divide-black border-b-0">
            {allNews.slice(0, 6).map((item, i) => (
              <Link
                key={item.contentId}
                href={`/news/${item.contentId}`}
                className={`group p-6 md:p-8 hover:bg-yellow-400 transition-colors ${
                  i >= 3 ? "border-t-[3px] border-black" : ""
                }`}
              >
                <div className="relative w-full h-44 mb-5 bg-gray-100 overflow-hidden border-[3px] border-black">
                  <Image
                    src={item.file1}
                    alt={item.altImg1 || item.title}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    sizes="33vw"
                  />
                </div>
                <p className="text-[10px] font-mono uppercase tracking-[0.25em] font-bold mb-2 text-gray-500 group-hover:text-black">
                  {item.date} · #{String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="text-lg md:text-xl font-black uppercase tracking-tight leading-tight line-clamp-3">
                  {item.title}
                </h3>
              </Link>
            ))}
          </div>

          {sideBanners.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y-[3px] md:divide-y-0 md:divide-x-[3px] divide-black border-t-[3px] border-black">
              {sideBanners.slice(0, 3).map((b, i) => (
                <a
                  key={i}
                  href={b.url || "#"}
                  target={b.url ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="block relative h-32 bg-gray-100 overflow-hidden"
                >
                  <Image
                    src={b.src}
                    alt={`Iklan ${i + 1}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform"
                  />
                </a>
              ))}
            </div>
          )}
        </section>
      )}

      {faq && faq.items.length > 0 && (
        <Demo6Faq title={faq.title} items={faq.items} />
      )}

      <Demo6Contact
        email={footerCfg.email || ""}
        phone={footerCfg.phonenum || ""}
        address={address}
        state={footerCfg.state || ""}
      />

      {/* Footer */}
      {footer && (
        <footer className="bg-black text-white">
          <div className="grid lg:grid-cols-12 items-stretch">
            <div className="lg:col-span-5 border-r-0 lg:border-r-[3px] border-white/20 p-8 md:p-12">
              {footer.image.image && (
                <Image
                  src={footer.image.image}
                  alt="Logo"
                  width={64}
                  height={64}
                  className="mb-5 brightness-0 invert"
                />
              )}
              <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-none mb-4">
                {footer.footer_title}
              </h3>
              <p className="text-sm text-white/60 leading-relaxed max-w-md">
                {footer.text}
              </p>
            </div>
            <div className="lg:col-span-4 border-r-0 lg:border-r-[3px] border-t-[3px] lg:border-t-0 border-white/20 p-8 md:p-12">
              <p className="text-[11px] font-mono uppercase tracking-[0.25em] mb-5 font-bold text-yellow-400">
                §07 / Hubungi
              </p>
              <div className="space-y-3 font-mono text-sm">
                {footer.address && <p>{footer.address}</p>}
                {footer.phone && (
                  <p>
                    <a href={`tel:${footer.phone}`} className="hover:text-yellow-400">
                      {footer.phone}
                    </a>
                  </p>
                )}
                {footer.email && (
                  <p>
                    <a
                      href={`mailto:${footer.email}`}
                      className="hover:text-yellow-400 break-all"
                    >
                      {footer.email}
                    </a>
                  </p>
                )}
              </div>
            </div>
            <div className="lg:col-span-3 border-t-[3px] lg:border-t-0 border-white/20 p-8 md:p-12">
              <p className="text-[11px] font-mono uppercase tracking-[0.25em] mb-5 font-bold text-yellow-400">
                §08 / Sosial
              </p>
              <div className="flex flex-wrap gap-2">
                {footer.social_links.map((s, i) => (
                  <a
                    key={i}
                    href={s.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 border-2 border-white/40 hover:border-yellow-400 hover:bg-yellow-400 flex items-center justify-center transition-colors group"
                  >
                    <Image
                      src={s.platform}
                      alt="Social"
                      width={16}
                      height={16}
                      className="brightness-0 invert group-hover:invert-0"
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t-[3px] border-white/20 px-8 py-4 flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] uppercase tracking-[0.2em]">
            <span>{footer.copyright}</span>
            <span className="text-yellow-400">eMasjid · Edisi {new Date().getFullYear()}</span>
          </div>
        </footer>
      )}

      <DemoSwitcher />
    </div>
  );
}
