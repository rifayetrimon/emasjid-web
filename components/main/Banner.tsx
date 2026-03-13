import Image from "next/image";
import { getBannerData } from "@/services/bannerService";
import InlineError from "@/components/ui/InlineError";

export default async function Banner() {
  const banner = await getBannerData();

  // Basic check if the banner data is provided
  if (!banner) {
    console.warn("⚠️ BANNER: No banner data provided");
    return <InlineError componentName="Utama (Banner)" />;
  }

  const { title, supporting_text, background_image, logo } = banner;

  // Safely access nested title structure
  const focusText = title?.focus?.text;
  const focusLink = title?.focus?.link;

  // Render nothing if critical data is missing
  if (!background_image) {
    console.warn("⚠️ BANNER: No background image provided");
    return null;
  }

  // Helper function to check if URL is absolute
  const isAbsoluteUrl = (url: string) => {
    return url.startsWith("http://") || url.startsWith("https://");
  };

  // Get the proper image path
  const logoSrc = logo ? (isAbsoluteUrl(logo) ? logo : logo) : null;
  const bgImageSrc = isAbsoluteUrl(background_image)
    ? background_image
    : background_image;

  return (
    <section
      className="relative w-full h-[90vh] flex flex-col justify-center items-center text-center text-white"
      style={{
        backgroundImage: `url(${bgImageSrc})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Logo */}
      {logoSrc && (
        <div className="mb-6">
          <Image
            src={logoSrc}
            alt="Logo Masjid"
            width={160}
            height={160}
            className="w-40 h-40 object-contain"
            priority
            unoptimized={isAbsoluteUrl(logoSrc)}
          />
        </div>
      )}

      {/* Title */}
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

      {/* Supporting text */}
      {supporting_text && (
        <p className="max-w-5xl text-lg md:text-xl mb-6 px-4 leading-relaxed">
          {supporting_text}
        </p>
      )}
    </section>
  );
}
