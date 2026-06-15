import Image from "@/components/ui/FallbackImage";
import { FooterProps } from "@/types/cms";
import VisitorList from "@/components/visitor/VisitorList";
import type { VisitorStats } from "@/services/visitorService";

interface Props extends FooterProps {
  visitors?: VisitorStats;
}

export default function Demo2Footer({ footer, visitors }: Props) {
  if (!footer) return null;
  const year = new Date().getFullYear();
  const extraColumns = (footer.columns || []).slice(1);
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          <div className="lg:col-span-4">
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
            {footer.text && (
              <div
                className="text-sm text-gray-400 leading-relaxed max-w-md"
                dangerouslySetInnerHTML={{ __html: footer.text }}
              />
            )}
          </div>

          <div className="lg:col-span-3">
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
            <div className="mt-6">
              <h4 className="text-base uppercase tracking-[0.15em] font-bold mb-3 text-[var(--secondary)]">
                Ikuti Kami
              </h4>
              <div className="flex flex-wrap gap-2">
                {footer.social_links.map((s, i) => (
                  <a
                    key={i}
                    href={s.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 flex items-center justify-center border border-white/20 hover:bg-white/10 transition-colors"
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

          {visitors && (
            <div className="lg:col-span-5">
              <VisitorList
                stats={visitors}
                tone="dark"
                titleClass="text-2xl font-bold uppercase tracking-[0.15em] text-white mb-4"
              />
            </div>
          )}
        </div>
        {extraColumns.length > 0 && (
          <div className="grid sm:grid-cols-2 gap-8 pt-10 mt-10 border-t border-white/10">
            {extraColumns.map((col, i) => (
              <div key={i}>
                <h4 className="text-base uppercase tracking-[0.15em] font-bold mb-4 text-[var(--secondary)]">
                  {col.title}
                </h4>
                {col.content && (
                  <div
                    className="text-sm text-gray-400 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: col.content }}
                  />
                )}
              </div>
            ))}
          </div>
        )}
        <div className="mt-10 pt-6 border-t border-white/10 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-wider">
            {footer.copyright || `© ${year}. All Rights Reserved.`}
          </p>
        </div>
      </div>
    </footer>
  );
}
