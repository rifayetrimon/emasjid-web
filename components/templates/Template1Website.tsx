import Image from "@/components/ui/FallbackImage";
import Link from "next/link";
import BannerSlideshow from "@/components/main/BannerSlideshow";
import TemplateLayout from "@/components/TemplateLayout";
import Demo7Faq from "@/components/demos/demo7/Faq";
import Demo7Contact from "@/components/demos/demo7/Contact";
import { getBannerData } from "@/services/bannerService";
import { getNewsData } from "@/services/newsService";
import { getFaqData } from "@/services/faqService";
import {
  getCachedConfig,
  getCachedNews,
  getCachedSideBanner,
} from "@/services/apiCache";
import { ArrowRight, Sparkles } from "lucide-react";

interface NewsItem {
  contentId: number;
  title: string;
  message: string;
  date: string;
  file1: string | null;
  altImg1: string;
}

export default async function Template1Website() {
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
    <TemplateLayout templateId="1">
      {/* Soft Hero with floating blobs */}
      {banner && banner.background_images?.length > 0 && (
        <section className="relative pt-8 pb-20 px-6 overflow-hidden">
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-rose-200/50 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/3 -left-32 w-[400px] h-[400px] bg-amber-200/50 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-[350px] h-[350px] bg-sky-200/40 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-6xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-[var(--primary)]/20 text-xs uppercase tracking-[0.2em] font-bold text-[var(--primary)] mb-7 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                Selamat Datang
              </span>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 leading-[1.05] tracking-tight mb-7">
                {banner.title?.general}{" "}
                {banner.title?.focus?.text && (
                  <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent">
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
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] text-white text-sm font-bold shadow-lg shadow-rose-200/60 hover:shadow-xl hover:shadow-rose-300/70 hover:-translate-y-0.5 transition-all"
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
              {/* Soft decorative dots — visual interest without fake claims */}
              <div className="absolute -top-3 -left-3 hidden md:flex items-center gap-1.5 bg-white rounded-full px-3.5 py-2 shadow-xl border border-gray-100">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--secondary)] opacity-70" />
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] opacity-40" />
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
              <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--primary)]/10 text-xs uppercase tracking-[0.2em] font-bold text-[var(--primary)] mb-4">
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
                      <p className="text-xs font-semibold text-[var(--primary)] mb-2">
                        {item.date}
                      </p>
                      <h3 className="text-lg font-bold text-gray-900 leading-snug line-clamp-2 mb-2 group-hover:text-[var(--primary)] transition-colors">
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
                <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--secondary)]/10 text-xs uppercase tracking-[0.2em] font-bold text-[var(--secondary)] mb-3">
                  Akhbar
                </span>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
                  Berita Terkini
                </h2>
              </div>
              <Link
                href="/news"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-white border border-gray-200 text-sm font-semibold text-gray-700 hover:border-[var(--primary)]/40 hover:text-[var(--primary)] transition self-start md:self-auto"
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
                    <h3 className="text-base font-bold text-gray-900 leading-snug line-clamp-2 mb-2 group-hover:text-[var(--primary)] transition-colors">
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
    </TemplateLayout>
  );
}
