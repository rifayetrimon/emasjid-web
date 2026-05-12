import Image from "@/components/ui/FallbackImage";
import { getFooterData } from "@/services/footerService";
import { getVisitorStats } from "@/services/visitorService";
import InlineError from "@/components/ui/InlineError";
import VisitorList from "@/components/visitor/VisitorList";

export default async function Footer() {
  let footer;
  try {
    footer = await getFooterData();
  } catch (error) {
    console.error("❌ Footer component error:", error);
    footer = null;
  }

  const visitors = await getVisitorStats();

  if (!footer) {
    return (
      <footer className="w-full bg-[#1A1A1A] py-12 px-6">
        <InlineError componentName="Pengaki (Footer)" />
      </footer>
    );
  }

  // Helper function to check if URL is absolute
  const isAbsoluteUrl = (url: string) => {
    return url.startsWith("http://") || url.startsWith("https://");
  };

  // Get the proper image paths
  const footerLogoSrc = footer.image.image
    ? isAbsoluteUrl(footer.image.image)
      ? footer.image.image
      : footer.image.image
    : null;

  return (
    <footer
      className="text-white py-10 px-6"
      style={{ backgroundColor: footer.bgColor || "#164776" }}
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 items-start">
        {/* Logo */}
        <div className="lg:col-span-4 flex justify-center md:justify-start">
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

        {/* Contact + Social */}
        <div className="lg:col-span-3 text-left">
          <h3 className="text-2xl font-semibold">{footer.footer_title}</h3>

          <p className="text-sm text-gray-200 mt-3 leading-relaxed">
            {footer.text}
          </p>

          <p className="text-sm text-gray-200 mt-3 leading-relaxed">
            {footer.address}
          </p>

          <a
            href={`tel:${footer.phone}`}
            className="block text-sm text-gray-200 mt-3 hover:text-white transition"
          >
            Nombor Telefon: {footer.phone}
          </a>
          <a
            href={`mailto:${footer.email}`}
            className="block text-sm text-gray-200 mt-1 hover:text-white transition"
          >
            E-mel: {footer.email}
          </a>

          <div className="flex gap-3 mt-4">
            {footer.social_links.map((social, i) => {
              const socialIconSrc = isAbsoluteUrl(social.platform)
                ? social.platform
                : social.platform;

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
                    width={22}
                    height={22}
                    className="hover:opacity-80 transition-opacity"
                    unoptimized={isAbsoluteUrl(socialIconSrc)}
                  />
                </a>
              );
            })}
          </div>
        </div>

        {/* Visitor list */}
        <div className="lg:col-span-5 text-left">
          <VisitorList stats={visitors} tone="dark" />
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="mt-10 text-center text-sm text-gray-300">
        {footer.copyright}
      </div>
    </footer>
  );
}
