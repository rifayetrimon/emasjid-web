// app/page.tsx or pages/index.tsx

import Footer from "@/components/layouts/footer";
import Navbar from "@/components/layouts/navbar";
import Banner from "@/components/main/Banner";
import Branding from "@/components/main/Branding";
import Faq from "@/components/main/Faq";
import Features from "@/components/main/Features";
import Segment from "@/components/main/Segment";
import cmsData from "@/data/cms.json";
import { Content } from "@/types/cms";

export default function Home() {
  const content: Content = cmsData.content;

  return (
    <>
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
    </>
  );
}
