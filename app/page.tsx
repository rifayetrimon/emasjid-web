import Footer from "@/components/layouts/footer";
import Navbar from "@/components/layouts/navbar";
import Banner from "@/components/main/Banner";
import Branding from "@/components/main/Branding";
import Faq from "@/components/main/Faq";
import Features from "@/components/main/Features";
import Segment from "@/components/main/Segment";
import configService from "@/services/configService";
import { CMSData } from "@/types/cms";
import { notFound } from "next/navigation";

// ⭐⭐⭐ CRITICAL: Add these lines to force dynamic rendering ⭐⭐⭐
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function Home() {
  let cmsData: CMSData;

  try {
    console.log("🔄 Page: Fetching data from external API...");

    // Fetch data from API
    cmsData = await configService();

    console.log("✅ Page: Data fetched successfully");
  } catch (error) {
    console.error("❌ Page Error: Failed to fetch CMS data", error);
    notFound();
  }

  const { base_settings, content } = cmsData || {};

  // Apply CSS variables dynamically
  const cssVars = {
    "--primary": base_settings.primary_color,
    "--secondary": base_settings.secondary_color,
    "--text": base_settings.text_color,
  } as React.CSSProperties;

  return (
    <div style={cssVars}>
      {/* Navbar */}
      <Navbar menuItems={content.banner.menu_items} />

      {/* Banner */}
      <Banner banner={content.banner} />

      {/* Segment */}
      <Segment segments={content.segments} />

      {/* Features */}
      <Features fetures={content.fetures} />

      {/* FAQ */}
      <Faq faq={content.faq} />

      {/* Branding */}
      <Branding branding={content.branding} />

      {/* Footer */}
      <Footer footer={content.footer} />
    </div>
  );
}
