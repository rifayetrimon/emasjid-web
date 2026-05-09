import { Suspense } from "react";
import Image from "@/components/ui/FallbackImage";
import Link from "next/link";
import TemplateLayout from "@/components/TemplateLayout";
import { getActiveTemplateId } from "@/lib/getActiveTemplate";
import { getCachedNews } from "@/services/apiCache";

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
  const templateId = await getActiveTemplateId();

  let allNews: NewsItem[] = [];
  try {
    const newsData = await getCachedNews();
    const dataset = newsData?.dataset || (Array.isArray(newsData) ? newsData : []);
    allNews = dataset;
  } catch (error) {
    console.error("❌ News listing error:", error);
  }

  return (
    <TemplateLayout templateId={templateId} padForFixedNav>
      <Suspense fallback={<SectionLoader />}>
        <main className="min-h-screen">
          <div className="max-w-5xl mx-auto px-6 py-12">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Semua Berita
              </h1>
              <Link
                href="/"
                className="text-sm opacity-60 hover:opacity-100 transition-opacity"
              >
                &larr; Kembali ke Utama
              </Link>
            </div>

            {allNews.length === 0 ? (
              <p className="opacity-60 text-center py-20">
                Tiada berita buat masa ini.
              </p>
            ) : (
              <div className="space-y-5">
                {allNews.map((item) => (
                  <Link
                    key={item.contentId}
                    href={`/news/${item.contentId}`}
                    className="group flex gap-5 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden bg-white/80 backdrop-blur-sm border border-black/5"
                  >
                    <div className="relative w-[160px] md:w-[240px] min-h-[140px] flex-shrink-0">
                      <Image
                        src={item.file1}
                        alt={item.altImg1 || item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="240px"
                      />
                    </div>
                    <div className="flex flex-col justify-center py-4 pr-5 flex-1 min-w-0">
                      <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                        <span>{item.date}</span>
                        {item.time && <span>{item.time}</span>}
                      </div>
                      <h2 className="text-lg md:text-xl font-semibold text-gray-900 group-hover:text-[var(--primary)] transition-colors line-clamp-2 mb-2">
                        {item.title}
                      </h2>
                      <div
                        className="text-sm text-gray-600 line-clamp-2 mb-3"
                        dangerouslySetInnerHTML={{ __html: item.message }}
                      />
                      <span className="text-sm font-medium text-[var(--primary)] hover:underline self-end mt-auto">
                        Lagi &rarr;
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </main>
      </Suspense>
    </TemplateLayout>
  );
}
