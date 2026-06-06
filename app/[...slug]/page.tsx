import TemplateLayout from "@/components/TemplateLayout";
import StaticContentView from "@/components/static/StaticContentView";
import { getActiveTemplateId } from "@/lib/getActiveTemplate";
import { getStaticPathBindings, getNavData } from "@/services/navService";
import { getStaticContentBySlug } from "@/services/staticContentService";
import type { MenuItem } from "@/types/cms";

export const dynamic = "force-dynamic";

function findMenuLabel(menu: MenuItem[], target: string): string | null {
  for (const m of menu) {
    if (m.link === target) return m.label;
    if (m.submenu) {
      const nested = findMenuLabel(m.submenu, target);
      if (nested) return nested;
    }
  }
  return null;
}

export default async function DynamicSlugPage(props: {
  params: Promise<{ slug: string[] }>;
}) {
  const params = await props.params;
  const pathParts = params.slug || [];
  const path = "/" + pathParts.join("/");

  const [templateId, bindings, nav] = await Promise.all([
    getActiveTemplateId(),
    getStaticPathBindings(),
    getNavData(),
  ]);

  // If this path is bound to a static page in the nav config, render it.
  const staticId = bindings[path];
  if (staticId) {
    try {
      const item = await getStaticContentBySlug(staticId);
      console.log(
        `🖱️ [nav click] static content for "${path}" (staticId=${staticId}):`,
        JSON.stringify(item, null, 2)
      );
      if (item) {
        // The nav menu's link uses the path (e.g. /profil/sejarah-penubuhan)
        // while basePath is prepended for the browser; either form may appear
        // in the menu tree depending on how the lookup is keyed.
        const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
        const breadcrumbLabel =
          findMenuLabel(nav.menuItems, path) ||
          findMenuLabel(nav.menuItems, basePath + path) ||
          item.title;
        return (
          <StaticContentView
            templateId={templateId}
            item={item}
            breadcrumbLabel={breadcrumbLabel}
          />
        );
      }
    } catch {
      // Fall through to the no-content view.
    }
  }

  // Path doesn't match any static binding (or the bound content is missing).
  const titleSlug = pathParts[pathParts.length - 1] || "Page";
  const displayTitle = titleSlug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <TemplateLayout templateId={templateId} padForFixedNav>
      <main className="min-h-[70vh] w-full flex items-center justify-center px-6 py-20">
        <div className="text-center max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold text-[var(--secondary)] mb-6">
            {displayTitle}
          </h1>
          <div className="mt-8 inline-flex flex-col items-center gap-3">
            <svg
              className="w-12 h-12 text-[var(--text)]/30"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-base text-[var(--text)]/60">
              No content available for this page yet.
            </p>
          </div>
        </div>
      </main>
    </TemplateLayout>
  );
}
