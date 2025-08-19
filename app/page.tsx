// app/page.tsx or pages/index.tsx (depending on your Next.js setup)

import Footer from "@/components/layouts/footer";
import Navbar from "@/components/layouts/navbar";
import Banner from "@/components/main/Banner";
import Branding from "@/components/main/Branding";
import Faq from "@/components/main/Faq";
import Features from "@/components/main/Features"; // ✅ fixed spelling
import Segment from "@/components/main/Segment";
import cmsData from "@/data/cms.json"; // your CMS JSON file
import { Content } from "@/types/cms";

export default function Home() {
  const content: Content = cmsData.content;

  return (
    <>
      {/* Navbar uses banner.menu_items */}
      <Navbar menuItems={content.banner.menu_items} />

      {/* Banner section */}
      <Banner banner={content.banner} />

      {/* Segment section */}
      <Segment segments={content.segments} />

      {/* Features section */}
      {/* ⚠️ JSON key is "fetures" but props expect "features" */}
      <Features fetures={content.fetures} />

      {/* FAQ section */}
      <Faq faq={content.faq} />

      {/* Branding section */}
      <Branding />

      {/* Footer section */}
      <Footer footer={content.footer} />
    </>
  );
}
