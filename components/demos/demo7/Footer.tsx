import Image from "@/components/ui/FallbackImage";
import { FooterProps } from "@/types/cms";

export default function Demo7Footer({ footer }: FooterProps) {
  if (!footer) return null;
  return (
    <footer className="relative pt-16 pb-8 px-6 overflow-hidden bg-gradient-to-br from-rose-50 to-amber-50">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-12 gap-8 pb-10 border-b border-rose-100">
          <div className="md:col-span-5">
            {footer.image.image && (
              <Image
                src={footer.image.image}
                alt="Logo"
                width={96}
                height={96}
                className="mb-5"
              />
            )}
            <h3 className="text-2xl font-bold tracking-tight text-gray-900 mb-3">
              {footer.footer_title}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed max-w-md">
              {footer.text}
            </p>
          </div>
          <div className="md:col-span-3">
            <h4 className="text-xs uppercase tracking-wider font-bold text-gray-500 mb-4">
              Hubungi
            </h4>
            <div className="space-y-2 text-sm text-gray-700">
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
            <h4 className="text-xs uppercase tracking-wider font-bold text-gray-500 mb-4">
              Sosial
            </h4>
            <div className="flex flex-wrap gap-2">
              {footer.social_links.map((s, i) => (
                <a
                  key={i}
                  href={s.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-10 h-10 rounded-full bg-white shadow-sm border border-[var(--primary)]/20 hover:bg-[var(--primary)]/5 hover:border-[var(--primary)]/50 flex items-center justify-center transition-all"
                >
                  <Image
                    src={s.platform}
                    alt="Social"
                    width={16}
                    height={16}
                    className="brightness-0 opacity-60 group-hover:opacity-100 transition-opacity"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500 text-center pt-6">
          {footer.copyright}
        </p>
      </div>
    </footer>
  );
}
