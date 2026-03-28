import Image from "next/image";
import Link from "next/link";
import { getCachedNews, getCachedSideBanner, getCachedConfig } from "@/services/apiCache";

interface NewsItem {
  contentId: number;
  title: string;
  message: string;
  date: string;
  file1: string | null;
  altImg1: string;
}

interface SideBannerFile {
  file: string;
}

interface SideBanner {
  bannerId: number;
  files: SideBannerFile[];
  url: string;
}

export default async function NewsList() {
  let allNews: NewsItem[] = [];
  let sideBanners: SideBanner[] = [];
  let bgColor = "";

  try {
    const [newsData, bannerData, configData] = await Promise.all([
      getCachedNews(),
      getCachedSideBanner(),
      getCachedConfig(),
    ]);

    const dataset = newsData?.dataset || (Array.isArray(newsData) ? newsData : []);
    allNews = dataset;

    const bannerDataset = bannerData?.dataset || (Array.isArray(bannerData) ? bannerData : []);
    sideBanners = bannerDataset;

    bgColor = configData?.newsConfig?.backgroundColorNews || "";
  } catch (error) {
    console.error("❌ NewsList error:", error);
  }

  if (allNews.length === 0) return null;

  // Collect side banner images - use first valid file per banner, url is at banner level
  const sideBannerImages: { src: string; url: string }[] = [];
  for (const banner of sideBanners) {
    if (banner.files) {
      const firstValidFile = banner.files.find((f) => f.file && f.file.trim());
      if (firstValidFile) {
        sideBannerImages.push({ src: firstValidFile.file, url: banner.url || "" });
      }
    }
  }

  return (
    <section
      className="py-12 px-6"
      style={{ backgroundColor: bgColor || "#ffffff" }}
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Berita Terkini</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: News listing (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            {allNews.map((item) => (
              <div
                key={item.contentId}
                className="group flex gap-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                {/* Thumbnail */}
                <Link
                  href={`/news/${item.contentId}`}
                  className="relative w-[140px] md:w-[200px] min-h-[120px] flex-shrink-0"
                >
                  {item.file1 ? (
                    <Image
                      src={item.file1}
                      alt={item.altImg1 || item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="200px"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <span className="text-3xl font-bold text-gray-400">
                        {item.title?.charAt(0)}
                      </span>
                    </div>
                  )}
                </Link>

                {/* Content */}
                <div className="flex flex-col justify-center py-3 pr-4 flex-1 min-w-0">
                  <span className="text-xs text-gray-400 mb-1">{item.date}</span>
                  <Link href={`/news/${item.contentId}`}>
                    <h3 className="text-base font-semibold text-gray-900 group-hover:text-[var(--primary)] transition-colors line-clamp-2 mb-1">
                      {item.title}
                    </h3>
                  </Link>
                  <div
                    className="text-sm text-gray-500 line-clamp-2 mb-2"
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

            {/* View all news button */}
            <div className="flex justify-end pt-4">
              <Link
                href="/news"
                className="px-8 py-3 border-2 border-[var(--primary)] text-[var(--primary)] rounded-lg font-medium
                           hover:bg-[var(--primary)] hover:text-white transition-all duration-200"
              >
                Lagi
              </Link>
            </div>
          </div>

          {/* Right: Side banners (1/3 width) */}
          {sideBannerImages.length > 0 && (
            <div className="space-y-4">
              {sideBannerImages.map((banner, index) => (
                <div key={index} className="relative rounded-lg overflow-hidden shadow-sm">
                  {banner.url ? (
                    <a
                      href={banner.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Image
                        src={banner.src}
                        alt={`Side Banner ${index + 1}`}
                        width={400}
                        height={300}
                        className="w-full h-auto object-cover hover:opacity-90 transition-opacity"
                      />
                    </a>
                  ) : (
                    <Image
                      src={banner.src}
                      alt={`Side Banner ${index + 1}`}
                      width={400}
                      height={300}
                      className="w-full h-auto object-cover"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
