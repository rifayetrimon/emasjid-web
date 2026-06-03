import TemplateLayout from "@/components/TemplateLayout";
import { getActiveTemplateId } from "@/lib/getActiveTemplate";
import OrderReceivedView from "@/components/shop/OrderReceivedView";

export const dynamic = "force-dynamic";

export default async function OrderReceivedPage() {
  const templateId = await getActiveTemplateId();
  return (
    <TemplateLayout templateId={templateId} padForFixedNav>
      <main className="max-w-3xl mx-auto px-6 py-10 md:py-16">
        <OrderReceivedView />
      </main>
    </TemplateLayout>
  );
}
