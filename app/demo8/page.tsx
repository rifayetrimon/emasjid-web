import Image from "@/components/ui/FallbackImage";
import Link from "next/link";
import BannerSlideshow from "@/components/main/BannerSlideshow";
import DemoSwitcher from "@/components/demos/DemoSwitcher";
import Demo8Nav from "@/components/demos/demo8/Nav";
import Demo8Carousel from "@/components/demos/demo8/Carousel";
import Demo8Faq from "@/components/demos/demo8/Faq";
import Demo8Contact from "@/components/demos/demo8/Contact";
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
import { Play, Info } from "lucide-react";

export const dynamic = "force-dynamic";

interface NewsItem {
  contentId: number;
  title: string;
  message: string;
  date: string;
  file1: string | null;
  altImg1: string;
}

export default async function Demo8Page() {
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
    "--primary": general.primaryColor || "#fbbf24",
    "--secondary": general.secondaryColor || "#f59e0b",
    "--text": general.textColor || "#ffffff",
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
    <div style={cssVars} className="bg-black min-h-screen text-white">
      <Demo8Nav
        menuItems={nav.menuItems}
        logo={nav.logo}
        socialLinks={nav.socialLinks}
      />

      {/* Cinematic full-screen hero */}
      {banner && banner.background_images?.length > 0 && (
        <section className="relative h-screen min-h-[700px] overflow-hidden">
          <BannerSlideshow media={banner.background_images} interval={8000} />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          {banner.overlayColor && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundColor: banner.overlayColor,
                opacity: (banner.overlayOpacity || 0) / 100,
              }}
            />
          )}

          <div className="relative h-full flex flex-col justify-end">
            <div className="max-w-[1400px] mx-auto px-6 md:px-8 pb-20 md:pb-28 w-full">
              <div className="max-w-2xl">
                <p className="text-xs md:text-sm uppercase tracking-[0.4em] text-amber-400 font-semibold mb-5">
                  Original eMasjid
                </p>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tight mb-5">
                  {banner.title?.general}{" "}
                  {banner.title?.focus?.text && (
                    <span className="block text-amber-400 italic font-bold mt-2">
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
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded bg-white text-black text-sm font-bold hover:bg-amber-400 transition"
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

          {/* Bottom gradient stub for blending */}
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

      {/* About / billboard panel */}
      <section id="about" className="py-20 px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-zinc-900 to-zinc-950 border border-white/5 p-10 md:p-16">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.15),transparent_50%)] pointer-events-none" />
            <div className="relative grid md:grid-cols-2 gap-10 items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-amber-400 font-semibold mb-4">
                  Tentang Kami
                </p>
                <h2 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight mb-5">
                  Platform Pengurusan Masjid{" "}
                  <span className="text-amber-400 italic">moden.</span>
                </h2>
                <p className="text-white/70 leading-relaxed mb-8 max-w-md">
                  Sistem yang membantu masjid menjalankan urusan pengurusan
                  dengan lebih cekap, tersusun dan patuh kepada ketetapan
                  semasa.
                </p>
                <div className="grid grid-cols-3 gap-5 mb-8">
                  <Stat label="Artikel" value={allNews.length || 0} />
                  <Stat label="Sorotan" value={highlighted.length || 0} />
                  <Stat label="Sokongan" value="24/7" />
                </div>
                <Link
                  href="/news"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded bg-amber-400 hover:bg-amber-300 text-black text-sm font-bold transition"
                >
                  Mula Sekarang
                </Link>
              </div>
              {sideBanners[0] && (
                <div className="relative h-[300px] md:h-[400px] rounded-xl overflow-hidden">
                  <Image
                    src={sideBanners[0].src}
                    alt="Featured"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {faq && faq.items.length > 0 && (
        <Demo8Faq title={faq.title} items={faq.items} />
      )}

      <Demo8Contact
        email={footerCfg.email || ""}
        phone={footerCfg.phonenum || ""}
        address={address}
        state={footerCfg.state || ""}
      />

      {/* Footer */}
      {footer && (
        <footer className="bg-black border-t border-white/5 py-14 px-6">
          <div className="max-w-[1400px] mx-auto">
            <div className="grid md:grid-cols-12 gap-10 pb-10 border-b border-white/10">
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
                <h3 className="text-xl font-bold mb-3">
                  {footer.footer_title}
                </h3>
                <p className="text-sm text-white/50 leading-relaxed max-w-md">
                  {footer.text}
                </p>
              </div>
              <div className="md:col-span-3">
                <h4 className="text-xs uppercase tracking-[0.25em] font-bold text-amber-400 mb-4">
                  Hubungi
                </h4>
                <div className="space-y-2 text-sm text-white/70">
                  {footer.address && <p>{footer.address}</p>}
                  {footer.phone && (
                    <a href={`tel:${footer.phone}`} className="block hover:text-amber-400">
                      {footer.phone}
                    </a>
                  )}
                  {footer.email && (
                    <a
                      href={`mailto:${footer.email}`}
                      className="block hover:text-amber-400 break-all"
                    >
                      {footer.email}
                    </a>
                  )}
                </div>
              </div>
              <div className="md:col-span-4">
                <h4 className="text-xs uppercase tracking-[0.25em] font-bold text-amber-400 mb-4">
                  Sosial
                </h4>
                <div className="flex flex-wrap gap-2">
                  {footer.social_links.map((s, i) => (
                    <a
                      key={i}
                      href={s.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full border border-white/15 hover:border-amber-400 hover:bg-amber-400/10 flex items-center justify-center transition"
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

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-2xl md:text-3xl font-bold text-amber-400 leading-none">
        {value}
      </p>
      <p className="text-xs text-white/50 mt-1.5 uppercase tracking-wider">
        {label}
      </p>
    </div>
  );
}
