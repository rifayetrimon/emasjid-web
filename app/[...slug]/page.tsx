import TemplateLayout from "@/components/TemplateLayout";
import { getActiveTemplateId } from "@/lib/getActiveTemplate";

export const dynamic = "force-dynamic";

export default async function DynamicSlugPage(props: {
  params: Promise<{ slug: string[] }>;
}) {
  const params = await props.params;
  const pathParts = params.slug || [];
  const titleSlug = pathParts[pathParts.length - 1] || "Page";

  const displayTitle = titleSlug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  const templateId = await getActiveTemplateId();

  return (
    <TemplateLayout templateId={templateId} padForFixedNav>
      <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-20 flex flex-col items-center mt-10">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--secondary)] mb-6">
            {displayTitle}
          </h1>
          <p className="text-lg max-w-2xl mx-auto opacity-70">
            Content for <strong>/{pathParts.join("/")}</strong> is currently
            being set up. Please check back later or use the navigation menu to
            explore other resources.
          </p>
        </div>
      </main>
    </TemplateLayout>
  );
}
