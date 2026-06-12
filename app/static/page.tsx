"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import StaticContentView from "@/components/static/StaticContentView";
import TemplateLayout from "@/components/TemplateLayout";
import { getActiveTemplateId } from "@/lib/getActiveTemplate";
import { getStaticContentBySlug } from "@/services/staticContentService";
import { getNavData } from "@/services/navService";
import { useCmsData } from "@/lib/useCmsData";
import { withBasePath } from "@/lib/withBasePath";
import type { MenuItem } from "@/types/cms";

function findMenuLabel(
  menu: MenuItem[],
  candidates: string[],
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

function StaticContentInner() {
  const sp = useSearchParams();
  // Prefer the live URL query (reliable in a static export); fall back to
  // useSearchParams. Using both keeps the effect dep stable across nav.
  const spSlug = sp.get("slug") || "";

  const { data, loading } = useCmsData(
    async () => {
      const urlSlug =
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search).get("slug") || ""
          : "";
      const slug = urlSlug || spSlug;
      const [templateId, item, nav] = await Promise.all([
        getActiveTemplateId(),
        slug ? getStaticContentBySlug(slug) : Promise.resolve(null),
        getNavData(),
      ]);
      return { templateId, item, nav, slug };
    },
    [spSlug],
  );

  if (loading || !data) return <div className="min-h-screen bg-white" />;

  const { templateId, item, nav, slug } = data;

  if (!item) {
    return (
      <TemplateLayout templateId={templateId} padForFixedNav>
        <main className="min-h-[70vh] w-full flex items-center justify-center px-6 py-20">
          <div className="text-center max-w-xl">
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--secondary)] mb-4">
              Halaman tidak dijumpai
            </h1>
            <p className="text-[var(--text)]/60">
              Kandungan ini tiada atau telah dialihkan.
            </p>
          </div>
        </main>
      </TemplateLayout>
    );
  }

  const candidates = [
    `/static/?slug=${slug}`,
    `/static/?slug=${item.staticId}`,
    withBasePath(`/static/?slug=${slug}`),
    withBasePath(`/static/?slug=${item.staticId}`),
  ];
  const breadcrumbLabel =
    findMenuLabel(nav.menuItems, candidates) || item.title;

  return (
    <StaticContentView
      templateId={templateId}
      item={item}
      breadcrumbLabel={breadcrumbLabel}
    />
  );
}

export default function StaticContentPage() {
  // useSearchParams must be under a Suspense boundary for static export.
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <StaticContentInner />
    </Suspense>
  );
}
