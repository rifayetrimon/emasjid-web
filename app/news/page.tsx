import { Suspense } from "react";
import Image from "@/components/ui/FallbackImage";
import Link from "next/link";
import Navbar from "@/components/layouts/navbar";
import Footer from "@/components/layouts/footer";
import { getCachedNews, getCachedConfig } from "@/services/apiCache";

export const dynamic = "force-dynamic";

function SectionLoader() {
  return (
    <div className="w-full py-8 flex justify-center">
      <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
    </div>
  );
}

interface NewsItem {
  contentId: number;
  title: string;
  message: string;
  date: string;
  time: string;
  file1: string | null;
  altImg1: string;
}

export default async function NewsListingPage() {
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

  let allNews: NewsItem[] = [];
  try {
    const newsData = await getCachedNews();
    const dataset = newsData?.dataset || (Array.isArray(newsData) ? newsData : []);
    allNews = dataset;
  } catch (error) {
    console.error("❌ News listing error:", error);
  }

  return (
    <div style={cssVars}>
      <Suspense fallback={<SectionLoader />}>
        <Navbar />
      </Suspense>

      <main className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 py-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Semua Berita</h1>
            <Link
              href="/"
              className="text-sm text-gray-400 hover:text-[var(--primary)] transition-colors"
            >
              &larr; Kembali ke Utama
            </Link>
          </div>

          {allNews.length === 0 ? (
            <p className="text-gray-500 text-center py-20">Tiada berita buat masa ini.</p>
          ) : (
            <div className="space-y-5">
              {allNews.map((item) => (
                <div
                  key={item.contentId}
                  className="group flex gap-5 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  {/* Thumbnail */}
                  <Link
                    href={`/news/${item.contentId}`}
                    className="relative w-[160px] md:w-[240px] min-h-[140px] flex-shrink-0"
                  >
                      <Image
                        src={item.file1}
                        alt={item.altImg1 || item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="240px"
                      />
                  </Link>

                  {/* Content */}
                  <div className="flex flex-col justify-center py-4 pr-5 flex-1 min-w-0">
                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
                      <span>{item.date}</span>
                      {item.time && <span>{item.time}</span>}
                    </div>
                    <Link href={`/news/${item.contentId}`}>
                      <h2 className="text-lg font-semibold text-gray-900 group-hover:text-[var(--primary)] transition-colors line-clamp-2 mb-2">
                        {item.title}
                      </h2>
                    </Link>
                    <div
                      className="text-sm text-gray-500 line-clamp-2 mb-3"
                      dangerouslySetInnerHTML={{ __html: item.message }}
                    />
                    <Link
                      href={`/news/${item.contentId}`}
                      className="text-sm font-medium text-[var(--primary)] hover:underline self-end mt-auto"
                    >
                      Lagi &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Suspense fallback={<SectionLoader />}>
        <Footer />
      </Suspense>
    </div>
  );
}
