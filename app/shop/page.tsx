import TemplateLayout from "@/components/TemplateLayout";
import { getActiveTemplateId } from "@/lib/getActiveTemplate";
import { getShopItems } from "@/services/shopService";
import { getCachedConfig } from "@/services/apiCache";
import ShopGrid from "@/components/shop/ShopGrid";
import { ShoppingBag } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const [templateId, items, config] = await Promise.all([
    getActiveTemplateId(),
    getShopItems(),
    getCachedConfig(),
  ]);

  const ownerEmail = config?.footerConfig?.email || "";

  return (
    <TemplateLayout templateId={templateId} padForFixedNav>
      <main className="max-w-7xl mx-auto px-6 py-12 md:py-16 pb-32 lg:pb-16">
        {/* Page header */}
        <header className="mb-10 md:mb-12 text-center md:text-left">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-bold uppercase tracking-wider mb-4">
            <ShoppingBag className="w-3.5 h-3.5" />
            E-Shop
          </span>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2">
                Kedai
              </h1>
              <p className="text-base opacity-70 max-w-xl">
                Pilih item, tambah ke pesanan dan hantar terus kepada
                pentadbir.
              </p>
            </div>
            <span className="text-sm opacity-60 tabular-nums">
              {items.length} item{items.length === 1 ? "" : "s"} tersedia
            </span>
          </div>
        </header>

        <ShopGrid items={items} ownerEmail={ownerEmail} />

        {ownerEmail && (
          <p className="mt-12 text-center text-sm opacity-60">
            Untuk pertanyaan lanjut, hubungi{" "}
            <a
              href={`mailto:${ownerEmail}`}
              className="text-[var(--primary)] hover:underline font-medium"
            >
              {ownerEmail}
            </a>
          </p>
        )}
      </main>
    </TemplateLayout>
  );
}
