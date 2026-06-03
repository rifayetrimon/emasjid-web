import { notFound } from "next/navigation";
import StaticContentView from "@/components/static/StaticContentView";
import { getActiveTemplateId } from "@/lib/getActiveTemplate";
import { getStaticContentBySlug } from "@/services/staticContentService";
import { getNavData } from "@/services/navService";
import type { MenuItem } from "@/types/cms";

function findMenuLabel(
  menu: MenuItem[],
  candidates: string[]
): string | null {
  for (const m of menu) {
    if (candidates.includes(m.link)) return m.label;
    if (m.submenu) {
      const nested = findMenuLabel(m.submenu, candidates);
      if (nested) return nested;
    }
  }
  return null;
}

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const item = await getStaticContentBySlug(slug);
  return {
    title: item?.title || "Halaman",
  };
}

export default async function StaticContentPage({ params }: PageProps) {
  const { slug } = await params;
  const [templateId, item, nav] = await Promise.all([
    getActiveTemplateId(),
    getStaticContentBySlug(slug),
    getNavData(),
  ]);

  if (!item) notFound();

  const breadcrumbLabel =
    findMenuLabel(nav.menuItems, [
      `/static/${slug}`,
      `/static/${item.staticId}`,
    ]) || item.title;

  return (
    <StaticContentView
      templateId={templateId}
      item={item}
      breadcrumbLabel={breadcrumbLabel}
    />
  );
}
