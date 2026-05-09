import Image from "@/components/ui/FallbackImage";
import { FooterProps } from "@/types/cms";

export default function Demo8Footer({ footer }: FooterProps) {
  if (!footer) return null;
  return (
    <footer className="bg-black border-t border-white/5 py-14 px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid md:grid-cols-12 gap-10 pb-10 border-b border-white/10">
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
            <h3 className="text-xl font-bold mb-3 text-white">
              {footer.footer_title}
            </h3>
            <p className="text-sm text-white/50 leading-relaxed max-w-md">
              {footer.text}
            </p>
          </div>
          <div className="md:col-span-3">
            <h4 className="text-xs uppercase tracking-[0.25em] font-bold text-[var(--primary)] mb-4">
              Hubungi
            </h4>
            <div className="space-y-2 text-sm text-white/70">
              {footer.address && <p>{footer.address}</p>}
              {footer.phone && (
                <a href={`tel:${footer.phone}`} className="block hover:text-[var(--primary)]">
                  {footer.phone}
                </a>
              )}
              {footer.email && (
                <a
                  href={`mailto:${footer.email}`}
                  className="block hover:text-[var(--primary)] break-all"
                >
                  {footer.email}
                </a>
              )}
            </div>
          </div>
          <div className="md:col-span-4">
            <h4 className="text-xs uppercase tracking-[0.25em] font-bold text-[var(--primary)] mb-4">
              Sosial
            </h4>
            <div className="flex flex-wrap gap-2">
              {footer.social_links.map((s, i) => (
                <a
                  key={i}
                  href={s.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-white/15 hover:border-[var(--primary)] hover:bg-[var(--primary)]/10 flex items-center justify-center transition"
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
        <p className="text-xs text-white/40 text-center pt-8">
          {footer.copyright}
        </p>
      </div>
    </footer>
  );
}
