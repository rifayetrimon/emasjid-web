import { assetPath } from "@/lib/assetPath";
import Image from "next/image";
import { FooterProps } from "@/types/cms";

export default function Footer({ footer }: FooterProps) {
  return (
    <footer className="bg-[#164776] text-white py-10 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left: Image (7 columns) */}
        <div className="col-span-12 md:col-span-7 flex justify-center md:justify-start">
          <a href={footer.image.link}>
            <Image
              src={assetPath(footer.image.image)}
              alt="Footer Icon"
              width={200}
              height={200}
              className="object-contain"
            />
          </a>
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
              className="block text-base text-gray-200 mt-4"
            >
              Phone Number : {footer.phone}
            </a>
            <a
              href={`mailto:${footer.email}`}
              className="block text-base text-gray-200 mt-1"
            >
              e-mel : {footer.email}
            </a>

            {/* Social Icons */}
            <div className="flex gap-5 mt-5 text-xl">
              {footer.social_links.map((social, i) => (
                <a
                  key={i}
                  href={social.link}
                  aria-label={social.platform}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src={assetPath(
                      `/icons/${social.platform.toLowerCase()}.svg`
                    )}
                    alt={social.platform}
                    width={24}
                    height={24}
                    className="hover:opacity-80 transition-opacity"
                  />
                </a>
              ))}
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
