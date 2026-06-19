import type { Metadata } from "next";
import NewsArticleView from "@/components/news/NewsArticleView";
import { getAllNewsIdsServer, getNewsOgServer } from "@/lib/serverNews";

// Pre-render one HTML file per article at build time so each carries its own
// Open Graph tags — required for rich Facebook/WhatsApp share cards (their
// crawlers read the static HTML and never run JavaScript). Data is fetched
// server-side at build via the disk-loaded tenant config (see lib/serverNews).
export async function generateStaticParams() {
  const ids = await getAllNewsIdsServer();
  return ids.map((id) => ({ id }));
}

function clamp(s: string, max = 200): string {
  return s.length > max ? `${s.slice(0, max - 1)}…` : s;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const og = await getNewsOgServer(id);
  if (!og) return { title: "Berita" };

  const description = clamp(og.description);
  return {
    title: og.title,
    description,
    openGraph: {
      title: og.title,
      description,
      type: "article",
      ...(og.image ? { images: [{ url: og.image }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: og.title,
      description,
      ...(og.image ? { images: [og.image] } : {}),
    },
  };
}

export default async function NewsArticleByIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <NewsArticleView id={id} />;
}
