import Footer from "@/components/layouts/footer";
import Navbar from "@/components/layouts/navbar";
import Banner from "@/components/main/Banner";
import Faq from "@/components/main/Faq";
import Fetures from "@/components/main/Fetures";
import Segment from "@/components/main/Segment";

export default function Home() {
  return (
    <>
      <Navbar />
      <Banner />
      <Segment />
      <Fetures />
      <Faq />
      <Footer />
    </>
  );
}
