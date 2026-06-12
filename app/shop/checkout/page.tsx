"use client";

import TemplateLayout from "@/components/TemplateLayout";
import { getActiveTemplateId } from "@/lib/getActiveTemplate";
import { useCmsData } from "@/lib/useCmsData";
import CheckoutForm from "@/components/shop/CheckoutForm";

export default function CheckoutPage() {
  const { data: templateId, loading } = useCmsData(
    () => getActiveTemplateId(),
    [],
  );
  if (loading || !templateId) return <div className="min-h-screen bg-white" />;
  return (
    <TemplateLayout templateId={templateId} padForFixedNav>
      <main className="max-w-7xl mx-auto px-6 py-10 md:py-16">
        <CheckoutForm />
      </main>
    </TemplateLayout>
  );
}
