import { Suspense } from "react";
import TemplateLayout from "@/components/TemplateLayout";
import Banner from "@/components/main/Banner";
import Segment from "@/components/main/Segment";
import NewsList from "@/components/main/NewsList";
import Faq from "@/components/main/Faq";
import ContactUs from "@/components/main/ContactUs";
import VisitorStats from "@/components/visitor/VisitorStats";
import { getVisitorStats } from "@/services/visitorService";

function SectionLoader() {
  return (
    <div className="w-full py-8 flex justify-center">
      <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
    </div>
  );
}

export default async function Template6Classic() {
  const visitors = await getVisitorStats();

  return (
    <TemplateLayout templateId="6">
      <Suspense fallback={<SectionLoader />}>
        <Banner />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <Segment />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <NewsList />
      </Suspense>

      <VisitorStats
        stats={visitors}
        variant="light"
        eyebrow="Statistik"
        title="Pelawat Laman Web"
      />

      <Suspense fallback={<SectionLoader />}>
        <Faq />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <ContactUs />
      </Suspense>
    </TemplateLayout>
  );
}
