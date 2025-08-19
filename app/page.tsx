import Footer from "@/components/layouts/footer";
import Navbar from "@/components/layouts/navbar";
import Banner from "@/components/main/Banner";
import Faq from "@/components/main/Faq";
import Fetures from "@/components/main/Features";
import Segment from "@/components/main/Segment";
import cmsData from "@/data/cms.json"; // your file

export default function Home() {
  const content = cmsData.content;

  return (
    <>
      {/* Navbar can use banner.menu_items */}
      <Navbar menuItems={content.banner.menu_items} />

      {/* Banner section */}
      <Banner banner={content.banner} />

      {/* Segment section */}
      <Segment segments={content.segments} />

      {/* Features section */}
      <Fetures fetures={content.fetures} />

      {/* FAQ section */}
      <Faq faq={content.faq} />

      {/* Footer section */}
      <Footer footer={content.footer} />
    </>
  );
}
