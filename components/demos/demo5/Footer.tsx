import Image from "@/components/ui/FallbackImage";
import { FooterProps } from "@/types/cms";
import VisitorList from "@/components/visitor/VisitorList";
import type { VisitorStats } from "@/services/visitorService";

interface Props extends FooterProps {
  visitors?: VisitorStats;
}

function StarOrnament({ className = "" }: { className?: string }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 20 20"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 1 L13 7 L19 8 L14.5 12.5 L16 19 L10 16 L4 19 L5.5 12.5 L1 8 L7 7 Z"
        fill="currentColor"
      />
    </svg>
  );
}

function Divider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-4 ${className}`}>
      <div className="h-[1px] w-20 bg-[#e8d5a8]/40" />
      <StarOrnament className="text-[#e8d5a8] w-5 h-5" />
      <div className="h-[1px] w-20 bg-[#e8d5a8]/40" />
    </div>
  );
}

export default function Demo5Footer({ footer, visitors }: Props) {
  if (!footer) return null;
  return (
    <footer className="bg-[#082a29] text-[#e8d5a8] py-16 px-6 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cpath d='M20 5 L25 15 L35 17 L27 25 L29 35 L20 30 L11 35 L13 25 L5 17 L15 15 Z' fill='none' stroke='%23e8d5a8' stroke-width='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: "40px 40px",
        }}
      />
      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <Divider className="mb-6" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-12 gap-10 pb-10 border-b border-[#e8d5a8]/20 text-center md:text-left">
          <div className="lg:col-span-4">
            {footer.image.image && (
              <div className="flex md:justify-start justify-center mb-5">
                <Image
                  src={footer.image.image}
                  alt="Logo"
                  width={96}
                  height={96}
                  className="brightness-0 invert opacity-90"
                />
              </div>
            )}
            <h3
              className="text-2xl font-bold mb-3 text-[#fdfaf3]"
              style={{ fontFamily: "'Times New Roman', serif" }}
            >
              {footer.footer_title}
            </h3>
            <p className="text-sm text-[#e8d5a8]/70 leading-relaxed">
              {footer.text}
            </p>
          </div>
          <div className="lg:col-span-3">
            <h4
              className="text-sm uppercase tracking-[0.2em] font-bold mb-4 text-[#fdfaf3]"
              style={{ fontFamily: "'Times New Roman', serif" }}
            >
              Hubungi
            </h4>
            <div className="space-y-2 text-sm text-[#e8d5a8]/80">
              {footer.address && <p>{footer.address}</p>}
              {footer.phone && (
                <a
                  href={`tel:${footer.phone}`}
                  className="block hover:text-[#fdfaf3]"
                >
                  {footer.phone}
                </a>
              )}
              {footer.email && (
                <a
                  href={`mailto:${footer.email}`}
                  className="block hover:text-[#fdfaf3] break-all"
                >
                  {footer.email}
                </a>
              )}
            </div>
            <div className="mt-6">
              <h4
                className="text-sm uppercase tracking-[0.2em] font-bold mb-3 text-[#fdfaf3]"
                style={{ fontFamily: "'Times New Roman', serif" }}
              >
                Ikuti
              </h4>
              <div className="flex flex-wrap gap-2 md:justify-start justify-center">
                {footer.social_links.map((s, i) => (
                  <a
                    key={i}
                    href={s.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full border-2 border-[#e8d5a8]/30 hover:border-[#e8d5a8] hover:bg-[#e8d5a8]/10 flex items-center justify-center transition"
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
            <div className="lg:col-span-5 text-left">
              <VisitorList
                stats={visitors}
                tone="dark"
                titleClass="text-2xl font-bold uppercase tracking-wider text-[#fdfaf3] mb-4"
              />
            </div>
          )}
        </div>
        <p className="text-xs text-[#e8d5a8]/50 text-center pt-8 uppercase tracking-[0.2em]">
          {footer.copyright}
        </p>
      </div>
    </footer>
  );
}
