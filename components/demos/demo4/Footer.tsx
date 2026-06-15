import Image from "@/components/ui/FallbackImage";
import { FooterProps } from "@/types/cms";
import VisitorList from "@/components/visitor/VisitorList";
import type { VisitorStats } from "@/services/visitorService";

interface Props extends FooterProps {
  visitors?: VisitorStats;
}

export default function Demo4Footer({ footer, visitors }: Props) {
  if (!footer) return null;
  const year = new Date().getFullYear();
  const extraColumns = (footer.columns || []).slice(1);
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-[1400px] mx-auto px-6 py-14">
        <div className="grid md:grid-cols-2 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
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
            {footer.text && (
              <div
                className="text-sm text-white/60 leading-relaxed max-w-md"
                dangerouslySetInnerHTML={{ __html: footer.text }}
              />
            )}
          </div>
          <div className="lg:col-span-3">
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
            <div className="mt-6">
              <h4 className="text-xs uppercase tracking-wider font-bold text-white/40 mb-3">
                Sosial Media
              </h4>
              <div className="flex flex-wrap gap-2">
                {footer.social_links.map((s, i) => (
                  <a
                    key={i}
                    href={s.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/15 flex items-center justify-center transition"
                  >
                    <Image
                      src={s.platform}
                      alt="Social"
                      width={14}
                      height={14}
                      className="brightness-0 invert"
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {visitors && (
            <div className="lg:col-span-5">
              <VisitorList stats={visitors} tone="dark" />
            </div>
          )}
        </div>
        {extraColumns.length > 0 && (
          <div className="grid sm:grid-cols-2 gap-8 pt-10 mt-10 border-t border-white/10">
            {extraColumns.map((col, i) => (
              <div key={i}>
                <h4 className="text-xs uppercase tracking-wider font-bold text-white/40 mb-4">
                  {col.title}
                </h4>
                {col.content && (
                  <div
                    className="text-sm text-white/60 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: col.content }}
                  />
                )}
              </div>
            ))}
          </div>
        )}
        <div className="mt-10 pt-6 border-t border-white/10 text-center">
          <p className="text-xs text-white/40">
            {footer.copyright || `© ${year}. All Rights Reserved.`}
          </p>
        </div>
      </div>
    </footer>
  );
}
