import TemplateLayout from "@/components/TemplateLayout";
import { getActiveTemplateId } from "@/lib/getActiveTemplate";
import { getInstitutions } from "@/services/donateService";
import DonateGrid from "@/components/donate/DonateGrid";
import { HandHeart, ShieldCheck, Receipt } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DonatePage() {
  const [templateId, institutions] = await Promise.all([
    getActiveTemplateId(),
    getInstitutions(),
  ]);

  return (
    <TemplateLayout templateId={templateId} padForFixedNav>
      <div className="bg-gradient-to-b from-emerald-50/40 via-white to-white">
        <main className="max-w-7xl mx-auto px-6 py-12 md:py-16 pb-32 lg:pb-16">
          {/* Page header */}
          <header className="mb-10 md:mb-14 text-center md:text-left">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-bold uppercase tracking-wider mb-4">
              <HandHeart className="w-3.5 h-3.5" />
              Sumbangan
            </span>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 mb-3">
                  Beri Sumbangan
                </h1>
                <p className="text-base md:text-lg text-gray-500 max-w-xl">
                  Pilih institusi, tetapkan jumlah, dan sahkan sumbangan
                  dalam satu halaman. Anda boleh menyumbang kepada beberapa
                  institusi sekaligus.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Selamat &amp; peribadi</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Receipt className="w-4 h-4 text-[var(--primary)]" />
                  <span>Resit akan dihantar</span>
                </div>
                <span className="tabular-nums">
                  · {institutions.length} institusi tersedia
                </span>
              </div>
            </div>
          </header>

          <DonateGrid institutions={institutions} />
        </main>
      </div>
    </TemplateLayout>
  );
}
