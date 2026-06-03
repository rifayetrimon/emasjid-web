import TemplateLayout from "@/components/TemplateLayout";
import { getActiveTemplateId } from "@/lib/getActiveTemplate";
import CartView from "@/components/shop/CartView";

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const templateId = await getActiveTemplateId();
  return (
    <TemplateLayout templateId={templateId} padForFixedNav>
      <main className="max-w-7xl mx-auto px-6 py-10 md:py-16">
        <CartView />
      </main>
    </TemplateLayout>
  );
}
