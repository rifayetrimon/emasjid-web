"use client";

import { Suspense } from "react";
import Image from "@/components/ui/FallbackImage";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import TemplateLayout from "@/components/TemplateLayout";
import { getActiveTemplateId } from "@/lib/getActiveTemplate";
import { getCachedSideBanner } from "@/services/apiCache";
import { getListingNews } from "@/services/newsService";
import { useCmsData } from "@/lib/useCmsData";
import { categoryFor } from "@/lib/blog2Categories";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { NewsItem } from "@/types/cms";

function SectionLoader() {
  return (
    <div className="w-full py-8 flex justify-center">
      <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
    </div>
  );
}

const PAGE_SIZE = 10;

function NewsListingInner() {
  const sp = useSearchParams();
  const q = sp.get("q") || undefined;
  const page = sp.get("page") || undefined;
  const query = (q || "").trim().toLowerCase();
  const currentPage = Math.max(1, parseInt(page || "1", 10) || 1);

  const { data, loading } = useCmsData(async () => {
    const [templateId, listingNews, sideBannerRaw] = await Promise.all([
      getActiveTemplateId(),
      // Non-featured posts only — the complement of the home page's
      // {highlight AND frontPage} set.
      getListingNews(),
      getCachedSideBanner(),
    ]);
    return { templateId, listingNews, sideBannerRaw };
  }, []);

  if (loading || !data) return <div className="min-h-screen bg-white" />;

  const { templateId, listingNews, sideBannerRaw } = data;

  const allNews: NewsItem[] = listingNews;
  const sideBanners = (
    sideBannerRaw?.dataset || (Array.isArray(sideBannerRaw) ? sideBannerRaw : [])
  )
    .map((b: { files?: { file?: string }[]; url?: string }) => {
      const file = b.files?.find((f) => f.file && f.file.trim());
      return file ? { src: file.file as string, url: b.url || "" } : null;
    })
    .filter(Boolean) as { src: string; url: string }[];

  const stripTags = (html: string) => html.replace(/<[^>]*>/g, "");
  const filteredNews = query
    ? allNews.filter((n) => {
        const haystack = `${n.title} ${stripTags(n.message || "")}`.toLowerCase();
        return haystack.includes(query);
      })
    : allNews;

  const totalPages = Math.max(1, Math.ceil(filteredNews.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pageStart = (safePage - 1) * PAGE_SIZE;
  const pageItems = filteredNews.slice(pageStart, pageStart + PAGE_SIZE);

  const mustRead = filteredNews.slice(0, 5);

  const heroTitle = query ? "HASIL CARIAN" : "BERITA";
  const heroSubtitle = query
    ? `${filteredNews.length} hasil untuk "${q}"`
    : "Semua berita terkini dari kami.";

  const pageHref = (p: number) => {
    const params = new URLSearchParams();
    if (query) params.set("q", q || "");
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `/news/?${qs}` : "/news";
  };

  return (
    <TemplateLayout templateId={templateId} padForFixedNav>
      <main className="min-h-screen text-[var(--text)]">
        {/* PAGE HEADER */}
        <section className="border-b border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-6 py-10">
            <nav className="flex items-center gap-2 text-xs mb-4 text-gray-500">
              <Link href="/" className="hover:text-[var(--primary)] transition">
                Utama
              </Link>
              <span>›</span>
              <span className="text-gray-800">Berita</span>
            </nav>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-3">
              {heroTitle}
            </h1>
            <p className="text-sm md:text-base text-gray-600 max-w-2xl">
              {heroSubtitle}
            </p>
          </div>
        </section>

        {/* MAIN + SIDEBAR */}
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* MAIN COLUMN */}
          <div className="lg:col-span-2">
            <div className="mb-6 pb-3 border-b border-gray-200">
              <h2 className="inline-block text-sm font-extrabold text-gray-900 uppercase tracking-wider border-b-4 border-[var(--primary)] pb-2 -mb-[14px]">
                Berita Terkini
              </h2>
            </div>

            {pageItems.length === 0 ? (
              <p className="text-[var(--text)]/60 text-center py-20">
                {query
                  ? `Tiada berita yang sepadan dengan "${q}".`
                  : "Tiada berita buat masa ini."}
              </p>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {pageItems.map((item) => {
                    const c = categoryFor(item.contentId);
                    return (
                      <article key={item.contentId} className="group">
                        <Link href={`/news/detail/?id=${item.contentId}`} className="block">
                          <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 mb-3">
                            {item.file1 && (
                              <Image
                                src={item.file1}
                                alt={item.altImg1 || item.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                sizes="(max-width:768px) 100vw, 33vw"
                              />
                            )}
                            <span className="absolute bottom-3 left-3">
                              <span
                                className={`inline-block px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white ${c.color}`}
                              >
                                {c.label}
                              </span>
                            </span>
                          </div>
                          <h3 className="text-base md:text-lg font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-[var(--primary)] transition">
                            {item.title}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-3 text-[11px] text-gray-500 mt-2 pt-2 border-t border-gray-100">
                          <span className="font-bold text-gray-700 uppercase tracking-wider">
                            Pentadbir
                          </span>
                          <span>{item.date}</span>
                        </div>
                      </article>
                    );
                  })}
                </div>

                {/* PAGINATION */}
                {totalPages > 1 && (
                  <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-1">
                      {safePage > 1 && (
                        <Link
                          href={pageHref(safePage - 1)}
                          aria-label="Previous page"
                          className="w-9 h-9 flex items-center justify-center border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Link>
                      )}
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (p) => {
                          const isActive = p === safePage;
                          return (
                            <Link
                              key={p}
                              href={pageHref(p)}
                              className={`w-9 h-9 flex items-center justify-center text-sm font-bold transition ${
                                isActive
                                  ? "bg-[var(--primary)] text-gray-900"
                                  : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                              }`}
                            >
                              {p}
                            </Link>
                          );
                        }
                      )}
                      {safePage < totalPages && (
                        <Link
                          href={pageHref(safePage + 1)}
                          aria-label="Next page"
                          className="w-9 h-9 flex items-center justify-center border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      Page {safePage} of {totalPages}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* SIDEBAR */}
          <aside className="space-y-10 lg:sticky lg:top-24 lg:self-start">
            {/* Advertisement */}
            {sideBanners[0] && (
              <div>
                <p className="text-center text-[10px] uppercase tracking-wider text-gray-400 mb-2">
                  — Iklan —
                </p>
                <a
                  href={sideBanners[0].url || "#"}
                  target={sideBanners[0].url ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="block relative h-64 overflow-hidden bg-gray-100"
                >
                  <Image
                    src={sideBanners[0].src}
                    alt="Iklan"
                    fill
                    className="object-cover"
                    sizes="300px"
                  />
                </a>
              </div>
            )}

            {/* Must Read */}
            {mustRead.length > 0 && (
              <div>
                <div className="mb-5 pb-2 border-b border-gray-200">
                  <h3 className="inline-block text-sm font-extrabold text-gray-900 uppercase tracking-wider border-b-4 border-[var(--primary)] pb-2 -mb-[10px]">
                    Mesti Baca
                  </h3>
                </div>
                <ul className="space-y-4">
                  {mustRead.map((item) => (
                    <li
                      key={item.contentId}
                      className="pb-3 border-b border-gray-100 last:border-0"
                    >
                      <Link href={`/news/detail/?id=${item.contentId}`} className="block group">
                        <h4 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-[var(--primary)] transition">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-3 text-[11px] text-gray-500 mt-1.5">
                          <span className="font-bold uppercase tracking-wider text-gray-700">
                            Pentadbir
                          </span>
                          <span>{item.date}</span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </main>
    </TemplateLayout>
  );
}

export default function NewsListingPage() {
  // useSearchParams must be under a Suspense boundary for static export.
  return (
    <Suspense fallback={<SectionLoader />}>
      <NewsListingInner />
    </Suspense>
  );
}
