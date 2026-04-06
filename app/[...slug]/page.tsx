import { Suspense } from "react";
import Navbar from "@/components/layouts/navbar";
import Footer from "@/components/layouts/footer";
import { getCachedConfig } from "@/services/apiCache";

// Force dynamic rendering
export const dynamic = "force-dynamic";

function SectionLoader() {
  return (
    <div className="w-full py-8 flex justify-center">
      <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
    </div>
  );
}

export default async function DynamicSlugPage(props: {
  params: Promise<{ slug: string[] }>;
}) {
  let configData;
  try {
    configData = await getCachedConfig();
  } catch (error) {
    console.error("❌ Page Error: Failed to fetch base config data", error);
    configData = {};
  }

  const params = await props.params;
  const pathParts = params.slug || [];
  const titleSlug = pathParts[pathParts.length - 1] || "Page";

  const displayTitle = titleSlug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  const general = configData?.generalSettings || {};
  const cssVars = {
    "--primary": general.primaryColor || "#78C841",
    "--secondary": general.secondaryColor || "#154D71",
    "--text": general.textColor || "#00FF00",
  } as React.CSSProperties;

  return (
    <div style={cssVars} className="min-h-screen flex flex-col bg-white">
      <Suspense fallback={<SectionLoader />}>
        <Navbar />
      </Suspense>

      <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-20 flex flex-col items-center flex-start mt-10">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--secondary)] mb-6">
            {displayTitle}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Content for <strong>/{pathParts.join("/")}</strong> is currently being set up.
            Please check back later or use the navigation menu to explore other resources.
          </p>
        </div>
      </main>

      <Suspense fallback={<SectionLoader />}>
        <Footer />
      </Suspense>
    </div>
  );
}
