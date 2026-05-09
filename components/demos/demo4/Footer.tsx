import Image from "@/components/ui/FallbackImage";
import { FooterProps } from "@/types/cms";

export default function Demo4Footer({ footer }: FooterProps) {
  if (!footer) return null;
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-[1400px] mx-auto px-6 py-14">
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            {footer.image.image && (
              <Image
                src={footer.image.image}
                alt="Logo"
                width={96}
                height={96}
                className="mb-5 brightness-0 invert"
              />
            )}
            <h3 className="text-xl font-bold mb-3">{footer.footer_title}</h3>
            <p className="text-sm text-white/60 leading-relaxed max-w-md">
              {footer.text}
            </p>
          </div>
          <div className="md:col-span-3">
            <h4 className="text-xs uppercase tracking-wider font-bold text-white/40 mb-4">
              Hubungi
            </h4>
            <div className="space-y-2 text-sm text-white/70">
              {footer.address && <p>{footer.address}</p>}
              {footer.phone && (
                <a href={`tel:${footer.phone}`} className="block hover:text-white">
                  {footer.phone}
                </a>
              )}
              {footer.email && (
                <a
                  href={`mailto:${footer.email}`}
                  className="block hover:text-white break-all"
                >
                  {footer.email}
                </a>
              )}
            </div>
          </div>
          <div className="md:col-span-4">
            <h4 className="text-xs uppercase tracking-wider font-bold text-white/40 mb-4">
              Sosial Media
            </h4>
            <div className="flex flex-wrap gap-2">
              {footer.social_links.map((s, i) => (
                <a
                  key={i}
                  href={s.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/15 flex items-center justify-center transition"
                >
                  <Image
                    src={s.platform}
                    alt="Social"
                    width={16}
                    height={16}
                    className="brightness-0 invert"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
        <p className="text-xs text-white/40 text-center pt-10 border-t border-white/10 mt-10">
          {footer.copyright}
        </p>
      </div>
    </footer>
  );
}
