"use client";

import TemplateLayout from "@/components/TemplateLayout";
import { getActiveTemplateId } from "@/lib/getActiveTemplate";
import { getShopGroups } from "@/services/shopService";
import { getCachedConfig } from "@/services/apiCache";
import { useCmsData } from "@/lib/useCmsData";
import { getImageUrl } from "@/services/utils";
import ShopGrid from "@/components/shop/ShopGrid";

export default function ShopPage() {
  const { data, loading } = useCmsData(async () => {
    const [templateId, groups, config] = await Promise.all([
      getActiveTemplateId(),
      getShopGroups(),
      getCachedConfig(),
    ]);
    return { templateId, groups, config };
  }, []);

  if (loading || !data) return <div className="min-h-screen bg-white" />;

  const { templateId, groups, config } = data;

  const ownerEmail = config?.footerConfig?.email || "";
  const general = config?.generalSettings || {};
  const logoUrl = getImageUrl(
    (config?.logoCMS as string) || (general.logoCMS as string)
  );
  const tenantTitle =
    (general.title as string) || (config?.title as string) || "Kedai";

  return (
    <TemplateLayout templateId={templateId} padForFixedNav>
      <div className="relative isolate overflow-hidden bg-gray-950 text-gray-100">
        {/* Subtle brand-tinted glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -right-20 w-[520px] h-[520px] rounded-full bg-[var(--primary)]/15 blur-[120px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-[50%] -left-40 w-[420px] h-[420px] rounded-full bg-[var(--primary)]/8 blur-[120px]"
        />

        <main className="relative max-w-7xl mx-auto px-6 py-10 md:py-14 pb-24">
          <ShopGrid
            groups={groups}
            ownerEmail={ownerEmail}
            logoUrl={logoUrl}
            tenantTitle={tenantTitle}
          />
        </main>
      </div>
    </TemplateLayout>
  );
}
