import FallbackError from "@/components/layouts/FallbackError";
import Footer from "@/components/layouts/footer";
import Navbar from "@/components/layouts/navbar";
import Banner from "@/components/main/Banner";
import Branding from "@/components/main/Branding";
import Faq from "@/components/main/Faq";
import Features from "@/components/main/Features";
import Segment from "@/components/main/Segment";
import { getCachedConfig } from "@/services/apiCache";

// ⭐⭐⭐ CRITICAL: Add these lines to force dynamic rendering ⭐⭐⭐
// export const dynamic = "force-dynamic";
// export const revalidate = 0;
// export const fetchCache = "force-no-store";

export default async function Home() {
  let configData;

  try {
    console.log("🔄 Page: Fetching config data for CSS vars...");

    // Fetch config data only
    configData = await getCachedConfig();

    console.log("✅ Page: Config fetched successfully");
  } catch (error) {
    console.error("❌ Page Error: Failed to fetch base config data", error);
    // DO NOT return FallbackError here, as it crashes the entire page
    // Instead, provide generic fallback so individual components can try to load
    configData = {};
  }

  // Apply CSS variables dynamically
  const cssVars = {
    "--primary": configData.primaryColor || "#78C841",
    "--secondary": configData.secondaryColor || "#154D71",
    "--text": configData.textColor || "#00FF00",
  } as React.CSSProperties;

  return (
    <div style={cssVars}>
      {/* Navbar */}
      <Navbar />

      {/* Banner */}
      <Banner />

      {/* Segment */}
      <Segment />

      {/* Features */}
      <Features />

      {/* FAQ */}
      <Faq />

      {/* Branding */}
      <Branding />

      {/* Footer */}
      <Footer />
    </div>
  );
}
