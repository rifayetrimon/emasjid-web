import Link from "next/link";
import MediaLayout from "@/components/news/MediaLayout";
import TemplateLayout, { type TemplateId } from "@/components/TemplateLayout";
import PluginLinks from "@/components/common/PluginLinks";
import type { NewsImage, NewsPosDisplay, NavSocialLink } from "@/types/cms";

export interface StaticContentItem {
  staticId: number | string;
  title: string;
  message: string;
  date?: string;
  hits: number;
  images: NewsImage[];
  posDisplay: NewsPosDisplay;
  urlIframe?: string;
}

interface Props {
  templateId: TemplateId;
  item: StaticContentItem;
  breadcrumbLabel: string;
  /** Addon-plugin links (same as header/footer) — rendered on the page too. */
  socialLinks?: NavSocialLink[];
}

export default function StaticContentView({
  templateId,
  item,
  breadcrumbLabel,
  socialLinks = [],
}: Props) {
  const formattedDate = item.date
    ? new Date(item.date).toLocaleDateString("ms-MY", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <TemplateLayout templateId={templateId} padForFixedNav>
      <main className="min-h-screen">
        <article className="max-w-5xl mx-auto px-6 py-10 text-[var(--text)]">
          <nav className="flex items-center gap-2 text-xs text-[var(--text)]/60 mb-4">
            <Link href="/" className="hover:text-[var(--primary)] transition">
              Utama
            </Link>
            <span>›</span>
            <span className="text-[var(--text)]/80 line-clamp-1">
              {breadcrumbLabel}
            </span>
          </nav>

          {item.title && (
            <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-3">
              {item.title}
            </h1>
          )}

          {formattedDate && (
            <p className="text-sm mb-8 pb-6 border-b border-[var(--text)]/15">
              <span className="inline-flex items-center gap-1.5 text-[var(--primary)] font-semibold">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {formattedDate}
              </span>
              {item.hits > 0 && (
                <span className="ml-3 text-[var(--text)]/60">
                  · {item.hits} dilihat
                </span>
              )}
            </p>
          )}

          {/* Tenant plugin/social links — same set as the header/footer */}
          <PluginLinks links={socialLinks} className="mb-8" />

          {item.images.length > 0 && (
            <div className="mb-8">
              <MediaLayout
                images={item.images}
                mode={item.posDisplay}
                aspect="aspect-[16/9]"
                sizes="(max-width: 768px) 100vw, 800px"
              />
            </div>
          )}

          {item.message && (
            <div
              className="prose prose-lg max-w-none leading-relaxed
                         text-[var(--text)]
                         prose-headings:font-bold prose-headings:text-[var(--text)]
                         prose-p:text-[var(--text)] prose-li:text-[var(--text)]
                         prose-strong:text-[var(--text)]
                         prose-a:text-[var(--primary)]
                         prose-img:rounded-lg"
              dangerouslySetInnerHTML={{ __html: item.message }}
            />
          )}

          {item.urlIframe && item.urlIframe.startsWith("http") && (
            <div className="mt-10">
              <iframe
                src={item.urlIframe}
                className="w-full h-[400px] md:h-[500px] rounded-xl border border-black/10"
                allowFullScreen
              />
            </div>
          )}
        </article>
      </main>
    </TemplateLayout>
  );
}
