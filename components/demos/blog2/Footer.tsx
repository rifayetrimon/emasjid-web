import Image from "@/components/ui/FallbackImage";
import Link from "next/link";
import { FooterProps } from "@/types/cms";
import VisitorList from "@/components/visitor/VisitorList";
import type { VisitorStats } from "@/services/visitorService";

interface FooterArticle {
  contentId: number;
  title: string;
  date: string;
  file1: string | null;
  altImg1: string;
}

interface Props extends FooterProps {
  visitors?: VisitorStats;
  popular?: FooterArticle[];
  trending?: FooterArticle[];
}

export default function Blog2Footer({
  footer,
  visitors,
  popular = [],
  trending = [],
}: Props) {
  if (!footer) return null;
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#1a1a1a] text-gray-400">
      <div className="max-w-7xl mx-auto px-6 pt-14 pb-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 pb-12 border-b border-white/10">
          {/* Editor Picks */}
          {popular.length > 0 && (
            <div>
              <h4 className="text-sm font-extrabold uppercase tracking-wider text-white mb-5 border-b border-[var(--primary)] pb-2 inline-block">
                Editor Picks
              </h4>
              <ul className="space-y-4">
                {popular.slice(0, 3).map((p) => (
                  <li key={p.contentId}>
                    <Link href={`/news/${p.contentId}`} className="flex gap-3 group">
                      <div className="relative w-14 h-14 flex-shrink-0 overflow-hidden bg-white/5">
                        {p.file1 && (
                          <Image
                            src={p.file1}
                            alt={p.altImg1 || p.title}
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs leading-snug text-white/85 group-hover:text-[var(--primary)] line-clamp-2 font-medium transition">
                          {p.title}
                        </p>
                        <p className="text-[10px] text-white/40 mt-1 uppercase tracking-wider">
                          {p.date}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Popular Posts */}
          {trending.length > 0 && (
            <div>
              <h4 className="text-sm font-extrabold uppercase tracking-wider text-white mb-5 border-b border-[var(--primary)] pb-2 inline-block">
                Popular Posts
              </h4>
              <ul className="space-y-4">
                {trending.slice(0, 3).map((p) => (
                  <li key={p.contentId}>
                    <Link href={`/news/${p.contentId}`} className="flex gap-3 group">
                      <div className="relative w-14 h-14 flex-shrink-0 overflow-hidden bg-white/5">
                        {p.file1 && (
                          <Image
                            src={p.file1}
                            alt={p.altImg1 || p.title}
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs leading-snug text-white/85 group-hover:text-[var(--primary)] line-clamp-2 font-medium transition">
                          {p.title}
                        </p>
                        <p className="text-[10px] text-white/40 mt-1 uppercase tracking-wider">
                          {p.date}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Visitor stats */}
          {visitors && (
            <div>
              <VisitorList
                stats={visitors}
                tone="dark"
                align="left"
                titleClass="text-sm font-extrabold uppercase tracking-wider text-white mb-5 border-b border-[var(--primary)] pb-2 inline-block"
              />
            </div>
          )}
        </div>

        {/* About + follow */}
        <div className="grid md:grid-cols-3 gap-10 py-10 border-b border-white/10">
          <div className="md:col-span-2 flex items-start gap-5">
            {footer.image.image && (
              <Image
                src={footer.image.image}
                alt="Logo"
                width={150}
                height={50}
                className="h-12 w-auto object-contain flex-shrink-0"
              />
            )}
            <div>
              <h5 className="text-sm font-bold uppercase tracking-wider text-white mb-2">
                About Us
              </h5>
              <p className="text-xs text-white/60 leading-relaxed mb-3 max-w-md">
                {footer.text}
              </p>
              <p className="text-xs text-white/60">
                <span className="uppercase tracking-wider text-white/40">Contact us:</span>{" "}
                <a
                  href={`mailto:${footer.email}`}
                  className="text-blue-400 hover:text-blue-300 transition"
                >
                  {footer.email}
                </a>
              </p>
            </div>
          </div>
          {footer.social_links.length > 0 && (
            <div>
              <h5 className="text-sm font-bold uppercase tracking-wider text-white mb-3">
                Follow Us
              </h5>
              <div className="flex flex-wrap gap-2">
                {footer.social_links.map((s, i) => (
                  <a
                    key={i}
                    href={s.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Social"
                    className="w-9 h-9 bg-white/5 hover:bg-[var(--primary)] flex items-center justify-center transition group"
                  >
                    <Image
                      src={s.platform}
                      alt="Social"
                      width={14}
                      height={14}
                      className="brightness-0 invert opacity-80 group-hover:brightness-0 group-hover:invert-0 transition"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/50">
          <p>{footer.copyright || `© ${year}. All Rights Reserved.`}</p>
          <a href="#contact" className="hover:text-white transition">
            Contact us
          </a>
        </div>
      </div>
    </footer>
  );
}
