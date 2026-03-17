import { getBannerData } from "@/services/bannerService";
import InlineError from "@/components/ui/InlineError";
import BannerSlideshow from "./BannerSlideshow";

export default async function Banner() {
  let banner;
  try {
    banner = await getBannerData();
  } catch (error) {
    console.error("❌ Banner component error:", error);
    return <InlineError componentName="Utama (Banner)" />;
  }

  if (!banner) {
    console.warn("⚠️ BANNER: No banner data provided");
    return <InlineError componentName="Utama (Banner)" />;
  }

  const { title, supporting_text, background_images, textColor, overlayColor, overlayOpacity } = banner;

  const focusText = title?.focus?.text;
  const focusLink = title?.focus?.link;

  if (!background_images || background_images.length === 0) {
    console.warn("⚠️ BANNER: No background images provided");
    return null;
  }

  return (
    <section
      className="relative w-full h-[90vh] flex flex-col justify-center items-center text-center overflow-hidden"
      style={{ color: textColor || "#ffffff" }}
    >
      {/* Slideshow background images */}
      <BannerSlideshow images={background_images} interval={7000} />

      {/* Overlay */}
      {overlayColor && (
        <div
          className="absolute inset-0 z-[1]"
          style={{
            backgroundColor: overlayColor,
            opacity: overlayOpacity / 100,
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 px-4">
          {title?.general}{" "}
          {focusText && focusLink && (
            <a href={focusLink} className="hover:opacity-90 transition-opacity">
              <span className="text-[var(--secondary)]">
                {focusText.charAt(0)}
              </span>
              <span className="text-[var(--primary)]">{focusText.slice(1)}</span>
            </a>
          )}
        </h1>

        {supporting_text && (
          <p className="max-w-5xl text-lg md:text-xl mb-6 px-4 leading-relaxed">
            {supporting_text}
          </p>
        )}
      </div>
    </section>
  );
}
