import { Suspense } from "react";
import Link from "next/link";
import { getNewsDetail } from "@/services/newsDetailService";
import NewsImageGallery from "@/components/news/NewsImageGallery";
import TemplateLayout from "@/components/TemplateLayout";
import { getActiveTemplateId } from "@/lib/getActiveTemplate";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

function SectionLoader() {
  return (
    <div className="w-full py-8 flex justify-center">
      <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
    </div>
  );
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

  const galleryMode = news.displayMode === "sidebar" ? "slide" : news.displayMode;

  const formattedDate = news.date
    ? new Date(news.date).toLocaleDateString("ms-MY", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <TemplateLayout templateId={templateId} padForFixedNav>
      <Suspense fallback={<SectionLoader />}>
        <main className="min-h-screen">
          <div className="max-w-5xl mx-auto px-6 pt-8">
            <NewsImageGallery
              images={
                news.images.length > 0
                  ? news.images
                  : [{ src: "/icon/default-img.png", alt: news.title }]
              }
              defaultMode={galleryMode}
            />
          </div>

          <article className="max-w-4xl mx-auto px-6 py-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm opacity-60 hover:text-[var(--primary)] hover:opacity-100 transition-all mb-6"
            >
              <span>&#8592;</span> Kembali ke Utama
            </Link>

            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
              {news.title}
            </h1>

            <div className="flex items-center gap-4 text-sm opacity-60 mb-8 pb-6 border-b border-current/20">
              {formattedDate && (
                <span className="flex items-center gap-1.5">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
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
                <span className="flex items-center gap-1.5">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
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

            <div
              className="prose prose-lg max-w-none leading-relaxed
                       prose-headings:font-bold prose-a:text-[var(--primary)]
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
          </article>
        </main>
      </Suspense>
    </TemplateLayout>
  );
}
