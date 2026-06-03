import Image from "@/components/ui/FallbackImage";
import Link from "next/link";
import BannerSlideshow from "@/components/main/BannerSlideshow";
import TemplateLayout from "@/components/TemplateLayout";
import Demo2Faq from "@/components/demos/demo2/Faq";
import Demo2Contact from "@/components/demos/demo2/Contact";
import { getBannerData } from "@/services/bannerService";
import { getNewsData } from "@/services/newsService";
import { getFaqData } from "@/services/faqService";
import {
  getCachedConfig,
  getCachedNews,
  getCachedSideBanner,
} from "@/services/apiCache";

interface NewsItem {
  contentId: number;
  title: string;
  message: string;
  date: string;
  time?: string;
  file1: string | null;
  altImg1: string;
}

export default async function Template4Corporate() {
  const [
    banner,
    highlighted,
    newsRaw,
    sideBannerRaw,
    faq,
    config,
  ] = await Promise.all([
    getBannerData(),
    getNewsData(),
    getCachedNews(),
    getCachedSideBanner(),
    getFaqData(),
    getCachedConfig(),
  ]);

  const footerCfg = config.footerConfig || {};

  const allNews: NewsItem[] = (newsRaw?.dataset ||
    (Array.isArray(newsRaw) ? newsRaw : [])) as unknown as NewsItem[];

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

  const featured = highlighted[0];
  const restHighlights = highlighted.slice(1, 5);

  return (
    <TemplateLayout templateId="4">
      {banner && banner.background_images?.length > 0 && (
        <section className="relative">
          <div className="grid lg:grid-cols-12 gap-0">
            <div className="lg:col-span-5 px-6 lg:px-16 py-16 lg:py-28 flex flex-col justify-center">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--secondary)] mb-6 font-bold">
                Edisi Terkini
              </p>
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.05] mb-6"
                style={{ fontFamily: "Georgia, serif" }}
              >
                {banner.title?.general}{" "}
                {banner.title?.focus?.text && (
                  <span className="italic text-[var(--secondary)]">
                    {banner.title.focus.text}
                  </span>
                )}
              </h1>
              {banner.supporting_text && (
                <p className="text-base text-gray-600 leading-relaxed mb-8 max-w-md">
                  {banner.supporting_text}
                </p>
              )}
              <div className="flex items-center gap-4">
                <Link
                  href="/news"
                  className="inline-flex items-center gap-2 bg-gray-900 text-white px-7 py-3 text-xs uppercase tracking-[0.2em] font-bold hover:bg-[var(--secondary)] transition-colors"
                >
                  Baca Berita
                </Link>
                <span className="text-xs text-gray-500 uppercase tracking-wider">
                  {allNews.length} Artikel
                </span>
              </div>
            </div>
            <div className="lg:col-span-7 relative h-[400px] lg:h-[640px]">
              <BannerSlideshow
                media={banner.background_images}
                interval={6500}
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
            </div>
          </div>
        </section>
      )}

      {featured && (
        <section className="py-16 px-6 border-t border-gray-200">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-10 border-b border-gray-200 pb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--secondary)] mb-2 font-bold">
                  Sorotan
                </p>
                <h2
                  className="text-3xl md:text-4xl font-bold text-gray-900"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  Pilihan Editor
                </h2>
              </div>
              <Link
                href="/news"
                className="hidden md:inline text-xs uppercase tracking-[0.2em] font-bold text-gray-700 hover:text-[var(--secondary)]"
              >
                Lihat Semua &rarr;
              </Link>
            </div>

            <div className="grid lg:grid-cols-12 gap-8">
              <Link
                href={`/news/${featured.contentId}`}
                className="lg:col-span-7 group"
              >
                <div className="relative w-full h-[300px] md:h-[460px] mb-5 overflow-hidden bg-gray-100">
                  {featured.image ? (
                    <Image
                      src={featured.image}
                      alt={featured.altImg1 || featured.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width:1024px) 100vw, 60vw"
                      priority
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900" />
                  )}
                </div>
                <p className="text-xs uppercase tracking-wider text-[var(--secondary)] mb-2 font-bold">
                  {featured.date}
                </p>
                <h3
                  className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-[var(--secondary)] transition-colors"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  {featured.title}
                </h3>
                <div
                  className="text-sm text-gray-600 leading-relaxed line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: featured.message }}
                />
              </Link>

              <div className="lg:col-span-5 space-y-6">
                {restHighlights.map((item) => (
                  <Link
                    key={item.contentId}
                    href={`/news/${item.contentId}`}
                    className="group flex gap-4 pb-6 border-b border-gray-200 last:border-0"
                  >
                    <div className="relative w-32 h-24 flex-shrink-0 overflow-hidden bg-gray-100">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.altImg1 || item.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                          sizes="128px"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gray-200" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] uppercase tracking-wider text-[var(--secondary)] mb-1.5 font-bold">
                        {item.date}
                      </p>
                      <h4
                        className="text-base font-bold text-gray-900 leading-snug line-clamp-3 group-hover:text-[var(--secondary)] transition-colors"
                        style={{ fontFamily: "Georgia, serif" }}
                      >
                        {item.title}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {allNews.length > 0 && (
        <section className="py-20 px-6 bg-gray-50 border-t border-gray-200">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--secondary)] mb-3 font-bold">
                Akhbar
              </p>
              <h2
                className="text-4xl md:text-5xl font-bold text-gray-900"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Berita Terkini
              </h2>
            </div>

            <div className="grid lg:grid-cols-3 gap-px bg-gray-200">
              {allNews.slice(0, 9).map((item) => (
                <Link
                  key={item.contentId}
                  href={`/news/${item.contentId}`}
                  className="group bg-white p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="relative w-full h-44 mb-4 overflow-hidden bg-gray-100">
                    <Image
                      src={item.file1}
                      alt={item.altImg1 || item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width:1024px) 100vw, 33vw"
                    />
                  </div>
                  <p className="text-[10px] uppercase tracking-wider text-[var(--secondary)] mb-2 font-bold">
                    {item.date}
                  </p>
                  <h3
                    className="text-lg font-bold text-gray-900 leading-snug mb-2 line-clamp-2 group-hover:text-[var(--secondary)] transition-colors"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    {item.title}
                  </h3>
                  <div
                    className="text-sm text-gray-600 leading-relaxed line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: item.message }}
                  />
                </Link>
              ))}
            </div>

            {sideBanners.length > 0 && (
              <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sideBanners.slice(0, 3).map((b, i) => (
                  <a
                    key={i}
                    href={b.url || "#"}
                    target={b.url ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="block relative h-40 overflow-hidden bg-gray-100"
                  >
                    <Image
                      src={b.src}
                      alt={`Iklan ${i + 1}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </a>
                ))}
              </div>
            )}

            <div className="mt-12 text-center">
              <Link
                href="/news"
                className="inline-flex items-center gap-2 border border-gray-900 text-gray-900 px-10 py-3.5 text-xs uppercase tracking-[0.2em] font-bold hover:bg-[var(--secondary)] hover:border-[var(--secondary)] hover:text-white transition-colors"
              >
                Lihat Semua Berita
              </Link>
            </div>
          </div>
        </section>
      )}

      {faq && faq.items.length > 0 && (
        <Demo2Faq title={faq.title} items={faq.items} />
      )}

      <Demo2Contact
        email={footerCfg.email || ""}
        phone={footerCfg.phonenum || ""}
        address={address}
        state={footerCfg.state || ""}
      />
    </TemplateLayout>
  );
}
