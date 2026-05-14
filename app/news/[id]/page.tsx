import { Suspense } from "react";
import Link from "next/link";
import Image from "@/components/ui/FallbackImage";
import { getNewsDetail } from "@/services/newsDetailService";
import MediaLayout from "@/components/news/MediaLayout";
import TemplateLayout from "@/components/TemplateLayout";
import { getActiveTemplateId } from "@/lib/getActiveTemplate";
import { getCachedNews } from "@/services/apiCache";
import { categoryFor } from "@/lib/blog2Categories";
import { notFound } from "next/navigation";
import ShareButtons from "@/components/news/ShareButtons";
import { withBasePath } from "@/lib/withBasePath";

export const dynamic = "force-dynamic";

function SectionLoader() {
  return (
    <div className="w-full py-8 flex justify-center">
      <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
    </div>
  );
}

interface RelatedNews {
  contentId: number;
  title: string;
  date: string;
  file1: string | null;
  altImg1: string;
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const templateId = await getActiveTemplateId();

  let news;
  try {
    news = await getNewsDetail(id);
  } catch {
    news = null;
  }

  if (!news) {
    notFound();
  }

  // Respect admin's posDisplay per article. Sidebar mode is too small for
  // a detail page so it falls back to slide.
  const galleryMode =
    news.displayMode === "sidebar" ? "slide" : news.displayMode;

  const formattedDate = news.date
    ? new Date(news.date).toLocaleDateString("ms-MY", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  // Sidebar data — Most Popular (3 latest excluding current article)
  let popular: RelatedNews[] = [];
  try {
    const newsRaw = await getCachedNews();
    const dataset = (newsRaw?.dataset ||
      (Array.isArray(newsRaw) ? newsRaw : [])) as unknown as RelatedNews[];
    popular = dataset
      .filter((n) => String(n.contentId) !== id)
      .slice(0, 4)
      .map((n) => ({
        contentId: n.contentId,
        title: n.title,
        date: n.date,
        file1: n.file1,
        altImg1: n.altImg1,
      }));
  } catch {
    popular = [];
  }

  const isBlog = templateId === "6";
  const category = categoryFor(Number(id) || 0);

  // Build a relative share URL (no need for env var; browser resolves to full origin)
  const shareUrl = `/news/${id}`;

  return (
    <TemplateLayout templateId={templateId} padForFixedNav>
      <Suspense fallback={<SectionLoader />}>
        <main className="min-h-screen">
          <div
            className={
              isBlog
                ? "max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-10"
                : "max-w-5xl mx-auto px-6 py-8"
            }
          >
            {/* MAIN COLUMN */}
            <article className={isBlog ? "lg:col-span-2 text-[var(--text)]" : "text-[var(--text)]"}>
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-xs text-[var(--text)]/60 mb-4">
                <Link href="/" className="hover:text-[var(--primary)] transition">
                  Utama
                </Link>
                <span>›</span>
                <Link href="/news" className="hover:text-[var(--primary)] transition">
                  Berita
                </Link>
                {isBlog && (
                  <>
                    <span>›</span>
                    <span className="text-[var(--text)]/80 line-clamp-1">
                      {news.title}
                    </span>
                  </>
                )}
              </nav>

              {/* Category badge (Blog 2 only) */}
              {isBlog && (
                <span
                  className={`inline-block px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white mb-4 ${category.color}`}
                >
                  {category.label}
                </span>
              )}

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-[var(--text)] mb-4 leading-tight">
                {news.title}
              </h1>

              {/* Meta: author · date · time */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text)]/60 mb-6 pb-6 border-b border-[var(--text)]/15">
                <span className="font-semibold text-[var(--text)]/80">
                  Oleh Pentadbir
                </span>
                {formattedDate && (
                  <span className="flex items-center gap-1.5 text-[var(--primary)] font-semibold">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {formattedDate}
                  </span>
                )}
                {news.time && (
                  <span className="flex items-center gap-1.5 text-[var(--primary)] font-semibold">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {news.time}
                  </span>
                )}
              </div>

              {/* Share buttons */}
              {isBlog && (
                <div className="mb-6">
                  <ShareButtons title={news.title} url={shareUrl} />
                </div>
              )}

              {/* Featured image / gallery — respects admin's posDisplay */}
              <div className="mb-8">
                <MediaLayout
                  images={
                    news.images.length > 0
                      ? news.images
                      : [{ src: withBasePath("/icons/default-img.png"), alt: news.title }]
                  }
                  mode={galleryMode}
                  aspect="aspect-[16/9]"
                  sizes="(max-width: 768px) 100vw, 800px"
                />
              </div>

              {/* Article body */}
              <div
                className="prose prose-lg max-w-none leading-relaxed
                         text-[var(--text)]
                         prose-headings:font-bold prose-headings:text-[var(--text)]
                         prose-p:text-[var(--text)] prose-li:text-[var(--text)]
                         prose-strong:text-[var(--text)]
                         prose-a:text-[var(--primary)]
                         prose-img:rounded-lg"
                dangerouslySetInnerHTML={{ __html: news.message }}
              />

              {news.urlIframe && news.urlIframe.startsWith("http") && (
                <div className="mt-10">
                  <iframe
                    src={news.urlIframe}
                    className="w-full h-[400px] md:h-[500px] rounded-xl border border-black/10"
                    allowFullScreen
                  />
                </div>
              )}

              {/* Back link */}
              <div className="mt-10 pt-6 border-t border-[var(--text)]/15">
                <Link
                  href="/news"
                  className="inline-flex items-center gap-2 text-sm text-[var(--text)]/60 hover:text-[var(--primary)] transition"
                >
                  &larr; Semua Berita
                </Link>
              </div>
            </article>

            {/* RIGHT SIDEBAR — Blog 2 only */}
            {isBlog && (
              <aside className="space-y-8">
                {popular.length > 0 && (
                  <div>
                    <div className="mb-5">
                      <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider">
                        Paling Popular
                      </h2>
                      <div className="mt-2 relative h-[1px] bg-gray-200">
                        <span className="absolute left-0 -top-px h-[2px] w-1/3 bg-[var(--primary)]" />
                      </div>
                    </div>
                    <ol className="space-y-4">
                      {popular.map((p, i) => (
                        <li key={p.contentId} className="flex gap-3 group">
                          <span className="flex-shrink-0 text-3xl font-extrabold text-gray-200 leading-none w-8">
                            {i + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <span className="text-[9px] uppercase tracking-wider text-[var(--primary)] font-bold">
                              {categoryFor(p.contentId).label}
                            </span>
                            <Link href={`/news/${p.contentId}`} className="block mt-1">
                              <h4 className="text-xs font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-[var(--primary)] transition">
                                {p.title}
                              </h4>
                            </Link>
                            <p className="text-[10px] text-gray-500 mt-1">
                              {p.date}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* Editor Picks (thumbnails) */}
                {popular.length > 0 && (
                  <div>
                    <div className="mb-5">
                      <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider">
                        Editor Picks
                      </h2>
                      <div className="mt-2 relative h-[1px] bg-gray-200">
                        <span className="absolute left-0 -top-px h-[2px] w-1/3 bg-[var(--primary)]" />
                      </div>
                    </div>
                    <ul className="space-y-4">
                      {popular.slice(0, 3).map((p) => (
                        <li key={p.contentId}>
                          <Link
                            href={`/news/${p.contentId}`}
                            className="group flex gap-3"
                          >
                            <div className="relative w-20 h-16 flex-shrink-0 overflow-hidden bg-gray-100">
                              {p.file1 && (
                                <Image
                                  src={p.file1}
                                  alt={p.altImg1 || p.title}
                                  fill
                                  className="object-cover"
                                  sizes="80px"
                                />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-[var(--primary)] transition">
                                {p.title}
                              </h4>
                              <p className="text-[10px] text-gray-500 mt-1">
                                {p.date}
                              </p>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </aside>
            )}
          </div>
        </main>
      </Suspense>
    </TemplateLayout>
  );
}
