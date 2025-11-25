import { assetPath } from "@/lib/assetPath";
import Image from "next/image";
import { FooterProps } from "@/types/cms";

export default function Footer({ footer }: FooterProps) {
  // Helper function to check if URL is absolute
  const isAbsoluteUrl = (url: string) => {
    return url.startsWith("http://") || url.startsWith("https://");
  };

  // Get the proper image paths
  const footerLogoSrc = footer.image.image
    ? isAbsoluteUrl(footer.image.image)
      ? footer.image.image
      : assetPath(footer.image.image)
    : null;

  // Log the API response data in the component
  console.group("🦶 FOOTER - API Response Data");
  console.log("Footer Data:", footer);
  console.log("Footer Title:", footer.footer_title);
  console.log("Footer Text:", footer.text);
  console.log("Address:", footer.address);
  console.log("Phone:", footer.phone);
  console.log("Email:", footer.email);
  console.log("Social Links:", footer.social_links);
  console.log("Copyright:", footer.copyright);
  console.log("Image:", footer.image);
  console.log("Original Logo Path:", footer.image.image);
  console.log("Processed Logo Path:", footerLogoSrc);
  console.groupEnd();

  return (
    <footer className="bg-[#164776] text-white py-10 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left: Image (7 columns) */}
        <div className="col-span-12 md:col-span-7 flex justify-center md:justify-start">
          {footerLogoSrc && (
            <a href={footer.image.link || "#"}>
              <Image
                src={footerLogoSrc}
                alt="Footer Logo"
                width={200}
                height={200}
                className="object-contain"
                unoptimized={isAbsoluteUrl(footerLogoSrc)}
              />
            </a>
          )}
        </div>

        {/* Right: Content (5 columns) */}
        <div className="col-span-12 md:col-span-5 flex gap-6">
          {/* Vertical Divider (only on desktop) */}
          <div className="hidden md:block w-[2px] bg-white" />

          {/* Text & Social Icons */}
          <div className="text-left w-full">
            <h3 className="text-2xl font-semibold">{footer.footer_title}</h3>

            <p className="text-base text-gray-200 mt-4 leading-relaxed">
              {footer.text}
            </p>

            <p className="text-base text-gray-200 mt-4 leading-relaxed">
              {footer.address}
            </p>

            <a
              href={`tel:${footer.phone}`}
              className="block text-base text-gray-200 mt-4 hover:text-white transition"
            >
              Nombor Telefon: {footer.phone}
            </a>
            <a
              href={`mailto:${footer.email}`}
              className="block text-base text-gray-200 mt-1 hover:text-white transition"
            >
              E-mel: {footer.email}
            </a>

            {/* Social Icons */}
            <div className="flex gap-5 mt-5 text-xl">
              {footer.social_links.map((social, i) => {
                const socialIconSrc = isAbsoluteUrl(social.platform)
                  ? social.platform
                  : assetPath(social.platform);

                return (
                  <a
                    key={i}
                    href={social.link}
                    aria-label={`Social link ${i + 1}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src={socialIconSrc}
                      alt={`Social icon ${i + 1}`}
                      width={24}
                      height={24}
                      className="hover:opacity-80 transition-opacity"
                      unoptimized={isAbsoluteUrl(socialIconSrc)}
                    />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="mt-10 text-center text-sm text-gray-300">
        {footer.copyright}
      </div>
    </footer>
  );
}
