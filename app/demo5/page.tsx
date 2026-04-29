import Image from "@/components/ui/FallbackImage";
import Link from "next/link";
import BannerSlideshow from "@/components/main/BannerSlideshow";
import DemoSwitcher from "@/components/demos/DemoSwitcher";
import Demo5Nav from "@/components/demos/demo5/Nav";
import Demo5Faq from "@/components/demos/demo5/Faq";
import Demo5Contact from "@/components/demos/demo5/Contact";
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
      <div className="h-[1px] w-20 bg-[#a47133]" />
      <StarOrnament className="text-[#a47133] w-5 h-5" />
      <div className="h-[1px] w-20 bg-[#a47133]" />
    </div>
  );
}

export default async function Demo5Page() {
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
    "--text": general.textColor || "#0c3d3c",
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
    <div style={cssVars} className="bg-[#fdfaf3]">
      <Demo5Nav
        menuItems={nav.menuItems}
        logo={nav.logo}
        socialLinks={nav.socialLinks}
      />

      {/* Heritage Hero — framed centered composition */}
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
            <div className="border-[6px] border-double border-[#a47133] p-2 bg-[#fdfaf3]">
              <div className="border border-[#a47133]/40 relative">
                <div className="relative h-[420px] md:h-[560px] overflow-hidden">
                  <BannerSlideshow
                    media={banner.background_images}
                    interval={7000}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#0c3d3c]/30 via-[#0c3d3c]/50 to-[#0c3d3c]/85" />
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
                      className="inline-flex items-center gap-3 px-8 py-3 bg-[#a47133] hover:bg-[#e8d5a8] hover:text-[#0c3d3c] text-[#fdfaf3] text-xs uppercase tracking-[0.2em] font-bold transition-colors border-2 border-[#e8d5a8]/30"
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

      {/* Highlighted news - timeline / tile cards */}
      {highlighted.length > 0 && (
        <section className="py-20 px-6 bg-[#fdfaf3]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <Divider className="mb-5" />
              <p className="text-xs uppercase tracking-[0.3em] text-[#a47133] mb-3 font-bold">
                Pilihan Pintar
              </p>
              <h2
                className="text-4xl md:text-5xl font-bold text-[#0c3d3c]"
                style={{ fontFamily: "'Times New Roman', serif" }}
              >
                Sorotan Berita
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {highlighted.slice(0, 6).map((item, i) => (
                <Link
                  key={item.contentId}
                  href={`/news/${item.contentId}`}
                  className="group block"
                >
                  <div
                    className="border-[3px] border-double border-[#a47133] p-1.5 bg-[#fdfaf3] hover:border-[#0c3d3c] transition-colors"
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
                        <div className="absolute inset-0 bg-gradient-to-br from-[#0c3d3c] to-[#0c3d3c]/60" />
                      )}
                      <div className="absolute top-3 left-3 px-3 py-1 bg-[#a47133] text-[#fdfaf3] text-[10px] font-bold uppercase tracking-wider">
                        {item.date}
                      </div>
                    </div>
                  </div>
                  <div className="px-2 pt-5 text-center">
                    <h3
                      className="text-lg font-bold text-[#0c3d3c] leading-snug line-clamp-2 group-hover:text-[#a47133] transition-colors mb-2"
                      style={{ fontFamily: "'Times New Roman', serif" }}
                    >
                      {item.title}
                    </h3>
                    <div
                      className="text-sm text-[#0c3d3c]/70 leading-relaxed line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: item.message }}
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* News list with framed thumbnails */}
      {allNews.length > 0 && (
        <section className="py-20 px-6 bg-[#f5e9d0]/40 border-y-2 border-[#d4b88a]/40">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <Divider className="mb-5" />
              <p className="text-xs uppercase tracking-[0.3em] text-[#a47133] mb-3 font-bold">
                Akhbar
              </p>
              <h2
                className="text-4xl md:text-5xl font-bold text-[#0c3d3c]"
                style={{ fontFamily: "'Times New Roman', serif" }}
              >
                Berita Terkini
              </h2>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {allNews.slice(0, 6).map((item) => (
                  <Link
                    key={item.contentId}
                    href={`/news/${item.contentId}`}
                    className="group flex flex-col sm:flex-row gap-5 bg-[#fdfaf3] border-2 border-[#d4b88a]/50 hover:border-[#a47133] transition-colors p-4"
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
                      <p className="text-xs uppercase tracking-wider text-[#a47133] mb-2 font-bold">
                        {item.date}
                      </p>
                      <h3
                        className="text-lg font-bold text-[#0c3d3c] leading-snug line-clamp-2 group-hover:text-[#a47133] transition mb-2"
                        style={{ fontFamily: "'Times New Roman', serif" }}
                      >
                        {item.title}
                      </h3>
                      <div
                        className="text-sm text-[#0c3d3c]/70 leading-relaxed line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: item.message }}
                      />
                      <span className="inline-block mt-3 text-xs font-bold uppercase tracking-wider text-[#a47133] hover:text-[#0c3d3c] transition">
                        Baca &rarr;
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              <aside className="space-y-5">
                <div
                  className="bg-[#0c3d3c] text-[#fdfaf3] p-6 text-center"
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
                    Petikan Hari Ini
                  </h3>
                  <p className="text-sm text-[#fdfaf3]/85 leading-relaxed italic">
                    &ldquo;Sebaik-baik manusia adalah yang paling bermanfaat
                    kepada manusia lain.&rdquo;
                  </p>
                </div>

                {sideBanners.slice(0, 2).map((b, i) => (
                  <a
                    key={i}
                    href={b.url || "#"}
                    target={b.url ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="block relative h-72 md:h-80 border-2 border-[#a47133] overflow-hidden bg-[#f5e9d0]"
                  >
                    <Image
                      src={b.src}
                      alt={`Iklan ${i + 1}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </a>
                ))}
              </aside>
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/news"
                className="inline-flex items-center gap-3 px-10 py-3 border-2 border-[#a47133] text-[#0c3d3c] text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#a47133] hover:text-[#fdfaf3] transition-colors"
                style={{ fontFamily: "'Times New Roman', serif" }}
              >
                Semua Berita
              </Link>
            </div>
          </div>
        </section>
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

      {/* Footer */}
      {footer && (
        <footer className="bg-[#082a29] text-[#e8d5a8] py-16 px-6 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cpath d='M20 5 L25 15 L35 17 L27 25 L29 35 L20 30 L11 35 L13 25 L5 17 L15 15 Z' fill='none' stroke='%23e8d5a8' stroke-width='0.5'/%3E%3C/svg%3E")`,
              backgroundSize: "40px 40px",
            }}
          />
          <div className="relative max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Divider className="mb-6 [&>div]:bg-[#e8d5a8]/40 [&>svg]:text-[#e8d5a8]" />
            </div>
            <div className="grid md:grid-cols-3 gap-10 pb-10 border-b border-[#e8d5a8]/20 text-center md:text-left">
              <div>
                {footer.image.image && (
                  <div className="flex md:justify-start justify-center mb-5">
                    <Image
                      src={footer.image.image}
                      alt="Logo"
                      width={70}
                      height={70}
                      className="brightness-0 invert opacity-90"
                    />
                  </div>
                )}
                <h3
                  className="text-2xl font-bold mb-3 text-[#fdfaf3]"
                  style={{ fontFamily: "'Times New Roman', serif" }}
                >
                  {footer.footer_title}
                </h3>
                <p className="text-sm text-[#e8d5a8]/70 leading-relaxed">
                  {footer.text}
                </p>
              </div>
              <div>
                <h4
                  className="text-sm uppercase tracking-[0.2em] font-bold mb-4 text-[#fdfaf3]"
                  style={{ fontFamily: "'Times New Roman', serif" }}
                >
                  Hubungi
                </h4>
                <div className="space-y-2 text-sm text-[#e8d5a8]/80">
                  {footer.address && <p>{footer.address}</p>}
                  {footer.phone && (
                    <a
                      href={`tel:${footer.phone}`}
                      className="block hover:text-[#fdfaf3]"
                    >
                      {footer.phone}
                    </a>
                  )}
                  {footer.email && (
                    <a
                      href={`mailto:${footer.email}`}
                      className="block hover:text-[#fdfaf3] break-all"
                    >
                      {footer.email}
                    </a>
                  )}
                </div>
              </div>
              <div>
                <h4
                  className="text-sm uppercase tracking-[0.2em] font-bold mb-4 text-[#fdfaf3]"
                  style={{ fontFamily: "'Times New Roman', serif" }}
                >
                  Ikuti
                </h4>
                <div className="flex flex-wrap gap-3 md:justify-start justify-center">
                  {footer.social_links.map((s, i) => (
                    <a
                      key={i}
                      href={s.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full border-2 border-[#e8d5a8]/30 hover:border-[#e8d5a8] hover:bg-[#e8d5a8]/10 flex items-center justify-center transition"
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
            <p className="text-xs text-[#e8d5a8]/50 text-center pt-8 uppercase tracking-[0.2em]">
              {footer.copyright}
            </p>
          </div>
        </footer>
      )}

      <DemoSwitcher />
    </div>
  );
}
