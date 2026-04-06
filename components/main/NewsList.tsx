import Image from "next/image";
import Link from "next/link";
import {
  getCachedNews,
  getCachedSideBanner,
  getCachedConfig,
} from "@/services/apiCache";

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

    const dataset =
      newsData?.dataset || (Array.isArray(newsData) ? newsData : []);
    allNews = dataset;

    const bannerDataset =
      bannerData?.dataset || (Array.isArray(bannerData) ? bannerData : []);
    sideBanners = bannerDataset;

    bgColor = configData?.newsConfig?.backgroundColorNews || "";
  } catch (error) {
    console.error("❌ NewsList error:", error);
  }

  if (allNews.length === 0) return null;

  const sideBannerImages: { src: string; url: string }[] = [];
  for (const banner of sideBanners) {
    if (banner.files) {
      const firstValidFile = banner.files.find((f) => f.file && f.file.trim());
      if (firstValidFile) {
        sideBannerImages.push({
          src: firstValidFile.file,
          url: banner.url || "",
        });
      }
    }
  }

  return (
    <section
      className="py-12 px-6"
      style={{ backgroundColor: bgColor || "#ffffff" }}
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Berita Terkini
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: News listing (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            {allNews.slice(0, 10).map((item) => (
              <div
                key={item.contentId}
                className="group flex gap-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                {/* ── Thumbnail: taller & wider ── */}
                <Link
                  href={`/news/${item.contentId}`}
                  className="relative w-[180px] md:w-[260px] min-h-[180px] flex-shrink-0"
                >
                  {item.file1 ? (
                    <Image
                      src={item.file1}
                      alt={item.altImg1 || item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="260px"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <span className="text-3xl font-bold text-gray-400">
                        {item.title?.charAt(0)}
                      </span>
                    </div>
                  )}
                </Link>

                {/* ── Content: more lines shown ── */}
                <div className="flex flex-col justify-between py-4 pr-5 flex-1 min-w-0">
                  <div>
                    <span className="text-xs text-gray-400 mb-1.5 block">
                      {item.date}
                    </span>
                    <Link href={`/news/${item.contentId}`}>
                      <h3 className="text-base font-semibold text-gray-900 group-hover:text-[var(--primary)] transition-colors line-clamp-3 mb-2 leading-snug">
                        {item.title}
                      </h3>
                    </Link>
                    {/* <div
                      className="text-sm text-gray-500 line-clamp-4 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: item.message }}
                    /> */}
                    <div
                      className="text-sm text-gray-500 line-clamp-3 leading-relaxed min-h-[4.5rem]"
                      dangerouslySetInnerHTML={{ __html: item.message }}
                    />
                  </div>
                  <Link
                    href={`/news/${item.contentId}`}
                    className="text-sm font-medium text-[var(--primary)] hover:underline self-end mt-3"
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
            <>
              {/* Desktop: Synchronized height and scrollable */}
              <div className="hidden lg:block relative col-span-1 rounded-lg">
                <div 
                  className="absolute inset-0 overflow-y-auto overflow-x-hidden space-y-4 pr-3 scroll-smooth"
                  style={{
                    scrollbarWidth: "thin",
                    scrollbarColor: "rgba(0,0,0,0.2) transparent"
                  }}
                >
                  {sideBannerImages.map((banner, index) => (
                    <div
                      key={index}
                      className="relative rounded-lg overflow-hidden shadow-sm shrink-0"
                    >
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
              </div>

              {/* Mobile: Standard stacking without fixed height */}
              <div className="lg:hidden space-y-4 col-span-1">
                {sideBannerImages.map((banner, index) => (
                  <div
                    key={index}
                    className="relative rounded-lg overflow-hidden shadow-sm"
                  >
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
            </>
          )}
        </div>
      </div>
    </section>
  );
}
