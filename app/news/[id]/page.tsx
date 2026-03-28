import { Suspense } from "react";
import Link from "next/link";
import { getNewsDetail } from "@/services/newsDetailService";
import { getCachedConfig } from "@/services/apiCache";
import NewsImageGallery from "@/components/news/NewsImageGallery";
import Navbar from "@/components/layouts/navbar";
import Footer from "@/components/layouts/footer";
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

  let configData;
  try {
    configData = await getCachedConfig();
  } catch {
    configData = {};
  }

  const general = configData.generalSettings || {};
  const cssVars = {
    "--primary": general.primaryColor || "#78C841",
    "--secondary": general.secondaryColor || "#154D71",
    "--text": general.textColor || "#00FF00",
  } as React.CSSProperties;

  let news;
  try {
    news = await getNewsDetail(id);
  } catch {
    news = null;
  }

  if (!news) {
    notFound();
  }

  // Map API displayMode to gallery view mode
  const galleryMode = news.displayMode === "sidebar" ? "slide" : news.displayMode;

  // Format date nicely
  const formattedDate = news.date
    ? new Date(news.date).toLocaleDateString("ms-MY", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <div style={cssVars}>
      <Suspense fallback={<SectionLoader />}>
        <Navbar />
      </Suspense>

      <main className="min-h-screen bg-white">
        {/* Images on top - full width */}
        {news.images.length > 0 && (
          <div className="max-w-5xl mx-auto px-6 pt-8">
            <NewsImageGallery images={news.images} defaultMode={galleryMode} />
          </div>
        )}

        <article className="max-w-4xl mx-auto px-6 py-8">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[var(--primary)] transition-colors mb-6"
          >
            <span>&#8592;</span> Kembali ke Utama
          </Link>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {news.title}
          </h1>

          {/* Date & Time meta */}
          <div className="flex items-center gap-4 text-sm text-gray-400 mb-8 pb-6 border-b border-gray-100">
            {formattedDate && (
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formattedDate}
              </span>
            )}
            {news.time && (
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {news.time}
              </span>
            )}
          </div>

          {/* Content */}
          <div
            className="prose prose-lg max-w-none text-gray-700 leading-relaxed
                       prose-headings:text-gray-900 prose-a:text-[var(--primary)]
                       prose-img:rounded-lg prose-strong:text-gray-900"
            dangerouslySetInnerHTML={{ __html: news.message }}
          />

          {/* iframe if provided */}
          {news.urlIframe && news.urlIframe.startsWith("http") && (
            <div className="mt-10">
              <iframe
                src={news.urlIframe}
                className="w-full h-[400px] md:h-[500px] rounded-xl border border-gray-200"
                allowFullScreen
              />
            </div>
          )}
        </article>
      </main>

      <Suspense fallback={<SectionLoader />}>
        <Footer />
      </Suspense>
    </div>
  );
}
