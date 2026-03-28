import { Suspense } from "react";
import Footer from "@/components/layouts/footer";
import Navbar from "@/components/layouts/navbar";
import Banner from "@/components/main/Banner";
import Branding from "@/components/main/Branding";
import Faq from "@/components/main/Faq";
import Features from "@/components/main/Features";
import Segment from "@/components/main/Segment";
import NewsList from "@/components/main/NewsList";
import ContactUs from "@/components/main/ContactUs";
import { getCachedConfig } from "@/services/apiCache";

// Force dynamic rendering so CMS changes reflect immediately without rebuild
export const dynamic = "force-dynamic";

function SectionLoader() {
  return (
    <div className="w-full py-8 flex justify-center">
      <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
    </div>
  );
}

export default async function Home() {
  let configData;

  try {
    configData = await getCachedConfig();
  } catch (error) {
    console.error("❌ Page Error: Failed to fetch base config data", error);
    configData = {};
  }

  // Apply CSS variables dynamically from nested generalSettings
  const general = configData.generalSettings || {};
  const cssVars = {
    "--primary": general.primaryColor || "#78C841",
    "--secondary": general.secondaryColor || "#154D71",
    "--text": general.textColor || "#00FF00",
  } as React.CSSProperties;

  return (
    <div style={cssVars}>
      <Suspense fallback={<SectionLoader />}>
        <Navbar />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <Banner />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <Segment />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <NewsList />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <Features />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <Faq />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <ContactUs />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <Branding />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <Footer />
      </Suspense>
    </div>
  );
}
