// app/page.tsx
import Footer from "@/components/layouts/footer";
import Navbar from "@/components/layouts/navbar";
import Banner from "@/components/main/Banner";
import Branding from "@/components/main/Branding";
import Faq from "@/components/main/Faq";
import Features from "@/components/main/Features";
import Segment from "@/components/main/Segment";
import configService from "@/services/configService";
import { CMSData } from "@/types/cms";

export default async function Home() {
  let cmsData: CMSData;

  try {
    // Fetch data from API
    cmsData = await configService();
  } catch (error) {
    console.error("Failed to load configuration:", error);

    // Fallback UI in case of error
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8">
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            Ralat Memuatkan Halaman
          </h1>
          <p className="text-gray-600 mb-6">
            Tidak dapat mengambil data konfigurasi. Sila cuba sebentar lagi.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Cuba Semula
          </button>
        </div>
      </div>
    );
  }

  const { base_settings, content } = cmsData;

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
