import Image from "@/components/ui/FallbackImage";
import { FooterProps } from "@/types/cms";

export default function Demo2Footer({ footer }: FooterProps) {
  if (!footer) return null;
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          <div className="md:col-span-5">
            {footer.image.image && (
              <Image
                src={footer.image.image}
                alt="Logo"
                width={140}
                height={140}
                className="mb-6 brightness-0 invert"
              />
            )}
            <h3
              className="text-2xl font-bold mb-4"
              style={{ fontFamily: "Georgia, serif" }}
            >
              {footer.footer_title}
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed max-w-md">
              {footer.text}
            </p>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-base uppercase tracking-[0.15em] font-bold mb-4 text-[var(--secondary)]">
              Hubungi
            </h4>
            <div className="space-y-2 text-sm text-gray-300">
              {footer.address && <p>{footer.address}</p>}
              {footer.phone && (
                <p>
                  <a href={`tel:${footer.phone}`} className="hover:text-white">
                    {footer.phone}
                  </a>
                </p>
              )}
              {footer.email && (
                <p>
                  <a
                    href={`mailto:${footer.email}`}
                    className="hover:text-white break-all"
                  >
                    {footer.email}
                  </a>
                </p>
              )}
            </div>
          </div>

          <div className="md:col-span-4">
            <h4 className="text-base uppercase tracking-[0.15em] font-bold mb-4 text-[var(--secondary)]">
              Ikuti Kami
            </h4>
            <div className="flex flex-wrap gap-3">
              {footer.social_links.map((s, i) => (
                <a
                  key={i}
                  href={s.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center border border-white/20 hover:bg-white/10 transition-colors"
                >
                  <Image
                    src={s.platform}
                    alt="Social"
                    width={18}
                    height={18}
                    className="brightness-0 invert"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500 text-center pt-8 uppercase tracking-wider">
          {footer.copyright}
        </p>
      </div>
    </footer>
  );
}
